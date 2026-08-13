import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--window-size=1440,900'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  // Home
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'home-width-check.png' });
  const homeWidth = await page.evaluate(() => {
    const el = document.querySelector('.site-main');
    return el ? window.getComputedStyle(el).width : 'NOT FOUND';
  });
  console.log('Home .site-main width:', homeWidth);

  // About Us
  await page.goto('http://localhost:5174/about-us', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'about-width-check.png', fullPage: true });
  const aboutWidth = await page.evaluate(() => {
    const el = document.querySelector('.site-main');
    return el ? window.getComputedStyle(el).width : 'NOT FOUND';
  });
  console.log('About Us .site-main width:', aboutWidth);
  
  // Also get the positions and heights of main elements in About Us to see the massive gaps
  const aboutElements = await page.evaluate(() => {
    const els = document.querySelectorAll('.elementor-14 > .elementor-element');
    return Array.from(els).map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        id: el.getAttribute('data-id'),
        height: rect.height,
        minHeight: style.minHeight,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity
      };
    });
  });
  console.log('About Us main sections:', JSON.stringify(aboutElements, null, 2));

  await browser.close();
})();
