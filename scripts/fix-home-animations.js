const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../client/src/pages/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

// Replace `animated <animation_name>` with `elementor-invisible` and add `data-custom-animation="<animation_name>"`
// But since data-custom-animation might already be present or not, we can just replace the class and let the hook handle it.
// Actually, data-settings contains the animation name.
// Let's use a regex to find all animated classes.
const animRegex = /className="([^"]*)\banimated\b\s+([a-zA-Z0-9_-]+)([^"]*)"/g;

content = content.replace(animRegex, (match, before, animName, after) => {
    // If it already has data-custom-animation, great, but let's just make sure it's invisible
    return `className="${before}elementor-invisible${after}" data-custom-animation="${animName}"`;
});

fs.writeFileSync(homePath, content);
console.log('Fixed animations in Home.tsx');
