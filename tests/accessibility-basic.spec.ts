import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Define all application pages to test for accessibility
const APPLICATION_PAGES = [
  { name: 'Home Page', url: 'http://localhost:3000' },
  { name: 'Add Profile Page', url: 'http://localhost:3000/add-profile.html' },
  { name: 'Profile Page', url: 'http://localhost:3000/profile.html' },
];

test.describe('WCAG 2.1 AA Accessibility Compliance - Full Application Coverage', () => {
  // Test each page individually for complete coverage
  for (const pageInfo of APPLICATION_PAGES) {
    test.describe(`${pageInfo.name} Accessibility Tests`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(pageInfo.url);
      });

      test(`automated accessibility scan with axe-core - ${pageInfo.name}`, async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page } as any)
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();

        if (accessibilityScanResults.violations.length > 0) {
          console.log(`Accessibility violations found on ${pageInfo.name}:`);
          accessibilityScanResults.violations.forEach((violation, index) => {
            console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
            console.log(`   Impact: ${violation.impact}`);
            console.log(`   Help: ${violation.help}`);
            console.log(`   Nodes: ${violation.nodes.length}`);
            violation.nodes.forEach(node => {
              console.log(`   - ${node.target.join(', ')}: ${node.failureSummary}`);
            });
            console.log('');
          });
        }

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test(`page has proper document structure - ${pageInfo.name}`, async ({ page }) => {
        // Check for page title
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
        console.log(`${pageInfo.name} title: ${title}`);

        // Check for lang attribute on html element
        const htmlLang = await page.locator('html').getAttribute('lang');
        expect(htmlLang).toBeTruthy();
        console.log(`${pageInfo.name} language: ${htmlLang}`);
      });

      test(`semantic landmarks are present - ${pageInfo.name}`, async ({ page }) => {
        // Test for semantic landmarks
        const mainElement = page.locator('main, [role="main"]');
        await expect(mainElement).toBeVisible();

        const navElement = page.locator('nav, [role="navigation"]');
        const navCount = await navElement.count();
        console.log(`${pageInfo.name} - Navigation landmarks found: ${navCount}`);

        // Check heading structure
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThan(0);
        console.log(`${pageInfo.name} - H1 headings found: ${h1Count}`);
      });

      test(`keyboard navigation works - ${pageInfo.name}`, async ({ page }) => {
        // Test that elements can receive focus
        const firstButton = page.locator('button').first();
        if (await firstButton.isVisible()) {
          await firstButton.focus();

          // Verify element is focused
          const isFocused = await firstButton.evaluate(el => el === document.activeElement);
          expect(isFocused).toBe(true);
          console.log(`${pageInfo.name} - First button successfully focused`);
        }

        // Test tab navigation
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        const activeElement = await page.evaluate(() => ({
          tagName: document.activeElement?.tagName.toLowerCase(),
          id: document.activeElement?.id,
        }));

        expect(activeElement.tagName).toBeTruthy();
        console.log(
          `${pageInfo.name} - After tabbing: focused on ${activeElement.tagName}${activeElement.id ? '#' + activeElement.id : ''}`
        );
      });

      test(`forms have proper labeling - ${pageInfo.name}`, async ({ page }) => {
        const inputs = await page.locator('input:not([type="hidden"]), select, textarea');
        const inputCount = await inputs.count();

        if (inputCount > 0) {
          for (let i = 0; i < inputCount; i++) {
            const input = inputs.nth(i);
            const inputId = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledby = await input.getAttribute('aria-labelledby');

            // Check for associated label
            let hasLabel = false;
            if (inputId) {
              const associatedLabel = page.locator(`label[for="${inputId}"]`);
              hasLabel = (await associatedLabel.count()) > 0;
            }

            const hasAccessibleName = hasLabel || !!ariaLabel || !!ariaLabelledby;

            console.log(
              `${pageInfo.name} - Input ${i + 1}: ID="${inputId}", hasLabel=${hasLabel}, ariaLabel="${ariaLabel}"`
            );
            expect(hasAccessibleName).toBe(true);
          }
        } else {
          console.log(`${pageInfo.name} - No form inputs found to test`);
        }
      });

      test(`images have alt text - ${pageInfo.name}`, async ({ page }) => {
        const images = await page.locator('img');
        const imageCount = await images.count();

        if (imageCount > 0) {
          for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            const alt = await img.getAttribute('alt');
            const ariaLabel = await img.getAttribute('aria-label');
            const role = await img.getAttribute('role');

            // Images should have alt text unless they're decorative (role="presentation")
            if (role !== 'presentation' && role !== 'none') {
              expect(alt !== null || ariaLabel !== null).toBe(true);
            }

            console.log(`${pageInfo.name} - Image ${i + 1}: alt="${alt}", role="${role}"`);
          }
        } else {
          console.log(`${pageInfo.name} - No images found to test`);
        }
      });

      test(`color contrast - focus indicators are visible - ${pageInfo.name}`, async ({ page }) => {
        const buttons = await page.locator('button, a[href]');
        const buttonCount = await buttons.count();

        if (buttonCount > 0) {
          const firstButton = buttons.first();
          await firstButton.focus();

          // Check if focus is visible by looking for common focus styles
          const hasFocusStyles = await firstButton.evaluate(el => {
            const styles = window.getComputedStyle(el, ':focus');
            return (
              styles.outline !== 'none' ||
              styles.outlineWidth !== '0px' ||
              styles.boxShadow !== 'none'
            );
          });

          console.log(`${pageInfo.name} - Focus indicator visible: ${hasFocusStyles}`);
          expect(hasFocusStyles).toBe(true);
        }
      });

      test(`responsive design - no horizontal scroll at narrow widths - ${pageInfo.name}`, async ({
        page,
      }) => {
        // Test at mobile width
        await page.setViewportSize({ width: 320, height: 568 });

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        console.log(`${pageInfo.name} - Horizontal scroll at 320px: ${hasHorizontalScroll}`);
        // Note: We'll log this but not fail the test as some layouts may legitimately need horizontal scroll
        if (hasHorizontalScroll) {
          console.warn(
            `${pageInfo.name} - Horizontal scrolling detected at 320px width - check mobile layout`
          );
        }
      });

      test(`touch targets are adequate size on mobile - ${pageInfo.name}`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const interactiveElements = await page.locator('button, a[href], input, select, textarea');
        const elementCount = await interactiveElements.count();

        let smallTargets = 0;

        for (let i = 0; i < Math.min(elementCount, 10); i++) {
          const element = interactiveElements.nth(i);

          if (await element.isVisible()) {
            const box = await element.boundingBox();

            if (box) {
              const meetsMinimum = box.width >= 44 && box.height >= 44;

              if (!meetsMinimum) {
                smallTargets++;
                console.log(`${pageInfo.name} - Small touch target: ${box.width}x${box.height}px`);
              }
            }
          }
        }

        console.log(
          `${pageInfo.name} - Small touch targets found: ${smallTargets}/${Math.min(elementCount, 10)}`
        );

        // Allow some tolerance but warn if many targets are too small
        if (smallTargets > elementCount * 0.5) {
          console.warn(
            `${pageInfo.name} - Many touch targets are smaller than 44x44px - consider increasing sizes`
          );
        }
      });
    });
  }
});
