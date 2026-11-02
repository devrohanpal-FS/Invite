import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const apiDir = path.join(rootDir, 'src', 'app', 'api');
const tempApiDir = path.join(rootDir, 'src', 'app', '_api_temp');
const outDir = path.join(rootDir, 'out');
const zipFile = path.join(rootDir, 'public_html_build.zip');

console.log('🚀 Preparing static build for Hostinger / cPanel public_html hosting...');

let movedApi = false;
try {
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, tempApiDir);
    movedApi = true;
  }

  console.log('📦 Running Next.js static export...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, STATIC_EXPORT: 'true' },
  });

  // Duplicate index.html to .html files so BOTH /create and /create/ work instantly on Hostinger!
  console.log('🔄 Creating dual static route files (.html and /index.html)...');
  function createHtmlAliases(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== '_next') {
        const subIndex = path.join(fullPath, 'index.html');
        const siblingHtml = `${fullPath}.html`;
        if (fs.existsSync(subIndex) && !fs.existsSync(siblingHtml)) {
          fs.copyFileSync(subIndex, siblingHtml);
        }
        createHtmlAliases(fullPath);
      }
    }
  }
  createHtmlAliases(outDir);

  console.log('✨ Creating Hostinger LiteSpeed / Apache .htaccess file...');
  const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Security headers
  <IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
  </IfModule>

  # Caching for media and static assets
  <IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType video/mp4 "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
  </IfModule>

  # 1. If exact file exists, serve it
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]

  # 2. If .html file exists for the request (e.g. /create -> /create.html)
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # 3. If directory with index.html exists (e.g. /create/ -> /create/index.html)
  RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
  RewriteRule ^(.*)/?$ $1/index.html [L]

  # 4. Fallback for dynamic invites (/i/[slug])
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^i/([^/]+)/?$ /i/veer-zara/index.html [L]

  # 5. Global Single Page App fallback (Never show Hostinger 404 page)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Custom Error 404 override
ErrorDocument 404 /index.html
`;
  fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent, 'utf-8');

  console.log('🗜️ Packaging into public_html_build.zip...');
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }
  execSync(`cd "${outDir}" && zip -r "${zipFile}" .`, { stdio: 'inherit' });

  console.log(`\n🎉 SUCCESS! Hostinger build ready in:\n📁 Directory: ${outDir}\n📦 Zip File: ${zipFile}`);
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} finally {
  if (movedApi && fs.existsSync(tempApiDir)) {
    fs.renameSync(tempApiDir, apiDir);
  }
}
