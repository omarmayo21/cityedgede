const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const frontendPagesDir = path.join(__dirname, '../../cityedge-frontend/pages');
const clientPagesDir = path.join(__dirname, '../client/src/pages');

function escapeTextNodes(element, $) {
    element.contents().each((i, el) => {
        if (el.type === 'text') {
            let text = el.data;
            text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/{/g, '&#123;').replace(/}/g, '&#125;');
            el.data = text;
        } else if (el.type === 'tag') {
            escapeTextNodes($(el), $);
        }
    });
}

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
    
    return jsx;
}

const staticPages = ['about-us', 'media-center', 'virtual-tour'];

staticPages.forEach(page => {
    const indexPath = path.join(frontendPagesDir, page, 'index.html');
    if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf8');
        const $ = cheerio.load(html);
        
        let mainContentEl = $('main#content');
        if (mainContentEl.length === 0) {
            let wpPage = $('div[data-elementor-type="wp-page"]');
            if (wpPage.length > 0) mainContentEl = wpPage.parent();
        }
        
        if (mainContentEl.length > 0) {
            escapeTextNodes(mainContentEl, $);
            let mainContent = mainContentEl.html();
            
            let safeHtml = mainContent;
            
            let jsxContent = htmlToJsx(safeHtml);
            
            const componentName = page.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
            
            const fileContent = `
export default function ${componentName}() {
  return (
    <main id="content" className="site-main">
      ${jsxContent}
    </main>
  );
}
`;
            fs.writeFileSync(path.join(clientPagesDir, `${componentName}.tsx`), fileContent, 'utf8');
            console.log(`Generated ${componentName}.tsx`);
        }
    }
});
