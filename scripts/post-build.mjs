import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const zipFile1 = path.join(rootDir, 'public_html_build.zip');
const zipFile2 = path.join(rootDir, 'dist_build.zip');

console.log('🚀 Running post-build enhancements for Hostinger / cPanel / LiteSpeed...');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory does not exist! Run vite build first.');
  process.exit(1);
}

const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ dist/index.html does not exist!');
  process.exit(1);
}
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

// 1. Ensure 404.html exists as a copy of index.html for servers that use 404.html fallback
const fallback404 = path.join(distDir, '404.html');
fs.writeFileSync(fallback404, indexHtmlContent, 'utf-8');
console.log('✅ Created dist/404.html for automatic SPA fallback');

// 2. Ensure .htaccess exists
const htaccessPath = path.join(distDir, '.htaccess');
if (!fs.existsSync(htaccessPath)) {
  const publicHtaccess = path.join(rootDir, 'public', '.htaccess');
  if (fs.existsSync(publicHtaccess)) {
    fs.copyFileSync(publicHtaccess, htaccessPath);
  }
}
console.log('✅ Verified dist/.htaccess configuration');

// 3. Pre-create physical route folders and files so Hostinger never returns 404
const seedPath = path.join(rootDir, 'src', 'data', 'seed-invitations.json');
let knownSlugs = ['kabir-ananya', 'sam-sofia', 'veer-zara', 'akshita-gaurav'];
try {
  if (fs.existsSync(seedPath)) {
    const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    knownSlugs = Array.from(new Set([...knownSlugs, ...Object.keys(seed)]));
  }
} catch (e) {
  console.warn('Could not read seed-invitations.json:', e);
}

const staticRoutes = [
  'create',
  'templates',
  'login',
  'signup',
  'about',
  'contact',
  'privacy',
  'terms',
  'refund',
  'shipping',
  'affiliate',
  'invite/demo',
];

for (const slug of knownSlugs) {
  staticRoutes.push(`i/${slug}`);
  staticRoutes.push(`dashboard/${slug}`);
}

for (const route of staticRoutes) {
  const targetDir = path.join(distDir, route);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtmlContent, 'utf-8');

  // Also create sibling .html file (e.g. /i/akshita-gaurav.html)
  const siblingHtml = path.join(distDir, `${route}.html`);
  const siblingParent = path.dirname(siblingHtml);
  fs.mkdirSync(siblingParent, { recursive: true });
  fs.writeFileSync(siblingHtml, indexHtmlContent, 'utf-8');
}
console.log(`✅ Pre-generated ${staticRoutes.length} physical routes (including all /i/[slug] and /dashboard/[slug])`);

// 4. Package into both public_html_build.zip and dist_build.zip for easy Hostinger deployment
for (const zipFile of [zipFile1, zipFile2]) {
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }
  execSync(`cd "${distDir}" && zip -rq "${zipFile}" .`, { stdio: 'inherit' });
}
console.log('📦 Created public_html_build.zip & dist_build.zip for 1-click Hostinger upload');
console.log('🎉 Post-build process completed successfully!');
