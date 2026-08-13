const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(html);

// Remove scripts and noscripts as they cause JSX issues
$('script, noscript').remove();

// Clean up text nodes to escape { and } for JSX
$('*').contents().filter(function() {
    return this.type === 'text';
}).each(function() {
    this.data = this.data.replace(/{/g, '&#123;').replace(/}/g, '&#125;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
});

const headerHtml = $('.elementor-location-header').parent().html();
const mainHtml = $('main#content').html();
const footerHtml = $('.elementor-location-footer').parent().html() || '<!-- Footer not found -->';

function writeCleanHtml(filename, content) {
  if (!content) return;
  // Convert standard HTML to JSX-friendly
  let jsx = content
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/tabindex="([^"]*)"/g, 'tabIndex={$1}')
    .replace(/fetchpriority="([^"]*)"/g, 'fetchPriority="$1"')
    .replace(/autoplay="[^"]*"/g, 'autoPlay={true}')
    .replace(/playsinline="[^"]*"/g, 'playsInline={true}')
    .replace(/allowfullscreen="[^"]*"/g, 'allowFullScreen={true}')
    .replace(/readonly="[^"]*"/g, 'readOnly={true}')
    .replace(/loop="[^"]*"/g, 'loop={true}')
    .replace(/muted="[^"]*"/g, 'muted={true}')
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/<img([^>]*)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<img${p1} />`;
    })
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />')
    .replace(/<input([^>]*)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<input${p1} />`;
    })
    .replace(/<source([^>]*)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<source${p1} />`;
    })
    .replace(/<col([^>]*)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<col${p1} />`;
    })
    .replace(/<link([^>]*)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<link${p1} />`;
    })
    .replace(/<meta([^>]*)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<meta${p1} />`;
    })
    .replace(/style="([^"]*)"/g, '') // remove inline styles to prevent React object errors initially
    .replace(/srcset="([^"]*)"/g, '') // simplify images
    .replace(/disabled="[^"]*"/g, 'disabled={true}')
    .replace(/checked="[^"]*"/g, 'checked={true}')
    .replace(/required="[^"]*"/g, 'required={true}');

  fs.writeFileSync(path.join('./parts', filename), jsx);
}

writeCleanHtml('header.jsx.txt', headerHtml);
writeCleanHtml('main.jsx.txt', mainHtml);
writeCleanHtml('footer.jsx.txt', footerHtml);

console.log('Saved split parts with final JSX fixes to ./parts');
