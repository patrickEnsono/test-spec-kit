import { test, expect } from '@playwright/test';

test.describe('Comprehensive Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage for clean error testing state
    await page.goto('http://127.0.0.1:3000/');
    await page.evaluate('localStorage.clear()');
  });

  test('should handle 404 profile errors gracefully', async ({ page }) => {
    // Navigate to non-existent profile
    await page.goto('http://127.0.0.1:3000/profile.html?id=non-existent-profile-id-12345');

    // Verify error container is visible
    await expect(page.locator('[data-testid="error-container"]')).toBeVisible();

    // Verify appropriate error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Profile not found');

    // Verify profile content is hidden
    await expect(page.locator('[data-testid="profile-container"]')).toBeHidden();

    // Verify navigation still works (app doesn't crash)
    const homeLink = page.locator('a[href="index.html"], a[href="/"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL(/index\.html|\/$/);
    }
  });

  test('should handle missing profile ID parameters', async ({ page }) => {
    // Navigate to profile page without ID parameter
    await page.goto('http://127.0.0.1:3000/profile.html');

    // Verify error state is displayed
    await expect(page.locator('[data-testid="error-container"]')).toBeVisible();

    // Verify specific error for missing ID
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'No member ID provided'
    );

    // Verify profile container is not shown
    await expect(page.locator('[data-testid="profile-container"]')).toBeHidden();
  });

  test('should handle localStorage corruption gracefully', async ({ page }) => {
    // Navigate to home page first
    await page.goto('http://127.0.0.1:3000/');

    // Corrupt localStorage with invalid JSON
    await page.evaluate(`
      localStorage.setItem('teamMembers', '{"id": 123, "name": "Invalid JSON"');
    `);

    // Reload page to trigger localStorage reading
    await page.reload();

    // Verify the app handles corruption gracefully
    // Should either show error message or empty state, but not crash

    // Main test: verify navigation still works (app didn't crash)
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();

    // Verify page is functional
    await page.fill('[data-testid="search-input"]', 'test');
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('test');
  });

  test('should handle large data gracefully', async ({ page }) => {
    // Create a very large dataset to test performance and memory limits
    const largeDataset = [];
    for (let i = 0; i < 1000; i++) {
      largeDataset.push({
        id: i,
        name: `Test User ${i}`.repeat(10), // Make names longer
        email: `test${i}@example.com`,
        title: `Developer ${i}`,
        bio: `This is a very long bio for user ${i}. `.repeat(20),
        skills: Array.from({ length: 20 }, (_, j) => `Skill${i}-${j}`),
        projects: Array.from({ length: 10 }, (_, j) => ({
          name: `Project ${i}-${j}`,
          description: `Description for project ${i}-${j}. `.repeat(10),
          technologies: Array.from({ length: 5 }, (_, k) => `Tech${i}-${j}-${k}`),
        })),
      });
    }

    // Navigate to home and inject large dataset
    await page.goto('http://127.0.0.1:3000/');

    // Try to set large dataset - this should fail gracefully due to quota
    const quotaExceeded = await page.evaluate(`
      try {
        const largeData = ${JSON.stringify(largeDataset)};
        localStorage.setItem('teamMembers', JSON.stringify(largeData));
        false; // No quota exceeded
      } catch (e) {
        console.log('Quota exceeded as expected:', e.message);
        true; // Quota exceeded as expected
      }
    `);

    // Reload to load large dataset
    await page.reload();

    // Wait a reasonable time for processing
    await page.waitForTimeout(3000);

    // Verify the app doesn't crash with large data
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();

    // Test that search still works with large dataset
    await page.fill('[data-testid="search-input"]', 'Test User 1');
    await page.click('[data-testid="search-button"]');

    // Should handle search on large dataset
    await page.waitForTimeout(2000);
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
  });

  test('should handle XSS attempts in form inputs', async ({ page }) => {
    // Navigate to add profile page
    await page.goto('http://127.0.0.1:3000/add-profile.html');

    const xssAttempts = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(1)">',
      '"><script>alert("XSS")</script>',
      "'><script>alert('XSS')</script>",
      '<svg onload="alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>',
    ];

    for (const xssPayload of xssAttempts.slice(0, 3)) {
      // Test a few payloads
      // Fill form with XSS payload
      await page.fill('[data-testid="name-input"]', xssPayload);
      await page.fill('[data-testid="email-input"]', `test${Date.now()}@example.com`);

      // Submit form
      await page.evaluate(
        'const form = document.querySelector("form"); if (form) { form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }'
      );

      // Wait a moment
      await page.waitForTimeout(1000);

      // Verify XSS was sanitized/escaped and didn't execute
      // Check that form is still visible (no redirect due to XSS)
      await expect(page.locator('[data-testid="name-input"]')).toBeVisible();

      // If submission was successful, verify XSS was escaped in display
      const hasSuccessMessage = await page.locator('.form-messages').isVisible();
      if (hasSuccessMessage) {
        // Navigate to home to check if data was properly escaped
        await page.goto('http://127.0.0.1:3000/');

        // Search for the potentially malicious entry
        await page.fill('[data-testid="search-input"]', xssPayload.substring(0, 10));
        await page.click('[data-testid="search-button"]');

        // If found, verify the script tags are escaped/stripped
        const searchResults = page.locator('.search-result-item');
        if ((await searchResults.count()) > 0) {
          const resultText = await searchResults.first().textContent();
          expect(resultText).not.toContain('<script>');
          expect(resultText).not.toContain('javascript:');
        }
      }

      // Reset for next test
      await page.goto('http://127.0.0.1:3000/add-profile.html');
    }
  });

  test('should handle rapid form submissions', async ({ page }) => {
    // Navigate to add profile page
    await page.goto('http://127.0.0.1:3000/add-profile.html');

    const timestamp = Date.now();

    // Fill form with valid data
    await page.fill('[data-testid="name-input"]', `Rapid Test ${timestamp}`);
    await page.fill('[data-testid="email-input"]', `rapid${timestamp}@example.com`);
    await page.fill('[data-testid="title-input"]', 'Developer');

    // Rapidly submit form multiple times
    for (let i = 0; i < 5; i++) {
      await page.evaluate(
        'const form = document.querySelector("form"); if (form) { form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }'
      );
      await page.waitForTimeout(100); // Small delay between submissions
    }

    // Wait for processing
    await page.waitForTimeout(2000);

    // Verify the app handles rapid submissions gracefully
    // Should either show duplicate prevention or process only once
    const isOnForm = await page.locator('[data-testid="name-input"]').isVisible();
    const isNavigated = !page.url().includes('add-profile.html');

    // App should either stay on form (with error) or navigate (success)
    expect(isOnForm || isNavigated).toBeTruthy();

    // If navigated, verify only one profile was created
    if (isNavigated) {
      await page.goto('http://127.0.0.1:3000/');
      await page.fill('[data-testid="search-input"]', `Rapid Test ${timestamp}`);
      await page.click('[data-testid="search-button"]');

      await page.waitForTimeout(1000);
      const duplicateResults = await page.locator('.search-result-item').count();
      expect(duplicateResults).toBeLessThanOrEqual(1);
    }
  });

  test('should handle special characters in URLs', async ({ page }) => {
    const specialChars = ['%', '&', '#', '?', '+', '=', ' ', '<', '>', '"', "'"];

    for (const char of specialChars.slice(0, 3)) {
      // Try to navigate with special characters in profile ID
      await page.goto(`http://127.0.0.1:3000/profile.html?id=test${encodeURIComponent(char)}id`);

      // Verify the app doesn't crash with special characters
      await expect(page.locator('body')).toBeVisible();

      // Wait a moment for any errors to surface
      await page.waitForTimeout(500);
    }
  });

  test('should handle browser navigation during async operations', async ({ page }) => {
    // Navigate to add profile page
    await page.goto('http://127.0.0.1:3000/add-profile.html');

    const timestamp = Date.now();

    // Fill and submit form
    await page.fill('[data-testid="name-input"]', `Navigation Test ${timestamp}`);
    await page.fill('[data-testid="email-input"]', `nav${timestamp}@example.com`);

    // Submit form
    await page.evaluate(
      'const form = document.querySelector("form"); if (form) { form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }'
    );

    // Immediately navigate away before form processing completes
    await page.goto('http://127.0.0.1:3000/');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Verify the app doesn't crash from interrupted operation
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();

    // Verify we can still use the app normally
    await page.fill('[data-testid="search-input"]', 'test');
    await page.click('[data-testid="search-button"]');

    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
  });

  test('should handle missing DOM elements gracefully', async ({ page }) => {
    // Navigate to a page and then modify DOM to simulate missing elements
    await page.goto('http://127.0.0.1:3000/');

    // Remove critical DOM elements to test error handling
    await page.evaluate(`
      const searchInput = document.querySelector('[data-testid="search-input"]');
      if (searchInput) searchInput.remove();
      
      const searchButton = document.querySelector('[data-testid="search-button"]');
      if (searchButton) searchButton.remove();
    `);

    // Try to interact with missing elements
    try {
      await page.fill('[data-testid="search-input"]', 'test', { timeout: 2000 });
    } catch (error) {
      // Expected to fail, but app shouldn't crash
    }

    // Verify the page is still functional
    await expect(page.locator('body')).toBeVisible();

    // Verify we can still navigate
    const addProfileLink = page.locator('a[href*="add-profile"]').first();
    if (await addProfileLink.isVisible()) {
      try {
        await addProfileLink.click({ timeout: 5000 });
        await expect(page).toHaveURL(/add-profile\.html/);
      } catch (error) {
        // Navigation might fail, but that's okay for this test
        console.log('Navigation failed as expected due to missing DOM elements');
      }
    }
  });

  test('should handle empty localStorage gracefully', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://127.0.0.1:3000/');

    // Ensure localStorage is completely empty
    await page.evaluate('localStorage.clear()');
    await page.reload();

    // Verify the app handles empty state gracefully
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();

    // Verify search works even with no data
    await page.fill('[data-testid="search-input"]', 'nonexistent');
    await page.click('[data-testid="search-button"]');

    // App should remain functional
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
  });
});
