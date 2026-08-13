const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/front end dev/city-edgede/cityedge-app/client/src/pages';
const files = fs.readdirSync(pagesDir);

let updatedCount = 0;

for (const file of files) {
    if ((file.startsWith('Project') || file.startsWith('ArProject')) && file.endsWith('.tsx')) {
        const filePath = path.join(pagesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Remove old injection at the bottom if any
        const removeRegex = /<div className="e-con-boxed e-con e-parent"[^>]*>[\s\S]*?<ContactForm \/>[\s\S]*?<\/div>\s*<\/div>/g;
        if (content.match(removeRegex)) {
            content = content.replace(removeRegex, '');
            modified = true;
        }

        // Add import
        if (!content.includes('import ContactForm')) {
            content = content.replace("export default function", "import ContactForm from '../components/ContactForm';\n\nexport default function");
            modified = true;
        }

        // Check if ContactForm is already injected after hero-section
        if (content.includes('className="project-details"') && !content.includes('<ContactForm />\n\n            <div className="project-details"')) {
            
            // Find hero-section end. It's easier: it is immediately followed by <div className="project-details">
            const injectionPoint = '<div className="project-details">';
            if (content.includes(injectionPoint)) {
                content = content.replace(injectionPoint, `<ContactForm />\n\n            <div className="project-details">`);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content);
            updatedCount++;
        }
    }
}

console.log(`Updated ${updatedCount} project pages.`);
