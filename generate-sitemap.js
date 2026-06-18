import fs from 'fs';
import path from 'path';

// Define the absolute base URL for the application
const BASE_URL = process.env.VITE_BASE_URL || 'https://kamojamas.com';

function generateSitemap() {
  const appTsxPath = path.join(process.cwd(), 'src', 'App.tsx');
  
  if (!fs.existsSync(appTsxPath)) {
    console.error(`Error: Could not find ${appTsxPath}`);
    process.exit(1);
  }

  const code = fs.readFileSync(appTsxPath, 'utf8');

  // Simple parser to extract route paths from the React Router configuration
  const routeRegex = /<Route\s+path="([^"]+)"/g;
  const routes = [];
  let match;

  while ((match = routeRegex.exec(code)) !== null) {
    const route = match[1];
    
    // Exclude protected routes, authentication, and dynamic parameter routes
    if (
      route === '*' ||
      route.includes(':') ||
      route.includes('/dashboard') ||
      route.includes('/admin') ||
      route.includes('/auth')
    ) {
      continue;
    }
    
    routes.push(route);
  }

  // Generate XML tags for each route
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  const isHome = route === '/';
  const fullLoc = route === '/' ? BASE_URL : `${BASE_URL}${route.startsWith('/') ? route : `/${route}`}`;
  
  return `  <url>
    <loc>${fullLoc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${isHome ? 'daily' : 'weekly'}</changefreq>
    <priority>${isHome ? '1.0' : '0.8'}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml);

  console.log(`Success! Sitemap with ${routes.length} public routes generated at public/sitemap.xml`);
}

generateSitemap();
