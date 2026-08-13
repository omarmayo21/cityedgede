const fs = require('fs');
const cheerio = require('cheerio');

const originalHtml = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(originalHtml);

let cssLinks = [];

$('link[rel="stylesheet"]').each((i, el) => {
  let href = $(el).attr('href');
  if (href) {
    // Strip domain
    href = href.replace('https://cityedgedevelopments.com/cityedgedevelopmentswordpress', '');
    href = href.replace('https://cityedgedevelopments.com', '');
    
    // Strip query params
    href = href.split('?')[0];

    // Format correctly
    if (!href.startsWith('/')) {
        href = '/' + href;
    }
    
    cssLinks.push(`<link rel="stylesheet" href="${href}" />`);
  }
});

let clientHtml = fs.readFileSync('../client/index.html', 'utf8');

// Replace the old CSS dependencies block with the new one
const startMarker = '<!-- Elementor CSS Dependencies from Original Source -->';
const endMarker = '</head>';

const startIndex = clientHtml.indexOf(startMarker);
const endIndex = clientHtml.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newBlock = startMarker + '\n    ' + cssLinks.join('\n    ') + '\n  ';
    clientHtml = clientHtml.substring(0, startIndex) + newBlock + clientHtml.substring(endIndex);
    fs.writeFileSync('../client/index.html', clientHtml, 'utf8');
    console.log('Successfully updated client/index.html with', cssLinks.length, 'stylesheets.');
} else {
    console.log('Could not find markers in client/index.html');
}
