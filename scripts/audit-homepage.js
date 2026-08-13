const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(html);

console.log("=== CSS FILES ===");
$('link[rel="stylesheet"]').each((i, el) => {
  const href = $(el).attr('href');
  if (href) {
    // Clean up query params
    const cleanHref = href.split('?')[0];
    console.log(cleanHref);
  }
});

console.log("\n=== JS FILES ===");
$('script[src]').each((i, el) => {
  const src = $(el).attr('src');
  if (src) {
    const cleanSrc = src.split('?')[0];
    console.log(cleanSrc);
  }
});

console.log("\n=== FONTS ===");
const styles = $('style').text() || '';
const fontMatches = styles.match(/@font-face\s*{[^}]*}/g);
if (fontMatches) {
  fontMatches.forEach(f => console.log(f));
}
