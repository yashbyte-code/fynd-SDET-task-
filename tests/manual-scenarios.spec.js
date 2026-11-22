const { test, expect } = require('@playwright/test');

test.describe('Manual Scenarios Verification & Evidence Capture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  /**
   * Scenario 1: Manually test an empty cart checkout attempt
   */
  test('Scenario 1: Empty cart blocks checkout with validation message', async ({ page }) => {
    // Ensure cart is empty
    await expect(page.getByTestId('empty-cart-message')).toBeVisible();

    // Fill customer name
    await page.getByTestId('name-input').fill('Yash Sharma');

    // Click Place Order with empty cart
    await page.getByTestId('place-order-btn').click();

    // Verify error message is shown
    const errorAlert = page.getByTestId('error-message');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText(
      'Your cart is empty. Please add items before checking out.'
    );

    // Verify order was not placed
    await expect(page.getByTestId('confirmation')).not.toBeVisible();
  });

  /**
   * Scenario 2: Rapid double-click on Place Order must not produce duplicate orders
   */
  test('Scenario 2: Rapid double-click produces exactly one order confirmation', async ({ page }) => {
    // Add item to cart
    await page.getByTestId('add-tshirt').click();
    await page.getByTestId('name-input').fill('Yash Sharma');

    const placeOrderBtn = page.getByTestId('place-order-btn');

    // Perform rapid double-click
    await placeOrderBtn.dblclick();

    // Verify confirmation appears
    const confirmation = page.getByTestId('confirmation');
    await expect(confirmation).toBeVisible();

    // Verify exactly ONE order reference element exists
    const orderRefs = page.getByTestId('order-ref');
    await expect(orderRefs).toHaveCount(1);
  });
});

