const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/tools/future-value-calculator', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Calculate future value")');
  await page.waitForTimeout(2200);
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshot-disclaimer.png' });
  await browser.close();
})();
