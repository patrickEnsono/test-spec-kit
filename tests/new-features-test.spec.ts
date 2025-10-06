import { test, expect } from '@playwright/test';

test.describe('New Features Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/add-profile.html');
    await page.evaluate(() => (globalThis as any).localStorage.clear());

    // Wait for JavaScript to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('should require at least one project', async ({ page }) => {
    // Fill in all required fields except projects
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="title-input"]', 'Developer');
    await page.fill('[data-testid="email-input"]', 'test@example.com');

    // Wait for the default project form to appear, then clear it
    await page.waitForSelector('.project-card', { timeout: 5000 });

    // Get the project name input (it should have a dynamic test ID)
    const projectNameInputs = await page.locator('[data-testid*="project-name-"]').all();
    if (projectNameInputs.length > 0) {
      await projectNameInputs[0].fill(''); // Clear the project name to make validation fail
    }

    // Try to submit without any project information
    // Use manual form submission since button click doesn't trigger form submission consistently
    await page.evaluate(() => {
      const form = (globalThis as any).document.querySelector('form');
      if (form) {
        const event = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(event);
      }
    });

    // Should show validation error
    const errorMessage = await page.locator('.form-messages');
    await page.waitForSelector('.form-messages:not(.hidden)', { timeout: 5000 });
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('At least one project is required');
  });

  test('should prevent duplicate emails', async ({ page }) => {
    // First, create a user with a specific email
    await page.fill('[data-testid="name-input"]', 'First User');
    await page.fill('[data-testid="title-input"]', 'Developer');
    await page.fill('[data-testid="email-input"]', 'duplicate@example.com');

    // Wait for the default project form and fill it
    await page.waitForSelector('.project-card', { timeout: 5000 });
    const projectNameInput = await page.locator('[data-testid*="project-name-"]').first();
    await projectNameInput.fill('Test Project');

    await page.click('button[type="submit"]');

    // Wait for success message
    await expect(page.locator('.form-messages')).toBeVisible();

    // Navigate back to add another user
    await page.goto('http://127.0.0.1:3000/add-profile.html');

    // Try to create another user with the same email
    await page.fill('[data-testid="name-input"]', 'Second User');
    await page.fill('[data-testid="title-input"]', 'Designer');
    await page.fill('[data-testid="email-input"]', 'duplicate@example.com');

    // Fill in project
    await page.waitForSelector('.project-card', { timeout: 5000 });
    const secondProjectNameInput = await page.locator('[data-testid*="project-name-"]').first();
    await secondProjectNameInput.fill('Another Project');

    await page.click('button[type="submit"]');

    // Should show duplicate email error
    const errorMessage = await page.locator('.form-messages');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('email address already exists');
  });

  test('should have blue background for skill tags', async ({ page }) => {
    // Add a skill
    await page.fill('#skills-input', 'JavaScript');
    await page.click('.add-skill-btn');

    // Check the skill tag styling
    const skillTag = page.locator('.skill-tag').first();
    await expect(skillTag).toBeVisible();

    // Check the computed styles
    const backgroundColor = await skillTag.evaluate(
      el => (globalThis as any).window.getComputedStyle(el).backgroundColor
    );
    const color = await skillTag.evaluate(
      el => (globalThis as any).window.getComputedStyle(el).color
    );

    // Blue background (rgb(0, 123, 255) is #007bff)
    expect(backgroundColor).toBe('rgb(0, 123, 255)');
    // White text
    expect(color).toBe('rgb(255, 255, 255)');
  });

  test('should have default project form available', async ({ page }) => {
    // Wait for the default project form to appear
    await page.waitForSelector('.project-card', { timeout: 5000 });

    // Check that there's already a project form available when page loads
    const projectCards = await page.locator('.project-card').count();
    expect(projectCards).toBeGreaterThanOrEqual(1);

    // Check that project input fields are present using the correct test IDs
    await expect(page.locator('[data-testid*="project-name-"]').first()).toBeVisible();
    await expect(page.locator('[data-testid*="project-description-"]').first()).toBeVisible();
  });

  test('should successfully create profile with valid project', async ({ page }) => {
    // Fill all required fields including project
    await page.fill('[data-testid="name-input"]', 'Valid User');
    await page.fill('[data-testid="title-input"]', 'Developer');
    await page.fill('[data-testid="email-input"]', 'valid@example.com');

    // Wait for the default project form and fill in the project details
    await page.waitForSelector('.project-card', { timeout: 5000 });

    const projectNameInput = await page.locator('[data-testid*="project-name-"]').first();
    await projectNameInput.fill('My Amazing Project');

    const projectDescInput = await page.locator('[data-testid*="project-description-"]').first();
    await projectDescInput.fill('This is a test project description');

    // Submit the form
    await page.click('button[type="submit"]');

    // Should show success message
    const successMessage = await page.locator('.form-messages');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Profile created successfully');
  });

  test('should add and remove skills with proper styling', async ({ page }) => {
    // Add multiple skills
    const skills = ['JavaScript', 'TypeScript', 'React'];

    for (const skill of skills) {
      await page.fill('#skills-input', skill);
      await page.click('.add-skill-btn');
    }

    // Check all skills are present with proper styling
    const skillTags = page.locator('.skill-tag');
    await expect(skillTags).toHaveCount(3);

    // Check first skill tag styling and content
    const firstSkill = skillTags.first();
    await expect(firstSkill).toContainText('JavaScript');

    // Test removing a skill
    await firstSkill.locator('.remove-skill').click();
    await expect(skillTags).toHaveCount(2);

    // Check remaining skills
    await expect(page.locator('.skill-tag').first()).toContainText('TypeScript');
  });
});
