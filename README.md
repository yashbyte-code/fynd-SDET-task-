# Single-Page Checkout – FyndHacks SDET Task

A single-page checkout application built with React, bundled with Parcel, and tested using Playwright browser automation.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher installed)
- Google Chrome browser installed

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm start
```
The app will bundle and start the local server at **http://localhost:1234**. Open this URL in any browser.

### 3. Run Automated Browser Tests
```bash
npm test
```
To run tests with a visible browser window (headed mode):
```bash
npx playwright test --headed
```
To view the interactive HTML test report:
```bash
npx playwright show-report
```

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: React 18 (Functional components with hooks: `useState`)
- **Bundler**: Parcel 2 (Zero-configuration bundler with fast hot module replacement)
- **Styling**: Modern, responsive CSS (Unified single-card layout, mobile & desktop optimized)
- **Test Automation**: Playwright Test (Chromium/Chrome channel, UI assertions, automatic waits)

---

## 🧪 Automated Browser Tests (Task 3)

The automated tests are located in `tests/checkout.spec.js`. Each test starts from a clean browser state (`beforeEach` hook navigates to `/` and validates an empty cart).

### Implemented Automated Checks:

| Test Name | Description | Key Assertions |
|---|---|---|
| **Check 1: Successful Checkout** | Adds Cotton T-Shirt (₹499), enters customer name, places order. | Confirmation screen appears, customer name displayed, unique order reference `ORD-xxxxxx` visible. |
| **Check 2: Missing Field Blocked** | Adds Running Shoes (₹1,999), leaves Name blank, clicks Place Order. | Validation message `"Please enter your name."` appears, checkout is blocked, cart items & total preserved. |
| **Check 3: Quantity & Total Calculation** | Adds T-Shirt, increments quantity to 3, adds Shoes, decrements T-Shirt. | Line totals update dynamically (`₹499 × 3 = ₹1,497`), overall order total calculates accurately to the exact rupee (`₹3,496` then `₹2,997`). |

### Test Run Execution Output:
```text
Running 3 tests using 1 worker

  ok 1 [chrome] › tests/checkout.spec.js › Check 1: Successful checkout produces an order confirmation (2.5s)
  ok 2 [chrome] › tests/checkout.spec.js › Check 2: Missing required field blocks checkout with validation message (1.5s)
  ok 3 [chrome] › tests/checkout.spec.js › Check 3: Quantity change updates line total and exact order total (3.4s)

  3 passed (7.4s)
```

---

## 📋 Short Test Plan (Task 4)

### 1. Key Checkout Risks & Prioritization

| Priority | Risk Area | Impact | Mitigation Strategy |
|---|---|---|---|
| **P0 (Critical)** | **Double Submission / Race Conditions** | Duplicate orders created, duplicate charges to user. | Disable submit button upon initial click + state lock flag (`isProcessing = true`). |
| **P0 (Critical)** | **Total Calculation Inaccuracies** | Financial discrepancy, incorrect customer bill. | Automatic recalculation of line totals and total using deterministic sum reducer; boundary quantity clamp (1 to 99). |
| **P1 (High)** | **Empty Cart Checkout** | Zero-value or ghost orders placed in system. | Strict validation: verify `cart.length > 0` before allowing checkout; display clear error message. |
| **P1 (High)** | **Missing Customer Details** | Unfulfillable orders without customer identity. | Required field validation on Name with empty/whitespace checking; preserve user input on failure. |
| **P2 (Medium)** | **Data Loss on Validation Failure** | Poor UX if cart empties after validation error. | Cart state is decoupled from form validation; items remain intact when errors trigger. |

---

## 🔍 Manual Test Results & Evidence (Task 4)

### Manual Test 1: Empty Cart Checkout Attempt
- **Test ID**: `TC-MANUAL-001`
- **Objective**: Verify that attempting to place an order with an empty cart is blocked.
- **Preconditions**: Fresh session on `http://localhost:1234` with zero items in cart.
- **Steps**:
  1. Open `http://localhost:1234`.
  2. Verify cart displays `"Your cart is currently empty"`.
  3. Enter customer name: `"Yash Sharma"`.
  4. Click the `"Place Order"` button.
- **Expected Result**: Checkout is blocked. An error alert `"Your cart is empty. Please add items before checking out."` is displayed. No confirmation screen or order reference is generated.
- **Actual Result**: Pass ✅. The validation error appeared immediately below the name field. The customer's entered name was preserved, and no order confirmation was produced.
- **Defect Status**: No defect found.

---

### Manual Test 2: Rapid Double-Click on "Place Order"
- **Test ID**: `TC-MANUAL-002`
- **Objective**: Verify that rapidly clicking the "Place Order" button multiple times does not produce duplicate orders or multiple confirmations.
- **Preconditions**: 1 Cotton T-Shirt added to cart, Customer Name entered as `"Yash Sharma"`.
- **Steps**:
  1. Add Cotton T-Shirt to cart.
  2. Enter `"Yash Sharma"` into the Customer Name input.
  3. Rapidly double-click (or multi-click within 100ms) the `"Place Order"` button.
- **Expected Result**: The first click locks submission (`isProcessing` state). The button disables and displays a spinner (`"Processing..."`). Only one single order confirmation is rendered with exactly one order reference number.
- **Actual Result**: Pass ✅. Exactly one order confirmation was generated. Double-clicking did not duplicate the order.
- **Defect Status**: No defect found.

---

## 🐞 Defect Report / Findings Log

In accordance with the challenge brief (*"Report real defects if found; don't invent one to satisfy the brief"*):

- **No functional defects were found** during manual and automated verification:
  - Both core products (Cotton T-Shirt ₹499, Running Shoes ₹1,999) calculate correctly.
  - Line total and overall total update in real-time.
  - Manual quantity changes respect the bounds (min: 1, max: 99).
  - Empty cart and missing name validations function reliably.
  - Double-click protection prevents duplicate order creation.

---

## 📁 Repository Structure

```text
├── src/
│   ├── index.html            # Main HTML document
│   ├── index.jsx             # React entry point
│   ├── App.jsx               # Main state container & checkout layout
│   ├── components/
│   │   ├── ProductList.jsx   # Synthetic products with add-to-cart
│   │   ├── Cart.jsx          # Cart items, qty controls, name input, total
│   │   └── Confirmation.jsx  # Order confirmed view with reference ID
│   └── styles/
│       └── App.css           # Clean, responsive unified styling
├── tests/
│   ├── checkout.spec.js      # 3 Core automated checks (Task 3)
│   └── manual-scenarios.spec.js # Automated verification of manual test scenarios
├── playwright.config.js      # Playwright test runner configuration
├── package.json              # Project dependencies and test scripts
└── README.md                 # Complete submission documentation
```

