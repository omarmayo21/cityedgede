import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--window-size=1440,900'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5174/about-us', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  
  // Scroll down to the bottom to trigger animations
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 1000)); // wait for animations

  const aboutElements = await page.evaluate(() => {
    const els = document.querySelectorAll('.elementor-14 > .elementor-element');
    return Array.from(els).map(el => {
      return {
        id: el.getAttribute('data-id'),
        visibility: window.getComputedStyle(el).visibility,
        classList: el.className
      };
    });
  });
  
  const hiddenElements = aboutElements.filter(e => e.visibility === 'hidden');
  console.log(`There are ${hiddenElements.length} hidden elements after scrolling.`);
  if (hiddenElements.length > 0) {
    console.log(hiddenElements);
  } else {
    console.log("All elements are now visible!");
  }

  await browser.close();
})();
