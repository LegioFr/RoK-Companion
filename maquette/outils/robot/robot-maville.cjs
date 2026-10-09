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
    if(inv==='res'||inv==='acc'){await p.click('#'+(inv==='res'?'gRes':'gAcc')+' details.fold summary >> nth=0');await p.waitForTimeout(120);}
    await mesure(p,t,'inventaire-'+inv,'[data-screen="ma-ville"]');}
  for(const [nom,inv,sel] of [['fenetre-nourriture','res','#gRes [data-act=inv-edit][data-arg=food]'],['fenetre-coffres','res','#gRes [data-act=inv-edit][data-arg=coffres] >> nth=0'],['fenetre-generaux','acc','#gAcc [data-act=inv-edit][data-arg=general]'],['fenetre-objet','autre','[data-act=item-edit][data-arg="autre|new"]']]){
    await p.click('#invChips [data-inv='+inv+']');await p.waitForTimeout(120);
    if(/nourriture|generaux/.test(nom)){const f=inv==='res'?'#gRes details.fold:has([data-arg=food])':'#gAcc details.fold:has([data-arg=general])';const open=await ev(p,s=>document.querySelector(s).open,f);if(!open){await p.click(f+' summary');await p.waitForTimeout(120);}}
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
  await p.click('#gRes details.fold summary >> nth=0');await p.click('#gRes [data-act=inv-edit][data-arg=food]');await p.waitForTimeout(200);
  ok('7 tailles de caisses de nourriture',(await ev(p,()=>document.querySelectorAll('#shBody .inv-grid input').length))===7);
  await p.fill('#iv-ville','douze');await p.click('[data-act=inv-save]');await p.waitForTimeout(150);
  ok('Saisie illisible refusée',(await ev(p,()=>document.querySelectorAll('#shBody .ferr:not([hidden])').length))===1&&await ev(p,()=>document.getElementById('sheet').classList.contains('open')));
  await p.fill('#iv-ville','40,5 M');await p.fill('#iv-5000000','1');await p.click('[data-act=inv-save]');await p.waitForTimeout(250);
  ok('Nourriture enregistrée et total à jour',/Nourriture 6\d M/.test(await txt(p,'#gRes details.fold')||''),await txt(p,'#gRes details.fold summary'));
  await ev(p,()=>{location.hash='accueil'});await p.waitForTimeout(300);ok('Total nourriture repris sur l’Accueil',/Total nourriture 6\d M/.test(await txt(p,'#homeTiles')||''),await txt(p,'#homeTiles'));
  await etat(p,'demo','#ma-ville-inventaire');await p.click('#invChips [data-inv=acc]');await p.click('#gAcc details.fold:has([data-arg=general]) summary');await p.click('#gAcc [data-act=inv-edit][data-arg=general]');await p.waitForTimeout(200);
  ok('13 durées pour les accélérateurs généraux, 4 marquées *',(await ev(p,()=>[document.querySelectorAll('#shBody .inv-grid input').length,[...document.querySelectorAll('#shBody label')].filter(l=>/\*$/.test(l.textContent)).length].join('/')))==='13/4');
  await p.click('#sheet [data-act=close-sheet]');
  await p.click('#invChips [data-inv=autre]');await p.click('[data-act=item-edit][data-arg="autre|new"]');await p.fill('#itN','Passeports');await p.fill('#itQ','5');await p.click('[data-act=item-save]');await p.waitForTimeout(150);
  ok('Objet en double refusé',/déjà dans la liste/.test(await txt(p,'#shBody .ferr:not([hidden])')||''));
  await p.fill('#itN','Clés de bronze');await p.click('[data-act=item-save]');await p.waitForTimeout(150);ok('Objet ajouté',/Clés de bronze 5/.test(await txt(p,'#gItems')||''));
  await etat(p,'demo','#import');await p.waitForTimeout(1200);
  ok('Bloc « Essai de lecture par l’IA » visible',!!(await txt(p,'#essaiIA')));R.cle=await txt(p,'#essaiCle');
  await p.context().close();}
fs.writeFileSync(path.join(SORTIE,'resultat-maville.json'),JSON.stringify(R,null,1));
const n=Object.values(R.mesures).reduce((a,c)=>a+c.length,0);
console.log('mesures :',Object.keys(R.mesures).length,'vues,',n,'constats ; fonctionnement :',R.fonction.filter(x=>x[0]==='OK').length+'/'+R.fonction.length,'; erreurs :',R.erreurs.length);
await b.close();})();
