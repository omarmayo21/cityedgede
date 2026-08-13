const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, '../../cityedge-frontend/pages/about-us/index.html');
const outPath = path.join(__dirname, '../client/src/pages/AboutUs.tsx');
const cssOutPath = path.join(__dirname, '../client/src/styles/about-us.css');

const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html, { xmlMode: true });

const main = $('main').first();
main.find('script').remove(); 
main.find('noscript').remove();

let mainStr = $.html(main);

let cssContent = '';
const links = $('head link[rel="stylesheet"]');
const cssFiles = [];
links.each((i, el) => {
    const href = $(el).attr('href');
    if (href) {
        let filePath = href;
        if (href.startsWith('https://cityedgedevelopments.com/cityedgedevelopmentswordpress')) {
            filePath = href.replace('https://cityedgedevelopments.com/cityedgedevelopmentswordpress', '');
        }
        else if (href.startsWith('https://cityedgedevelopments.com')) {
            filePath = href.replace('https://cityedgedevelopments.com', '');
        }
        
        if (filePath.startsWith('/wp-content')) {
            cssFiles.push(filePath);
        }
    }
});
console.log('Found CSS files:', cssFiles);

cssFiles.forEach(href => {
    let filePath = href.split('?')[0];
    if (filePath.startsWith('/')) filePath = filePath.substring(1);
    
    // In our scraped directory, is it in cityedgedevelopmentswordpress/wp-content or just wp-content?
    // Let's check cityedge-frontend
    const fullPath = path.join(__dirname, '../../cityedge-frontend/assets/cityedgedevelopmentswordpress', filePath);
    const fullPath2 = path.join(__dirname, '../../cityedge-frontend', filePath);
    
    let targetPath = null;
    if (fs.existsSync(fullPath)) targetPath = fullPath;
    else if (fs.existsSync(fullPath2)) targetPath = fullPath2;

    if (targetPath) {
        cssContent += `/* ${href} */\n`;
        cssContent += fs.readFileSync(targetPath, 'utf8') + '\n\n';
    } else {
        console.warn('CSS not found:', href);
    }
});

const styles = $('head style');
styles.each((i, el) => {
    cssContent += `/* Inline Style ${i} */\n`;
    cssContent += $(el).text() + '\n\n';
});

const stylesDir = path.join(__dirname, '../client/src/styles');
if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, { recursive: true });
fs.writeFileSync(cssOutPath, cssContent);
console.log('Saved CSS to', cssOutPath);

const animRegex = /class="([^"]*)\banimated\b\s+([a-zA-Z0-9_-]+)([^"]*)"/g;
mainStr = mainStr.replace(animRegex, (match, before, animName, after) => {
    return `class="${before}elementor-invisible${after}" data-custom-animation="${animName}"`;
});

mainStr = mainStr.replace(/\bclass="/g, 'className="');
mainStr = mainStr.replace(/\bfor="/g, 'htmlFor="');
mainStr = mainStr.replace(/ tabindex="/gi, ' tabIndex="');
mainStr = mainStr.replace(/ viewBox="/gi, ' viewBox="');
mainStr = mainStr.replace(/ fill-rule="/gi, ' fillRule="');
mainStr = mainStr.replace(/ clip-rule="/gi, ' clipRule="');
mainStr = mainStr.replace(/ stroke-width="/gi, ' strokeWidth="');
mainStr = mainStr.replace(/ stroke-linecap="/gi, ' strokeLinecap="');
mainStr = mainStr.replace(/ stroke-linejoin="/gi, ' strokeLinejoin="');

mainStr = mainStr.replace(/style="([^"]*)"/g, (match, p1) => {
    const parts = p1.split(';').filter(Boolean);
    const obj = {};
    parts.forEach(part => {
        const [k, v] = part.split(':');
        if (k && v) {
            let key = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            if (key === '--eae-slider-slide-count') key = "'--eae-slider-slide-count'";
            if (key === '--elements-title-display') key = "'--elements-title-display'";
            if (key === '--swiper-navigation-size') key = "'--swiper-navigation-size'";
            if (key === '--water-level') key = "'--water-level'";
            if (key.startsWith('--')) key = `'${key}'`;
            obj[key] = v.trim();
        }
    });
    const objStr = Object.keys(obj).map(k => `${k}: '${obj[k].replace(/'/g, "\\'")}'`).join(', ');
    return `style={{${objStr}}}`;
});

mainStr = mainStr.replace(/src="https:\/\/cityedgedevelopments.com\/cityedgedevelopmentswordpress\/wp-content/g, 'src="/wp-content');
mainStr = mainStr.replace(/src="https:\/\/cityedgedevelopments.com\/wp-content/g, 'src="/wp-content');

const componentStr = `import React from 'react';
import '../styles/about-us.css';
import { useElementorAnimations } from '../hooks/useElementorAnimations';
import { useElementorSliders } from '../hooks/useElementorSliders';

export default function AboutUs() {
    useElementorAnimations();
    useElementorSliders();

    return (
        <>
            ${mainStr}
        </>
    );
}
`;

fs.writeFileSync(outPath, componentStr);
console.log('Saved component to', outPath);
