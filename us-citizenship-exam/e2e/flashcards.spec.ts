/**
 * E2E tests for Flashcards functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Flashcards Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/flashcards');
  });

  test('should load flashcards page', async ({ page }) => {
    await expect(page).toHaveTitle(/Flashcards/i);
  });

  test('should display category selection', async ({ page }) => {
    await expect(page.getByText(/all/i)).toBeVisible();
    await expect(page.getByText(/government/i)).toBeVisible();
    await expect(page.getByText(/history/i)).toBeVisible();
    await expect(page.getByText(/civics/i)).toBeVisible();
  });

  test('should display flashcard when category is selected', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Should show flashcard
    const card = page.locator('[class*="aspect-[4/3]"]');
    await expect(card).toBeVisible();
  });

  test('should show question on front side', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Should show question text
    const questionText = page.locator('p').filter({ hasText: /./ }).first();
    await expect(questionText).toBeVisible();
  });

  test('should flip card to show answer when clicked', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Click on card to flip
    const card = page.locator('[class*="cursor-pointer"]').first();
    await card.click();

    // Wait for flip animation
    await page.waitForTimeout(800);

    // Should show answer
    await expect(page.getByText(/answer/i)).toBeVisible();
  });

  test('should display filters', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Should show filter buttons
    await expect(page.getByText(/all/i)).toBeVisible();
    await expect(page.getByText(/starred/i)).toBeVisible();
    await expect(page.getByText(/missed/i)).toBeVisible();
  });

  test('should filter by starred cards', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Click starred filter
    const starredButton = page.getByText(/starred/i);
    await starredButton.click();

    // Should update filter (may show no cards if none are starred)
    await page.waitForTimeout(500);
  });

  test('should navigate to next card', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Get first card text
    const firstCardText = await page.locator('p').first().textContent();

    // Click next button
    const nextButton = page.getByRole('button', { name: /next/i });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Should show different card
    await page.waitForTimeout(500);
    const newCardText = await page.locator('p').first().textContent();
    expect(newCardText).not.toBe(firstCardText);
  });

  test('should navigate to previous card', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Go to next card first
    const nextButton = page.getByRole('button', { name: /next/i });
    await nextButton.click();
    await page.waitForTimeout(500);

    const secondCardText = await page.locator('p').first().textContent();

    // Click previous button
    const prevButton = page.getByRole('button', { name: /previous/i });
    await prevButton.click();

    // Should show previous card
    await page.waitForTimeout(500);
    const firstCardText = await page.locator('p').first().textContent();
    expect(firstCardText).not.toBe(secondCardText);
  });

  test('should toggle star on card', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Click star button
    const starButton = page.getByRole('button', { name: /star/i });
    await expect(starButton).toBeVisible();
    await starButton.click();

    // Button text should change
    await expect(starButton).toHaveText(/starred/i);
  });

  test('should display progress', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    // Should show progress information
    await expect(page.getByText(/card/i)).toBeVisible();
    await expect(page.getByText(/%/)).toBeVisible();
  });

  test('should handle swipe gestures', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');

    const card = page.locator('[class*="cursor-pointer"]').first();
    const firstCardText = await page.locator('p').first().textContent();

    // Simulate swipe left
    await card.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0);
    await page.mouse.up();

    // Should navigate to next card
    await page.waitForTimeout(500);
    const newCardText = await page.locator('p').first().textContent();
    expect(newCardText).not.toBe(firstCardText);
  });
});
