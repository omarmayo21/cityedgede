const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to Vite dev server
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  // Wait a moment for React and our Swiper/Animation hooks to finish
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get the fully rendered DOM
  const html = await page.content();
  
  // Write to a file so we can inspect it
  fs.writeFileSync('puppeteer-rendered.html', html);
  console.log('Saved to puppeteer-rendered.html');
  
  // Find what is exactly after the footer element
  const afterFooter = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return 'No footer found';
    
    let current = footer.nextElementSibling;
    const siblings = [];
    while (current) {
        siblings.push(current.outerHTML);
        current = current.nextElementSibling;
    }
    return siblings;
  });
  
  console.log('Elements after footer:', afterFooter.length);
  afterFooter.forEach((html, i) => {
      console.log(`Element ${i} starts with:`, html.substring(0, 100));
  });
  
  await browser.close();
})();
