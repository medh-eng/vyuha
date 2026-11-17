/* Copies only the files the game runs on into www/ for the Android build
 * (Capacitor's webDir). node tools/build-www.mjs
 * Docs, drafts, tests, tools and masters never reach the phone. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'www');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'privacy.html', 'manifest.webmanifest', 'sw.js', 'css', 'js', 'assets']) {
  fs.cpSync(path.join(root, f), path.join(out, f), { recursive: true, filter: (src) => !/README\.md$|\.DS_Store$/.test(src) });
}
let bytes = 0, files = 0;
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else { files++; bytes += fs.statSync(p).size; } } })(out);
console.log('www/: ' + files + ' files, ' + (bytes / 1048576).toFixed(1) + ' MB');
