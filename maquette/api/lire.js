/* Essai de lecture des captures de l'Inventaire par Claude (décision de Mickaël du 2026-10-09).
   La clé API Anthropic est rangée par Mickaël dans les variables du projet Vercel (ANTHROPIC_API_KEY) :
   elle n'est jamais dans le dépôt, ni renvoyée par cette fonction.
   GET  /api/lire                          → { cle: true|false } (la clé est-elle en place ?)
   POST /api/lire { id, modele, effort? }  → lecture d'une capture déjà envoyée par /api/capture, avec le coût réel. */
import Anthropic from '@anthropic-ai/sdk';
import { get } from '@vercel/blob';

// Modèles de l'essai (Mickaël, 2026-10-09) : Claude Haiku 5.5 et Claude Sonnet 5.5, puis Claude Opus 5.5 (sa question « tu as essayé avec Opus ? »).
const MODELES = { haiku: 'claude-haiku-5-5', sonnet: 'claude-sonnet-5-5', opus: 'claude-opus-5-5' };
// Tarifs Anthropic en dollars par million de jetons [entrée, sortie], relevés le 2026-10-06 (prompt de 100 K jetons au plus).
const TARIFS = { 'claude-haiku-5-5': [0.10, 0.50], 'claude-sonnet-5-5': [2, 10], 'claude-opus-5-5': [4, 20] };
const EFFORTS = ['low', 'medium', 'high'];
const ID = /^c[a-z0-9]{6,40}\.(png|jpe?g|webp)$/;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/* Icônes des accélérateurs : étude des captures de Mickaël du 2026-10-06 (texte du panneau de droite) ; ajoutées le 2026-10-09
   après l'essai (Haiku prenait les accélérateurs de soin pour de la construction). */
const CONSIGNE = `Tu lis une capture d'écran de l'Inventaire du jeu Rise of Kingdoms, jeu en français, pour un joueur qui veut recopier ses objets dans une appli.
Disposition de l'écran :
- en haut, une barre de compteurs : les ressources en ville, arrondies (par exemple « 81.8M »), et les gemmes ;
- à gauche, les onglets Ressources, Accélérateurs, Boosts, Équipement, Attirail, Autre ; l'onglet ouvert est mis en valeur ;
- au centre, une grille de cases sur 4 colonnes : chaque case porte une icône, parfois une valeur en haut (taille d'une caisse comme « 7 500 », ou durée comme « 1m », « 60m », « 8h ») et la quantité possédée en bas à droite ;
- à droite, un panneau décrit l'objet sélectionné (son nom et un texte).
Règles :
- Recopie chaque nombre exactement comme il est affiché, espaces compris, sans le corriger ni l'arrondir. Un texte absent ou invisible s'écrit "".
- Liste seulement les cases visibles, ligne par ligne, de gauche à droite ; ne devine jamais une case qui n'est pas à l'écran.
- Une case coupée par le bord de la grille (défilement) : coupee = true, et ne devine pas ce qui est caché.
- objet : quelques mots en français tirés de l'icône et de la valeur, par exemple « caisse de nourriture », « caisse de pierre », « caisse de gemmes », « coffre de ressources au choix », « accélérateur de construction », « accélérateur de recherche », « accélérateur d'entraînement », « accélérateur de soin », « accélérateur universel » ; « inconnu » si tu ne sais pas.
- Les accélérateurs se distinguent par le petit dessin posé sur les flèches : établi et marteau = construction ; fiole = recherche ; cible = entraînement ; rouleau de bandage = soin ; sablier = universel (« Accélération », utilisable partout).
- sur = false dès qu'un chiffre de la case est douteux ou illisible.`;

const TXT = { type: 'string' };
const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['onglet', 'barre', 'cases', 'panneau'],
  properties: {
    onglet: { type: 'string', enum: ['Ressources', 'Accélérateurs', 'Boosts', 'Équipement', 'Attirail', 'Autre', 'inconnu'] },
    barre: { type: 'object', additionalProperties: false, required: ['nourriture', 'bois', 'pierre', 'or', 'gemmes'],
      properties: { nourriture: TXT, bois: TXT, pierre: TXT, or: TXT, gemmes: TXT } },
    cases: { type: 'array', items: { type: 'object', additionalProperties: false,
      required: ['ligne', 'colonne', 'objet', 'valeur_haut', 'quantite', 'coupee', 'sur'],
      properties: { ligne: { type: 'integer' }, colonne: { type: 'integer' }, objet: TXT, valeur_haut: TXT, quantite: TXT, coupee: { type: 'boolean' }, sur: { type: 'boolean' } } } },
    panneau: { type: 'object', additionalProperties: false, required: ['nom', 'texte'], properties: { nom: TXT, texte: TXT } }
  }
};

export async function GET() {
  return json({ cle: !!process.env.ANTHROPIC_API_KEY, modeles: Object.keys(MODELES) });
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'clé absente : ANTHROPIC_API_KEY n’est pas dans les variables du projet Vercel' }, 503);
  let b; try { b = await request.json(); } catch { return json({ error: 'JSON attendu' }, 400); }
  const model = MODELES[b && b.modele];
  if (!model) return json({ error: 'modèle inconnu (haiku, sonnet ou opus)' }, 400);
  if (!ID.test((b && b.id) || '')) return json({ error: 'identifiant de capture invalide' }, 400);
  const effort = EFFORTS.includes(b.effort) ? b.effort : null;

  const r = await get('captures/' + b.id, { access: 'private' });
  if (!r || r.statusCode !== 200) return json({ error: 'capture introuvable' }, 404);
  const data = Buffer.from(await new Response(r.stream).arrayBuffer()).toString('base64');

  const client = new Anthropic();
  const t0 = Date.now();
  let msg;
  try {
    msg = await client.messages.create({
      model,
      max_tokens: 16000,
      system: CONSIGNE,
      output_config: effort ? { effort, format: { type: 'json_schema', schema: SCHEMA } } : { format: { type: 'json_schema', schema: SCHEMA } },
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: r.blob.contentType, data } },
        { type: 'text', text: 'Lis cette capture de l’Inventaire.' }
      ] }]
    });
  } catch (e) {
    if (e instanceof Anthropic.APIError) return json({ error: e.message, status: e.status ?? null }, 502);
    throw e;
  }
  const duree_ms = Date.now() - t0;
  const texte = msg.content.filter((c) => c.type === 'text').map((c) => c.text).join('');
  let resultat = null; try { resultat = JSON.parse(texte); } catch { resultat = null; }
  const u = msg.usage || {}, t = TARIFS[model];
  const cout_usd = t ? ((u.input_tokens || 0) * t[0] + (u.output_tokens || 0) * t[1]) / 1e6 : null;
  return json({ id: b.id, modele: b.modele, model: msg.model, effort: effort || 'par défaut', stop_reason: msg.stop_reason,
    duree_ms, usage: { input_tokens: u.input_tokens || 0, output_tokens: u.output_tokens || 0 }, cout_usd, resultat, brut: resultat ? undefined : texte });
}
