const fs = require('fs');
const html = fs.readFileSync('../client/src/pages/Home.tsx', 'utf8');
const matches = [...html.matchAll(/data-id="([a-z0-9]+)"/g)].map(m => m[1]);
const counts = {};
matches.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
});
const duplicates = Object.entries(counts).filter(([id, count]) => count > 1 && count < 46);
const output = duplicates.map(([id, count]) => {
    return `${id} appears ${count} times:\n` + [...html.matchAll(new RegExp(`.{0,50}data-id="${id}".{0,50}`, 'g'))].map(m => m[0]).join('\n');
}).join('\n\n');
fs.writeFileSync('duplicates.txt', output);
