const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const frontendDir = path.join(__dirname, '../../cityedge-frontend/pages');
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

function processDirectory(subDir, routePrefix, isArabic = false) {
    const dirPath = path.join(frontendDir, subDir);
    if (!fs.existsSync(dirPath)) return [];
    
    const items = fs.readdirSync(dirPath);
    const routes = [];
    
    items.forEach(item => {
        const indexPath = path.join(dirPath, item, 'index.html');
        if (fs.existsSync(indexPath)) {
            const html = fs.readFileSync(indexPath, 'utf8');
            const $ = cheerio.load(html);
            
            let mainContentEl = $('main#content');
            if (mainContentEl.length === 0) {
                let wpPage = $('div[data-elementor-type="wp-page"]');
                if (wpPage.length > 0) mainContentEl = wpPage;
                else {
                    let wpPost = $('div[data-elementor-type="wp-post"]');
                    if (wpPost.length > 0) mainContentEl = wpPost;
                    else {
                        let singlePage = $('div[data-elementor-type="single-page"]');
                        if (singlePage.length > 0) mainContentEl = singlePage;
                    }
                }
            }
            
            if (mainContentEl.length > 0) {
                escapeTextNodes(mainContentEl, $);
                
                let mainContent = mainContentEl.prop('outerHTML');
                
                let inlineStyles = '';
                $('head style').each((i, el) => {
                    let styleContent = $(el).html();
                    styleContent = styleContent.replace(/https:\/\/cityedgedevelopments\.com\/cityedgedevelopmentswordpress/g, '');
                    inlineStyles += styleContent + '\n';
                });
                
                let jsxContent = htmlToJsx(mainContent);
                
                const rawName = item.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
                const componentName = isArabic ? `Ar${routePrefix}${rawName}` : `${routePrefix}${rawName}`;
                
                const fileContent = `
export default function ${componentName}() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`${inlineStyles.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
      ${jsxContent}
    </>
  );
}
`;
                fs.writeFileSync(path.join(clientPagesDir, `${componentName}.tsx`), fileContent, 'utf8');
                
                const routePath = isArabic ? `/ar/${subDir.split('/')[1]}/${item}` : `/${subDir}/${item}`;
                routes.push({ name: componentName, path: routePath });
            }
        }
    });
    
    return routes;
}

const engProjects = processDirectory('project', 'Project');
const engLocations = processDirectory('location', 'Location');
const arProjects = processDirectory('ar/project', 'Project', true);
const arLocations = processDirectory('ar/location', 'Location', true);

const allRoutes = [...engProjects, ...engLocations, ...arProjects, ...arLocations];

console.log(`Generated ${allRoutes.length} dynamic page components.`);

// Inject routes into App.tsx
const appTsxPath = path.join(__dirname, '../client/src/App.tsx');
let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');

// Remove old imports
appTsxContent = appTsxContent.replace(/import \{ lazy, Suspense \} from 'react';\n/g, '');
appTsxContent = appTsxContent.replace(/const (Project|Location|ArProject|ArLocation).*= lazy\(\(\) => import\('\.\/pages\/.*'\)\);\n/g, '');

// Generate new imports
const newImportsStr = "import { lazy } from 'react';\n" + allRoutes.map(r => `const ${r.name} = lazy(() => import('./pages/${r.name}'));`).join('\n') + '\n';

// Generate new routes
const newRoutesStr = allRoutes.map(r => `<Route path="${r.path}" element={<${r.name} />} />`).join('\n        ') + '\n        ';

// Insert new imports
appTsxContent = appTsxContent.replace('function App() {', newImportsStr + '\nfunction App() {');

// Insert new routes right before <Route path="/ar" element={<Home />} />
appTsxContent = appTsxContent.replace('<Route path="/ar" element={<Home />} />', newRoutesStr + '<Route path="/ar" element={<Home />} />');

fs.writeFileSync(appTsxPath, appTsxContent, 'utf8');
console.log('App.tsx routes updated successfully.');
