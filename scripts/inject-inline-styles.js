const fs = require('fs');
const cheerio = require('cheerio');

const originalHtml = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(originalHtml);

let styleTags = [];

// Grab ALL style tags
$('style').each((i, el) => {
  let styleContent = $(el).html();
  // Strip domains from url() or anything else in the style
  styleContent = styleContent.replace(/https:\/\/cityedgedevelopments\.com\/cityedgedevelopmentswordpress/g, '');
  styleContent = styleContent.replace(/https:\/\/cityedgedevelopments\.com/g, '');
  
  const idAttr = $(el).attr('id') ? ` id="${$(el).attr('id')}"` : '';
  styleTags.push(`<style${idAttr}>${styleContent}</style>`);
});

let clientHtml = fs.readFileSync('../client/index.html', 'utf8');

// We will inject the styles right before </head>
// First, remove any existing injected inline styles block to avoid duplicates
const markerStart = '<!-- Elementor Inline Styles -->';
const markerIndex = clientHtml.indexOf(markerStart);
const headEndIndex = clientHtml.indexOf('</head>');

if (markerIndex !== -1) {
    // Remove the old block
    clientHtml = clientHtml.substring(0, markerIndex) + clientHtml.substring(headEndIndex);
}

const endHeadIndex = clientHtml.indexOf('</head>');

if (endHeadIndex !== -1) {
    const newBlock = '\n    <!-- Elementor Inline Styles -->\n    ' + styleTags.join('\n    ') + '\n  ';
    clientHtml = clientHtml.substring(0, endHeadIndex) + newBlock + clientHtml.substring(endHeadIndex);
    fs.writeFileSync('../client/index.html', clientHtml, 'utf8');
    console.log('Successfully injected', styleTags.length, 'inline style blocks into client/index.html with local URLs.');
} else {
    console.log('Could not find </head> in client/index.html');
}
