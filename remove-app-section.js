const fs = require('fs');

let content = fs.readFileSync('d:/front end dev/city-edgede/cityedge-app/client/src/pages/Home.tsx', 'utf8');

const id = '90ddd1f';
const startMarker = `data-id="${id}"`;
let startIndex = content.indexOf(startMarker);

if (startIndex !== -1) {
    // Find the '<div' before the data-id
    startIndex = content.lastIndexOf('<div', startIndex);
    
    // Find the matching closing </div>
    let depth = 0;
    let i = startIndex;
    while (i < content.length) {
        if (content.substr(i, 4) === '<div') {
            depth++;
            i += 4;
        } else if (content.substr(i, 6) === '</div>') {
            depth--;
            i += 6;
            if (depth === 0) {
                // Found the end
                const before = content.substring(0, startIndex);
                const after = content.substring(i);
                fs.writeFileSync('d:/front end dev/city-edgede/cityedge-app/client/src/pages/Home.tsx', before + after);
                console.log('Removed section ' + id);
                process.exit(0);
            }
        } else {
            i++;
        }
    }
}
console.log('Section not found or failed to parse');
