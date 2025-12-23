import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = __dirname;

const envReplacements = {
  GA_ID: process.env.GA_ID ?? 'G-XXXXXXXXXX',
  FB_PIXEL_ID: process.env.FB_PIXEL_ID ?? 'XXXXXXXXXXXXXXX',
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER ?? '57XXXXXXXXXX',
  SITE_URL: process.env.SITE_URL ?? 'https://apartamentoenkuna.com/page1.html'
};

const replaceTokens = (content, map) =>
  Object.entries(map).reduce((acc, [key, value]) => {
    const re = new RegExp(`{{${key}}}`, 'g');
    return acc.replace(re, value);
  }, content);

const languages = ['es', 'en'];

languages.forEach((lang) => {
  const i18nPath = join(root, 'i18n', `${lang}.json`);
  const i18n = JSON.parse(readFileSync(i18nPath, 'utf8'));
  const map = {
    ...envReplacements,
    ...i18n,
    LANG_HREF_ES: 'page-es.html',
    LANG_HREF_EN: 'page-en.html',
    LANG_ACTIVE_ES: lang === 'es' ? 'active' : '',
    LANG_ACTIVE_EN: lang === 'en' ? 'active' : ''
  };

  const files = [
    { template: 'page1.template.html', output: `page-${lang}.html` },
    { template: 'page1.template.js', output: `page-${lang}.js` }
  ];

  files.forEach(({ template, output }) => {
    const templatePath = join(root, template);
    const outputPath = join(root, output);
    const content = readFileSync(templatePath, 'utf8');
    writeFileSync(outputPath, replaceTokens(content, map));
    console.log(`Generated ${output} (${lang})`);
  });

  // Para compatibilidad, dejamos page1.* como alias del español
  if (lang === 'es') {
    writeFileSync(join(root, 'page1.html'), readFileSync(join(root, 'page-es.html'), 'utf8'));
    writeFileSync(join(root, 'page1.js'), readFileSync(join(root, 'page-es.js'), 'utf8'));
  }
});

console.log('Build complete. Remember to keep your environment variables configured in Netlify.');

