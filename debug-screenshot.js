import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--window-size=1440,2500'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 2500 });
  
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'home-sliders.png', fullPage: true });

  await browser.close();
})();
