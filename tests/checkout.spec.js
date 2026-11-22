const { test, expect } = require('@playwright/test');

test.describe('Checkout Page Test Suite', () => {
  // Each test starts from a clean state (fresh page reload)
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Verify initial clean state: cart should be empty
    await expect(page.getByTestId('empty-cart-message')).toBeVisible();
  });

  /**
   * Check 1: Verify a successful checkout produces a confirmation
   * - Add an item to the cart
   * - Enter customer name
   * - Click "Place Order"
   * - Assert that order confirmation screen with reference ID is displayed
   */
  test('Check 1: Successful checkout produces an order confirmation', async ({ page }) => {
    // 1. Add Cotton T-Shirt to cart (₹499)
    await page.getByTestId('add-tshirt').click();

    // Verify item appears in cart
    await expect(page.getByTestId('cart-item-tshirt')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('₹499');

    // 2. Fill in the required Name field
    await page.getByTestId('name-input').fill('Yash Sharma');

    // 3. Click Place Order
    await page.getByTestId('place-order-btn').click();

    // 4. Assert order confirmation is visible and has a reference number
    const confirmation = page.getByTestId('confirmation');
    await expect(confirmation).toBeVisible();
    await expect(confirmation).toContainText('Order Confirmed!');
    await expect(confirmation).toContainText('Yash Sharma');

    // Check order reference starts with ORD-
    const orderRef = page.getByTestId('order-ref');
    await expect(orderRef).toBeVisible();
    await expect(orderRef).toContainText('ORD-');
  });

  /**
   * Check 2: Verify a missing field blocks checkout and preserves customer entered data
   * - Add an item to cart
   * - Leave name field empty
   * - Click "Place Order"
   * - Assert that checkout is blocked with validation message
   * - Assert that cart items remain preserved
   */
  test('Check 2: Missing required field blocks checkout with validation message', async ({ page }) => {
    // 1. Add Running Shoes to cart (₹1,999)
    await page.getByTestId('add-shoes').click();
    await expect(page.getByTestId('cart-item-shoes')).toBeVisible();

    // 2. Leave name input blank and click Place Order
    await page.getByTestId('name-input').fill('');
    await page.getByTestId('place-order-btn').click();

    // 3. Assert error message is visible and specifies the missing name
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Please enter your name.');

    // 4. Assert checkout did NOT proceed: cart remains intact, confirmation is not shown
    await expect(page.getByTestId('confirmation')).not.toBeVisible();
    await expect(page.getByTestId('cart-item-shoes')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('₹1,999');
  });

  /**
   * Check 3: Verify a quantity change updates the exact total
   * - Add an item (e.g. Cotton T-Shirt at ₹499)
   * - Increase quantity to 3
   * - Assert line total updates to ₹1,497 (499 * 3)
   * - Assert overall order total updates to ₹1,497
   * - Add another item (Shoes at ₹1,999)
   * - Assert overall order total updates to ₹3,496 (1,497 + 1,999)
   * - Decrease quantity of T-Shirt by 1 (qty = 2)
   * - Assert order total updates to ₹2,997 (499 * 2 + 1,999)
   */
  test('Check 3: Quantity change updates line total and exact order total', async ({ page }) => {
    // 1. Add Cotton T-Shirt (₹499)
    await page.getByTestId('add-tshirt').click();
    await expect(page.getByTestId('line-total-tshirt')).toHaveText('₹499');
    await expect(page.getByTestId('order-total')).toHaveText('₹499');

    // 2. Click + button twice to set quantity to 3
    await page.getByTestId('qty-increase-tshirt').click();
    await expect(page.getByTestId('qty-input-tshirt')).toHaveValue('2');
    await expect(page.getByTestId('order-total')).toHaveText('₹998');

    await page.getByTestId('qty-increase-tshirt').click();
    await expect(page.getByTestId('qty-input-tshirt')).toHaveValue('3');

    // Assert exact line total and order total for 3 T-shirts (3 * 499 = 1,497)
    await expect(page.getByTestId('line-total-tshirt')).toHaveText('₹1,497');
    await expect(page.getByTestId('order-total')).toHaveText('₹1,497');

    // 3. Add Running Shoes (₹1,999)
    await page.getByTestId('add-shoes').click();
    await expect(page.getByTestId('line-total-shoes')).toHaveText('₹1,999');

    // Assert combined total: ₹1,497 + ₹1,999 = ₹3,496
    await expect(page.getByTestId('order-total')).toHaveText('₹3,496');

    // 4. Decrease T-Shirt quantity by 1 (now 2 T-shirts = ₹998)
    await page.getByTestId('qty-decrease-tshirt').click();
    await expect(page.getByTestId('qty-input-tshirt')).toHaveValue('2');
    await expect(page.getByTestId('line-total-tshirt')).toHaveText('₹998');

    // Total should now be ₹998 + ₹1,999 = ₹2,997
    await expect(page.getByTestId('order-total')).toHaveText('₹2,997');
  });
});

