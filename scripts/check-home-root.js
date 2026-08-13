const fs = require('fs');
const html = fs.readFileSync('../client/src/pages/Home.tsx', 'utf8');

// The file is a React component. We can extract just the JSX part using regex.
const jsxMatch = html.match(/return \(([\s\S]*)\);\s*\}/);
if (jsxMatch) {
    let jsx = jsxMatch[1];
    
    // Quick check of root elements
    const tagMatches = [...jsx.matchAll(/<([a-zA-Z0-9_-]+)/g)];
    
    // We just want to see if there's anything outside of <main>
    console.log("Starts with:", jsx.trim().substring(0, 50));
    console.log("Ends with:", jsx.trim().substring(jsx.trim().length - 50));
    
    // check what tags are in the outer scope
    console.log("Has <footer>:", jsx.includes('<footer'));
    console.log("Has <div data-elementor-type=\"popup\":", jsx.includes('data-elementor-type="popup"'));
    console.log("Has <template:", jsx.includes('<template'));
} else {
    console.log("Could not extract JSX");
}
