const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Manual Scenarios & Evidence Capture', () => {
  const evidenceDir = path.join(__dirname, '..', 'evidence');

  test.beforeAll(() => {
    if (!fs.existsSync(evidenceDir)) {
      fs.mkdirSync(evidenceDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  /**
   * Scenario 1: Manually test an empty cart checkout attempt
   */
  test('Scenario 1: Empty cart blocks checkout with validation message', async ({ page }) => {
    await expect(page.getByTestId('empty-cart-message')).toBeVisible();

    await page.getByTestId('name-input').fill('Yash Sharma');
    await page.getByTestId('place-order-btn').click();

    const errorAlert = page.getByTestId('error-message');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText(
      'Your cart is empty. Please add items before checking out.'
    );

    // Capture visual evidence
    await page.screenshot({
      path: path.join(evidenceDir, 'empty-cart-blocked.png'),
      fullPage: true,
    });
  });

  /**
   * Scenario 2: Rapid double-click on Place Order must not produce duplicate orders
   */
  test('Scenario 2: Rapid double-click produces exactly one order confirmation', async ({ page }) => {
    await page.getByTestId('add-tshirt').click();
    await page.getByTestId('name-input').fill('Yash Sharma');

    const placeOrderBtn = page.getByTestId('place-order-btn');
    await placeOrderBtn.dblclick();

    const confirmation = page.getByTestId('confirmation');
    await expect(confirmation).toBeVisible();

    // Verify exactly ONE order reference is generated
    const orderRefs = page.getByTestId('order-ref');
    await expect(orderRefs).toHaveCount(1);

    // Capture visual evidence of successful single order
    await page.screenshot({
      path: path.join(evidenceDir, 'double-click-protected.png'),
      fullPage: true,
    });
  });

  /**
   * Scenario 3: Successful order confirmation screenshot
   */
  test('Scenario 3: Capture successful checkout confirmation evidence', async ({ page }) => {
    await page.getByTestId('add-tshirt').click();
    await page.getByTestId('add-shoes').click();
    await page.getByTestId('name-input').fill('Yash Sharma');
    await page.getByTestId('place-order-btn').click();

    await expect(page.getByTestId('confirmation')).toBeVisible();

    await page.screenshot({
      path: path.join(evidenceDir, 'successful-checkout.png'),
      fullPage: true,
    });
  });
});
