const fs = require('fs');
const html = fs.readFileSync('../client/src/pages/Home.tsx', 'utf8');
const id = '3f6d998';
const matches = [...html.matchAll(new RegExp(`.{0,100}data-id="${id}".{0,100}`, 'g'))];
console.log(matches.map(m=>m[0]));
