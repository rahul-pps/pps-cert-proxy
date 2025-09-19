export const config = { runtime: 'edge' };

// Your public Apps Script /exec URL (NOT the /a/macros variant)
const APPS_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycbym6oYZQSv7I7kJ4vsEE_uGaixPkNxUcgUefKvExOBoDLlRHilILIJv_DyRJ-PeuTQs/exec';

export default async function handler(req) {
  const url = new URL(req.url);
  const cert = url.searchParams.get('cert');
  const health = url.searchParams.get('health');

  let target = APPS_SCRIPT_BASE;
  if (health) target += '?health=1';
  else if (cert) target += '?cert=' + encodeURIComponent(cert);

  const resp = await fetch(target, { redirect: 'manual' });

  const headers = new Headers(resp.headers);
  headers.delete('set-cookie');
  headers.set('cache-control', 'no-store');
  headers.set('x-proxied-by', 'vercel');

  return new Response(resp.body, { status: resp.status, headers });
}
