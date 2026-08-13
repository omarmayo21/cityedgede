const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../../cityedge-frontend/index.html');
const headerPath = path.join(__dirname, '../client/src/components/Header.tsx');

const html = fs.readFileSync(indexHtmlPath, 'utf8');
const $ = cheerio.load(html);

// Find the header wrapper
let headerElement = $('div[data-elementor-type="header"]');

// Remove excluded links safely
headerElement.find('li').each((i, el) => {
    const text = $(el).text().toLowerCase();
    if (text.includes('careers') || text.includes('visit us') || text.includes('hospitality') || text.includes('contact us')) {
        $(el).remove();
    }
});

// Remove popup containers for contact/visit us if they exist inside the header
headerElement.find('.dialog-widget').each((i, el) => {
     $(el).remove();
});

// *** NEW: Escape > and < in text nodes so JSX doesn't crash ***
function escapeTextNodes(element) {
    element.contents().each((i, el) => {
        if (el.type === 'text') {
            // Only escape < and > in text nodes if they aren't part of a valid entity
            let text = el.data;
            text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            el.data = text;
        } else if (el.type === 'tag') {
            escapeTextNodes($(el));
        }
    });
}
escapeTextNodes(headerElement);

let headerHtml = '';
// Add the preceding elements (tooltips, preloader, gtm, skip-link) manually if they are before the header
let prevElems = headerElement.prevAll().toArray().reverse();
prevElems.forEach(el => {
    headerHtml += $(el).prop('outerHTML') + '\n';
});
headerHtml += headerElement.prop('outerHTML');

function htmlToJsx(html) {
    let jsx = html;
    
    // Fix style tags to use dangerouslySetInnerHTML
    jsx = jsx.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (match, p1) => {
        const safeCss = p1.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        return `<style dangerouslySetInnerHTML={{ __html: \`${safeCss}\` }} />`;
    });
    
    jsx = jsx.replace(/class="/g, 'className="');
    jsx = jsx.replace(/for="/g, 'htmlFor="');
    jsx = jsx.replace(/tabindex="([^"]+)"/g, 'tabIndex={$1}');
    jsx = jsx.replace(/crossorigin="/g, 'crossOrigin="');
    jsx = jsx.replace(/autoplay="[^"]*"/g, 'autoPlay={true}');
    jsx = jsx.replace(/playsinline="[^"]*"/g, 'playsInline={true}');
    jsx = jsx.replace(/(?<!-)controls="[^"]*"/g, 'controls={true}');
    jsx = jsx.replace(/muted="[^"]*"/g, 'muted={true}');
    jsx = jsx.replace(/loop="[^"]*"/g, 'loop={true}');
    jsx = jsx.replace(/srcset="/g, 'srcSet="');
    jsx = jsx.replace(/sizes="/g, 'sizes="');
    jsx = jsx.replace(/allowfullscreen="[^"]*"/g, 'allowFullScreen={true}');
    jsx = jsx.replace(/allowfullscreen /g, 'allowFullScreen={true} ');
    jsx = jsx.replace(/fetchpriority="/g, 'fetchPriority="');
    jsx = jsx.replace(/srclang="/g, 'srcLang="');
    jsx = jsx.replace(/referrerpolicy="/g, 'referrerPolicy="');
    jsx = jsx.replace(/hreflang="/g, 'hrefLang="');
    
    // Convert string numbers for width, height, frameborder, etc.
    jsx = jsx.replace(/width="(\d+)"/g, 'width={$1}');
    jsx = jsx.replace(/height="(\d+)"/g, 'height={$1}');
    jsx = jsx.replace(/frameborder="(\d+)"/g, 'frameBorder={$1}');
    
    // Close void elements
    const voidElements = ['img', 'input', 'br', 'hr', 'link', 'meta', 'source', 'track', 'area', 'col', 'param', 'embed', 'wbr'];
    voidElements.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*)>`, 'gi');
        jsx = jsx.replace(regex, (match, p1) => {
            if (p1.endsWith('/')) return match;
            return `<${tag}${p1} />`;
        });
    });
    
    // Convert scripts
    jsx = jsx.replace(/<script[^>]*>([\s\S]*?)<\/script>/g, (match, p1) => {
        const safeScript = p1.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        return `<script dangerouslySetInnerHTML={{ __html: \`${safeScript}\` }} />`;
    });
    
    // Replace hardcoded domains
    jsx = jsx.replace(/https:\/\/cityedgedevelopments\.com\/cityedgedevelopmentswordpress/g, '');
    jsx = jsx.replace(/https:\/\/cityedgedevelopments\.com/g, '');
    
    jsx = jsx.replace(/style="[^"]*"/g, '');
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');
    
    // Fix octal escape sequences that break JSX
    jsx = jsx.replace(/'\\2193'/g, "'\\\\2193'");
    jsx = jsx.replace(/'\\2191'/g, "'\\\\2191'");
    
    // Fix aria-expanded="false" to boolean
    jsx = jsx.replace(/aria-expanded="false"/g, 'aria-expanded={false}');
    jsx = jsx.replace(/aria-expanded="true"/g, 'aria-expanded={true}');
    jsx = jsx.replace(/ inert=""/g, ' inert={true}');
    jsx = jsx.replace(/ disabled=""/g, ' disabled={true}');
    jsx = jsx.replace(/ hidden=""/g, ' hidden={true}');
    
    return jsx;
}

let safeHtml = headerHtml;
const finalJsx = htmlToJsx(safeHtml);

const componentCode = `
export default function Header() {
  return (
    <>
      ${finalJsx}
    </>
  );
}
`;

fs.writeFileSync(headerPath, componentCode, 'utf8');
console.log('Header.tsx rebuilt successfully.');
