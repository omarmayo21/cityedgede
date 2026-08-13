const fs = require('fs');

let content = fs.readFileSync('d:/front end dev/city-edgede/cityedge-app/client/src/pages/Home.tsx', 'utf8');

// Add import if not exists
if (!content.includes('import ContactForm')) {
    content = content.replace("import React from 'react';", "import React from 'react';\nimport ContactForm from '../components/ContactForm';");
}

// Find the first e-parent which is the Hero section
// It starts with <div className="has_eae_slider elementor-element elementor-element-2151f6d e-con-full e-flex e-con e-parent e-lazyloaded"
const heroStart = content.indexOf('e-parent');
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
                
                const formMarkup = `\n\t\t\t\t<div className="e-con-boxed e-con e-parent" style={{ padding: '50px 20px', marginTop: '30px', marginBottom: '30px' }}>
\t\t\t\t\t<div className="e-con-inner" style={{ justifyContent: 'center' }}>
\t\t\t\t\t\t<ContactForm />
\t\t\t\t\t</div>
\t\t\t\t</div>\n`;

                fs.writeFileSync('d:/front end dev/city-edgede/cityedge-app/client/src/pages/Home.tsx', before + formMarkup + after);
                console.log('Injected ContactForm in Home.tsx');
                process.exit(0);
            }
        } else {
            i++;
        }
    }
}
console.log('Hero section not found');
