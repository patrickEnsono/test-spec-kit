import { test, expect } from '@playwright/test';

test.describe('Advanced Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page first, then clear localStorage
    await page.goto('http://127.0.0.1:3000/');
    await page.evaluate('localStorage.clear()');
  });

  test('should search by name and display correct results', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Perform search by name
    await page.fill('[data-testid="search-input"]', 'Patrick');
    await page.click('[data-testid="search-button"]');

    // Wait for search results
    await page.waitForSelector('.search-result-item', { timeout: 10000 });

    // Verify search results are visible
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();

    // Verify name match badge appears
    await expect(page.locator('.match-badge.name')).toBeVisible();

    // Verify at least one result is shown
    const searchResults = page.locator('.search-result-item');
    const resultCount = await searchResults.count();
    expect(resultCount).toBeGreaterThan(0);
  });

  test('should search by title and show relevant matches', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Perform search by title
    await page.fill('[data-testid="search-input"]', 'Developer');
    await page.click('[data-testid="search-button"]');

    // Wait for search results
    await page.waitForSelector('.search-result-item', { timeout: 10000 });

    // Verify title match badge appears
    await expect(page.locator('.match-badge.title')).toBeVisible();

    // Verify search results contain the searched title
    await expect(page.locator('.search-result-item')).toContainText('Developer');
  });

  test('should search by skills and display skill matches', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Perform search by skill
    await page.fill('[data-testid="search-input"]', 'JavaScript');
    await page.click('[data-testid="search-button"]');

    // Wait for search results
    await page.waitForSelector('.search-result-item', { timeout: 10000 });

    // Verify skills match badge appears
    await expect(page.locator('.match-badge.skills')).toBeVisible();

    // Verify the skill appears in the results
    await expect(page.locator('.skill-tag')).toContainText('JavaScript');
  });

  test('should search by project and show project matches', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Perform search by project
    await page.fill('[data-testid="search-input"]', 'Portfolio');
    await page.click('[data-testid="search-button"]');

    // Wait for search results
    await page.waitForSelector('.search-result-item', { timeout: 10000 });

    // Verify projects match badge appears
    await expect(page.locator('.match-badge.projects')).toBeVisible();

    // Verify project appears in results
    await expect(page.locator('.project-name')).toContainText('Portfolio');
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Search for something that doesn't exist
    await page.fill('[data-testid="search-input"]', 'NonExistentSearchTerm123456');
    await page.click('[data-testid="search-button"]');

    // Wait a moment for search to process
    await page.waitForTimeout(2000);

    // Verify no results message or empty state
    const noResults = page.locator('[data-testid="no-results"]');
    const searchResults = page.locator('.search-result-item');

    // Either no results message appears OR no search result items exist
    const hasNoResultsMessage = await noResults.isVisible();
    const hasNoSearchItems = (await searchResults.count()) === 0;

    expect(hasNoResultsMessage || hasNoSearchItems).toBeTruthy();
  });

  test('should navigate to profile from search results', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Perform search
    await page.fill('[data-testid="search-input"]', 'Patrick');
    await page.click('[data-testid="search-button"]');

    // Wait for search results
    await page.waitForSelector('.search-result-item', { timeout: 10000 });

    // Click on view profile button
    await page.click('.search-result-item .view-profile-btn');

    // Verify navigation to profile page
    await expect(page).toHaveURL(/profile\.html\?id=.+/);

    // Verify profile content is loaded
    await expect(page.locator('[data-testid="profile-container"]')).toBeVisible();
  });

  test('should handle special characters in search', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Search with special characters
    const specialChars = ['@', '#', '$', '%', '&', '*', '(', ')', '+', '='];

    for (const char of specialChars.slice(0, 3)) {
      // Test a few special characters
      await page.fill('[data-testid="search-input"]', char);
      await page.click('[data-testid="search-button"]');

      // Wait a moment
      await page.waitForTimeout(1000);

      // Verify the app doesn't crash (search input should still be visible)
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible();

      // Clear the search
      await page.fill('[data-testid="search-input"]', '');
    }
  });

  test('should handle long search queries', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Create a very long search query
    const longQuery =
      'This is a very long search query that tests how the application handles extremely long input strings that might cause issues with the search functionality and UI display';

    await page.fill('[data-testid="search-input"]', longQuery);
    await page.click('[data-testid="search-button"]');

    // Wait for search to process
    await page.waitForTimeout(2000);

    // Verify the app doesn't crash
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();

    // Verify the long query is properly handled (truncated or displayed properly)
    const inputValue = await page.locator('[data-testid="search-input"]').inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
  });

  test('should verify search result count accuracy', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });

    // Perform search
    await page.fill('[data-testid="search-input"]', 'Developer');
    await page.click('[data-testid="search-button"]');

    // Wait for search results
    await page.waitForSelector('.search-result-item', { timeout: 10000 });

    // Count actual search result items
    const resultCount = await page.locator('.search-result-item').count();

    // Verify count is displayed (if your app has a result count display)
    const countDisplay = page.locator('[data-testid="result-count"]');
    if (await countDisplay.isVisible()) {
      const displayedCount = await countDisplay.textContent();
      expect(displayedCount).toContain(resultCount.toString());
    }

    // Verify we have at least some results
    expect(resultCount).toBeGreaterThan(0);
  });
});
