const fs = require('fs');
const html = fs.readFileSync('../client/src/components/Footer.tsx', 'utf8');

const divFooterStart = html.indexOf('<div data-elementor-type="footer"');
const footerEnd = html.lastIndexOf('</footer>');

console.log('Index of div footer:', divFooterStart);
console.log('Index of end footer:', footerEnd);

// Let's count divs inside the div footer to see if it closes early!
const cheerio = require('cheerio');
const $ = cheerio.load(html, { xmlMode: true });

const divFooter = $('div[data-elementor-type="footer"]');
console.log('Length of div footer content:', divFooter.html().length);
console.log('Next sibling of div footer:', divFooter.next().prop('tagName'));

const nextSiblings = [];
let current = divFooter.next();
while(current.length) {
    nextSiblings.push(current.prop('tagName'));
    current = current.next();
}
console.log('All next siblings:', nextSiblings);
