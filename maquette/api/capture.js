/* Site d'essai : captures jointes aux notes et aux tests, gardées privées dans le stockage Blob du projet.
   Elles s'affichent par /_blob/<id> (voir vercel.json), comme dans claude.ai. */
import { get, put, del } from '@vercel/blob';

const ID = /^c[a-z0-9]{6,40}\.(png|jpe?g|webp|gif)$/;
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const idOf = (request) => new URL(request.url).searchParams.get('id') || '';

export async function POST(request) {
  const type = (request.headers.get('content-type') || '').split(';')[0].trim();
  if (!EXT[type]) return json({ error: 'image PNG, JPEG, WebP ou GIF attendue' }, 400);
  const buf = await request.arrayBuffer();
  if (!buf.byteLength || buf.byteLength > 4000000) return json({ error: 'image vide ou trop lourde (4 Mo au plus)' }, 413);
  const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10) + '.' + EXT[type];
  try {
    await put('captures/' + id, buf, { access: 'private', contentType: type, addRandomSuffix: false });
    return json({ id, url: '/_blob/' + id, sizeBytes: buf.byteLength, contentType: type });
  } catch (e) { return json({ error: String(e && e.message || e) }, 500); }
}

export async function GET(request) {
  const id = idOf(request);
  if (!ID.test(id)) return json({ error: 'identifiant invalide' }, 400);
  const r = await get('captures/' + id, { access: 'private' });
  if (!r || r.statusCode !== 200) return json({ error: 'introuvable' }, 404);
  return new Response(r.stream, { headers: { 'content-type': r.blob.contentType, 'cache-control': 'private, max-age=86400' } });
}

export async function DELETE(request) {
  const id = idOf(request);
  if (!ID.test(id)) return json({ error: 'identifiant invalide' }, 400);
  try { await del('captures/' + id); return json({ ok: true }); } catch (e) { return json({ error: String(e && e.message || e) }, 500); }
}
