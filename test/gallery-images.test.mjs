import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('build includes the two new gallery images', () => {
  execFileSync('node', ['build.js'], { cwd: process.cwd(), stdio: 'ignore' });

  const html = readFileSync('page-es.html', 'utf8');

  assert.match(html, /assets-optimized\/foto6_1-1080\.jpg/);
  assert.match(html, /assets-optimized\/foto6_2-1080\.jpg/);
});
