import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--window-size=1440,900'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.error(`[BROWSER ERROR] ${msg.text()}`);
  });

  await page.setViewport({ width: 1440, height: 900 });

  // Helper to collect computed styles for key selectors
  const getStyles = async (selector) => {
    return await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        selector: sel,
        display: s.display,
        width: s.width,
        maxWidth: s.maxWidth,
        margin: s.margin,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: s.fontFamily,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
        backgroundColor: s.backgroundColor,
        opacity: s.opacity,
        position: s.position,
        overflow: s.overflow,
        gap: s.gap,
        flexDirection: s.flexDirection,
      };
    }, selector);
  };

  // ========================
  // React App - Homepage
  // ========================
  console.log('\n=== REACT APP (localhost:5174) ===');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'react-homepage-desktop.png', fullPage: true });
  console.log('React homepage screenshot saved (full page up to 5000px)');

  // Key elements to compare
  const selectors = [
    'body',
    '#root',
    '.elementor-6996',                          // homepage elementor root
    '.elementor-6996 > .e-con',               // top container
    '.elementor-location-header',               // header
    '.elementor-38',                             // header elementor
    '.e-con-boxed > .e-con-inner',             // boxed container inner
    '.elementor-widget-counter .elementor-counter-number', // counter numbers
    '.elementor-heading-title',                 // headings
  ];

  for (const sel of selectors) {
    const s = await getStyles(sel);
    if (s) console.log(JSON.stringify(s));
  }

  // Check body classes
  const bodyInfo = await page.evaluate(() => ({
    className: document.body.className,
    childCount: document.body.children.length,
    htmlClasses: document.documentElement.className,
  }));
  console.log('Body info:', bodyInfo);

  // ========================
  // React App - About Us
  // ========================
  await page.goto('http://localhost:5174/about-us', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'react-about-desktop.png', fullPage: true });
  console.log('React /about-us screenshot saved');

  // Mobile view
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'react-homepage-mobile.png', fullPage: true });
  console.log('React homepage mobile screenshot saved');

  await browser.close();
  console.log('\nDone. Screenshots saved.');
})();
