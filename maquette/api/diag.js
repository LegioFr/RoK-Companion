/* Diagnostic temporaire (2026-10-09) : à supprimer. Montre ce que renvoie le stockage pour db/<col>.json. */
import { get, head, put, BlobPreconditionFailedError } from '@vercel/blob';
const json = (o, s = 200) => new Response(JSON.stringify(o, null, 1), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
export async function GET(request) {
  const col = new URL(request.url).searchParams.get('col') || 'tests';
  if (!['notes', 'tests', 'reel', 'diag'].includes(col)) return json({ error: 'col' }, 400);
  const p = `db/${col}.json`, out = {};
  try { const h = await head(p); out.head = { etag: h.etag, uploadedAt: h.uploadedAt, size: h.size, cacheControl: h.cacheControl }; } catch (e) { out.head = String(e.message || e); }
  for (const uc of [false, true]) { try { const r = await get(p, { access: 'private', useCache: uc }); out['get_useCache_' + uc] = r ? { status: r.statusCode, etag: r.blob.etag, size: r.blob.size, uploadedAt: r.blob.uploadedAt, hdrEtag: r.headers.get('etag'), age: r.headers.get('age'), xcache: r.headers.get('x-vercel-cache') } : null; } catch (e) { out['get_useCache_' + uc] = String(e.message || e); } }
  if (col === 'diag') {
    try { const r = await get(p, { access: 'private', useCache: false }); const et = r && r.blob.etag;
      await put(p, JSON.stringify({ t: Date.now() }), { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60, ...(et ? { ifMatch: et } : {}) });
      out.put = 'ok avec ifMatch=' + et; } catch (e) { out.put = (e instanceof BlobPreconditionFailedError ? 'PRECONDITION ' : '') + String(e.message || e); }
  }
  return json(out);
}
