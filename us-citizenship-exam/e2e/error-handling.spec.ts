/**
 * E2E tests for error handling scenarios
 */

import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should display error boundary when data fails to load', async ({ page }) => {
    // Intercept and fail the data request
    await page.route('**/data/questions/**/*.json', (route) => {
      route.abort('failed');
    });

    await page.goto('/en/quiz');
    
    // Should show error boundary
    await expect(page.getByText(/Something went wrong/i)).toBeVisible();
    await expect(page.getByText(/Try again/i)).toBeVisible();
  });

  test('should allow retry after error', async ({ page }) => {
    let requestCount = 0;
    
    // Fail first request, succeed on retry
    await page.route('**/data/questions/**/*.json', (route) => {
      requestCount++;
      if (requestCount === 1) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    await page.goto('/en/quiz');
    
    // Wait for error
    await expect(page.getByText(/Something went wrong/i)).toBeVisible();
    
    // Click retry
    await page.getByText(/Try again/i).click();
    
    // Should eventually load successfully
    await expect(page.getByText(/Quiz/i)).toBeVisible({ timeout: 10000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/data/**', (route) => {
      route.abort('internetdisconnected');
    });

    await page.goto('/en/flashcards');
    
    // Should show error message
    await expect(page.getByText(/Something went wrong/i)).toBeVisible();
  });
});
