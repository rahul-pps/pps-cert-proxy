export const config = { runtime: 'edge' };

// Public Apps Script /exec URL (NOT the /a/macros variant)
const APPS_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycbym6oYZQSv7I7kJ4vsEE_uGaixPkNxUcgUefKvExOBoDLlRHilILIJv_DyRJ-PeuTQs/exec';

export default async function handler(req) {
  const inUrl = new URL(req.url);

  // 🔧 Strip the '/api' prefix that exists after Vercel rewrites
  const pathOnly = inUrl.pathname.replace(/^\/api\b/, '');   // '/cert/Cert1' or '/health' or '/'
  const parts = pathOnly.split('/').filter(Boolean);         // ['cert','Cert1'] | ['health'] | []

  let target = APPS_SCRIPT_BASE;

  if (parts.length === 0) {
    // root → landing
    target = APPS_SCRIPT_BASE;
  } else if (parts.length === 1 && parts[0].toLowerCase() === 'health') {
    target = APPS_SCRIPT_BASE + '?health=1';
  } else if (parts.length === 2 && parts[0].toLowerCase() === 'cert') {
    target = APPS_SCRIPT_BASE + '?cert=' + encodeURIComponent(parts[1]);
  } else {
    // passthrough for other cases (keeps query string)
    target = APPS_SCRIPT_BASE + inUrl.search;
  }

  const resp = await fetch(target, { redirect: 'manual' });
  const headers = new Headers(resp.headers);
  headers.delete('set-cookie');
  headers.set('x-proxied-by', 'vercel');
  headers.set('cache-control', 'no-store');

  return new Response(resp.body, { status: resp.status, headers });
}
