/**
 * fix-fonts.js
 * 
 * 1. Rewrites ALL @font-face Aeonik references in index.html inline styles and any CSS files
 *    to use /fonts/AeonikTRIAL-*.otf (already copied to public/fonts/)
 * 2. Rewrites Roboto @font-face src to use Google Fonts API so it works reliably
 *    (since Roboto woff2 binaries were never scraped — files are 0 bytes)
 * 3. Removes all references to mediumorchid-hyena-502932.hostingersite.com and
 *    cityedgedevelopments.com in CSS font-src lines
 * 4. Fixes the roboto.css / robotoslab.css served from wp-content (which serve from Hostinger)
 *    by rewriting those src URLs to use a local google-fonts proxy we create.
 */
const fs = require('fs');
const path = require('path');

const clientSrc = path.join(__dirname, '../client/src');
const clientPublic = path.join(__dirname, '../client/public');
const indexHtml = path.join(__dirname, '../client/index.html');

// ─── 1. VERIFY Aeonik OTFs are present ──────────────────────────────────────
const aeonikFiles = [
  'AeonikTRIAL-Light.otf',
  'AeonikTRIAL-Regular.otf',
  'AeonikTRIAL-Bold.otf',
];
aeonikFiles.forEach(f => {
  const p = path.join(clientPublic, 'fonts', f);
  if (!fs.existsSync(p)) {
    console.error('MISSING:', p);
    process.exit(1);
  }
  const size = fs.statSync(p).size;
  if (size < 5000) {
    console.error('INVALID (too small):', p, size, 'bytes');
    process.exit(1);
  }
  console.log('✓ Valid OTF:', f, size, 'bytes');
});

// ─── 2. Build the corrected Aeonik @font-face block ─────────────────────────
const aeonikFontFace = `@font-face {
\tfont-family: 'AeonikTRIAL';
\tfont-style: normal;
\tfont-weight: 300;
\tsrc: url('/fonts/AeonikTRIAL-Light.otf') format('opentype');
}
@font-face {
\tfont-family: 'AeonikTRIAL';
\tfont-style: normal;
\tfont-weight: 400;
\tsrc: url('/fonts/AeonikTRIAL-Regular.otf') format('opentype');
}
@font-face {
\tfont-family: 'AeonikTRIAL';
\tfont-style: normal;
\tfont-weight: 700;
\tsrc: url('/fonts/AeonikTRIAL-Bold.otf') format('opentype');
}`;

// ─── 3. PATCH index.html ─────────────────────────────────────────────────────
let indexContent = fs.readFileSync(indexHtml, 'utf8');

// Replace the existing cf-frontend-style-inline-css block (which has the bad wp-content URL)
// Strategy: replace everything between the opening and closing of that style block
indexContent = indexContent.replace(
  /<style id="cf-frontend-style-inline-css">[\s\S]*?<\/style>/,
  `<style id="cf-frontend-style-inline-css">\n${aeonikFontFace}\n</style>`
);

// Also fix any stray /wp-content/uploads/2025/05/AeonikTRIAL*.otf references
// (these appear in the wp-custom-css block too)
indexContent = indexContent.replace(
  /url\(['"]?\/wp-content\/uploads\/2025\/05\/AeonikTRIAL-Light\.otf['"]?\)[^;]*/g,
  "url('/fonts/AeonikTRIAL-Light.otf') format('opentype')"
);
indexContent = indexContent.replace(
  /url\(['"]?\/wp-content\/uploads\/2025\/05\/AeonikTRIAL-Regular\.otf['"]?\)[^;]*/g,
  "url('/fonts/AeonikTRIAL-Regular.otf') format('opentype')"
);
indexContent = indexContent.replace(
  /url\(['"]?\/wp-content\/uploads\/2025\/05\/AeonikTRIAL-Bold\.otf['"]?\)[^;]*/g,
  "url('/fonts/AeonikTRIAL-Bold.otf') format('opentype')"
);

fs.writeFileSync(indexHtml, indexContent);
console.log('✓ Patched index.html Aeonik @font-face refs');

// ─── 4. PATCH all CSS files in client/src/styles/ ───────────────────────────
const stylesDir = path.join(clientSrc, 'styles');
if (fs.existsSync(stylesDir)) {
  const cssFiles = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css'));
  cssFiles.forEach(cssFile => {
    const cssPath = path.join(stylesDir, cssFile);
    let css = fs.readFileSync(cssPath, 'utf8');
    let changed = false;

    // Replace any Aeonik wp-content URLs
    const before = css;
    css = css.replace(
      /url\(['"]?[^'"]*AeonikTRIAL-Light\.otf[^'"]*['"]?\)[^;]*/g,
      "url('/fonts/AeonikTRIAL-Light.otf') format('opentype')"
    );
    css = css.replace(
      /url\(['"]?[^'"]*AeonikTRIAL-Regular\.otf[^'"]*['"]?\)[^;]*/g,
      "url('/fonts/AeonikTRIAL-Regular.otf') format('opentype')"
    );
    css = css.replace(
      /url\(['"]?[^'"]*AeonikTRIAL-Bold\.otf[^'"]*['"]?\)[^;]*/g,
      "url('/fonts/AeonikTRIAL-Bold.otf') format('opentype')"
    );
    if (css !== before) { changed = true; }
    if (changed) {
      fs.writeFileSync(cssPath, css);
      console.log('✓ Patched', cssFile);
    }
  });
}

// ─── 5. CREATE local Roboto CSS that uses Google Fonts (CDN, no Hostinger) ──
// The scraped roboto.css uses Hostinger URLs which are dead.
// We replace the entire content of the wp-content roboto.css files with
// a simple Google Fonts import so Roboto loads from Google's CDN.
// This is the correct fallback when local font binaries are 0 bytes.
const robotoGoogleImport = `/* Roboto via Google Fonts CDN */
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&display=swap');
`;

const robotoSlabGoogleImport = `/* Roboto Slab via Google Fonts CDN */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&display=swap');
`;

// Patch the actual CSS files served as /wp-content/... by the Vite dev server (public dir)
const publicWpContent = path.join(clientPublic, 'wp-content');

function patchRobotoCssInPublic(startDir) {
  if (!fs.existsSync(startDir)) return;
  const entries = fs.readdirSync(startDir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      patchRobotoCssInPublic(fullPath);
    } else if (entry.name === 'roboto.css') {
      fs.writeFileSync(fullPath, robotoGoogleImport);
      console.log('✓ Replaced Hostinger roboto.css with Google Fonts import:', fullPath);
    } else if (entry.name === 'robotoslab.css') {
      fs.writeFileSync(fullPath, robotoSlabGoogleImport);
      console.log('✓ Replaced Hostinger robotoslab.css with Google Fonts import:', fullPath);
    } else if (entry.name.endsWith('.css')) {
      // Patch any other CSS that references Hostinger font URLs
      let css = fs.readFileSync(fullPath, 'utf8');
      if (css.includes('hostingersite.com') || css.includes('cityedgedevelopments.com')) {
        css = css.replace(
          /url\(['"]?https?:\/\/mediumorchid-hyena-502932\.hostingersite\.com\/wp-content\/uploads\/elementor\/google-fonts\/fonts\/([^'")\s]+)['"]?\)/g,
          (match, filename) => `url('/fonts/roboto/${filename}')`
        );
        css = css.replace(
          /url\(['"]?https?:\/\/cityedgedevelopments\.com[^\)]*['"]?\)/g,
          "url('about:blank')"
        );
        fs.writeFileSync(fullPath, css);
        console.log('✓ Patched Hostinger URLs in:', entry.name);
      }
    }
  });
}

patchRobotoCssInPublic(publicWpContent);

// ─── 6. ADD Google Fonts link to index.html head ────────────────────────────
let idx = fs.readFileSync(indexHtml, 'utf8');
if (!idx.includes('fonts.googleapis.com')) {
  const marker = '<!-- Elementor CSS Dependencies from Original Source -->';
  const googleFontsLink = `<link rel="preconnect" href="https://fonts.googleapis.com" />\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Roboto+Slab:wght@100;400;700&display=swap" />\n    `;
  idx = idx.replace(marker, googleFontsLink + marker);
  fs.writeFileSync(indexHtml, idx);
  console.log('✓ Added Google Fonts link to index.html');
}

console.log('\n=== Font Fix Complete ===');
console.log('Aeonik: served from /fonts/*.otf (local)');
console.log('Roboto: served from Google Fonts CDN (since scraped woff2 files are 0 bytes)');
