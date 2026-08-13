const fs = require('fs');
let css = fs.readFileSync('../client/src/styles/about-us.css', 'utf8');

// Replace {}{} with {}
// Actually, an empty selector `}{}` just means `}` followed by `{}`. Let's just remove `{}` altogether.
css = css.replace(/\{\}/g, '');

fs.writeFileSync('../client/src/styles/about-us.css', css);
console.log('Fixed empty selector in CSS');
