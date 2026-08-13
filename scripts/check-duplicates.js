const fs = require('fs');

const html = fs.readFileSync('../client/src/pages/Home.tsx', 'utf8');

// Find all occurrences of data-id="<string>"
const matches = [...html.matchAll(/data-id="([a-z0-9]+)"/g)].map(m => m[1]);

// Count occurrences of each data-id
const counts = {};
matches.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
});

// Find any data-ids that appear more than once (potential duplication)
const duplicates = Object.entries(counts).filter(([id, count]) => count > 1);

console.log('Total unique data-ids:', Object.keys(counts).length);
console.log('Total duplicated data-ids:', duplicates.length);

if (duplicates.length > 0) {
    console.log('Top 10 duplicated data-ids:');
    console.log(duplicates.sort((a, b) => b[1] - a[1]).slice(0, 10));
}
