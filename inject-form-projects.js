const fs = require('fs');
const path = require('path');

const dir = 'd:/front end dev/city-edgede/cityedge-app/client/src/pages';
const files = fs.readdirSync(dir);

let successCount = 0;

for (const file of files) {
    if ((file.startsWith('Project') || file.startsWith('ArProject')) && file.endsWith('.tsx') && !file.includes('ProjectDetails')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if already injected
        if (content.includes('ContactForm />')) continue;

        // Add import
        if (!content.includes('import ContactForm')) {
            content = content.replace("import React from 'react';", "import React from 'react';\nimport ContactForm from '../components/ContactForm';");
        }

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
                        const before = content.substring(0, i + 6);
                        const after = content.substring(i + 6);
                        
                        const formMarkup = `\n\t\t\t\t<div className="e-con-boxed e-con e-parent" style={{ padding: '50px 20px', marginTop: '30px', marginBottom: '30px' }}>
\t\t\t\t\t<div className="e-con-inner" style={{ justifyContent: 'center' }}>
\t\t\t\t\t\t<ContactForm />
\t\t\t\t\t</div>
\t\t\t\t</div>\n`;

                        fs.writeFileSync(filePath, before + formMarkup + after);
                        successCount++;
                        break;
                    }
                } else {
                    i++;
                }
            }
        }
    }
}

console.log('Injected ContactForm in ' + successCount + ' project pages.');
