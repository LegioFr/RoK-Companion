// Robot de la partie connexion, sur le vrai site. Usage : node robot-connexion.cjs [url]
const {chromium}=require('/opt/node-tools/node_modules/playwright');
const fs=require('fs');const path=require('path');
const URL0=process.argv[2]||'https://rok-companion-maquette.vercel.app/';
const SHOTS=process.env.ROBOT_SORTIE?path.join(process.env.ROBOT_SORTIE,'shots'):path.join(__dirname,'shots');fs.mkdirSync(SHOTS,{recursive:true});
const MES=fs.readFileSync(path.join(__dirname,'mesures.js'),'utf8');
const TAILLES=[['telephone',390,844],['tablette',800,1280],['tablette-paysage',1280,800],['pc',1920,1080]];
const ECRANS=['connexion','inscription','confirmation','mot-de-passe-oublie','nouveau-mot-de-passe'];
const R={mesures:{},styles:{},fonction:[],textes:{},erreurs:[]};
const ok=(n,c,d)=>R.fonction.push([c?'OK':'ÉCHEC',n,d||'']);
(async()=>{
const local=/localhost/.test(URL0);
const b=await chromium.launch(local?{}:{proxy:{server:process.env.HTTPS_PROXY}});
async function page(w,h){const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:w,height:h},hasTouch:w<1100,isMobile:false});await ctx.addInitScript(MES);
  await ctx.addInitScript(()=>{try{if(!sessionStorage.getItem('rb')){localStorage.clear();localStorage.setItem('rc-open','false');localStorage.setItem('rc-mode','demo');localStorage.setItem('rc-seenRev','9999');sessionStorage.setItem('rb','1');}}catch(e){}});
  const p=await ctx.newPage();p.on('pageerror',e=>R.erreurs.push(w+' '+e.message));p.on('console',m=>{if(m.type()==='error')R.erreurs.push(w+' console '+m.text());});
  await p.goto(URL0);await p.waitForTimeout(1200);return p;}
const ev=(p,f,a)=>p.evaluate(f,a);
const etat=async(p,st,h)=>{await ev(p,([s,h])=>window.RC_API.go(s,h),[st,h]);await p.waitForTimeout(500);};
const hash=p=>ev(p,()=>location.hash);
const txt=(p,s)=>ev(p,s=>{const e=document.querySelector(s);return e&&!e.hidden&&e.offsetParent!==null?e.innerText.replace(/\s+/g,' ').trim():null;},s);
// aller sur un écran de compte dans le bon état
async function vers(p,id){
  if(id==='confirmation'){await etat(p,'attente','#confirmation');}
  else if(id==='nouveau-mot-de-passe'){await etat(p,'out','#mot-de-passe-oublie');await p.fill('#fgEmail','gouverneur@exemple.fr');await p.click('[data-form=forgot] .a-primary');await p.waitForTimeout(200);await ev(p,()=>window.RC_API.simLink());await p.waitForTimeout(400);}
  else await etat(p,'out','#'+id);
}
// 1. Mesures à chaque taille
for(const [t,w,h] of TAILLES){const p=await page(w,h);
  for(const id of ECRANS){await vers(p,id);const H=await hash(p);
    R.mesures[t+' '+id]={hash:H,c:await ev(p,s=>window.__mesurer(s),'[data-auth="'+id+'"]')};
    R.styles[t+' '+id]={titre:await ev(p,s=>window.__styles(s),'[data-auth="'+id+'"] h2'),bouton:await ev(p,s=>window.__styles(s),'[data-auth="'+id+'"] .a-primary'),champ:await ev(p,s=>window.__styles(s),'[data-auth="'+id+'"] input'),lien:await ev(p,s=>window.__styles(s),'[data-auth="'+id+'"] .a-secondary')};
    if(t==='telephone'||t==='tablette')R.textes[id]=await ev(p,s=>document.querySelector(s).innerText.replace(/\n+/g,' | '),'[data-auth="'+id+'"]');
    await p.screenshot({path:path.join(SHOTS,t+'-'+id+'.png'),fullPage:true});}
  // Accueil sans profil (arrivée après la création de compte)
  await etat(p,'vide','#accueil');R.mesures[t+' accueil-sans-profil']={hash:await hash(p),c:await ev(p,s=>window.__mesurer(s),'[data-screen="accueil"]')};
  await p.screenshot({path:path.join(SHOTS,t+'-accueil-sans-profil.png'),fullPage:true});
  await p.context().close();}
// 2. Fonctionnement, parcours, saisies (téléphone et tablette)
for(const [t,w,h] of [TAILLES[0],TAILLES[1]]){const p=await page(w,h);const T=s=>t+' · '+s;
  // Connexion
  await etat(p,'out','#connexion');
  await p.click('[data-form=login] .a-primary');ok(T('connexion vide : le navigateur bloque'),await ev(p,()=>document.querySelector('#liEmail').matches(':invalid'))&&(await hash(p))==='#connexion');
  await p.fill('#liEmail','mickael');await p.fill('#liPw','x');await p.click('[data-form=login] .a-primary');ok(T('adresse sans @ : bloquée'),await ev(p,()=>document.querySelector('#liEmail').matches(':invalid')));
  await p.fill('#liEmail','gouverneur@exemple.fr');await p.fill('#liPw','mauvais');await p.click('[data-form=login] .a-primary');await p.waitForTimeout(150);
  ok(T('mauvais mot de passe'),(await txt(p,'[data-auth=connexion] .a-feedback'))==='E-mail ou mot de passe incorrect.',await txt(p,'[data-auth=connexion] .a-feedback'));
  await p.fill('#liEmail','inconnu@exemple.fr');await p.fill('#liPw','rok12345');await p.click('[data-form=login] .a-primary');await p.waitForTimeout(150);
  ok(T('adresse inconnue : même message'),(await txt(p,'[data-auth=connexion] .a-feedback'))==='E-mail ou mot de passe incorrect.');
  await p.fill('#liEmail','x');ok(T('le message disparaît quand on corrige'),(await txt(p,'[data-auth=connexion] .a-feedback'))===null,await txt(p,'[data-auth=connexion] .a-feedback'));
  await p.click('[data-arg=liPw]');ok(T('œil : affiche le mot de passe'),await ev(p,()=>document.querySelector('#liPw').type==='text'&&document.querySelector('[data-arg=liPw]').getAttribute('aria-pressed')==='true'));
  await p.click('[data-arg=liPw]');ok(T('œil : le cache à nouveau'),await ev(p,()=>document.querySelector('#liPw').type==='password'));
  await p.click('[data-auth=connexion] .a-forgot');await p.waitForTimeout(200);ok(T('lien « Mot de passe oublié ? »'),(await hash(p))==='#mot-de-passe-oublie');
  await etat(p,'out','#connexion');await p.click('[data-auth=connexion] .a-secondary');await p.waitForTimeout(200);ok(T('lien « Créer un compte »'),(await hash(p))==='#inscription');
  await etat(p,'out','#connexion');await p.fill('#liEmail','  Gouverneur@Exemple.FR ');await p.fill('#liPw','rok12345');await p.press('#liPw','Enter');await p.waitForTimeout(500);
  ok(T('connexion avec majuscules et espaces, touche Entrée'),(await hash(p))==='#accueil',await hash(p));
  // page demandée avant connexion
  await etat(p,'out','#connexion');await ev(p,()=>{location.hash='budget';});await p.waitForTimeout(300);ok(T('page protégée → connexion'),(await hash(p))==='#connexion');
  await p.fill('#liEmail','gouverneur@exemple.fr');await p.fill('#liPw','rok12345');await p.click('[data-form=login] .a-primary');await p.waitForTimeout(500);ok(T('après connexion, retour à la page demandée'),(await hash(p))==='#budget',await hash(p));
  // Déconnexion
  await ev(p,()=>{location.hash='plus';});await p.waitForTimeout(300);await p.click('[data-act=sheet-logout]');await p.waitForTimeout(200);
  const btn=await ev(p,()=>[...document.querySelectorAll('#shActions .btn')].map(b=>b.textContent));R.fonction.push(['INFO',T('fenêtre de déconnexion'),JSON.stringify(btn)]);
  await p.click('#shActions .btn.danger, #shActions .btn.primary');await p.waitForTimeout(300);
  ok(T('déconnexion → connexion avec message'),(await hash(p))==='#connexion'&&(await txt(p,'[data-auth=connexion] .a-feedback'))==='Tu es déconnecté. Tes profils restent enregistrés.',await txt(p,'[data-auth=connexion] .a-feedback'));
  // Inscription
  await etat(p,'out','#inscription');
  await p.click('[data-form=signup] .a-primary');ok(T('inscription vide : bloquée'),(await hash(p))==='#inscription');
  for(const [e,att] of [['mickael@','Saisis une adresse valide, par exemple nom@exemple.fr.'],['mickael@exemple','Saisis une adresse valide, par exemple nom@exemple.fr.'],['mi ck@exemple.fr','Saisis une adresse valide, par exemple nom@exemple.fr.']]){
    await p.fill('#suEmail',e);await p.fill('#suPw','abcdefgh');await p.fill('#suPw2','abcdefgh');await ev(p,()=>document.querySelector('[data-form=signup]').requestSubmit?document.querySelector('[data-form=signup]').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})):0);await p.waitForTimeout(150);
    ok(T('adresse « '+e+' » refusée'),(await txt(p,'#suEmailErr'))===att||(await ev(p,()=>document.querySelector('#suEmail').matches(':invalid'))),await txt(p,'#suEmailErr'));}
  await p.fill('#suEmail','neuf@exemple.fr');await p.fill('#suPw','abc');await p.fill('#suPw2','abc');await p.click('[data-form=signup] .a-primary');await p.waitForTimeout(150);
  ok(T('mot de passe trop court'),(await txt(p,'#suPwErr'))==='Au moins 8 caractères.',await txt(p,'#suPwErr'));
  ok(T('le curseur va sur le champ en erreur'),await ev(p,()=>document.activeElement&&document.activeElement.id),'');
  await p.fill('#suPw','abcdefgh');await p.fill('#suPw2','abcdefgX');await p.click('[data-form=signup] .a-primary');await p.waitForTimeout(150);
  ok(T('confirmation différente'),(await txt(p,'#suPw2Err'))==='Les mots de passe ne correspondent pas.'&&(await txt(p,'#suPwErr'))===null);
  await p.fill('#suEmail','gouverneur@exemple.fr');await p.fill('#suPw2','abcdefgh');await p.click('[data-form=signup] .a-primary');await p.waitForTimeout(150);
  ok(T('adresse déjà utilisée'),/Un compte existe déjà/.test(await txt(p,'#suEmailErr')||''),await txt(p,'#suEmailErr'));
  for(const id of ['suPw','suPw2']){await p.click('[data-arg='+id+']');ok(T('œil '+id),await ev(p,i=>document.getElementById(i).type==='text',id));await p.click('[data-arg='+id+']');}
  await p.click('[data-auth=inscription] .a-secondary');await p.waitForTimeout(200);ok(T('lien « Se connecter »'),(await hash(p))==='#connexion');
  await etat(p,'out','#inscription');await p.fill('#suEmail','Neuf.'+t+'@Exemple.fr');await p.fill('#suPw','motdepasse1');await p.fill('#suPw2','motdepasse1');await p.click('[data-form=signup] .a-primary');await p.waitForTimeout(400);
  ok(T('compte créé → confirmation'),(await hash(p))==='#confirmation',await hash(p));ok(T('adresse affichée'),(await txt(p,'#cfEmail'))==='neuf.'+t+'@exemple.fr',await txt(p,'#cfEmail'));
  await p.click('#cfResend');await p.waitForTimeout(150);ok(T('« Renvoyer l’e-mail »'),(await txt(p,'[data-auth=confirmation] .a-feedback'))==='E-mail renvoyé.');
  await p.click('[data-auth=confirmation] .a-secondary');await p.waitForTimeout(200);ok(T('« Retour à la connexion »'),(await hash(p))==='#connexion');
  await p.fill('#liEmail','neuf.'+t+'@exemple.fr');await p.fill('#liPw','motdepasse1');await p.click('[data-form=login] .a-primary');await p.waitForTimeout(400);
  ok(T('connexion avant confirmation → confirmation + message'),(await hash(p))==='#confirmation'&&/Confirme d’abord/.test(await txt(p,'[data-auth=confirmation] .a-feedback')||''),await txt(p,'[data-auth=confirmation] .a-feedback'));
  await ev(p,()=>window.RC_API.simLink());await p.waitForTimeout(500);
  ok(T('lien de l’e-mail → Accueil sans profil'),(await hash(p))==='#accueil'&&await ev(p,()=>!document.getElementById('homeEmpty').hidden),await hash(p));
  // Mot de passe oublié
  await etat(p,'out','#mot-de-passe-oublie');await p.click('[data-form=forgot] .a-primary');ok(T('oublié vide : bloqué'),(await hash(p))==='#mot-de-passe-oublie'&&await ev(p,()=>document.querySelector('#fgEmail').matches(':invalid')));
  await p.fill('#fgEmail','personne@exemple.fr');await p.click('[data-form=forgot] .a-primary');await p.waitForTimeout(150);
  ok(T('adresse sans compte'),(await txt(p,'[data-auth=mot-de-passe-oublie] .a-feedback'))==='Aucun compte avec cette adresse. Vérifie-la, ou crée un compte.');
  await p.fill('#fgEmail','Gouverneur@exemple.fr');await p.click('[data-form=forgot] .a-primary');await p.waitForTimeout(150);
  ok(T('adresse connue : e-mail envoyé'),/^E-mail envoyé à gouverneur@exemple.fr/.test(await txt(p,'[data-auth=mot-de-passe-oublie] .a-feedback')||''),await txt(p,'[data-auth=mot-de-passe-oublie] .a-feedback'));
  await ev(p,()=>window.RC_API.simLink());await p.waitForTimeout(400);ok(T('lien de l’e-mail → nouveau mot de passe'),(await hash(p))==='#nouveau-mot-de-passe');
  await p.fill('#npPw','court');await p.fill('#npPw2','court');await p.click('[data-form=newpw] .a-primary');await p.waitForTimeout(150);ok(T('nouveau trop court'),(await txt(p,'#npPwErr'))==='Au moins 8 caractères.');
  await p.fill('#npPw','nouveau123');await p.fill('#npPw2','nouveau12');await p.click('[data-form=newpw] .a-primary');await p.waitForTimeout(150);ok(T('nouveau différent'),(await txt(p,'#npPw2Err'))==='Les mots de passe ne correspondent pas.');
  await p.fill('#npPw2','nouveau123');await p.click('[data-form=newpw] .a-primary');await p.waitForTimeout(400);
  const toast=await ev(p,()=>{const t=document.getElementById('toast');return t.classList.contains('show')?t.textContent:null;});
  ok(T('nouveau enregistré → connecté'),(await hash(p))!=='#nouveau-mot-de-passe'&&toast==='Nouveau mot de passe enregistré.',(await hash(p))+' / '+toast);
  await ev(p,()=>{location.hash='plus';});await p.waitForTimeout(200);await p.click('[data-act=sheet-logout]');await p.waitForTimeout(200);await p.click('#shActions .btn.danger, #shActions .btn.primary');await p.waitForTimeout(300);
  await p.fill('#liEmail','gouverneur@exemple.fr');await p.fill('#liPw','rok12345');await p.click('[data-form=login] .a-primary');await p.waitForTimeout(300);ok(T('ancien mot de passe refusé'),(await hash(p))==='#connexion');
  await p.fill('#liPw','nouveau123');await p.click('[data-form=login] .a-primary');await p.waitForTimeout(400);ok(T('nouveau mot de passe accepté'),(await hash(p))==='#accueil',await hash(p));
  await etat(p,'out','#nouveau-mot-de-passe');await p.click('[data-auth=nouveau-mot-de-passe] .a-secondary');await p.waitForTimeout(200);ok(T('nouveau mdp : « Retour à la connexion »'),(await hash(p))==='#connexion');
  await etat(p,'out','#mot-de-passe-oublie');await p.click('[data-auth=mot-de-passe-oublie] .a-secondary');await p.waitForTimeout(200);ok(T('oublié : « Retour à la connexion »'),(await hash(p))==='#connexion');
  // Clavier : ordre de tabulation sur la connexion
  await etat(p,'out','#connexion');await p.focus('#liEmail');const ordre=[];for(let i=0;i<6;i++){await p.keyboard.press('Tab');ordre.push(await ev(p,()=>{const e=document.activeElement;return (e.id||e.className||e.tagName)+'';}));}
  R.fonction.push(['INFO',T('ordre de tabulation après E-mail'),ordre.join(' → ')]);
  await p.context().close();}
fs.writeFileSync(path.join(process.env.ROBOT_SORTIE||__dirname,'resultat-connexion.json'),JSON.stringify(R,null,1));
const n=R.fonction.filter(x=>x[0]==='ÉCHEC').length;console.log('fonctionnement :',R.fonction.length,'vérifications,',n,'échecs');
R.fonction.filter(x=>x[0]!=='OK').forEach(x=>console.log(x.join(' | ')));
const C={};Object.entries(R.mesures).forEach(([k,v])=>v.c.forEach(c=>{const key=c[0]+' | '+c[1];(C[key]=C[key]||[]).push(k);}));
console.log('\nconstats de mesure :',Object.keys(C).length);Object.entries(C).forEach(([k,v])=>console.log('-',k,' ['+v.join(', ')+']'));
console.log('\nERREURS',JSON.stringify(R.erreurs));await b.close();})();
