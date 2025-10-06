import { test, expect } from '@playwright/test';

test.describe('Burger Menu Navigation', () => {
  test('should show burger menu and only have Add Profile option', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');

    // Check that the burger menu button exists
    const burgerButton = page.locator('[data-testid="burger-menu"]');
    await expect(burgerButton).toBeVisible();

    // Check that the mobile nav exists in DOM (but may be hidden initially)
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    await expect(mobileNav).toBeAttached();

    // Verify it's initially closed (no active class)
    const initialClass = await mobileNav.getAttribute('class');
    expect(initialClass).not.toContain('active');

    // Click the burger menu to open
    await burgerButton.click();

    // Check that the menu opens (gets active class)
    await expect(mobileNav).toHaveClass(/active/);

    // Verify only Add Profile link is present
    const navLinks = page.locator('.mobile-nav-links a');
    await expect(navLinks).toHaveCount(1);
    await expect(navLinks.first()).toContainText('Add Profile');
    await expect(navLinks.first()).toHaveAttribute('href', '/add-profile.html');

    // Test that clicking the burger menu again closes it
    await burgerButton.click({ force: true });

    // Wait a bit for the transition
    await page.waitForTimeout(500);

    // Check that the menu closes (loses active class)
    const finalClass = await mobileNav.getAttribute('class');
    expect(finalClass).not.toContain('active');
  });

  test('should work on add-profile page too', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/add-profile.html');

    // Check that the burger menu exists
    const burgerButton = page.locator('[data-testid="burger-menu"]');
    await expect(burgerButton).toBeVisible();

    // Click to open menu
    await burgerButton.click();

    // Check menu opens
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    await expect(mobileNav).toHaveClass(/active/);

    // Verify the Add Profile link has active class
    const addProfileLink = page.locator('[data-testid="nav-add-profile"]');
    await expect(addProfileLink).toHaveClass(/active/);
  });

  test('should close menu when clicking outside', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');

    const burgerButton = page.locator('[data-testid="burger-menu"]');
    const mobileNav = page.locator('[data-testid="mobile-nav"]');

    // Open the menu
    await burgerButton.click();
    await expect(mobileNav).toHaveClass(/active/);

    // Click outside the header (on main content)
    await page.locator('[data-testid="mobile-nav-overlay"]').click();

    // Wait for the menu to close
    await page.waitForTimeout(500);

    // Check that menu closed
    const finalClass = await mobileNav.getAttribute('class');
    expect(finalClass).not.toContain('active');
  });

  test('should close menu with Escape key', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');

    const burgerButton = page.locator('[data-testid="burger-menu"]');
    const mobileNav = page.locator('[data-testid="mobile-nav"]');

    // Open the menu
    await burgerButton.click();
    await expect(mobileNav).toHaveClass(/active/);

    // Press Escape key
    await page.keyboard.press('Escape');

    // Wait for the menu to close
    await page.waitForTimeout(500);

    // Check that menu closed
    const finalClass = await mobileNav.getAttribute('class');
    expect(finalClass).not.toContain('active');
  });
});
