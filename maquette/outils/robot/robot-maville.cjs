// Robot de Ma ville (Progression, Inventaire et ses fenêtres de saisie, Commandants, Équipements, Armements, Importer), sur le vrai site.
// Usage : node robot-maville.cjs [url]. Version « Exemples » seulement : rien n'est écrit dans les données de Mickaël.
const {chromium}=require('/opt/node-tools/node_modules/playwright');
const fs=require('fs');const path=require('path');
const URL0=process.argv[2]||'https://rok-companion-maquette.vercel.app/';
const SORTIE=process.env.ROBOT_SORTIE||__dirname;const SHOTS=path.join(SORTIE,'shots');fs.mkdirSync(SHOTS,{recursive:true});
const MES=fs.readFileSync(path.join(__dirname,'mesures.js'),'utf8');
const TAILLES=[['telephone',390,844],['tablette-mickael',1028,1567],['tablette-paysage',1280,800],['pc',1920,1080]];
const R={mesures:{},fonction:[],erreurs:[]};
const ok=(n,c,d)=>R.fonction.push([c?'OK':'ÉCHEC',n,d||'']);
(async()=>{
const local=/localhost/.test(URL0);
const b=await chromium.launch(local?{}:{proxy:{server:process.env.HTTPS_PROXY}});
async function page(w,h){const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:w,height:h},hasTouch:w<1100,isMobile:false});await ctx.addInitScript(MES);
  if(local)await ctx.addInitScript('window.RC_SITE=true');
  await ctx.addInitScript(()=>{try{if(!sessionStorage.getItem('rb')){localStorage.clear();localStorage.setItem('rc-open','false');localStorage.setItem('rc-mode','demo');localStorage.setItem('rc-seenRev','9999');sessionStorage.setItem('rokUser','gouverneur@exemple.fr');sessionStorage.setItem('rb','1');}}catch(e){}});
  const p=await ctx.newPage();p.on('pageerror',e=>R.erreurs.push(w+' '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))R.erreurs.push(w+' console '+m.text());});
  await p.goto(URL0);await p.waitForTimeout(1500);return p;}
const ev=(p,f,a)=>p.evaluate(f,a);
const etat=async(p,st,h)=>{await ev(p,([s,h])=>window.RC_API.go(s,h),[st,h]);await p.waitForTimeout(600);};
const txt=(p,s)=>ev(p,s=>{const e=document.querySelector(s);return e&&!e.closest('[hidden]')?e.innerText.replace(/\s+/g,' ').trim():null;},s);
const mesure=async(p,t,nom,zone)=>{R.mesures[t+' '+nom]=await ev(p,s=>window.__mesurer(s),zone);await p.screenshot({path:path.join(SHOTS,'mv-'+t+'-'+nom+'.png'),fullPage:true});};
// 1. Mesures du graphisme à chaque taille
for(const [t,w,h] of TAILLES){const p=await page(w,h);
  await etat(p,'demo:neuf','#ma-ville-progression');await mesure(p,t,'progression','[data-screen="ma-ville"]');
  await etat(p,'demo','#ma-ville-inventaire');
  for(const inv of ['res','acc','boosts','equip','attirail','autre']){await p.click('#invChips [data-inv='+inv+']');await p.waitForTimeout(150);
    await mesure(p,t,'inventaire-'+inv,'[data-screen="ma-ville"]');}
  for(const [nom,inv,sel] of [['fenetre-nourriture','res','#gRes [data-act=inv-edit][data-arg=food]'],['fenetre-coffres','res','#gRes [data-act=inv-edit][data-arg=coffres] >> nth=0'],['fenetre-generaux','acc','#gAcc [data-act=inv-edit][data-arg=general]'],['fenetre-objet','autre','[data-act=item-edit][data-arg="autre|new"]']]){
    await p.click('#invChips [data-inv='+inv+']');await p.waitForTimeout(120);
    await p.click(sel);await p.waitForTimeout(250);await mesure(p,t,nom,'#sheet');await p.click('#sheet [data-act=close-sheet]');await p.waitForTimeout(150);}
  for(const sub of ['commandants','equipements','armements']){await etat(p,'demo','#ma-ville-'+sub);await mesure(p,t,sub,'[data-screen="ma-ville"]');}
  await etat(p,'demo','#import');await p.waitForTimeout(800);await mesure(p,t,'importer','[data-screen="import"]');
  await p.context().close();}
// 2. Fonctionnement (tablette de Mickaël)
{const p=await page(1028,1567);
  await etat(p,'demo:neuf','#ma-ville-progression');
  ok('badge d’état en version Exemples',(await txt(p,'[data-screen="ma-ville"] [data-sync]'))==='Exemples, non enregistrés');
  const cols=await ev(p,()=>getComputedStyle(document.querySelector('#gBld .btiles')).gridTemplateColumns.split(' ').length);
  ok('Bâtiments en 4 colonnes de tuiles à 1028 px',cols===4,String(cols));
  ok('Carte de l’Hôtel de ville (Principal)',/Vers le niveau 25 Il te manque : Mur 24\./.test(await txt(p,'#pgHero')||''),await txt(p,'#pgHero .hh-t'));
  ok('18 bâtiments à niveau (plus l’Hôtel de ville) en 3 groupes, et 3 de saison',(await ev(p,()=>[document.querySelectorAll('#gBld .btile').length,document.querySelectorAll('#gBld .bgrp').length,document.querySelectorAll('#gBld .bgrp.saison .btile').length].join('/')))==='21/4/3');
  ok('Prérequis manquant entouré (Mur)',(await ev(p,()=>[...document.querySelectorAll('#gBld .btile.manque')].map(a=>a.getAttribute('href')).join(',')))==='#valeur-mur');
  await p.click('#gBld a[href="#valeur-comptoir"]');await p.waitForTimeout(300);ok('Comptoir ouvre sa valeur',(await txt(p,'#valTitle'))==='Comptoir');
  await etat(p,'demo','#valeur-ferme');ok('Fermes : 4 niveaux',(await txt(p,'#valBig'))==='24 · 24 · 23 · 22');
  await p.click('#valBtn');await p.waitForTimeout(200);await p.fill('#cv3','23');await p.click('[data-act=save-correct]');await p.waitForTimeout(300);
  ok('Correction d’une ferme enregistrée',(await txt(p,'#valBig'))==='24 · 24 · 23 · 23');
  await etat(p,'demo:f2','#ma-ville-progression');ok('Prérequis non renseigné signalé (Ferme 2)',/Réserve 17/.test(await txt(p,'#pgHero .hh-t')||'')&&/niveau non renseigné/.test(await txt(p,'#pgHero .pres')||''));
  await etat(p,'demo','#ma-ville-inventaire');
  ok('6 onglets d’inventaire comme le jeu',(await txt(p,'#invChips'))==='Ressources Accélérateurs Boosts Équipement Attirail Autre');
  const nbT=async inv=>{await p.click('#invChips [data-inv='+inv+']');await p.waitForTimeout(150);return ev(p,()=>document.querySelectorAll('#gObj .it').length);};
  const tT=[await nbT('boosts'),await nbT('equip'),await nbT('attirail'),await nbT('autre')].join('/');
  ok('Tuiles des autres onglets : Boosts 3, Équipement 8, Attirail 2, Autre 9 (objets inutiles retirés)',tT==='3/8/2/9',tT);
  await p.click('#invChips [data-inv=boosts]');await p.click('#gObj .it[data-arg="g:attaque"]');await p.waitForTimeout(200);await p.fill('#iv-att24','2');await p.click('[data-act=inv-save]');await p.waitForTimeout(200);
  ok('Saisie d’un boost : la tuile additionne les durées',/4 j 0 h/.test(await txt(p,'#gObj .it[data-arg="g:attaque"]')||''),await txt(p,'#gObj .it[data-arg="g:attaque"]'));
  /* v64 : Boosts sur le modèle de Ressources (demande de Mickaël du 2026-10-10) */
  ok('Boosts (v64) : 3 tuiles sans cases d’objets, détail en 3 lignes de 3, 3 et 4 cases',(await ev(p,()=>[document.querySelectorAll('#gObj .it').length,document.querySelectorAll('#gObj .it .sl').length,
    [...document.querySelectorAll('#gObj .ledger .lg-r')].map(r=>r.querySelectorAll('.cz').length).join(','),document.querySelector('#gObj .ledger .lg-r:nth-child(3) .cz small').textContent.replace(/\s/g,' ')].join('/')))==='3/0/3,3,4/Réserve +20 000Réserve +20 000');
  const dB=await txt(p,'#gObj .it[data-arg="g:defense"]');await p.click('#gObj .ledger .lg-r:nth-child(2) .cz:nth-child(2)');await p.waitForTimeout(200);
  const fB=await ev(p,()=>document.getElementById('shTitle').textContent);await p.fill('#iv-c','3');await p.click('[data-act=inv-save]');await p.waitForTimeout(250);
  ok('Boosts : une case se remplit seule (Défense 24 h × 3 → la tuile gagne 3 j)',fB==='Défense +5 % : 24 h'&&/× 3/.test(await txt(p,'#gObj .ledger .lg-r:nth-child(2) .cz:nth-child(2)')||'')&&/4 j 0 h/.test(await txt(p,'#gObj .it[data-arg="g:defense"]')||''),fB+' | '+dB+' → '+await txt(p,'#gObj .it[data-arg="g:defense"]'));
  /* v66 : Équipement sur le même modèle (demande de Mickaël du 2026-10-10) */
  await p.click('#invChips [data-inv=equip]');await p.waitForTimeout(150);
  ok('Équipement (v66) : 8 tuiles sans cases d’objets, détail en 10 lignes (Coffres à ouvrir en 3), une case par qualité',(await ev(p,()=>[document.querySelectorAll('#gObj .it').length,document.querySelectorAll('#gObj .it .sl').length,
    [...document.querySelectorAll('#gObj .ledger .lg-r')].map(r=>r.querySelectorAll('.cz').length).join(',')].join('/')))==='8/0/5,5,5,5,5,5,3,5,4,5');
  await p.click('#gObj .ledger .lg-r:nth-child(1) .cz:nth-child(4)');await p.waitForTimeout(200);const fE=await ev(p,()=>document.getElementById('shTitle').textContent);
  await p.fill('#iv-c','2');await p.click('[data-act=inv-save]');await p.waitForTimeout(250);
  ok('Équipement : une case se remplit seule (Cuir épique × 2)',fE==='Cuir : épique'&&/× 2/.test(await txt(p,'#gObj .ledger .lg-r:nth-child(1) .cz:nth-child(4)')||''),fE);
  /* v67 : Attirail sur le même modèle (demande de Mickaël du 2026-10-10) */
  await p.click('#invChips [data-inv=attirail]');await p.waitForTimeout(150);
  ok('Attirail (v67) : 2 tuiles sans cases d’objets, détail en 2 lignes (pièces par qualité : 3 cases ; coffres de formation : 1)',(await ev(p,()=>[document.querySelectorAll('#gObj .it').length,document.querySelectorAll('#gObj .it .sl').length,
    [...document.querySelectorAll('#gObj .ledger .lg-r')].map(r=>r.querySelectorAll('.cz').length).join(',')].join('/')))==='2/0/3,1');
  await p.click('#gObj .ledger .lg-r:nth-child(1) .cz:nth-child(2)');await p.waitForTimeout(200);
  const fA=await ev(p,()=>[document.getElementById('shTitle').textContent,(document.querySelector('#itC [aria-pressed="true"]')||{}).textContent].join('/'));
  await p.fill('#itN','Emblème du Nord');await p.click('[data-act=item-save]');await p.waitForTimeout(250);
  ok('Attirail : la case « Épique » ouvre l’ajout d’une pièce épique, la ligne compte ensuite × 1',fA==='Ajouter une pièce d’attirail/Épique'&&/× 1/.test(await txt(p,'#gObj .ledger .lg-r:nth-child(1) .cz:nth-child(2)')||''),fA);
  /* v68 : Autre sur le modèle de Ressources (demande de Mickaël du 2026-10-10) : tuiles avec « à quoi ça sert », sans cases d'objets ; détail en 11 lignes */
  await p.click('#invChips [data-inv=autre]');await p.waitForTimeout(150);
  const rp=await ev(p,()=>{const T=[...document.querySelectorAll('#gObj .it.obj')];return [T.length,T.filter(t=>t.querySelector('.it-p')).length,document.querySelectorAll('#gObj .it .sl').length,
    [...document.querySelectorAll('#gObj .ledger .lg-r')].map(r=>r.querySelectorAll('.cz').length).join(','),((document.querySelector('#gObj .ledger .lg-r:nth-child(7) .cz:nth-child(1)')||{}).textContent||'').replace(/\s/g,' ')].join('/');});
  ok('Autre (v68) : 9 tuiles avec leur ligne « à quoi ça sert », sans cases d’objets ; détail en 11 lignes (lumière d’étoile en 3), Tomes 100 EXP × 800 = 80 K',rp==='9/9/0/4,4,4,4,4,2,7,4,4,2,1/100 EXP100 EXP× 80080 K',rp);
  await p.click('#gObj .ledger .lg-r:nth-child(4) .cz:nth-child(4)');await p.waitForTimeout(200);const fS=await ev(p,()=>document.getElementById('shTitle').textContent);
  await p.fill('#iv-c','3');await p.click('[data-act=inv-save]');await p.waitForTimeout(250);
  ok('Autre : une case se remplit seule (lumière d’étoile légendaire bénie × 3)',fS==='Sculptures de lumière d’étoile : légendaire · bénie'&&/× 3/.test(await txt(p,'#gObj .ledger .lg-r:nth-child(4) .cz:nth-child(4)')||''),fS);
  /* Points d'action (v57, proposition 1 de Mickaël) : exemples = 10 500 points, VIP 17, barbares niv. 25 sans talent ; plus de carte de détail */
  await p.click('#invChips [data-inv=autre]');await p.waitForTimeout(150);
  const paT=async()=>(await txt(p,'#gObj .it[data-arg="g:pa"]')||'').replace(/\s+/g,' ');
  let pa1=await paT();
  ok('Points d’action : tuile sur toute la largeur, « Avec tes potions » ≈ 262 barbares, ≈ 655 K EXP, ≈ 4 j, sans carte de détail',/Avec tes potions/i.test(pa1)&&/≈ 262/.test(pa1)&&/≈ 655 K/.test(pa1)&&/≈ 4 j/.test(pa1)&&
    (await ev(p,()=>{const t=document.querySelector('#gObj .it[data-arg="g:pa"]');return t.classList.contains('large')&&t.classList.contains('gx')&&!document.querySelector('#gObj .ic-h[data-arg="g:pa"]');})),pa1.slice(0,200));
  await p.click('#gObj .it[data-arg="g:pa"]');await p.waitForTimeout(200);await p.fill('#iv-niv','30');await p.click('#paT [data-v="1"]');await p.click('[data-act=inv-save]');await p.waitForTimeout(200);pa1=await paT();
  ok('Réglages dans la fenêtre de la tuile : niv. 30 avec le talent → ≈ 350 barbares, ≈ 1,1 M EXP',/niveau 30/.test(pa1)&&/≈ 350/.test(pa1)&&/≈ 1,1 M/.test(pa1),pa1.slice(0,200));
  await p.click('#invChips [data-inv=res]');await p.waitForTimeout(150);
  ok('Ressources (v60, aperçu n° 2 et notes 12 à 17) : 4 tuiles, panneau Gemmes / Coffres / Packs, détail en 7 lignes (toutes les tailles, 7 pour la nourriture), pillage sur les 4 ressources, sans ligne des totaux ni phrase sur le pillage',
    (await ev(p,()=>[document.querySelectorAll('#gRes .it-grid .it').length,document.querySelectorAll('#gRes .trio .tr-c').length,document.querySelectorAll('#gRes .ledger .lg-r').length+'+'+document.querySelectorAll('#gRes .ledger .lg-r:first-child .cz').length,document.querySelectorAll('#gRes .pil').length,document.querySelectorAll('#resSum,#gRes .lg-note').length].join('/')))==='4/3/7+7/4/0');
  ok('Barre « en caisses » sans hachures (note 14)',(await ev(p,()=>getComputedStyle(document.querySelector('#gRes .it-bar .c')).backgroundImage)).indexOf('repeating')<0);
  const fen=async(sel)=>ev(p,s=>{document.querySelector(s).click();const r=[document.getElementById('shTitle').textContent,document.querySelectorAll('#shBody input').length,document.getElementById('shBody').textContent];document.querySelector('#sheet [data-act=close-sheet]').click();return r;},sel);
  const fc=await fen('#gRes .tr-c[data-arg=coffres]'),fp=await fen('#gRes .tr-c[data-arg=packs]');
  ok('Tuile Coffres : sa propre fenêtre, 5 niveaux avec leur contenu',/Coffres/.test(fc[0])&&fc[1]===5&&/7\u00a0500\u00a0pierre/.test(fc[2]),fc[0]+' / '+fc[1]);
  ok('Tuile Packs : sa propre fenêtre, 5 packs',/Packs/.test(fp[0])&&fp[1]===5&&!/Niveau 5/.test(fp[2]),fp[0]+' / '+fp[1]);
  /* v62, notes 1 à 6 de Mickaël du 2026-10-10 */
  ok('Ressources (v62) : ni titre ni ligne d’import, ni ligne « Détail des caisses », ni crayon ; texte des bulles de pillage centré',
    (await ev(p,()=>[!!document.querySelector('[data-invsec=res] .sec-t'),!!document.querySelector('#gRes .lg-hd'),document.querySelectorAll('#gRes .lg-h svg').length,getComputedStyle(document.querySelector('#gRes .pil')).justifyContent].join('/')))==='false/false/7/center');
  ok('Case sans valeur : texte centré en hauteur (note 1)',await ev(p,()=>{const c=document.querySelector('#gRes .cz.z'),r=c.getBoundingClientRect(),k=[...c.children].map(e=>e.getBoundingClientRect());return c.children.length===2&&Math.abs((Math.min(...k.map(q=>q.top))-r.top)-(r.bottom-Math.max(...k.map(q=>q.bottom))))<2;}));
  await p.click('#gRes .lg-r:nth-child(7) .cz:nth-child(5)');await p.waitForTimeout(200);
  const f62=await ev(p,()=>[document.getElementById('shTitle').textContent,document.querySelectorAll('#shBody input').length,document.activeElement&&document.activeElement.id].join('/'));
  await p.fill('#iv-c','42410');await p.click('[data-act=inv-save]');await p.waitForTimeout(250);
  ok('Une case du détail s’ouvre seule et s’enregistre (note 6) : pack niv. 3 → × 42 410, total des packs à jour',f62==='Pack niv. 3/1/iv-c'&&/× 42 410/.test(await txt(p,'#gRes .lg-r:nth-child(7) .cz:nth-child(5)')||'')&&/42 412/.test(await txt(p,'#gRes .tr-c[data-arg=packs]')||''),f62);
  ok('Notes 7 et 8 (v63) : plus de « Profil … » sous « Ma ville », plus de titre en haut des onglets de l’inventaire, « Coffres « Choisissez un » » sur une ligne',
    (await ev(p,()=>[!!document.querySelector('[data-screen="ma-ville"] header .tw p'),document.querySelectorAll('[data-invsec] .sec-t').length,document.querySelector('#gRes .lg-r:nth-child(6) .lg-h span').getBoundingClientRect().height<24].join('/')))==='false/0/true');
  await p.click('#gRes .it[data-arg=food]');await p.waitForTimeout(200);
  ok('7 tailles de caisses de nourriture',(await ev(p,()=>document.querySelectorAll('#shBody .inv-grid input').length))===7);
  await p.fill('#iv-ville','douze');await p.click('[data-act=inv-save]');await p.waitForTimeout(150);
  ok('Saisie illisible refusée',(await ev(p,()=>document.querySelectorAll('#shBody .ferr:not([hidden])').length))===1&&await ev(p,()=>document.getElementById('sheet').classList.contains('open')));
  await p.fill('#iv-ville','40,5 M');await p.fill('#iv-5000000','1');await p.click('[data-act=inv-save]');await p.waitForTimeout(250);
  ok('Nourriture enregistrée et total à jour',/nourriture 6\d M/i.test(await txt(p,'#gRes .it[data-arg=food]')||''),await txt(p,'#gRes .it[data-arg=food]'));
  ok('« En ville » avec un chiffre après la virgule',/En ville 40,5 M/.test(await txt(p,'#gRes .it[data-arg=food]')||''));
  await ev(p,()=>{location.hash='accueil'});await p.waitForTimeout(300);ok('Total nourriture repris sur l’Accueil',/Total nourriture 6\d M/.test(await txt(p,'#homeTiles')||''),await txt(p,'#homeTiles'));
  await etat(p,'demo','#ma-ville-inventaire');await p.click('#invChips [data-inv=acc]');await p.click('#gAcc .lg-h[data-arg=general]');await p.waitForTimeout(200);
  ok('Tuile Généraux : 4 temps « avec les généraux », sans la ligne « Avec les généraux » (note 9, v64)',(await ev(p,()=>document.querySelectorAll('#gAcc .it.gx .gx-i').length+'/'+document.querySelectorAll('#gAcc .gx-t').length))==='4/0');
  ok('Tuiles des accélérateurs sans la petite ligne « N accélérateurs » (note 12)',(await ev(p,()=>document.querySelectorAll('#gAcc .it-grid .it .it-s').length))===0);
  ok('Détail des accélérateurs (v63, comme Ressources) : 5 lignes, 9 cases par type et 13 pour les généraux, sur 9 colonnes alignées par durée',
    (await ev(p,()=>{const R=[...document.querySelectorAll('#gAcc .ledger .lg-r')];const x=c=>Math.round(c.getBoundingClientRect().left);
      return R.length+'/'+R.map(r=>r.querySelectorAll('.cz').length).join(',')+'/'+(x(R[0].querySelectorAll('.cz')[8])===x(R[4].querySelectorAll('.cz')[8]));}))==='5/9,9,9,9,13/true');
  ok('13 durées pour les accélérateurs généraux, 4 marquées *',(await ev(p,()=>[document.querySelectorAll('#shBody .inv-grid input').length,[...document.querySelectorAll('#shBody label')].filter(l=>/\*$/.test(l.textContent)).length].join('/')))==='13/4');
  await p.click('#sheet [data-act=close-sheet]');
  await p.click('#invChips [data-inv=autre]');await p.click('[data-act=item-edit][data-arg="autre|new"]');await p.fill('#itN','Passeports');await p.fill('#itQ','5');await p.click('[data-act=item-save]');await p.waitForTimeout(150);
  ok('Objet en double refusé',/déjà dans la liste/.test(await txt(p,'#shBody .ferr:not([hidden])')||''));
  await p.fill('#itN','Clés de bronze');await p.click('[data-act=item-save]');await p.waitForTimeout(150);ok('Objet ajouté',/Clés de bronze 5/.test(await txt(p,'#gItems')||''));
  await etat(p,'demo','#import');await p.waitForTimeout(1200);
  ok('Lecture par Claude annoncée dans Importer',/Claude Opus 5\.5/.test(await txt(p,'#lectNote')||''));R.cle=await ev(p,()=>fetch('/api/lire').then(r=>r.json()).then(j=>j.cle?'clé en place':'clé absente').catch(()=>'?'));
  await p.context().close();}
// 3. Détail des caisses avec de grosses quantités : aucun texte de case ne passe à la ligne ni ne dépasse (remarque du 2026-10-10, « × 42 410 » sur téléphone)
for(const w of [360,390,768,820,1028]){const p=await page(w,900);await etat(p,'demo','#ma-ville-inventaire');
  for(const [sel,v] of [['#gRes .lg-r:nth-child(7) .cz:nth-child(3)','42410'],['#gRes .lg-r:nth-child(7) .cz:nth-child(4)','16213'],['#gRes .lg-r:nth-child(1) .cz:nth-child(1)','34017'],['#gRes .lg-r:nth-child(6) .cz:nth-child(1)','1089']]){
    await ev(p,s=>document.querySelector(s).click(),sel);await p.waitForTimeout(150);await p.fill('#iv-c',v);await p.click('[data-act=inv-save]');await p.waitForTimeout(200);}
  await ev(p,()=>document.querySelector('#gAcc .lg-r:nth-child(4) .cz:nth-child(2)').click());await p.waitForTimeout(150);await p.fill('#iv-c','2670');await p.click('[data-act=inv-save]');await p.waitForTimeout(200);
  await p.click('#invChips [data-inv=acc]');await p.waitForTimeout(150);
  const bad=await ev(p,()=>{const o=[];document.querySelectorAll('#gRes .cz, #gAcc .cz').forEach(c=>{if(!c.getClientRects().length)return;const cr=c.getBoundingClientRect();[...c.children].forEach(e=>{const r=e.getBoundingClientRect(),lh=parseFloat(getComputedStyle(e).lineHeight)||16;
    if(r.height>lh*1.4||r.left<cr.left+1||r.right>cr.right-1)o.push(e.textContent.replace(/\s+/g,' '));});});
    document.querySelectorAll('#gAcc .lg-h span').forEach(e=>{if(e.getBoundingClientRect().height>24)o.push('nom : '+e.textContent);});return o;});
  await p.click('#invChips [data-inv=res]');await p.waitForTimeout(150);
  const bad2=await ev(p,()=>{const o=[];document.querySelectorAll('#gRes .cz').forEach(c=>{const cr=c.getBoundingClientRect();[...c.children].forEach(e=>{const r=e.getBoundingClientRect(),lh=parseFloat(getComputedStyle(e).lineHeight)||16;
    if(r.height>lh*1.4||r.left<cr.left+1||r.right>cr.right-1)o.push(e.textContent.replace(/\s+/g,' '));});});document.querySelectorAll('#gRes .lg-h span').forEach(e=>{if(e.getBoundingClientRect().height>24)o.push('nom : '+e.textContent);});return o;});bad.push(...bad2);
  ok('Nombres et noms sur une ligne dans les détails Ressources et Accélérateurs à '+w+' px',bad.length===0,bad.slice(0,6).join(' | '));await p.context().close();}
fs.writeFileSync(path.join(SORTIE,'resultat-maville.json'),JSON.stringify(R,null,1));
const n=Object.values(R.mesures).reduce((a,c)=>a+c.length,0);
console.log('mesures :',Object.keys(R.mesures).length,'vues,',n,'constats ; fonctionnement :',R.fonction.filter(x=>x[0]==='OK').length+'/'+R.fonction.length,'; erreurs :',R.erreurs.length);
await b.close();})();
