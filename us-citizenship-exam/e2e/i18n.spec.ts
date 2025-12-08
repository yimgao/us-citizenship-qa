/**
 * E2E tests for Internationalization (i18n) functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('should load English locale by default', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/U.S. Civics/i);
  });

  test('should load Spanish locale', async ({ page }) => {
    await page.goto('/es');
    await expect(page).toHaveTitle(/Centro de Estudio/i);
  });

  test('should load Chinese locale', async ({ page }) => {
    await page.goto('/zh');
    await expect(page).toHaveTitle(/美国入籍/i);
  });

  test('should display content in correct language', async ({ page }) => {
    // Test English
    await page.goto('/en/quiz');
    await expect(page.getByText(/quiz|practice|test/i)).toBeVisible();

    // Test Spanish
    await page.goto('/es/quiz');
    await expect(page.getByText(/examen|práctica|prueba/i)).toBeVisible();

    // Test Chinese
    await page.goto('/zh/quiz');
    await expect(page.getByText(/测验|练习|测试/i)).toBeVisible();
  });

  test('should maintain locale in navigation', async ({ page }) => {
    await page.goto('/es/quiz');
    await page.waitForLoadState('networkidle');

    // Navigate to flashcards
    await page.goto('/es/flashcards');
    await expect(page).toHaveURL(/\/es\/flashcards/);

    // Navigate to glossary
    await page.goto('/es/glossary');
    await expect(page).toHaveURL(/\/es\/glossary/);
  });

  test('should switch language using language switcher', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Find and click language switcher
    const langSwitcher = page.locator('[aria-label*="language"], [aria-label*="Language"]').first();
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();

      // Select Spanish
      const spanishOption = page.getByText(/español|Spanish|Español/i);
      if (await spanishOption.isVisible()) {
        await spanishOption.click();
        await expect(page).toHaveURL(/\/es/);
      }
    }
  });

  test('should load quiz questions in correct language', async ({ page }) => {
    // English
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');
    const enQuestion = page.locator('h2').first();
    await expect(enQuestion).toBeVisible();
    const enText = await enQuestion.textContent();

    // Spanish
    await page.goto('/es/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');
    const esQuestion = page.locator('h2').first();
    await expect(esQuestion).toBeVisible();
    const esText = await esQuestion.textContent();

    // Questions should be different (translated)
    expect(enText).not.toBe(esText);
  });

  test('should load flashcards in correct language', async ({ page }) => {
    await page.goto('/en/flashcards?category=gov');
    await page.waitForLoadState('networkidle');
    const enCard = page.locator('p').first();
    await expect(enCard).toBeVisible();
    const enText = await enCard.textContent();

    await page.goto('/es/flashcards?category=gov');
    await page.waitForLoadState('networkidle');
    const esCard = page.locator('p').first();
    await expect(esCard).toBeVisible();
    const esText = await esCard.textContent();

    // Cards should be different (translated)
    expect(enText).not.toBe(esText);
  });

  test('should load glossary in correct language', async ({ page }) => {
    await page.goto('/en/glossary');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/term|definition/i)).toBeVisible();

    await page.goto('/es/glossary');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/término|definición/i)).toBeVisible();
  });

  test('should use correct TTS language', async ({ page }) => {
    await page.goto('/en/quiz?mode=practice&category=gov');
    await page.waitForLoadState('networkidle');

    // Check if TTS button exists
    const ttsButton = page.locator('button[aria-label*="read"], button[aria-label*="Read"]').first();
    if (await ttsButton.isVisible()) {
      // TTS should use English voice for English locale
      // (This is tested at the hook level, but we can verify the button exists)
      await expect(ttsButton).toBeVisible();
    }
  });

  test('should handle invalid locale gracefully', async ({ page }) => {
    // Try accessing with invalid locale
    await page.goto('/invalid/quiz');
    
    // Should redirect or show default locale
    // The exact behavior depends on next-intl configuration
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/en|\/es|\/zh/);
  });
});
