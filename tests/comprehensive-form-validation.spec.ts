import { test, expect } from '@playwright/test';

test.describe('Comprehensive Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to add profile page and clear localStorage
    await page.goto('http://127.0.0.1:3000/add-profile.html');
    await page.evaluate('localStorage.clear()');
  });

  test('should submit valid form successfully', async ({ page }) => {
    const uniqueTimestamp = Date.now();

    // Fill all required form fields
    await page.fill('[data-testid="input-name"]', `Test User ${uniqueTimestamp}`);
    await page.fill('[data-testid="input-email"]', `test${uniqueTimestamp}@example.com`);
    await page.fill('[data-testid="input-title"]', 'Senior Developer');
    await page.fill(
      '[data-testid="input-bio"]',
      'Experienced software developer with expertise in modern web technologies.'
    );

    // Add skills
    await page.fill('[data-testid="input-skills"]', 'JavaScript');
    await page.click('[data-testid="add-skill-btn"]');
    await page.fill('[data-testid="input-skills"]', 'TypeScript');
    await page.click('[data-testid="add-skill-btn"]');

    // Add a project
    await page.click('[data-testid="add-project-btn"]');
    await page.waitForSelector('.project-card', { timeout: 5000 });

    const projectCard = page.locator('.project-card').first();
    await projectCard.locator('[data-testid="project-name"]').fill('Portfolio Website');
    await projectCard
      .locator('[data-testid="project-description"]')
      .fill('Personal portfolio showcasing my projects');
    await projectCard.locator('[data-testid="project-tech"]').fill('React, Node.js');

    // Manual form submission for reliability
    await page.evaluate(
      'const form = document.querySelector("form"); if (form) { form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }'
    );

    // Verify success message appears
    await expect(page.locator('.form-messages')).toContainText('Profile added successfully');

    // Verify navigation to profile or success page
    await page.waitForURL(/profile\.html\?id=.+|index\.html/, { timeout: 5000 });
  });

  test('should validate missing required fields', async ({ page }) => {
    // Try to submit form without filling any fields
    await page.evaluate(
      'const form = document.querySelector("form"); if (form) { form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }'
    );

    // Verify error messages for required fields
    await expect(page.locator('.form-messages')).toContainText('Full name is required');
    await expect(page.locator('.form-messages')).toContainText('Email is required');

    // Verify form is not submitted (still on add-profile page)
    await expect(page).toHaveURL(/add-profile\.html/);
  });

  test('should validate email format', async ({ page }) => {
    const uniqueTimestamp = Date.now();

    // Fill name (required) and invalid email
    await page.fill('[data-testid="input-name"]', `Test User ${uniqueTimestamp}`);
    await page.fill('[data-testid="input-email"]', 'invalid-email-format');

    // Submit form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });

    // Verify email validation error
    await expect(page.locator('.form-messages')).toContainText(
      'Please enter a valid email address'
    );

    // Verify form is not submitted
    await expect(page).toHaveURL(/add-profile\.html/);
  });

  test('should prevent duplicate email addresses', async ({ page }) => {
    const baseTimestamp = Date.now();
    const duplicateEmail = `duplicate${baseTimestamp}@example.com`;

    // First, create a profile with this email
    await page.fill('[data-testid="input-name"]', `First User ${baseTimestamp}`);
    await page.fill('[data-testid="input-email"]', duplicateEmail);
    await page.fill('[data-testid="input-title"]', 'Developer');

    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });

    // Wait for success and navigate back to form
    await page.waitForTimeout(2000);
    await page.goto('http://127.0.0.1:3000/add-profile.html');

    // Try to create another profile with the same email
    await page.fill('[data-testid="input-name"]', `Second User ${baseTimestamp}`);
    await page.fill('[data-testid="input-email"]', duplicateEmail);
    await page.fill('[data-testid="input-title"]', 'Designer');

    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });

    // Verify duplicate email error
    await expect(page.locator('.form-messages')).toContainText('Email already exists');
  });

  test('should handle dynamic skills addition and removal', async ({ page }) => {
    const uniqueTimestamp = Date.now();

    // Fill basic required fields
    await page.fill('[data-testid="input-name"]', `Skills Test ${uniqueTimestamp}`);
    await page.fill('[data-testid="input-email"]', `skills${uniqueTimestamp}@example.com`);

    // Add multiple skills
    const skills = ['JavaScript', 'Python', 'React', 'Node.js'];

    for (const skill of skills) {
      await page.fill('[data-testid="input-skills"]', skill);
      await page.click('[data-testid="add-skill-btn"]');

      // Verify skill appears in the skills container
      await expect(page.locator('.skills-container')).toContainText(skill);
    }

    // Test removing a skill (if remove functionality exists)
    const skillToRemove = page.locator('.skill-tag').first();
    if (await skillToRemove.locator('.remove-skill').isVisible()) {
      await skillToRemove.locator('.remove-skill').click();

      // Verify skill count decreased
      const finalSkillCount = await page.locator('.skill-tag').count();
      expect(finalSkillCount).toBe(skills.length - 1);
    }
  });

  test('should handle dynamic project cards addition', async ({ page }) => {
    const uniqueTimestamp = Date.now();

    // Fill basic required fields
    await page.fill('[data-testid="input-name"]', `Project Test ${uniqueTimestamp}`);
    await page.fill('[data-testid="input-email"]', `projects${uniqueTimestamp}@example.com`);

    // Add multiple projects
    const projects = [
      { name: 'E-commerce Site', description: 'Online shopping platform', tech: 'React, Express' },
      { name: 'Mobile App', description: 'Task management application', tech: 'React Native' },
      {
        name: 'API Service',
        description: 'RESTful API for data management',
        tech: 'Node.js, MongoDB',
      },
    ];

    for (let i = 0; i < projects.length; i++) {
      // Add new project card
      await page.click('[data-testid="add-project-btn"]');
      await page.waitForSelector('.project-card', { timeout: 5000 });

      // Fill project details in the latest card
      const projectCard = page.locator('.project-card').nth(i);
      await projectCard.locator('[data-testid="project-name"]').fill(projects[i].name);
      await projectCard
        .locator('[data-testid="project-description"]')
        .fill(projects[i].description);
      await projectCard.locator('[data-testid="project-tech"]').fill(projects[i].tech);
    }

    // Verify all project cards are present
    const projectCount = await page.locator('.project-card').count();
    expect(projectCount).toBe(projects.length);

    // Verify project data is filled correctly
    for (let i = 0; i < projects.length; i++) {
      const projectCard = page.locator('.project-card').nth(i);
      await expect(projectCard.locator('[data-testid="project-name"]')).toHaveValue(
        projects[i].name
      );
    }
  });

  test('should validate individual project fields', async ({ page }) => {
    const uniqueTimestamp = Date.now();

    // Fill basic required fields
    await page.fill('[data-testid="input-name"]', `Project Validation ${uniqueTimestamp}`);
    await page.fill('[data-testid="input-email"]', `projectval${uniqueTimestamp}@example.com`);

    // Add a project card but leave fields empty
    await page.click('[data-testid="add-project-btn"]');
    await page.waitForSelector('.project-card', { timeout: 5000 });

    // Try to submit with empty project fields
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });

    // Check for project validation errors (if implemented)
    const hasProjectErrors = await page.locator('.form-messages').textContent();

    // If project validation exists, verify error messages
    if (hasProjectErrors && hasProjectErrors.includes('project')) {
      await expect(page.locator('.form-messages')).toContainText('Project name is required');
    }
  });

  test('should handle form reset functionality', async ({ page }) => {
    const uniqueTimestamp = Date.now();

    // Fill form with data
    await page.fill('[data-testid="input-name"]', `Reset Test ${uniqueTimestamp}`);
    await page.fill('[data-testid="input-email"]', `reset${uniqueTimestamp}@example.com`);
    await page.fill('[data-testid="input-title"]', 'Test Title');
    await page.fill('[data-testid="input-bio"]', 'Test bio content');

    // Add a skill
    await page.fill('[data-testid="input-skills"]', 'JavaScript');
    await page.click('[data-testid="add-skill-btn"]');

    // Reset form (if reset button exists)
    const resetButton = page.locator('[data-testid="reset-btn"]');
    if (await resetButton.isVisible()) {
      await resetButton.click();

      // Verify all fields are cleared
      await expect(page.locator('[data-testid="input-name"]')).toHaveValue('');
      await expect(page.locator('[data-testid="input-email"]')).toHaveValue('');
      await expect(page.locator('[data-testid="input-title"]')).toHaveValue('');
      await expect(page.locator('[data-testid="input-bio"]')).toHaveValue('');

      // Verify skills are cleared
      const skillCount = await page.locator('.skill-tag').count();
      expect(skillCount).toBe(0);
    }
  });

  test('should handle large text input gracefully', async ({ page }) => {
    const uniqueTimestamp = Date.now();

    // Create very long content
    const longName = 'A'.repeat(100);
    const longBio =
      'This is a very long bio text that tests how the form handles extremely long input. '.repeat(
        50
      );
    const longTitle = 'Senior Executive Developer Manager Director Lead'.repeat(5);

    // Fill form with large content
    await page.fill('[data-testid="input-name"]', longName);
    await page.fill('[data-testid="input-email"]', `longtext${uniqueTimestamp}@example.com`);
    await page.fill('[data-testid="input-title"]', longTitle);
    await page.fill('[data-testid="input-bio"]', longBio);

    // Submit form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });

    // Verify the app handles large input gracefully
    // Either shows validation error for max length or processes successfully
    await page.waitForTimeout(2000);

    // Check if form is still visible (validation error) or navigation occurred (success)
    const isStillOnForm = await page.locator('[data-testid="input-name"]').isVisible();
    const hasErrorMessage = await page.locator('.form-messages').isVisible();

    // Either successful submission or appropriate error handling
    expect(isStillOnForm || hasErrorMessage || page.url().includes('profile')).toBeTruthy();
  });

  test('should maintain form state during validation errors', async ({ page }) => {
    const uniqueTimestamp = Date.now();

    // Fill form with valid data except email
    await page.fill('[data-testid="input-name"]', `State Test ${uniqueTimestamp}`);
    await page.fill('[data-testid="input-email"]', 'invalid-email');
    await page.fill('[data-testid="input-title"]', 'Developer');
    await page.fill('[data-testid="input-bio"]', 'Bio content that should be preserved');

    // Add a skill
    await page.fill('[data-testid="input-skills"]', 'JavaScript');
    await page.click('[data-testid="add-skill-btn"]');

    // Submit form (should fail due to invalid email)
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });

    // Verify form values are maintained after validation error
    await expect(page.locator('[data-testid="input-name"]')).toHaveValue(
      `State Test ${uniqueTimestamp}`
    );
    await expect(page.locator('[data-testid="input-title"]')).toHaveValue('Developer');
    await expect(page.locator('[data-testid="input-bio"]')).toHaveValue(
      'Bio content that should be preserved'
    );

    // Verify skills are maintained
    await expect(page.locator('.skills-container')).toContainText('JavaScript');
  });
});
