import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const output = path.resolve('dist/client');
const html = readFileSync(path.join(output, 'index.html'), 'utf8');
const base = '/wuttichai.github.io/';
for (const content of ['Wuttichai Sukantho', 'profile-readme', 'ADot', 'May 2024', 'Jul 2023']) {
  assert.ok(html.includes(content), `Missing prerendered content: ${content}`);
}
assert.ok(html.includes('https://wuttichaisukantho.github.io/wuttichai.github.io'));
assert.ok(!html.includes('firebaseapp.com'), 'Stale Firebase canonical URL');
for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
  const url = match[1];
  assert.ok(url);
  assert.ok(url.startsWith(base), `Asset or route escapes the Pages base: ${url}`);
  assert.ok(
    existsSync(path.join(output, decodeURIComponent(url.slice(base.length)))),
    `Missing: ${url}`,
  );
}
assert.ok(existsSync(path.join(output, '.nojekyll')));
process.stdout.write(
  'Pages checks passed: prerendered profile, both timelines, canonical URL and local assets.\n',
);
