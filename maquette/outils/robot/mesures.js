// Mesures du graphisme, exécutées dans la page. Renvoie la liste des constats pour la zone donnée.
window.__mesurer = function (rootSel) {
  const root = document.querySelector(rootSel) || document.body, out = [], W = innerWidth;
  // le contenu d'un <details> fermé garde des dimensions dans Chromium mais ne se voit pas (2026-10-09, inventaire de Ma ville)
  const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e), d = e.closest('details:not([open])'); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('[hidden]') && !(d && !e.closest('summary')); };
  const nom = e => { const t = (e.getAttribute('aria-label') || e.textContent || e.placeholder || e.id || e.tagName).replace(/\s+/g, ' ').trim(); return e.tagName.toLowerCase() + ' « ' + t.slice(0, 40) + ' »'; };
  if (document.documentElement.scrollWidth > W + 1) out.push(['débordement', 'La page est plus large que l’écran (' + document.documentElement.scrollWidth + ' px pour ' + W + ' px).']);
  // défilement inutile : la page défile alors que tout ce qui se voit tient dans l'écran (note 1 de Mickaël, 2026-10-09)
  const H = innerHeight, sh = document.documentElement.scrollHeight;
  if (sh > H + 1) { let bas = 0; document.querySelectorAll('body *').forEach(e => { const s = getComputedStyle(e); if (s.position === 'fixed' || !vis(e)) return; const r = e.getBoundingClientRect(); if (r.height > 0 && e.closest('#rcRun,#rcPnl,#rcBub,#toast') === null) bas = Math.max(bas, r.bottom + scrollY); });
    const grand = [...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).position !== 'fixed' && e.getBoundingClientRect().bottom + scrollY >= sh - 1).map(e => (e.id || e.tagName.toLowerCase())).slice(0, 3);
    if (bas <= H + 1) out.push(['défilement inutile', 'La page défile de ' + (sh - H) + ' px alors que le contenu tient dans l’écran (élément le plus bas : ' + grand.join(', ') + ').']); }
  const actifs = [...root.querySelectorAll('a,button,input,select,textarea')].filter(vis);
  // zone de toucher réelle : un ::after placé en absolu (ex. « Mot de passe oublié ? ») agrandit la cible
  const zone = e => { const r = e.getBoundingClientRect(), a = getComputedStyle(e, '::after'); let w = r.width, h = r.height;
    if (a.content && a.content !== 'none' && a.position === 'absolute') { w = Math.max(w, parseFloat(a.width) || 0); h = Math.max(h, parseFloat(a.height) || 0); } return { w, h }; };
  actifs.forEach(e => { const r = e.getBoundingClientRect(), z = zone(e);
    if (r.right > W + 1 || r.left < -1) out.push(['hors écran', nom(e) + ' dépasse sur le côté.']);
    if (z.h < 24 || z.w < 24) out.push(['cible trop petite', nom(e) + ' : ' + Math.round(z.w) + '×' + Math.round(z.h) + ' px (minimum 24, conseillé 44).']);
    else if (z.h < 44 && e.tagName !== 'A') out.push(['cible petite', nom(e) + ' : ' + Math.round(z.w) + '×' + Math.round(z.h) + ' px (conseillé 44 de haut).']);
  });
  for (let i = 0; i < actifs.length; i++) for (let j = i + 1; j < actifs.length; j++) {
    const a = actifs[i], b = actifs[j]; if (a.contains(b) || b.contains(a)) continue;
    // bouton posé exprès dans un champ (œil du mot de passe) : pas un défaut
    if (a.parentElement === b.parentElement && [a, b].some(x => x.tagName === 'INPUT') && [a, b].some(x => getComputedStyle(x).position === 'absolute')) continue;
    const r = a.getBoundingClientRect(), q = b.getBoundingClientRect();
    const ix = Math.min(r.right, q.right) - Math.max(r.left, q.left), iy = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
    if (ix > 2 && iy > 2) out.push(['chevauchement', nom(a) + ' et ' + nom(b) + ' se chevauchent.']);
  }
  const bub = document.getElementById('rcBub');
  if (bub && vis(bub)) { const q = bub.getBoundingClientRect(); actifs.forEach(e => { const r = e.getBoundingClientRect(); if (Math.min(r.right, q.right) - Math.max(r.left, q.left) > 2 && Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top) > 2) out.push(['bulle', 'La bulle d’outils cache ' + nom(e) + '.']); }); }
  // textes : taille, coupure, contraste
  const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(x => { x = x / 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }); return { L: .2126 * r + .7152 * g + .0722 * b, a: m[3] == null ? 1 : +m[3] }; };
  const fond = e => { for (let x = e; x; x = x.parentElement) { const s = getComputedStyle(x); if (s.backgroundImage && s.backgroundImage !== 'none') return { img: true, x }; const l = lum(s.backgroundColor); if (l && l.a > .9) return l; } return lum('rgb(5,7,13)'); };
  const feuilles = [...root.querySelectorAll('*')].filter(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  feuilles.forEach(e => { const s = getComputedStyle(e), fs = parseFloat(s.fontSize), txt = e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40);
    if (fs < 12) out.push(['texte petit', '« ' + txt + ' » : ' + fs + ' px.']);
    if ((s.overflow === 'hidden' || s.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 1) out.push(['texte coupé', '« ' + txt + ' » est coupé.']);
    // texte sur une ligne plus large que sa case (coupé par la carte autour, ex. « 12 légendaires » sur téléphone, 2026-10-10)
    else if (s.whiteSpace === 'nowrap' && e.clientWidth && e.scrollWidth > e.clientWidth + 1) out.push(['texte qui dépasse', '« ' + txt + ' » dépasse de sa case (' + (e.scrollWidth - e.clientWidth) + ' px).']);
    const c = lum(s.color), f = fond(e); if (!c || !f || f.img) return;
    const ratio = (Math.max(c.L, f.L) + .05) / (Math.min(c.L, f.L) + .05), grand = fs >= 24 || (fs >= 18.66 && +s.fontWeight >= 700);
    if (ratio < (grand ? 3 : 4.5)) out.push(['contraste', '« ' + txt + ' » : ' + ratio.toFixed(2) + ' (minimum ' + (grand ? 3 : 4.5) + ').']);
  });
  return out;
};
window.__styles = function (sel) { const e = [...document.querySelectorAll(sel)].find(x => x.offsetParent); if (!e) return null; const s = getComputedStyle(e), r = e.getBoundingClientRect(); return { fs: s.fontSize, fw: s.fontWeight, ff: s.fontFamily.split(',')[0], h: Math.round(r.height), w: Math.round(r.width), color: s.color }; };
