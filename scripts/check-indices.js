const fs = require('fs');

const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const mainEnd = html.indexOf('</main>');
const footerStart = html.indexOf('data-elementor-type="footer"');
const footerEnd = html.indexOf('</footer>');

console.log('Index of </main>:', mainEnd);
console.log('Index of footer start:', footerStart);
console.log('Index of footer end:', footerEnd);

if (mainEnd !== -1 && footerEnd !== -1) {
    const afterFooter = html.substring(footerEnd + 9);
    console.log('Length of content after footer in original HTML:', afterFooter.length);
    console.log('Contains main?', afterFooter.includes('<main'));
    console.log('Contains section?', afterFooter.includes('<section'));
}
