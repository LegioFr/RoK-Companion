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
var TODAY='8 oct. 2026';

/* ================= Données d'exemple ================= */
var CIVS=['Grèce','Maya','Rome','Allemagne','Royaume-Uni','France','Chine','Vikings','Égypte','Japon','Corée','Espagne','Arabie','Empire ottoman','Byzance'];
var FIELDS={
  hdv:{label:'Hôtel de ville',icon:'i-hall',kind:'lvl',grp:'set'},vip:{label:'Niveau VIP',icon:'n-vip',kind:'lvl',grp:'set'},
  builders:{label:'Bâtisseurs',icon:'t-hammer',kind:'count',grp:'set'},bonus:{label:'Bonus de vitesse de construction',icon:'i-gauge',kind:'pct',grp:'set'},
  civ:{label:'Civilisation',icon:'n-laurel',kind:'civ',grp:'set'},
  mur:{label:'Mur',icon:'i-wall',kind:'lvl',grp:'bld'},academie:{label:'Académie',icon:'i-temple',kind:'lvl',grp:'bld'},
  caserne:{label:'Caserne',icon:'t-swords',kind:'lvl',grp:'bld'},ecurie:{label:'Écurie',icon:'n-horseshoe',kind:'lvl',grp:'bld'},
  tir:{label:'Champ de tir',icon:'n-bow',kind:'lvl',grp:'bld'},hopital:{label:'Hôpital',icon:'i-hosp',kind:'lvl',grp:'bld'},
  siege:{label:'Atelier de siège',icon:'n-catapult',kind:'lvl',grp:'bld'}
};
var KIND={lvl:['Niveau','Nouveau niveau'],count:['Nombre','Nouveau nombre'],pct:['Bonus (en %)','Nouveau bonus (en %)'],civ:['Civilisation','Nouvelle civilisation']};
function hist(v){if(v==null)return [];if(typeof v==='string')return [{v:v,d:'4 oct. 2026',m:'',src:'Saisie'}];return [{v:v,d:'5 oct. 2026',m:'Changé en jeu',src:'Saisie'},{v:Math.max(0,v-1),d:'12 sept. 2026',m:'',src:'Import'}];}
function mkProfile(o){
  o.h={};Object.keys(FIELDS).forEach(function(k){o.h[k]=hist(o.v[k]);});return o;
}
var P={
  main:mkProfile({name:'Principal',type:'Principal',icon:'i-crown',kd:'#3567',pid:'123456789',power:'128,4 M',kills:'412,8 M',deaths:'5,6 M',gems:'185 430',ap:'6 250',
    tr:['▲ +2,1 M (7j)','▲ +12,4 M (7j)','▲ +320 K (7j)'],releves:214,corr:12,snaps:6,
    v:{hdv:24,vip:17,builders:2,bonus:null,civ:'France',mur:23,academie:24,caserne:23,ecurie:22,tir:22,hopital:23,siege:null},
    research:[['Économie',68],['Militaire',54]],troops:[['Infanterie','t-swords',5,120000],['Cavalerie','n-horseshoe',5,85000],['Archers','n-bow',4,210000],['Siège','n-catapult',4,40000]],
    res:{food:{v:32,c:[['1 M',9,1],['150 K',32,.15],['50 K',44,.05]]},wood:{v:27,c:[['1 M',8,1],['150 K',28,.15],['50 K',36,.05]]},
         stone:{v:12,c:[['750 K',4,.75],['112 K',20,.1125],['37 K',21,.0375]]},gold:{v:6.1,c:[['500 K',4,.5],['75 K',13,.075],['25 K',5,.025]]}},
    gemsIn:{v:184930,c:[['10',50,10]]},
    acc:{build:[['1 min',212,1/60],['5 min',140,5/60],['1 h',195,1],['3 h',44,3],['8 h',12,8],['1 j',3,24]],research:[['1 min',160,1/60],['1 h',176,1],['8 h',14,8],['1 j',2,24]],
         train:[['1 h',120,1],['8 h',12,8]],heal:[['1 h',52,1],['8 h',3,8]],general:[['1 h',260,1],['8 h',14,8],['1 j',3,24]]},
    obj:{title:'Hôtel de ville 25',short:'HDV 25',pct:62,href:'#plan-c25'}}),
  f1:mkProfile({name:'Ferme 1',type:'Ferme',icon:'i-sprout',kd:'#3567',pid:'',power:'18,2 M',kills:'1,2 M',deaths:'40 K',gems:'3 200',ap:'1 000',
    tr:['▲ +0,4 M (7j)','',''],releves:61,corr:2,snaps:3,
    v:{hdv:21,vip:8,builders:2,bonus:25,civ:'Rome',mur:21,academie:18,caserne:16,ecurie:15,tir:15,hopital:17,siege:12},
    research:[['Économie',41],['Militaire',22]],troops:[['Infanterie','t-swords',4,30000],['Cavalerie','n-horseshoe',3,10000],['Archers','n-bow',3,20000],['Siège','n-catapult',2,5000]],
    res:{food:{v:6,c:[]},wood:{v:7,c:[]},stone:{v:14,c:[]},gold:{v:4,c:[]}},gemsIn:{v:3200,c:[]},
    acc:{build:[['1 h',40,1]],research:[['1 h',22,1]],train:[],heal:[],general:[['1 h',30,1]]},
    obj:{title:'Envoyer de la pierre',short:'Envoi au Principal',pct:0,href:'#fermes'}}),
  f2:mkProfile({name:'Ferme 2',type:'Ferme',icon:'i-sprout',kd:'#3567',pid:'',power:'6,4 M',kills:'210 K',deaths:'8 K',gems:'450',ap:'420',
    tr:['','',''],releves:18,corr:0,snaps:1,
    v:{hdv:17,vip:6,builders:1,bonus:null,civ:null,mur:17,academie:null,caserne:12,ecurie:null,tir:11,hopital:12,siege:null},
    research:[['Économie',20],['Militaire',8]],troops:[['Infanterie','t-swords',2,8000],['Cavalerie','n-horseshoe',1,2000],['Archers','n-bow',2,6000],['Siège','n-catapult',1,0]],
    res:{food:{v:4,c:[]},wood:{v:4,c:[]},stone:{v:2,c:[]},gold:{v:2,c:[]}},gemsIn:{v:450,c:[]},
    acc:{build:[['1 h',8,1]],research:[],train:[],heal:[],general:[]},
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
  goals:[{t:'Recherche économie complète',icon:'t-flask',pct:68,sub:'Partage la pierre avec l’Hôtel de ville 25 : l’appli ne la compte qu’une fois'},{t:'300 000 fantassins niveau 5',icon:'t-swords',pct:40,sub:''}],
  budget:30,purchases:[['Pack de bâtisseur','3 oct.',9.99],['Abonnement mensuel','1er oct.',4.99],['Pack de ressources','1er oct.',9.99]],packSim:false,
  kd:'3401',tDays:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],tMoment:'soir',tLen:'30',
  marches:[{p:'Richard Ier',s:'Constantin Ier',type:'Infanterie',form:'Coin',eq:true},{p:'Guan Yu',s:'Baïbars',type:'Cavalerie',form:'Arc',eq:false},
           {p:'Charles Martel',s:'Sun Tzu',type:'Garnison',form:'Carré creux',eq:true},{p:'Aethelflaed',s:'Boudica',type:'Polyvalente',form:'Coin',eq:true}],
  cmpSec:'Charles Martel',sesMode:'field',rep:0,reminders:{},bil:'7',
  notif:{codes:true,events:true,plan:false,update:true},email:'gouverneur@exemple.fr',lang:'Français',tz:'Europe/Paris',
  codes:[{c:'AUTOMNE2026',sub:'Vérifié le 6 oct. · expire le 31 oct.',st:'try'},{c:'LEGION3567',sub:'Vérifié le 4 oct. · expiration inconnue',st:'try'},{c:'ROKETE26',sub:'Vérifié le 28 août · utilisé le 2 sept.',st:'used'}],
  spType:'research',spDays:7,shots:[],
  q:{q1:null,q2:null,q3:null},sureOk:false,
  reports:[{t:'Attaque d’une forteresse',d:'7 oct. · Marche 1',ok:true,obs:'Forteresse prise ; 2 300 blessés légers.',hyp:'Aucune.',abs:'La garnison adverse n’apparaît pas en entier.'},
           {t:'Champ ouvert contre « Ragnar »',d:'5 oct. · Marche 2',ok:false,obs:'18 400 pertes contre 9 100 chez l’adversaire.',hyp:'L’équipement du commandant secondaire, inconnu, peut expliquer l’écart.',abs:'La formation adverse n’apparaît pas sur la capture.'}]
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
var EVENTS=[['ev1','i-trophy','Gouverneur le plus puissant','Du 11 au 17 oct.','ok','Confirmé'],['ev2','n-ankh','Arche d’Osiris','14 oct.','ok','Confirmé'],['ev3','i-flag','KvK : saison 3','Vers le 19 oct.','plan','Date estimée'],['ev4','n-gift','Fête de la moisson','Date inconnue','plan','Inconnu']];

/* ================= Calculs ================= */
function A(){return P[S.active];}
function resTot(r){if(!r)return null;return r.v+r.c.reduce(function(a,c){return a+c[1]*c[2];},0);}
function accTot(a){if(!a||!a.length)return 0;return a.reduce(function(s,x){return s+x[1]*x[2];},0);}
function unknown(p){return Object.keys(FIELDS).filter(function(k){return p.v[k]==null;});}
function bonusMain(){return P.main?P.main.v.bonus:null;}
function plan(){var m=P.main;var b=m&&m.v.bonus!=null?m.v.bonus:0;var f=1+b/100;var mur=98/f,hdv=244/f;
  var recv=Math.round(S.sent*0.82*10)/10;var miss=Math.max(0,Math.round((4.2-recv)*10)/10);
  return {mur:mur,hdv:hdv,total:mur+hdv,recv:recv,miss:miss,acc:m?accTot(m.acc.build):0};}

/* ================= Liaisons simples ================= */
function bind(){
  var p=A(),pl=plan();
  var K={name:p?p.name:'',meta:p?('Royaume '+p.kd+' · HDV '+(p.v.hdv==null?'—':p.v.hdv)+' · VIP '+(p.v.vip==null?'—':p.v.vip)):'',
    power:p?p.power:'',kills:p?p.kills:'',deaths:p?p.deaths:'',gems:p?p.gems:'',ap:p?p.ap:'',tr0:p?p.tr[0]:'',tr1:p?p.tr[1]:'',tr2:p?p.tr[2]:'',
    objShort:p?p.obj.short:'',objPct:p?p.obj.pct+' %':'',objTitle:p?p.obj.title:'',
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
  var oc=$('#objCard');oc.setAttribute('href',p.obj.href);$('#objFill').style.width=p.obj.pct+'%';
  $('#objText').innerHTML=S.active==='main'?('Reste : <b>Mur 24</b>, <b>Hôtel de ville 25</b> · '+(pl.miss?'il manque <b>'+fM(pl.miss)+' de pierre</b>':'<b class="ok">pierre couverte</b>')):
    (S.active==='f1'?(S.sent?'<b class="ok">'+fM(S.sent)+' de pierre envoyés</b> au Principal':'La Ferme 1 peut envoyer de la pierre au <b>Principal</b>'):'Reste : <b>Mur 18</b> · valeurs à renseigner');
  // priorités : actions triées par importance ; on garde celles qui tiennent dans le temps choisi (décision du 2026-10-08, note 5 de Mickaël)
  var L=[];
  if(S.active==='main'){
    if(n)L.push(['#valeur-'+unknown(p)[0],'Renseigner : '+FIELDS[unknown(p)[0]].label,'Le plan en a besoin pour être juste',1]);
    L.push(['#plan-c25','Lancer le Mur niveau 24','Dernier prérequis de l’Hôtel de ville 25 · '+fH(pl.mur)+(pl.acc>=pl.mur?', couverts par tes accélérateurs':''),2]);
    L.push(pl.miss?['#fermes','Récupérer '+fM(pl.miss)+' de pierre','C’est ce qui manque à l’Hôtel de ville 25 · ta Ferme 1 peut l’envoyer',5]:['#plan-c25','Préparer l’Hôtel de ville 25','La pierre est couverte : il démarre juste après le Mur',2]);
    L.push(['#ma-ville-inventaire','Envoyer tes marches libres récolter','Le bois est ta ressource la plus basse',10]);
    L.push(['#evenements','Entraîner des fantassins niveau 5','Préparation KvK : il en manque 95 000',20]);
    L.push(['#evenements','Aider ton alliance','Dons et aides : tes points d’alliance servent au KvK',3]);
  }else if(S.active==='f1'){
    L=[['#fermes','Envoyer de la pierre au Principal','Il manque '+fM(pl.miss)+' à l’Hôtel de ville 25',5],['#valeur-mur','Lancer le Mur niveau 22','Avec ton bonus de 25 %',2],
       ['#ma-ville-inventaire','Récolter du bois','Ta ferme est sous la limite de pillage',10],['#ma-ville-inventaire','Récolter de la pierre avec une 2e marche','Pour le prochain envoi au Principal',10],['#evenements','Aider ton alliance','Dons et aides',3]];
  }else{
    L=[['#ma-ville-progression','Renseigner tes valeurs',n+' valeurs manquantes',5],['#valeur-mur','Lancer le Mur niveau 18','',2],['#ma-ville-inventaire','Récolter de la nourriture','',10],['#evenements','Aider ton alliance','',3]];
  }
  var budget=+S.time,used=0,shown=[];
  /* 5 actions au plus, pour ne pas remplir l'écran (note 8 de Mickaël, 2026-10-09) */
  L.forEach(function(x){if(shown.length<5&&used+x[3]<=budget){shown.push(x);used+=x[3];}});
  if(!shown.length)shown=[L[0]];
  $('#prioList').innerHTML=shown.map(function(x,i){return row({href:x[0],nb:i+1,title:esc(x[1]),sub:esc(x[2]),pill:pill('plan','≈ '+x[3]+' min')});}).join('')+
    '<p class="prio-sum">'+shown.length+' action'+(shown.length>1?'s':'')+' · ≈ '+used+' min sur '+(budget===60?'1 h':budget+' min')+'</p>';
  $$('#timeChips .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.time===S.time));});
  // à surveiller
  var W=[];
  unknown(p).forEach(function(k){W.push(row({href:'#valeur-'+k,icon:'i-warn',title:esc(FIELDS[k].label)+' à renseigner',sub:k==='bonus'&&S.active==='main'?'Le plan Hôtel de ville 25 l’utilise pour calculer les durées':'Valeur inconnue : elle reste « — », jamais zéro'}));});
  if(S.active==='main'){
    S.marches.forEach(function(m,i){if(!m.eq)W.push(row({href:'#combat',icon:'i-shield2',title:'Marche '+(i+1)+' incomplète',sub:'Équipement du commandant secondaire inconnu'}));});
    if(!S.imported)W.push(row({href:'#import',icon:'n-camera',title:'Inventaire relevé il y a 6 jours',sub:'Un nouvel import rendra les priorités plus justes'}));
  }
  $('#watchList').innerHTML=W.length?W.join(''):row({icon:'i-check',title:'Rien à surveiller',sub:'Tout est à jour'});
}

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
function valTxt(k,v){if(v==null)return null;if(FIELDS[k].kind==='pct')return String(v).replace('.',',')+' %';return String(v);}
/* Contrôle d'une saisie : renvoie le message d'erreur, ou '' si la valeur est bonne. Le bonus accepte une décimale (42,5 %). */
function badValue(k,v){var f=FIELDS[k];var max=f.kind==='pct'?1000:(k==='builders'?5:(k==='vip'?19:25));
  if(f.kind==='pct'){if(!isFinite(v)||v<0||v>max||Math.round(v*10)!==v*10)return 'Saisis un pourcentage entre 0 et '+max+', avec une décimale au plus (ex. 42,5).';return '';}
  if(!isFinite(v)||v<0||Math.floor(v)!==v||v>max)return 'Saisis un nombre entier entre 0 et '+max+'.';return '';}
function renderCity(){
  var p=A();if(!p)return;
  function rows(grp){return Object.keys(FIELDS).filter(function(k){return FIELDS[k].grp===grp;}).map(function(k){
    var f=FIELDS[k],v=p.v[k];
    if(S.quick){
      var inp=f.kind==='civ'?'<select data-qk="'+k+'"><option value="">— choisir</option>'+CIVS.map(function(c){return '<option'+(c===v?' selected':'')+'>'+c+'</option>';}).join('')+'</select>':
        '<input data-qk="'+k+'" inputmode="numeric" value="'+(v==null?'':v)+'" aria-label="'+esc(f.label)+'">';
      return '<div class="row qrow" data-row="'+k+'"><span class="ri">'+ic(f.icon)+'</span><span class="rc"><b>'+esc(f.label)+'</b><small class="qerr" hidden></small></span><span class="qin">'+inp+'</span></div>';
    }
    var t=valTxt(k,v);
    return row({href:'#valeur-'+k,icon:f.icon,title:esc(f.label),val:t==null?'—':esc(t),valCls:(t==null?'unk':'')+(f.kind==='civ'&&t?' small':''),valSub:t==null?'à renseigner':''});
  }).join('');}
  $('#gSet').innerHTML=rows('set');$('#gBld').innerHTML=rows('bld');
  $('#quickBar').innerHTML=S.quick?'<div class="qbar"><span id="qCount">Saisie rapide</span><div class="chips" data-single id="qMotif" hidden><button class="chip" type="button" aria-pressed="true">Changé en jeu</button><button class="chip" type="button" aria-pressed="false">Erreur de saisie</button><button class="chip" type="button" aria-pressed="false">Autre</button></div><div class="btns" style="margin-top:0"><button class="btn" type="button" data-act="quick-cancel">Annuler</button><button class="btn primary" type="button" data-act="quick-save">Enregistrer</button></div></div>':'';
  $('#gResearch').innerHTML=p.research.map(function(r){return '<div class="prow"><div class="ptop"><span>'+r[0]+'</span><span>'+r[1]+' %</span></div><div class="bar"><div class="fill" style="width:'+r[1]+'%"></div></div></div>';}).join('');
  $('#gTroops').innerHTML=p.troops.map(function(t){return row({icon:t[1],title:t[0],sub:'Niveau '+t[2],val:nb(t[3])});}).join('');
  // inventaire
  var RN=[['food','r-food','Nourriture'],['wood','r-wood','Bois'],['stone','r-stone','Pierre'],['gold','r-gold','Or']];
  function fold(icon,name,val,det,sub){return '<details class="fold"><summary><span class="ri">'+ic(icon)+'</span><span class="rc"><b>'+name+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</span><span class="rv">'+val+'</span><span class="go">'+ic('i-next2')+'</span></summary><div class="fold-b">'+det+'</div></details>';}
  var resH=RN.map(function(x){var r=p.res[x[0]];var det='<div><span>En ville</span>'+fM(r.v)+'</div>'+r.c.map(function(c){return '<div><span>Caisses de '+c[0]+'</span>'+nb(c[1])+'</div>';}).join('');return fold(x[1],x[2],fM(resTot(r)),det);}).join('');
  var g=p.gemsIn;resH+=fold('r-gem','Gemmes',nb(g.v+g.c.reduce(function(a,c){return a+c[1]*c[2];},0)),'<div><span>En ville</span>'+nb(g.v)+'</div>'+g.c.map(function(c){return '<div><span>Caisses de '+c[0]+'</span>'+nb(c[1])+'</div>';}).join(''));
  $('#gRes').innerHTML='<div class="col">'+resH+'</div><div class="col"><div class="list">'+row({icon:'p-chest',title:'Coffres de ressources',sub:'À ouvrir : leur contenu n’est pas compté',val:'7'})+row({icon:'p-pack',title:'Packs de ressources',sub:'Idem',val:'2'})+'</div></div>';
  var AN=[['build','a-build','Construction'],['research','a-research','Recherche'],['train','a-train','Entraînement'],['heal','a-heal','Soins'],['general','a-general','Généraux']];
  var accH=AN.map(function(x){var a=p.acc[x[0]]||[];var det=a.length?a.map(function(c){return '<div><span>'+c[0]+'</span>'+nb(c[1])+'</div>';}).join(''):'<div><span>Aucun</span>0</div>';return fold(x[1],x[2],a.length?fH(accTot(a)):'0 h',det,x[0]==='general'?'Utilisables partout':'');});
  $('#gAcc').innerHTML='<div class="col">'+accH.slice(0,3).join('')+'</div><div class="col">'+accH.slice(3).join('')+'</div>';
  $('#lastImport').textContent=S.active==='main'?(S.imported?'Import d’aujourd’hui':'Import du 2 oct.'):'';
  $$('#invChips .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.inv===S.inv));});
  $$('[data-invsec]').forEach(function(s){s.hidden=s.dataset.invsec!==S.inv;});
  // commandants
  var list=CMD.filter(function(c){return S.cmdF==='all'||c.t.indexOf(S.cmdF)>=0;});
  $('#cmdGrid').innerHTML=list.length?list.map(function(c){return '<div class="cmd"><div class="cmd-h"><span class="av'+(c.r==='epic'?' epic':'')+'">'+c.n[0]+'</span><span><b>'+esc(c.n)+'</b><small class="'+(c.r==='epic'?'epi':'leg')+'">'+(c.r==='epic'?'Épique':'Légendaire')+' · '+c.role+'</small></span></div><div class="meta"><span>Niv. '+c.lvl+'</span>'+c.sk+'</div></div>';}).join(''):'<p class="muted">Aucun commandant pour ce filtre.</p>';
  $$('#cmdChips .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.f===S.cmdF));});
  // équipements, formations
  $('#eqList').innerHTML=EQ.map(function(e,i){return row({act:'eq',data:i,icon:e[0],title:e[1],sub:'<span class="'+e[2]+'">'+e[3]+'</span>'});}).join('');
  $('#formList').innerHTML=Object.keys(FORMS).map(function(k){return row({act:'form',data:k,icon:FORMS[k][0],title:k,sub:'Débloquée · '+FORMS[k][1],cls:k===S.form?'sel':''});}).join('');
  $('#formTitle').textContent='Effets de la formation '+S.form;
  $('#formFx').innerHTML=FORMS[S.form][2].map(function(x){return '<li><span>'+x[0]+'</span><b'+(x[1]==='—'?' class="unk"':'')+'>'+x[1]+'</b></li>';}).join('');
}
function quickCount(){var p=A(),n=0,corr=0;$$('[data-qk]').forEach(function(el){var k=el.dataset.qk,v=el.value.trim();var old=p.v[k];if(v===''&&old==null)return;if(String(old==null?'':old)!==v){n++;if(old!=null)corr++;}});
  var qc=$('#qCount');if(qc)qc.textContent=n?n+' valeur'+(n>1?'s':'')+' modifiée'+(n>1?'s':''):'Saisie rapide';var m=$('#qMotif');if(m)m.hidden=!corr;}
function quickSave(){
  var p=A(),ok=0,bad=0,corr=0;var motif=$('#qMotif .chip[aria-pressed="true"]');motif=motif?motif.textContent:'';
  $$('[data-qk]').forEach(function(el){var k=el.dataset.qk,raw=el.value.trim(),old=p.v[k],f=FIELDS[k],r=el.closest('.qrow'),err=$('.qerr',r);
    err.hidden=true;r.classList.remove('err');
    if(raw===''||String(old==null?'':old)===raw)return;
    var v=raw;if(f.kind!=='civ'){v=Number(raw.replace(/\s/g,'').replace(',','.'));var max=f.kind==='pct'?1000:(k==='builders'?5:(k==='vip'?19:25));
      var be=badValue(k,v);if(be){err.textContent=be;err.hidden=false;r.classList.add('err');bad++;return;}}
    p.h[k].unshift({v:v,d:TODAY,m:old!=null?motif:'',src:'Saisie'});if(old!=null){corr++;p.corr++;}p.releves++;p.v[k]=v;ok++;});
  if(bad){say(ok+' valeur'+(ok>1?'s':'')+' enregistrée'+(ok>1?'s':'')+'. '+bad+' ligne'+(bad>1?'s':'')+' à corriger.');
    $$('.qrow').forEach(function(r){if(!r.classList.contains('err')){var k=r.dataset.row;var el=$('[data-qk]',r);el.value=p.v[k]==null?'':p.v[k];}});refreshAll(true);return;}
  S.quick=false;say(ok+' valeur'+(ok>1?'s':'')+' enregistrée'+(ok>1?'s':'')+'.');refreshAll();
}

/* ================= Valeur ================= */
function renderValue(){
  var p=A();if(!p)return;var k=S.valKey,f=FIELDS[k],v=p.v[k];
  $('#valTitle').textContent=f.label;$('#valLabel').textContent=KIND[f.kind][0];
  $('#valBig').textContent=v==null?'—':valTxt(k,v);$('#valBig').classList.toggle('unk',v==null);
  $('#valBtn').innerHTML=ic('i-pencil')+(v==null?'Renseigner':'Corriger');
  var h=p.h[k];
  $('#valHist').innerHTML=h.length?h.map(function(x){return row({title:esc(valTxt(k,x.v)),sub:x.d+(x.m?' · '+x.m:''),pill:pill(x.src==='Import'?'wip':'ok',x.src)});}).join(''):row({title:'Aucun relevé',sub:'Cette valeur n’a jamais été renseignée'});
}
function correctSheet(){
  var p=A(),k=S.valKey,f=FIELDS[k],v=p.v[k];
  var inp=f.kind==='civ'?'<select id="cv">'+'<option value="">— choisir</option>'+CIVS.map(function(c){return '<option'+(c===v?' selected':'')+'>'+c+'</option>';}).join('')+'</select>':'<input id="cv" inputmode="numeric" value="'+(v==null?'':v)+'">';
  openSheet((v==null?'Renseigner : ':'Corriger : ')+f.label,
    '<div class="fld"><label for="cv">'+KIND[f.kind][v==null?0:1]+'</label>'+inp+'<small class="ferr" id="cvErr" hidden></small></div>'+
    '<div class="fld"><label for="cd">Date du relevé</label><input id="cd" value="'+TODAY+'"></div>'+
    (v!=null?'<div class="fld"><label>Motif</label><div class="chips" data-single id="cm"><button class="chip" type="button" aria-pressed="true">Changé en jeu</button><button class="chip" type="button" aria-pressed="false">Erreur de saisie</button><button class="chip" type="button" aria-pressed="false">Autre</button></div></div>':''),
    [['Annuler','close-sheet',''],[v==null?'Enregistrer':'Enregistrer la correction','save-correct','primary']]);
}
function saveCorrect(){
  var p=A(),k=S.valKey,f=FIELDS[k],old=p.v[k],raw=$('#cv').value.trim(),err=$('#cvErr');err.hidden=true;
  if(raw===''){err.textContent='Saisis une valeur.';err.hidden=false;return;}
  var v=raw;if(f.kind!=='civ'){v=Number(raw.replace(/\s/g,'').replace(',','.'));var max=f.kind==='pct'?1000:(k==='builders'?5:(k==='vip'?19:25));
    var be=badValue(k,v);if(be){err.textContent=be;err.hidden=false;return;}}
  if(old!=null&&String(old)===String(v)){err.textContent='C’est déjà la valeur enregistrée.';err.hidden=false;return;}
  var m=$('#cm .chip[aria-pressed="true"]');
  p.h[k].unshift({v:v,d:$('#cd').value||TODAY,m:old!=null&&m?m.textContent:'',src:'Saisie'});p.v[k]=v;p.releves++;if(old!=null)p.corr++;
  closeSheet();say(old==null?'Valeur enregistrée.':'Correction enregistrée. L’ancienne valeur reste dans l’historique.');refreshAll();
}

/* ================= Import ================= */
var step=1,anaTimer=null;
function showStep(n){step=n;$$('[data-steppanel]').forEach(function(p){p.hidden=+p.dataset.steppanel!==n;});
  $$('#stepper .sp').forEach(function(b){var k=+b.dataset.sp;b.classList.toggle('done',k<n);if(k===n)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});}
function renderShots(){
  var n=S.shots.length;
  $('#shots').innerHTML=n?S.shots.map(function(s,i){return '<div class="shot'+(s.url?' real':'')+'">'+(s.url?'<img src="'+s.url+'" alt="Capture '+(i+1)+'">':'')+'<span class="ck">'+ic('i-check')+'</span></div>';}).join(''):'<div class="shot empty"></div><div class="shot empty"></div><div class="shot empty"></div>';
  $('#shotsInfo').textContent=n?n+' capture'+(n>1?'s':'')+' choisie'+(n>1?'s':'')+' · 20 Mo au plus':'Aucune capture choisie. Prends tes captures dans l’Inventaire du jeu, onglet par onglet.';
  $('#analyseBtn').disabled=!n;
}
function analyse(){
  showStep(2);var n=S.shots.length,t=0;clearInterval(anaTimer);
  anaTimer=setInterval(function(){t+=4;var pct=Math.min(100,t);var k=Math.min(n,Math.max(1,Math.ceil(pct/100*n)));
    $('#anaFill').style.width=pct+'%';$('#anaPct').textContent=pct+' %';$('#anaText').textContent='Lecture de la capture '+k+' sur '+n;
    if(pct>=100){clearInterval(anaTimer);setTimeout(function(){showStep(3);renderReview();},300);}},70);
}
function renderReview(){
  var todo=Object.keys(S.q).filter(function(k){return S.q[k]==null;}).length;
  $('#todoTxt').textContent=todo?todo+' à vérifier':'tout est vérifié';$('#sureTxt').textContent=S.sureOk?'38 sûrs confirmés':'38 sûrs';
  var b=$('#sureBtn');b.disabled=S.sureOk;b.innerHTML=ic('i-check')+(S.sureOk?'38 éléments confirmés':'Confirmer les 38 éléments sûrs');
  $$('.q[data-q]').forEach(function(q){var v=S.q[q.dataset.q];q.classList.toggle('done',v!=null);});
}
function importSave(){
  var kept=(S.sureOk?38:0)+Object.keys(S.q).filter(function(k){return S.q[k]==='ok';}).length;
  var skipped=(S.sureOk?0:38)+Object.keys(S.q).filter(function(k){return S.q[k]!=='ok';}).length;
  if(!kept){say('Confirme au moins un élément avant d’enregistrer.');return;}
  if(S.q.q1==='ok'){var n=Number($('#q1').value.replace(/\s/g,''));if(isFinite(n)&&n>=0){var b=P.main.acc.build;b.forEach(function(x){if(x[0]==='1 h')x[1]=n;});}}
  if(S.q.q3==='ok'){P.main.res.stone.v=12;}
  S.imported=true;P.main.releves+=kept;if(S.q.q3==='ok')P.main.corr++;
  $('#resTitle').textContent=kept+' valeur'+(kept>1?'s':'')+' enregistrée'+(kept>1?'s':'');
  $('#resText').textContent=(S.q.q3==='ok'?'1 correction avec un motif. Les anciennes valeurs restent dans l’historique. ':'')+(skipped?skipped+' élément'+(skipped>1?'s':'')+' non vérifié'+(skipped>1?'s':'')+' : pas enregistré'+(skipped>1?'s':'')+'.':'');
  showStep(4);refreshAll();
}
function importReset(){S.shots=[];S.q={q1:null,q2:null,q3:null};S.sureOk=false;$$('.q .chip').forEach(function(c){c.setAttribute('aria-pressed','false');});renderShots();renderReview();showStep(1);}

/* ================= Optimiser ================= */
function renderOpt(){
  var p=A(),pl=plan();if(!p)return;
  var c=$('#optCard');c.setAttribute('href',p.obj.href);$('#optFill').style.width=p.obj.pct+'%';
  $('#optText').innerHTML=S.active==='main'?('<b>62 %</b> · encore <b>'+fH(pl.total)+'</b> de construction · '+(pl.miss?'il manque <b>'+fM(pl.miss)+' de pierre</b>':'<b class="ok">pierre couverte</b>')):
    (S.active==='f1'?'Ta ferme sert à envoyer de la pierre au Principal.':'Monte ton Mur puis ton Hôtel de ville.');
  $('#goalList').innerHTML=S.goals.map(function(g,i){return row({icon:g.icon,title:esc(g.t),sub:esc(g.sub),val:g.pct+' %',act:'goal',data:i,go:false});}).join('');
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
  $('#resNote').textContent='Pierre disponible : 18 M, dont 2 M réservés pour la recherche'+(pl.recv?', plus '+fM(pl.recv)+' reçus de la Ferme 1':'')+'. '+(S.reserved?'Ressources du plan réservées : elles ne comptent plus pour les autres objectifs.':'Rien n’est encore réservé pour ce plan.');
  var b=bonusMain();
  $('#planData').innerHTML=row({icon:'i-hall',title:'Hôtel de ville '+P.main.v.hdv+', Mur '+P.main.v.mur,sub:'Saisis le 5 oct.',pill:pill('ok','À jour')})+
    row({icon:'n-camera',title:'Ressources et accélérateurs',sub:S.imported?'Import d’aujourd’hui':'Import du 2 oct.',pill:pill(S.imported?'ok':'wip',S.imported?'À jour':'6 jours'),href:S.imported?null:'#import',go:!S.imported})+
    (b==null?row({href:'#valeur-bonus',icon:'i-warn',title:'Bonus de vitesse de construction',sub:'Inconnu : les durées sont calculées sans bonus, donc trop longues'}):
      row({href:'#valeur-bonus',icon:'i-gauge',title:'Bonus de vitesse de construction : '+b+' %',sub:'Les durées en tiennent compte'}));
  var sv=$('#planSaved');sv.innerHTML='<i></i>'+(S.planSaved?'Plan enregistré aujourd’hui':'Plan enregistré le 6 oct.');
  $('#reserveBtn').innerHTML=ic('i-lock')+(S.reserved?'Annuler la réservation':'Réserver les ressources');
}
function renderSpend(){
  var T={research:['recherche','Tissage','Recherche terminée'],build:['construction','Mur 24','Mur terminé'],train:['entraînement','fantassins niveau 5','Troupes prêtes']}[S.spType];
  var d=S.spDays;$('#spTitle').textContent='Utiliser '+d+' jour'+(d>1?'s':'')+' d’accélérateurs de '+T[0]+' ?';$('#spDaysV').textContent=d+' j';
  var pts=nb(d*30000);
  $('#spA').innerHTML='<li><span>'+T[2]+'</span><b>8 oct.</b></li><li><span>Points d’événement</span><b>0</b></li><li><span>Hôtel de ville 25</span><b>'+(S.spType==='build'?'<span class="ok">avance</span>':'inchangé')+'</b></li>';
  $('#spB').innerHTML='<li><span>'+T[2]+'</span><b>11 oct.</b></li><li><span>Points d’événement</span><b class="ok">≈ '+pts+'</b></li><li><span>Hôtel de ville 25</span><b>'+(S.spType==='build'?'<span class="ko">3 jours de retard</span>':'inchangé')+'</b></li>';
  $('#spAdvice').innerHTML=S.spType==='build'?'<b>Dépenser maintenant.</b> Le Mur est sur le chemin de l’Hôtel de ville 25 : attendre le retarderait de 3 jours pour ≈ '+pts+' points. Ce que l’appli ne sait pas : les récompenses exactes de cette édition.':
    '<b>Attendre 3 jours.</b> Le Gouverneur le plus puissant commence le 11 oct. (date confirmée) et l’'+T[0]+' y rapporte ≈ '+pts+' points ; elle ne bloque aucun de tes objectifs. Ce que l’appli ne sait pas : les récompenses exactes de cette édition.';
  $$('#spType .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.sp===S.spType));});
}
function renderBudget(){
  var tot=S.purchases.reduce(function(a,x){return a+x[2];},0);var pct=S.budget?Math.min(100,tot/S.budget*100):100;
  $('#budTxt').textContent=tot.toFixed(2).replace('.',',')+' € sur '+S.budget+' €';$('#budFill').style.width=pct+'%';
  $('#budFill').style.background=tot>S.budget?'linear-gradient(110deg,#c0503a,#ef8a74)':'';
  $('#budList').innerHTML=S.purchases.map(function(x,i){return row({icon:'p-pack',title:esc(x[0]),sub:x[1],val:x[2].toFixed(2).replace('.',',')+' €',act:'del-purchase',data:i,go:false});}).join('')+(tot>S.budget?'<div class="note" style="margin-top:4px">'+ic('i-warn')+'<span>Budget dépassé de '+(tot-S.budget).toFixed(2).replace('.',',')+' €.</span></div>':'');
  $('#packFx').innerHTML=S.packSim?'Effet sur ton plan : <b class="ok">Hôtel de ville 25 atteint 6 jours plus tôt</b>, plus de pierre manquante. Budget après achat : <b>'+(tot+9.99).toFixed(2).replace('.',',')+' € sur '+S.budget+' €</b>.':'Simule-le pour voir son effet sur ton plan et ton budget.';
  $('#packBtn').textContent=S.packSim?'Arrêter la simulation':'Simuler ce pack';
}
function renderFarms(){
  var pl=plan();
  $('#farmList').innerHTML=(P.f1?row({act:'switch',data:'f1',icon:'i-sprout',title:esc(P.f1.name),sub:'HDV 21 · relevé il y a 2 jours',val:'31 M<small>ressources</small>'}):'')+
    (P.f2?row({act:'switch',data:'f2',icon:'i-sprout',title:esc(P.f2.name),sub:'HDV 17 · relevé il y a 9 jours',val:'12 M<small>ressources</small>'}):'');
  var v=Number($('#sendIn').value),r=Math.round(v*0.82*10)/10;$('#sendV').textContent=fM(v);
  var cover=r>=4.2;
  $('#sendTxt').innerHTML='Il manque <b>4,2 M de pierre</b> au Principal. Envoyer <b>'+fM(v)+'</b> donne <b>'+fM(r)+'</b> reçus après la taxe de 18 % : '+(cover?'<b class="ok">ça suffit</b>.':'<b class="ko">il manquera encore '+fM(4.2-r)+'</b>.')+(S.sent?' Déjà marqué comme envoyé : '+fM(S.sent)+'.':'');
}
function renderMig(){
  var need={'3401':28,'3402':34,'2988':19}[S.kd],have=12;$('#kdSel').value=S.kd;
  $('#kdNeed').textContent=need;$('#kdHave').textContent=have;$('#kdHave').className='tv '+(have>=need?'ok':'ko');
  $('#kdTxt').innerHTML=have>=need?'<b class="ok">Tu as assez de passeports.</b>':'Il te manque <b class="ko">'+(need-have)+' passeports</b>. Ils dépendent de ta puissance (128,4 M).';
  var food=resTot(P.main.res.food);
  $('#kdCond').innerHTML=row({icon:'i-check',title:'Hôtel de ville 7 ou plus'})+
    row({icon:food>40?'i-warn':'i-check',title:'Ressources sous la limite',sub:'Nourriture : '+fM(food)+' pour 40 M autorisés'})+row({icon:'n-info',title:'Hors alliance',sub:'À vérifier dans le jeu'});
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
  $('#cmpVerdict').innerHTML='<b>'+(da>0?'B frappe plus fort (+'+da.toFixed(1).replace('.',',')+' % d’attaque)':da<0?'A frappe plus fort (+'+(-da).toFixed(1).replace('.',',')+' % d’attaque)':'Même attaque')+(dd>0?', A tient mieux (+'+dd.toFixed(1).replace('.',',')+' % de défense).':dd<0?', B tient mieux (+'+(-dd).toFixed(1).replace('.',',')+' % de défense).':', même défense.')+'</b> Les compétences actives ne sont pas encore comparées : le résultat d’un vrai combat peut être différent.';
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
  $('#repBody').innerHTML=(r.img?'<img class="repimg" src="'+r.img+'" alt="Capture du rapport">':'')+'<p><b>Observé :</b> '+esc(r.obs)+'</p><p><b>Hypothèse :</b> '+esc(r.hyp)+'</p><p><b>Absent :</b> '+esc(r.abs)+'</p>';
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
  $('#evList').innerHTML=EVENTS.map(function(e){var on=S.reminders[e[0]],can=e[4]==='ok'||e[5]==='Date estimée';
    return '<div class="row ev-row"><span class="ri">'+ic(e[1])+'</span><span class="rc"><b>'+e[2]+'</b><small>'+e[3]+(can?' · '+pill(e[4],e[5]):' · pas de rappel possible')+'</small></span>'+
      (can?'<button class="btn sm ev-rem'+(on?' on':'')+'" type="button" data-act="remind" data-arg="'+e[0]+'" aria-pressed="'+!!on+'">'+ic('i-bell')+(on?'Rappel activé':'Me prévenir')+'</button>':'')+'</div>';}).join('');
  var full=S.marches.filter(function(m){return m.eq;}).length;var t5=P.main.troops[0][3]+P.main.troops[1][3];
  var K=[[true,'Accélérateurs de soins','3 j 4 h · objectif 3 j','#ma-ville-inventaire'],[t5>=300000,'Troupes niveau 5',nb(t5)+' · objectif 300 000','#ma-ville-progression'],
    [full===4,'Marches complètes',full+' sur 4'+(full<4?' · une marche incomplète':''),'#combat'],[true,'Ressources pour soigner','Couvertes par tes réserves',null]];
  var bad=K.filter(function(x){return !x[0];}).length;var kp=$('#kvkPill');kp.className='pill st-'+(bad?'warn':'ok');kp.innerHTML='<i></i>'+(bad?bad+' à préparer':'Prêt');
  $('#kvkList').innerHTML=K.map(function(x){return row({href:x[3],icon:x[0]?'i-check':'i-warn',title:x[1],sub:x[2],go:!!x[3]&&!x[0]});}).join('');
}
function renderBilan(){
  var w=S.bil==='7';
  var L=w?[['i-bolt','Puissance','+2,1 M','ok'],['i-temple','Académie 23 → 24','+1','ok'],['r-stone','Pierre','−6 M','ko'],['i-target','Hôtel de ville 25','+8 %','ok']]:
    [['i-bolt','Puissance','+7,8 M','ok'],['i-temple','Académie 22 → 24','+2','ok'],['t-swords','Caserne 22 → 23','+1','ok'],['r-stone','Pierre','−11 M','ko'],['i-target','Hôtel de ville 25','+21 %','ok']];
  $('#bilList').innerHTML=L.map(function(x){return row({icon:x[0],title:x[1],val:x[2],valCls:x[3]});}).join('');
  $('#bilNotes').innerHTML='<div class="note">'+ic('n-info')+'<span>'+(w?'Aucun relevé du 1er au 3 oct. : l’appli ne sait pas ce qui s’est passé ces jours-là.':'3 périodes sans relevé ce mois-ci (6 jours au total) : elles ne sont pas reconstituées.')+'</span></div><div class="note" style="margin-top:8px">'+ic('i-warn')+'<span>'+(plan().miss?'Blocage : la pierre manque pour l’Hôtel de ville 25.':'Plus de blocage : la pierre de l’Hôtel de ville 25 est couverte.')+'</span></div>';
  $$('#bilPer .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.v===S.bil));});
}
function renderCodes(){
  var L={try:'À essayer',used:'Utilisé',ref:'Refusé'};
  $('#codeList').innerHTML=S.codes.map(function(c,i){return '<div class="q'+(c.st==='used'?' done':'')+'"><div class="q-h"><span class="crop">'+ic('n-gift')+'</span><span class="rc"><b class="num">'+c.c+'</b><small>'+c.sub+'</small></span><button class="btn sm" type="button" data-copy="'+c.c+'">'+ic('n-copy')+'Copier</button></div>'+
    '<div class="chips">'+Object.keys(L).map(function(k){return '<button class="chip" type="button" data-code="'+i+'" data-cst="'+k+'" aria-pressed="'+(c.st===k)+'">'+L[k]+'</button>';}).join('')+'</div></div>';}).join('');
  var n=S.codes.filter(function(c){return c.st==='try';}).length;$('#codesTxt').textContent=n?n+' code'+(n>1?'s':'')+' à essayer':'Aucun code à essayer';
}
function renderPlus(){
  $('#emailTxt').textContent=S.email;$('#langTxt').textContent=S.lang+' · '+S.tz;
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
  var h=(location.hash||'').slice(1)||'accueil',id=h,sub=null;
  if(AUTH_IDS.indexOf(h)>=0){showAuth(h);return;}
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
  renderSpend();renderBudget();if(P.main){renderFarms();renderMig();renderCombat();renderEvents();renderBilan();}renderTime();renderCodes();renderPlus();
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
  P=a.data.P;ORDER=a.data.ORDER;S.active=a.data.active;S.profileView=null;S.quick=false;S.email=email;AUTH.user=email;
  try{if(email===DEMO)sessionStorage.setItem('rokUser',email);else sessionStorage.removeItem('rokUser');}catch(e){}
  $$('.a-shell form').forEach(function(f){f.reset();});AUTH_IDS.forEach(function(id){authMsg(id,'');});
  var to=AUTH.after&&AUTH_IDS.indexOf(AUTH.after)<0?AUTH.after:'accueil';AUTH.after=null;
  if(location.hash==='#'+to)route();else location.hash=to;
}
function logout(){saveData();AUTH.user=null;try{sessionStorage.removeItem('rokUser');}catch(e){}location.hash='connexion';authMsg('connexion','Tu es déconnecté. Tes profils restent enregistrés.');}
var MAILRE=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function submitAuth(kind){
  if(kind==='login'){
    var em=$('#liEmail').value.trim().toLowerCase(),pw=$('#liPw').value,a=ACC[em];
    if(!a||a.pw!==pw){authMsg('connexion','E-mail ou mot de passe incorrect.',true);return;}
    if(!a.ok){AUTH.pending=em;location.hash='confirmation';authMsg('confirmation','Confirme d’abord ton e-mail : touche le lien reçu.');return;}
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
    var who=AUTH.reset&&ACC[AUTH.reset]?AUTH.reset:DEMO;ACC[who].pw=n1;ACC[who].ok=true;AUTH.reset=null;AUTH.after=null;
    login(who);say('Nouveau mot de passe enregistré.');
  }
}
function simLink(){
  if(cur==='auth:confirmation'){var em=AUTH.pending;
    if(!em||!ACC[em]){say('Crée d’abord un compte : l’e-mail part à ce moment-là.');return;}
    if(ACC[em].ok&&ACC[em].data){location.hash='connexion';authMsg('connexion','Ce compte est déjà confirmé : connecte-toi.');return;}
    ACC[em].ok=true;AUTH.pending=null;AUTH.after=null;login(em);say('E-mail confirmé. Bienvenue !');
  }else if(cur==='auth:mot-de-passe-oublie'){
    if(!AUTH.reset||!ACC[AUTH.reset]){say('Aucun compte avec cette adresse : aucun e-mail n’est parti.');return;}
    location.hash='nouveau-mot-de-passe';
  }
}
document.addEventListener('submit',function(e){var f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();submitAuth(f.dataset.form);});
document.addEventListener('input',function(e){var sh=e.target.closest('.a-shell');if(!sh)return;var f=$('.a-feedback',sh);if(f&&f.classList.contains('bad'))f.hidden=true;if(e.target.getAttribute('aria-invalid'))fieldErr(e.target.id,'');});
var FRESH=false;try{FRESH=sessionStorage.getItem('rokFresh')==='1';sessionStorage.removeItem('rokFresh');}catch(e){}
try{var su=sessionStorage.getItem('rokUser');if(su&&ACC[su]){AUTH.user=su;S.email=su;}var sa=sessionStorage.getItem('rokActive');if(sa&&P[sa])S.active=ACC[DEMO].data.active=sa;sessionStorage.removeItem('rokActive');}catch(e){}

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
    research:[['Économie',0],['Militaire',0]],troops:[['Infanterie','t-swords','—',0],['Cavalerie','n-horseshoe','—',0],['Archers','n-bow','—',0],['Siège','n-catapult','—',0]],
    res:{food:{v:0,c:[]},wood:{v:0,c:[]},stone:{v:0,c:[]},gold:{v:0,c:[]}},gemsIn:{v:0,c:[]},acc:{build:[],research:[],train:[],heal:[],general:[]},
    obj:{title:'Renseigner le profil',short:'Profil renseigné',pct:0,href:'#ma-ville-progression'}});
  ORDER.push(id);S.active=id;closeSheet();say('Profil « '+n+' » créé. Il est maintenant actif.');location.hash='accueil';refreshAll();
}
function deleteProfile(){
  var k=S.profileView&&P[S.profileView]?S.profileView:S.active,p=P[k];
  var next=k===S.active?ORDER.filter(function(x){return x!==k;})[0]:null;
  openSheet('Supprimer le profil',(next?'<p class="shp">C’est ton profil actif : <b>'+esc(P[next].name)+'</b> deviendra le profil actif.</p>':'')+'<p class="shp">Le profil '+esc(p.name)+' sera supprimé de RoK Companion, <b>avec tout son historique</b> : bâtiments, réglages, inventaire, corrections et instantanés. Cette action est définitive. Elle n’interagit pas avec Rise of Kingdoms.</p><p class="shp muted">'+p.releves+' relevés, dont '+p.corr+' corrections · '+p.snaps+' instantané'+(p.snaps>1?'s':'')+'</p>',[['Annuler','close-sheet',''],['Supprimer','confirm-delete','danger',k]]);
}
var ACT={
  'close-sheet':closeSheet,noop:function(){},
  'add-profile':addProfileSheet,'create-profile':createProfile,
  'view-profile':function(a){location.hash='profil-'+a;},
  'activate-profile':function(){var k=S.profileView;if(P[k]){S.active=k;say('« '+P[k].name+' » est maintenant le profil actif.');refreshAll();}},
  'edit-profile':function(){var k=S.profileView&&P[S.profileView]?S.profileView:S.active,p=P[k];
    openSheet('Modifier le profil','<div class="fld"><label for="epName">Nom du profil</label><input id="epName" maxlength="30" value="'+esc(p.name)+'"><small class="ferr" id="epErr" hidden></small></div><div class="fld"><label for="epId">ID joueur RoK — facultatif</label><input id="epId" inputmode="numeric" value="'+esc(p.pid)+'"></div>',[['Annuler','close-sheet',''],['Enregistrer','save-profile','primary',k]]);},
  'save-profile':function(k){var n=$('#epName').value.trim();if(!n){var e=$('#epErr');e.textContent='Donne un nom au profil.';e.hidden=false;return;}P[k].name=n;P[k].pid=$('#epId').value.trim();closeSheet();say('Profil enregistré.');refreshAll();},
  'delete-profile':deleteProfile,
  'confirm-delete':function(k){var n=P[k].name,was=S.active===k;delete P[k];ORDER.splice(ORDER.indexOf(k),1);if(was)S.active=ORDER[0]||null;S.profileView=null;closeSheet();say('Profil « '+n+' » supprimé.'+(was&&S.active?' Profil actif : '+P[S.active].name+'.':''));location.hash='accueil';refreshAll();},
  quick:function(){S.quick=true;if(location.hash!=='#ma-ville-progression')location.hash='ma-ville-progression';renderCity();quickCount();},
  'quick-cancel':function(){S.quick=false;renderCity();},'quick-save':quickSave,
  correct:correctSheet,'save-correct':saveCorrect,
  'sample-shots':function(){S.shots=[];for(var i=0;i<15;i++)S.shots.push({});renderShots();},
  analyse:analyse,'confirm-sure':function(){S.sureOk=true;renderReview();say('38 éléments sûrs confirmés.');},
  'import-save':importSave,'import-reset':importReset,
  'add-goal':function(){openSheet('Nouvel objectif','<div class="fld"><label>Type</label><div class="chips" data-single id="ngType"><button class="chip" type="button" aria-pressed="true">Bâtiment</button><button class="chip" type="button" aria-pressed="false">Recherche</button><button class="chip" type="button" aria-pressed="false">Troupes</button></div></div><div class="fld"><label for="ngName">Objectif</label><input id="ngName" placeholder="Ex. Hôpital 25"><small class="ferr" id="ngErr" hidden></small></div>',[['Annuler','close-sheet',''],['Ajouter','save-goal','primary']]);},
  'save-goal':function(){var n=$('#ngName').value.trim();if(!n){var e=$('#ngErr');e.textContent='Décris ton objectif.';e.hidden=false;return;}var t=$('#ngType .chip[aria-pressed="true"]').textContent;
    S.goals.push({t:n,icon:{'Bâtiment':'i-hall','Recherche':'t-flask','Troupes':'t-swords'}[t],pct:0,sub:'Ressources partagées avec l’Hôtel de ville 25 : comptées une seule fois'});closeSheet();say('Objectif ajouté.');renderOpt();},
  goal:function(i){var g=S.goals[i];openSheet(g.t,'<p class="shp">Avancement : <b>'+g.pct+' %</b>.</p><p class="shp muted">Le détail d’un objectif suit le même modèle que le plan Hôtel de ville 25 (prévu, AJ-07).</p>',[['Supprimer l’objectif','del-goal','danger',i],['Fermer','close-sheet','primary']]);},
  'del-goal':function(i){S.goals.splice(i,1);closeSheet();renderOpt();say('Objectif supprimé.');},
  'save-plan':function(){S.planSaved=true;renderOpt();say('Plan enregistré.');},
  reserve:function(){S.reserved=!S.reserved;renderOpt();say(S.reserved?'Ressources réservées pour l’Hôtel de ville 25. Rien ne change dans le jeu.':'Réservation annulée.');},
  'add-purchase':function(){openSheet('Ajouter un achat','<div class="fld"><label for="apName">Achat</label><input id="apName" placeholder="Ex. Pack de gemmes"></div><div class="fld"><label for="apPrice">Prix (€)</label><input id="apPrice" inputmode="decimal" placeholder="Ex. 4,99"><small class="ferr" id="apErr" hidden></small></div>',[['Annuler','close-sheet',''],['Ajouter','save-purchase','primary']]);},
  'save-purchase':function(){var n=$('#apName').value.trim()||'Achat',pr=Number($('#apPrice').value.replace(',','.'));if(!(pr>0)){var e=$('#apErr');e.textContent='Saisis un prix, par exemple 4,99.';e.hidden=false;return;}S.purchases.unshift([n,'8 oct.',pr]);closeSheet();renderBudget();say('Achat ajouté.');},
  'del-purchase':function(i){var x=S.purchases[i];openSheet(x[0],'<p class="shp">'+x[2].toFixed(2).replace('.',',')+' € · '+x[1]+'</p>',[['Retirer cet achat','rm-purchase','danger',i],['Fermer','close-sheet','primary']]);},
  'rm-purchase':function(i){S.purchases.splice(i,1);closeSheet();renderBudget();},
  'sim-pack':function(){S.packSim=!S.packSim;renderBudget();},
  send:function(){if(!P.f1){say('La Ferme 1 a été supprimée.');return;}S.sent=Number($('#sendIn').value);P.f1.obj.pct=Math.min(100,Math.round(S.sent/8*100));refreshAll();say(fM(S.sent)+' de pierre marqués comme envoyés : le plan est à jour.');},
  'save-time':function(){if(!S.tDays.length){say('Choisis au moins un jour.');return;}S.time=S.tLen;refreshAll();say('Temps de jeu enregistré : l’Accueil s’adapte.');},
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
  remind:function(k){S.reminders[k]=!S.reminders[k];renderEvents();var e=EVENTS.filter(function(x){return x[0]===k;})[0];say(S.reminders[k]?'Rappel activé : une notification te préviendra au début de « '+e[2]+' » ('+e[3]+').':'Rappel retiré : tu ne seras pas prévenu.');},
  switch:function(k){if(!P[k])return;S.active=k;location.hash='accueil';say('Profil actif : '+P[k].name+'.');},
  eye:function(id){var i=$('#'+id),b=i.nextElementSibling;var show=i.type==='password';i.type=show?'text':'password';b.innerHTML=show?EYEOFF:EYE;b.setAttribute('aria-label',show?'Masquer le mot de passe':'Afficher le mot de passe');},
  'sheet-email':function(){openSheet('Adresse e-mail','<div class="fld"><label for="em">Nouvelle adresse e-mail</label><input id="em" type="email" value="'+esc(S.email)+'"><small class="ferr" id="emErr" hidden></small></div>',[['Annuler','close-sheet',''],['Enregistrer','save-email','primary']]);},
  'save-email':function(){var v=$('#em').value.trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){var e=$('#emErr');e.textContent='Saisis une adresse valide, par exemple nom@exemple.fr.';e.hidden=false;return;}S.email=v;closeSheet();renderPlus();say('Un lien de confirmation est envoyé à '+v+'.');},
  'sheet-password':function(){openSheet('Changer le mot de passe',pwField('pw0','Mot de passe actuel')+pwField('pw1','Nouveau mot de passe')+pwField('pw2','Confirme le nouveau mot de passe')+'<small class="ferr" id="pwErr" hidden></small>',[['Annuler','close-sheet',''],['Enregistrer','save-password','primary']]);},
  'save-password':function(){var e=$('#pwErr'),a=$('#pw0').value,b=$('#pw1').value,c=$('#pw2').value;e.hidden=true;
    if(!a){e.textContent='Saisis ton mot de passe actuel.';}else if(AUTH.user&&ACC[AUTH.user].pw!==a){e.textContent='Mot de passe actuel incorrect.';}else if(b.length<8){e.textContent='Le nouveau mot de passe doit faire au moins 8 caractères.';}else if(b!==c){e.textContent='Les deux mots de passe ne sont pas identiques.';}else{if(AUTH.user)ACC[AUTH.user].pw=b;closeSheet();say('Mot de passe changé.');return;}e.hidden=false;},
  'sheet-norok':function(){openSheet('Aucun accès à ton compte RoK','<p class="shp">L’appli ne se connecte jamais à Rise of Kingdoms : pas d’identifiant, pas de mot de passe du jeu, aucune action à ta place. Tu renseignes toi-même tes valeurs, ou tu importes tes captures, lues sur ton téléphone.</p>',[['Compris','close-sheet','primary']]);},
  'sheet-logout':function(){openSheet('Se déconnecter','<p class="shp">Tu devras te reconnecter pour retrouver tes profils. Rien n’est supprimé.</p>',[['Annuler','close-sheet',''],['Se déconnecter','logout','danger']]);},
  logout:function(){closeSheet();logout();},
  'sheet-install':function(){openSheet('Installer l’appli','<p class="shp"><b>Déjà installée sur cet appareil.</b></p><p class="shp muted">Sur un autre téléphone : ouvre l’appli dans le navigateur, puis « Ajouter à l’écran d’accueil ».</p>',[['Fermer','close-sheet','primary']]);},
  'sheet-update':function(){openSheet('Mise à jour','<p class="shp" id="updState">Ton appli est à jour (version d’exemple 1.4).</p>',[['Fermer','close-sheet',''],['Rechercher une mise à jour','check-update','primary']]);},
  'check-update':function(){var s=$('#updState');s.textContent='Recherche…';setTimeout(function(){s.textContent='Aucune nouvelle version. Ton appli est à jour.';},900);},
  'sheet-notif':function(){var L=[['codes','Nouveau code cadeau vérifié'],['events','Un événement commence'],['plan','Une étape du plan est possible'],['update','Nouvelle version de l’appli']];
    openSheet('Notifications','<p class="shp muted">Toutes facultatives.</p><div class="checks">'+L.map(function(x){return '<label class="sw"><input type="checkbox" data-notif="'+x[0]+'"'+(S.notif[x[0]]?' checked':'')+'> '+x[1]+'</label>';}).join('')+'</div>',[['Fermer','close-sheet','primary']]);},
  'sheet-export':function(){var p=A();var txt='Profil '+(p?p.name:'')+' — RoK Companion\n'+(p?Object.keys(FIELDS).map(function(k){return FIELDS[k].label+' : '+(p.v[k]==null?'—':valTxt(k,p.v[k]));}).join('\n'):'');
    openSheet('Historique et exports','<p class="shp muted">L’export en fichier viendra avec B15. Tu peux déjà copier l’état du profil en texte.</p><pre class="prev" id="expTxt">'+esc(txt)+'</pre>',[['Fermer','close-sheet',''],['Copier le texte','copy-export','primary']]);},
  'copy-export':function(){copy($('#expTxt').textContent,'Texte copié.');},
  'sheet-lang':function(){openSheet('Langue et fuseau horaire','<div class="fld"><label for="lg">Langue</label><select id="lg"><option'+(S.lang==='Français'?' selected':'')+'>Français</option><option'+(S.lang==='English'?' selected':'')+'>English</option></select></div><div class="fld"><label for="tz">Fuseau horaire</label><select id="tz">'+['Europe/Paris','Europe/London','America/Montreal','Africa/Casablanca'].map(function(z){return '<option'+(z===S.tz?' selected':'')+'>'+z+'</option>';}).join('')+'</select></div>',[['Annuler','close-sheet',''],['Enregistrer','save-lang','primary']]);},
  'a-eye':function(id){var i=$('#'+id),b=$('[data-arg="'+id+'"]');var show=i.type==='password';i.type=show?'text':'password';b.setAttribute('aria-pressed',String(show));b.setAttribute('aria-label',b.getAttribute('aria-label').replace(show?'Afficher':'Masquer',show?'Masquer':'Afficher'));},
  resend:function(){authMsg('confirmation','E-mail renvoyé.');},
  'sim-link':simLink,
  'open-plan':function(){openPlan();},
  'save-lang':function(){S.lang=$('#lg').value;S.tz=$('#tz').value;closeSheet();renderPlus();say('Réglages enregistrés.');}
};
function updShare(){var a=S.marches[0],L=[];if($('#shName').checked)L.push('Profil : '+(A()?A().name:''));if($('#shCmd').checked)L.push('A : '+a.p+' + '+a.s+'\nB : '+a.p+' + '+S.cmpSec);if($('#shForm').checked)L.push('Formation : '+a.form);
  if($('#shRes').checked)L.push($('#cmpVerdict').textContent);$('#shPrev').textContent=L.join('\n')||'(rien de sélectionné)';}
function copy(t,msg){try{navigator.clipboard.writeText(t).then(function(){say(msg);},function(){say('Copie refusée par le navigateur : sélectionne le texte.');});}catch(e){say('Copie refusée par le navigateur : sélectionne le texte.');}}

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
  var cd=e.target.closest('[data-code]');if(cd){var co=S.codes[+cd.dataset.code];co.st=cd.dataset.cst;if(co.st==='used')co.sub=co.sub.replace(/ · utilisé.*$/,'')+' · utilisé le 8 oct.';renderCodes();return;}
  var ch=e.target.closest('.chips[data-single] .chip');if(ch){$$('.chip',ch.parentNode).forEach(function(x){x.setAttribute('aria-pressed',String(x===ch));});return;}
});
document.addEventListener('input',function(e){
  var t=e.target;
  if(t.matches('[data-qk]'))quickCount();
  else if(t.id==='spDays'){S.spDays=+t.value;renderSpend();}
  else if(t.id==='budIn'){S.budget=Math.max(0,Number(t.value)||0);renderBudget();}
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
  else if(t.id==='pickShots'){var fs=[].slice.call(t.files||[]).filter(function(f){return /^image\//.test(f.type);}).slice(0,20);
    if(!fs.length){say('Choisis des images.');return;}S.shots=fs.map(function(f){return {url:URL.createObjectURL(f)};});renderShots();say(fs.length+' capture'+(fs.length>1?'s':'')+' prête'+(fs.length>1?'s':'')+'. Elles restent sur ton appareil.');t.value='';}
  else if(t.id==='pickVideo'){var v=t.files&&t.files[0];if(v)openSheet('Vidéo choisie','<p class="shp">'+esc(v.name)+'</p><p class="shp muted">La lecture d’un enregistrement d’écran est prévue plus tard (complément B03). La vidéo reste sur ton appareil.</p>',[['Fermer','close-sheet','primary']]);t.value='';}
  else if(t.id==='pickReport'){var f=t.files&&t.files[0];if(f){S.reports.unshift({t:'Rapport importé',d:'8 oct. · à relire',ok:null,img:URL.createObjectURL(f),obs:'Lecture simulée dans la maquette : les valeurs lues apparaîtront ici, à corriger.',hyp:'Aucune tant que les valeurs ne sont pas relues.',abs:'À compléter après relecture.'});S.rep=0;renderCombat();say('Rapport ajouté. Il reste sur ton appareil.');}t.value='';}
});

/* Fonctions utilisées par la bulle d'outils (onglet États) */
window.RC_API={
  openPlan:openPlan,simLink:simLink,
  profiles:function(){return AUTH.user?ORDER.map(function(k){return {k:k,name:P[k].name,on:k===S.active};}):[];},
  setProfile:function(k){if(P[k]){S.active=k;S.quick=false;refreshAll();}},
  user:function(){return AUTH.user;},
  demo:function(){AUTH.after=null;if(!ACC[DEMO])return;login(DEMO);},
  empty:function(){var em='nouveau'+(Object.keys(ACC).length)+'@exemple.fr';ACC[em]={pw:'rok12345',ok:true,data:null};AUTH.after=null;login(em);say('Nouveau compte sans profil : '+em+'.');},
  logout:function(){if(AUTH.user)logout();else location.hash='connexion';},
  quick:function(){if(AUTH.user)ACT.quick();},
  /* Met la maquette dans l'état demandé puis ouvre l'écran : 'out' (déconnecté), 'demo' (compte d'essai), 'vide' (nouveau compte sans profil) ;
     'demo:f1' choisit aussi le profil actif. */
  go:function(state,hash){
    var st=(state||'').split(':'),h=(hash||'#accueil').replace(/^#/,'');
    function nav(){if(location.hash==='#'+h)route();else location.hash=h;}
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
      /* profils d'exemple supprimés pendant un test : on remet les exemples (rechargement, le compte d'essai reste connecté) */
      var need=st[1]||'main';if(!(ACC[DEMO].data&&ACC[DEMO].data.P[need])){try{sessionStorage.setItem('rokUser',DEMO);sessionStorage.setItem('rokActive',need);}catch(e){}location.hash=h;location.reload();return;}
      if(st[1]&&ACC[DEMO].data.P[st[1]])ACC[DEMO].data.active=st[1];
      if(AUTH.user!==DEMO){AUTH.after=h;login(DEMO);}else{if(st[1]&&P[st[1]]){S.active=st[1];S.quick=false;refreshAll();}closeSheet();nav();}return;}
    nav();
  },
  reset:function(){try{sessionStorage.setItem('rokUser',DEMO);}catch(e){}location.hash='accueil';location.reload();}
};
paintIcons(document);
renderShots();showStep(1);
window.addEventListener('hashchange',route);
route();
})();
