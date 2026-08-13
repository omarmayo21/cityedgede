const fs = require('fs');
const path = require('path');

const srcBase = 'd:/front end dev/city-edgede/cityedge-frontend/pages/location';
const destDir = 'client/src/pages';

const locations = [
  { dir: 'new-cairo-city-en',    name: 'LocationNewCairoCity' },
  { dir: 'sheikh-zayed-city-en', name: 'LocationSheikhZayedCity' },
  { dir: 'new-alamein-city-en',  name: 'LocationNewAlameinCity' },
  { dir: 'new-capital-city-en',  name: 'LocationNewCapitalCity' },
  { dir: 'new-mansoura-city-en', name: 'LocationNewMansouraCity' },
  { dir: 'maspero-triangle-en',  name: 'LocationMasperoTriangle' },
];

/**
 * Convert a CSS string like "color: red; font-size: 14px;" to a React style object string
 * like {{ color: 'red', fontSize: '14px' }}
 */
function cssStringToReactStyle(cssStr) {
  // Parse CSS properties
  const pairs = cssStr
    .split(';')
    .map(p => p.trim())
    .filter(Boolean);
  
  const props = pairs.map(pair => {
    const colonIdx = pair.indexOf(':');
    if (colonIdx < 0) return null;
    const prop = pair.substring(0, colonIdx).trim();
    const val = pair.substring(colonIdx + 1).trim();
    // Convert kebab-case to camelCase
    const camelProp = prop.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
    // Escape single quotes in value
    const safeVal = val.replace(/'/g, "\\'");
    return `${camelProp}: '${safeVal}'`;
  }).filter(Boolean);

  if (props.length === 0) return null;
  return `{{ ${props.join(', ')} }}`;
}

locations.forEach(({ dir, name }) => {
  const p = path.join(srcBase, dir, 'index.html');
  if (!fs.existsSync(p)) { console.log('Missing:', p); return; }

  let html = fs.readFileSync(p, 'utf8');

  // Find the archive section
  const archiveStart = html.indexOf('data-elementor-type="archive"');
  if (archiveStart < 0) { console.log('No archive found for', dir); return; }
  const divStart = html.lastIndexOf('<div', archiveStart);

  // Find the footer section to stop there
  const footerStart = html.indexOf('data-elementor-type="footer"');
  const footerDivStart = footerStart > 0 ? html.lastIndexOf('<div', footerStart) : html.length;

  let content = html.substring(divStart, footerDivStart).trim();

  // ===== JSX transformations =====

  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  // Remove script tags
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove noscript tags
  content = content.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

  // Convert <style> blocks to dangerouslySetInnerHTML
  content = content.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (m, attrs, inner) => {
    const safeInner = inner
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\${/g, '\\${');
    return `<style${attrs} dangerouslySetInnerHTML={{ __html: \`${safeInner}\` }} />`;
  });

  // class -> className (but not inside dangerouslySetInnerHTML strings)
  content = content.replace(/\bclass=/g, 'className=');

  // Convert inline style="..." to style={{ ... }}
  content = content.replace(/\bstyle="([^"]*)"/g, (m, cssStr) => {
    const reactStyle = cssStringToReactStyle(cssStr);
    if (!reactStyle) return '';
    return `style=${reactStyle}`;
  });

  // Fix aria-hidden="true" / "false" -> {true} / {false}
  content = content.replace(/aria-hidden="true"/g, 'aria-hidden={true}');
  content = content.replace(/aria-hidden="false"/g, 'aria-hidden={false}');
  // Fix aria-expanded="true"/"false"
  content = content.replace(/aria-expanded="true"/g, 'aria-expanded={true}');
  content = content.replace(/aria-expanded="false"/g, 'aria-expanded={false}');
  // Fix aria-disabled="true"/"false"
  content = content.replace(/aria-disabled="true"/g, 'aria-disabled={true}');
  content = content.replace(/aria-disabled="false"/g, 'aria-disabled={false}');
  // Fix aria-selected="true"/"false"
  content = content.replace(/aria-selected="true"/g, 'aria-selected={true}');
  content = content.replace(/aria-selected="false"/g, 'aria-selected={false}');

  // Fix inert attribute
  content = content.replace(/\binert\b(?!\s*=)/g, 'inert={true}');
  content = content.replace(/\binert="[^"]*"/g, 'inert={true}');

  // Fix self-closing void elements
  content = content.replace(/<br\s*>/gi, '<br />');
  content = content.replace(/<hr([^>]*)>/gi, '<hr$1 />');
  content = content.replace(/<img([^>]*?)(\s*\/?)>/gi, (m, attrs) => `<img${attrs} />`);
  content = content.replace(/<input([^>]*?)(\s*\/?)>/gi, (m, attrs) => `<input${attrs} />`);
  content = content.replace(/<link([^>]*?)(\s*\/?)>/gi, (m, attrs) => `<link${attrs} />`);
  content = content.replace(/<meta([^>]*?)(\s*\/?)>/gi, (m, attrs) => `<meta${attrs} />`);

  // Fix for -> htmlFor
  content = content.replace(/\bfor=/g, 'htmlFor=');
  // tabindex -> tabIndex
  content = content.replace(/\btabindex=/gi, 'tabIndex=');
  // readonly -> readOnly
  content = content.replace(/\breadonly=/gi, 'readOnly=');
  // srcset -> srcSet
  content = content.replace(/\bsrcset=/gi, 'srcSet=');
  // crossorigin -> crossOrigin
  content = content.replace(/\bcrossorigin=/gi, 'crossOrigin=');
  // fetchpriority -> fetchPriority
  content = content.replace(/\bfetchpriority=/gi, 'fetchPriority=');
  // autocomplete -> autoComplete
  content = content.replace(/\bautocomplete=/gi, 'autoComplete=');
  // decoding -> keep as is (valid in JSX)
  // Remove xmlns from SVGs if any
  // Fix custom non-standard HTML attributes that React doesn't accept
  // querydata -> data-querydata
  content = content.replace(/\bquerydata=/g, 'data-querydata=');
  // Fix hidden="hidden" -> hidden={true}
  content = content.replace(/\bhidden="hidden"/g, 'hidden={true}');
  content = content.replace(/\bhidden=""/g, 'hidden={true}');
  // Remove value="..." from non-form elements (span, div, etc.) to avoid TS errors
  // (React only allows value on form elements like input, select, textarea, option)
  // We can't easily detect element type, so we change value="X" on spans to data-value="X"
  content = content.replace(/<span([^>]*)\bvalue="([^"]*)"/g, '<span$1 data-value="$2"');
  // Fix disabled on select/option elements (keep as boolean)
  content = content.replace(/\bdisabled=""/g, 'disabled={true}');
  content = content.replace(/\bdisabled="disabled"/g, 'disabled={true}');
  // Fix checked/selected attributes
  content = content.replace(/\bchecked=""/g, 'defaultChecked={true}');
  content = content.replace(/\bchecked="checked"/g, 'defaultChecked={true}');
  // selected="" on <option> is invalid in JSX, just remove it (select value is controlled by parent)
  content = content.replace(/\bselected=""/g, '');
  content = content.replace(/\bselected="selected"/g, '');

  // Fix invalid HTML: <option> cannot contain <span> children.
  // Convert <option attrs><span ...>TEXT</span></option> to <option attrs>TEXT</option>
  content = content.replace(
    /(<option[^>]*>)\s*<span[^>]*>([\s\S]*?)<\/span>\s*(<\/option>)/gi,
    (m, openTag, innerText, closeTag) => {
      // Strip any nested HTML tags from innerText (keep only text)
      const text = innerText.replace(/<[^>]*>/g, '').trim();
      return `${openTag}${text}${closeTag}`;
    }
  );

  // Convert absolute project/location links to internal React Router Link components
  // Also strip -en or -ar from the slug so it matches our App.tsx React routes (e.g., /location/new-cairo-city)
  content = content.replace(/<a([^>]*?)href="https?:\/\/cityedgedevelopments\.com\/(project|location)\/([^/"]+)\/?"([^>]*?)>([\s\S]*?)<\/a>/gi, (match, p1, type, slug, p4, p5) => {
    const cleanSlug = slug.replace(/-(en|ar)$/i, '');
    return `<Link${p1}to="/${type}/${cleanSlug}"${p4}>${p5}</Link>`;
  });

  const jsx = `import ContactForm from '../components/ContactForm';
import { Link } from 'react-router-dom';

export default function ${name}() {
  return (
    <>
      ${content}
      <ContactForm />
    </>
  );
}
`;

  const outPath = path.join(destDir, `${name}.tsx`);
  fs.writeFileSync(outPath, jsx);
  console.log('Generated:', name, '- size:', Math.round(jsx.length / 1024), 'KB');
});
