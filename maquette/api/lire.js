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

/* Objets des onglets Boosts, Équipement, Attirail et Autre (2026-10-10, décision de Mickaël « Vas-y ») : chaque case reçoit l'identifiant
   d'un objet du catalogue de l'appli (maquette/donnees-jeu.js, RC_JEU.objets). Descriptions des icônes tirées des captures de Mickaël
   du 10 oct. 2026 (couleur = fond de la case : gris, vert, bleu, violet, orange). */
const OBJETS = [
  ['Boosts', [
    ['res5', 'orange, valeur du haut « 20 000 » : deux armures argentées avec des boucliers ronds rouges (Réserve)'],
    ['res6', 'orange, valeur du haut « 50 000 » : même dessin (Réserve)'],
    ['att12', 'vert, « 12h » : lances ou flèches avec une croix verte (attaque)'], ['att24', 'bleu, « 24h » : lances ou flèches avec une croix verte (attaque)'], ['att24a', 'violet, « 24h » : lances ou flèches (attaque avancée)'],
    ['def12', 'vert, « 12h » : bouclier rond métallique avec une croix verte (défense)'], ['def24', 'bleu, « 24h » : bouclier rond métallique avec une croix verte (défense)'], ['def24a', 'violet, « 24h » : bouclier rond (défense avancée)'],
    ['exp25', 'bleu, « 4h » : soldats en armure avec des boucliers dorés (expansion d’armée basique)'],
    ['exp50', 'violet, « 4h » : soldats en armure avec des boucliers dorés (expansion d’armée avancée)']]],
  ['Équipement', [
    ['cme_g', 'gris : coffre argenté massif, en métal blanc (coffre de matériaux d’équipement)'], ['cme_v', 'vert : le même coffre argenté'],
    ['cmc_g', 'gris : coffre couleur cuivre à angles saillants (coffre au choix de matériau)'], ['cmc_v', 'vert : le même coffre cuivre'],
    ['cmc_b', 'bleu : le même coffre cuivre'], ['cmc_p', 'violet : le même coffre cuivre'], ['cmc_o', 'orange : le même coffre cuivre'],
    ['lot_lo', 'vert : coffre en bois bombé, cerclé de fer gris, petite serrure (lot de la Légion de l’Ombre)'],
    ['cfp_v', 'vert : coffre en bois plus large cerclé de fer, grosse serrure carrée (fragment de plan avancé au choix)'],
    ['cfp_b', 'bleu : coffre bronze couvert d’écailles (fragment de plan élite au choix)'],
    ['cfp_p', 'violet : coffre argenté à écailles avec une pièce d’armure dorée dessus (fragment de plan épique au choix)'],
    ['cfp_o', 'orange : coffre rouge et or avec une pièce dorée (plastron, jambières, gants, arme) en haut à droite (fragment de plan légendaire au choix)'],
    ['piece_g', 'gris : pièce d’équipement forgée (casque, armure, gants, pantalon, bottes, arme, accessoire), souvent avec un portrait de commandant ou un insigne dans un coin, SANS quantité'],
    ['piece_v', 'vert : pièce d’équipement forgée, sans quantité'], ['piece_b', 'bleu : pièce d’équipement forgée, sans quantité'],
    ['piece_p', 'violet : pièce d’équipement forgée, sans quantité'], ['piece_o', 'orange : pièce d’équipement forgée, sans quantité'],
    ['plan_g', 'gris : parchemin doré avec le dessin d’une pièce, SANS pièce de puzzle (plan)'], ['plan_v', 'vert : plan'], ['plan_b', 'bleu : plan'], ['plan_p', 'violet : plan'], ['plan_o', 'orange : plan'],
    ['frag_g', 'gris : parchemin avec une pièce de puzzle blanche en haut à gauche (fragment de plan)'], ['frag_v', 'vert : fragment de plan'], ['frag_b', 'bleu : fragment de plan'], ['frag_p', 'violet : fragment de plan'], ['frag_o', 'orange : fragment de plan'],
    ['cuir_g', 'gris : cuir (peaux et rouleaux de cuir brun)'], ['cuir_v', 'vert : cuir'], ['cuir_b', 'bleu : cuir'], ['cuir_p', 'violet : cuir'], ['cuir_o', 'orange : cuir'],
    ['fer_g', 'gris : minerai de fer (pierres gris argenté)'], ['fer_v', 'vert : minerai de fer'], ['fer_b', 'bleu : minerai de fer'], ['fer_p', 'violet : minerai de fer'], ['fer_o', 'orange : minerai de fer'],
    ['ebene_g', 'gris : ébène (planches de bois brun très sombre)'], ['ebene_v', 'vert : ébène'], ['ebene_b', 'bleu : ébène'], ['ebene_p', 'violet : ébène'], ['ebene_o', 'orange : ébène'],
    ['os_g', 'gris : os d’animal (crocs et os blancs)'], ['os_v', 'vert : os d’animal'], ['os_b', 'bleu : os d’animal'], ['os_p', 'violet : os d’animal'], ['os_o', 'orange : os d’animal']]],
  ['Attirail', [
    ['cform', 'coffre doré à pointes avec une gemme bleue, avec une quantité (coffre au choix de formation)'],
    ['piece_attirail', 'pièce d’attirail (parchemin, cor, étendard, emblème…) avec un petit insigne doré en haut à gauche, SANS quantité']]],
  ['Autre', [
    ['sch_o', 'orange : tête sculptée dorée façon totem (sculpture de commandant au choix, légendaire)'], ['sch_p', 'violet : la même tête, argentée'],
    ['sch_b', 'bleu : la même tête, bronze'], ['sch_v', 'vert : la même tête, en pierre'],
    ['scm_o', 'orange : buste blanc d’un commandant nommé (sculpture de commandant)'], ['scm_p', 'violet : buste blanc de commandant'],
    ['scm_b', 'bleu : buste blanc de commandant'], ['scm_v', 'vert : buste blanc de commandant'],
    ['ste_o_s', 'orange : UNE étoile dorée lisse sur un socle (sculpture de lumière d’étoile)'], ['ste_o_b', 'orange : étoile dorée hérissée, à rayons (bénie)'], ['ste_o_l', 'orange : plusieurs étoiles dorées (lot)'],
    ['ste_p_s', 'violet : une étoile argentée lisse'], ['ste_p_b', 'violet : étoile argentée hérissée'], ['ste_p_l', 'violet : plusieurs étoiles argentées'],
    ['ste_b_s', 'bleu : une étoile bronze lisse'], ['ste_b_b', 'bleu : étoile bronze hérissée'], ['ste_b_l', 'bleu : plusieurs étoiles bronze'],
    ['ste_v_s', 'vert : une étoile grise lisse'], ['ste_v_b', 'vert : étoile grise hérissée'], ['ste_v_l', 'vert : plusieurs étoiles grises'],
    ['xp1', 'livre bleu « XP », valeur du haut « 100 » (tome du savoir)'], ['xp2', 'livre « XP », « 500 »'], ['xp3', 'livre « XP », « 1 000 »'], ['xp4', 'livre « XP », « 5 000 »'],
    ['xp5', 'livre « XP », « 10 000 »'], ['xp6', 'livre « XP », « 20 000 »'], ['xp7', 'livre « XP », « 50 000 »'],
    ['pa50', 'fiole verte, valeur du haut « 50 » (points d’action)'], ['pa100', 'fiole verte, « 100 »'], ['pa500', 'fiole verte, « 500 »'], ['pa1000', 'fiole verte, « 1 000 »'],
    ['cle_ar', 'violet : clé argentée (clé en argent)'], ['cle_or', 'orange : clé dorée simple (clé en or)'],
    ['cle_cr', 'orange : clé dorée avec un orbe bleu (clé de cristal)'], ['cle_sv', 'orange : clé dorée avec une gemme verte (clé de souverain)'],
    ['livre_all', 'vert : livre rouge avec une épée (livre d’alliance)'], ['fleche_res', 'vert : pointe métallique avec une flamme (flèche de résistance)'],
    ['passeport', 'orange : carte dépliée avec une flèche jaune (page de passeport)'],
    ['tresor_reine', 'orange : coffre bombé en métal doré et gris, serrure en forme de bouclier (trésor de la Reine guerrière)'],
    ['coffre_scm', 'orange : coffre en bois cerclé d’or, fermoir sur le devant (coffre de sculpture de commandant)']]],
  ['Tous les onglets (objets à ignorer)', [
    ['ignorer', 'objet sans intérêt pour l’appli, dans n’importe quel onglet (sur = true) : boucliers de la paix (écusson doré ailé), longues-vues anti-reconnaissance, pelles de récolte (croix verte), pièce argentée « ROK », gemmes vertes serties d’or, pièce hexagonale à couronne, pièce au poisson, sac au poisson, médaillon hexagonal bleu et or, pomme dorée, caisses en bois à flèches (téléportations), chef barbare Lohar, pinceau arc-en-ciel, pyramide et temple (civilisation), livre « 2025 », livre vert et bleu et rouleau à ruban violet (réinitialisations), décorations de ville (petits bâtiments sur un carré d’herbe), rouleau rouge']]]
];
const ID_OBJETS = OBJETS.flatMap(([, L]) => L.map(([id]) => id)).concat(['aucun', 'inconnu']);
const GUIDE = OBJETS.map(([o, L]) => `${o.startsWith('Tous') ? o : 'Onglet ' + o} :\n` + L.map(([id, d]) => `  ${id} = ${d}`).join('\n')).join('\n');

/* Couleur de la case (2026-10-10) : elle donne le niveau des coffres « Choisissez un » et des packs de ressources
   (captures de Mickaël du 10 oct. 2026 ; voir RC_JEU.coffres dans donnees-jeu.js). */
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
- Onglet Ressources : « pack de ressources » = coffre doré et argenté à serrure ; « coffre de ressources au choix » = coffre en bois rempli de ressources (épi, bûche, pierre).
- couleur : la couleur du fond de la case, « gris », « vert », « bleu », « violet » ou « orange » ; « inconnu » si elle n'est pas visible.
- id_objet : dans les onglets Ressources et Accélérateurs, mets "aucun". Dans les onglets Boosts, Équipement, Attirail et Autre, donne l'identifiant de l'objet d'après la liste ci-dessous (couleur du fond, dessin, valeur du haut) ; "inconnu" s'il n'y est pas ou si tu hésites.
- Une case sans quantité (pièce d'équipement forgée, pièce d'attirail) : quantite = "".
- sur = false dès qu'un chiffre de la case est douteux ou illisible, ou que tu hésites sur l'objet.
Objets des autres onglets :
` + GUIDE;

const TXT = { type: 'string' };
const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['onglet', 'barre', 'cases', 'panneau'],
  properties: {
    onglet: { type: 'string', enum: ['Ressources', 'Accélérateurs', 'Boosts', 'Équipement', 'Attirail', 'Autre', 'inconnu'] },
    barre: { type: 'object', additionalProperties: false, required: ['nourriture', 'bois', 'pierre', 'or', 'gemmes'],
      properties: { nourriture: TXT, bois: TXT, pierre: TXT, or: TXT, gemmes: TXT } },
    cases: { type: 'array', items: { type: 'object', additionalProperties: false,
      required: ['ligne', 'colonne', 'objet', 'id_objet', 'valeur_haut', 'quantite', 'couleur', 'coupee', 'sur'],
      properties: { ligne: { type: 'integer' }, colonne: { type: 'integer' }, objet: TXT, id_objet: { type: 'string', enum: ID_OBJETS }, valeur_haut: TXT, quantite: TXT,
        couleur: { type: 'string', enum: ['gris', 'vert', 'bleu', 'violet', 'orange', 'inconnu'] }, coupee: { type: 'boolean' }, sur: { type: 'boolean' } } } },
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
