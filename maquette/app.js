(function(){
'use strict';
/* ================= Outils ================= */
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));};
function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var MAIL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/></svg>';
function ic(id){if(id==='mail')return MAIL;return '<svg viewBox="0 0 64 64" aria-hidden="true"><use href="#'+id+'"/></svg>';}
function paintIcons(root){$$('i[data-i]',root).forEach(function(el){el.outerHTML=ic(el.getAttribute('data-i'));});}
function nb(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');}
function fM(m){if(m==null)return '—';if(m>=10)return Math.round(m)+' M';var r=Math.round(m*10)/10;return String(r).replace('.',',')+' M';}
function fH(h){h=Math.round(h);var j=Math.floor(h/24),r=h%24;return j?j+' j '+r+' h':r+' h';}
function pill(st,txt){return '<span class="pill st-'+st+'"><i></i>'+esc(txt)+'</span>';}
function row(o){/* {href,act,data,icon,nb,title,sub,val,valSub,valCls,go,pill,cls} */
  var tag=o.href?'a':(o.act?'button':'div');
  var at=o.href?' href="'+o.href+'"':(o.act?' type="button" data-act="'+o.act+'"'+(o.data!=null?' data-arg="'+esc(o.data)+'"':''):'');
  return '<'+tag+' class="row'+(o.cls?' '+o.cls:'')+'"'+at+'>'+
    (o.nb!=null?'<span class="nb">'+o.nb+'</span>':'')+(o.icon?'<span class="ri">'+ic(o.icon)+'</span>':'')+
    '<span class="rc"><b>'+o.title+'</b>'+(o.sub?'<small>'+o.sub+'</small>':'')+'</span>'+
    (o.val!=null?'<span class="rv'+(o.valCls?' '+o.valCls:'')+'">'+o.val+(o.valSub?'<span class="todo">'+o.valSub+'</span>':'')+'</span>':'')+
    (o.pill||'')+((o.href||o.act)&&o.go!==false?'<span class="go">'+ic('i-next2')+'</span>':'')+'</'+tag+'>';
}
var toastEl=$('#toast'),tt;
/* Message éphémère : il reste d'autant plus longtemps qu'il est long (3 à 7 s). */
function say(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('show');},Math.min(7000,Math.max(3000,String(t).length*70)));}
var TODAY='8 oct. 2026',TODAY_S='8 oct.';
/* Dans « Ma version réelle », la date du jour est la vraie. */
try{if(localStorage.getItem('rc-mode')==='reel'){var MO=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'],DN=new Date();TODAY_S=(DN.getDate()===1?'1er':DN.getDate())+' '+MO[DN.getMonth()];TODAY=TODAY_S+' '+DN.getFullYear();}}catch(e){}

/* ================= Données d'exemple ================= */
var CIVS=['Grèce','Maya','Rome','Allemagne','Royaume-Uni','France','Chine','Vikings','Égypte','Japon','Corée','Espagne','Arabie','Empire ottoman','Byzance'];
var FIELDS={
  hdv:{label:'Hôtel de ville',icon:'i-hall',kind:'lvl',grp:'set'},vip:{label:'Niveau VIP',icon:'n-vip',kind:'lvl',grp:'set'},
  builders:{label:'Bâtisseurs',icon:'t-hammer',kind:'count',grp:'set'},bonus:{label:'Bonus de vitesse de construction',court:'Bonus de vitesse',icon:'i-gauge',kind:'pct',grp:'set'},
  civ:{label:'Civilisation',icon:'n-laurel',kind:'civ',grp:'set'},
  mur:{label:'Mur',icon:'i-wall',kind:'lvl',grp:'bld'},academie:{label:'Académie',icon:'i-temple',kind:'lvl',grp:'bld'},
  caserne:{label:'Caserne',icon:'t-swords',kind:'lvl',grp:'bld'},ecurie:{label:'Écurie',icon:'n-horseshoe',kind:'lvl',grp:'bld'},
  tir:{label:'Champ de tir à l’arc',icon:'n-bow',kind:'lvl',grp:'bld'},
  /* le jeu a 4 hôpitaux (2026-10-09) : un niveau par hôpital ; pour les prérequis, on compte le plus haut (à vérifier) */
  hopital:{label:'Hôpital',pl:'Hôpitaux',icon:'i-hosp',kind:'multi',n:4,grp:'bld'},
  siege:{label:'Atelier d’armes de siège',icon:'n-catapult',kind:'lvl',grp:'bld'},
  entrepot:{label:'Réserve',icon:'i-chest',kind:'lvl',grp:'bld'},
  /* Ajoutés le 2026-10-09 (prérequis de l'Hôtel de ville, puis tous les bâtiments à niveau du jeu). Tous les noms sont ceux du jeu en français,
     relevés sur les captures de Mickaël du 2026-10-09 (Réserve, Moulin à bois, Comptoir, Centre d'alliance, Champ de tir à l'arc, Atelier d'armes de siège…). */
  eclaireurs:{label:'Camp d’éclaireurs',icon:'i-eye',kind:'lvl',grp:'bld'},alliance:{label:'Centre d’alliance',icon:'n-banners',kind:'lvl',grp:'bld'},
  comptoir:{label:'Comptoir',icon:'n-scale',kind:'lvl',grp:'bld'},
  chateau:{label:'Château',icon:'i-castle',kind:'lvl',grp:'bld'},taverne:{label:'Taverne',icon:'i-house',kind:'lvl',grp:'bld'},
  tourguet:{label:'Tour de guet',icon:'i-keep',kind:'lvl',grp:'bld'},
  ferme:{label:'Ferme',pl:'Fermes',icon:'r-food',kind:'multi',n:4,grp:'bld'},scierie:{label:'Moulin à bois',pl:'Moulins à bois',icon:'r-wood',kind:'multi',n:4,grp:'bld'},
  carriere:{label:'Carrière',pl:'Carrières',icon:'r-stone',kind:'multi',n:4,grp:'bld'},mine:{label:'Mine d’or',pl:'Mines d’or',icon:'r-gold',kind:'multi',n:4,grp:'bld'},
  /* Bâtiments de saison de KvK (choix 2 de Mickaël, 2026-10-09) : jamais comptés « à renseigner » ; fin : retirés en fin de saison (guides, non officiel) */
  forum:{label:'Forum d’état',icon:'n-scroll',kind:'lvl',grp:'bld',saison:1},minecristal:{label:'Mine de cristal',icon:'n-ore',kind:'lvl',grp:'bld',saison:1,fin:1},
  cristalrech:{label:'Centre de recherche de cristal',icon:'t-flask',kind:'lvl',grp:'bld',saison:1,fin:1}
};
var KIND={lvl:['Niveau','Nouveau niveau'],count:['Nombre','Nouveau nombre'],pct:['Bonus (en %)','Nouveau bonus (en %)'],civ:['Civilisation','Nouvelle civilisation'],multi:['Niveaux','Nouveaux niveaux']};
/* Valeur d'un bâtiment en plusieurs exemplaires : tableau d'un niveau par exemplaire (null = pas renseigné). */
function isMulti(k){return FIELDS[k]&&FIELDS[k].kind==='multi';}
function vide4(v){return !v||!v.some(function(x){return x!=null;});}
/* niveau qui compte (prérequis) : le plus haut des exemplaires */
function niv(p,k){var v=p.v[k];if(!isMulti(k))return v;if(vide4(v))return null;return Math.max.apply(null,v.filter(function(x){return x!=null;}));}
function nomPl(k){return FIELDS[k].pl||FIELDS[k].label;}
function hist(v){if(v==null)return [];if(Array.isArray(v))return [{v:v,d:'5 oct. 2026',m:'',src:'Saisie'}];if(typeof v==='string')return [{v:v,d:'4 oct. 2026',m:'',src:'Saisie'}];return [{v:v,d:'5 oct. 2026',m:'Changé en jeu',src:'Saisie'},{v:Math.max(0,v-1),d:'12 sept. 2026',m:'',src:'Import'}];}
function mkProfile(o){
  if(!o.encours)o.encours=[];if(!o.coffres)o.coffres={};if(!o.objets)o.objets={};if(!o.items)o.items={boosts:[],equip:[],attirail:[],autre:[]};
  o.h={};Object.keys(FIELDS).forEach(function(k){if(!(k in o.v))o.v[k]=null;o.h[k]=hist(o.v[k]);});return o;
}
var P={
  main:mkProfile({name:'Principal',type:'Principal',icon:'i-crown',kd:'#3567',pid:'123456789',power:'128,4 M',kills:'412,8 M',deaths:'5,6 M',gems:'185 430',ap:'6 250',
    tr:['▲ +2,1 M (7j)','▲ +12,4 M (7j)','▲ +320 K (7j)'],releves:214,corr:12,snaps:6,
    v:{hdv:24,vip:17,builders:2,bonus:null,civ:'France',mur:23,academie:24,caserne:23,ecurie:22,tir:22,hopital:[23,22,22,21],siege:null,entrepot:22,eclaireurs:22,alliance:24,comptoir:24,
      chateau:22,taverne:21,tourguet:20,ferme:[24,24,23,22],scierie:[24,23,23,22],carriere:[23,22,21,21],mine:[22,21,20,19],
      forum:6,minecristal:4,cristalrech:3},
    research:[['Économie',68],['Militaire',54]],troops:[['Infanterie','t-swords',5,120000],['Cavalerie','n-horseshoe',5,85000],['Archers','n-bow',4,210000],['Siège','n-catapult',4,40000]],
    /* Exemples : tailles de caisses et durées d'accélérateurs du jeu (étude B03 du 6 oct. 2026) ; les nombres sont inventés */
    res:{food:{v:32,c:[['500 000',18,.5],['150 000',32,.15],['50 000',44,.05]]},wood:{v:27,c:[['500 000',16,.5],['150 000',28,.15],['50 000',36,.05]]},
         stone:{v:12,c:[['375 000',8,.375],['112 500',20,.1125],['37 500',21,.0375]]},gold:{v:6.1,c:[['200 000',10,.2],['50 000',19,.05],['15 000',8,.015]]}},
    gemsIn:{v:184930,c:[['10',50,10]]},
    acc:{build:[['1 min',212,1/60],['5 min',140,5/60],['60 min',195,1],['3 h',44,3],['8 h',12,8],['15 h',3,15]],research:[['1 min',160,1/60],['60 min',176,1],['8 h',14,8],['15 h',2,15]],
         train:[['60 min',120,1],['8 h',12,8]],heal:[['60 min',52,1],['8 h',3,8]],general:[['60 min',260,1],['8 h',14,8],['24 h',3,24]]},
    coffres:{c1:2,c2:3,c3:1,c4:1,pA:1,p2:1},
    objets:{att12:4,def12:2,exp25:2,cuir_g:120,cuir_v:30,cuir_b:6,fer_g:96,fer_v:22,fer_b:4,ebene_g:80,ebene_v:18,os_g:75,os_v:20,os_b:3,
      plan_v:6,plan_b:3,frag_v:12,frag_b:5,cme_g:4,cmc_g:20,cfp_v:15,piece_v:3,piece_b:2,cform:1,sch_p:30,sch_o:12,scm_p:120,scm_o:45,ste_o_s:20,ste_p_s:60,ste_b_s:150,ste_v_s:300,
      xp1:800,xp2:120,xp3:240,xp4:12,xp5:6,pa50:90,pa100:40,pa500:4,cle_ar:5,cle_or:1,livre_all:20,fleche_res:30},
    paCalc:{niv:25,talent:false},
    items:{boosts:[],equip:[],attirail:[{n:'Cor du Nord',q:1,c:'b'}],autre:[{n:'Passeports',q:12}]},
    obj:{title:'Hôtel de ville 25',short:'HDV 25',pct:62,href:'#plan-c25'}}),
  f1:mkProfile({name:'Ferme 1',type:'Ferme',icon:'i-sprout',kd:'#3567',pid:'',power:'18,2 M',kills:'1,2 M',deaths:'40 K',gems:'3 200',ap:'1 000',
    tr:['▲ +0,4 M (7j)','',''],releves:61,corr:2,snaps:3,
    v:{hdv:21,vip:8,builders:2,bonus:25,civ:'Rome',mur:21,academie:18,caserne:16,ecurie:15,tir:15,hopital:[17,15,null,null],siege:12,entrepot:19,eclaireurs:16,alliance:19,comptoir:15,
      chateau:null,taverne:12,tourguet:null,ferme:[21,21,20,20],scierie:[21,20,20,19],carriere:[22,22,21,21],mine:[18,17,16,null]},
    research:[['Économie',41],['Militaire',22]],troops:[['Infanterie','t-swords',4,30000],['Cavalerie','n-horseshoe',3,10000],['Archers','n-bow',3,20000],['Siège','n-catapult',2,5000]],
    res:{food:{v:6,c:[]},wood:{v:7,c:[]},stone:{v:14,c:[]},gold:{v:4,c:[]}},gemsIn:{v:3200,c:[]},
    acc:{build:[['60 min',40,1]],research:[['60 min',22,1]],train:[],heal:[],general:[['60 min',30,1]]},
    obj:{title:'Envoyer de la pierre',short:'Envoi au Principal',pct:0,href:'#fermes'}}),
  f2:mkProfile({name:'Ferme 2',type:'Ferme',icon:'i-sprout',kd:'#3567',pid:'',power:'6,4 M',kills:'210 K',deaths:'8 K',gems:'450',ap:'420',
    tr:['','',''],releves:18,corr:0,snaps:1,
    v:{hdv:17,vip:6,builders:1,bonus:null,civ:null,mur:17,academie:null,caserne:12,ecurie:null,tir:11,hopital:[12,null,null,null],siege:null,entrepot:null,eclaireurs:14,alliance:null,comptoir:13},
    research:[['Économie',20],['Militaire',8]],troops:[['Infanterie','t-swords',2,8000],['Cavalerie','n-horseshoe',1,2000],['Archers','n-bow',2,6000],['Siège','n-catapult',1,0]],
    res:{food:{v:4,c:[]},wood:{v:4,c:[]},stone:{v:2,c:[]},gold:{v:2,c:[]}},gemsIn:{v:450,c:[]},
    acc:{build:[['60 min',8,1]],research:[],train:[],heal:[],general:[]},
    obj:{title:'Hôtel de ville 18',short:'Hôtel de ville 18',pct:50,href:'#ma-ville-progression'}})
};
var ORDER=['main','f1','f2'];

/* ================= Comptes (écrans B01-01 à 05) =================
   Comptes gardés en mémoire du navigateur. Chaque compte a ses propres profils : le compte d'essai a les profils
   d'exemple, un compte créé dans la maquette commence sans profil (Accueil sans profil, B01-06). */
var DEMO='gouverneur@exemple.fr';
var ACC={};ACC[DEMO]={pw:'rok12345',ok:true,data:{P:P,ORDER:ORDER,active:'main'}};
var AUTH={user:null,after:null,pending:null,reset:null};
var AUTH_IDS=['connexion','inscription','confirmation','mot-de-passe-oublie','nouveau-mot-de-passe'];
var S={active:'main',time:'30',imported:false,sent:0,reserved:false,planSaved:false,inv:'res',cmdF:'all',form:'Coin',
  valKey:'caserne',quick:false,profileView:null,
  goals:[{t:'Recherche économie complète',icon:'t-flask',pct:68,sub:'Partage la pierre avec l’Hôtel de ville 25 : l’appli ne la compte qu’une fois'},{t:'300 000 fantassins niveau 5',icon:'t-swords',pct:40,sub:''}],
  budget:30,purchases:[['Pack de bâtisseur','3 oct.',9.99],['Abonnement mensuel','1er oct.',4.99],['Pack de ressources','1er oct.',9.99]],packSim:false,
  kd:'3401',tDays:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],tMoment:'soir',tLen:'30',
  marches:[{p:'Richard Ier',s:'Constantin Ier',type:'Infanterie',form:'Coin',eq:true},{p:'Guan Yu',s:'Baïbars',type:'Cavalerie',form:'Arc',eq:false},
           {p:'Charles Martel',s:'Sun Tzu',type:'Garnison',form:'Carré creux',eq:true},{p:'Aethelflaed',s:'Boudica',type:'Polyvalente',form:'Coin',eq:true}],
  cmpSec:'Charles Martel',sesMode:'field',rep:0,reminders:{},bil:'7',
  notif:{codes:true,events:true,plan:false,update:true},email:'gouverneur@exemple.fr',lang:'Français',tz:'Europe/Paris',
  codes:[{c:'AUTOMNE2026',sub:'Vérifié le 6 oct. · expire le 31 oct.',st:'try'},{c:'LEGION3567',sub:'Vérifié le 4 oct. · expiration inconnue',st:'try'},{c:'ROKETE26',sub:'Vérifié le 28 août · utilisé le 2 sept.',st:'used'}],
  spType:'research',spDays:7,shots:[],
  q:{q1:null,q2:null,q3:null},sureOk:false,
  reports:[{t:'Attaque d’une forteresse',d:'7 oct. · Marche 1',ok:true,obs:'Forteresse prise ; 2 300 blessés légers.',hyp:'Aucune.',abs:'La garnison adverse n’apparaît pas en entier.'},
           {t:'Champ ouvert contre « Ragnar »',d:'5 oct. · Marche 2',ok:false,obs:'18 400 pertes contre 9 100 chez l’adversaire.',hyp:'L’équipement du commandant secondaire, inconnu, peut expliquer l’écart.',abs:'La formation adverse n’apparaît pas sur la capture.'}]
};
var CMD=[
  {n:'Guan Yu',r:'leg',role:'Cavalerie',t:['cav','rally'],lvl:60,sk:'5-5-5-5',st:[12,5,5]},
  {n:'Richard Ier',r:'leg',role:'Infanterie',t:['inf','garrison'],lvl:60,sk:'5-5-5-5',st:[20,12,10]},
  {n:'Charles Martel',r:'leg',role:'Infanterie',t:['inf','garrison'],lvl:60,sk:'5-5-3-3',st:[21,7,8]},
  {n:'Constantin Ier',r:'leg',role:'Infanterie',t:['inf','rally'],lvl:50,sk:'5-1-1-1',st:[18.5,10,8]},
  {n:'Aethelflaed',r:'leg',role:'Polyvalent',t:['inf','cav','arch'],lvl:60,sk:'5-5-5-1',st:[16,8,8]},
  {n:'Sun Tzu',r:'leg',role:'Infanterie',t:['inf'],lvl:60,sk:'5-5-5-5',st:[17,9,9]},
  {n:'Boudica',r:'epic',role:'Polyvalent',t:['inf','cav','arch'],lvl:50,sk:'5-5-5-5',st:[15,6,6]},
  {n:'Baïbars',r:'epic',role:'Cavalerie',t:['cav'],lvl:50,sk:'5-5-5-5',st:[11,4,4]}
];
function cmd(n){return CMD.filter(function(c){return c.n===n;})[0];}
var EQ=[['n-helmet','Casque','leg','Légendaire · Infanterie',[['Attaque de l’infanterie','+5 %'],['Santé','+2 %']]],['i-sword','Arme','leg','Légendaire · Infanterie',[['Attaque de l’infanterie','+8 %']]],
  ['n-armor','Armure','epi','Épique · Infanterie',[['Défense de l’infanterie','+4 %']]],['n-glove','Gants','leg','Légendaire · Infanterie',[['Attaque','+3 %'],['Dégâts de compétence','+2 %']]],
  ['n-boot','Jambières et bottes','epi','Épique · 2 pièces',[['Vitesse de marche','+5 %'],['Santé','+3 %']]],['n-ring','Accessoires','unk','Un emplacement vide',[['Emplacement 2','vide']]]];
var FORMS={'Coin':['n-wedge','4 armements équipés',[['Attaque de l’infanterie','+3,5 %'],['Défense de l’infanterie','+2,0 %'],['Dégâts de compétence','+1,5 %'],['Vitesse de marche','—']]],
  'Arc':['n-arch','2 armements équipés',[['Attaque des archers','+2,5 %'],['Santé','+1,0 %'],['Vitesse de marche','—']]],
  'Carré creux':['n-square','aucun armement',[['Défense','+1,0 %'],['Santé','—']]]};
/* En cours (exemples) : fin relative à l'ouverture de la page. t : build, research, train, heal. */
var H1=3600e3,NOW0=Date.now();
P.main.encours=[{t:'build',q:'Caserne 24',fin:NOW0+3*24*H1+5*H1},{t:'research',q:'Tissage',fin:NOW0+27*H1+12*60e3},{t:'train',q:'Fantassins niveau 5 (12 000)',fin:NOW0+5*H1+20*60e3}];
P.f1.encours=[{t:'build',q:'Mur 22',fin:NOW0+20*H1},{t:'build',q:'Ferme 20',fin:NOW0+2*H1+10*60e3}];
P.f2.encours=[];
/* Bilan de la semaine d'exemple, par profil (exemples) */
var WEEK={main:['+2,1 M de puissance, 3 améliorations','Hôtel de ville 25\u00a0: +8 % en 7 jours'],f1:['+0,4 M de puissance, 1 amélioration','Mur 21 terminé']};
/* Événements (exemples, noms et dates inventés pour la démonstration) : début et fin en millisecondes, null si inconnus.
   st : ok (confirmé), plan (date estimée), unk (inconnu). */
function resetApres(jours,h){var d=new Date(NOW0);d.setUTCHours(0,0,0,0);return d.getTime()+jours*24*H1+(h||0)*H1;}
var EVENTS=[
  {id:'ev5',icon:'i-sword',n:'Assaut des Ceroli',debut:resetApres(-1),fin:resetApres(2),st:'ok'},
  {id:'ev1',icon:'i-trophy',n:'Gouverneur le plus puissant',debut:resetApres(2),fin:resetApres(8),st:'ok'},
  {id:'ev2',icon:'n-ankh',n:'Arche d’Osiris',debut:resetApres(5,12),fin:resetApres(5,13),st:'ok'},
  {id:'ev3',icon:'i-flag',n:'KvK : saison 3',debut:resetApres(10),fin:null,st:'plan'},
  {id:'ev4',icon:'n-gift',n:'Fête de la moisson',debut:null,fin:null,st:'unk'}];

/* ================= Ma version réelle (décision de Mickaël du 2026-10-09) =================
   Deux versions : « Exemples » (pré-remplie, pour les tests) et « Ma version réelle » (vierge, remplie par Mickaël,
   gardée avec la maquette publiée). Dans la version réelle, aucun exemple : un écran reste vide tant qu'il n'est pas rempli. */
var REEL=false;try{REEL=localStorage.getItem('rc-mode')==='reel';}catch(e){}
var LOADED=!REEL;
if(REEL){
  P={};ORDER=[];CMD=[];EQ=[];FORMS={};EVENTS=[];
  S.active=null;S.imported=false;S.sent=0;S.reserved=false;S.planSaved=false;S.budget=null;S.form=null;S.cmpSec=null;S.rep=0;
  S.goals=[];S.purchases=[];S.marches=[];S.codes=[];S.reports=[];S.reminders={};S.email='';S.tDays=[];
  ACC={};ACC.REEL={pw:'',ok:true,data:{P:P,ORDER:ORDER,active:null}};AUTH.user='REEL';S.events=[];
  document.documentElement.classList.add('reel');
}
function vide(t){return '<p class="vide">'+t+'</p>';}
var STORE_KEYS=['routine','events','time','tDays','tMoment','tLen','notif','lang','tz','email','goals','purchases','budget','marches','codes','reports','reminders','sent','reserved','planSaved','bil','imported'];
function snapshot(){var o={};STORE_KEYS.forEach(function(k){o[k]=S[k];});o.reports=(S.reports||[]).map(function(r){var c={};Object.keys(r).forEach(function(k){if(k!=='img')c[k]=r[k];});return c;});return JSON.stringify({v:1,P:P,ORDER:ORDER,active:S.active,S:o});}
var saveT=null,lastSaved='';
/* Enregistre la version réelle (avec un court délai, et seulement si quelque chose a changé). Jamais avant d'avoir chargé. */
function saveReel(now){
  if(!REEL||!LOADED||!window.RC_STORE)return;clearTimeout(saveT);
  /* un changement attend son envoi : on l'affiche tout de suite (« Enregistrement… ») */
  if(!now&&!SAVING){var j0=snapshot();if(j0!==lastSaved){SAVING=true;paintSync();}}
  saveT=setTimeout(function(){var j=snapshot();if(j===lastSaved){if(SAVING){SAVING=false;paintSync();}return;}lastSaved=j;SAVING=true;paintSync();
    var pr;try{pr=window.RC_STORE.save(j);}catch(e){pr=Promise.reject(e);}
    pr.then(function(){SAVING=false;SAVE_KO=false;paintSync();},function(){SAVING=false;SAVE_KO=true;paintSync();lastSaved='';say('Tes données n’ont pas pu être enregistrées dans la maquette publiée. Une copie est gardée sur cet appareil ; l’envoi sera retenté à ta prochaine modification.');});},now?0:600);
}
/* État affiché en haut de Ma ville et d'une valeur (remplace le faux « Synchronisé », décision du 2026-10-09) */
var SAVING=false,SAVE_KO=false;
function paintSync(){var t,c;
  if(!REEL){t='Exemples, non enregistrés';c='demo';}
  else{var f=window.RC_SYNC?window.RC_SYNC():{};if(SAVING||f.envoi){t='Enregistrement…';c='busy';}else if(f.attente||SAVE_KO){t='En attente d’envoi';c='wait';}else if(f.local){t='Gardé sur cet appareil';c='';}else{t='Enregistré';c='';}}
  $$('[data-sync]').forEach(function(el){el.className='sync'+(c?' '+c:'');el.lastElementChild.textContent=t;
    el.title=c==='demo'?'Version Exemples : tes essais ne sont pas gardés.':c==='wait'?'Une copie est gardée sur cet appareil ; l’envoi est retenté tout seul.':'';});}
document.addEventListener('rc:sync',function(){if(window.RC_SYNC&&!window.RC_SYNC().attente)SAVE_KO=false;paintSync();});
function applyReel(j){var d=JSON.parse(j);P=d.P||{};ORDER=d.ORDER||[];Object.keys(P).forEach(function(k){normProfile(P[k]);});S.active=d.active&&P[d.active]?d.active:(ORDER[0]||null);
  if(d.S)Object.keys(d.S).forEach(function(k){if(STORE_KEYS.indexOf(k)>=0)S[k]=d.S[k];});fixRoutine();ACC.REEL.data={P:P,ORDER:ORDER,active:S.active};}
function startReel(){
  var ld=document.createElement('div');ld.className='reel-load';ld.innerHTML='<p>Chargement de tes données…</p>';document.body.appendChild(ld);
  var done=false;
  function fail(){if(done)return;done=true;ld.innerHTML='<div class="card hl"><h3>Tes données ne se chargent pas</h3><p>Vérifie ta connexion, puis réessaie. Rien n’a été effacé.</p><div class="btns"><button class="btn primary" type="button" onclick="location.reload()">Réessayer</button><button class="btn" type="button" onclick="try{localStorage.setItem(\'rc-mode\',\'demo\')}catch(e){}location.reload()">Revenir aux exemples</button></div></div>';}
  function go(){if(done)return;window.RC_STORE.load().then(function(j){if(done)return;done=true;if(j)applyReel(j);lastSaved=j||'';LOADED=true;ld.remove();route();
    /* la copie de ce navigateur était plus récente que la maquette publiée : on la renvoie */
    if(window.RC_STORE.st&&window.RC_STORE.st.pending){window.RC_STORE.st.pending=false;lastSaved='';saveReel(true);}},fail);}
  if(window.RC_STORE)go();else document.addEventListener('rc:store',go,{once:true});
  setTimeout(fail,15000);
}

/* ================= Temps, routine, pillage, événements (décisions de Mickaël du 2026-10-09) ================= */
/* Un profil créé avant l'ajout d'un champ reçoit ce champ vide (jamais zéro). */
function normProfile(p){Object.keys(FIELDS).forEach(function(k){if(!(k in p.v))p.v[k]=null;if(!p.h[k])p.h[k]=[];
    if(isMulti(k)&&typeof p.v[k]==='number'){var a=[null,null,null,null];a[0]=p.v[k];p.v[k]=a;}});if(!p.encours)p.encours=[];
  if(!p.coffres)p.coffres={};if(!p.objets)p.objets={};if(!p.items)p.items={};['boosts','equip','attirail','autre'].forEach(function(t){if(!p.items[t])p.items[t]=[];});return p;}
var JEU=window.RC_JEU||{entrepot:{niveaux:{}},reset:{heureUTC:0},routine:[]};
if(!S.routine)S.routine={items:JEU.routine.map(function(x){return {id:x.id,t:x.t,d:x.d};}),done:{},propose:true};
if(!S.events)S.events=[];
/* Noms du jeu relevés le 2026-10-09 : une ligne proposée que Mickaël n'a jamais renommée est corrigée (aussi dans sa version réelle). */
function fixRoutine(){(S.routine&&S.routine.items||[]).forEach(function(x){if(x.id==='lycee'&&x.t==='Lycée de la sagesse')x.t='Amphithéâtre de la sagesse';if(x.id==='ville'&&x.d==='Ramasser fermes, scieries, carrières et mines d’or')x.d='Ramasser fermes, moulins à bois, carrières et mines d’or';});}
fixRoutine();
function evList(){return REEL?S.events:EVENTS;}
/* Durée lisible : 2 j 4 h, 5 h 20 min, 12 min */
function fDuree(ms){var m=Math.max(0,Math.round(ms/60000)),j=Math.floor(m/1440),h=Math.floor(m%1440/60),mn=m%60;
  return j?j+' j'+(h?' '+h+' h':''):h?h+' h'+(mn?' '+mn+' min':''):mn+' min';}
function fQuand(t){var d=new Date(t);return d.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})+' à '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});}
/* « 2j 4h 30m », « 4 h », « 45 min », « 1:30:00 » (h:min:s) ou « 2:04:30:00 » (j:h:min:s) → millisecondes */
function parseDuree(t){t=String(t||'').trim().toLowerCase().replace(',','.');if(!t)return null;
  var m=t.match(/^(\d+):(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if(m){var a=m.slice(1).filter(function(x){return x!=null;}).map(Number);if(a.length===3)return ((a[0]*60+a[1])*60+a[2])*1000;return (((a[0]*24+a[1])*60+a[2])*60+a[3])*1000;}
  var tot=0,ok=false,re=/(\d+(?:\.\d+)?)\s*(j|jours?|d|h|heures?|m|min|minutes?|s|sec)\b/g,x,rest=t;
  while((x=re.exec(t))){ok=true;var v=+x[1],u=x[2][0];tot+=v*(u==='j'||u==='d'?86400:u==='h'?3600:u==='m'?60:1)*1000;rest=rest.replace(x[0],'');}
  if(!ok||rest.replace(/[\s,et]/g,'').length)return null;return tot;}
/* Jour de jeu : il change à la réinitialisation quotidienne (minuit UTC, soit 2 h en France en été). */
function jourJeu(){return new Date(Date.now()-JEU.reset.heureUTC*H1).toISOString().slice(0,10);}
function prochainReset(){var d=new Date();d.setUTCHours(JEU.reset.heureUTC,0,0,0);if(d.getTime()<=Date.now())d=new Date(d.getTime()+24*H1);return d.getTime();}
/* Heure de la remise à zéro, en heure UTC (note 10 de Mickaël, 2026-10-09) : « minuit UTC » */
function heureReset(){var h=JEU.reset.heureUTC;return h===0?'minuit UTC':h+' h UTC';}
function rtFait(id){return S.routine.done[(S.active||'')+'|'+id]===jourJeu();}
/* Ressources en ville au-dessus de la protection de la réserve (« Storehouse » ; données de la source, non vérifiées) */
function pillage(p){var lv=p.v.entrepot,pr=lv!=null&&JEU.entrepot.niveaux[lv];if(!pr)return null;
  var R=[['food','Nourriture'],['wood','Bois'],['stone','Pierre'],['gold','Or']],L=[];
  R.forEach(function(r,i){var x=p.res[r[0]];if(!x||x.v==null)return;var e=x.v-pr[i]/1e6;if(e>=0.05)L.push(r[1]+' '+fM(e));});return L;}

/* ================= Calculs ================= */
function A(){return P[S.active];}
function resTot(r){if(!r||(r.v==null&&!(r.c&&r.c.length)))return null;return (r.v||0)+r.c.reduce(function(a,c){return a+c[1]*c[2];},0);}
function accTot(a){if(!a||!a.length)return 0;return a.reduce(function(s,x){return s+x[1]*x[2];},0);}
function unknown(p){return Object.keys(FIELDS).filter(function(k){return !FIELDS[k].saison&&(isMulti(k)?vide4(p.v[k]):p.v[k]==null);});}
function bonusMain(){return P.main?P.main.v.bonus:null;}
function plan(){var m=P.main;var b=m&&m.v.bonus!=null?m.v.bonus:0;var f=1+b/100;var mur=98/f,hdv=244/f;
  var recv=Math.round(S.sent*0.82*10)/10;var miss=Math.max(0,Math.round((4.2-recv)*10)/10);
  return {mur:mur,hdv:hdv,total:mur+hdv,recv:recv,miss:miss,acc:m?accTot(m.acc.build):0};}

/* ================= Liaisons simples ================= */
function bind(){
  var p=A(),pl=plan();
  var K={name:p?p.name:'',meta:p?('Royaume '+p.kd+' · HDV '+(p.v.hdv==null?'—':p.v.hdv)+' · VIP '+(p.v.vip==null?'—':p.v.vip)):'',
    power:p?p.power:'',kills:p?p.kills:'',deaths:p?p.deaths:'',gems:p?p.gems:'',ap:p?p.ap:'',tr0:p?p.tr[0]:'',tr1:p?p.tr[1]:'',tr2:p?p.tr[2]:'',
    objShort:p?p.obj.short:'',objPct:p?(p.obj.pct==null?'—':p.obj.pct+' %'):'',objTitle:p?p.obj.title:'',
    tMur:fH(pl.mur),tHdv:fH(pl.hdv),tTotal:fH(pl.total),accBuild:fH(pl.acc),builders:P.main?P.main.v.builders:'—'};
  $$('[data-k]').forEach(function(el){var k=el.getAttribute('data-k');if(k in K)el.textContent=K[k];});
  var n=p?unknown(p).length:0;var bd=$('#navBadge');bd.hidden=!n;bd.textContent=n;bd.setAttribute('aria-label',n+' valeurs à renseigner');
}

/* ================= Accueil ================= */
function renderHome(){
  var has=ORDER.length>0;$('#homeEmpty').hidden=has;$('#homeMain').hidden=!has;
  $('#pTabs').innerHTML=ORDER.map(function(k){var p=P[k];return '<button class="p-tab" type="button" data-prof="'+k+'" aria-pressed="'+(k===S.active)+'">'+ic(p.icon)+esc(p.name)+'</button>';}).join('')+
    '<button class="p-tab add" type="button" data-act="add-profile" aria-label="Ajouter un profil">'+ic('i-plus')+(has?'':'<span>Ajouter</span>')+'</button>';
  $('#pTabs').classList.toggle('none',!has);
  if(!has)return;
  var p=A(),pl=plan();
  $('#hEmblem').innerHTML=ic(p.icon);
  var n=unknown(p).length;var tl=$('#todoLink');tl.textContent=n?n+' à renseigner ›':'';tl.hidden=!n;
  /* Aperçu de ma ville : les 6 bulles de l'Accueil validé B04-01 (décision du 2026-10-08) */
  var r=p.res,bv=p.v.builders,bo=p.v.bonus;
  var tiles=[['t-hammer','Bâtisseurs',bv==null?null:String(bv),'#valeur-builders'],['i-gauge','Bonus de vitesse',bo==null?null:String(bo).replace('.',',')+' %','#valeur-bonus'],
    ['r-food','Total nourriture',fM(resTot(r.food)),'#ma-ville-inventaire'],['r-wood','Total bois',fM(resTot(r.wood)),'#ma-ville-inventaire'],
    ['r-stone','Total pierre',fM(resTot(r.stone)),'#ma-ville-inventaire'],['r-gold','Total or',fM(resTot(r.gold)),'#ma-ville-inventaire']];
  $('#homeTiles').innerHTML=tiles.map(function(t){return '<a class="tile" href="'+t[3]+'"><span class="ri">'+ic(t[0])+'</span><span><span class="tl">'+t[1]+'</span><div class="tv'+(t[2]==null?' unk':'')+'">'+(t[2]==null?'—':t[2])+'</div>'+(t[2]==null?'<span class="todo">à renseigner</span>':'')+'</span></a>';}).join('');
  // objectif
  var oc=$('#objCard');oc.setAttribute('href',p.obj.href);$('#objFill').style.width=(p.obj.pct||0)+'%';
  $('#objText').innerHTML=REEL?'Choisis ton objectif dans Optimiser (« Nouvel objectif »).':S.active==='main'?('Reste : <b>Mur 24</b>, <b>Hôtel de ville 25</b> · '+(pl.miss?'il manque <b>'+fM(pl.miss)+' de pierre</b>':'<b class="ok">pierre couverte</b>')):
    (S.active==='f1'?(S.sent?'<b class="ok">'+fM(S.sent)+' de pierre envoyés</b> au Principal':'La Ferme 1 peut envoyer de la pierre au <b>Principal</b>'):'Reste : <b>Mur 18</b> · valeurs à renseigner');
  // priorités : actions triées par importance ; on garde celles qui tiennent dans le temps choisi (décision du 2026-10-08, note 5 de Mickaël)
  var L=[];
  if(REEL){/* version réelle : pas encore de priorités calculées ; les valeurs à renseigner sont dans la carte « Renseigne ta ville » */
    L=[];
  }else if(S.active==='main'){
    L.push(['#plan-c25','Lancer le Mur niveau 24','Dernier prérequis de l’Hôtel de ville 25 · '+fH(pl.mur)+(pl.acc>=pl.mur?', couverts par tes accélérateurs':''),2]);
    L.push(pl.miss?['#fermes','Récupérer '+fM(pl.miss)+' de pierre','C’est ce qui manque à l’Hôtel de ville 25 · ta Ferme 1 peut l’envoyer',5]:['#plan-c25','Préparer l’Hôtel de ville 25','La pierre est couverte : il démarre juste après le Mur',2]);
    L.push(['#ma-ville-inventaire','Envoyer tes marches libres récolter','Le bois est ta ressource la plus basse',10]);
    L.push(['#evenements','Entraîner des fantassins niveau 5','Préparation KvK : il en manque 95 000',20]);
    L.push(['#evenements','Aider ton alliance','Dons et aides : tes points d’alliance servent au KvK',3]);
  }else if(S.active==='f1'){
    L=[['#fermes','Envoyer de la pierre au Principal','Il manque '+fM(pl.miss)+' à l’Hôtel de ville 25',5],['#valeur-mur','Lancer le Mur niveau 22','Avec ton bonus de 25 %',2],
       ['#ma-ville-inventaire','Récolter du bois','C’est sa ressource la plus basse',10],['#ma-ville-inventaire','Récolter de la pierre avec une 2e marche','Pour le prochain envoi au Principal',10],['#evenements','Aider ton alliance','Dons et aides',3]];
  }else{
    L=[['#valeur-mur','Lancer le Mur niveau 18','',2],['#ma-ville-inventaire','Récolter de la nourriture','',10],['#evenements','Aider ton alliance','',3]];
  }
  var budget=+S.time,used=0,shown=[];
  /* 5 actions au plus, pour ne pas remplir l'écran (note 8 de Mickaël, 2026-10-09) */
  L.forEach(function(x){if(shown.length<5&&used+x[3]<=budget){shown.push(x);used+=x[3];}});
  if(!shown.length&&L.length)shown=[L[0]];
  $('#prioList').innerHTML=!shown.length?vide(n?'Rien d’autre pour l’instant : renseigne d’abord ta ville, l’appli te proposera ensuite des actions.':'Rien à faire pour l’instant.'):shown.map(function(x,i){return row({href:x[0],nb:i+1,title:esc(x[1]),sub:esc(x[2]),pill:pill('plan','≈ '+x[3]+' min')});}).join('');
  $$('#timeChips .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.time===S.time));});
  // à surveiller
  var W=[];
  /* Valeurs à renseigner : une seule carte « Renseigne ta ville » en haut de « À faire » (décision du 2026-10-09) */
  var U=unknown(p),fs=$('#fillSec');fs.hidden=!U.length;
  if(U.length){$('#fillTitle').textContent='Renseigne ta ville';$('#fillTime').innerHTML='<i></i>≈ '+Math.max(1,Math.ceil(U.length/3))+' min';
    $('#fillText').textContent=U.length+' valeur'+(U.length>1?'s':'')+' à renseigner : '+U.slice(0,4).map(function(k){return nomPl(k);}).join(', ')+(U.length>4?'… ':'. ')+'Les priorités et les alertes seront plus justes.';}
  if(S.active==='main'&&!REEL){
    S.marches.forEach(function(m,i){if(!m.eq)W.push(row({href:'#combat',icon:'i-shield2',title:'Marche '+(i+1)+' incomplète',sub:'Équipement du commandant secondaire inconnu'}));});
    if(!S.imported)W.push(row({href:'#import',icon:'n-camera',title:'Inventaire relevé il y a 6 jours',sub:'Un nouvel import rendra les priorités plus justes'}));
  }
  /* Bâtisseurs libres (d'après « En cours ») et ressources exposées au pillage (décisions du 2026-10-09) */
  var nb2=p.encours.filter(function(x){return x.t==='build'&&x.fin>Date.now();}).length;
  if(p.v.builders!=null&&nb2<p.v.builders){var lib=p.v.builders-nb2;W.unshift(row({act:'add-encours',data:'build',icon:'t-hammer',title:lib+' bâtisseur'+(lib>1?'s':'')+' libre'+(lib>1?'s':''),sub:'Aucune construction en cours pour '+(lib>1?'eux':'lui')+' · touche pour en ajouter une',go:true}));}
  var pg=pillage(p);if(pg&&pg.length)W.unshift(row({href:'#ma-ville-inventaire',icon:'i-shield',title:'Ressources exposées au pillage',sub:pg.join(' · ')+' au-dessus de la protection de la réserve '+p.v.entrepot+(JEU.entrepot.verifie?'':' (protection d’après un guide, non vérifiée)')}));
  $('#watchList').innerHTML=W.join('');$('#watchSec').hidden=!W.length;
  renderEnCours(p);renderRoutine();renderEvHome();
  /* Ma semaine : propre à chaque profil (le bilan du Principal s'affichait aussi sur les fermes, constaté le 2026-10-09) */
  var wk=!REEL&&WEEK[S.active];
  $('#weekList').innerHTML=wk?row({href:'#bilan',icon:'n-chart',title:esc(wk[0]),sub:esc(wk[1])}):vide('Pas encore de bilan\u00a0: il faut au moins deux relevés à quelques jours d’écart.');
}

var TYPES_EC={build:['a-build','Construction'],research:['a-research','Recherche'],train:['a-train','Entraînement'],heal:['a-heal','Soins']};
function renderEnCours(p){
  var L=p.encours.slice().sort(function(a,b){return a.fin-b.fin;}),now=Date.now();
  $('#ecList').innerHTML=L.length?L.map(function(x){var i=p.encours.indexOf(x),T=TYPES_EC[x.t]||TYPES_EC.build,fini=x.fin<=now;
    return row({act:'encours',data:i,icon:T[0],title:esc(x.q||T[1]),sub:T[1]+' · '+(fini?'terminé':'se termine dans '+fDuree(x.fin-now)+' ('+fQuand(x.fin)+')'),pill:fini?pill('ok','Terminé'):'',go:false});}).join(''):
    vide('Rien en cours. Ajoute ce qui se construit, se recherche ou s’entraîne : l’Accueil te dira quand c’est fini.');
}
function renderRoutine(){
  var I=S.routine.items,done=I.filter(function(x){return rtFait(x.id);}).length,rest=I.filter(function(x){return !rtFait(x.id);});
  var rz=prochainReset(),hz=heureReset();
  $('#rtCard').innerHTML=!I.length?vide('Ta liste est vide : touche « Tout voir » pour l’écrire.'):
    '<div class="ptop"><span><b>'+done+' sur '+I.length+'</b> faites aujourd’hui</span><span class="muted">Remise à zéro à '+hz+' (dans '+fDuree(rz-Date.now())+')</span></div><div class="bar"><div class="fill" style="width:'+Math.round(done/I.length*100)+'%"></div></div>'+
    (rest.length?'<div class="rt-list">'+rest.slice(0,3).map(rtItem).join('')+'</div>'+(rest.length>3?'<p class="rt-more">Et '+(rest.length-3)+' autre'+(rest.length>4?'s':'')+' à faire.</p>':''):'<p class="rt-ok">'+ic('i-check')+'Tout est fait pour aujourd’hui.</p>');
}
function rtItem(x){var f=rtFait(x.id);return '<button class="rt-item'+(f?' done':'')+'" type="button" data-act="rt-toggle" data-arg="'+esc(x.id)+'" aria-pressed="'+f+'"><span class="rt-box">'+(f?ic('i-check'):'')+'</span><span class="rc"><b>'+esc(x.t)+'</b>'+(x.d?'<small>'+esc(x.d)+'</small>':'')+'</span></button>';}
function evTexte(e,now){if(e.debut==null)return 'date inconnue';if(e.debut<=now&&(e.fin==null||e.fin>now))return e.fin?'en cours · se termine dans '+fDuree(e.fin-now):'en cours';
  if(e.fin!=null&&e.fin<=now)return 'terminé';return (e.st==='plan'?'vers le ':'')+fQuand(e.debut)+' · dans '+fDuree(e.debut-now);}
function evTri(L){var now=Date.now();return L.filter(function(e){return e.fin==null||e.fin>now;}).sort(function(a,b){var x=a.debut==null?1e15:a.debut,y=b.debut==null?1e15:b.debut;return x-y;});}
function renderEvHome(){var L=evTri(evList()).slice(0,3),now=Date.now();
  $('#evHome').innerHTML=L.length?L.map(function(e){var enc=e.debut!=null&&e.debut<=now;return '<a class="event'+(enc?' now':'')+'" href="#evenements"><span class="ri">'+ic(e.icon||'i-flag')+'</span><b>'+esc(e.n)+'</b><span>'+esc(evTexte(e,now))+'</span></a>';}).join(''):vide('Aucun événement pour l’instant. Ajoute ceux de ton royaume dans le calendrier.');}
/* L'Accueil se met à jour toutes les minutes (temps restants, routine) */
setInterval(function(){if(cur==='accueil'&&ORDER.length&&LOADED&&AUTH.user)renderHome();},60000);

/* ================= Fiche profil ================= */
function renderProfile(){
  var k=S.profileView&&P[S.profileView]?S.profileView:S.active;var p=P[k];if(!p)return;
  $('#pfTitle').textContent=p.name;$('#pfActive').hidden=k!==S.active;$('#pfActivate').hidden=k===S.active;
  $('#pfInfo').innerHTML=row({icon:'i-bolt',title:'Puissance',val:esc(p.power)})+row({icon:'i-tag',title:'Type',val:'<span style="font-size:17px">'+esc(p.type)+'</span>'})+
    row({icon:'i-id',title:'ID joueur RoK',val:'<span style="font-size:17px">'+(p.pid?esc(p.pid):'—')+'</span>'});
  $('#pfHist').innerHTML=row({icon:'i-journal',title:p.releves+' relevé'+(p.releves>1?'s':'')+', dont '+p.corr+' correction'+(p.corr>1?'s':'')})+
    row({icon:'i-lock',title:p.snaps+' instantané'+(p.snaps>1?'s':''),sub:'Copies figées de l’état du profil, utilisées par les bilans'});
  var o=ORDER.filter(function(x){return x!==k;});
  $('#pfOthers').innerHTML=o.length?o.map(function(x){return row({act:'view-profile',data:x,icon:P[x].icon,title:esc(P[x].name),sub:x===S.active?'Profil actif':esc(P[x].type)});}).join(''):row({title:'Aucun autre profil'});
}

/* ================= Ma ville ================= */
function valTxt(k,v){if(v==null)return null;if(Array.isArray(v))return vide4(v)?null:v.map(function(x){return x==null?'—':x;}).join(' · ');if(FIELDS[k].kind==='pct')return String(v).replace('.',',')+' %';return String(v);}
/* Contrôle d'une saisie : renvoie le message d'erreur, ou '' si la valeur est bonne. Le bonus accepte une décimale (42,5 %). */
function badValue(k,v){var f=FIELDS[k];var max=f.kind==='pct'?1000:(k==='builders'?5:(k==='vip'?19:25));
  if(f.kind==='pct'){if(!isFinite(v)||v<0||v>max||Math.round(v*10)!==v*10)return 'Saisis un pourcentage entre 0 et '+max+', avec une décimale au plus (ex. 42,5).';return '';}
  if(!isFinite(v)||v<0||Math.floor(v)!==v||v>max)return 'Saisis un nombre entier entre 0 et '+max+'.';return '';}
/* ================= Ma ville : inventaire et prochain Hôtel de ville (décisions de Mickaël du 2026-10-09) ================= */
var RN=[['food','r-food','Nourriture'],['wood','r-wood','Bois'],['stone','r-stone','Pierre'],['gold','r-gold','Or']];
var AN=[['build','a-build','Construction'],['research','a-research','Recherche'],['train','a-train','Entraînement'],['heal','a-heal','Soins'],['general','a-general','Généraux']];
var ITEMS={boosts:['i-bolt','Boosts'],equip:['n-helmet','Équipement'],attirail:['n-ring','Attirail'],autre:['n-gift','Autre']};
/* Coffres « Choisissez un » et packs de ressources : noms et contenus du jeu (RC_JEU.coffres, 2026-10-10) */
var JC=(window.RC_JEU&&window.RC_JEU.coffres)||{choix:[],packs:[]};
var COFFRES=JC.choix.map(function(o){return [o.id,o.nom,o];}),PACKS=JC.packs.map(function(o){return [o.id,'Pack '+o.nom,o];});
function contenuCof(o){return [['food','nourriture'],['wood','bois'],['stone','pierre'],['gold','or']].filter(function(x){return o[x[0]];}).map(function(x){return nb(o[x[0]]).replace(/ /g,'\u00a0')+'\u00a0'+x[1];}).join(', ');}
/* ce que valent les coffres (tout en nourriture) et les packs (en moyenne, ressource au hasard), en unités */
function valCof(o){return o.food||0;}
function fV(u){return u>=1e7?fM(u/1e6):fQte(u);}
function valPack(o){var L=['food','wood','stone','gold'].filter(function(k){return o[k];});return L.reduce(function(a,k){return a+o[k];},0)/(L.length||1);}
/* Objets des onglets Boosts, Équipement, Attirail, Autre (RC_JEU.objets, 2026-10-10) */
var JO=(window.RC_JEU&&window.RC_JEU.objets)||{onglets:{},qualites:[]},QL={};(JO.qualites||[]).forEach(function(q){QL[q[0]]=q;});
var ONG_OBJ={'Boosts':'boosts','Équipement':'equip','Attirail':'attirail','Autre':'autre'},OBJ_ID={};
Object.keys(JO.onglets||{}).forEach(function(t){JO.onglets[t].forEach(function(g){g.items.forEach(function(o){OBJ_ID[o.id]={o:o,g:g,t:t};});});});
function grpObj(id){var r=null;Object.keys(JO.onglets||{}).forEach(function(t){JO.onglets[t].forEach(function(g){if(g.id===id)r=g;});});return r;}
/* Points d'action : ce que rapportent les potions (demande de Mickaël du 2026-10-10). Règles du wiki (RC_JEU.pa), non vérifiées dans le jeu.
   Nombre de barbares en fourchette : du coût de la 1re attaque au coût le plus bas (attaques enchaînées). */
var JPA=(window.RC_JEU&&window.RC_JEU.pa)||null;
function paCalc(p){var g=grpObj('pa'),ob=p.objets||{};if(!JPA||!g||!g.items.some(function(o){return ob[o.id]!=null;}))return null;
  var T=g.items.reduce(function(a,o){return a+(ob[o.id]||0)*o.val;},0),r=p.paCalc||{},niv=r.niv||null,tal=!!r.talent;
  var c0=JPA.cout-(tal?JPA.talent:0),c1=c0-JPA.chaineMax,vip=p.v&&p.v.vip!=null?Math.min(p.v.vip,JPA.vipRecharge.length-1):null;
  var mult=vip!=null?JPA.vipRecharge[vip]:1,jour=86400/JPA.recharge*mult,n0=Math.floor(T/c0),n1=Math.floor(T/c1),xp=niv?JPA.exp(niv):null;
  return {T:T,niv:niv,talent:tal,c0:c0,c1:c1,n0:n0,n1:n1,xp:xp,e0:xp?n0*xp:null,e1:xp?n1*xp:null,vip:vip,mult:mult,jour:jour,jours:T/jour,
    plafond:JPA.plafond+(vip!=null?(JPA.vipPlafond[Math.min(vip,18)]||0):0)};}
function sumK(o,L){var n=null;L.forEach(function(x){if(o[x[0]]!=null)n=(n||0)+o[x[0]];});return n;}
/* 82 200 000 → « 82,2 M » ; 942 500 → « 942,5 K » ; 750 → « 750 » */
function fQte(u){function d(x){return String(Math.round(x*10)/10).replace('.',',');}return u>=1e6?d(u/1e6)+' M':u>=1e4?d(u/1e3)+' K':nb(u);}
/* durée d'accélérateur en minutes → libellé du jeu : 1 min … 60 min, 3 h, 8 h, 15 h, 24 h, 3 j … */
function fDur(m){return m<=60?m+' min':m<=1440?(m/60)+' h':(m/1440)+' j';}
function dateJour(){return new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'});}
/* « 81,8 M », « 81.8m », « 500 K », « 1 200 000 » → unités ; null si illisible */
function parseQte(t){t=String(t||'').replace(/[\s  ]/g,'').toLowerCase().replace(',','.');var m=t.match(/^(\d+(?:\.\d+)?)(k|m)?$/);if(!m)return null;
  var v=+m[1]*(m[2]==='m'?1e6:m[2]==='k'?1e3:1);return isFinite(v)&&v<1e12?Math.round(v):null;}
function parseEntier(t){t=String(t||'').replace(/[\s  ]/g,'');return /^\d{1,9}$/.test(t)?+t:null;}
/* Progression (proposée par Claude le 2026-10-09, « plus propre ») : carte de l'Hôtel de ville et de son prochain niveau */
function prochainNiv(p){var h=p.v.hdv;return h!=null&&h<25&&JEU.hdv?JEU.hdv.niveaux[h+1]||null:null;}
function manquants(p){var d=prochainNiv(p),M={};if(d)d.pre.forEach(function(x){var v=niv(p,x[0]);if(v==null||v<x[1])M[x[0]]=x[1];});return M;}
function heroHtml(p){
  var h=p.v.hdv,d=prochainNiv(p),nx='',ok=false;
  var cur='<a class="hh-cur" href="#valeur-hdv"><span class="hh-i">'+ic('i-hall')+'</span><span class="hh-l">Hôtel de ville</span><span class="hh-v'+(h==null?' unk':'')+'">'+(h==null?'—':h)+'</span>'+(h==null?'<span class="hh-s">à renseigner</span>':'')+'</a>';
  if(h==null)nx='<div class="hh-next"><h3>Prochain niveau</h3><p class="hh-t">Renseigne ton Hôtel de ville : tu verras ce qu’il te manque pour le niveau suivant.</p></div>';
  else if(h>=25){ok=true;nx='<div class="hh-next"><h3>Niveau maximum</h3><p class="hh-t">Ton Hôtel de ville est au niveau 25.</p></div>';}
  else if(d){
    var man=d.pre.filter(function(x){var v=niv(p,x[0]);return v==null||v<x[1];});ok=!man.length;
    var t=!d.pre.length?'Aucun prérequis : tu peux lancer l’amélioration.':man.length?'Il te manque : '+man.map(function(x){return FIELDS[x[0]].label+' '+x[1];}).join(', ')+'.':'Tous les prérequis sont faits : tu peux lancer l’amélioration.';
    var pres=d.pre.map(function(x){var v=niv(p,x[0]),fait=v!=null&&v>=x[1];
      return '<a class="pre '+(fait?'ok':v==null?'unk':'manque')+'" href="#valeur-'+x[0]+'"><span class="pre-i">'+ic(FIELDS[x[0]].icon)+'</span><span class="pre-t"><b>'+esc(FIELDS[x[0]].label)+' '+x[1]+'</b><small>'+(fait?'fait':v==null?'niveau non renseigné':'tu es au niveau '+v)+'</small></span>'+(fait?'<span class="pre-ck">'+ic('i-check')+'</span>':'')+'</a>';}).join('');
    var R=['de nourriture','de bois','de pierre','d’or'],c=d.cout.map(function(x,i){return x?fQte(x)+' '+R[i]:'';}).filter(Boolean);if(d.plus)c.push(d.plus);
    nx='<div class="hh-next"><h3>Vers le niveau '+(h+1)+'</h3><p class="hh-t">'+t+'</p>'+(pres?'<div class="pres">'+pres+'</div>':'')+
      '<p class="hh-c"><span><b>Coût</b> '+c.join(' · ')+'</span><span><b>Durée</b> '+d.duree+' sans bonus de vitesse</span></p></div>';}
  return '<div class="hdv-hero'+(ok?' ok':'')+'">'+cur+nx+'</div><p class="src">Prérequis, coûts et durées : guides et wiki du jeu, pas encore vérifiés dans le jeu.</p>';
}
/* Une tuile de bâtiment ou de réglage ; « manque » = niveau exigé pour le prochain Hôtel de ville */
function tuile(p,k,manque){var f=FIELDS[k],v=p.v[k],val=v,sub='',cls='';
  if(isMulti(k)){var L=(v||[]).filter(function(x){return x!=null;});val=L.length?Math.max.apply(null,L):null;
    if(L.length){var mi=Math.min.apply(null,L);sub=L.length<f.n?L.length+' sur '+f.n+' renseignés':mi===val?f.n+' au niveau '+val:'niveaux '+mi+' à '+val;}}
  if(val==null){cls=f.saison?' vide saison':' vide';sub=f.saison?'si tu l’as construit':'à renseigner';}else{if(f.kind==='pct')val=String(val).replace('.',',')+' %';if(f.fin)sub='retiré en fin de saison';}
  if(manque){cls+=' manque';sub='niveau '+manque+' requis';}
  return '<a class="btile'+cls+'" href="#valeur-'+k+'"><span class="bt-i">'+ic(f.icon)+'</span><span class="bt-v'+(f.kind==='civ'&&val!=null?' txt':'')+'">'+(val==null?'—':esc(val))+'</span>'+
    '<span class="bt-n">'+esc(isMulti(k)?f.pl:(f.court||f.label))+'</span>'+(sub?'<span class="bt-s">'+sub+'</span>':'')+'</a>';}
/* Saisie rapide : une ligne par valeur ; un bâtiment en plusieurs exemplaires a une case par exemplaire */
function qrow(p,k){var f=FIELDS[k],v=p.v[k],inp;
  if(f.kind==='civ')inp='<select data-qk="'+k+'"><option value="">— choisir</option>'+CIVS.map(function(c){return '<option'+(c===v?' selected':'')+'>'+c+'</option>';}).join('')+'</select>';
  else if(isMulti(k)){inp='';for(var i=0;i<f.n;i++)inp+='<input data-qk="'+k+'" data-qi="'+i+'" inputmode="numeric" value="'+(v&&v[i]!=null?v[i]:'')+'" placeholder="'+(i+1)+'" aria-label="'+esc(f.label)+' '+(i+1)+'">';}
  else inp='<input data-qk="'+k+'" inputmode="numeric" value="'+(v==null?'':v)+'" aria-label="'+esc(f.label)+'">';
  return '<div class="row qrow'+(isMulti(k)?' qmulti':'')+'" data-row="'+k+'"><span class="ri">'+ic(f.icon)+'</span><span class="rc"><b>'+esc(isMulti(k)?f.pl:f.label)+'</b><small class="qerr" hidden></small></span><span class="qin">'+inp+'</span></div>';}
function ordreBat(){var L=[];(JEU.batiments?JEU.batiments.groupes:[]).forEach(function(g){g[1].forEach(function(k){if(FIELDS[k])L.push(k);});});
  Object.keys(FIELDS).forEach(function(k){if(FIELDS[k].grp==='bld'&&L.indexOf(k)<0)L.push(k);});return L;}
/* Saisie de l'inventaire (version réelle comme exemples) : vide = pas renseigné, 0 = aucun. */
function numFld(id,label,v,dec,aide){return '<div class="fld"><label for="'+id+'">'+label+'</label>'+(aide?'<small class="fld-h">'+aide+'</small>':'')+'<input id="'+id+'" inputmode="'+(dec?'text':'numeric')+'" autocomplete="off" value="'+(v==null?'':esc(v))+'"'+(dec?' placeholder="ex. 81,8 M"':'')+'><small class="ferr" hidden></small></div>';}
var INV_INTRO='<p class="sh-intro">Recopie les nombres de ton Inventaire. Laisse vide ce que tu ne connais pas, mets 0 si tu n’en as pas.</p>';
function invSheet(k){
  var p=A();if(!p)return;S.invEdit=k;var acts=[['Annuler','close-sheet',''],['Enregistrer','inv-save','primary']],star=false;
  /* Famille d'objets des onglets Boosts, Équipement, Attirail, Autre : un champ par objet, avec le nom du jeu quand il est connu */
  if(String(k).indexOf('g:')===0){var g=grpObj(k.slice(2));if(!g)return;var ob=p.objets||{},etoile=false,nv=!!g.nv;
    var lab=function(o){if(g.type==='mat'||g.type==='qual'){var t=QL[o.c][1];return t.charAt(0).toUpperCase()+t.slice(1);}
      if(g.type==='qual3'){var u=QL[o.q][1];return u.charAt(0).toUpperCase()+u.slice(1)+' · '+({simples:'simple',bénies:'bénie',lots:'lot'})[o.f];}return o.l;};
    var F=g.items.map(function(o){if(!o.vu)etoile=true;if(o.nv)nv=true;return numFld('iv-'+o.id,lab(o)+(o.vu?'':' *'),ob[o.id],false,o.n&&!o.nv?'« '+o.n+' »':'');}).join('');
    openSheet(g.nom,INV_INTRO+(g.info?'<p class="sh-intro">'+g.info+'</p>':'')+'<div class="inv-grid deux">'+F+'</div>'+
      ((etoile||nv)?'<p class="sh-note">'+(etoile?'* Vu seulement sur le wiki du jeu, pas encore sur tes captures. ':'')+(nv?'Certains noms ne sont pas encore lus dans le jeu.':'')+'</p>':''),acts);return;}
  /* Réglages du calcul des points d'action : niveau des barbares attaqués et talent qui baisse le coût (2026-10-10) */
  if(k==='pacalc'){var rc=p.paCalc||{};
    openSheet('Calcul des points d’action','<p class="sh-intro">Pour estimer l’expérience que tes points d’action peuvent rapporter.</p>'+
      numFld('iv-niv','Niveau des barbares que tu attaques',rc.niv,false,'De 1 à '+JPA.nivMax+'. Le plus haut niveau que ton commandant bat facilement.')+
      '<div class="fld"><label>Ton commandant a le talent qui baisse le coût de '+JPA.talent+' points</label><small class="fld-h">Arbre Maintien de la paix (« Insight » en anglais, nom français à vérifier).</small>'+
      '<div class="chips" data-single id="paT">'+[['1','Oui'],['0','Non']].map(function(c){return '<button class="chip" type="button" data-v="'+c[0]+'" aria-pressed="'+((rc.talent?'1':'0')===c[0])+'">'+c[1]+'</button>';}).join('')+'</div></div>'+
      '<p class="sh-note">Coûts, expérience et recharge viennent du wiki du jeu (10 oct. 2026), pas encore vérifiés dans le jeu.</p>',acts);return;}
  /* Coffres et packs : une fenêtre chacun (remarque de Mickaël du 2026-10-10 : les deux tuiles ouvraient la même) */
  if(k==='coffres'){var cf=p.coffres||{};
    openSheet('Coffres « Choisissez un »',INV_INTRO+'<p class="sh-intro">Une ressource au choix à l’ouverture.</p><div class="inv-grid deux">'+COFFRES.map(function(x){return numFld('iv-'+x[0],x[1],cf[x[0]],false,contenuCof(x[2]));}).join('')+'</div>'+
      '<p class="sh-note">Contenus lus dans le jeu sur tes captures du 10 oct.</p>',acts);return;}
  if(k==='packs'){var cf2=p.coffres||{};
    openSheet('Packs de ressources',INV_INTRO+'<p class="sh-intro">Une ressource au hasard à l’ouverture.</p><div class="inv-grid deux">'+PACKS.map(function(x){return numFld('iv-'+x[0],x[1]+(x[2].vu?'':' *'),cf2[x[0]],false,contenuCof(x[2]));}).join('')+'</div>'+
      '<p class="sh-note">Contenus lus dans le jeu sur tes captures du 10 oct. * Vu seulement sur le wiki du jeu, pas encore sur tes captures.</p>',acts);return;}
  var ac=AN.filter(function(x){return x[0]===k;})[0];
  if(ac){var J=JEU.accelerateurs,L=k==='general'?J.universel:J.specialises,cur={};(p.acc[k]||[]).forEach(function(c){cur[Math.round(c[2]*60)]=c[1];});
    openSheet('Accélérateurs : '+ac[2].toLowerCase(),INV_INTRO+'<div class="inv-grid">'+L.map(function(m){var vu=J.vues.indexOf(m)>=0;if(!vu)star=true;return numFld('iv-'+m,fDur(m)+(vu?'':' *'),cur[m]);}).join('')+'</div>'+
      (star?'<p class="sh-note">* Durée indiquée par le wiki du jeu, pas encore vue sur tes captures.</p>':''),acts);return;}
  var gem=k==='gems',rn=RN.filter(function(x){return x[0]===k;})[0];if(!gem&&!rn)return;
  var r=gem?p.gemsIn:p.res[k],C=JEU.caisses[k],vues=C.vues==='toutes'?C.tailles:C.vues,cur2={};
  r.c.forEach(function(c){cur2[gem?c[2]:Math.round(c[2]*1e6)]=c[1];});
  var ville=r.v==null?'':gem?r.v:String(Math.round(r.v*1e3)/1e3).replace('.',',')+' M';
  openSheet(gem?'Gemmes':rn[2],INV_INTRO+numFld('iv-ville',gem?'Gemmes en ville (barre du haut du jeu)':'En ville (barre du haut du jeu)',ville,!gem)+
    '<h3 class="sh-sub">Caisses</h3><div class="inv-grid">'+C.tailles.map(function(t){var vu=vues.indexOf(t)>=0;if(!vu)star=true;return numFld('iv-'+t,'Caisses de '+nb(t)+(vu?'':' *'),cur2[t]);}).join('')+'</div>'+
    (star?'<p class="sh-note">* Taille indiquée par le wiki du jeu, pas encore vue sur tes captures.</p>':''),acts);
}
function invSave(){
  var p=A(),k=S.invEdit,bad=0,first=null;if(!p||!k)return;
  function lit(id,dec){var el=$('#'+id);if(!el)return null;var raw=el.value.trim(),err=el.parentNode.querySelector('.ferr');err.hidden=true;el.removeAttribute('aria-invalid');
    if(raw==='')return null;var v=dec?parseQte(raw):parseEntier(raw);
    if(v==null){err.textContent=dec?'Écris par exemple 81,8 M, 500 K ou 1 200 000.':'Écris un nombre entier (0 si tu n’en as pas).';err.hidden=false;el.setAttribute('aria-invalid','true');bad++;if(!first)first=el;}return v;}
  var nom;
  if(k==='pacalc'){var nv=lit('iv-niv');if(nv!=null&&(nv<1||nv>JPA.nivMax)){var el=$('#iv-niv'),er=el.parentNode.querySelector('.ferr');er.textContent='Un niveau de 1 à '+JPA.nivMax+'.';er.hidden=false;el.setAttribute('aria-invalid','true');el.focus();return;}
    if(bad){say('Le niveau est à corriger : rien n’a été enregistré.');$('#iv-niv').focus();return;}
    var tb=$('#paT [aria-pressed="true"]');p.paCalc={niv:nv,talent:!!(tb&&tb.dataset.v==='1')};closeSheet();say('Calcul des points d’action : réglages enregistrés.');refreshAll();return;}
  if(String(k).indexOf('g:')===0){var g2=grpObj(k.slice(2)),o3=Object.assign({},p.objets||{});g2.items.forEach(function(x){var v=lit('iv-'+x.id);if(v!=null)o3[x.id]=v;else delete o3[x.id];});if(!bad)p.objets=o3;nom=g2.nom+' : enregistré.';}
  else if(k==='coffres'||k==='packs'){var o=Object.assign({},p.coffres||{});(k==='coffres'?COFFRES:PACKS).forEach(function(x){var v=lit('iv-'+x[0]);if(v!=null)o[x[0]]=v;else delete o[x[0]];});if(!bad)p.coffres=o;nom=k==='coffres'?'Coffres enregistrés.':'Packs enregistrés.';}
  else if(AN.some(function(x){return x[0]===k;})){var J=JEU.accelerateurs,L=k==='general'?J.universel:J.specialises,a=[];
    L.forEach(function(m){var v=lit('iv-'+m);if(v!=null)a.push([fDur(m),v,m/60]);});if(!bad)p.acc[k]=a;nom='Accélérateurs enregistrés.';}
  else{var gem=k==='gems',C=JEU.caisses[k],r=gem?p.gemsIn:p.res[k],vl=lit('iv-ville',!gem),c=[];
    C.tailles.forEach(function(t){var v=lit('iv-'+t);if(v!=null)c.push([nb(t),v,gem?t:t/1e6]);});
    if(!bad){r.v=vl==null?null:gem?vl:vl/1e6;r.c=c;}nom=(gem?'Gemmes':RN.filter(function(x){return x[0]===k;})[0][2])+' : enregistré.';}
  if(bad){say(bad+' case'+(bad>1?'s':'')+' à corriger : rien n’a été enregistré.');if(first)first.focus();return;}
  p.invMaj=dateJour();closeSheet();say(nom);refreshAll();
}
function itemSheet(arg){
  var a=String(arg||'').split('|'),t=a[0],p=A();if(!p||!ITEMS[t])return;var L=p.items[t]||(p.items[t]=[]),i=a[1]==='new'?-1:+a[1],o=i>=0?L[i]:null;S.itemEdit={t:t,i:i};
  openSheet(t==='attirail'?(o?'Modifier la pièce':'Ajouter une pièce d’attirail'):(o?'Modifier : ':'Ajouter un objet : ')+ITEMS[t][1],
    '<div class="fld"><label for="itN">Nom (comme dans le jeu)</label><input id="itN" autocomplete="off" value="'+(o?esc(o.n):'')+'" placeholder="Ex. Livres d’expérience"><small class="ferr" hidden></small></div>'+
    numFld('itQ','Quantité',o?o.q:(t==='attirail'?1:null))+
    (t==='attirail'?'<div class="fld"><label>Qualité</label><div class="chips" data-single id="itC">'+[['b','Élite'],['p','Épique'],['o','Légendaire']].map(function(c){return '<button class="chip" type="button" data-c="'+c[0]+'" aria-pressed="'+((o&&o.c||'b')===c[0])+'">'+c[1]+'</button>';}).join('')+'</div></div>':''),
    o?[['Supprimer','item-del','danger'],['Annuler','close-sheet',''],['Enregistrer','item-save','primary']]:[['Annuler','close-sheet',''],['Ajouter','item-save','primary']]);
}
function itemSave(){
  var p=A(),e=S.itemEdit;if(!p||!e)return;var n=$('#itN').value.trim(),q=parseEntier($('#itQ').value),en=$('#itN').parentNode.querySelector('.ferr'),eq=$('#itQ').parentNode.querySelector('.ferr');
  en.hidden=eq.hidden=true;if(!n){en.textContent='Donne le nom de l’objet.';en.hidden=false;$('#itN').focus();return;}
  if(q==null){eq.textContent='Écris un nombre entier (0 si tu n’en as plus).';eq.hidden=false;$('#itQ').focus();return;}
  var L=p.items[e.t];if(L.some(function(x,j){return j!==e.i&&x.n.toLowerCase()===n.toLowerCase();})){en.textContent='Cet objet est déjà dans la liste.';en.hidden=false;return;}
  var nO={n:n,q:q};if(e.t==='attirail'){var cc=$('#itC [aria-pressed="true"]');nO.c=cc?cc.dataset.c:'b';}
  if(e.i>=0)L[e.i]=nO;else L.push(nO);p.invMaj=dateJour();closeSheet();say(e.i>=0?'Objet modifié.':'Objet ajouté.');refreshAll();
}
function itemDel(){var p=A(),e=S.itemEdit;if(!p||!e||e.i<0)return;var o=p.items[e.t][e.i];p.items[e.t].splice(e.i,1);p.invMaj=dateJour();closeSheet();say('« '+o.n+' » retiré de la liste.');refreshAll();}
function renderCity(){
  var p=A();if(!p)return;
  var SET=Object.keys(FIELDS).filter(function(k){return FIELDS[k].grp==='set';}),BLD=ordreBat(),MAN=manquants(p);
  $('#pgHero').innerHTML=heroHtml(p);
  if(S.quick){$('#gSet').innerHTML='<div class="list">'+SET.map(function(k){return qrow(p,k);}).join('')+'</div>';
    $('#gBld').innerHTML='<div class="list">'+BLD.map(function(k){return qrow(p,k);}).join('')+'</div>';}
  else{$('#gSet').innerHTML='<div class="btiles">'+SET.filter(function(k){return k!=='hdv';}).map(function(k){return tuile(p,k);}).join('')+'</div>';
    $('#gBld').innerHTML=(JEU.batiments?JEU.batiments.groupes:[['Bâtiments',BLD]]).map(function(g){var L=g[1].filter(function(k){return FIELDS[k];});
      return '<div class="bgrp'+(g[2]?' saison':'')+'"><h3>'+g[0]+'</h3>'+(g[2]?'<p class="bgrp-n">'+g[2]+'</p>':'')+'<div class="btiles">'+L.map(function(k){return tuile(p,k,MAN[k]);}).join('')+'</div></div>';}).join('');}
  var nu=BLD.filter(function(k){return !FIELDS[k].saison&&(isMulti(k)?vide4(p.v[k]):p.v[k]==null);}).length;
  $('#bldCount').textContent=nu?nu+' à renseigner':'Tous renseignés';
  $('#bldNote').textContent='Les bâtiments sans niveau (forgeron, magasin, monument…) ne sont pas suivis.';
  $('#quickBar').innerHTML=S.quick?'<div class="qbar"><span id="qCount">Saisie rapide</span><div class="chips" data-single id="qMotif" hidden><button class="chip" type="button" aria-pressed="true">Changé en jeu</button><button class="chip" type="button" aria-pressed="false">Erreur de saisie</button><button class="chip" type="button" aria-pressed="false">Autre</button></div><div class="btns" style="margin-top:0"><button class="btn" type="button" data-act="quick-cancel">Annuler</button><button class="btn primary" type="button" data-act="quick-save">Enregistrer</button></div></div>':'';
  $('#gResearch').innerHTML=!p.research.length?vide('Pas encore renseignées.'):p.research.map(function(r){return '<div class="prow"><div class="ptop"><span>'+r[0]+'</span><span>'+r[1]+' %</span></div><div class="bar"><div class="fill" style="width:'+r[1]+'%"></div></div></div>';}).join('');
  $('#gTroops').innerHTML=!p.troops.length?vide('Pas encore renseignées.'):p.troops.map(function(t){return row({icon:t[1],title:t[0],sub:'Niveau '+t[2],val:nb(t[3])});}).join('');
  // inventaire, rangé comme les onglets du jeu (décision du 2026-10-09)
  /* Inventaire, mélange des pistes A et C (choix de Mickaël du 2026-10-10) : grandes tuiles en haut (total, part en ville et en caisses),
     cartes du détail en dessous (une ligne par taille de caisse ou par durée, avec une barre). Toucher une tuile ou une carte ouvre la saisie. */
  var CHEV='<svg class="inv-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  function f1(m){return (Math.round(m*10)/10).toFixed(1).replace('.',',')+'\u00a0M';}
  function grand(o){var t=(o.v||0)+(o.c||0);
    return '<button class="it'+(o.cls?' '+o.cls:'')+(o.extra?' gx':'')+(o.val==='—'?' vide':'')+'" type="button" data-act="'+(o.act||'inv-edit')+'" data-arg="'+o.arg+'" style="--glow:'+o.glow+'">'+(o.extra?'<span class="gx-g">':'')+
      '<span class="it-h">'+ic(o.icon)+'<small>'+o.nom+'</small>'+CHEV+'<b>'+o.val+'</b></span>'+
      (o.lv!=null&&t>0?'<span class="it-bar"><i class="v" style="width:'+(o.v/t*100)+'%"></i><i class="c" style="width:'+(o.c/t*100)+'%"></i></span>'+
        '<span class="it-l"><span class="v">En ville <b>'+o.lv+'</b></span><span class="c">En caisses <b>'+o.lc+'</b></span></span>':'<span class="it-s">'+o.sub+'</span>')+
      (o.extra?'</span>'+o.extra:'')+(o.x||'')+'</button>';}
  /* large : carte seule sur sa rangée, sur toute la largeur, lignes sur 2 colonnes (choix de Mickaël du 2026-10-10 : pas de case vide) */
  function carte(arg,icon,nom,tot,L,vide,large,apres){var mx=Math.max.apply(null,L.map(function(x){return x[2];}).concat([0]));
    function ligne(x){return '<div class="ic-l"><span>'+x[0]+'</span><span class="ic-tr"><i style="width:'+Math.max(3,mx?x[2]/mx*100:0)+'%"></i></span><b>'+(x[3]||'×\u00a0'+nb(x[1]))+'</b></div>';}
    var moitie=Math.ceil(L.length/2);
    return '<section class="ic'+(large?' large':'')+'"><button class="ic-h" type="button" data-act="inv-edit" data-arg="'+arg+'" aria-label="Modifier : '+nom+'">'+ic(icon)+'<b>'+nom+'</b><span>'+tot+'</span>'+ic('i-pencil')+'</button>'+
      (!L.length?'<p class="ic-vide">'+vide+'</p>':large&&L.length>1?'<div class="ic-cols"><div>'+L.slice(0,moitie).map(ligne).join('')+'</div><div>'+L.slice(moitie).map(ligne).join('')+'</div></div>':L.map(ligne).join(''))+(apres||'')+'</section>';}
  var GLOW={food:'#d8b24c33',wood:'#c27a4a33',stone:'#a9bdd52e',gold:'#f3d98233',gems:'#ef6a7a2e',build:'#d8a24c2e',research:'#8db6f22e',train:'#ef8a742e',heal:'#3ecf8e26',general:'#b99af02e'};
  function cais(r){return r.c.reduce(function(a,c){return a+c[1]*c[2];},0);}
  var resT=RN.map(function(x){var r=p.res[x[0]],c=cais(r),has=r.v!=null||r.c.length>0;
    return grand({arg:x[0],icon:x[1],nom:x[2],val:has?fM(resTot(r)):'—',sub:'À renseigner',v:r.v||0,c:c,lv:has?(r.v!=null?f1(r.v):'—'):null,lc:r.c.length?fM(c):'—',glow:GLOW[x[0]]});}).join('');
  var g=p.gemsIn,gc=g.c.reduce(function(a,c){return a+c[1]*c[2];},0),gHas=g.v!=null||g.c.length>0;
  /* Gemmes, Coffres et Packs : 3 tuiles côte à côte (proposition 1, choix de Mickaël du 2026-10-10 : la tuile Gemmes seule « faisait vide ») */
  var resT3=grand({arg:'gems',icon:'r-gem',nom:'Gemmes',val:gHas?nb((g.v||0)+gc):'—',sub:gHas?'En ville':'À renseigner',v:g.v||0,c:gc,lv:g.c.length?(g.v!=null?nb(g.v):'—'):null,lc:nb(gc),glow:GLOW.gems});
  var cf=p.coffres||{},nC=sumK(cf,COFFRES),nPk=sumK(cf,PACKS);
  var vC=COFFRES.reduce(function(a,x){return a+(cf[x[0]]||0)*valCof(x[2]);},0),vPk=PACKS.reduce(function(a,x){return a+(cf[x[0]]||0)*valPack(x[2]);},0);
  resT3+=grand({arg:'coffres',icon:'p-chest',nom:'Coffres',val:nC==null?'—':nb(nC),sub:nC==null?'« Choisissez un » · à renseigner':'Au choix · jusqu’à '+fV(vC)+' de nourriture',glow:'#d8b24c22'})+
    grand({arg:'packs',icon:'p-pack',nom:'Packs',val:nPk==null?'—':nb(nPk),sub:nPk==null?'De ressources · à renseigner':'Au hasard · ≈ '+fV(vPk)+' en moyenne',glow:'#c27a4a22'});
  var resC=RN.map(function(x){var r=p.res[x[0]];return carte(x[0],x[1],x[2]+' · caisses',r.c.length?fM(cais(r)):'—',r.c.map(function(c){return [c[0],c[1],c[1]*c[2]];}),'Aucune caisse renseignée');}).join('')+
    (g.c.length?carte('gems','r-gem','Gemmes · caisses',nb(gc),g.c.map(function(c){return [c[0],c[1],c[1]*c[2]];}),''):'')+
    carte('coffres','p-chest','Coffres « Choisissez un »',nC==null?'—':'jusqu’à '+fV(vC),COFFRES.filter(function(x){return cf[x[0]];}).map(function(x){return [x[1],cf[x[0]],cf[x[0]]*valCof(x[2])];}),'Aucun coffre renseigné')+
    carte('packs','p-pack','Packs de ressources',nPk==null?'—':'≈ '+fV(vPk),PACKS.filter(function(x){return cf[x[0]];}).map(function(x){return [x[2].nom,cf[x[0]],cf[x[0]]*valPack(x[2])];}),'Aucun pack renseigné',(RN.length+(g.c.length?1:0)+2)%2===1);
  $('#gRes').innerHTML='<div class="it-grid">'+resT+'</div><div class="it-row3">'+resT3+'</div>'+
    '<h3 class="inv-h3">Détail des caisses</h3><div class="ic-grid">'+resC+'</div>';
  /* Généraux : la tuile donne aussi, pour chaque type, le temps total généraux compris (proposition 2, choix de Mickaël du 2026-10-10) */
  var gA=p.acc.general||[],gT=accTot(gA),avecGen=gA.length?'<span class="gx-l"><span class="gx-t">Avec les généraux</span>'+AN.filter(function(x){return x[0]!=='general';}).map(function(x){
    return '<span class="gx-i">'+ic(x[1])+'<span>'+x[2]+'</span><b>'+fH(accTot(p.acc[x[0]]||[])+gT)+'</b></span>';}).join('')+'</span>':'';
  var accT=AN.map(function(x){var a=p.acc[x[0]]||[],n=a.reduce(function(s,c){return s+c[1];},0),gen=x[0]==='general';
    return grand({arg:x[0],icon:x[1],nom:x[2],cls:gen?'large':'',extra:gen?avecGen:'',val:a.length?fH(accTot(a)):'—',sub:a.length?nb(n)+' accélérateur'+(n>1?'s':'')+(gen?' · utilisables partout':''):(REEL?'À renseigner':'Aucun'),glow:GLOW[x[0]]});}).join('');
  var accC=AN.map(function(x,k){var a=p.acc[x[0]]||[];return carte(x[0],x[1],x[2],a.length?fH(accTot(a)):'—',a.map(function(c){return [c[0],c[1],c[1]*c[2]];}),REEL?'Pas encore renseigné':'Aucun',AN.length%2===1&&k===AN.length-1);}).join('');
  $('#gAcc').innerHTML='<div class="it-grid">'+accT+'</div><h3 class="inv-h3">Détail par durée</h3><div class="ic-grid">'+accC+'</div>';
  /* Onglets Boosts, Équipement, Attirail, Autre (2026-10-10, même modèle que Ressources et Accélérateurs) : une tuile par famille
     d'objets du jeu (RC_JEU.objets), détail en dessous ; ce qui n'est pas dans la liste du jeu reste dans « Autres objets ». */
  var it=ITEMS[S.inv];if(it){var L=(p.items&&p.items[S.inv])||[],ob=p.objets||{},att=S.inv==='attirail';
    $('#itemsTitle').textContent=it[1];$('#itemsMaj').textContent=p.invMaj?'Mis à jour le '+p.invMaj:'';
    function qn(o){return ob[o.id]||0;}
    function vq(X){return X.length?'<span class="vq">'+X.map(function(x){return '<span>'+(x.c?'<i class="dot '+x.c+'"></i>':'')+x.l+' <b>'+(x.b!=null?x.b:'×\u00a0'+nb(x.q))+'</b></span>';}).join('')+'</span>':'';}
    /* Carte Points d'action : ce qu'ils rapportent, sous le détail des potions */
    function paBloc(c){function l(t,d,v){return '<div class="pa-l"><span>'+t+(d?'<small>'+d+'</small>':'')+'</span><b>'+v+'</b></div>';}
      return '<div class="pa-c"><h4>Ce qu’ils rapportent</h4>'+
        l('Barbares',c.c0+' points la première attaque, '+c.c1+' en enchaînant',nb(c.n0)+' à '+nb(c.n1))+
        l('EXP par commandant',c.niv?'barbares niv. '+c.niv+' · '+nb(c.xp)+' EXP chacun · autant en tomes dans le butin':'choisis le niveau des barbares que tu attaques',
          c.niv?fQte(c.e0)+' à '+fQte(c.e1):'—')+
        l('Recharge naturelle',c.vip!=null?'VIP '+c.vip+' : ×'+String(c.mult).replace('.',',')+' · plafond '+nb(c.plafond)+' points':'sans bonus VIP · plafond '+nb(c.plafond)+' points','≈ '+nb(Math.round(c.jour/10)*10)+' / jour')+
        l('Tes potions valent','','≈ '+nb(c.jours)+' jours de recharge')+
        '<button class="pa-reg" type="button" data-act="inv-edit" data-arg="pacalc">'+ic('i-pencil')+'<span>Barbares '+(c.niv?'niv. '+c.niv:': niveau ?')+' · talent −'+JPA.talent+' : '+(c.talent?'oui':'non')+'</span></button>'+
        '<p class="pa-n">Règles du wiki du jeu, pas encore vérifiées dans le jeu. Bonus d’expérience (talents, Lohar) non comptés.</p></div>';}
    function tuileObj(g,cls){var has=g.items.some(function(o){return ob[o.id]!=null;}),T=g.items.filter(function(o){return qn(o)>0;}),n=T.reduce(function(a,o){return a+qn(o);},0),val='—',sub='À renseigner',x='';
      if(has){sub='';
        if(g.type==='duree'){val=n?fH(T.reduce(function(a,o){return a+qn(o)*o.h;},0)):'0 h';sub=nb(n)+' objet'+(n>1?'s':'');x=vq(T.map(function(o){return {l:o.l,q:qn(o)};}));}
        else if(g.type==='troupes'){var cap=T.reduce(function(a,o){return a+qn(o)*(o.cap||0);},0);val=cap?'+'+nb(cap):nb(n);sub=cap?'capacité d’entraînement en plus':nb(n)+' objet'+(n>1?'s':'');x=vq(T.map(function(o){return {l:o.l,q:qn(o)};}));}
        else if(g.type==='mat'){var Q={};g.items.forEach(function(o){Q[o.c]=qn(o);});var lg=Math.floor((Math.floor((Math.floor((Math.floor(Q.g/4)+Q.v)/4)+Q.b)/4)+Q.p)/4)+Q.o;
          val='≈\u00a0'+nb(lg)+' légendaire'+(lg>1?'s':'');sub='si tu combines tout (4 = 1 de la qualité au-dessus)';
          x='<span class="q5">'+g.items.map(function(o){return '<span class="'+o.c+(qn(o)?'':' z')+'"><b>'+nb(qn(o))+'</b>'+QL[o.c][1]+'</span>';}).join('')+'</span>';}
        else if(g.type==='qual'||g.type==='qual3'){var P={};g.items.forEach(function(o){var q=o.q||o.c;P[q]=(P[q]||0)+qn(o);});var ord=['o','p','b','v','g'].filter(function(q){return P[q];});
          var pl=function(q){return QL[q][g.fem?3:2];};
          if(g.top&&ord.length){val=nb(P[ord[0]])+' '+pl(ord[0]);sub=ord.length>1?nb(n)+' en tout':'';x=vq(ord.slice(1).map(function(q){return {c:q,l:pl(q),b:nb(P[q])};}));}
          else{val=nb(n);x=vq(ord.map(function(q){return {c:q,l:pl(q),b:nb(P[q])};}));}}
        else if(g.type==='valeur'){var tot=T.reduce(function(a,o){return a+qn(o)*o.val;},0);val=(tot>=1e6?String(Math.round(tot/1e5)/10).replace('.',',')+'\u00a0M':nb(tot))+' '+g.unite;
          sub=nb(n)+' objet'+(n>1?'s':'');x=vq(T.slice().sort(function(a,b){return b.val-a.val;}).slice(0,4).map(function(o){return {l:o.l,q:qn(o)};}));
          var pc=g.id==='pa'?paCalc(p):null;
          if(pc&&pc.T){sub='jusqu’à ≈ '+nb(pc.n1)+' barbares';
            x=vq([{l:'EXP par commandant',b:pc.e1?'≈ '+fQte(pc.e1):'niveau ?'},{l:'Recharge',b:'≈ '+nb(pc.jours)+' j'}]);}}
        else if(g.vals){val=T.map(function(o){return nb(qn(o));}).join(' · ')||'0';x=vq(T.map(function(o){return {l:o.l,q:qn(o)};}));}
        else if(g.sortes){val=nb(T.length)+' sorte'+(T.length>1?'s':'');sub='à dépenser pendant les événements';x=vq(T.map(function(o){return {l:o.l,q:qn(o)};}));}
        else if(T.some(function(o){return o.grp;})){var Gp={};T.forEach(function(o){Gp[o.grp]=(Gp[o.grp]||0)+qn(o);});val=nb(n);sub=g.carte?'le détail est en bas':'';x=vq(Object.keys(Gp).map(function(k){return {l:k,q:Gp[k]};}));}
        else{val=nb(n);x=vq(T.map(function(o){return {l:o.l,q:qn(o)};}));}}
      /* unité en plus petit sur téléphone (« 12 légendaires » était coupé, 2026-10-10) */
      var mU=/^(.*\d(?:[\s\u00a0][KM])?)[\s\u00a0](\D+)$/.exec(val);if(mU)val=mU[1]+'<span class="u"> '+mU[2]+'</span>';
      return grand({arg:'g:'+g.id,icon:g.icone,nom:g.nom,val:val,sub:sub,x:x,glow:g.glow||'#d8b24c1a',cls:(cls||'')+(g.type==='mat'?' q5t':'')});}
    var G=(JO.onglets&&JO.onglets[S.inv])||[],grands=G.filter(function(g){return !g.petit;}),petits=G.filter(function(g){return g.petit;}),html='';
    if(att){var nP=L.reduce(function(a,o){return a+(o.q||1);},0);
      html+='<div class="it-grid">'+grand({act:'item-edit',arg:'attirail|new',icon:'n-ring',nom:'Pièces d’attirail',val:nb(nP)+' / 2\u00a0000',sub:nP?'place dans ton inventaire':'Ajoute tes pièces',glow:'#8db6f222',
        x:vq(L.map(function(o){return {c:o.c,l:esc(o.n),b:''};}))})+grands.map(function(g){return tuileObj(g);}).join('')+'</div>';}
    else html+='<div class="it-grid'+(S.inv==='boosts'?' trois':'')+'">'+grands.map(function(g,k){return tuileObj(g,grands.length%2&&k===grands.length-1&&S.inv!=='boosts'?'large':'');}).join('')+'</div>';
    /* petites tuiles : la dernière rangée remplit toute la largeur (4 colonnes sur tablette, 2 sur téléphone ; pas de case vide) */
    if(petits.length){var np=petits.length,r4=np%4,r2=np%2;
      html+='<div class="it-petits">'+petits.map(function(g,k){var c='petit',fin=np-1-k;
        if(r4===1&&fin===0)c+=' s4-4';else if(r4===2&&fin<2)c+=' s4-2';else if(r4===3&&fin===0)c+=' s4-2';
        if(r2===1&&fin===0)c+=' s2-2';return tuileObj(g,c);}).join('')+'</div>';}
    var C=G.filter(function(g){return g.carte;}).map(function(g,k,A2){var T=g.items.filter(function(o){return qn(o)>0;}),lines;
      if(g.type==='qual3'){lines=['o','p','b','v'].map(function(q){var f=g.items.filter(function(o){return o.q===q;}),t=f.reduce(function(a,o){return a+qn(o);},0);
        return t?[QL[q][3].charAt(0).toUpperCase()+QL[q][3].slice(1),t,t,f.map(function(o){return nb(qn(o));}).join(' · ')]:null;}).filter(Boolean);}
      else if(g.type==='valeur')lines=T.map(function(o){return [o.l,qn(o),qn(o)*o.val];});
      else lines=T.map(function(o){return [o.l,qn(o),qn(o)];});
      var tot=g.type==='qual3'?'simples · bénies · lots':g.type==='valeur'?'':nb(T.reduce(function(a,o){return a+qn(o);},0));
      var pc=g.id==='pa'?paCalc(p):null;if(pc)tot=nb(pc.T)+' points';
      return carte('g:'+g.id,g.icone,g.nom,tot,lines,'Rien de renseigné',A2.length%2===1&&k===A2.length-1,pc&&pc.T?paBloc(pc):'');});
    if(C.length)html+='<h3 class="inv-h3">Détail</h3><div class="ic-grid">'+C.join('')+'</div>';
    $('#gObj').innerHTML=html;
    $('#itemsSub').textContent=att?'Tes pièces d’attirail':'Autres objets';
    $('#gItems').innerHTML=(L.length?'<div class="list">'+L.map(function(o,i){return row({act:'item-edit',data:S.inv+'|'+i,icon:it[0],title:esc(o.n),sub:att&&o.c&&QL[o.c]?QL[o.c][1].charAt(0).toUpperCase()+QL[o.c][1].slice(1):'',val:nb(o.q)});}).join('')+'</div>':
      vide(att?'Aucune pièce renseignée.':'Rien d’autre. Ajoute ici un objet qui n’est pas dans les tuiles.'))+
      '<div class="btns"><button class="btn" type="button" data-act="item-edit" data-arg="'+S.inv+'|new">'+ic('i-plus')+(att?'Ajouter une pièce':'Ajouter un objet')+'</button></div>';}
  $('#lastImport').textContent=REEL?(p.invMaj?'Mis à jour le '+p.invMaj:''):S.active==='main'?(S.imported?'Import d’aujourd’hui':'Import du 2 oct.'):'';
  $$('#invChips .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.inv===S.inv));});
  $$('[data-invsec]').forEach(function(s){s.hidden=s.dataset.invsec!==(ITEMS[S.inv]?'items':S.inv);});
  // commandants
  var list=CMD.filter(function(c){return S.cmdF==='all'||c.t.indexOf(S.cmdF)>=0;});
  $('#cmdGrid').innerHTML=list.length?list.map(function(c){return '<div class="cmd"><div class="cmd-h"><span class="av'+(c.r==='epic'?' epic':'')+'">'+c.n[0]+'</span><span><b>'+esc(c.n)+'</b><small class="'+(c.r==='epic'?'epi':'leg')+'">'+(c.r==='epic'?'Épique':'Légendaire')+' · '+c.role+'</small></span></div><div class="meta"><span>Niv. '+c.lvl+'</span>'+c.sk+'</div></div>';}).join(''):(CMD.length?'<p class="muted">Aucun commandant pour ce filtre.</p>':vide('Aucun commandant renseigné pour l’instant.'));
  $$('#cmdChips .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.f===S.cmdF));});
  // équipements, formations
  $('#eqList').innerHTML=!EQ.length?vide('Aucune pièce d’équipement renseignée.'):EQ.map(function(e,i){return row({act:'eq',data:i,icon:e[0],title:e[1],sub:'<span class="'+e[2]+'">'+e[3]+'</span>'});}).join('');
  $('#formList').innerHTML=!Object.keys(FORMS).length?vide('Aucune formation renseignée.'):Object.keys(FORMS).map(function(k){return row({act:'form',data:k,icon:FORMS[k][0],title:k,sub:'Débloquée · '+FORMS[k][1],cls:k===S.form?'sel':''});}).join('');
  $('#formTitle').textContent=FORMS[S.form]?'Effets de la formation '+S.form:'Effets';
  $('#formFx').innerHTML=!FORMS[S.form]?'<li><span>Choisis une formation.</span></li>':FORMS[S.form][2].map(function(x){return '<li><span>'+x[0]+'</span><b'+(x[1]==='—'?' class="unk"':'')+'>'+x[1]+'</b></li>';}).join('');
}
/* Saisie rapide : chaque ligne compare ce qui est écrit à la valeur enregistrée (une case vide ne change rien). */
function qVal(k,raw){var f=FIELDS[k];if(f.kind==='civ')return {v:raw};var v=Number(raw.replace(/\s/g,'').replace(',','.'));var e=badValue(k,v);return e?{e:e}:{v:v};}
function qLigne(p,r){var k=r.dataset.row,old=p.v[k];
  if(isMulti(k)){var o=old||[],arr=o.slice(),chg=false,e='';while(arr.length<FIELDS[k].n)arr.push(null);
    $$('[data-qk]',r).forEach(function(el){var raw=el.value.trim(),i=+el.dataset.qi;if(raw===''||String(o[i]==null?'':o[i])===raw)return;var x=qVal(k,raw);if(x.e){e=x.e;return;}arr[i]=x.v;chg=true;});
    return {k:k,chg:chg||!!e,e:e,v:arr,corr:!vide4(old)};}
  var raw=$('[data-qk]',r).value.trim();if(raw===''||String(old==null?'':old)===raw)return {k:k,chg:false};var x=qVal(k,raw);return {k:k,chg:true,e:x.e,v:x.v,corr:old!=null};}
function quickCount(){var p=A(),n=0,corr=0;$$('.qrow').forEach(function(r){var l=qLigne(p,r);if(l.chg){n++;if(l.corr)corr++;}});
  var qc=$('#qCount');if(qc)qc.textContent=n?n+' valeur'+(n>1?'s':'')+' modifiée'+(n>1?'s':''):'Saisie rapide';var m=$('#qMotif');if(m)m.hidden=!corr;}
function quickSave(){
  var p=A(),ok=0,bad=0;var motif=$('#qMotif .chip[aria-pressed="true"]');motif=motif?motif.textContent:'';
  $$('.qrow').forEach(function(r){var err=$('.qerr',r),l=qLigne(p,r);err.hidden=true;r.classList.remove('err');if(!l.chg)return;
    if(l.e){err.textContent=l.e;err.hidden=false;r.classList.add('err');bad++;return;}
    p.h[l.k].unshift({v:l.v,d:TODAY,m:l.corr?motif:'',src:'Saisie'});if(l.corr)p.corr++;p.releves++;p.v[l.k]=l.v;ok++;});
  if(bad){say(ok+' valeur'+(ok>1?'s':'')+' enregistrée'+(ok>1?'s':'')+'. '+bad+' ligne'+(bad>1?'s':'')+' à corriger.');
    $$('.qrow').forEach(function(r){if(r.classList.contains('err'))return;var k=r.dataset.row,v=p.v[k];$$('[data-qk]',r).forEach(function(el){var x=isMulti(k)?(v?v[+el.dataset.qi]:null):v;el.value=x==null?'':x;});});refreshAll(true);return;}
  S.quick=false;say(ok+' valeur'+(ok>1?'s':'')+' enregistrée'+(ok>1?'s':'')+'.');refreshAll();
}

/* ================= Valeur ================= */
function renderValue(){
  var p=A();if(!p)return;var k=S.valKey,f=FIELDS[k],v=p.v[k],t=valTxt(k,v);
  $('#valTitle').textContent=nomPl(k);$('#valLabel').textContent=KIND[f.kind][0];
  $('#valBig').textContent=t==null?'—':t;$('#valBig').classList.toggle('unk',t==null);
  $('#valBtn').innerHTML=ic('i-pencil')+(t==null?'Renseigner':'Corriger');
  var h=p.h[k];
  $('#valHist').innerHTML=h.length?h.map(function(x){return row({title:esc(valTxt(k,x.v)),sub:x.d+(x.m?' · '+x.m:''),pill:pill(x.src==='Import'?'wip':'ok',x.src)});}).join(''):row({title:'Aucun relevé',sub:'Cette valeur n’a jamais été renseignée'});
}
function correctSheet(){
  var p=A(),k=S.valKey,f=FIELDS[k],v=p.v[k];
  if(isMulti(k)){var D=(JEU.batiments&&JEU.batiments.instances[k])||[],vd=vide4(v),h='';
    for(var i=0;i<f.n;i++)h+='<div class="fld"><label for="cv'+i+'">'+esc(f.label)+' '+(i+1)+(D[i]>1?' <span class="muted">(Hôtel de ville '+D[i]+')</span>':'')+'</label><input id="cv'+i+'" inputmode="numeric" value="'+(v&&v[i]!=null?v[i]:'')+'"></div>';
    openSheet((vd?'Renseigner : ':'Corriger : ')+f.pl,'<p class="sh-intro">Un niveau par '+esc(f.label.toLowerCase())+'. Laisse vide celles que tu n’as pas encore : l’Hôtel de ville indiqué les débloque.</p><div class="inv-grid deux">'+h+'</div><small class="ferr" id="cvErr" hidden></small>'+
      '<div class="fld"><label for="cd">Date du relevé</label><input id="cd" value="'+TODAY+'"></div>'+
      (!vd?'<div class="fld"><label>Motif</label><div class="chips" data-single id="cm"><button class="chip" type="button" aria-pressed="true">Changé en jeu</button><button class="chip" type="button" aria-pressed="false">Erreur de saisie</button><button class="chip" type="button" aria-pressed="false">Autre</button></div></div>':''),
      [['Annuler','close-sheet',''],[vd?'Enregistrer':'Enregistrer la correction','save-correct','primary']]);return;}
  var inp=f.kind==='civ'?'<select id="cv">'+'<option value="">— choisir</option>'+CIVS.map(function(c){return '<option'+(c===v?' selected':'')+'>'+c+'</option>';}).join('')+'</select>':'<input id="cv" inputmode="numeric" value="'+(v==null?'':v)+'">';
  openSheet((v==null?'Renseigner : ':'Corriger : ')+f.label,
    '<div class="fld"><label for="cv">'+KIND[f.kind][v==null?0:1]+'</label>'+inp+'<small class="ferr" id="cvErr" hidden></small></div>'+
    '<div class="fld"><label for="cd">Date du relevé</label><input id="cd" value="'+TODAY+'"></div>'+
    (v!=null?'<div class="fld"><label>Motif</label><div class="chips" data-single id="cm"><button class="chip" type="button" aria-pressed="true">Changé en jeu</button><button class="chip" type="button" aria-pressed="false">Erreur de saisie</button><button class="chip" type="button" aria-pressed="false">Autre</button></div></div>':''),
    [['Annuler','close-sheet',''],[v==null?'Enregistrer':'Enregistrer la correction','save-correct','primary']]);
}
function saveCorrect(){
  if(isMulti(S.valKey))return saveCorrectMulti();
  var p=A(),k=S.valKey,f=FIELDS[k],old=p.v[k],raw=$('#cv').value.trim(),err=$('#cvErr');err.hidden=true;
  if(raw===''){err.textContent='Saisis une valeur.';err.hidden=false;return;}
  var v=raw;if(f.kind!=='civ'){v=Number(raw.replace(/\s/g,'').replace(',','.'));var max=f.kind==='pct'?1000:(k==='builders'?5:(k==='vip'?19:25));
    var be=badValue(k,v);if(be){err.textContent=be;err.hidden=false;return;}}
  if(old!=null&&String(old)===String(v)){err.textContent='C’est déjà la valeur enregistrée.';err.hidden=false;return;}
  var m=$('#cm .chip[aria-pressed="true"]');
  p.h[k].unshift({v:v,d:$('#cd').value||TODAY,m:old!=null&&m?m.textContent:'',src:'Saisie'});p.v[k]=v;p.releves++;if(old!=null)p.corr++;
  closeSheet();say(old==null?'Valeur enregistrée.':'Correction enregistrée. L’ancienne valeur reste dans l’historique.');refreshAll();
}

function saveCorrectMulti(){
  var p=A(),k=S.valKey,f=FIELDS[k],old=p.v[k],err=$('#cvErr'),arr=[],bad='';err.hidden=true;
  for(var i=0;i<f.n;i++){var raw=$('#cv'+i).value.trim();if(raw===''){arr.push(null);continue;}var x=qVal(k,raw);if(x.e){bad=f.label+' '+(i+1)+' : '+x.e;break;}arr.push(x.v);}
  if(bad){err.textContent=bad;err.hidden=false;return;}
  if(vide4(arr)){err.textContent='Saisis au moins un niveau.';err.hidden=false;return;}
  if(!vide4(old)&&JSON.stringify(old)===JSON.stringify(arr)){err.textContent='Ce sont déjà les niveaux enregistrés.';err.hidden=false;return;}
  var m=$('#cm .chip[aria-pressed="true"]'),vd=vide4(old);
  p.h[k].unshift({v:arr,d:$('#cd').value||TODAY,m:!vd&&m?m.textContent:'',src:'Saisie'});p.v[k]=arr;p.releves++;if(!vd)p.corr++;
  closeSheet();say(vd?'Niveaux enregistrés.':'Correction enregistrée. Les anciens niveaux restent dans l’historique.');refreshAll();
}

/* ================= Import ================= */
var step=1,anaTimer=null;
function showStep(n){step=n;$('#stepper').hidden=n===1;$$('[data-steppanel]').forEach(function(p){p.hidden=+p.dataset.steppanel!==n;});
  $$('#stepper .sp').forEach(function(b){var k=+b.dataset.sp;b.classList.toggle('done',k<n);if(k===n)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});}
/* Écran Importer redessiné le 2026-10-10 (demande de Mickaël, proposé par Claude) */
/* Écran Importer, piste A (choisie par Mickaël le 2026-10-10) : un seul bouton, puis les miniatures et « Lire » */
function renderShots(){
  var n=S.shots.length,vraies=S.shots.filter(function(x){return x.file;}).length;
  $('#impVide').hidden=!!n;$('#impPret').hidden=!n;$('#impFootCost').hidden=!!n;
  $('#shots').innerHTML=S.shots.map(function(s,i){return '<figure class="shot'+(s.url?' real':'')+'">'+(s.url?'<img src="'+s.url+'" alt="Capture '+(i+1)+'">':'')+'<span class="shot-n">'+(i+1)+'</span>'+
      (s.file?'<button class="shot-x" type="button" data-act="shot-rm" data-arg="'+i+'" aria-label="Retirer la capture '+(i+1)+'">✕</button>':'')+'</figure>';}).join('')+
    (vraies&&vraies<20?'<label class="shot add" for="pickShots">'+ic('i-plus')+'<span>Ajouter</span></label>':'');
  var sec=Math.ceil(vraies/3)*15;
  $('#impCount').textContent=!vraies?n+' captures d’exemple':n+' capture'+(n>1?'s':'')+' prête'+(n>1?'s':'');
  $('#impGoT').textContent=vraies?'Lecture par Claude':'Lecture simulée';
  $('#impCost').textContent=!vraies?'Gratuite : rien n’est envoyé':!SITE_PUB?'La lecture marche sur la maquette publiée.':
    'Environ '+(sec<60?sec+'\u00a0s':Math.round(sec/60)+'\u00a0min')+' · environ '+(vraies*LECT_PRIX).toFixed(2).replace('.',',')+'\u00a0$';
  var b=$('#analyseBtn');b.disabled=!n;b.textContent=n?'Lire '+(n>1?'les '+n+' captures':'la capture'):'Lire';
}
/* Avancement capture par capture pendant la lecture */
var ETAT_TXT={attente:'En attente',envoi:'Envoi…',lecture:'Lecture par Claude…',ok:'Lue',echec:'Non lue'};
function renderAnaList(J){var box=$('#anaList');if(!box)return;if(!J){box.innerHTML='';return;}
  box.innerHTML=J.files.map(function(f,i){var e=J.etat[i];if(!e)return '';var sh=S.shots[i]||{};
    return '<div class="imp-li '+e+'">'+(sh.url?'<img src="'+sh.url+'" alt="">':'<span class="imp-li-ph"></span>')+'<span class="imp-li-t"><b>Capture '+(i+1)+(e==='ok'&&J.res[i]&&J.res[i].resultat&&J.res[i].resultat.onglet!=='inconnu'?' · '+J.res[i].resultat.onglet:'')+'</b><small>'+ETAT_TXT[e]+(e==='ok'&&J.nb[i]!=null?' · '+J.nb[i]+' case'+(J.nb[i]>1?'s':''):'')+(e==='echec'&&J.msg[i]?' · '+esc(J.msg[i]):'')+'</small></span>'+
      '<span class="imp-li-s">'+(e==='ok'?ic('i-check'):e==='echec'?ic('i-warn'):'<span class="imp-dot"></span>')+'</span></div>';}).join('');}
function analyse(){
  if(S.shots.some(function(x){return x.file;})){if(!SITE_PUB){say('La lecture des captures marche sur la maquette publiée (site), pas dans ce fichier.');return;}lireVraies();return;}
  S.lect=null;renderAnaList(null);$('.imp-ana').classList.remove('fini');$('#anaNote').textContent='Lecture simulée (captures d’exemple) : rien n’est envoyé.';
  showStep(2);var n=S.shots.length,t=0;clearInterval(anaTimer);
  anaTimer=setInterval(function(){t+=4;var pct=Math.min(100,t);var k=Math.min(n,Math.max(1,Math.ceil(pct/100*n)));
    $('#anaFill').style.width=pct+'%';$('#anaPct').textContent=pct+' %';$('#anaText').textContent='Lecture de la capture '+k+' sur '+n;
    if(pct>=100){clearInterval(anaTimer);$('.imp-ana').classList.add('fini');setTimeout(function(){showStep(3);renderReview();},300);}},70);
}
function renderReview(){
  $('#revReel').hidden=!S.lect;$('#revDemo').hidden=!!S.lect;if(S.lect){renderLect();return;}
  var todo=Object.keys(S.q).filter(function(k){return S.q[k]==null;}).length;
  $('#todoTxt').textContent=todo?todo+' à vérifier':'tout est vérifié';$('#sureTxt').textContent=S.sureOk?'38 sûrs confirmés':'38 sûrs';
  var b=$('#sureBtn');b.disabled=S.sureOk;b.innerHTML=ic('i-check')+(S.sureOk?'38 éléments confirmés':'Confirmer les 38 éléments sûrs');
  $$('.q[data-q]').forEach(function(q){var v=S.q[q.dataset.q];q.classList.toggle('done',v!=null);});
}
function importSave(){
  if(S.lect){lectEnregistrer();return;}
  if(REEL){say('Choisis tes captures dans l’Inventaire du jeu, puis touche « Analyser ».');importReset();return;}
  var kept=(S.sureOk?38:0)+Object.keys(S.q).filter(function(k){return S.q[k]==='ok';}).length;
  var skipped=(S.sureOk?0:38)+Object.keys(S.q).filter(function(k){return S.q[k]!=='ok';}).length;
  if(!kept){say('Confirme au moins un élément avant d’enregistrer.');return;}
  if(S.q.q1==='ok'){var n=Number($('#q1').value.replace(/\s/g,''));if(isFinite(n)&&n>=0){var b=P.main.acc.build;b.forEach(function(x){if(x[0]==='60 min')x[1]=n;});}}
  if(S.q.q3==='ok'){P.main.res.stone.v=12;}
  S.imported=true;P.main.releves+=kept;if(S.q.q3==='ok')P.main.corr++;
  $('#resTitle').textContent=kept+' valeur'+(kept>1?'s':'')+' enregistrée'+(kept>1?'s':'');
  $('#resText').textContent=(S.q.q3==='ok'?'1 correction avec un motif. Les anciennes valeurs restent dans l’historique. ':'')+(skipped?skipped+' élément'+(skipped>1?'s':'')+' non vérifié'+(skipped>1?'s':'')+' : pas enregistré'+(skipped>1?'s':'')+'.':'');
  showStep(4);refreshAll();
}
function importReset(){S.shots=[];S.lect=null;S.lectJob=null;S.q={q1:null,q2:null,q3:null};S.sureOk=false;$$('.q .chip').forEach(function(c){c.setAttribute('aria-pressed','false');});renderShots();renderReview();showStep(1);}

/* Maquette publiée : les captures y sont lues par Claude (fonctions /api/capture et /api/lire). */
var SITE_PUB=/\.vercel\.app$/.test(location.hostname)||!!window.RC_SITE;
/* Une capture trop lourde (plus de 3,9 Mo) ou dans un format rare est convertie en JPEG, en gardant sa taille en pixels. */
function prepImage(f){if(f.size<=3.9e6&&/^image\/(png|jpeg|webp)$/.test(f.type))return Promise.resolve(f);
  return createImageBitmap(f).then(function(bm){var c=document.createElement('canvas');c.width=bm.width;c.height=bm.height;c.getContext('2d').drawImage(bm,0,0);
    return new Promise(function(res,rej){c.toBlob(function(b){if(b&&b.size<=3.9e6)res(b);else rej(new Error('trop lourde'));},'image/jpeg',0.92);});});}
/* ================= Lecture des captures par Claude Opus 5.5 (décision de Mickaël du 2026-10-09) =================
   Chaque capture part dans l'espace privé de la maquette (/api/capture), Claude la lit (/api/lire, réponse en JSON),
   puis elle est effacée. Les cases sont regroupées (une même case peut être sur deux captures), comparées aux tailles et
   durées du jeu (RC_JEU), puis relues : les sûres se confirment d'un coup, les douteuses une par une. Rien n'est écrit
   pour un élément absent des captures (absent ≠ zéro). Onglets lus : Ressources et Accélérateurs (essai du 2026-10-09). */
/* coût moyen mesuré par capture : 0,05 $ (Ressources, Accélérateurs, 9 oct.), 0,074 $ avec la consigne des 6 onglets (20 captures, 10 oct.) */
var LECT_MODELE='opus',LECT_PRIX=0.075;
var TYPES_ACC={build:'construction',research:'recherche',train:'entraînement',heal:'soins',general:'généraux'};
function lectFamille(o){o=String(o||'').toLowerCase();
  if(/acc[ée]l/.test(o)){if(/construction/.test(o))return ['acc','build'];if(/recherche/.test(o))return ['acc','research'];if(/entra[iî]nement/.test(o))return ['acc','train'];
    if(/soin/.test(o))return ['acc','heal'];if(/universel|g[ée]n[ée]ra/.test(o))return ['acc','general'];return ['acc',null];}
  if(/coffre|pack/.test(o))return ['autre',null];
  if(/gemme/.test(o))return ['res','gems'];if(/nourriture/.test(o))return ['res','food'];if(/bois/.test(o))return ['res','wood'];if(/pierre/.test(o))return ['res','stone'];
  if(/\bd['’]or\b|\bor\b/.test(o))return ['res','gold'];return ['autre',null];}
/* « 1m », « 60m », « 3h », « 24h », « 3j » → minutes */
function lectDuree(t){var m=String(t||'').toLowerCase().replace(/\s/g,'').match(/^(\d+)(m|min|h|j|d)$/);if(!m)return null;var v=+m[1];return m[2][0]==='m'?v:m[2]==='h'?v*60:v*1440;}
function lectNom(it){
  if(it.kind==='ville')return it.type==='gems'?'Gemmes en ville':(RN.filter(function(x){return x[0]===it.type;})[0]||[,,'?'])[2]+' en ville';
  if(it.kind==='res')return (it.type==='gems'?'Gemmes':(RN.filter(function(x){return x[0]===it.type;})[0]||[,,'Ressource'])[2])+' · caisse de '+(it.val==null?'?':nb(it.val));
  if(it.kind==='obj'){var X=OBJ_ID[it.type];if(!X)return it.type;var o2=X.o,g=X.g,q=o2.q||o2.c,ql=QL[q]?QL[q][1]:'';
    if(g.type==='mat'||g.type==='qual')return g.nom+' · '+ql;if(g.type==='qual3')return g.nom+' · '+ql+' · '+({simples:'simple',bénies:'bénie',lots:'lot'})[o2.f];return g.nom+' · '+o2.l;}
  if(it.kind==='coffre'){var o=COFFRES.concat(PACKS).filter(function(x){return x[0]===it.type;})[0];return it.fam==='pack'?'Pack de ressources '+(o?o[2].nom:'?'):'Coffre « Choisissez un » '+(o?o[1].toLowerCase():'?');}
  return 'Accélérateur '+(it.type?TYPES_ACC[it.type]:'de type inconnu')+' · '+(it.val==null?'?':fDur(it.val));}
function lectIcone(it){if(it.kind==='obj')return OBJ_ID[it.type]?OBJ_ID[it.type].g.icone:'n-gift';if(it.kind==='coffre')return it.fam==='pack'?'p-pack':'p-chest';if(it.kind==='acc')return it.type?(AN.filter(function(x){return x[0]===it.type;})[0]||[,'a-general'])[1]:'a-general';
  if(it.type==='gems')return 'r-gem';return (RN.filter(function(x){return x[0]===it.type;})[0]||[,'r-food'])[1];}
/* Regroupe les lectures des captures en éléments à enregistrer */
/* Regroupe les lectures des captures en éléments à enregistrer. L[i] = lecture de la capture i (ou rien si elle a échoué),
   avec r._i (numéro de la capture) et r._t (heure de la capture, d'après le fichier). */
function lectHeure(t){return t?new Date(t).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):'';}
function lectRegrouper(L,erreurs,n){
  var items=[],par={},pasPris=0,coupees=[],pleines=[],cof=[],onglets={},vu=0,barres=[],tabs={};
  function ajoute(it,lu){var k=it.kind+'|'+(it.type||'?')+'|'+it.val+(it.type?'':'|'+it.qte);var o=par[k];
    if(o){o.lus.push(lu);return;}
    it.id='l'+items.length;it.lus=[lu];par[k]=it;items.push(it);}
  L.forEach(function(r){if(!r||!r.resultat)return;var R=r.resultat,lu0={i:r._i,t:r._t};onglets[R.onglet]=1;if(R.barre)barres.push({b:R.barre,i:r._i,t:r._t});
    if(ONG_OBJ[R.onglet]){vu+=(R.cases||[]).length;(tabs[R.onglet]=tabs[R.onglet]||[]).push({i:r._i,t:r._t,cases:R.cases||[]});return;}
    (R.cases||[]).forEach(function(c){vu++;
      if(R.onglet!=='Ressources'&&R.onglet!=='Accélérateurs'){pasPris++;return;}
      var f=lectFamille(c.objet);if(R.onglet==='Accélérateurs'&&f[0]!=='acc')f=['acc',null];/* onglet Accélérateurs : un objet pas reconnu est un accélérateur de type inconnu */
      if(f[0]==='autre'){var fam=R.onglet!=='Ressources'?null:/pack/i.test(c.objet)?'pack':/coffre/i.test(c.objet)?'choix':null;
        if(!fam){pasPris++;return;}
        if(c.coupee){coupees.push({f:['coffre',null],c:c,i:r._i,o:R.onglet});return;}
        cof.push({i:r._i,t:r._t,o:R.onglet,fam:fam,coul:String(c.couleur||'inconnu'),lig:c.ligne,col:c.colonne,q:parseEntier(c.quantite),sur:!!c.sur});return;}
      if(c.coupee){coupees.push({f:f,c:c,i:r._i,o:R.onglet});return;}
      var qte=parseEntier(c.quantite),it={kind:f[0],type:f[1],type0:f[1],qte:qte,sur:!!c.sur,raison:''};
      if(f[0]==='res'){it.val=parseEntier(c.valeur_haut);var C=JEU.caisses[f[1]];
        if(it.val==null)it.raison='Taille illisible';else if(C&&C.tailles.indexOf(it.val)<0)it.raison='Taille inconnue du jeu : '+nb(it.val);}
      else{it.val=lectDuree(c.valeur_haut);var J=JEU.accelerateurs,LD=f[1]==='general'?J.universel:J.specialises;
        if(!f[1])it.raison='Type d’accélérateur pas reconnu : choisis-le';
        else if(it.val==null)it.raison='Durée illisible';else if(LD.indexOf(it.val)<0)it.raison='Durée inconnue du jeu pour ce type : '+fDur(it.val);}
      if(qte==null)it.raison=it.raison||'Quantité illisible';else if(!c.sur)it.raison=it.raison||'Chiffre douteux : vérifie la quantité';
      if(it.raison)it.sur=false;
      pleines.push({i:r._i,o:R.onglet,lig:c.ligne,col:c.colonne,kind:it.kind,type:it.type,val:it.val,q:qte});
      ajoute(it,{i:r._i,t:r._t,q:qte});});});
  /* Coffres « Choisissez un » et packs de ressources (2026-10-10) : le niveau vient de la couleur de la case et de l'ordre de la grille
     (le jeu les range par niveau). Moins de cases que de niveaux possibles pour une couleur : niveau proposé, à confirmer. */
  var CAND={pack:{gris:['pA','pB','pC'],vert:['p2'],bleu:['p3']},choix:{vert:['c1','c2'],bleu:['c3','c4'],violet:['c5']}},
      TOUS={pack:PACKS.map(function(x){return x[0];}),choix:COFFRES.map(function(x){return x[0];})},grp={};
  cof.forEach(function(x){var k=x.i+'|'+x.fam+'|'+x.coul;(grp[k]=grp[k]||[]).push(x);});
  var avant=(A()||{}).coffres||{};
  Object.keys(grp).forEach(function(k){var G=grp[k].sort(function(a,b){return a.lig-b.lig||a.col-b.col;}),x0=G[0],C=CAND[x0.fam][x0.coul],sure=!!C&&G.length===C.length,cands=C||TOUS[x0.fam];
    /* ton inventaire connaît déjà autant de niveaux de cette couleur que de cases : on les reprend (ex. packs B et C) */
    var connus=C?C.filter(function(id){return avant[id]>0;}):[];if(!sure&&C&&connus.length===G.length){C=connus;sure=true;}
    /* packs gris incomplets : le pack A (quêtes du début de jeu) est le moins probable, on propose B puis C */
    var pre=sure?C:x0.fam==='pack'&&x0.coul==='gris'?cands.slice(Math.max(0,cands.length-G.length)):cands.slice(0,G.length);
    G.forEach(function(x,j){var t=pre[Math.min(j,pre.length-1)],it={kind:'coffre',fam:x.fam,type:t,type0:sure?t:null,val:0,qte:x.q,cands:cands,sur:sure&&x.sur&&x.q!=null,
      raison:!sure?(C?'Niveau à confirmer : plusieurs niveaux ont cette couleur':'Couleur de la case pas reconnue : choisis le niveau'):x.q==null?'Quantité illisible':!x.sur?'Chiffre douteux : vérifie la quantité':''};
      pleines.push({i:x.i,o:x.o,lig:x.lig,col:x.col,kind:'coffre',type:t,val:null,q:x.q});ajoute(it,{i:x.i,t:x.t,q:x.q});});});
  /* même élément lu sur plusieurs captures avec des nombres différents : on propose celui de la capture la plus récente */
  items.forEach(function(it){var Q=it.lus.filter(function(x){return x.q!=null;});var dif=Q.filter(function(x){return x.q!==Q[0].q;}).length;if(!dif)return;
    Q.sort(function(a,b){return (b.t||0)-(a.t||0);});it.qte=Q[0].q;it.sur=false;
    var rec=Q[0].t&&Q[1].t&&Math.abs(Q[0].t-Q[1].t)>=60000;
    it.raison='Pas le même nombre selon la capture : '+Q.map(function(x){return nb(x.q)+' (capture '+(x.i+1)+(x.t?', '+lectHeure(x.t):'')+')';}).join(', ')+(rec?'. Le nombre de la plus récente est proposé.':'. Vérifie dans le jeu.');});
  /* Une case coupée sans double entier sur une autre capture n'est pas enregistrée. La grille défile de haut en bas :
     une rangée coupée doit se retrouver entière, colonne par colonne, sur une autre capture du même onglet.
     Le dessin du type d'accélérateur est en bas de la case : coupé, le type est inconnu (captures de Mickaël, 2026-10-10). */
  var rangs={};coupees.forEach(function(x){var c=x.c;x.v=x.f[0]==='res'?parseEntier(c.valeur_haut):lectDuree(c.valeur_haut);x.q=parseEntier(c.quantite);
    if(x.v==null&&x.q==null)return;/* rien de lisible : on ne peut rien en dire */
    var k=x.i+'|'+c.ligne;(rangs[k]=rangs[k]||[]).push(x);});
  var perdues=0;Object.keys(rangs).forEach(function(k){var G=rangs[k],x0=G[0];
    var trouve=pleines.some(function(p0){if(p0.i===x0.i||p0.o!==x0.o)return false;
      return G.every(function(x){return pleines.some(function(p){return p.i===p0.i&&p.lig===p0.lig&&p.col===x.c.colonne&&p.kind===x.f[0]&&(!x.f[1]||p.type===x.f[1])&&(x.v==null||p.val===x.v)&&(x.q==null||p.q===x.q);});});});
    if(!trouve)perdues+=G.length;});
  /* Onglets Boosts, Équipement, Attirail, Autre (2026-10-10) : plusieurs cases peuvent être le même objet du catalogue (plans, pièces,
     sculptures de commandants…), on additionne. Pour ne pas compter deux fois les rangées vues sur deux captures (défilement), on recolle
     les rangées entières de capture en capture : celles du début d'une capture qui reprennent la fin de la précédente sont sautées.
     Une rangée coupée par le bord n'est jamais comptée ; si elle n'est entière sur aucune capture, elle est signalée perdue. */
  var objInc=0,attP={},objSomme=false;
  Object.keys(tabs).forEach(function(o){
    var caps=tabs[o].sort(function(a,b){return (a.t||0)-(b.t||0)||a.i-b.i;}),seq=[],cut=[];
    function sig(R){return R.map(function(x){return x.colonne+':'+x.id_objet+'/'+String(x.quantite||'').replace(/\s/g,'')+'/'+String(x.valeur_haut||'').replace(/\s/g,'');}).join('|');}
    function egal(A,B,ia,ib,k){for(var z=0;z<k;z++)if(A[ia+z].sig!==B[ib+z].sig)return false;return true;}
    caps.forEach(function(c){var rows={};c.cases.forEach(function(x){(rows[x.ligne]=rows[x.ligne]||[]).push(x);});
      var B=[];Object.keys(rows).map(Number).sort(function(a,b){return a-b;}).forEach(function(k){var R=rows[k].sort(function(a,b){return a.colonne-b.colonne;});
        if(R.some(function(x){return x.coupee;}))cut.push(R);else B.push({sig:sig(R),cells:R,i:c.i,t:c.t});});
      if(!B.length)return;if(!seq.length){seq=B;return;}
      for(var j=0;j+B.length<=seq.length;j++)if(egal(seq,B,j,0,B.length))return;/* capture déjà toute vue */
      for(var k=Math.min(seq.length,B.length);k>0;k--)if(egal(seq,B,seq.length-k,0,k)){seq=seq.concat(B.slice(k));return;}
      for(k=Math.min(seq.length,B.length);k>0;k--)if(egal(B,seq,B.length-k,0,k)){seq=B.slice(0,B.length-k).concat(seq);return;}
      seq=seq.concat(B);});
    /* rangées coupées : retrouvées entières ailleurs ? (une case coupée n'a pas tout : on compare ce qu'elle montre) */
    cut.forEach(function(R){var ok=seq.some(function(S){return R.every(function(x){var y=S.cells.filter(function(z){return z.colonne===x.colonne;})[0];if(!y)return false;
        var q=String(x.quantite||'').replace(/\s/g,'');return (x.id_objet==='inconnu'||x.id_objet===y.id_objet)&&(!q||q===String(y.quantite||'').replace(/\s/g,''));});});
      if(!ok)perdues+=R.length;});
    var acc={},ord=[];
    seq.forEach(function(S){S.cells.forEach(function(x){var id=x.id_objet,O=OBJ_ID[id];
      if(id==='ignorer'||id==='aucun')return;
      if(id==='piece_attirail'){var cq=String(x.couleur||'');attP[cq]=(attP[cq]||0)+1;return;}
      if(!O){objInc++;return;}
      var q=parseEntier(x.quantite);if(q==null&&/^piece_/.test(id)&&!String(x.quantite||'').trim())q=1;/* pièce forgée : une case = une pièce */
      if(!acc[id]){acc[id]={q:0,n:0,sur:true,lus:[]};ord.push(id);}var A2=acc[id];A2.n++;A2.lus.push({i:S.i,t:S.t,q:q});
      if(q==null)A2.sur=false,A2.ill=true;else A2.q+=q;if(!x.sur)A2.sur=false;});});
    ord.forEach(function(id){var A2=acc[id];if(A2.n>1)objSomme=true;
      var it={kind:'obj',type:id,type0:id,val:null,qte:A2.ill?null:A2.q,sur:A2.sur,raison:A2.ill?'Quantité illisible':!A2.sur?'Chiffre douteux : vérifie la quantité':'',n:A2.n};
      it.id='l'+items.length;it.lus=A2.lus;items.push(it);});});
  /* barre du haut : celle de la capture la plus récente ; si elle change d'une capture à l'autre, on le dit */
  var bdif=false;barres.sort(function(a,b){return (b.t||0)-(a.t||0);});
  if(barres.length>1){var k0=JSON.stringify(barres[0].b);bdif=barres.some(function(x){return JSON.stringify(x.b)!==k0;});}
  if(barres.length){var barre=barres[0].b;
    [['food','nourriture'],['wood','bois'],['stone','pierre'],['gold','or']].forEach(function(x){var u=parseQte(barre[x[1]]);if(u!=null)items.push({id:'v'+x[0],kind:'ville',type:x[0],val:u,qte:null,sur:!bdif,raison:bdif?'La barre du haut change d’une capture à l’autre : valeur de la plus récente':'',lus:[]});});
    var g=parseEntier(barre.gemmes);if(g!=null)items.push({id:'vgems',kind:'ville',type:'gems',val:g,qte:null,sur:!bdif,raison:bdif?'La barre du haut change d’une capture à l’autre : valeur de la plus récente':'',lus:[]});}
  return {items:items,sureOk:false,n:n,erreurs:erreurs,pasPris:pasPris,objInc:objInc,attP:attP,objSomme:objSomme,perdues:perdues,vu:vu,bdif:bdif,onglets:Object.keys(onglets)};}
/* une coupure réseau (écran mis en veille, appli changée, wifi) donne « Failed to fetch » : on le dit simplement */
function lectReseau(e){return e instanceof TypeError||/fetch|network|load failed/i.test(String(e));}
function lectMessage(e){return lectReseau(e)?'connexion coupée (écran en veille, autre appli ou wifi ?)':String(e);}
function lireUne(f,etape){var id=null;etape=etape||function(){};etape('envoi');
  function efface(){if(id)fetch('/api/capture?id='+encodeURIComponent(id),{method:'DELETE'}).catch(function(){});}
  return prepImage(f).then(function(b){return fetch('/api/capture',{method:'POST',headers:{'content-type':b.type||'image/jpeg'},body:b});})
    .then(function(r){if(!r.ok)throw 'envoi impossible ('+r.status+')';return r.json();})
    .then(function(c){id=c.id;etape('lecture');return fetch('/api/lire',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:c.id,modele:LECT_MODELE})});})
    .then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||!j.resultat)throw (j&&j.error)||('lecture impossible ('+r.status+')');return j;});})
    .then(function(j){efface();return j;},function(e){efface();throw e;});}
/* Les nombres lus (pas les images) sont gardés dans la maquette (collection « lecture ») pour que Claude puisse vérifier une lecture douteuse. */
function lectGarde(r,f){try{fetch('/api/db',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({op:'set',col:'lecture',id:'l'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
  data:{date:new Date().toISOString(),version:REEL?'reelle':'exemples',fichier:f&&f.name||'',prise:f&&f.lastModified||null,modele:r.model,cout:r.cout_usd,resultat:r.resultat}})}).catch(function(){});}catch(e){}}
/* Lit les captures « idx » (toutes au départ ; seulement celles qui ont échoué pour « Relire ») */
function lireVraies(relire){
  var J=relire&&S.lectJob?S.lectJob:{files:S.shots.map(function(x){return x.file;}),res:[],echec:[],etat:[],nb:[],msg:[]};S.lectJob=J;
  var A_LIRE=relire?J.echec.slice():J.files.map(function(f,i){return i;}),n=A_LIRE.length,fait=0,k=0,echec=[],lock=null;
  var avant=relire&&S.lect?S.lect.items:null;S.lect=null;A_LIRE.forEach(function(i){J.etat[i]='attente';J.msg[i]='';});showStep(2);renderAnaList(J);
  $('#anaNote').textContent='Tes captures sont envoyées à Claude Opus 5.5 (Anthropic) pour être lues, puis effacées. Environ 10 à 15 s par capture. Reste sur cette page et garde l’écran allumé pendant la lecture.';
  try{if(navigator.wakeLock)navigator.wakeLock.request('screen').then(function(l){lock=l;},function(){});}catch(e){}
  function maj(){var pct=n?Math.round(fait/n*100):100;$('#anaFill').style.width=pct+'%';$('#anaPct').textContent=pct+'\u00a0%';$('.imp-ana').classList.toggle('fini',fait>=n);
    $('#anaText').textContent=fait<n?'Lecture : '+fait+' capture'+(fait>1?'s':'')+' lue'+(fait>1?'s':'')+' sur '+n:'Lecture terminée';}
  maj();
  function une(i){var f=J.files[i];function et(x){J.etat[i]=x;renderAnaList(J);}
    return lireUne(f,et).catch(function(e){if(lectReseau(e))return lireUne(f,et);throw e;})/* une seconde chance après une coupure */
      .then(function(r){r._i=i;r._t=f.lastModified||null;J.res[i]=r;J.nb[i]=(r.resultat.cases||[]).length;et('ok');lectGarde(r,f);},function(e){J.msg[i]=lectMessage(e);et('echec');echec.push({i:i,m:lectMessage(e)});});}
  function suivant(){if(k>=A_LIRE.length)return Promise.resolve();var i=A_LIRE[k++];return une(i).then(function(){fait++;maj();return suivant();});}
  Promise.all([suivant(),suivant(),suivant()]).then(function(){try{if(lock)lock.release();}catch(e){}
    J.echec=echec.map(function(x){return x.i;}).sort(function(a,b){return a-b;});
    S.lect=lectRegrouper(J.res,echec.sort(function(a,b){return a.i-b.i;}).map(function(x){return 'capture '+(x.i+1)+' : '+x.m;}),J.files.length);
    S.lect.cout=J.res.reduce(function(a,r){return a+(r&&r.cout_usd||0);},0);
    /* les vérifications déjà faites sont gardées après « Relire » */
    if(avant)S.lect.items.forEach(function(it){var o=avant.filter(function(x){return x.kind===it.kind&&x.type0===it.type0&&x.val===it.val&&(x.type0||x.qte===it.qte);})[0];
      if(o&&o.choix&&it.raison===o.raison){it.choix=o.choix;it.type=o.type;it.qte=o.qte;}});
    setTimeout(function(){showStep(3);renderReview();},300);});}
function renderLect(){
  var X=S.lect,box=$('#revReel');
  var sur=X.items.filter(function(it){return it.sur;}),todo=X.items.filter(function(it){return !it.sur;}),reste=todo.filter(function(it){return !it.choix;}).length;
  var lu=function(it){return it.kind==='ville'?fQte(it.val):nb(it.qte);};
  var notes=[];
  if(X.erreurs.length)notes.push('<b>'+X.erreurs.length+' capture'+(X.erreurs.length>1?'s':'')+' non lue'+(X.erreurs.length>1?'s':'')+'</b> : '+esc(X.erreurs.join(' ; '))+'.<div class="btns"><button class="btn gold" type="button" data-act="lect-relire">Relire '+(X.erreurs.length>1?'ces '+X.erreurs.length+' captures':'cette capture')+'</button></div>');
  if(X.bdif)notes.push('<b>La barre du haut n’est pas la même sur toutes les captures</b> : elles ne viennent pas toutes du même moment, ou pas du même compte. Les nombres qui changent sont à vérifier ; ne mélange pas les comptes dans un même import.');
  if(X.perdues)notes.push(X.perdues+' case'+(X.perdues>1?'s':'')+' coupée'+(X.perdues>1?'s':'')+' par le défilement, absente'+(X.perdues>1?'s':'')+' des autres captures : pas enregistrée'+(X.perdues>1?'s':'')+'. Reprends une capture où elle'+(X.perdues>1?'s sont':' est')+' entière'+(X.perdues>1?'s':'')+'.');
  if(X.pasPris)notes.push(X.pasPris+' case'+(X.pasPris>1?'s':'')+' des onglets Ressources ou Accélérateurs pas reconnue'+(X.pasPris>1?'s':'')+' : pas enregistrée'+(X.pasPris>1?'s':'')+'.');
  if(X.objInc)notes.push(X.objInc+' objet'+(X.objInc>1?'s':'')+' des onglets Boosts, Équipement, Attirail ou Autre pas reconnu'+(X.objInc>1?'s':'')+' : ajoute-les à la main dans « Autres objets » de l’onglet.');
  var nAt=Object.keys(X.attP||{}).reduce(function(a,k){return a+X.attP[k];},0);
  if(nAt)notes.push(nAt+' pièce'+(nAt>1?'s':'')+' d’attirail vue'+(nAt>1?'s':'')+' : leurs noms ne sont pas sur la grille du jeu, garde ta liste à jour à la main dans Attirail.');
  if(X.objSomme)notes.push('Plans, fragments, pièces forgées, sculptures de commandants : l’appli additionne toutes les cases de tes captures. Fais défiler chaque onglet jusqu’en bas pour avoir le bon total.');
  notes.push('Un élément absent des captures reste comme il est : l’appli n’écrit jamais zéro à sa place. Une ligne non vérifiée n’est pas enregistrée.');
  notes.push('Ressources en ville : lues dans la barre du haut du jeu, arrondies (ex. 84,2 M).');
  box.innerHTML='<div class="cols"><div class="col">'+
    '<div class="card hl"><h3>'+X.items.length+' élément'+(X.items.length>1?'s':'')+' lu'+(X.items.length>1?'s':'')+' sur '+X.n+' capture'+(X.n>1?'s':'')+'</h3><p><b class="ok">'+sur.length+' sûr'+(sur.length>1?'s':'')+(X.sureOk?' confirmés':'')+'</b> · <b class="gd">'+(reste?reste+' à vérifier':'tout est vérifié')+'</b>'+(X.cout?' · coût '+String(Math.round(X.cout*1000)/1000).replace('.',',')+' $':'')+'</p>'+
    (sur.length?'<div class="btns"><button class="btn primary" type="button" data-act="lect-sure"'+(X.sureOk?' disabled':'')+'>'+ic('i-check')+(X.sureOk?sur.length+' éléments confirmés':'Confirmer les '+sur.length+' éléments sûrs')+'</button></div>'+
      '<details class="lect-sur"><summary>Voir les éléments sûrs</summary><div class="list">'+sur.map(function(it){return row({icon:lectIcone(it),title:esc(lectNom(it)),val:lu(it)});}).join('')+'</div></details>':'')+'</div>'+
    (todo.length?'<section class="sec"><div class="sec-t"><h2>À vérifier</h2></div><div class="list">'+todo.map(function(it){
      return '<div class="q'+(it.choix?' done':'')+'" data-lq="'+it.id+'"><div class="q-h"><span class="crop">'+ic(lectIcone(it))+'</span><span class="rc"><b>'+esc(lectNom(it))+'</b><small>'+esc(it.raison)+'</small></span></div>'+
        (it.kind==='coffre'&&!it.type0?'<div class="chips lq-type" role="group" aria-label="Niveau">'+it.cands.map(function(id){var o=COFFRES.concat(PACKS).filter(function(x){return x[0]===id;})[0];return '<button class="chip" type="button" data-lt="'+id+'" aria-pressed="'+(it.type===id)+'">'+(it.fam==='pack'?o[2].nom:o[1])+'</button>';}).join('')+'</div>':'')+
        (it.kind==='acc'&&!it.type0?'<div class="chips lq-type" role="group" aria-label="Type d’accélérateur">'+AN.map(function(a){return '<button class="chip" type="button" data-lt="'+a[0]+'" aria-pressed="'+(it.type===a[0])+'">'+a[2]+'</button>';}).join('')+'</div>':'')+
        '<div class="field"><label for="lqv'+it.id+'">'+(it.kind==='ville'?'En ville':'Quantité')+'</label><input id="lqv'+it.id+'" data-lqv="'+it.id+'" inputmode="'+(it.kind==='ville'?'text':'numeric')+'" value="'+(it.kind==='ville'?(it.type==='gems'?it.val:String(fQte(it.val)).replace(/\u00a0/g,' ')):(it.qte==null?'':it.qte))+'"></div>'+
        '<div class="chips"><button class="chip" type="button" data-lqc="ok" aria-pressed="'+(it.choix==='ok')+'">C’est bon</button><button class="chip" type="button" data-lqc="skip" aria-pressed="'+(it.choix==='skip')+'">Ignorer</button></div></div>';}).join('')+'</div></section>':'')+
    '</div><div class="col"><section class="sec"><div class="sec-t"><h2>Bon à savoir</h2></div>'+notes.map(function(t){return '<div class="note lect-note"><i data-i="n-info"></i><span>'+t+'</span></div>';}).join('')+'</section></div></div>';
  paintIcons(box);
}
function lectItem(id){return S.lect.items.filter(function(x){return x.id===id;})[0];}
function lectLire(it,v){return it.kind==='ville'&&it.type!=='gems'?parseQte(v):parseEntier(v);}
/* garde les quantités déjà corrigées avant de redessiner la relecture */
function lectSync(){$$('[data-lqv]').forEach(function(el){var it=lectItem(el.dataset.lqv);if(!it)return;var q=lectLire(it,el.value);if(q==null)return;if(it.kind==='ville')it.val=q;else it.qte=q;});}
/* Enregistre les éléments confirmés dans l'inventaire du profil actif */
function lectEnregistrer(){
  var X=S.lect,p=A();if(!p){say('Ajoute d’abord un profil.');return;}
  var ok=[],skip=0;
  X.items.forEach(function(it){if(it.sur){if(X.sureOk)ok.push(it);else skip++;return;}
    if(it.choix!=='ok'){skip++;return;}var q=lectLire(it,($('#lqv'+it.id)||{}).value);if(q==null){skip++;return;}if(it.kind==='ville')it.val=q;else it.qte=q;ok.push(it);});
  if(!ok.length){say('Confirme au moins un élément avant d’enregistrer.');return;}
  function pose(L,label,qte,val,taille){var i=-1;L.forEach(function(c,j){if(Math.abs(c[2]-taille)<1e-9)i=j;});if(i>=0)L[i][1]=qte;else L.push([label,qte,taille]);L.sort(function(a,b){return a[2]-b[2];});}
  ok.forEach(function(it){
    if(it.kind==='obj'){if(!p.objets)p.objets={};p.objets[it.type]=it.qte;}
    else if(it.kind==='coffre'){if(!p.coffres)p.coffres={};p.coffres[it.type]=it.qte;}
    else if(it.kind==='ville'){if(it.type==='gems')p.gemsIn.v=it.val;else p.res[it.type].v=it.val/1e6;}
    else if(it.kind==='res'){if(it.type==='gems')pose(p.gemsIn.c,nb(it.val),it.qte,it.val,it.val);else pose(p.res[it.type].c,nb(it.val),it.qte,it.val,it.val/1e6);}
    else{if(!p.acc[it.type])p.acc[it.type]=[];pose(p.acc[it.type],fDur(it.val),it.qte,it.val,it.val/60);}});
  p.invMaj=dateJour();p.releves+=ok.length;S.imported=true;
  $('#resTitle').textContent=ok.length+' valeur'+(ok.length>1?'s':'')+' enregistrée'+(ok.length>1?'s':'')+' dans ton inventaire';
  $('#resText').textContent=(skip?skip+' élément'+(skip>1?'s':'')+' non vérifié'+(skip>1?'s':'')+' ou ignoré'+(skip>1?'s':'')+' : pas enregistré'+(skip>1?'s':'')+'. ':'')+'Ce qui n’était pas sur les captures n’a pas changé.';
  showStep(4);refreshAll();
}

/* ================= Optimiser ================= */
function renderOpt(){
  var p=A(),pl=plan();if(!p)return;
  var c=$('#optCard');c.setAttribute('href',p.obj.href);$('#optFill').style.width=(p.obj.pct||0)+'%';
  $('#optText').innerHTML=S.active==='main'?('<b>62 %</b> · encore <b>'+fH(pl.total)+'</b> de construction · '+(pl.miss?'il manque <b>'+fM(pl.miss)+' de pierre</b>':'<b class="ok">pierre couverte</b>')):
    (REEL?'Aucun objectif principal pour l’instant.':S.active==='f1'?'Ta ferme sert à envoyer de la pierre au Principal.':'Monte ton Mur puis ton Hôtel de ville.');
  $('#goalList').innerHTML=!S.goals.length?vide('Aucun objectif. Touche « Nouvel objectif » pour en ajouter un.'):S.goals.map(function(g,i){return row({icon:g.icon,title:esc(g.t),sub:esc(g.sub),val:g.pct==null?'—':g.pct+' %',act:'goal',data:i,go:false});}).join('');
  $('#toolRes').textContent=S.reserved?'Ressources réservées pour l’Hôtel de ville 25':'Mettre de côté pour un objectif';
  if(!P.main)return;
  // plan
  $('#accBuildTile').className='tv '+(pl.acc>=pl.total?'ok':'ko');
  $('#missTile').innerHTML=pl.miss?'<span class="ko">'+fM(pl.miss)+' <small>pierre</small></span>':'<span class="ok">Rien</span>';
  var hp=$('#hdvPill');hp.className='pill st-'+(pl.miss?'warn':'ok');hp.innerHTML='<i></i>'+(pl.miss?'Pierre manquante':'Possible après le Mur');
  $('#hdvWhy').textContent='Il ne peut commencer qu’après le Mur 24. Après le Mur, il te restera 13,4 M de pierre pour 15,6 M demandés'+(S.reserved?'':', et 2 M sont réservés pour la recherche')+'. '+(pl.recv?'Ta Ferme 1 t’envoie '+fM(pl.recv)+' : '+(pl.miss?'il manque encore '+fM(pl.miss)+'.':'c’est couvert.'):'Ta Ferme 1 peut envoyer de la pierre.');
  var stone=resTot(P.main.res.stone)-2+pl.recv;
  var R=[['Nourriture',27.1,resTot(P.main.res.food)],['Bois',27.1,resTot(P.main.res.wood)],['Pierre',20.2,stone],['Or',8.6,resTot(P.main.res.gold)]];
  $('#resTable').innerHTML=R.map(function(r){var m=Math.max(0,Math.round((r[1]-r[2])*10)/10);return '<tr><td>'+r[0]+'</td><td>'+fM(r[1])+'</td><td>'+fM(r[2])+'</td><td class="'+(m?'ko':'ok')+'">'+(m?fM(m):'0')+'</td></tr>';}).join('');
  $('#resNote').textContent='Pierre disponible : 18 M, dont 2 M réservés pour la recherche'+(pl.recv?', plus '+fM(pl.recv)+' reçus de la Ferme 1':'')+'. '+(S.reserved?'Ressources du plan réservées : elles ne comptent plus pour les autres objectifs.':'Rien n’est encore réservé pour ce plan.');
  var b=bonusMain();
  $('#planData').innerHTML=row({icon:'i-hall',title:'Hôtel de ville '+P.main.v.hdv+', Mur '+P.main.v.mur,sub:'Saisis le 5 oct.',pill:pill('ok','À jour')})+
    row({icon:'n-camera',title:'Ressources et accélérateurs',sub:S.imported?'Import d’aujourd’hui':'Import du 2 oct.',pill:pill(S.imported?'ok':'wip',S.imported?'À jour':'6 jours'),href:S.imported?null:'#import',go:!S.imported})+
    (b==null?row({href:'#valeur-bonus',icon:'i-warn',title:'Bonus de vitesse de construction',sub:'Inconnu : les durées sont calculées sans bonus, donc trop longues'}):
      row({href:'#valeur-bonus',icon:'i-gauge',title:'Bonus de vitesse de construction : '+b+' %',sub:'Les durées en tiennent compte'}));
  var sv=$('#planSaved');sv.innerHTML='<i></i>'+(S.planSaved?'Plan enregistré aujourd’hui':'Plan enregistré le 6 oct.');
  $('#reserveBtn').innerHTML=ic('i-lock')+(S.reserved?'Annuler la réservation':'Réserver les ressources');
}
function renderSpend(){
  if(REEL)return;
  var T={research:['recherche','Tissage','Recherche terminée'],build:['construction','Mur 24','Mur terminé'],train:['entraînement','fantassins niveau 5','Troupes prêtes']}[S.spType];
  var d=S.spDays;$('#spTitle').textContent='Utiliser '+d+' jour'+(d>1?'s':'')+' d’accélérateurs de '+T[0]+' ?';$('#spDaysV').textContent=d+' j';
  var pts=nb(d*30000);
  $('#spA').innerHTML='<li><span>'+T[2]+'</span><b>8 oct.</b></li><li><span>Points d’événement</span><b>0</b></li><li><span>Hôtel de ville 25</span><b>'+(S.spType==='build'?'<span class="ok">avance</span>':'inchangé')+'</b></li>';
  $('#spB').innerHTML='<li><span>'+T[2]+'</span><b>11 oct.</b></li><li><span>Points d’événement</span><b class="ok">≈ '+pts+'</b></li><li><span>Hôtel de ville 25</span><b>'+(S.spType==='build'?'<span class="ko">3 jours de retard</span>':'inchangé')+'</b></li>';
  $('#spAdvice').innerHTML=S.spType==='build'?'<b>Dépenser maintenant.</b> Le Mur est sur le chemin de l’Hôtel de ville 25 : attendre le retarderait de 3 jours pour ≈ '+pts+' points. Ce que l’appli ne sait pas : les récompenses exactes de cette édition.':
    '<b>Attendre 3 jours.</b> Le Gouverneur le plus puissant commence le 11 oct. (date confirmée) et l’'+T[0]+' y rapporte ≈ '+pts+' points ; elle ne bloque aucun de tes objectifs. Ce que l’appli ne sait pas : les récompenses exactes de cette édition.';
  $$('#spType .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.sp===S.spType));});
}
function renderBudget(){
  if(REEL){var MN=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];$('#budMonth').textContent=MN[new Date().getMonth()];}
  var tot=S.purchases.reduce(function(a,x){return a+x[2];},0);
  if(S.budget==null){$('#budTxt').textContent=tot?tot.toFixed(2).replace('.',',')+' € dépensés · aucun budget fixé':'Aucun budget fixé';$('#budFill').style.width='0%';$('#budFill').style.background='';if(document.activeElement!==$('#budIn'))$('#budIn').value='';
    $('#budList').innerHTML=S.purchases.length?S.purchases.map(function(x,i){return row({icon:'p-pack',title:esc(x[0]),sub:x[1],val:x[2].toFixed(2).replace('.',',')+' €',act:'del-purchase',data:i,go:false});}).join(''):vide('Aucun achat ce mois-ci.');return;}
  if(REEL&&document.activeElement!==$('#budIn'))$('#budIn').value=S.budget;var pct=S.budget?Math.min(100,tot/S.budget*100):100;
  $('#budTxt').textContent=tot.toFixed(2).replace('.',',')+' € sur '+S.budget+' €';$('#budFill').style.width=pct+'%';
  $('#budFill').style.background=tot>S.budget?'linear-gradient(110deg,#c0503a,#ef8a74)':'';
  $('#budList').innerHTML=(S.purchases.length?'':vide('Aucun achat ce mois-ci.'))+S.purchases.map(function(x,i){return row({icon:'p-pack',title:esc(x[0]),sub:x[1],val:x[2].toFixed(2).replace('.',',')+' €',act:'del-purchase',data:i,go:false});}).join('')+(tot>S.budget?'<div class="note" style="margin-top:4px">'+ic('i-warn')+'<span>Budget dépassé de '+(tot-S.budget).toFixed(2).replace('.',',')+' €.</span></div>':'');
  $('#packFx').innerHTML=S.packSim?'Effet sur ton plan : <b class="ok">Hôtel de ville 25 atteint 6 jours plus tôt</b>, plus de pierre manquante. Budget après achat : <b>'+(tot+9.99).toFixed(2).replace('.',',')+' € sur '+S.budget+' €</b>.':'Simule-le pour voir son effet sur ton plan et ton budget.';
  $('#packBtn').textContent=S.packSim?'Arrêter la simulation':'Simuler ce pack';
}
function renderFarms(){
  if(REEL){var fs=ORDER.filter(function(k){return P[k].type==='Ferme';});
    $('#farmList').innerHTML=fs.length?fs.map(function(k){return row({act:'switch',data:k,icon:'i-sprout',title:esc(P[k].name),sub:P[k].v.hdv!=null?'Hôtel de ville '+P[k].v.hdv:'Hôtel de ville à renseigner'});}).join(''):vide('Aucune ferme. Ajoute un profil de type « Ferme » depuis l’Accueil.');return;}
  var pl=plan();
  $('#farmList').innerHTML=(P.f1?row({act:'switch',data:'f1',icon:'i-sprout',title:esc(P.f1.name),sub:'HDV 21 · relevé il y a 2 jours',val:'31 M<small>ressources</small>'}):'')+
    (P.f2?row({act:'switch',data:'f2',icon:'i-sprout',title:esc(P.f2.name),sub:'HDV 17 · relevé il y a 9 jours',val:'12 M<small>ressources</small>'}):'');
  var v=Number($('#sendIn').value),r=Math.round(v*0.82*10)/10;$('#sendV').textContent=fM(v);
  var cover=r>=4.2;
  $('#sendTxt').innerHTML='Il manque <b>4,2 M de pierre</b> au Principal. Envoyer <b>'+fM(v)+'</b> donne <b>'+fM(r)+'</b> reçus après la taxe de 18 % : '+(cover?'<b class="ok">ça suffit</b>.':'<b class="ko">il manquera encore '+fM(4.2-r)+'</b>.')+(S.sent?' Déjà marqué comme envoyé : '+fM(S.sent)+'.':'');
}
function renderMig(){
  if(REEL)return;
  var need={'3401':28,'3402':34,'2988':19}[S.kd],have=12;$('#kdSel').value=S.kd;
  $('#kdNeed').textContent=need;$('#kdHave').textContent=have;$('#kdHave').className='tv '+(have>=need?'ok':'ko');
  $('#kdTxt').innerHTML=have>=need?'<b class="ok">Tu as assez de passeports.</b>':'Il te manque <b class="ko">'+(need-have)+' passeports</b>. Ils dépendent de ta puissance (128,4 M).';
  var food=resTot(P.main.res.food);
  $('#kdCond').innerHTML=row({icon:'i-check',title:'Hôtel de ville 7 ou plus'})+
    row({icon:food>40?'i-warn':'i-check',title:'Ressources sous la limite',sub:'Nourriture : '+fM(food)+' pour 40 M autorisés'})+row({icon:'n-info',title:'Hors alliance',sub:'À vérifier dans le jeu'});
}
function renderTime(){
  $('#tDays').innerHTML=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(function(d){return '<button class="chip" type="button" data-day="'+d+'" aria-pressed="'+(S.tDays.indexOf(d)>=0)+'">'+d+'</button>';}).join('');
  $$('#tMoment .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.v===S.tMoment));});
  $$('#tLen .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.v===S.tLen));});
  var mo={matin:'le matin',midi:'le midi',soir:'le soir'}[S.tMoment],le={'10':'10 min','30':'30 min','60':'1 h'}[S.tLen];
  $('#tSummary').innerHTML=S.tDays.length?'Tu joues <b>'+S.tDays.length+' jour'+(S.tDays.length>1?'s':'')+' sur 7</b>, <b>'+mo+'</b>, <b>'+le+'</b> par session. L’Accueil te propose '+(S.tLen==='10'?'2 actions':'3 actions')+' qui tiennent dans ce temps, fuseau Europe/Paris.':'Choisis au moins un jour.';
  $('#timeTxt').textContent=S.tDays.length+' j / 7, '+mo+', '+le;
}

/* ================= Combat ================= */
function renderCombat(){
  if(REEL){$('#marchList').innerHTML=vide('Aucune marche. Elles se composeront avec tes commandants, une fois renseignés dans Ma ville.');
    $('#compList').innerHTML=vide('Renseigne d’abord tes commandants dans Ma ville › Commandants.');$('#compWarn').innerHTML='';$('#compSave').disabled=true;
    $('#sesPill').className='pill st-plan';$('#sesPill').innerHTML='<i></i>Rien à vérifier';$('#sesList').innerHTML=vide('Rien à vérifier pour l’instant : il faut tes marches, tes accélérateurs de soins et tes points d’action.');
    $$('#sesMode .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.v===S.sesMode));});
    $('#repList').innerHTML=S.reports.length?S.reports.map(function(r,i){return row({act:'rep',data:i,icon:'n-camera',title:esc(r.t),sub:esc(r.d),pill:pill('wip','À relire'),cls:i===S.rep?'sel':'',go:false});}).join(''):vide('Aucun rapport. Touche « Importer » pour en ajouter un.');
    var rr=S.reports[S.rep];$('#repTitle').textContent=rr?rr.t:'';$('#repBody').innerHTML=rr?(rr.img?'<img class="repimg" src="'+rr.img+'" alt="Capture du rapport">':'<p class="muted">Capture non conservée après rechargement de la maquette.</p>')+'<p><b>Observé :</b> '+esc(rr.obs)+'</p>':vide('Choisis un rapport pour le lire.');return;}
  $('#marchList').innerHTML=S.marches.map(function(m,i){return row({act:'march',data:i,nb:i+1,title:esc(m.p)+' et '+esc(m.s),sub:m.type+' · '+m.form,pill:m.eq?pill('ok','Complète'):pill('warn','Équipement inconnu')});}).join('');
  // composer
  var used={};S.marches.forEach(function(m){[m.p,m.s].forEach(function(n){used[n]=(used[n]||0)+1;});});
  if(!$('#compList').dataset.live){$('#compList').innerHTML=S.marches.map(function(m,i){function sel(w,v){return '<select data-m="'+i+'" data-w="'+w+'">'+CMD.map(function(c){return '<option'+(c.n===v?' selected':'')+'>'+c.n+'</option>';}).join('')+'</select>';}
    return '<div class="card comp"><b>Marche '+(i+1)+'</b><div class="comp-r"><label>Principal'+sel('p',m.p)+'</label><label>Secondaire'+sel('s',m.s)+'</label></div></div>';}).join('');}
  compCheck();
  // comparer
  var a=S.marches[0];var opts=CMD.filter(function(c){return c.n!==a.p;});
  if(opts.map(function(c){return c.n;}).indexOf(S.cmpSec)<0)S.cmpSec=opts[0].n;
  $('#cmpSel').innerHTML=opts.map(function(c){return '<option'+(c.n===S.cmpSec?' selected':'')+'>'+c.n+'</option>';}).join('');
  function st(p,s){var x=cmd(p).st,y=cmd(s).st;return [x[0]+y[0],x[1]+y[1],x[2]+y[2]];}
  var A1=st(a.p,a.s),B1=st(a.p,S.cmpSec);
  $('#cmpA').innerHTML='<li><span>Commandants</span><b>'+esc(a.p)+' · '+esc(a.s)+'</b></li><li><span>Formation</span><b>'+a.form+'</b></li><li><span>Équipement</span><b>'+(a.eq?'Set infanterie':'inconnu')+'</b></li>';
  $('#cmpB').innerHTML='<li><span>Commandants</span><b>'+esc(a.p)+' · '+esc(S.cmpSec)+'</b></li><li><span>Formation</span><b>'+a.form+'</b></li><li><span>Équipement</span><b>Set infanterie</b></li>';
  var L=['Attaque de l’infanterie','Défense de l’infanterie','Santé de l’infanterie'];
  function f(v){return '+'+v.toFixed(1).replace('.',',')+' %';}
  $('#cmpBody').innerHTML=L.map(function(l,i){var w=A1[i]===B1[i]?'<td class="muted">=</td>':'<td class="ok">'+(A1[i]>B1[i]?'A':'B')+'</td>';return '<tr><td>'+l+'</td><td>'+f(A1[i])+'</td><td>'+f(B1[i])+'</td>'+w+'</tr>';}).join('')+
    '<tr><td>Compétences actives</td><td class="unk">—</td><td class="unk">—</td><td>'+pill('plan','Non couvert')+'</td></tr>';
  var da=B1[0]-A1[0],dd=A1[1]-B1[1];
  $('#cmpVerdict').innerHTML='<b>'+(da>0?'B frappe plus fort (+'+da.toFixed(1).replace('.',',')+' % d’attaque)':da<0?'A frappe plus fort (+'+(-da).toFixed(1).replace('.',',')+' % d’attaque)':'Même attaque')+(dd>0?', A tient mieux (+'+dd.toFixed(1).replace('.',',')+' % de défense).':dd<0?', B tient mieux (+'+(-dd).toFixed(1).replace('.',',')+' % de défense).':', même défense.')+'</b> Les compétences actives ne sont pas encore comparées : le résultat d’un vrai combat peut être différent.';
  // session
  var mode=S.sesMode,items=[];var full=S.marches.filter(function(m){return m.eq;}).length;
  items.push([full===4,'Marches complètes',full+' sur 4'+(full<4?' · complète la marche incomplète':''),'#combat']);
  items.push([true,'Accélérateurs de soins','3 j 4 h · objectif 3 j','#ma-ville-inventaire']);
  items.push([true,'Points d’action','6 250 · objectif 5 000',null]);
  if(mode==='rally'){var ok=S.marches.some(function(m){return cmd(m.p).t.indexOf('rally')>=0;});items.push([ok,'Commandant de rassemblement en tête',ok?'Oui':'Mets Guan Yu ou Constantin Ier en principal','#composer']);}
  if(mode==='garrison'){var ok2=S.marches.some(function(m){return cmd(m.p).t.indexOf('garrison')>=0;});items.push([ok2,'Commandant de garnison en tête',ok2?'Oui':'Mets Richard Ier ou Charles Martel en principal','#composer']);}
  if(mode==='field')items.push([S.marches[0].eq,'Équipement de la marche principale',S.marches[0].eq?'Renseigné':'Inconnu','#combat']);
  var bad=items.filter(function(x){return !x[0];}).length;
  var sp=$('#sesPill');sp.className='pill st-'+(bad?'warn':'ok');sp.innerHTML='<i></i>'+(bad?bad+' point'+(bad>1?'s':'')+' à régler':'Prête');
  $('#sesList').innerHTML=items.map(function(x){return row({href:x[3],icon:x[0]?'i-check':'i-warn',title:x[1],sub:x[2],go:!!x[3]&&!x[0]});}).join('');
  $$('#sesMode .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.v===mode));});
  // rapports
  $('#repList').innerHTML=S.reports.map(function(r,i){return row({act:'rep',data:i,icon:r.img?'n-camera':(r.ok?'i-hall':'i-sword'),title:esc(r.t),sub:esc(r.d),pill:r.ok==null?pill('wip','À relire'):pill(r.ok?'ok':'warn',r.ok?'Victoire':'Défaite'),cls:i===S.rep?'sel':'',go:false});}).join('');
  var r=S.reports[S.rep];$('#repTitle').textContent=r.t;
  $('#repBody').innerHTML=(r.img?'<img class="repimg" src="'+r.img+'" alt="Capture du rapport">':'')+'<p><b>Observé :</b> '+esc(r.obs)+'</p><p><b>Hypothèse :</b> '+esc(r.hyp)+'</p><p><b>Absent :</b> '+esc(r.abs)+'</p>';
}
function compCheck(){
  var sel=$$('#compList select');if(!sel.length)return;var cnt={};sel.forEach(function(s){cnt[s.value]=(cnt[s.value]||0)+1;});
  var dup=Object.keys(cnt).filter(function(k){return cnt[k]>1;});
  sel.forEach(function(s){s.classList.toggle('bad',cnt[s.value]>1);});
  $('#compWarn').innerHTML=dup.length?'<div class="note">'+ic('i-warn')+'<span>'+dup.map(esc).join(', ')+(dup.length>1?' sont utilisés':' est utilisé')+' dans deux marches. Un commandant ne peut mener qu’une marche à la fois.</span></div>':'<div class="note">'+ic('i-check')+'<span>Chaque commandant est dans une seule marche.</span></div>';
  $('#compSave').disabled=dup.length>0;
}

/* ================= Événements, bilan, codes, plus ================= */
function renderEvents(){
  /* Rappel : un bouton explicite « Me prévenir » (note 7 de Mickaël, 2026-10-09). Une date inconnue ne permet pas de rappel. */
  var now=Date.now(),L=evTri(evList()),ST={ok:['ok','Confirmé'],plan:['plan','Date estimée'],unk:['plan','Inconnu']};
  $('#evList').innerHTML=L.length?L.map(function(e){var on=S.reminders[e.id],can=e.debut!=null&&e.debut>now,st=ST[e.st]||ST.unk;
    return '<div class="row ev-row"><span class="ri">'+ic(e.icon||'i-flag')+'</span><span class="rc"><b>'+esc(e.n)+'</b><small>'+esc(evTexte(e,now))+(e.fin&&e.debut&&e.debut>now?' · jusqu’au '+fQuand(e.fin):'')+' · '+pill(st[0],st[1])+'</small></span>'+
      (can?'<button class="btn sm ev-rem'+(on?' on':'')+'" type="button" data-act="remind" data-arg="'+e.id+'" aria-pressed="'+!!on+'">'+ic('i-bell')+(on?'Rappel activé':'Me prévenir')+'</button>':'')+'</div>';}).join(''):vide('Aucun événement pour l’instant. Touche « Ajouter » pour noter ceux de ton royaume.');
  if(REEL){$('#kvkPill').className='pill st-plan';$('#kvkPill').innerHTML='<i></i>Rien à vérifier';$('#kvkList').innerHTML=vide('La préparation au KvK s’appuiera sur tes marches, tes troupes et tes accélérateurs.');return;}
  var full=S.marches.filter(function(m){return m.eq;}).length;var t5=P.main.troops[0][3]+P.main.troops[1][3];
  var K=[[true,'Accélérateurs de soins','3 j 4 h · objectif 3 j','#ma-ville-inventaire'],[t5>=300000,'Troupes niveau 5',nb(t5)+' · objectif 300 000','#ma-ville-progression'],
    [full===4,'Marches complètes',full+' sur 4'+(full<4?' · une marche incomplète':''),'#combat'],[true,'Ressources pour soigner','Couvertes par tes réserves',null]];
  var bad=K.filter(function(x){return !x[0];}).length;var kp=$('#kvkPill');kp.className='pill st-'+(bad?'warn':'ok');kp.innerHTML='<i></i>'+(bad?bad+' à préparer':'Prêt');
  $('#kvkList').innerHTML=K.map(function(x){return row({href:x[3],icon:x[0]?'i-check':'i-warn',title:x[1],sub:x[2],go:!!x[3]&&!x[0]});}).join('');
}
function renderBilan(){
  if(REEL){$('#bilList').innerHTML=vide('Pas encore de bilan : il faut au moins deux relevés à quelques jours d’écart.');$('#bilNotes').innerHTML=vide('Rien à signaler.');$$('#bilPer .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.v===S.bil));});return;}
  var w=S.bil==='7';
  var L=w?[['i-bolt','Puissance','+2,1 M','ok'],['i-temple','Académie 23 → 24','+1','ok'],['r-stone','Pierre','−6 M','ko'],['i-target','Hôtel de ville 25','+8 %','ok']]:
    [['i-bolt','Puissance','+7,8 M','ok'],['i-temple','Académie 22 → 24','+2','ok'],['t-swords','Caserne 22 → 23','+1','ok'],['r-stone','Pierre','−11 M','ko'],['i-target','Hôtel de ville 25','+21 %','ok']];
  $('#bilList').innerHTML=L.map(function(x){return row({icon:x[0],title:x[1],val:x[2],valCls:x[3]});}).join('');
  $('#bilNotes').innerHTML='<div class="note">'+ic('n-info')+'<span>'+(w?'Aucun relevé du 1er au 3 oct. : l’appli ne sait pas ce qui s’est passé ces jours-là.':'3 périodes sans relevé ce mois-ci (6 jours au total) : elles ne sont pas reconstituées.')+'</span></div><div class="note" style="margin-top:8px">'+ic('i-warn')+'<span>'+(plan().miss?'Blocage : la pierre manque pour l’Hôtel de ville 25.':'Plus de blocage : la pierre de l’Hôtel de ville 25 est couverte.')+'</span></div>';
  $$('#bilPer .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.v===S.bil));});
}
function renderCodes(){
  var L={try:'À essayer',used:'Utilisé',ref:'Refusé'};
  if(!S.codes.length){$('#codeList').innerHTML=vide('Aucun code pour l’instant.');$('#codesTxt').textContent='Aucun code à essayer';return;}
  $('#codeList').innerHTML=S.codes.map(function(c,i){return '<div class="q'+(c.st==='used'?' done':'')+'"><div class="q-h"><span class="crop">'+ic('n-gift')+'</span><span class="rc"><b class="num">'+c.c+'</b><small>'+c.sub+'</small></span><button class="btn sm" type="button" data-copy="'+c.c+'">'+ic('n-copy')+'Copier</button></div>'+
    '<div class="chips">'+Object.keys(L).map(function(k){return '<button class="chip" type="button" data-code="'+i+'" data-cst="'+k+'" aria-pressed="'+(c.st===k)+'">'+L[k]+'</button>';}).join('')+'</div></div>';}).join('');
  var n=S.codes.filter(function(c){return c.st==='try';}).length;$('#codesTxt').textContent=n?n+' code'+(n>1?'s':'')+' à essayer':'Aucun code à essayer';
}
function renderPlus(){
  $('#emailTxt').textContent=S.email||'Non renseignée';$('#langTxt').textContent=S.lang+' · '+S.tz;
  var on=Object.keys(S.notif).filter(function(k){return S.notif[k];}).length;$('#notifTxt').textContent=on?on+' sur 4 activées':'Toutes désactivées';
}

/* ================= Fenêtre (sheet) ================= */
var sheet=$('#sheet'),lastFocus=null;
function openSheet(title,body,actions){
  lastFocus=document.activeElement;$('#shTitle').textContent=title;$('#shBody').innerHTML=body;paintIcons($('#shBody'));
  $('#shActions').innerHTML=(actions||[]).map(function(a){return '<button class="btn '+(a[2]||'')+'" type="button" data-act="'+a[1]+'"'+(a[3]!=null?' data-arg="'+a[3]+'"':'')+(/is-off/.test(a[2]||'')?' aria-disabled="true"':'')+'>'+a[0]+'</button>';}).join('');
  $('#shActions').hidden=!(actions&&actions.length);
  sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
  var f=$('#shBody input,#shBody select,#shActions .btn');if(f)f.focus();
}
var RTL=0;
function rtLigne(t,d,id){var k='rtl'+(++RTL);return '<div class="rt-ed" id="'+k+'" data-id="'+esc(id)+'"><input class="rt-t" value="'+esc(t)+'" placeholder="Ex. Coffre VIP quotidien" aria-label="Tâche"><input class="rt-d" value="'+esc(d)+'" placeholder="Détail (facultatif)" aria-label="Détail"><button class="xbtn" type="button" aria-label="Retirer cette ligne" data-act="routine-rm" data-arg="'+k+'">✕</button></div>';}
function closeSheet(){sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');if(lastFocus&&lastFocus.focus)lastFocus.focus();}
sheet.addEventListener('click',function(e){if(e.target===sheet)closeSheet();});
var EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
var EYEOFF='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/></svg>';
function pwField(id,label){return '<div class="fld"><label for="'+id+'">'+label+'</label><div class="pw"><input id="'+id+'" type="password" autocomplete="new-password"><button class="xbtn" type="button" data-act="eye" data-arg="'+id+'" aria-label="Afficher le mot de passe">'+EYE+'</button></div></div>';}

/* ================= Navigation ================= */
var LABEL={ok:'Déjà fait',wip:'En cours',next:'Prochain',plan:'Prévu',ico:'Planche'};
function stc(st){return st==='ico'?'wip':st;}
var screens=$$('[data-screen]'),mv=$('[data-screen="ma-ville"]'),panels=$$('[data-panel]',mv);
/* Écran affiché, transmis à la bulle d'outils (revue.js) */
function setCur(o){window.RC_CUR=o;try{document.dispatchEvent(new CustomEvent('rc:route',{detail:o}));}catch(e){}}
var cur='accueil';
function route(){
  if(!LOADED)return;
  var h=(location.hash||'').slice(1)||'accueil',id=h,sub=null;
  if(AUTH_IDS.indexOf(h)>=0){if(REEL&&AUTH.user&&h!=='nouveau-mot-de-passe'){location.replace('#accueil');return;}showAuth(h);return;}
  if(!AUTH.user){AUTH.after=h;location.replace('#connexion');return;}
  if(document.body.classList.contains('auth-on')){document.body.classList.remove('auth-on');$('#auth').hidden=true;cur=null;}
  if(h==='ma-ville'||h.indexOf('ma-ville-')===0){id='ma-ville';sub=h.slice(9)||'progression';}
  if(h==='import'&&step===4)importReset();
  if(h.indexOf('valeur-')===0){id='valeur';var k=h.slice(7);if(FIELDS[k])S.valKey=k;}
  if(h.indexOf('profil-')===0){id='profil';S.profileView=h.slice(7);}else if(h==='profil'){S.profileView=null;}
  if(!ORDER.length&&['accueil','plus','codes','icones','temps'].indexOf(id)<0){id='accueil';say('Ajoute d’abord un profil.');}
  var s=screens.filter(function(x){return x.dataset.screen===id;})[0]||screens[0];
  screens.forEach(function(x){x.hidden=(x!==s);});
  var meta=s;
  if(s===mv){var p=panels.filter(function(x){return x.dataset.panel===sub;})[0]||panels[0];
    panels.forEach(function(x){x.hidden=(x!==p);});
    $$('.tab',mv).forEach(function(t){t.setAttribute('aria-current',String(t.dataset.sub===p.dataset.panel));});meta=p;}
  var st=meta.dataset.st||'plan';setCur({id:h,screen:id,title:meta.dataset.title||s.dataset.title,st:stc(st),label:LABEL[st]+' · '+meta.dataset.b,note:meta.dataset.note||''});
  var g=s.dataset.g;$$('.bottom-nav .nav').forEach(function(n){var on=n.dataset.g===g;n.classList.toggle('active',on);if(on)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});
  if(id!==cur||true){refreshAll();}
  if(id!==cur)window.scrollTo(0,0);cur=id;
  $$('#planBody .pl').forEach(function(a){a.setAttribute('aria-current',String(a.getAttribute('href')==='#'+h));});
}
function refreshAll(keepQuick){
  bind();renderHome();if(ORDER.length){renderProfile();if(!keepQuick)renderCity();renderValue();renderOpt();}
  renderSpend();renderBudget();if(P.main||REEL){renderFarms();renderMig();renderCombat();renderEvents();renderBilan();}renderTime();renderCodes();renderPlus();
}
/* Plan des écrans */
(function(){
  var G=[['compte','Compte','i-medal'],['accueil','Accueil','i-acc-c'],['ma-ville','Ma ville','i-hall'],['optimiser','Optimiser','i-sliders'],['combat','Combat','i-sword'],['plus','Plus','i-dots']],h='';
  G.forEach(function(g){var it=[];if(g[0]==='compte')$$('[data-auth]').forEach(function(a){it.push(['#'+a.dataset.auth,a.dataset.title,'ok']);});
    screens.forEach(function(s){if(s.dataset.g!==g[0])return;
    if(s===mv)panels.forEach(function(p){it.push(['#ma-ville-'+p.dataset.panel,p.dataset.title,p.dataset.st]);});
    else it.push([s.dataset.href||'#'+s.dataset.screen,s.dataset.title,s.dataset.st]);});
    h+='<div class="pg"><h3>'+ic(g[2])+g[1]+'</h3>'+it.map(function(x){return '<a class="pl" href="'+x[0]+'"><span>'+x[1]+'</span><span class="pill st-'+stc(x[2])+'"><i></i>'+LABEL[x[2]]+'</span></a>';}).join('')+'</div>';});
  $('#planBody').innerHTML=h;
})();
var planEl=$('#plan');
function openPlan(){planEl.classList.add('open');planEl.setAttribute('aria-hidden','false');$('#closePlan').focus();}
function closePlan(){planEl.classList.remove('open');planEl.setAttribute('aria-hidden','true');}
$('#closePlan').addEventListener('click',closePlan);
planEl.addEventListener('click',function(e){if(e.target===planEl||e.target.closest('.pl'))closePlan();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closePlan();closeSheet();}});

/* ================= Compte : connexion, création, confirmation, mot de passe ================= */
var LOGO_N=0;
function logo(){var n=++LOGO_N;return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="lgG'+n+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6df8f"/><stop offset=".55" stop-color="#d8b24c"/><stop offset="1" stop-color="#a77a26"/></linearGradient><linearGradient id="lgD'+n+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c2638"/><stop offset="1" stop-color="#0a0e16"/></linearGradient></defs><circle cx="50" cy="50" r="44" fill="url(#lgD'+n+')" stroke="url(#lgG'+n+')" stroke-width="4"/><circle cx="50" cy="50" r="36" fill="none" stroke="#d8b24c" stroke-width="1.5" stroke-dasharray="1.5 3.2"/><circle cx="50" cy="50" r="31" fill="none" stroke="#d8b24c" stroke-opacity=".5" stroke-width="1"/><text x="50" y="61" text-anchor="middle" font-family="Noto Serif,Georgia,serif" font-weight="700" font-size="30" fill="url(#lgG'+n+')" letter-spacing="-1">RC</text></svg>';}
$$('.a-brand').forEach(function(b){b.innerHTML=logo()+'<h1>RoK Companion</h1>';});
$$('.a-security').forEach(function(b){b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7 3v6c0 4.2-3.1 7.2-7 9-3.9-1.8-7-4.8-7-9V6l7-3Z"/><path d="m9 12 2 2 4-5"/></svg><span>Aucun accès à ton compte Rise of Kingdoms.</span>';});
$$('.a-eye').forEach(function(b){b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.6"/><path class="slash" d="m4 4 16 16"/></svg>';});
function shell(id){return $('[data-auth="'+id+'"]');}
function authMsg(id,t,bad){var f=$('.a-feedback',shell(id));f.textContent=t||'';f.hidden=!t;f.classList.toggle('bad',!!bad);}
function fieldErr(id,t){var i=$('#'+id),e=$('#'+id+'Err');if(t){i.setAttribute('aria-invalid','true');e.textContent=t;e.hidden=false;}else{i.removeAttribute('aria-invalid');if(e)e.hidden=true;}}
function showAuth(id){
  closeSheet();document.body.classList.add('auth-on');$('#auth').hidden=false;
  var sh=shell(id);$$('[data-auth]').forEach(function(x){x.hidden=(x!==sh);});
  setCur({id:id,screen:id,title:sh.dataset.title,st:'ok',label:LABEL.ok+' · '+sh.dataset.b,note:sh.dataset.note,sim:id==='confirmation'||(id==='mot-de-passe-oublie'&&!!AUTH.reset)});
  if(id==='confirmation')$('#cfEmail').textContent=AUTH.pending||'nom@exemple.fr';
  $$('#planBody .pl').forEach(function(a){a.setAttribute('aria-current',String(a.getAttribute('href')==='#'+id));});
  if(cur!=='auth:'+id){window.scrollTo(0,0);$$('input',sh).forEach(function(i){if(i.type==='text')i.type='password';});}
  cur='auth:'+id;
}
function saveData(){if(AUTH.user)ACC[AUTH.user].data={P:P,ORDER:ORDER,active:S.active};}
function login(email){
  saveData();var a=ACC[email];if(!a.data)a.data={P:{},ORDER:[],active:null};
  P=a.data.P;ORDER=a.data.ORDER;S.active=a.data.active;S.profileView=null;S.quick=false;if(email!=='REEL')S.email=email;AUTH.user=email;
  try{if(email===DEMO)sessionStorage.setItem('rokUser',email);else sessionStorage.removeItem('rokUser');}catch(e){}
  $$('.a-shell form').forEach(function(f){f.reset();});AUTH_IDS.forEach(function(id){authMsg(id,'');});
  var to=AUTH.after&&AUTH_IDS.indexOf(AUTH.after)<0?AUTH.after:'accueil';AUTH.after=null;
  if(location.hash==='#'+to)route();else location.hash=to;
}
function logout(){saveData();saveReel(true);AUTH.user=null;try{sessionStorage.removeItem('rokUser');}catch(e){}location.hash='connexion';authMsg('connexion','Tu es déconnecté. Tes profils restent enregistrés.');}
var MAILRE=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function submitAuth(kind){
  if(REEL&&kind!=='newpw'){/* version réelle : un seul compte, le tien ; la maquette ne vérifie ni l'e-mail ni le mot de passe */
    if(kind==='login'){S.email=$('#liEmail').value.trim();login('REEL');return;}
    if(kind==='signup'){var se=$('#suEmail').value.trim(),q1=$('#suPw').value,q2=$('#suPw2').value;
      fieldErr('suEmail',MAILRE.test(se)?'':'Saisis une adresse valide, par exemple nom@exemple.fr.');fieldErr('suPw',q1.length<8?'Au moins 8 caractères.':'');fieldErr('suPw2',q1!==q2?'Les mots de passe ne correspondent pas.':'');
      if(!MAILRE.test(se)||q1.length<8||q1!==q2)return;S.email=se;AUTH.pending=se;$('[data-form="signup"]').reset();location.hash='confirmation';return;}
    if(kind==='forgot'){var fr=$('#fgEmail').value.trim();AUTH.reset='REEL';window.RC_CUR.sim=true;setCur(window.RC_CUR);authMsg('mot-de-passe-oublie','E-mail envoyé à '+fr+' : touche le lien qu’il contient pour choisir un nouveau mot de passe.');return;}
  }
  if(kind==='login'){
    var em=$('#liEmail').value.trim().toLowerCase(),pw=$('#liPw').value,a=ACC[em];
    if(!a||a.pw!==pw){authMsg('connexion','E-mail ou mot de passe incorrect.',true);return;}
    if(!a.ok){AUTH.pending=em;location.hash='confirmation';authMsg('confirmation','Confirme d’abord ton e-mail : touche le lien reçu.');return;}
    login(em);
  }else if(kind==='signup'){
    var e2=$('#suEmail').value.trim().toLowerCase(),p1=$('#suPw').value,p2=$('#suPw2').value,bad=false;
    fieldErr('suEmail',MAILRE.test(e2)?'':'Saisis une adresse valide, par exemple nom@exemple.fr.');bad=!MAILRE.test(e2);
    fieldErr('suPw',p1.length<8?'Au moins 8 caractères.':'');bad=bad||p1.length<8;
    fieldErr('suPw2',p1!==p2?'Les mots de passe ne correspondent pas.':'');bad=bad||p1!==p2;
    if(bad){var f=$('[data-auth="inscription"] [aria-invalid="true"]');if(f)f.focus();return;}
    /* Adresse déjà utilisée : on le dit (note 4 de Mickaël, 2026-10-08) au lieu de faire semblant d'envoyer un e-mail. */
    if(ACC[e2]){fieldErr('suEmail','Un compte existe déjà avec cette adresse. Connecte-toi, ou touche « Mot de passe oublié ? » sur l’écran de connexion.');$('#suEmail').focus();return;}
    ACC[e2]={pw:p1,ok:false,data:null};
    AUTH.pending=e2;$('[data-form="signup"]').reset();location.hash='confirmation';
  }else if(kind==='forgot'){
    /* Décision de Mickaël du 2026-10-08 : on dit si l'adresse n'a pas de compte, comme à la création de compte. */
    var fe=$('#fgEmail').value.trim().toLowerCase();
    if(!ACC[fe]){AUTH.reset=null;window.RC_CUR.sim=false;setCur(window.RC_CUR);authMsg('mot-de-passe-oublie','Aucun compte avec cette adresse. Vérifie-la, ou crée un compte.',true);return;}
    AUTH.reset=fe;window.RC_CUR.sim=true;setCur(window.RC_CUR);
    authMsg('mot-de-passe-oublie','E-mail envoyé à '+fe+' : touche le lien qu’il contient pour choisir un nouveau mot de passe.');
  }else if(kind==='newpw'){
    var n1=$('#npPw').value,n2=$('#npPw2').value;
    fieldErr('npPw',n1.length<8?'Au moins 8 caractères.':'');
    fieldErr('npPw2',n1!==n2?'Les mots de passe ne correspondent pas.':'');
    if(n1.length<8||n1!==n2){var g=$('[data-auth="nouveau-mot-de-passe"] [aria-invalid="true"]');if(g)g.focus();return;}
    var who=REEL?'REEL':(AUTH.reset&&ACC[AUTH.reset]?AUTH.reset:DEMO);ACC[who].pw=n1;ACC[who].ok=true;AUTH.reset=null;AUTH.after=null;
    login(who);say('Nouveau mot de passe enregistré.');
  }
}
function simLink(){
  if(REEL){if(cur==='auth:confirmation'){AUTH.pending=null;AUTH.after=null;login('REEL');say('E-mail confirmé. Bienvenue !');}else if(cur==='auth:mot-de-passe-oublie')location.hash='nouveau-mot-de-passe';return;}
  if(cur==='auth:confirmation'){var em=AUTH.pending;
    if(!em||!ACC[em]){say('Crée d’abord un compte : l’e-mail part à ce moment-là.');return;}
    if(ACC[em].ok&&ACC[em].data){location.hash='connexion';authMsg('connexion','Ce compte est déjà confirmé : connecte-toi.');return;}
    ACC[em].ok=true;AUTH.pending=null;AUTH.after=null;login(em);say('E-mail confirmé. Bienvenue !');
  }else if(cur==='auth:mot-de-passe-oublie'){
    if(!AUTH.reset||!ACC[AUTH.reset]){say('Aucun compte avec cette adresse : aucun e-mail n’est parti.');return;}
    location.hash='nouveau-mot-de-passe';
  }
}
document.addEventListener('submit',function(e){var f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();submitAuth(f.dataset.form);});
document.addEventListener('input',function(e){var sh=e.target.closest('.a-shell');if(!sh)return;var f=$('.a-feedback',sh);if(f&&f.classList.contains('bad'))f.hidden=true;if(e.target.getAttribute('aria-invalid'))fieldErr(e.target.id,'');});
var FRESH=false;try{FRESH=sessionStorage.getItem('rokFresh')==='1';sessionStorage.removeItem('rokFresh');}catch(e){}
try{var su=sessionStorage.getItem('rokUser');if(su&&ACC[su]){AUTH.user=su;S.email=su;}var sa=sessionStorage.getItem('rokActive');if(!REEL&&sa&&P[sa])S.active=ACC[DEMO].data.active=sa;sessionStorage.removeItem('rokActive');}catch(e){}

/* ================= Actions ================= */
function addProfileSheet(){
  var first=!ORDER.length;
  openSheet(first?'Créer mon premier profil':'Ajouter un profil','<div class="fld"><label for="npName">Nom du profil</label><input id="npName" maxlength="30" placeholder="'+(first?'Ex. Principal':'Ex. Ferme 3')+'"><small class="ferr" id="npErr" hidden></small></div>'+
    '<div class="fld"><label>Type</label><div class="chips" data-single id="npType"><button class="chip" type="button" aria-pressed="'+first+'">Principal</button><button class="chip" type="button" aria-pressed="'+!first+'">Ferme</button><button class="chip" type="button" aria-pressed="false">Secondaire</button></div></div>'+
    '<div class="fld"><label for="npId">ID joueur RoK — facultatif</label><input id="npId" inputmode="numeric" placeholder="Ex. 123456789"></div>',[['Annuler','close-sheet',''],['Créer le profil','create-profile','primary']]);
}
function createProfile(){
  var n=$('#npName').value.trim(),err=$('#npErr');if(!n){err.textContent='Donne un nom au profil.';err.hidden=false;return;}
  if(ORDER.some(function(k){return P[k].name.toLowerCase()===n.toLowerCase();})){err.textContent='Un profil porte déjà ce nom.';err.hidden=false;return;}
  var t=$('#npType .chip[aria-pressed="true"]').textContent,id='p'+Date.now();
  var v={};Object.keys(FIELDS).forEach(function(k){v[k]=null;});
  P[id]=mkProfile({name:n,type:t,icon:t==='Ferme'?'i-sprout':'i-crown',kd:'—',pid:$('#npId').value.trim(),power:'—',kills:'—',deaths:'—',gems:'—',ap:'—',tr:['','',''],releves:0,corr:0,snaps:0,v:v,
    research:[],troops:[],
    res:{food:{v:null,c:[]},wood:{v:null,c:[]},stone:{v:null,c:[]},gold:{v:null,c:[]}},gemsIn:{v:null,c:[]},acc:{build:[],research:[],train:[],heal:[],general:[]},
    obj:REEL?{title:'Aucun objectif',short:'Objectif',pct:null,href:'#optimiser'}:{title:'Renseigner le profil',short:'Profil renseigné',pct:0,href:'#ma-ville-progression'}});
  ORDER.push(id);S.active=id;closeSheet();say('Profil « '+n+' » créé. Il est maintenant actif.');location.hash='accueil';refreshAll();
}
function deleteProfile(){
  var k=S.profileView&&P[S.profileView]?S.profileView:S.active,p=P[k];
  var next=k===S.active?ORDER.filter(function(x){return x!==k;})[0]:null;
  openSheet('Supprimer le profil',(next?'<p class="shp">C’est ton profil actif : <b>'+esc(P[next].name)+'</b> deviendra le profil actif.</p>':'')+'<p class="shp">Le profil '+esc(p.name)+' sera supprimé de RoK Companion, <b>avec tout son historique</b> : bâtiments, réglages, inventaire, corrections et instantanés. Cette action est définitive. Elle n’interagit pas avec Rise of Kingdoms.</p><p class="shp muted">'+p.releves+' relevés, dont '+p.corr+' corrections · '+p.snaps+' instantané'+(p.snaps>1?'s':'')+'</p>',[['Annuler','close-sheet',''],['Supprimer','confirm-delete','danger',k]]);
}
var ACT={
  'close-sheet':closeSheet,noop:function(){},
  'add-profile':addProfileSheet,'create-profile':createProfile,
  'view-profile':function(a){location.hash='profil-'+a;},
  'activate-profile':function(){var k=S.profileView;if(P[k]){S.active=k;say('« '+P[k].name+' » est maintenant le profil actif.');refreshAll();}},
  'edit-profile':function(){var k=S.profileView&&P[S.profileView]?S.profileView:S.active,p=P[k];
    openSheet('Modifier le profil','<div class="fld"><label for="epName">Nom du profil</label><input id="epName" maxlength="30" value="'+esc(p.name)+'"><small class="ferr" id="epErr" hidden></small></div><div class="fld"><label for="epId">ID joueur RoK — facultatif</label><input id="epId" inputmode="numeric" value="'+esc(p.pid)+'"></div>',[['Annuler','close-sheet',''],['Enregistrer','save-profile','primary',k]]);},
  'save-profile':function(k){var n=$('#epName').value.trim();if(!n){var e=$('#epErr');e.textContent='Donne un nom au profil.';e.hidden=false;return;}P[k].name=n;P[k].pid=$('#epId').value.trim();closeSheet();say('Profil enregistré.');refreshAll();},
  'delete-profile':deleteProfile,
  'confirm-delete':function(k){var n=P[k].name,was=S.active===k;delete P[k];ORDER.splice(ORDER.indexOf(k),1);if(was)S.active=ORDER[0]||null;S.profileView=null;closeSheet();say('Profil « '+n+' » supprimé.'+(was&&S.active?' Profil actif : '+P[S.active].name+'.':''));location.hash='accueil';refreshAll();},
  quick:function(){S.quick=true;if(location.hash!=='#ma-ville-progression')location.hash='ma-ville-progression';renderCity();quickCount();},
  'quick-cancel':function(){S.quick=false;renderCity();},'quick-save':quickSave,
  correct:correctSheet,'save-correct':saveCorrect,
  'inv-edit':invSheet,'inv-save':invSave,'item-edit':itemSheet,'item-save':itemSave,'item-del':itemDel,
  'sample-shots':function(){S.shots=[];S.lect=null;S.lectJob=null;for(var i=0;i<15;i++)S.shots.push({});renderShots();},
  'lect-sure':function(){lectSync();S.lect.sureOk=true;renderLect();say('Éléments sûrs confirmés.');},
  'lect-relire':function(){lectSync();lireVraies(true);},
  'shot-rm':function(i){i=+i;var x=S.shots[i];if(!x)return;try{if(x.url)URL.revokeObjectURL(x.url);}catch(e){}S.shots.splice(i,1);S.lect=null;S.lectJob=null;renderShots();say('Capture retirée.');},
  analyse:analyse,'confirm-sure':function(){S.sureOk=true;renderReview();say('38 éléments sûrs confirmés.');},
  'import-save':importSave,'import-reset':importReset,
  'add-goal':function(){openSheet('Nouvel objectif','<div class="fld"><label>Type</label><div class="chips" data-single id="ngType"><button class="chip" type="button" aria-pressed="true">Bâtiment</button><button class="chip" type="button" aria-pressed="false">Recherche</button><button class="chip" type="button" aria-pressed="false">Troupes</button></div></div><div class="fld"><label for="ngName">Objectif</label><input id="ngName" placeholder="Ex. Hôpital 25"><small class="ferr" id="ngErr" hidden></small></div>',[['Annuler','close-sheet',''],['Ajouter','save-goal','primary']]);},
  'save-goal':function(){var n=$('#ngName').value.trim();if(!n){var e=$('#ngErr');e.textContent='Décris ton objectif.';e.hidden=false;return;}var t=$('#ngType .chip[aria-pressed="true"]').textContent;
    S.goals.push({t:n,icon:{'Bâtiment':'i-hall','Recherche':'t-flask','Troupes':'t-swords'}[t],pct:REEL?null:0,sub:REEL?'Le calcul de l’avancement viendra avec le plan (prévu, AJ-07).':'Ressources partagées avec l’Hôtel de ville 25 : comptées une seule fois'});closeSheet();say('Objectif ajouté.');renderOpt();},
  goal:function(i){var g=S.goals[i];openSheet(g.t,'<p class="shp">Avancement : <b>'+(g.pct==null?'pas encore calculé':g.pct+' %')+'</b>.</p><p class="shp muted">Le détail d’un objectif suit le même modèle que le plan Hôtel de ville 25 (prévu, AJ-07).</p>',[['Supprimer l’objectif','del-goal','danger',i],['Fermer','close-sheet','primary']]);},
  'del-goal':function(i){S.goals.splice(i,1);closeSheet();renderOpt();say('Objectif supprimé.');},
  'save-plan':function(){S.planSaved=true;renderOpt();say('Plan enregistré.');},
  reserve:function(){S.reserved=!S.reserved;renderOpt();say(S.reserved?'Ressources réservées pour l’Hôtel de ville 25. Rien ne change dans le jeu.':'Réservation annulée.');},
  'add-purchase':function(){openSheet('Ajouter un achat','<div class="fld"><label for="apName">Achat</label><input id="apName" placeholder="Ex. Pack de gemmes"></div><div class="fld"><label for="apPrice">Prix (€)</label><input id="apPrice" inputmode="decimal" placeholder="Ex. 4,99"><small class="ferr" id="apErr" hidden></small></div>',[['Annuler','close-sheet',''],['Ajouter','save-purchase','primary']]);},
  'save-purchase':function(){var n=$('#apName').value.trim()||'Achat',pr=Number($('#apPrice').value.replace(',','.'));if(!(pr>0)){var e=$('#apErr');e.textContent='Saisis un prix, par exemple 4,99.';e.hidden=false;return;}S.purchases.unshift([n,TODAY_S,pr]);closeSheet();renderBudget();say('Achat ajouté.');},
  'del-purchase':function(i){var x=S.purchases[i];openSheet(x[0],'<p class="shp">'+x[2].toFixed(2).replace('.',',')+' € · '+x[1]+'</p>',[['Retirer cet achat','rm-purchase','danger',i],['Fermer','close-sheet','primary']]);},
  'rm-purchase':function(i){S.purchases.splice(i,1);closeSheet();renderBudget();},
  'sim-pack':function(){S.packSim=!S.packSim;renderBudget();},
  send:function(){if(!P.f1){say('La Ferme 1 a été supprimée.');return;}S.sent=Number($('#sendIn').value);P.f1.obj.pct=Math.min(100,Math.round(S.sent/8*100));refreshAll();say(fM(S.sent)+' de pierre marqués comme envoyés : le plan est à jour.');},
  'save-time':function(){if(!S.tDays.length){say('Choisis au moins un jour.');return;}S.time=S.tLen;refreshAll();say('Temps de jeu enregistré : l’Accueil s’adapte.');},
  march:function(i){var m=S.marches[i];openSheet('Marche '+(+i+1),'<ul class="kvl"><li><span>Principal</span><b>'+esc(m.p)+'</b></li><li><span>Secondaire</span><b>'+esc(m.s)+'</b></li><li><span>Type</span><b>'+m.type+'</b></li><li><span>Formation</span><b>'+m.form+'</b></li><li><span>Équipement</span><b class="'+(m.eq?'ok':'ko')+'">'+(m.eq?'Renseigné':'Inconnu')+'</b></li></ul>',
    m.eq?[['Fermer','close-sheet','primary']]:[['Fermer','close-sheet',''],['Équipement renseigné','eq-done','primary',i]]);},
  'eq-done':function(i){S.marches[i].eq=true;closeSheet();refreshAll();say('Marche '+(+i+1)+' complète.');},
  'save-comp':function(){$$('#compList select').forEach(function(s){S.marches[+s.dataset.m][s.dataset.w]=s.value;});delete $('#compList').dataset.live;refreshAll();say('Marches enregistrées.');},
  share:function(){var a=S.marches[0];
    openSheet('Partager la comparaison','<p class="shp muted">Choisis ce qui est montré. Rien n’est publié tout seul.</p><div class="checks">'+[['shName','Nom du profil',false],['shCmd','Commandants',true],['shForm','Formation',true],['shRes','Résultats',true]].map(function(c){return '<label><input type="checkbox" id="'+c[0]+'"'+(c[2]?' checked':'')+'> '+c[1]+'</label>';}).join('')+'</div><pre class="prev" id="shPrev"></pre>',[['Fermer','close-sheet',''],['Copier le texte','copy-share','primary']]);
    updShare();},
  'copy-share':function(){copy($('#shPrev').textContent,'Texte copié.');},
  eq:function(i){var e=EQ[i];openSheet(e[1],'<p class="shp"><span class="'+e[2]+'">'+e[3]+'</span></p><ul class="kvl">'+e[4].map(function(x){return '<li><span>'+x[0]+'</span><b>'+x[1]+'</b></li>';}).join('')+'</ul>',[['Fermer','close-sheet','primary']]);},
  form:function(k){S.form=k;renderCity();},
  rep:function(i){S.rep=+i;renderCombat();},
  remind:function(k){S.reminders[k]=!S.reminders[k];renderEvents();var e=evList().filter(function(x){return x.id===k;})[0];say(S.reminders[k]?'Rappel activé : une notification te préviendra au début de « '+e.n+' » ('+fQuand(e.debut)+').':'Rappel retiré : tu ne seras pas prévenu.');},
  /* ----- En cours ----- */
  'add-encours':function(t){t=TYPES_EC[t]?t:'build';openSheet('Ajouter en cours','<div class="fld"><label>Type</label><div class="chips" data-single id="ecType">'+Object.keys(TYPES_EC).map(function(k){return '<button class="chip" type="button" data-v="'+k+'" aria-pressed="'+(k===t)+'">'+TYPES_EC[k][1]+'</button>';}).join('')+'</div></div>'+
    '<div class="fld"><label for="ecQ">Quoi</label><input id="ecQ" placeholder="Ex. Caserne 24, Tissage, Fantassins niveau 5"></div>'+
    '<div class="fld"><label for="ecT">Temps restant (comme dans le jeu)</label><input id="ecT" placeholder="Ex. 2j 4h 30m ou 04:30:00"><small class="ferr" id="ecErr" hidden></small></div>',[['Annuler','close-sheet',''],['Ajouter','save-encours','primary']]);},
  'save-encours':function(){var d=parseDuree($('#ecT').value),e=$('#ecErr');if(!d||d>400*24*H1){e.textContent='Saisis le temps restant, par exemple 2j 4h 30m ou 04:30:00.';e.hidden=false;return;}
    var t=$('#ecType .chip[aria-pressed="true"]').dataset.v,q=$('#ecQ').value.trim();A().encours.push({t:t,q:q||TYPES_EC[t][1],fin:Date.now()+d});closeSheet();renderHome();say('Ajouté : fin le '+fQuand(Date.now()+d)+'.');},
  encours:function(i){var x=A().encours[i],T=TYPES_EC[x.t]||TYPES_EC.build,fini=x.fin<=Date.now();openSheet(x.q||T[1],'<p class="shp">'+T[1]+' · '+(fini?'terminé le ':'se termine le ')+fQuand(x.fin)+(fini?'':' (dans '+fDuree(x.fin-Date.now())+')')+'.</p>',[['Retirer','del-encours','danger',i],['Fermer','close-sheet','primary']]);},
  'del-encours':function(i){A().encours.splice(+i,1);closeSheet();renderHome();},
  /* ----- Routine du jour ----- */
  'rt-toggle':function(id){var e0=$('#rtCard [data-arg="'+id+'"]');if(e0&&e0.classList.contains('leaving'))return;/* déjà en train de s'effacer : un 2e toucher ne la décoche pas */
    var k=(S.active||'')+'|'+id,on=S.routine.done[k]!==jourJeu();if(on)S.routine.done[k]=jourJeu();else delete S.routine.done[k];
    /* effet de fondu (note 9 de Mickaël, 2026-10-09) : la case se coche, puis la tâche s'efface de la liste courte */
    var el=$('#rtCard [data-arg="'+id+'"]');
    if(el&&on){el.classList.add('done','leaving');el.setAttribute('aria-pressed','true');$('.rt-box',el).innerHTML=ic('i-check');setTimeout(renderRoutine,420);}else renderRoutine();
    if(sheet.classList.contains('open')&&$('#rtAll')){$('#rtAll').innerHTML=S.routine.items.map(rtItem).join('');var b=$('#rtAll [data-arg="'+id+'"]');if(b&&on)b.classList.add('pop');}},
  'routine-all':function(){var I=S.routine.items;openSheet('Routine du jour','<p class="shp muted">Coche ce que tu as fait. Tout se décoche à la remise à zéro du jeu, à '+heureReset()+'.</p><div class="rt-list" id="rtAll">'+I.map(rtItem).join('')+'</div>',[['Modifier la liste','routine-edit',''],['Fermer','close-sheet','primary']]);},
  'routine-edit':function(){openSheet('Modifier la routine','<div id="rtEd">'+S.routine.items.map(function(x){return rtLigne(x.t,x.d,x.id);}).join('')+'</div><button class="btn sm" type="button" data-act="routine-line">'+ic('i-plus')+'Ajouter une ligne</button>',[['Annuler','close-sheet',''],['Enregistrer','routine-save','primary']]);},
  'routine-line':function(){$('#rtEd').insertAdjacentHTML('beforeend',rtLigne('','',''));var L=$$('#rtEd input.rt-t');L[L.length-1].focus();},
  'routine-rm':function(k){var r=document.getElementById(k);if(r)r.remove();},
  'routine-save':function(){var L=[];$$('#rtEd .rt-ed').forEach(function(r){var t=$('.rt-t',r).value.trim();if(!t)return;L.push({id:r.dataset.id||('r'+Date.now().toString(36)+L.length),t:t,d:$('.rt-d',r).value.trim()});});
    S.routine.items=L;S.routine.propose=false;closeSheet();renderRoutine();say('Routine enregistrée : '+L.length+' ligne'+(L.length>1?'s':'')+'.');},
  /* ----- Événements ----- */
  'add-event':function(){openSheet('Ajouter un événement','<div class="fld"><label for="evN">Nom</label><input id="evN" placeholder="Ex. Gouverneur le plus puissant"></div>'+
    '<div class="fld"><label for="evD">Début (heure de France)</label><div class="ev-dt"><input id="evD" type="date"><input id="evDh" type="time" value="02:00" aria-label="Heure de début"></div></div>'+
    '<div class="fld"><label for="evF">Fin (facultative)</label><div class="ev-dt"><input id="evF" type="date"><input id="evFh" type="time" value="02:00" aria-label="Heure de fin"></div></div>'+
    '<div class="fld"><label>Date</label><div class="chips" data-single id="evSt"><button class="chip" type="button" data-v="ok" aria-pressed="true">Confirmée</button><button class="chip" type="button" data-v="plan" aria-pressed="false">Estimée</button></div><small class="ferr" id="evErr" hidden></small></div>',[['Annuler','close-sheet',''],['Ajouter','save-event','primary']]);},
  'save-event':function(){var n=$('#evN').value.trim(),e=$('#evErr');function dt(d,h){if(!d)return null;var x=new Date(d+'T'+(h||'00:00'));return isNaN(x)?null:x.getTime();}
    var a=dt($('#evD').value,$('#evDh').value),b=dt($('#evF').value,$('#evFh').value);
    if(!n){e.textContent='Donne un nom à l’événement.';e.hidden=false;return;}if(b!=null&&a!=null&&b<=a){e.textContent='La fin doit venir après le début.';e.hidden=false;return;}
    evList().push({id:'e'+Date.now().toString(36),icon:'i-flag',n:n,debut:a,fin:b,st:a==null?'unk':$('#evSt .chip[aria-pressed="true"]').dataset.v});closeSheet();renderEvents();if(ORDER.length)renderHome();say('Événement ajouté.');},
  switch:function(k){if(!P[k])return;S.active=k;location.hash='accueil';say('Profil actif : '+P[k].name+'.');},
  eye:function(id){var i=$('#'+id),b=i.nextElementSibling;var show=i.type==='password';i.type=show?'text':'password';b.innerHTML=show?EYEOFF:EYE;b.setAttribute('aria-label',show?'Masquer le mot de passe':'Afficher le mot de passe');},
  'sheet-email':function(){openSheet('Adresse e-mail','<div class="fld"><label for="em">Nouvelle adresse e-mail</label><input id="em" type="email" value="'+esc(S.email)+'"><small class="ferr" id="emErr" hidden></small></div>',[['Annuler','close-sheet',''],['Enregistrer','save-email','primary']]);},
  'save-email':function(){var v=$('#em').value.trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){var e=$('#emErr');e.textContent='Saisis une adresse valide, par exemple nom@exemple.fr.';e.hidden=false;return;}S.email=v;closeSheet();renderPlus();say('Un lien de confirmation est envoyé à '+v+'.');},
  'sheet-password':function(){openSheet('Changer le mot de passe',pwField('pw0','Mot de passe actuel')+pwField('pw1','Nouveau mot de passe')+pwField('pw2','Confirme le nouveau mot de passe')+'<small class="ferr" id="pwErr" hidden></small>',[['Annuler','close-sheet',''],['Enregistrer','save-password','primary']]);},
  'save-password':function(){var e=$('#pwErr'),a=$('#pw0').value,b=$('#pw1').value,c=$('#pw2').value;e.hidden=true;
    if(!a){e.textContent='Saisis ton mot de passe actuel.';}else if(AUTH.user&&ACC[AUTH.user].pw!==a){e.textContent='Mot de passe actuel incorrect.';}else if(b.length<8){e.textContent='Le nouveau mot de passe doit faire au moins 8 caractères.';}else if(b!==c){e.textContent='Les deux mots de passe ne sont pas identiques.';}else{if(AUTH.user)ACC[AUTH.user].pw=b;closeSheet();say('Mot de passe changé.');return;}e.hidden=false;},
  'sheet-norok':function(){openSheet('Aucun accès à ton compte RoK','<p class="shp">L’appli ne se connecte jamais à Rise of Kingdoms : pas d’identifiant, pas de mot de passe du jeu, aucune action à ta place. Tu renseignes toi-même tes valeurs, ou tu importes tes captures, lues sur ton téléphone.</p>',[['Compris','close-sheet','primary']]);},
  'sheet-logout':function(){openSheet('Se déconnecter','<p class="shp">Tu devras te reconnecter pour retrouver tes profils. Rien n’est supprimé.</p>',[['Annuler','close-sheet',''],['Se déconnecter','logout','danger']]);},
  logout:function(){closeSheet();logout();},
  'sheet-install':function(){openSheet('Installer l’appli','<p class="shp"><b>Déjà installée sur cet appareil.</b></p><p class="shp muted">Sur un autre téléphone : ouvre l’appli dans le navigateur, puis « Ajouter à l’écran d’accueil ».</p>',[['Fermer','close-sheet','primary']]);},
  'sheet-update':function(){openSheet('Mise à jour','<p class="shp" id="updState">Ton appli est à jour (version d’exemple 1.4).</p>',[['Fermer','close-sheet',''],['Rechercher une mise à jour','check-update','primary']]);},
  'check-update':function(){var s=$('#updState');s.textContent='Recherche…';setTimeout(function(){s.textContent='Aucune nouvelle version. Ton appli est à jour.';},900);},
  'sheet-notif':function(){var L=[['codes','Nouveau code cadeau vérifié'],['events','Un événement commence'],['plan','Une étape du plan est possible'],['update','Nouvelle version de l’appli']];
    openSheet('Notifications','<p class="shp muted">Toutes facultatives.</p><div class="checks">'+L.map(function(x){return '<label class="sw"><input type="checkbox" data-notif="'+x[0]+'"'+(S.notif[x[0]]?' checked':'')+'> '+x[1]+'</label>';}).join('')+'</div>',[['Fermer','close-sheet','primary']]);},
  'sheet-export':function(){var p=A();var txt='Profil '+(p?p.name:'')+' — RoK Companion\n'+(p?Object.keys(FIELDS).map(function(k){return nomPl(k)+' : '+(valTxt(k,p.v[k])||'—');}).join('\n'):'');
    openSheet('Historique et exports','<p class="shp muted">L’export en fichier viendra avec B15. Tu peux déjà copier l’état du profil en texte.</p><pre class="prev" id="expTxt">'+esc(txt)+'</pre>',[['Fermer','close-sheet',''],['Copier le texte','copy-export','primary']]);},
  'copy-export':function(){copy($('#expTxt').textContent,'Texte copié.');},
  'sheet-lang':function(){openSheet('Langue et fuseau horaire','<div class="fld"><label for="lg">Langue</label><select id="lg"><option'+(S.lang==='Français'?' selected':'')+'>Français</option><option'+(S.lang==='English'?' selected':'')+'>English</option></select></div><div class="fld"><label for="tz">Fuseau horaire</label><select id="tz">'+['Europe/Paris','Europe/London','America/Montreal','Africa/Casablanca'].map(function(z){return '<option'+(z===S.tz?' selected':'')+'>'+z+'</option>';}).join('')+'</select></div>',[['Annuler','close-sheet',''],['Enregistrer','save-lang','primary']]);},
  'a-eye':function(id){var i=$('#'+id),b=$('[data-arg="'+id+'"]');var show=i.type==='password';i.type=show?'text':'password';b.setAttribute('aria-pressed',String(show));b.setAttribute('aria-label',b.getAttribute('aria-label').replace(show?'Afficher':'Masquer',show?'Masquer':'Afficher'));},
  resend:function(){authMsg('confirmation','E-mail renvoyé.');},
  'sim-link':simLink,
  'open-plan':function(){openPlan();},
  'save-lang':function(){S.lang=$('#lg').value;S.tz=$('#tz').value;closeSheet();renderPlus();say('Réglages enregistrés.');}
};
function updShare(){var a=S.marches[0],L=[];if($('#shName').checked)L.push('Profil : '+(A()?A().name:''));if($('#shCmd').checked)L.push('A : '+a.p+' + '+a.s+'\nB : '+a.p+' + '+S.cmpSec);if($('#shForm').checked)L.push('Formation : '+a.form);
  if($('#shRes').checked)L.push($('#cmpVerdict').textContent);$('#shPrev').textContent=L.join('\n')||'(rien de sélectionné)';}
function copy(t,msg){try{navigator.clipboard.writeText(t).then(function(){say(msg);},function(){say('Copie refusée par le navigateur : sélectionne le texte.');});}catch(e){say('Copie refusée par le navigateur : sélectionne le texte.');}}

document.addEventListener('click',function(e){
  var a=e.target.closest('[data-act]');
  if(a&&!a.disabled&&!a.classList.contains('is-off')){var f=ACT[a.dataset.act];if(f){e.preventDefault();f(a.dataset.arg);}return;}
  var c=e.target.closest('[data-copy]');if(c){copy(c.dataset.copy,'Code '+c.dataset.copy+' copié.');return;}
  var pt=e.target.closest('[data-prof]');if(pt){S.active=pt.dataset.prof;S.quick=false;refreshAll();return;}
  var tc=e.target.closest('[data-time]');if(tc){S.time=tc.dataset.time;renderHome();return;}
  var ivc=e.target.closest('[data-inv]');if(ivc){S.inv=ivc.dataset.inv;renderCity();return;}
  var cf=e.target.closest('#cmdChips [data-f]');if(cf){S.cmdF=cf.dataset.f;renderCity();return;}
  var qv=e.target.closest('.q[data-q] [data-qv]');if(qv){var q=qv.closest('.q');$$('.chip',q).forEach(function(x){x.setAttribute('aria-pressed',String(x===qv));});S.q[q.dataset.q]=qv.dataset.qv;renderReview();return;}
  var spc=e.target.closest('#spType [data-sp]');if(spc){S.spType=spc.dataset.sp;renderSpend();return;}
  var day=e.target.closest('[data-day]');if(day){var d=day.dataset.day,i=S.tDays.indexOf(d);if(i>=0)S.tDays.splice(i,1);else S.tDays.push(d);renderTime();return;}
  var tm=e.target.closest('#tMoment .chip');if(tm){S.tMoment=tm.dataset.v;renderTime();return;}
  var tl=e.target.closest('#tLen .chip');if(tl){S.tLen=tl.dataset.v;renderTime();return;}
  var sm=e.target.closest('#sesMode .chip');if(sm){S.sesMode=sm.dataset.v;renderCombat();return;}
  var bp=e.target.closest('#bilPer .chip');if(bp){S.bil=bp.dataset.v;renderBilan();return;}
  var cd=e.target.closest('[data-code]');if(cd){var co=S.codes[+cd.dataset.code];co.st=cd.dataset.cst;if(co.st==='used')co.sub=co.sub.replace(/ · utilisé.*$/,'')+' · utilisé le '+TODAY_S;renderCodes();return;}
  var lqc=e.target.closest('[data-lq] [data-lqc]');if(lqc&&S.lect){lectSync();var it=lectItem(lqc.closest('[data-lq]').dataset.lq);
    if(lqc.dataset.lqc==='ok'&&it.kind==='acc'&&!it.type){say('Choisis d’abord le type d’accélérateur.');return;}
    if(lqc.dataset.lqc==='ok'&&lectLire(it,($('#lqv'+it.id)||{}).value)==null){say(it.kind==='ville'?'Écris la valeur, par exemple 84,2 M.':'Écris la quantité (un nombre entier).');return;}
    it.choix=lqc.dataset.lqc;renderLect();return;}
  var lt=e.target.closest('[data-lq] [data-lt]');if(lt&&S.lect){lectSync();var it2=lectItem(lt.closest('[data-lq]').dataset.lq);it2.type=lt.dataset.lt;it2.choix=null;renderLect();return;}
  var ch=e.target.closest('.chips[data-single] .chip');if(ch){$$('.chip',ch.parentNode).forEach(function(x){x.setAttribute('aria-pressed',String(x===ch));});return;}
});
document.addEventListener('input',function(e){
  var t=e.target;
  if(t.matches('[data-qk]'))quickCount();
  else if(t.id==='spDays'){S.spDays=+t.value;renderSpend();}
  else if(t.id==='budIn'){S.budget=t.value===''&&REEL?null:Math.max(0,Number(t.value)||0);renderBudget();}
  else if(t.id==='sendIn')renderFarms();
  else if(t.matches('.checks input[type=checkbox]')&&$('#shPrev'))updShare();
});
document.addEventListener('change',function(e){
  var t=e.target;
  if(t.id==='kdSel'){S.kd=t.value;renderMig();}
  else if(t.id==='cmpSel'){S.cmpSec=t.value;renderCombat();}
  else if(t.matches('#compList select')){$('#compList').dataset.live='1';compCheck();}
  else if(t.matches('[data-qk]'))quickCount();
  else if(t.matches('[data-notif]')){S.notif[t.dataset.notif]=t.checked;renderPlus();}
  else if(t.id==='pickShots'){var fs=[].slice.call(t.files||[]).filter(function(f){return /^image\//.test(f.type);});t.value='';
    if(!fs.length){say('Choisis des images.');return;}
    var deja=S.shots.filter(function(x){return x.file;}),pris=fs.slice(0,Math.max(0,20-deja.length)).map(function(f){return {url:URL.createObjectURL(f),file:f};});
    if(!pris.length){say('20 captures au plus : retires-en une avant d’en ajouter.');return;}
    S.shots=deja.concat(pris);S.lect=null;S.lectJob=null;renderShots();
    say(pris.length+' capture'+(pris.length>1?'s':'')+' ajoutée'+(pris.length>1?'s':'')+(fs.length>pris.length?' (20 au plus)':'')+'.');}
  else if(t.id==='pickVideo'){var v=t.files&&t.files[0];if(v)openSheet('Vidéo choisie','<p class="shp">'+esc(v.name)+'</p><p class="shp muted">La lecture d’un enregistrement d’écran est prévue plus tard (complément B03). La vidéo reste sur ton appareil.</p>',[['Fermer','close-sheet','primary']]);t.value='';}
  else if(t.id==='pickReport'){var f=t.files&&t.files[0];if(f){S.reports.unshift({t:'Rapport importé',d:TODAY_S+' · à relire',ok:null,img:URL.createObjectURL(f),obs:'Lecture simulée dans la maquette : les valeurs lues apparaîtront ici, à corriger.',hyp:'Aucune tant que les valeurs ne sont pas relues.',abs:'À compléter après relecture.'});S.rep=0;renderCombat();say('Rapport ajouté. Il reste sur ton appareil.');}t.value='';}
});

/* Fonctions utilisées par la bulle d'outils (onglet États) */
window.RC_API={
  openPlan:openPlan,simLink:simLink,
  profiles:function(){return AUTH.user?ORDER.map(function(k){return {k:k,name:P[k].name,on:k===S.active};}):[];},
  setProfile:function(k){if(P[k]){S.active=k;S.quick=false;refreshAll();}},
  user:function(){return AUTH.user;},
  demo:function(){AUTH.after=null;if(!ACC[DEMO])return;login(DEMO);},
  empty:function(){var em='nouveau'+(Object.keys(ACC).length)+'@exemple.fr';ACC[em]={pw:'rok12345',ok:true,data:null};AUTH.after=null;login(em);say('Nouveau compte sans profil : '+em+'.');},
  logout:function(){if(AUTH.user)logout();else location.hash='connexion';},
  quick:function(){if(AUTH.user)ACT.quick();},
  /* Met la maquette dans l'état demandé puis ouvre l'écran : 'out' (déconnecté), 'demo' (compte d'essai), 'vide' (nouveau compte sans profil) ;
     'demo:f1' choisit aussi le profil actif. */
  mode:function(){return REEL?'reel':'demo';},
  /* Changer de version ne dépend jamais de l'enregistrement : on essaie d'enregistrer 2,5 s au plus (une copie reste dans ce navigateur), puis on recharge. */
  setMode:function(m){var done=false;function go(){if(done)return;done=true;try{localStorage.setItem('rc-mode',m);if(m==='demo')sessionStorage.setItem('rokUser',DEMO);}catch(e){}location.hash='accueil';location.reload();}
    try{localStorage.setItem('rc-mode',m);}catch(e){}
    if(REEL&&LOADED&&window.RC_STORE){clearTimeout(saveT);var j=null;try{j=snapshot();}catch(e){}
      if(j&&j!==lastSaved){try{window.RC_STORE.save(j).then(go,go);}catch(e){go();}setTimeout(go,2500);return;}}
    go();},
  resetReel:function(){if(!REEL||!window.RC_STORE)return;LOADED=false;window.RC_STORE.save('').then(function(){location.hash='accueil';location.reload();});},
  go:function(state,hash){
    if(REEL){say('Les tests se font dans la version Exemples (bulle › États).');return;}
    var st=(state||'').split(':'),h=(hash||'#accueil').replace(/^#/,'');
    /* toujours en haut de l'écran, même s'il était déjà affiché (remarque de Mickaël du 2026-10-09 : « Ouvrir l'écran » semblait ne rien faire) */
    function nav(){if(location.hash==='#'+h)route();else location.hash=h;setTimeout(function(){window.scrollTo(0,0);},60);}
    if(st[0]==='out'){if(AUTH.user){saveData();AUTH.user=null;try{sessionStorage.removeItem('rokUser');}catch(e){}}closeSheet();nav();return;}
    if(st[0]==='attente'){if(AUTH.user){saveData();AUTH.user=null;try{sessionStorage.removeItem('rokUser');}catch(e){}}
      var ea='attente'+(Object.keys(ACC).length)+'@exemple.fr';ACC[ea]={pw:'rok12345',ok:false,data:null};AUTH.pending=ea;closeSheet();nav();return;}
    if(st[0]==='vide'){var em='nouveau'+(Object.keys(ACC).length)+'@exemple.fr';ACC[em]={pw:'rok12345',ok:true,data:null};AUTH.after=h;login(em);return;}
    var fresh=FRESH;FRESH=false;
    if(st[0]==='demo'&&st.indexOf('neuf')>0){
      /* exemples tout neufs : on recharge (le compte d'essai reste connecté), sauf si la page vient justement d'être rechargée pour ça */
      if(!fresh){try{sessionStorage.setItem('rokUser',DEMO);sessionStorage.setItem('rokFresh','1');sessionStorage.setItem('rokActive',st[1]==='neuf'?'main':st[1]);}catch(e){}location.hash=h;location.reload();return;}
      st=['demo',st[1]==='neuf'?'main':st[1]];
    }
    if(h==='import')importReset();
    if(st[0]==='demo'){
      /* profils d'exemple supprimés pendant un test : on remet les exemples (rechargement, le compte d'essai reste connecté) */
      var need=st[1]||'main';if(!(ACC[DEMO].data&&ACC[DEMO].data.P[need])){try{sessionStorage.setItem('rokUser',DEMO);sessionStorage.setItem('rokActive',need);}catch(e){}location.hash=h;location.reload();return;}
      /* sans profil précisé, un test part du Principal : même point de départ à chaque fois */
      var pf=st[1]||'main';if(ACC[DEMO].data.P[pf])ACC[DEMO].data.active=pf;
      if(AUTH.user!==DEMO){AUTH.after=h;login(DEMO);}else{if(P[pf]&&S.active!==pf){S.active=pf;S.quick=false;refreshAll();}closeSheet();nav();}return;}
    nav();
  },
  reset:function(){try{sessionStorage.setItem('rokUser',DEMO);}catch(e){}location.hash='accueil';location.reload();}
};
paintIcons(document);paintSync();
renderShots();showStep(1);
window.addEventListener('hashchange',route);
if(REEL)startReel();else route();
/* Chaque geste peut modifier les données : on enregistre la version réelle juste après (si quelque chose a changé). */
['click','change','input'].forEach(function(t){document.addEventListener(t,function(){setTimeout(saveReel,0);});});
})();
