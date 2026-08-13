const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const headerPath = path.join(__dirname, '../client/src/components/Header.tsx');
let html = fs.readFileSync(headerPath, 'utf8');

// The Header.tsx contains a React component with JSX. We can't parse the WHOLE thing as XML with Cheerio easily because of Fragments <> and JSX bindings {}.
// Let's just use string replacement or regex for the specific list items.

const lines = html.split('\n');
const newLines = lines.filter(line => {
    const l = line.toLowerCase();
    if (l.includes('hospitality') || l.includes('careers') || l.includes('visit us') || l.includes('visit-us')) {
        return false;
    }
    return true;
});

fs.writeFileSync(headerPath, newLines.join('\n'));
console.log('Removed excluded links from Header.tsx');
