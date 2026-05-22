import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    console.log('Opening landing...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.click('body');
    await page.waitForURL('**/login', { timeout: 5000 });

    console.log('Registering a test user...');
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="name"]', 'E2E User');
    await page.fill('input[name="email"]', `e2e_user_${Date.now()}@gmail.com`);
    await page.click('button:has-text("Create account")');
    await page.waitForURL('**/shop', { timeout: 7000 });

    console.log('Logging out...');
    await page.click('button:has-text("Sign out")');
    await page.waitForURL('**/login', { timeout: 5000 });

    console.log('Logging in...');
    await page.fill('input[name="email"]', 'e2e_user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("Sign in")');

    console.log('E2E script finished (note: login uses local session logic)');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('E2E failed', err);
    await browser.close();
    process.exit(2);
  }
})();
