# � Scenario-Specific Playwright Test Prompts

This document contains 11 specialized AI prompts designed for generating Playwright tests for specific testing scenarios, based on the patterns, best practices, and architecture established in the test-spec-kit project.

## 📋 Table of Contents

1. [General Test Creation](#1-general-test-creation-prompt)
2. [Form Testing](#2-form-testing-prompt)
3. [Search Integration](#3-search-integration-prompt)
4. [Error Handling](#4-error-handling-prompt)
5. [Data Integrity](#5-data-integrity-prompt)
6. [CI/CD Integration](#6-cicd-integration-prompt)
7. [Page Object Model Migration](#7-page-object-model-migration-prompt)
8. [Performance Testing](#8-performance-testing-prompt)
9. [Mobile/Responsive Testing](#9-mobileresponsive-testing-prompt)
10. [End-to-End User Journey](#10-end-to-end-user-journey-prompt)
11. [WCAG 2.1 AA Accessibility Testing](#11-wcag-21-aa-accessibility-testing-prompt)

---

## 1. General Test Creation Prompt

```
Generate a comprehensive Playwright test for [FEATURE_NAME] following the established patterns from our test-spec-kit project:

**Required Patterns:**
- Use manual form submission: `await page.evaluate(() => { const form = document.querySelector('form'); if (form) { form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); } });`
- Include proper data-testid selectors: `[data-testid="element-name"]`
- Wait for elements with timeout: `await page.waitForSelector('.element', { timeout: 5000 });`
- Use unique timestamps for test data: `const uniqueTimestamp = Date.now();`
- Clear localStorage in beforeEach: `await page.evaluate('localStorage.clear()')`
- Include comprehensive error handling tests
- Test both happy path and edge cases

**Test Structure:**
- beforeEach setup with navigation and cleanup
- Multiple test scenarios covering different user flows
- Proper assertions using expect().toContainText() and expect().toBeVisible()
- Form validation testing
- Data persistence verification

**Example Context:** Our app is a team profile management system with profile creation, search functionality, and dynamic team display.
```

**Use Case:** When you need to create new comprehensive test suites for features following our established testing patterns.

---

## 2. Form Testing Prompt

```
Create Playwright tests for a form with the following requirements, using our established form testing patterns:

**Form Testing Best Practices from test-spec-kit:**
- Fill forms using: `await page.fill('[data-testid="input-name"]', 'value');`
- Handle dynamic project cards: `await page.waitForSelector('.project-card', { timeout: 5000 });`
- Use manual form submission for reliability (avoid button clicks)
- Test validation errors: `await expect(page.locator('.form-messages')).toContainText('error message');`
- Test duplicate email prevention
- Verify success messages appear
- Test form with missing required fields

**Required Test Cases:**
- Valid form submission
- Missing required fields validation
- Duplicate data prevention
- Form field validation (email format, etc.)
- Dynamic element handling (skills, projects)
- Error message display
- Success flow verification

Generate tests following our pattern of comprehensive form validation testing.
```

**Use Case:** When creating tests for any form-based functionality in your application.

---

## 3. Search Integration Prompt

```
Generate Playwright tests for search functionality following our search integration patterns:

**Search Testing Patterns:**
- Navigate to home page: `await page.goto('http://127.0.0.1:3000/');`
- Perform search: `await page.fill('[data-testid="search-input"]', 'query'); await page.click('[data-testid="search-button"]');`
- Wait for results: `await page.waitForSelector('.search-result-item', { timeout: 10000 });`
- Verify results visibility: `await expect(page.locator('[data-testid="search-results"]')).toBeVisible();`
- Test different search types: name, title, skills, projects
- Test match badges: `await expect(page.locator('.match-badge.name')).toBeVisible();`
- Test navigation to profile: `await page.click('.search-result-item .view-profile-btn');`

**Required Test Scenarios:**
- Search by name, title, skills, projects
- Empty search results handling
- Profile navigation from search results
- Search result count verification
- Match badge validation
- Mixed search results (existing + new profiles)

Include error handling for edge cases like special characters and long queries.
```

**Use Case:** When testing any search or filtering functionality in your application.

---

## 4. Error Handling Prompt

```
Create comprehensive error handling tests following our test-spec-kit error handling patterns:

**Error Testing Patterns:**
- 404 profile errors: `await page.goto('http://127.0.0.1:3000/profile.html?id=non-existent');`
- Missing parameters: `await page.goto('http://127.0.0.1:3000/profile.html');`
- Error container validation: `await expect(page.locator('[data-testid="error-container"]')).toBeVisible();`
- Error message content: `await expect(page.locator('[data-testid="error-message"]')).toContainText('error text');`
- Hidden profile container: `await expect(page.locator('[data-testid="profile-container"]')).toBeHidden();`

**Required Error Scenarios:**
- Invalid URL parameters
- Missing required data
- Network-like errors (simulated)
- localStorage corruption handling
- Large data handling
- Special character input validation
- XSS attempt prevention
- Rapid action handling
- Browser navigation during errors

**Error State Verification:**
- Proper error messages displayed
- Application doesn't crash
- User can recover from error states
- Navigation remains functional
```

**Use Case:** When you need comprehensive error handling tests for robust application behavior.

---

## 5. Data Integrity Prompt

```
Generate Playwright tests for data integrity following our data validation patterns:

**Data Integrity Testing:**
- Create profiles with comprehensive data: name, title, email, location, bio, skills, projects
- Use unique identifiers: `const uniqueTimestamp = Date.now();`
- Fill complex forms: skills arrays, project objects with multiple fields
- Test data persistence: create → search → navigate → verify all fields
- Profile data validation: `await expect(page.locator('[data-testid="profile-name"]')).toContainText(testUser.name);`

**Test Flow Pattern:**
1. Create comprehensive profile with all fields
2. Submit and verify success message
3. Search for the profile
4. Navigate to profile page
5. Verify ALL data displays correctly:
   - Personal info (name, title, email, location)
   - Bio/description
   - Skills list
   - Projects with descriptions, technologies, links
   - Any additional metadata

**Validation Requirements:**
- No data loss during create → save → retrieve cycle
- Proper data formatting and display
- Special characters handled correctly
- HTML escaping where appropriate
- Links and formatted text preserved
```

**Use Case:** When you need to ensure data integrity across complex create-read-update workflows.

---

## 6. CI/CD Integration Prompt

```
Create Playwright tests optimized for CI/CD following our GitHub Actions patterns:

**CI/CD Optimization Patterns:**
- Configure for CI environment: `workers: process.env.CI ? 1 : undefined`
- Include retries: `retries: process.env.CI ? 2 : 0`
- Use manual form submission for CI reliability
- Include proper timeouts: `await page.waitForTimeout(500)` after navigation
- Wait for network idle: `await page.waitForLoadState('networkidle')`
- Use unique test data to avoid conflicts in parallel runs

**CI-Specific Requirements:**
- Tests must be deterministic
- No race conditions
- Proper cleanup between tests
- Artifacts on failure (screenshots, videos)
- Detailed error reporting
- No hardcoded waits (use waitForSelector instead)

**GitHub Actions Context:**
- Tests run on Ubuntu with Python HTTP server
- Single worker to avoid conflicts
- Comprehensive error reporting
- Artifact collection for debugging
```

**Use Case:** When creating or optimizing tests for automated CI/CD pipelines.

---

## 7. Page Object Model Migration Prompt

````
Convert existing Playwright tests to Page Object Model following our established patterns:

**Current Test Patterns to Preserve:**
- Manual form submission reliability
- Comprehensive error handling
- Data-testid selector usage
- Unique timestamp test data
- beforeEach cleanup patterns

**Page Object Structure:**
```typescript
export class AddProfilePage {
  constructor(private page: Page) {}

  async fillBasicInfo(user: UserData) {
    await this.page.fill('[data-testid="name-input"]', user.name);
    await this.page.fill('[data-testid="title-input"]', user.title);
    // ... other fields
  }

  async submitForm() {
    await this.page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
  }

  async waitForSuccess() {
    await this.page.waitForSelector('.form-messages:not(.hidden)', { timeout: 5000 });
    await expect(this.page.locator('.form-messages')).toContainText('Profile created successfully');
  }
}
````

**Migration Requirements:**

- Maintain all existing test coverage
- Reduce code duplication by 60-70%
- Improve readability without losing functionality
- Keep manual form submission pattern
- Preserve error handling robustness

```

**Use Case:** When refactoring existing tests to use Page Object Model for better maintainability.

---

## 8. Performance Testing Prompt

```

Generate Playwright performance tests following our application patterns:

**Performance Test Scenarios:**

- Large dataset handling (100+ profiles)
- Search performance with large datasets
- Form submission with multiple projects/skills
- localStorage performance limits
- Rapid user interactions
- Memory usage during long sessions

**Test Implementation:**

- Use our established data creation patterns
- Create large datasets programmatically
- Measure response times: `const startTime = Date.now(); ... const duration = Date.now() - startTime;`
- Test search performance across different query types
- Validate application remains responsive

**Performance Assertions:**

- Search results appear within acceptable timeframe
- Form submissions complete without timeout
- Application handles localStorage limits gracefully
- No memory leaks during extended usage
- UI remains responsive during data operations

```

**Use Case:** When you need to validate application performance under various load conditions.

---

## 9. Mobile/Responsive Testing Prompt

```

Create mobile-responsive Playwright tests following our burger menu patterns:

**Mobile Testing Patterns:**

- Burger menu interaction: `await page.locator('[data-testid="burger-menu"]').click();`
- Mobile navigation testing: `await expect(page.locator('[data-testid="mobile-nav"]')).toHaveClass(/active/);`
- Overlay interaction: `await page.locator('[data-testid="mobile-nav-overlay"]').click();`
- Keyboard navigation: `await page.keyboard.press('Escape');`

**Responsive Test Requirements:**

- Test burger menu open/close functionality
- Verify mobile navigation works correctly
- Test form usability on mobile viewports
- Validate search functionality on smaller screens
- Ensure touch interactions work properly
- Test landscape/portrait orientation handling

**Viewport Testing:**

- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667
- Test form layouts and navigation at each size

```

**Use Case:** When you need to ensure your application works correctly across different device sizes and orientations.

---

## 10. End-to-End User Journey Prompt

```

Create comprehensive end-to-end user journey tests following our integration patterns:

**Complete User Journeys:**

1. **New User Onboarding:**
   - Navigate to add-profile page
   - Fill comprehensive profile (all fields)
   - Submit and verify success
   - Navigate to team directory
   - Verify user appears in team display

2. **Profile Discovery Journey:**
   - Search for specific user
   - Verify search results
   - Navigate to profile page
   - Verify all profile data displays
   - Test back navigation

3. **Team Management Journey:**
   - Create multiple team members
   - Verify team display updates
   - Test search across multiple profiles
   - Verify data integrity across all operations

**Journey Testing Patterns:**

- Use our established navigation patterns
- Include error handling at each step
- Verify data persistence throughout journey
- Test browser back/forward navigation
- Include mobile responsiveness checks
- Validate performance across full journey

```

**Use Case:** When you need to test complete user workflows from start to finish.

---

## 🎯 How to Use These Prompts

### Quick Start Guide:

1. **Choose the appropriate prompt** based on what you're testing
2. **Customize the prompt** with your specific requirements:
   - Replace `[FEATURE_NAME]` with your actual feature
   - Adjust selectors to match your application
   - Modify test data to fit your domain
3. **Provide context** about your application structure
4. **Run the generated tests** and refine as needed

### Example Usage:

```

Using prompt #2 (Form Testing) for a login form:

"Create Playwright tests for a login form with the following requirements, using our established form testing patterns:

[Include the full prompt #2 content]

My specific form has:

- Username field: [data-testid="username-input"]
- Password field: [data-testid="password-input"]
- Remember me checkbox: [data-testid="remember-checkbox"]
- Submit button: [data-testid="login-submit"]
- Error messages appear in: .login-error-message

Additional validation needed:

- Invalid credentials handling
- Account lockout after failed attempts
- Password strength validation
  "

```

## 🏗️ Architecture Context

These prompts are designed around our established test architecture:

- **45 comprehensive tests** with 100% pass rate
- **Manual form submission pattern** for CI/CD reliability
- **Data-testid selectors** for stable element identification
- **Comprehensive error handling** for robust applications
- **GitHub Actions CI/CD integration** with automated testing
- **localStorage persistence** for client-side data management
- **Search and navigation flows** for user experience testing

## 📊 Test Coverage Goals

When using these prompts, aim for:

- ✅ **Happy path scenarios** - Normal user workflows
- ✅ **Edge cases** - Boundary conditions and unusual inputs
- ✅ **Error conditions** - How the app handles failures
- ✅ **Data integrity** - Information is preserved correctly
- ✅ **Performance** - App remains responsive
- ✅ **Accessibility** - Works across devices and input methods
- ✅ **Security** - Input validation and XSS prevention

---

## 11. WCAG 2.1 AA Accessibility Testing Prompt

```

Generate comprehensive Playwright accessibility tests that verify WCAG 2.1 AA compliance for ALL PAGES/COMPONENTS in the application using industry-standard accessibility testing patterns:

**CRITICAL: Test Complete Application Coverage**

- Test ALL pages in the application (home, forms, profiles, etc.)
- Use a loop structure to test each page systematically
- Define APPLICATION_PAGES array with all routes to test
- Ensure each page passes all WCAG 2.1 AA criteria individually

**Application Pages Coverage Example:**

```typescript
const APPLICATION_PAGES = [
  { name: 'Home Page', url: 'http://localhost:3000' },
  { name: 'Add Profile Page', url: 'http://localhost:3000/add-profile.html' },
  { name: 'Profile Page', url: 'http://localhost:3000/profile.html' },
  // Add all your application pages here
];

for (const pageInfo of APPLICATION_PAGES) {
  test.describe(`${pageInfo.name} Accessibility Tests`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(pageInfo.url);
    });
    // Individual tests for each page
  });
}
```

**Required WCAG 2.1 AA Testing Areas (for EACH page):**

**1. Keyboard Navigation & Focus Management:**

- Tab order verification: `await page.keyboard.press('Tab')` and check focus indicators
- Skip links functionality: Test "Skip to main content" links
- Focus trap in modals/dialogs: Verify focus doesn't escape interactive components
- Focus restoration: Test focus returns to trigger element after closing modals
- No keyboard traps: Ensure all interactive elements are accessible via keyboard

**2. Screen Reader Compatibility:**

- ARIA labels and descriptions: `expect(await page.locator('[role="button"]').getAttribute('aria-label')).toBeTruthy()`
- Landmark roles: Verify main, navigation, banner, contentinfo roles exist
- Heading structure: Test logical h1-h6 hierarchy without skipping levels
- Live regions: Test aria-live announcements for dynamic content
- Form labeling: Verify all inputs have associated labels or aria-labelledby

**3. Color Contrast & Visual Accessibility:**

- Text contrast ratios: Test minimum 4.5:1 for normal text, 3:1 for large text
- Interactive element contrast: Test 3:1 minimum for UI components
- Color independence: Verify information isn't conveyed by color alone
- Focus indicators: Test visible focus rings meet 3:1 contrast ratio
- Non-text contrast: Icons and graphics meet accessibility requirements

**4. Responsive & Zoom Accessibility:**

- 200% zoom functionality: Test content remains usable at 200% zoom
- Mobile accessibility: Test touch targets are minimum 44x44px
- Horizontal scrolling: Verify no horizontal scroll at 320px width
- Content reflow: Test content adapts without loss of information

**5. Error Handling & Form Accessibility:**

- Error identification: Test aria-invalid and error message association
- Error suggestions: Verify helpful error correction suggestions
- Required field indicators: Test aria-required and visual indicators
- Input purpose identification: Test autocomplete attributes where appropriate

**Test Implementation Patterns:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('WCAG 2.1 AA Accessibility Compliance', () => {
  test('keyboard navigation and focus management', async ({ page }) => {
    await page.goto('/your-page');

    // Test tab order
    const focusableElements = await page
      .locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')
      .all();

    for (let i = 0; i < focusableElements.length; i++) {
      await page.keyboard.press('Tab');
      const activeElement = await page.evaluate(() =>
        document.activeElement?.tagName.toLowerCase()
      );
      expect(activeElement).toBeTruthy();
    }

    // Test skip links
    await page.keyboard.press('Tab');
    const skipLink = page.locator('[href="#main-content"]').first();
    await expect(skipLink).toBeVisible();
    await skipLink.click();
    const mainContent = await page.locator('#main-content').isVisible();
    expect(mainContent).toBe(true);
  });

  test('ARIA labels and semantic structure', async ({ page }) => {
    await page.goto('/your-page');

    // Test landmark roles
    await expect(page.locator('[role="main"], main')).toBeVisible();
    await expect(page.locator('[role="navigation"], nav')).toBeVisible();

    // Test heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;

    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const currentLevel = parseInt(tagName.charAt(1));
      expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = currentLevel;
    }

    // Test form labels
    const inputs = await page.locator('input:not([type="hidden"])').all();
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        const id = el.id;
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        return !!(ariaLabel || ariaLabelledby || label);
      });
      expect(hasLabel).toBe(true);
    }
  });

  test('color contrast and visual accessibility', async ({ page }) => {
    await page.goto('/your-page');

    // Test focus indicators are visible
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      await button.focus();
      const focusVisible = await button.evaluate(el => {
        const styles = window.getComputedStyle(el, ':focus');
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });
      expect(focusVisible).toBe(true);
    }

    // Test minimum touch target sizes on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    const interactiveElements = await page.locator('button, input, select, a[href]').all();

    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('screen reader announcements and live regions', async ({ page }) => {
    await page.goto('/your-page');

    // Test live regions exist for dynamic content
    const liveRegions = await page.locator('[aria-live]').count();
    expect(liveRegions).toBeGreaterThan(0);

    // Test status messages have appropriate roles
    await expect(
      page.locator('[role="status"], [role="alert"], [aria-live="polite"], [aria-live="assertive"]')
    ).toBeVisible();

    // Test form error announcements
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      await form.locator('input[required]').first().fill('');
      await form.locator('button[type="submit"]').click();

      const errorMessage = await page.locator('[role="alert"], .error-message').first();
      await expect(errorMessage).toBeVisible();

      const hasAriaDescribedby = await page
        .locator('input[required]')
        .first()
        .getAttribute('aria-describedby');
      expect(hasAriaDescribedby).toBeTruthy();
    }
  });

  test('responsive accessibility and zoom support', async ({ page }) => {
    await page.goto('/your-page');

    // Test 200% zoom
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });

    // Verify content is still usable
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('button').first()).toBeVisible();

    // Test 320px viewport (mobile accessibility)
    await page.setViewportSize({ width: 320, height: 568 });

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('error prevention and recovery', async ({ page }) => {
    await page.goto('/your-page');

    // Test form validation provides helpful error messages
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      const emailInput = form.locator('input[type="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email');
        await form.locator('button[type="submit"]').click();

        // Check for descriptive error message
        const errorMessage = await page.locator('[role="alert"], .error-message').textContent();
        expect(errorMessage?.toLowerCase()).toContain('email');

        // Test error is associated with input
        const ariaDescribedby = await emailInput.getAttribute('aria-describedby');
        expect(ariaDescribedby).toBeTruthy();
      }
    }
  });
});
```

**Automated Accessibility Testing Integration:**

- Use @axe-core/playwright for automated WCAG scanning
- Integrate Pa11y for command-line accessibility testing
- Add Lighthouse accessibility audits to CI/CD pipeline
- Test with actual screen readers (NVDA, JAWS, VoiceOver) when possible

**Manual Testing Checklist:**

- Navigate entire application using only keyboard
- Test with screen reader software
- Verify at 200% browser zoom
- Test with high contrast mode enabled
- Validate with users who have disabilities

**WCAG 2.1 AA Success Criteria Coverage:**

- ✅ 1.3.1 Info and Relationships
- ✅ 1.4.3 Contrast (Minimum)
- ✅ 2.1.1 Keyboard accessible
- ✅ 2.1.2 No Keyboard Trap
- ✅ 2.4.1 Bypass Blocks
- ✅ 2.4.3 Focus Order
- ✅ 2.4.6 Headings and Labels
- ✅ 2.4.7 Focus Visible
- ✅ 3.1.1 Language of Page
- ✅ 3.2.1 On Focus
- ✅ 3.2.2 On Input
- ✅ 3.3.1 Error Identification
- ✅ 3.3.2 Labels or Instructions
- ✅ 4.1.1 Parsing
- ✅ 4.1.2 Name, Role, Value

````

**Dependencies to Install:**
```bash
npm install --save-dev @axe-core/playwright pa11y lighthouse
````

**Use Case:** Essential for ensuring your ENTIRE application meets accessibility standards and is usable by people with disabilities across ALL pages and user journeys. Tests every page systematically to ensure complete WCAG 2.1 AA compliance. Required for government projects, enterprise applications, and inclusive design practices.

## 🚀 Continuous Improvement

These prompts evolve with our testing practices. When you discover new patterns or improve existing ones:

1. Update the relevant prompt
2. Document the improvement
3. Share with the team
4. Test the updated pattern in CI/CD

---

_Generated for test-spec-kit project - A comprehensive QA team profile management application with 45 Playwright tests and full CI/CD integration._

```

```
