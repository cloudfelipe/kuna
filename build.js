import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = __dirname;

const replacements = {
  GA_ID: process.env.GA_ID ?? 'G-XXXXXXXXXX',
  FB_PIXEL_ID: process.env.FB_PIXEL_ID ?? 'XXXXXXXXXXXXXXX',
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER ?? '57XXXXXXXXXX',
  SITE_URL: process.env.SITE_URL ?? 'https://apartamentoenkuna.com/page1.html'
};

const replaceTokens = (content) =>
  content
    .replace(/{{GA_ID}}/g, replacements.GA_ID)
    .replace(/{{FB_PIXEL_ID}}/g, replacements.FB_PIXEL_ID)
    .replace(/{{WHATSAPP_NUMBER}}/g, replacements.WHATSAPP_NUMBER)
    .replace(/{{SITE_URL}}/g, replacements.SITE_URL);

const files = [
  { template: 'page1.template.html', output: 'page1.html' },
  { template: 'page1.template.js', output: 'page1.js' }
];

files.forEach(({ template, output }) => {
  const templatePath = join(root, template);
  const outputPath = join(root, output);
  const content = readFileSync(templatePath, 'utf8');
  writeFileSync(outputPath, replaceTokens(content));
  console.log(`Generated ${output} from ${template}`);
});

console.log('Build complete. Remember to keep your environment variables configured in Netlify.');

