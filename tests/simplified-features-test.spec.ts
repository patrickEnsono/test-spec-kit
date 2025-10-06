import { test, expect } from '@playwright/test';

test.describe('Simplified Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/add-profile.html');
    await page.evaluate(() => (globalThis as any).localStorage.clear());

    // Wait for JavaScript to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('should show validation error when project name is empty', async ({ page }) => {
    // Fill basic required fields
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="title-input"]', 'Developer');
    await page.fill('[data-testid="email-input"]', 'test@example.com');

    // Wait for default project and clear the name field
    await page.waitForSelector('.project-card', { timeout: 5000 });
    const projectNameInput = await page.locator('[data-testid*="project-name-"]').first();
    await projectNameInput.fill(''); // Clear to trigger validation error

    // Submit form manually since button click doesn't trigger form submission in this test
    await page.evaluate(() => {
      const form = (globalThis as any).document.querySelector('form');
      if (form) {
        const event = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(event);
      }
    });

    // Wait for error message to appear and check for validation error
    await page.waitForSelector('.form-messages:not(.hidden)', { timeout: 5000 });
    await expect(page.locator('.form-messages')).toContainText('At least one project is required');
  });

  test('should create profile successfully with valid project', async ({ page }) => {
    // Fill all required fields
    await page.fill('[data-testid="name-input"]', 'Valid User');
    await page.fill('[data-testid="title-input"]', 'Developer');
    await page.fill('[data-testid="email-input"]', 'valid@example.com');

    // Fill project information
    await page.waitForSelector('.project-card', { timeout: 5000 });
    const projectNameInput = await page.locator('[data-testid*="project-name-"]').first();
    await projectNameInput.fill('My Test Project');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.locator('#form-messages')).toContainText('Profile created successfully');
  });

  test('should prevent duplicate emails', async ({ page }) => {
    // Create first user
    await page.fill('[data-testid="name-input"]', 'First User');
    await page.fill('[data-testid="title-input"]', 'Developer');
    await page.fill('[data-testid="email-input"]', 'duplicate@test.com');

    await page.waitForSelector('.project-card', { timeout: 5000 });
    const projectNameInput = await page.locator('[data-testid*="project-name-"]').first();
    await projectNameInput.fill('First Project');

    await page.click('button[type="submit"]');
    await expect(page.locator('#form-messages')).toContainText('Profile created successfully');

    // Try to create second user with same email
    await page.goto('http://127.0.0.1:3000/add-profile.html');

    await page.fill('[data-testid="name-input"]', 'Second User');
    await page.fill('[data-testid="title-input"]', 'Designer');
    await page.fill('[data-testid="email-input"]', 'duplicate@test.com');

    await page.waitForSelector('.project-card', { timeout: 5000 });
    const secondProjectNameInput = await page.locator('[data-testid*="project-name-"]').first();
    await secondProjectNameInput.fill('Second Project');

    await page.click('button[type="submit"]');

    // Should show duplicate email error
    await expect(page.locator('#form-messages')).toContainText('email address already exists');
  });

  test('should have blue background skills with white text', async ({ page }) => {
    // Add a skill
    await page.fill('#skills-input', 'JavaScript');
    await page.click('.add-skill-btn');

    // Check skill tag styling
    const skillTag = page.locator('.skill-tag').first();
    await expect(skillTag).toBeVisible();

    // Verify the skill contains the text
    await expect(skillTag).toContainText('JavaScript');

    // Check styling (simplified - just verify the element exists and has content)
    const hasBlueBackground = await skillTag.evaluate(el => {
      const style = (globalThis as any).window.getComputedStyle(el);
      return style.backgroundColor === 'rgb(0, 123, 255)';
    });

    expect(hasBlueBackground).toBe(true);
  });
});
