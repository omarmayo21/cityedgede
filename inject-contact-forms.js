/**
 * inject-contact-forms.js v2
 *
 * Safely injects <ContactForm /> into Home.tsx and all Project/ArProject pages.
 * 
 * Project pages use React Fragments (<>) not <main>, so we inject before the
 * closing </> tag of the return statement.
 */

const fs = require('fs');
const path = require('path');

const pagesDir = path.join('d:/front end dev/city-edgede/cityedge-app/client/src/pages');

const FORM_IMPORT = `import ContactForm from '../components/ContactForm';`;

const FORM_JSX_FRAGMENT = `
      {/* Contact Form - Lead Generation */}
      <div className="e-con-boxed e-con e-parent" style={{ padding: '60px 20px', background: '#f8f6f3' }}>
        <div className="e-con-inner" style={{ display: 'flex', justifyContent: 'center' }}>
          <ContactForm />
        </div>
      </div>
    </>`;

const FORM_JSX_MAIN = `
      {/* Contact Form - Lead Generation */}
      <div className="e-con-boxed e-con e-parent" style={{ padding: '60px 20px', background: '#f8f6f3' }}>
        <div className="e-con-inner" style={{ display: 'flex', justifyContent: 'center' }}>
          <ContactForm />
        </div>
      </div>
    </main>`;

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

let injected = 0;
let skipped = 0;
let errors = [];

for (const file of files) {
  // Only process Home and Project pages
  const isProject = file.startsWith('Project') || file.startsWith('ArProject');
  const isHome = file === 'Home.tsx';
  if (!isProject && !isHome) {
    skipped++;
    continue;
  }

  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has the JSX usage
  if (content.includes('<ContactForm')) {
    skipped++;
    continue;
  }

  // Add import if missing
  let modified = content;
  if (!modified.includes("import ContactForm from '../components/ContactForm'")) {
    // Insert after first line that has an import
    if (modified.includes("import React from 'react';")) {
      modified = modified.replace(
        "import React from 'react';",
        "import React from 'react';\n" + FORM_IMPORT
      );
    } else {
      // File starts with export default function..., prepend the import
      modified = FORM_IMPORT + '\n' + modified;
    }
  }

  // Try </main> first (for Home.tsx)
  if (modified.includes('</main>')) {
    const mainCloseIdx = modified.lastIndexOf('</main>');
    modified = modified.substring(0, mainCloseIdx) + FORM_JSX_MAIN + modified.substring(mainCloseIdx + 7);
    fs.writeFileSync(filePath, modified, 'utf8');
    injected++;
    continue;
  }

  // For fragment-based pages: find the last </> that's a closing fragment
  // Look for the pattern `\n    </>` followed by `\n  );\n}`
  const fragPattern = /\n    <\/>\n  \);\n\}/;
  if (fragPattern.test(modified)) {
    modified = modified.replace(fragPattern, '\n' + FORM_JSX_FRAGMENT + '\n  );\n}');
    fs.writeFileSync(filePath, modified, 'utf8');
    injected++;
    continue;
  }

  // Alternative: look for the last occurrence of `</>` in the return statement
  // Search from end of file
  const fragIdx = modified.lastIndexOf('\n    </>');
  if (fragIdx !== -1) {
    modified = modified.substring(0, fragIdx) + '\n' + FORM_JSX_FRAGMENT + modified.substring(fragIdx + 8);
    fs.writeFileSync(filePath, modified, 'utf8');
    injected++;
    continue;
  }

  // Last resort: find `\n  );\n}` at end
  const returnCloseIdx = modified.lastIndexOf('\n  );\n}');
  if (returnCloseIdx !== -1) {
    // Find the matching closing tag before that
    errors.push(`${file}: Could not find closing fragment tag pattern`);
    continue;
  }

  errors.push(`${file}: No injection point found`);
}

console.log(`\nInjected ContactForm into ${injected} files`);
console.log(`Skipped ${skipped} files (already done or not applicable)`);
if (errors.length > 0) {
  console.log(`\nErrors (${errors.length}):`);
  errors.slice(0, 10).forEach(e => console.log(' -', e));
  if (errors.length > 10) console.log(`  ... and ${errors.length - 10} more`);
}
