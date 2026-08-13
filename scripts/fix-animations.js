const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const animationRegex = /className="([^"]*)\banimated\s+([a-zA-Z0-9_-]+)([^"]*)"/g;

walkDir(path.join(__dirname, '../client/src'), function(filePath) {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Replace 'animated fadeInUp' with 'elementor-invisible'
        // But we need to make sure we keep data-settings if missing, or maybe the hook can just read a data-animation attribute.
        // Actually, the easiest way to make the hook work is to add a custom attribute: data-animation="$2"
        // and replace 'animated $2' with 'elementor-invisible'
        
        // Let's check if the element has data-settings={"animation":"$2"}. 
        // If it does, we just need 'elementor-invisible'.
        // To be safe and simple, let's inject data-custom-animation="$2" so our hook knows what to do easily.
        
        let newContent = content.replace(animationRegex, (match, before, animName, after) => {
            modified = true;
            // Clean up extra spaces
            let newClass = `${before} elementor-invisible ${after}`.replace(/\s+/g, ' ').trim();
            // We append data-custom-animation to the element so the hook can easily read it
            // Wait, replace just the className string here.
            return `className="${newClass}" data-custom-animation="${animName}"`;
        });

        if (modified) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed animations in ${filePath}`);
        }
    }
});
