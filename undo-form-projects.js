const fs = require('fs');
const path = require('path');

const dir = 'd:/front end dev/city-edgede/cityedge-app/client/src/pages';
const files = fs.readdirSync(dir);

const formMarkup = `\n\t\t\t\t<div className="e-con-boxed e-con e-parent" style={{ padding: '50px 20px', marginTop: '30px', marginBottom: '30px' }}>
\t\t\t\t\t<div className="e-con-inner" style={{ justifyContent: 'center' }}>
\t\t\t\t\t\t<ContactForm />
\t\t\t\t\t</div>
\t\t\t\t</div>\n`;

for (const file of files) {
    if ((file.startsWith('Project') || file.startsWith('ArProject')) && file.endsWith('.tsx') && !file.includes('ProjectDetails')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let changed = false;
        if (content.includes(formMarkup)) {
            content = content.replace(formMarkup, '');
            changed = true;
        }
        if (content.includes("import React from 'react';\nimport ContactForm from '../components/ContactForm';")) {
            content = content.replace("import React from 'react';\nimport ContactForm from '../components/ContactForm';", "import React from 'react';");
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content);
        }
    }
}
console.log('Undo complete');
