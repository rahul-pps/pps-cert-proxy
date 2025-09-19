export const config = { runtime: 'edge' };

// Public Apps Script /exec URL (NOT the /a/macros variant)
const APPS_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycbym6oYZQSv7I7kJ4vsEE_uGaixPkNxUcgUefKvExOBoDLlRHilILIJv_DyRJ-PeuTQs/exec';

export default async function handler(req) {
  const inUrl = new URL(req.url);
  const parts = inUrl.pathname.split('/').filter(Boolean); // e.g. ['cert','Cert1'] or [] for root
  let target = APPS_SCRIPT_BASE;

  if (parts.length === 0) {
    target = APPS_SCRIPT_BASE;
  } else if (parts.length === 1 && parts[0].toLowerCase() === 'health') {
    target = APPS_SCRIPT_BASE + '?health=1';
  } else if (parts.length === 2 && parts[0].toLowerCase() === 'cert') {
    target = APPS_SCRIPT_BASE + '?cert=' + encodeURIComponent(parts[1]);
  } else {
    target = APPS_SCRIPT_BASE + inUrl.search; // pass-through queries
  }

  const resp = await fetch(target, { redirect: 'manual' });
  const headers = new Headers(resp.headers);
  headers.delete('set-cookie');
  headers.set('x-proxied-by', 'vercel');
  headers.set('cache-control', 'no-store');

  return new Response(resp.body, { status: resp.status, headers });
}
