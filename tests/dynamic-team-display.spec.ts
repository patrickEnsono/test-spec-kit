import { test, expect } from '@playwright/test';

test.describe('Dynamic Team Display Tests', () => {
  test('should display newly created user in Our QA Team section on home page', async ({
    page,
  }) => {
    // Clear localStorage first
    await page.goto('http://127.0.0.1:3000/');
    await page.evaluate('localStorage.clear()');

    // First, check initial state - should show seeded team members
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify initial team members are displayed
    await expect(page.locator('[data-testid="patrick-hendron-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="tom-moor-card"]')).toBeVisible();

    // Count initial team members
    const initialCount = await page.locator('.team-card').count();
    expect(initialCount).toBe(2); // Patrick and Tom

    // Navigate to add profile page
    await page.goto('http://127.0.0.1:3000/add-profile.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Create a new user
    const timestamp = Date.now();
    const newUser = {
      name: `TestTeamMember${timestamp}`,
      title: 'Senior Test Engineer',
      email: `team.member.${timestamp}@ensono.com`,
      location: 'Edinburgh, UK',
      bio: 'New team member for testing dynamic display functionality',
      project: 'Team Display Test Project',
    };

    // Fill out the form
    await page.fill('[data-testid="name-input"]', newUser.name);
    await page.fill('[data-testid="title-input"]', newUser.title);
    await page.fill('[data-testid="email-input"]', newUser.email);
    await page.fill('[data-testid="location-input"]', newUser.location);
    await page.fill('[data-testid="about-input"]', newUser.bio);

    // Add a skill to make it more realistic
    await page.fill('#skills-input', 'Team Integration Testing');
    await page.click('.add-skill-btn');

    // Wait for default project and fill it
    await page.waitForSelector('.project-card', { timeout: 5000 });
    await page.fill('[data-testid*="project-name-"]', newUser.project);

    // Use manual form submission since button click doesn't trigger form submission consistently
    await page.evaluate(() => {
      const form = (globalThis as any).document.querySelector('form');
      if (form) {
        const event = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(event);
      }
    });

    // Wait for success message
    await page.waitForSelector('.form-messages:not(.hidden)', { timeout: 5000 });
    await expect(page.locator('.form-messages')).toContainText('Profile created successfully');

    // Click the "View in team directory" link to go back to home
    await page.click('a[href="/"]');

    // Wait for page to load and team display to refresh
    await page.waitForTimeout(2000);

    // Wait for team display to load
    await page.waitForSelector('.team-grid', { timeout: 5000 });

    // Count team cards to verify the new user appears
    const teamCardCount = await page.locator('.team-card').count();
    console.log(`Team card count after navigation: ${teamCardCount}`);

    // We should have 3 team cards now (2 original + 1 new)
    expect(teamCardCount).toBe(3);

    // Look for a team card containing the new user's name
    const newUserCard = page.locator('.team-card').filter({
      hasText: newUser.name.substring(0, 15), // Use substring in case of truncation
    });

    await expect(newUserCard).toBeVisible();
    await expect(newUserCard.locator('h4')).toContainText(newUser.name.substring(0, 15));
    await expect(newUserCard.locator('.job-title')).toContainText(newUser.title.substring(0, 20));
    await expect(newUserCard.locator('.profile-link')).toBeVisible();

    // Verify the profile link works by clicking it from the new user card
    await newUserCard.locator('.profile-link').click();

    // Should navigate to the profile page
    await expect(page).toHaveURL(new RegExp('/profile.html\\?id='));
    await expect(page.locator('[data-testid="profile-name"]')).toContainText(newUser.name);
  });

  test('should handle multiple new team members correctly', async ({ page }) => {
    // Clear localStorage first
    await page.goto('http://127.0.0.1:3000/');
    await page.evaluate('localStorage.clear()');
    await page.reload();

    // Get initial count
    const initialCount = await page.locator('.team-card').count();

    // Create first user
    await page.goto('http://127.0.0.1:3000/add-profile.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const timestamp1 = Date.now();
    await page.fill('[data-testid="name-input"]', `FirstUser${timestamp1}`);
    await page.fill('[data-testid="title-input"]', 'QA Engineer');
    await page.fill('[data-testid="email-input"]', `first.${timestamp1}@ensono.com`);

    // Wait for default project and fill it
    await page.waitForSelector('.project-card', { timeout: 5000 });
    await page.fill('[data-testid*="project-name-"]', 'Multiple Test Project 1');

    // Use manual form submission since button click doesn't trigger form submission consistently
    await page.evaluate(() => {
      const form = (globalThis as any).document.querySelector('form');
      if (form) {
        const event = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(event);
      }
    });

    await page.waitForSelector('.form-messages:not(.hidden)', { timeout: 5000 });
    await expect(page.locator('.form-messages')).toContainText('Profile created successfully');
    await page.click('a[href="/"]');
    await page.waitForTimeout(1000);

    // Verify first user appears
    let currentCount = await page.locator('.team-card').count();
    expect(currentCount).toBe(initialCount + 1);

    // Create second user
    await page.goto('http://127.0.0.1:3000/add-profile.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const timestamp2 = Date.now() + 1000; // Ensure different timestamp
    await page.fill('[data-testid="name-input"]', `SecondUser${timestamp2}`);
    await page.fill('[data-testid="title-input"]', 'DevOps Engineer');
    await page.fill('[data-testid="email-input"]', `second.${timestamp2}@ensono.com`);

    // Wait for default project and fill it
    await page.waitForSelector('.project-card', { timeout: 5000 });
    await page.fill('[data-testid*="project-name-"]', 'Multiple Test Project 2');

    // Use manual form submission since button click doesn't trigger form submission consistently
    await page.evaluate(() => {
      const form = (globalThis as any).document.querySelector('form');
      if (form) {
        const event = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(event);
      }
    });

    await page.waitForSelector('.form-messages:not(.hidden)', { timeout: 5000 });
    await expect(page.locator('.form-messages')).toContainText('Profile created successfully');
    await page.click('a[href="/"]');
    await page.waitForTimeout(1000);

    // Verify both users appear
    currentCount = await page.locator('.team-card').count();
    expect(currentCount).toBe(initialCount + 2);

    // Verify both users are visible (using substring since names might be truncated)
    await expect(page.locator(`.team-card:has-text("FirstUser")`)).toBeVisible();
    await expect(page.locator(`.team-card:has-text("SecondUser")`)).toBeVisible();
  });

  test('should handle long names and titles gracefully in team cards', async ({ page }) => {
    // Clear localStorage and navigate to add profile
    await page.goto('http://127.0.0.1:3000/');
    await page.evaluate('localStorage.clear()');
    await page.goto('http://127.0.0.1:3000/add-profile.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Create user with very long name and title
    const timestamp = Date.now();
    const longUser = {
      name: `VeryLongUserNameThatExceedsTwentyCharacters${timestamp}`,
      title: 'Principal Senior Lead Advanced Quality Assurance Engineer Manager',
      email: `long.name.${timestamp}@ensono.com`,
      project: 'Long Names Test Project',
    };

    await page.fill('[data-testid="name-input"]', longUser.name);
    await page.fill('[data-testid="title-input"]', longUser.title);
    await page.fill('[data-testid="email-input"]', longUser.email);

    // Wait for default project and fill it
    await page.waitForSelector('.project-card', { timeout: 5000 });
    await page.fill('[data-testid*="project-name-"]', longUser.project);

    // Use manual form submission since button click doesn't trigger form submission consistently
    await page.evaluate(() => {
      const form = (globalThis as any).document.querySelector('form');
      if (form) {
        const event = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(event);
      }
    });

    await page.waitForSelector('.form-messages:not(.hidden)', { timeout: 5000 });
    await expect(page.locator('.form-messages')).toContainText('Profile created successfully');
    await page.click('a[href="/"]');
    await page.waitForTimeout(1000);

    // Navigate to team display and wait for it to load
    await page.waitForSelector('.team-grid', { timeout: 5000 });
    await page.waitForTimeout(1000);

    // Look for a team card with the long name (using substring for truncation)
    const userCard = page.locator('.team-card').filter({
      hasText: longUser.name.substring(0, 15), // First 15 chars since it truncates at 18
    });

    await expect(userCard).toBeVisible();

    // Check that long names/titles are truncated in display but full text is in title attribute
    const nameElement = userCard.locator('h4');
    const titleElement = userCard.locator('.job-title');

    await expect(nameElement).toHaveAttribute('title', longUser.name);
    await expect(titleElement).toHaveAttribute('title', longUser.title);

    // Verify truncation occurred (displayed text should be shorter than original)
    const displayedName = await nameElement.textContent();
    const displayedTitle = await titleElement.textContent();

    expect(displayedName).toBeTruthy();
    expect(displayedTitle).toBeTruthy();
    expect(displayedName!.length).toBeLessThan(longUser.name.length);
    expect(displayedTitle!.length).toBeLessThan(longUser.title.length);
    expect(displayedName).toContain('...');
    expect(displayedTitle).toContain('...');
  });
});
