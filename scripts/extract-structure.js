const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(html);

// Remove scripts and styles for structure view
$('script, style, noscript, svg, path, iframe, link').remove();

function cleanTree(node, depth = 0) {
  let result = '';
  const indent = '  '.repeat(depth);
  
  if (node.type === 'text') {
    const text = $(node).text().trim();
    if (text) result += `${indent}"${text.substring(0, 50)}"\n`;
    return result;
  }
  
  if (node.type === 'tag') {
    const tag = node.tagName;
    // Skip elementor wrappers if possible, but for now just print them
    const classes = $(node).attr('class') || '';
    const id = $(node).attr('id') || '';
    let classStr = classes.split(' ').filter(c => c && !c.includes('elementor-element-') && c !== 'elementor-widget-container' && c !== 'elementor-widget-wrap').join('.');
    if (classStr) classStr = '.' + classStr;
    const idStr = id ? '#' + id : '';
    
    // Only print meaningful tags or tags with text/images
    if (tag === 'img') {
      result += `${indent}${tag}${idStr}${classStr} src="${$(node).attr('src')}"\n`;
    } else {
      const hasMeaningfulContent = $(node).children().length > 0 || $(node).text().trim();
      if (hasMeaningfulContent) {
        result += `${indent}${tag}${idStr}${classStr}\n`;
        $(node).contents().each((i, child) => {
          result += cleanTree(child, depth + 1);
        });
      }
    }
  }
  return result;
}

const structure = cleanTree($('body')[0]);
fs.writeFileSync('homepage-structure.txt', structure);
console.log('Saved to homepage-structure.txt');
