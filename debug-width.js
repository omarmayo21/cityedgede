import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--window-size=1440,900'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 800));

  // Walk up from .elementor-6996 to find what's constraining it
  const widthChain = await page.evaluate(() => {
    const chain = [];
    let el = document.querySelector('.elementor-6996');
    while (el && el !== document.body) {
      const s = window.getComputedStyle(el);
      chain.push({
        tag: el.tagName,
        id: el.id,
        className: el.className.substring(0, 80),
        width: s.width,
        maxWidth: s.maxWidth,
        boxSizing: s.boxSizing,
        display: s.display,
      });
      el = el.parentElement;
    }
    return chain;
  });

  console.log('=== WIDTH CONSTRAINT CHAIN (from .elementor-6996 up to body) ===');
  widthChain.forEach((n, i) => {
    if (n.width !== '1440px') {
      console.log(`[${i}] ⚠️  ${n.tag}.${n.className.split(' ')[0]} width=${n.width} maxWidth=${n.maxWidth} display=${n.display}`);
    } else {
      console.log(`[${i}] ✅  ${n.tag}.${n.className.split(' ')[0]} width=${n.width}`);
    }
  });

  // Check what CSS is applied to .elementor-6996 directly
  const el6996 = await page.evaluate(() => {
    const el = document.querySelector('.elementor-6996');
    const s = window.getComputedStyle(el);
    return {
      width: s.width, maxWidth: s.maxWidth,
      marginLeft: s.marginLeft, marginRight: s.marginRight,
      paddingLeft: s.paddingLeft, paddingRight: s.paddingRight,
    };
  });
  console.log('\n.elementor-6996 computed:', el6996);

  // Check the page-content div
  const pageContent = await page.evaluate(() => {
    const el = document.querySelector('.page-content');
    if (!el) return 'NOT FOUND';
    const s = window.getComputedStyle(el);
    return { width: s.width, maxWidth: s.maxWidth, display: s.display };
  });
  console.log('.page-content computed:', pageContent);

  // Check site-main
  const siteMain = await page.evaluate(() => {
    const el = document.querySelector('.site-main');
    if (!el) return 'NOT FOUND';
    const s = window.getComputedStyle(el);
    return { width: s.width, maxWidth: s.maxWidth, display: s.display, margin: s.margin };
  });
  console.log('.site-main computed:', siteMain);

  // Check #root
  const root = await page.evaluate(() => {
    const el = document.getElementById('root');
    const s = window.getComputedStyle(el);
    return { width: s.width, maxWidth: s.maxWidth, display: s.display };
  });
  console.log('#root computed:', root);

  // Check if index.css or any style applies max-width to site-main
  const siteMainRules = await page.evaluate(() => {
    const el = document.querySelector('.site-main');
    const results = [];
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        const rules = sheet.cssRules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule.selectorText && (rule.selectorText.includes('site-main') || rule.selectorText.includes('.elementor-6996')) && rule.style && (rule.style.maxWidth || rule.style.width)) {
            results.push({
              href: sheet.href || 'inline',
              selector: rule.selectorText,
              maxWidth: rule.style.maxWidth,
              width: rule.style.width,
            });
          }
        }
      } catch(e) {}
    }
    return results;
  });
  console.log('\nCSS rules matching site-main/.elementor-6996:', JSON.stringify(siteMainRules, null, 2));

  await browser.close();
})();
