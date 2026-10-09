/* Site d'essai : petite base de la bulle d'outils (notes, résultats de tests, version réelle).
   Une collection = un fichier JSON privé dans le stockage Blob du projet (db/<collection>.json, { id: document }).
   Lecture toujours à jour (sans cache) ; écriture conditionnelle (ifMatch) refaite si quelqu'un a écrit entre-temps. */
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';

const COLS = ['notes', 'tests', 'reel', 'essai', 'lecture']; // essai : réservé au robot de Claude ; lecture : captures envoyées pour l'essai de lecture par l'IA
const ID = /^[A-Za-z0-9_.:-]{1,120}$/;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

async function read(col) {
  const r = await get(`db/${col}.json`, { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) return { docs: {}, etag: null };
  const txt = await new Response(r.stream).text();
  // Au-delà d'environ 1 Ko, le fichier arrive compressé et son empreinte est dite « faible » (W/"…") ; l'écriture
  // conditionnelle attend l'empreinte sans ce préfixe (même valeur). Sans ce nettoyage, toute écriture échouait (409).
  return { docs: txt ? JSON.parse(txt) : {}, etag: r.blob.etag ? r.blob.etag.replace(/^W\//, '') : null };
}
function write(col, docs, etag) {
  const o = { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 };
  if (etag) o.ifMatch = etag;
  return put(`db/${col}.json`, JSON.stringify(docs), o);
}

export async function GET(request) {
  const col = new URL(request.url).searchParams.get('col');
  if (!COLS.includes(col)) return json({ error: 'collection inconnue' }, 400);
  try { return json({ docs: (await read(col)).docs }); } catch (e) { return json({ error: String(e && e.message || e) }, 500); }
}

export async function POST(request) {
  let o;
  try { o = await request.json(); } catch (e) { return json({ error: 'JSON attendu' }, 400); }
  if (!COLS.includes(o.col) || !ID.test(o.id || '') || !['set', 'update', 'delete'].includes(o.op)) return json({ error: 'requête invalide' }, 400);
  if (o.op !== 'delete' && (typeof o.data !== 'object' || o.data === null || Array.isArray(o.data))) return json({ error: 'document invalide' }, 400);
  for (let i = 0; i < 4; i++) {
    try {
      const { docs, etag } = await read(o.col);
      if (o.op === 'set') docs[o.id] = o.data;
      else if (o.op === 'update') { if (!docs[o.id]) return json({ error: 'document absent' }, 404); docs[o.id] = Object.assign({}, docs[o.id], o.data); }
      else delete docs[o.id];
      await write(o.col, docs, etag);
      return json({ ok: true, id: o.id });
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError) continue;
      return json({ error: String(e && e.message || e) }, 500);
    }
  }
  return json({ error: 'trop d’écritures en même temps, réessaie' }, 409);
}
