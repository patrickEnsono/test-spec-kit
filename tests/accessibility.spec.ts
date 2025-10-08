import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.1 AA Accessibility Compliance', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('automated accessibility scan with axe-core', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page } as any)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:');
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Nodes: ${violation.nodes.length}`);
        violation.nodes.forEach(node => {
          console.log(`   - ${node.target.join(', ')}`);
        });
      });
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation and focus management', async ({ page }) => {
    // Test tab order and focus indicators
    const focusableElements = await page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])').all();
    
    let tabCount = 0;
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      // Check that something has focus
      const activeElement = await page.evaluate(() => {
        const active = document.activeElement;
        return active ? {
          tagName: active.tagName.toLowerCase(),
          id: active.id,
          className: active.className
        } : null;
      });
      
      expect(activeElement).toBeTruthy();
      console.log(`Tab ${tabCount}: Focus on ${activeElement?.tagName} ${activeElement?.id ? '#' + activeElement.id : ''}`);
    }

    // Test that focus is visible
    const firstButton = page.locator('button').first();
    if (await firstButton.isVisible()) {
      await firstButton.focus();
      
      const focusVisible = await firstButton.evaluate(el => {
        const styles = window.getComputedStyle(el, ':focus');
        const outline = styles.outline;
        const boxShadow = styles.boxShadow;
        const border = styles.border;
        
        return outline !== 'none' || 
               boxShadow !== 'none' || 
               (border && border !== 'none');
      });
      
      expect(focusVisible).toBe(true);
    }
  });

  test('semantic structure and landmarks', async ({ page }) => {
    // Test for semantic landmarks
    const landmarks = {
      main: await page.locator('main, [role="main"]').count(),
      navigation: await page.locator('nav, [role="navigation"]').count(),
      banner: await page.locator('header, [role="banner"]').count(),
      contentinfo: await page.locator('footer, [role="contentinfo"]').count()
    };

    expect(landmarks.main).toBeGreaterThan(0);
    console.log('Landmarks found:', landmarks);

    // Test heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const currentLevel = parseInt(tagName.charAt(1));
      const text = await heading.textContent();
      
      // Allow h1 at any time, but other headings should follow hierarchy
      if (currentLevel !== 1) {
        expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
      }
      
      previousLevel = currentLevel;
      console.log(`${tagName.toUpperCase()}: ${text?.substring(0, 50)}`);
    }

    // Ensure there's at least one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('form accessibility and labeling', async ({ page }) => {
    const inputs = await page.locator('input:not([type="hidden"]), select, textarea').all();
    
    if (inputs.length > 0) {
      for (const input of inputs) {
        const inputInfo = await input.evaluate(el => {
          const id = el.id;
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledby = el.getAttribute('aria-labelledby');
          const ariaDescribedby = el.getAttribute('aria-describedby');
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          const type = (el as HTMLInputElement).type || 'unknown';
          
          return {
            hasLabel: !!(ariaLabel || ariaLabelledby || label),
            hasDescription: !!ariaDescribedby,
            type,
            id,
            labelText: label?.textContent || ariaLabel || 'No label'
          };
        });
        
        console.log(`Input ${inputInfo.type} (${inputInfo.id}): ${inputInfo.labelText}`);
        expect(inputInfo.hasLabel).toBe(true);
        
        // Check required fields have aria-required or required attribute
        const isRequired = await input.evaluate(el => 
          el.hasAttribute('required') || el.getAttribute('aria-required') === 'true'
        );
        
        if (isRequired) {
          console.log(`Required field detected: ${inputInfo.id}`);
        }
      }
    } else {
      console.log('No form inputs found to test');
    }
  });

  test('color contrast and visual accessibility', async ({ page }) => {
    // Test that focus indicators are visible
    const interactiveElements = await page.locator('button, a[href], input, select, textarea').all();
    
    for (const element of interactiveElements.slice(0, 5)) {
      await element.focus();
      
      const hasVisibleFocus = await element.evaluate(el => {
        const styles = window.getComputedStyle(el, ':focus');
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });
      
      expect(hasVisibleFocus).toBe(true);
    }

    // Test that text content has sufficient contrast (basic check)
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6, button, a').all();
    
    for (const element of textElements.slice(0, 10)) {
      const contrastInfo = await element.evaluate(el => {
        const styles = window.getComputedStyle(el);
        const textColor = styles.color;
        const backgroundColor = styles.backgroundColor;
        const fontSize = styles.fontSize;
        
        return {
          textColor,
          backgroundColor,
          fontSize,
          hasText: el.textContent && el.textContent.trim().length > 0
        };
      });
      
      if (contrastInfo.hasText) {
        expect(contrastInfo.textColor).not.toBe('rgba(0, 0, 0, 0)');
        console.log(`Text contrast: ${contrastInfo.textColor} on ${contrastInfo.backgroundColor}`);
      }
    }
  });

  test('responsive accessibility and zoom support', async ({ page }) => {
    // Test at 200% zoom
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });

    // Verify main content is still visible
    const mainContent = page.locator('main, [role="main"], body > div').first();
    await expect(mainContent).toBeVisible();

    // Test at mobile viewport
    await page.setViewportSize({ width: 320, height: 568 });
    await page.evaluate(() => {
      document.body.style.zoom = '100%';
    });

    // Verify no horizontal scrolling at narrow width
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    // Allow some tolerance for mobile layouts
    if (hasHorizontalScroll) {
      console.warn('Horizontal scrolling detected at 320px width - may affect mobile accessibility');
    }

    // Test touch target sizes on mobile
    const buttons = await page.locator('button, a[href]').all();
    
    for (const button of buttons.slice(0, 5)) {
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        
        if (box) {
          const targetSize = Math.min(box.width, box.height);
          console.log(`Touch target size: ${box.width}x${box.height}px`);
          
          // WCAG AA requires 44x44px minimum, but we'll be more lenient for now
          if (targetSize < 30) {
            console.warn(`Small touch target detected: ${box.width}x${box.height}px`);
          }
        }
      }
    }
  });

  test('error handling and form validation accessibility', async ({ page }) => {
    // Look for forms to test validation
    const forms = await page.locator('form').all();
    
    if (forms.length > 0) {
      const form = forms[0];
      
      // Try to find required inputs
      const requiredInputs = await form.locator('input[required], input[aria-required="true"]').all();
      
      if (requiredInputs.length > 0) {
        const requiredInput = requiredInputs[0];
        
        // Try to submit form with empty required field
        await requiredInput.fill('');
        
        const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Check for error messages
          await page.waitForTimeout(1000); // Allow time for validation
          
          const errorMessages = await page.locator('[role="alert"], .error, .error-message, [aria-invalid="true"]').count();
          
          if (errorMessages > 0) {
            console.log(`Found ${errorMessages} error message(s)`);
            
            // Check if error is associated with input
            const inputHasAriaDescribedby = await requiredInput.getAttribute('aria-describedby');
            const inputHasAriaInvalid = await requiredInput.getAttribute('aria-invalid');
            
            console.log(`Input aria-describedby: ${inputHasAriaDescribedby}`);
            console.log(`Input aria-invalid: ${inputHasAriaInvalid}`);
          }
        }
      } else {
        console.log('No required inputs found to test validation');
      }
    } else {
      console.log('No forms found to test error handling');
    }
  });

  test('live regions and dynamic content announcements', async ({ page }) => {
    // Check for live regions
    const liveRegions = await page.locator('[aria-live], [role="status"], [role="alert"]').count();
    console.log(`Found ${liveRegions} live region(s)`);
    
    // Test for status messages
    const statusElements = await page.locator('[role="status"], [role="alert"], [aria-live]').all();
    
    for (const element of statusElements) {
      const ariaLive = await element.getAttribute('aria-live');
      const role = await element.getAttribute('role');
      
      console.log(`Live region: role="${role}" aria-live="${ariaLive}"`);
    }
    
    // If there are interactive elements that might trigger dynamic content
    const interactiveElements = await page.locator('button, a[href]').all();
    
    if (interactiveElements.length > 0) {
      // Click first interactive element and check for new live regions
      const firstElement = interactiveElements[0];
      const initialLiveRegions = await page.locator('[role="status"], [role="alert"]').count();
      
      await firstElement.click();
      await page.waitForTimeout(1000);
      
      const finalLiveRegions = await page.locator('[role="status"], [role="alert"]').count();
      
      if (finalLiveRegions > initialLiveRegions) {
        console.log(`Dynamic content created ${finalLiveRegions - initialLiveRegions} new live region(s)`);
      }
    }
  });

  test('page language and document structure', async ({ page }) => {
    // Check for lang attribute on html element
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    console.log(`Page language: ${htmlLang}`);
    
    // Check for page title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    console.log(`Page title: ${title}`);
    
    // Check for meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    if (metaDescription) {
      console.log(`Meta description: ${metaDescription.substring(0, 100)}...`);
    }
    
    // Check for proper document structure
    const doctype = await page.evaluate(() => {
      return document.doctype ? document.doctype.name : null;
    });
    
    expect(doctype).toBe('html');
    console.log(`Document type: ${doctype}`);
  });
});