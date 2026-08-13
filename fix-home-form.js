const fs = require('fs');

let content = fs.readFileSync('d:/front end dev/city-edgede/cityedge-app/client/src/pages/Home.tsx', 'utf8');

// Remove existing ContactForm blocks at the bottom
const removeRegex = /<div className="e-con-boxed e-con e-parent"[^>]*>[\s\S]*?<ContactForm \/>[\s\S]*?<\/div>\s*<\/div>/g;
content = content.replace(removeRegex, '');

// Ensure import
if (!content.includes('import ContactForm')) {
    content = content.replace("export default function Home", "import ContactForm from '../components/ContactForm';\n\nexport default function Home");
}

// Find Hero boundary
const heroStartStr = 'className="has_eae_slider elementor-element elementor-element-2151f6d e-con-full e-flex e-con e-parent e-lazyloaded"';
const heroStart = content.indexOf(heroStartStr);

if (heroStart !== -1) {
    let startIndex = content.lastIndexOf('<div', heroStart);
    let depth = 0;
    let i = startIndex;
    while (i < content.length) {
        if (content.substr(i, 4) === '<div') {
            depth++;
            i += 4;
        } else if (content.substr(i, 6) === '</div>') {
            depth--;
            i += 6;
            if (depth === 0) {
                // Found the end of the hero section!
                const before = content.substring(0, i + 6);
                const after = content.substring(i + 6);
                
                const formMarkup = `\n\t\t\t\t<div className="e-con-boxed e-con e-parent" style={{ padding: '20px 20px', marginTop: '0px', marginBottom: '30px' }}>
\t\t\t\t\t<div className="e-con-inner" style={{ justifyContent: 'center' }}>
\t\t\t\t\t\t<ContactForm />
\t\t\t\t\t</div>
\t\t\t\t</div>\n`;

                fs.writeFileSync('d:/front end dev/city-edgede/cityedge-app/client/src/pages/Home.tsx', before + formMarkup + after);
                console.log('Injected ContactForm in Home.tsx after Hero');
                process.exit(0);
            }
        } else {
            i++;
        }
    }
}
console.log('Hero section not found');
