/**
 * E2E tests for Quiz functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Quiz Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to quiz page
    await page.goto('/en/quiz');
  });

  test('should load quiz page', async ({ page }) => {
    await expect(page).toHaveTitle(/Quiz/i);
  });

  test('should display mode selection', async ({ page }) => {
    await expect(page.getByText(/practice mode/i)).toBeVisible();
    await expect(page.getByText(/test mode/i)).toBeVisible();
  });

  test('should display category selection in practice mode', async ({ page }) => {
    // Click practice mode
    await page.getByText(/practice mode/i).click();
    await page.waitForURL(/mode=practice/);

    // Should show category buttons
    await expect(page.getByText(/government/i)).toBeVisible();
    await expect(page.getByText(/history/i)).toBeVisible();
    await expect(page.getByText(/civics/i)).toBeVisible();
  });

  test('should start quiz when category is selected', async ({ page }) => {
    // Navigate to practice mode with category
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Should show question
    const questionText = page.locator('h2').first();
    await expect(questionText).toBeVisible();
    expect(await questionText.textContent()).toBeTruthy();
  });

  test('should display progress bar', async ({ page }) => {
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Should show progress information
    await expect(page.getByText(/question/i)).toBeVisible();
    await expect(page.getByText(/%/)).toBeVisible();
  });

  test('should allow selecting an answer', async ({ page }) => {
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Wait for options to appear
    const firstOption = page.locator('button').filter({ hasText: /./ }).first();
    await expect(firstOption).toBeVisible();

    // Click first option
    await firstOption.click();

    // Option should be selected (visual feedback)
    await expect(firstOption).toHaveClass(/bg-blue/);
  });

  test('should show feedback in practice mode', async ({ page }) => {
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Select an answer
    const options = page.locator('button').filter({ hasText: /./ });
    await options.first().click();

    // Should show feedback (correct/incorrect indicators)
    await page.waitForTimeout(500); // Wait for feedback animation
    const feedback = page.locator('[class*="green"], [class*="red"]');
    await expect(feedback.first()).toBeVisible();
  });

  test('should navigate to next question', async ({ page }) => {
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Answer first question
    const options = page.locator('button').filter({ hasText: /./ });
    await options.first().click();
    await page.waitForTimeout(500);

    // Click next button
    const nextButton = page.getByRole('button', { name: /next/i });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Should show next question
    await page.waitForTimeout(500);
    const questionText = page.locator('h2').first();
    await expect(questionText).toBeVisible();
  });

  test('should show results after completing quiz', async ({ page }) => {
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Answer all questions (assuming 10 questions)
    for (let i = 0; i < 10; i++) {
      const options = page.locator('button').filter({ hasText: /./ });
      const firstOption = options.first();
      await expect(firstOption).toBeVisible();
      await firstOption.click();
      await page.waitForTimeout(300);

      if (i < 9) {
        // Not the last question
        const nextButton = page.getByRole('button', { name: /next|view results/i });
        await nextButton.click();
        await page.waitForTimeout(500);
      } else {
        // Last question - click view results
        const viewResultsButton = page.getByRole('button', { name: /view results/i });
        await viewResultsButton.click();
      }
    }

    // Should show results page
    await page.waitForTimeout(1000);
    await expect(page.getByText(/score|pass|fail/i)).toBeVisible();
  });

  test('should persist answers in localStorage', async ({ page }) => {
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Answer a question
    const options = page.locator('button').filter({ hasText: /./ });
    await options.first().click();
    await page.waitForTimeout(500);

    // Check localStorage
    const storageKey = 'en:practice:gov:answers';
    const storedData = await page.evaluate((key) => {
      return localStorage.getItem(key);
    }, storageKey);

    expect(storedData).toBeTruthy();
    expect(JSON.parse(storedData || '{}')).toHaveProperty('answers');
  });

  test('should load persisted answers on page reload', async ({ page }) => {
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Answer a question
    const options = page.locator('button').filter({ hasText: /./ });
    await options.first().click();
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Answer should be persisted (button should show selected state)
    const selectedOption = page.locator('button[class*="bg-blue"]');
    await expect(selectedOption.first()).toBeVisible();
  });
});
