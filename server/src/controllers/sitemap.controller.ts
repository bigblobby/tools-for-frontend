import { type Request, type Response } from 'express';

// Routes from page.constants.ts - keeping in sync with client routes
const routes = [
  '/',
  '/string/count',
  '/string/transform',
  '/string/case-converter',
  '/string/encode-decode',
  '/string/jwt-decoder',
  '/string/json-formatter',
  '/string/hash-generator',
  '/color/picker',
  '/color/converter',
  '/color/gradient-generator',
  '/color/contrast-checker',
  '/css/box-shadow',
  '/converter/xml-to-json',
  '/converter/json-to-xml',
  '/date-time/epoch-unix',
  '/image/base64',
  '/image/optimise',
  '/image/placeholder',
  '/image/favicon-generator',
];

const getBaseUrl = (req: Request): string => {
  // Try to get from environment variable first
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  
  // Fallback to constructing from request
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

export const sitemapController = {
  getSitemap: (req: Request, res: Response): void => {
    const baseUrl = getBaseUrl(req);
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
  },

  getRobotsTxt: (req: Request, res: Response): void => {
    const baseUrl = getBaseUrl(req);

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robotsTxt);
  },
};

