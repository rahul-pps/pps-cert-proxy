export const config = { runtime: 'edge' };

// Public Apps Script /exec URL (NOT the /a/macros variant)
const APPS_SCRIPT_BASE =
  'https://script.google.com/macros/s/AKfycbym6oYZQSv7I7kJ4vsEE_uGaixPkNxUcgUefKvExOBoDLlRHilILIJv_DyRJ-PeuTQs/exec';

export default async function handler(req) {
  const url = new URL(req.url);
  const cert = url.searchParams.get('cert');
  const health = url.searchParams.get('health');

  let target = APPS_SCRIPT_BASE;
  if (health) target += '?health=1';
  else if (cert) target += '?cert=' + encodeURIComponent(cert);

  // ✅ Follow redirects so the final HTML is returned
  const resp = await fetch(target, { redirect: 'follow' });

  // Copy headers safely; ensure no caching
  const headers = new Headers(resp.headers);
  headers.delete('set-cookie');
  headers.set('cache-control', 'no-store, no-transform');
  headers.set('x-proxied-by', 'vercel');

  // If Apps Script didn’t set a content-type, default to HTML
  if (!headers.get('content-type')) {
    headers.set('content-type', 'text/html; charset=utf-8');
  }

  return new Response(resp.body, { status: resp.status, headers });
}
