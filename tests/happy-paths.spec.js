import { expect, test } from '@playwright/test';

const API_BASE_URL = process.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5153';

async function resetDatabase(request) {
  const response = await request.post(`${API_BASE_URL}/api/test/reset-database`);
  expect(response.ok()).toBeTruthy();
}


test.beforeEach(async ({ request }) => {
  await resetDatabase(request);
});

test('User can register, log in, and see the catalogue', async ({ page }) => {
  await page.goto('/');

  //registering new user
  await page.getByTestId('nav-register').click();
  await page.getByTestId('register-first-name-input').fill('Katrine');
  await page.getByTestId('register-last-name-input').fill('Hansen');
  await page.getByTestId('register-cpr-input').fill('1103991674');
  await page.getByTestId('register-tlf-input').fill('+45 21392967');
  await page.getByTestId('register-email-input').fill('email@gmail.com');
  await page.getByTestId('register-password-input').fill('Test123456');
  await page.getByTestId('register-submit-button').click();

  //assert that user is logged in and can see catalogue
  await expect(page.getByTestId('logged-in-user')).toContainText('Katrine');
  await expect(page.locator('section')).toContainText('Catalogue');

  //assert successful log out
  await page.getByTestId('logout-button').click();
  await expect(page.getByTestId('nav-login')).toContainText('Login');
});

test('User can borrow and return an available item', async ({ page }) => {
  await page.goto('/');
  
  //logging in with existing user
  await page.getByTestId('nav-login').click();
  await page.getByTestId('login-email-input').fill('sofie.hansen@example.com');
  await page.getByTestId('login-password-input').fill('test123');
  await page.getByTestId('login-submit-button').click();

  //borrowing available item
  await page.getByTestId('view-item-11').click();
  await page.getByTestId('borrow-copy-21').click();
  await page.getByTestId('nav-my-loans').click();

  //returning loan
  await page.getByTestId('return-loan-24').click();
  await page.getByTestId('include-returned-checkbox').check();
  await expect(page.getByTestId('loan-row-24')).toContainText('31 May 2026');
});

test('User can reserve an unavailable item and see it in My Reservations, and then cancel it', async ({ page }) => {
  await page.goto('/');

  //logging in with existing user
  await page.getByTestId('nav-login').click();
  await page.getByTestId('login-email-input').fill('lars.nielsen@example.com');
  await page.getByTestId('login-password-input').fill('test123');
  await page.getByTestId('login-submit-button').click();

  //reserving unavailable item
  await page.getByTestId('view-item-1').click();
  await page.getByTestId('reserve-item-button').click();
  await expect(page.getByTestId('item-action-success-message')).toContainText('Reservation created successfully.');

  //assert reservation is visible in My Reservations
  await page.getByTestId('nav-my-reservations').click();
  await expect(page.getByTestId('reservation-row-1').getByRole('heading')).toContainText('Reservation #1');

  //cancelling reservation and asserting it's removed from My Reservations
  await page.getByTestId('cancel-reservation-1').click();
  await expect(page.getByTestId('my-reservations-success-message')).toContainText('Reservation cancelled successfully.');
  await expect(page.getByTestId('no-reservations-message')).toContainText('No reservations found.');
});

test('User can pay an unpaid fine', async ({ page }) => {
  await page.goto('/');

  //logging in with existing user
  await page.getByTestId('nav-login').click();
  await page.getByTestId('login-email-input').click();
  await page.getByTestId('login-email-input').fill('mads.jensen@example.com');
  await page.getByTestId('login-password-input').click();
  await page.getByTestId('login-password-input').fill('test123');
  await page.getByTestId('login-submit-button').click();

  //assert unpaid fine is visible and can be paid
  await page.getByTestId('nav-my-fines').click();
  await expect(page.getByTestId('fine-row-1').locator('span')).toContainText('unpaid');
  await page.getByTestId('pay-fine-1').click();

  //assert fine is marked as paid
  await expect(page.getByTestId('my-fines-success-message')).toContainText('Fine paid successfully.');
  await expect(page.getByTestId('fine-row-1').locator('span')).toContainText('paid');
});