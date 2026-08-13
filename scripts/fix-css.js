const fs = require('fs');
let css = fs.readFileSync('../client/src/styles/about-us.css', 'utf8');
css = css.replace(/!important\}\}/g, '!important}');
fs.writeFileSync('../client/src/styles/about-us.css', css);
console.log('Fixed CSS syntax errors');
