import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyHead } from './seo-head.mjs';

test('public routes own their raw HTML metadata, even with duplicate template tags', () => {
  const template = readFileSync('index.html', 'utf8').replace('</head>', '<meta data-rh="true" property="og:title" content="Old title"><link href="https://wrong.example/" rel="canonical"></head>');
  for (const page of [
    { path: '/', title: 'Home', description: 'Home description' },
    { path: '/advisors', title: 'Advisors', description: 'Advisor directory' },
    { path: '/calculators/mortgage-payment', title: 'Mortgage', description: 'Mortgage calculator' },
    { path: '/blog/example', title: 'Article & Guide', description: 'Article description', ogType: 'article' },
  ]) {
    const html = applyHead(template, page);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.equal((html.match(/property="og:title"/g) || []).length, 1);
    assert.ok(html.includes(`property="og:url" content="https://financialprofessional.com${page.path}"`));
    assert.ok(html.includes(`property="og:type" content="${page.ogType || 'website'}"`));
    assert.ok(html.includes(`property="og:description" content="${page.description}"`));
    assert.ok(!html.includes('Old title'));
    assert.ok(!html.includes('wrong.example'));
  }
});