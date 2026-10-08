/* Bulle d'outils de revue de la maquette (hors appli).
   Reprise de la bulle de l'espace « Maquettes RoK », adaptée à une maquette d'une seule page :
   Écran (statut, plan), Notes (épinglées à l'endroit exact, partagées avec Claude), Modifs (ce qui a changé),
   Inspecter (tailles, polices, couleurs, marges), États (comptes et profils de démonstration).
   Les notes vont dans la base de l'artefact (capacité db) ; hors claude.ai, elles restent dans ce navigateur. */
(function(){
'use strict';
var VERSION='v5 · 8 oct. 2026';
/* Ce qui a changé dans cette version, par écran (« * » : partout). sel : élément encadré. */
var CHANGES={
  '*':[{sel:'',t:'Nouvelle bulle d’outils : notes, modifs, inspecteur, états. Elle remplace le bandeau de la maquette.'}],
  'connexion':[{sel:'[data-auth="connexion"]',t:'Écran ajouté, repris de la maquette validée B01-01.'},
    {sel:'[data-auth="connexion"] .a-primary',t:'Connexion qui marche : e-mail ou mot de passe faux → « E-mail ou mot de passe incorrect. » (texte proposé).'}],
  'inscription':[{sel:'[data-auth="inscription"]',t:'Écran ajouté, repris de B01-02. Il mène toujours à la confirmation de l’e-mail.'},
    {sel:'#suPw',t:'Texte proposé sous le champ : « Au moins 8 caractères. »'}],
  'confirmation':[{sel:'[data-auth="confirmation"]',t:'Écran ajouté, repris de B01-03. « Simuler le lien de l’e-mail » est dans l’onglet Écran de la bulle.'}],
  'mot-de-passe-oublie':[{sel:'[data-auth="mot-de-passe-oublie"]',t:'Écran ajouté, repris de B01-04. Même message que l’adresse ait un compte ou non.'}],
  'nouveau-mot-de-passe':[{sel:'[data-auth="nouveau-mot-de-passe"]',t:'Écran ajouté, repris de B01-05. Après « Enregistrer », tu es connecté.'}],
  'accueil':[{sel:'#homeEmpty',t:'Accueil sans profil repris de B01-06 (onglet États → « Nouveau compte sans profil » pour le voir).'}],
  'plus':[{sel:'[data-act="sheet-logout"]',t:'Se déconnecter mène à l’écran de connexion.'},{sel:'[data-act="sheet-password"]',t:'Le mot de passe actuel est vérifié.'}]
};
var TABS=[['ecran','Écran'],['notes','Notes'],['chg','Modifs'],['insp','Inspecter'],['etats','États']];
var ICO={
  tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  insp:'<circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="1.5"/>',
  pin:'<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z"/><circle cx="12" cy="10" r="2.2"/>',
  ecran:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  notes:'<path d="M5 4h14v12l-4 4H5z"/><path d="M15 20v-4h4M8 9h8M8 13h5"/>',
  chg:'<path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/>',
  etats:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'
};

/* ---------- outils ---------- */
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}
function $(id){return document.getElementById(id);}
var LS={get:function(k,d){try{var v=localStorage.getItem('rc-'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set:function(k,v){try{localStorage.setItem('rc-'+k,JSON.stringify(v));}catch(e){}}};
function say(t){var x=$('toast');if(!x)return;x.textContent=t;x.classList.add('show');clearTimeout(say.t);say.t=setTimeout(function(){x.classList.remove('show');},2800);}
function svg(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICO[name]+'</svg>';}
function cls(){var w=innerWidth;return w<700?'téléphone':w<1100?'tablette':'PC';}
function CUR(){return window.RC_CUR||{id:'accueil',title:'Accueil',label:'',note:''};}
function mine(e){return e&&e.closest&&e.closest('#rcBub,#rcPnl,#rcCatch,#rcLayer,#rcBox,#rcHov');}

/* ---------- style ---------- */
var css=el('style');css.textContent=[
'#rcBub,#rcPnl,#rcCatch{--rc:#38bdf8;--rc-ink:#04121c;--rc-bg:#0a1220;--rc-s2:#111c2e;--rc-line:rgba(56,189,248,.45);--rc-cold:rgba(154,178,211,.2);--rc-fg:#e8f6ff;--rc-dim:#9fb3c8;font:14px/1.5 Roboto,system-ui,sans-serif;color:var(--rc-fg)}',
'#rcBub{position:fixed;z-index:130;width:54px;height:54px;display:grid;place-items:center;border-radius:50%;border:1px solid var(--rc-line);background:var(--rc-bg);color:var(--rc);box-shadow:0 8px 24px #0009;cursor:grab;touch-action:none;user-select:none}',
'#rcBub svg{width:26px;height:26px}#rcBub.act{background:var(--rc);color:var(--rc-ink)}',
'#rcBub .cnt{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:#d8b24c;color:#1c1408;font:800 11px/20px Roboto,sans-serif;text-align:center}#rcBub .cnt:empty{display:none}',
'#rcBub:focus-visible,#rcPnl button:focus-visible,#rcPnl textarea:focus-visible{outline:2px solid var(--rc);outline-offset:2px}',
'#rcPnl{position:fixed;z-index:131;width:min(392px,calc(100vw - 24px));max-height:min(620px,calc(100vh - 24px));display:flex;flex-direction:column;border:1px solid var(--rc-line);border-radius:16px;background:var(--rc-bg);box-shadow:0 18px 50px #000b}',
'#rcPnl .ph{display:flex;align-items:flex-start;gap:6px;padding:8px 8px 6px;border-bottom:1px solid var(--rc-cold)}',
'#rcPnl .rc-tabs{flex:1;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px}',
'#rcPnl .rc-tabs button{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-height:52px;padding:6px 2px;border:0;border-radius:10px;background:transparent;color:var(--rc-dim);font:600 11.5px/1.1 Roboto,sans-serif;cursor:pointer}',
'#rcPnl .rc-tabs button svg{width:19px;height:19px}#rcPnl .rc-tabs button.on{background:rgba(56,189,248,.14);color:var(--rc-fg)}',
'#rcPnl .rc-tabs .d{position:absolute;top:6px;right:calc(50% - 16px);width:8px;height:8px;border-radius:50%;background:#d8b24c}',
'#rcPnl .x{flex:none;width:40px;height:40px;border:0;border-radius:10px;background:transparent;color:var(--rc-dim);font-size:22px;cursor:pointer}',
'#rcPnl .pb{padding:10px 14px 14px;overflow:auto;overscroll-behavior:contain}',
'#rcPnl h4{margin:14px 0 6px;color:var(--rc-dim);font:700 11px/1 Roboto,sans-serif;letter-spacing:.12em;text-transform:uppercase}#rcPnl h4:first-child{margin-top:4px}',
'#rcPnl .rc-row{display:flex;flex-wrap:wrap;gap:6px}',
'#rcPnl .rc-chip{display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:0 12px;border:1px solid var(--rc-cold);border-radius:10px;background:var(--rc-s2);color:var(--rc-fg);font:600 13px/1.2 Roboto,sans-serif;cursor:pointer;text-align:left}',
'#rcPnl .rc-chip.on{background:var(--rc);border-color:var(--rc);color:var(--rc-ink)}#rcPnl .rc-chip:disabled{opacity:.45;cursor:default}',
'#rcPnl .hint{margin:6px 0 0;color:var(--rc-dim);font-size:12.5px}',
'#rcPnl .ttl{font:700 18px/1.25 "Noto Serif",Georgia,serif}#rcPnl .lab{display:inline-block;margin-top:6px;padding:2px 9px;border:1px solid var(--rc-cold);border-radius:20px;font-size:12px;font-weight:700}',
'#rcPnl .lab.ok{color:#3ecf8e;border-color:#3ecf8e55}#rcPnl .lab.wip{color:#f3d982;border-color:#d8b24c66}#rcPnl .lab.next{color:#8db6f2;border-color:#8db6f255}#rcPnl .lab.plan{color:#b1bbca}',
'#rcPnl .txt{margin:8px 0 0;font-size:13.5px;color:#d9e6f2}',
'#rcPnl textarea{display:block;width:100%;min-height:84px;margin-top:6px;padding:10px;border:1px solid var(--rc-cold);border-radius:10px;background:var(--rc-s2);color:var(--rc-fg);font:14px/1.45 Roboto,sans-serif;resize:vertical;box-sizing:border-box}',
'#rcPnl .nl{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}',
'#rcPnl .nl li{padding:9px 10px;border:1px solid var(--rc-cold);border-radius:12px;background:var(--rc-s2)}#rcPnl .nl li.done{opacity:.6}#rcPnl .nl li.hl{border-color:var(--rc)}',
'#rcPnl .nl .h{display:flex;align-items:center;gap:8px;color:var(--rc-dim);font-size:12px}',
'#rcPnl .nl .n{display:inline-grid;place-items:center;min-width:24px;height:24px;padding:0 6px;border-radius:12px 12px 12px 3px;background:#d8b24c;color:#1c1408;font:800 12px/1 Roboto,sans-serif}#rcPnl .nl li.done .n{background:#3a4a60;color:#cfe0f0}',
'#rcPnl .nl .t{margin-top:6px;white-space:pre-wrap;overflow-wrap:anywhere}#rcPnl .nl .c{margin-top:4px;color:var(--rc-dim);font-size:12px}',
'#rcPnl .nl .rp{margin-top:8px;padding:7px 9px;border-left:2px solid var(--rc);border-radius:4px;background:rgba(56,189,248,.08);font-size:13px}#rcPnl .nl .rp b{color:var(--rc)}',
'#rcPnl .nl img{display:block;max-width:100%;max-height:180px;margin-top:8px;border-radius:8px}',
'#rcPnl .nl .a{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}#rcPnl .nl .a button{min-height:32px;padding:0 9px;border:1px solid var(--rc-cold);border-radius:8px;background:transparent;color:var(--rc-fg);font:600 12px Roboto,sans-serif;cursor:pointer}',
'#rcPnl .grp{margin:12px 0 4px;font-weight:700;font-size:13px;color:var(--rc-fg)}',
'#rcPnl ol.chg{margin:6px 0 0;padding-left:22px}#rcPnl ol.chg li{margin:4px 0}',
'#rcPnl dl{display:grid;grid-template-columns:96px minmax(0,1fr);gap:4px 10px;margin:4px 0 0;font-size:13px}#rcPnl dt{color:var(--rc-dim)}#rcPnl dd{margin:0;overflow-wrap:anywhere}',
'#rcPnl .sw{display:inline-block;width:12px;height:12px;margin-right:6px;border-radius:3px;border:1px solid #fff4;vertical-align:-1px}',
'#rcPnl .crumbs{display:flex;flex-wrap:wrap;gap:4px}#rcPnl .crumbs button{min-height:30px;padding:0 8px;border:1px solid var(--rc-cold);border-radius:8px;background:transparent;color:var(--rc-dim);font:500 12px ui-monospace,Menlo,monospace;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#rcPnl .crumbs button.on{color:var(--rc-fg);border-color:var(--rc)}',
'#rcPnl .copy{width:100%;min-height:120px;font:12px/1.4 ui-monospace,Menlo,monospace}',
'#rcLayer{position:absolute;left:0;top:0;width:0;height:0;z-index:55}',
'#rcLayer .pin{position:absolute;transform:translate(-4px,-100%);min-width:26px;height:26px;padding:0 7px;border:2px solid #0a1220;border-radius:13px 13px 13px 3px;background:#d8b24c;color:#1c1408;font:800 12px/22px Roboto,sans-serif;text-align:center;cursor:pointer;box-shadow:0 3px 10px #000a}',
'#rcLayer .pin.done{background:#5b6b80;color:#e8f0f8}#rcLayer .pin.new{background:#38bdf8;color:#04121c}',
'#rcLayer .chg{position:absolute;border:2px dashed #38bdf8;border-radius:6px;pointer-events:none}#rcLayer .chg b{position:absolute;top:-12px;left:-12px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:#38bdf8;color:#04121c;font:800 12px/22px Roboto,sans-serif;text-align:center}',
'#rcCatch{position:fixed;inset:0;z-index:129;cursor:crosshair;background:rgba(56,189,248,.06)}#rcCatch p{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top,0px));transform:translateX(-50%);margin:0;padding:8px 14px;border:1px solid var(--rc-line);border-radius:12px;background:var(--rc-bg);font-weight:600;white-space:nowrap;pointer-events:none}',
'#rcBox,#rcHov{position:fixed;z-index:128;pointer-events:none;border:2px solid #38bdf8;background:rgba(56,189,248,.1);border-radius:2px}#rcHov{border-style:dashed;background:transparent}',
'body.rc-insp,body.rc-insp *{cursor:crosshair!important}',
'@media(max-width:640px){#rcPnl{left:0!important;right:0;top:auto!important;bottom:0;width:100%;max-height:72vh;border-radius:18px 18px 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}}'
].join('\n');
document.head.appendChild(css);

/* ---------- éléments ---------- */
var bub=el('div');bub.id='rcBub';bub.setAttribute('role','button');bub.tabIndex=0;bub.setAttribute('aria-label','Outils de la maquette');
bub.innerHTML='<span class="ic"></span><span class="cnt"></span>';
var pnl=el('div');pnl.id='rcPnl';pnl.hidden=true;pnl.setAttribute('role','dialog');pnl.setAttribute('aria-label','Outils de la maquette');
pnl.innerHTML='<div class="ph"><div class="rc-tabs" id="rcTabs"></div><button type="button" class="x" id="rcX" aria-label="Fermer les outils">×</button></div><div class="pb" id="rcPb"></div>';
var layer=el('div');layer.id='rcLayer';
var box=el('div');box.id='rcBox';box.hidden=true;
var hov=el('div');hov.id='rcHov';hov.hidden=true;
document.body.appendChild(layer);document.body.appendChild(box);document.body.appendChild(hov);document.body.appendChild(bub);document.body.appendChild(pnl);
var pb=$('rcPb');

var S={tab:LS.get('tab','ecran'),scope:'ecran',pin:false,draft:null,edit:null,insp:false,sel:null,hl:null,chgOn:LS.get('chg',true),copy:null};
TABS.forEach(function(x){var b=el('button');b.type='button';b.dataset.t=x[0];b.innerHTML=svg(x[0]);b.appendChild(el('span',null,x[1]));b.onclick=function(){S.tab=x[0];LS.set('tab',S.tab);render();};$('rcTabs').appendChild(b);});
$('rcX').onclick=function(){showPnl(false);};

/* ---------- notes : base partagée (db) ou ce navigateur ---------- */
var db=null,dbState='attente',NOTES=[],assets=null;
function useLocal(){db=null;dbState='local';NOTES=LS.get('notes',[]);refresh();}
function saveLocal(){LS.set('notes',NOTES);refresh();}
(function initDb(tries){
  if(location.protocol==='file:'){useLocal();return;}
  if(window.claude&&window.claude.use){
    window.claude.use('db').then(function(d){
      if(!d){useLocal();return;}
      db=d;dbState='ok';
      db.collection('notes').onSnapshot(function(s){NOTES=s.docs.map(function(x){var o=Object.assign({},x.data());o.id=x.id;return o;});refresh();},function(){useLocal();});
    },useLocal);
    window.claude.use('assets').then(function(a){assets=a||null;render();},function(){});
  }else if(tries<40)setTimeout(function(){initDb(tries+1);},250);
  else useLocal();
})(0);
function nextN(){return NOTES.reduce(function(m,n){return Math.max(m,n.n||0);},0)+1;}
function addNote(d){if(db)return db.collection('notes').add(d);d.id='l'+Date.now();NOTES.push(d);saveLocal();return Promise.resolve();}
function updNote(n,patch){Object.assign(n,patch);if(db)return db.doc('notes/'+n.id).update(patch).catch(function(){say('Enregistrement impossible.');});saveLocal();}
function delNote(n){if(db)return db.doc('notes/'+n.id).delete().catch(function(){say('Suppression impossible.');});NOTES=NOTES.filter(function(x){return x!==n;});saveLocal();}
function notesHere(){var c=CUR().id;return NOTES.filter(function(n){return n.ecran===c;});}
function openCount(){return notesHere().filter(function(n){return n.statut!=='traitée';}).length;}
function sorted(L){return L.slice().sort(function(a,b){return (a.statut==='traitée')-(b.statut==='traitée')||a.n-b.n;});}

/* ---------- repérer un élément : ancre stable + description ---------- */
function pathOf(e){
  var parts=[];
  while(e&&e.nodeType===1&&e!==document.body&&parts.length<14){
    if(e.id&&!/^rc/.test(e.id)){parts.unshift('#'+CSS.escape(e.id));return parts.join(' > ');}
    var ds=e.getAttribute('data-screen')||e.getAttribute('data-auth')||e.getAttribute('data-panel');
    if(ds){var an=e.hasAttribute('data-screen')?'data-screen':e.hasAttribute('data-auth')?'data-auth':'data-panel';parts.unshift('['+an+'="'+ds+'"]');return parts.join(' > ');}
    var i=1,s=e;while((s=s.previousElementSibling))if(s.tagName===e.tagName)i++;
    parts.unshift(e.tagName.toLowerCase()+':nth-of-type('+i+')');e=e.parentElement;
  }
  return 'body > '+parts.join(' > ');
}
function describe(e){
  var t=e.closest('button,a,label,input,select,.kpi,.tile,.row,.event,.tool,.chip,.tab,.card,.banner,.a-panel,.sec')||e;
  var kind=t.matches('button,.chip')?'bouton':t.matches('a,.row,.tile,.event,.tool')?'lien':t.matches('input,select')?'champ':t.matches('.kpi')?'chiffre':t.matches('.tab')?'onglet':'bloc';
  var txt=(t.matches('input')?(t.getAttribute('aria-label')||t.placeholder||t.id):t.innerText||t.textContent||'').replace(/\s+/g,' ').trim().slice(0,70);
  var sec=e.closest('.sec');var h=sec&&sec.querySelector('h2');
  return kind+(txt?' « '+txt+' »':'')+(h&&!t.matches('.sec')?' · section « '+h.textContent.trim()+' »':'');
}
function posOf(n){
  var e=null;try{e=n.ancre&&document.querySelector(n.ancre);}catch(_){}
  if(e){var r=e.getBoundingClientRect();if(r.width||r.height)return {x:r.left+scrollX+n.fx*r.width,y:r.top+scrollY+n.fy*r.height};}
  if(n.taille===cls())return {x:n.x,y:n.y};
  return null;
}

/* ---------- repères et cadres ---------- */
function visible(e){var r=e.getBoundingClientRect();if(!r.width&&!r.height)return false;var x=e;while(x){if(x.hidden)return false;x=x.parentElement;}return true;}
function draw(){
  layer.innerHTML='';
  if(S.chgOn)chgList().forEach(function(c){
    if(!c.sel)return;var e=null;c.sel.split(/\s*,\s*/).some(function(s){try{var all=document.querySelectorAll(s);for(var i=0;i<all.length;i++)if(visible(all[i])){e=all[i];return true;}}catch(_){}return false;});
    if(!e)return;var r=e.getBoundingClientRect();var d=el('div','chg');d.style.left=(r.left+scrollX-3)+'px';d.style.top=(r.top+scrollY-3)+'px';d.style.width=(r.width+6)+'px';d.style.height=(r.height+6)+'px';d.appendChild(el('b',null,String(c.n)));layer.appendChild(d);
  });
  notesHere().forEach(function(n){
    if(n.taille!==cls())return;var p=posOf(n);if(!p)return;
    var b=el('button','pin'+(n.statut==='traitée'?' done':''),String(n.n));b.type='button';b.title=n.texte;b.style.left=p.x+'px';b.style.top=p.y+'px';
    b.onclick=function(ev){ev.stopPropagation();S.tab='notes';S.scope='ecran';S.hl=n.id;showPnl(true);};layer.appendChild(b);
  });
  if(S.draft){var q=posOf(S.draft);if(q){var nb=el('span','pin new','+');nb.style.left=q.x+'px';nb.style.top=q.y+'px';layer.appendChild(nb);}}
}
var dt;function redraw(){clearTimeout(dt);dt=setTimeout(draw,80);}
new MutationObserver(function(m){for(var i=0;i<m.length;i++){if(!mine(m[i].target)){redraw();return;}}}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','open']});
addEventListener('resize',function(){redraw();placeBub();placePnl();if(S.sel)drawSel();});
document.addEventListener('rc:route',function(){S.draft=null;if(S.insp)S.sel=null;drawSel();refresh();});

/* ---------- bulle ---------- */
function paintBub(){
  var m=S.insp?'insp':S.pin?'pin':'tool';bub.querySelector('.ic').innerHTML=svg(m);bub.classList.toggle('act',S.insp||S.pin);
  var c=openCount();bub.querySelector('.cnt').textContent=c?String(c):'';
  bub.setAttribute('aria-label','Outils de la maquette'+(c?' · '+c+' note'+(c>1?'s':'')+' ouverte'+(c>1?'s':''):''));
  bub.hidden=innerWidth<=640&&!pnl.hidden;
}
var bpos=LS.get('bub',null);
function placeBub(){
  var x,y;if(bpos){x=bpos.x*innerWidth;y=bpos.y*innerHeight;}else{x=innerWidth-70;y=innerHeight-(innerWidth>=1100?80:innerWidth>=700?160:140);}
  x=Math.max(8,Math.min(innerWidth-62,x));y=Math.max(8,Math.min(innerHeight-62,y));bub.style.left=x+'px';bub.style.top=y+'px';
}
(function(){var sx,sy,ox,oy,moved=false,down=false;
  bub.addEventListener('pointerdown',function(e){down=true;moved=false;sx=e.clientX;sy=e.clientY;ox=bub.offsetLeft;oy=bub.offsetTop;try{bub.setPointerCapture(e.pointerId);}catch(_){}});
  bub.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(!moved&&Math.abs(dx)+Math.abs(dy)<6)return;moved=true;bub.style.left=Math.max(8,Math.min(innerWidth-62,ox+dx))+'px';bub.style.top=Math.max(8,Math.min(innerHeight-62,oy+dy))+'px';placePnl();});
  bub.addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){bpos={x:bub.offsetLeft/innerWidth,y:bub.offsetTop/innerHeight};LS.set('bub',bpos);}else showPnl(pnl.hidden);});
  bub.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();showPnl(pnl.hidden);}});
})();
function showPnl(on){pnl.hidden=!on;LS.set('open',on);paintBub();if(on){render();placePnl();}else bub.focus();}
function placePnl(){
  if(pnl.hidden||innerWidth<=640){pnl.style.left='';pnl.style.top='';return;}
  var w=pnl.offsetWidth,h=pnl.offsetHeight,bx=bub.offsetLeft,by=bub.offsetTop;
  var x=bx+54-w;x=Math.max(12,Math.min(innerWidth-w-12,x));var y=by-h-10;if(y<12)y=by+64;if(y+h>innerHeight-12)y=Math.max(12,innerHeight-h-12);
  pnl.style.left=x+'px';pnl.style.top=y+'px';
}

/* ---------- panneau ---------- */
function chip(t,on,fn,dis){var b=el('button','rc-chip'+(on?' on':''),t);b.type='button';if(dis)b.disabled=true;b.onclick=fn;return b;}
function row(){return el('div','rc-row');}
function h4(t){return el('h4',null,t);}
function hint(t){return el('p','hint',t);}
function refresh(){paintBub();render();redraw();}
function render(){
  [].forEach.call($('rcTabs').children,function(b){b.className=b.dataset.t===S.tab?'on':'';var d=b.querySelector('.d');if(d)d.remove();
    if(b.dataset.t==='notes'&&openCount())b.appendChild(el('span','d'));
    if(b.dataset.t==='chg'&&chgList().length>CHANGES['*'].length)b.appendChild(el('span','d'));});
  if(pnl.hidden)return;
  var keep=pb.scrollTop;pb.innerHTML='';
  ({ecran:rEcran,notes:rNotes,chg:rChg,insp:rInsp,etats:rEtats})[S.tab]();
  pb.scrollTop=keep;placePnl();
}

/* Écran */
function rEcran(){
  var c=CUR();pb.appendChild(h4('Écran affiché'));pb.appendChild(el('div','ttl',c.title||c.id));
  if(c.label){var l=el('span','lab '+(c.st||'plan'),c.label);pb.appendChild(l);}
  if(c.note)pb.appendChild(el('p','txt',c.note));
  var r=row();r.style.marginTop='12px';
  if(c.sim)r.appendChild(chip('Simuler le lien de l’e-mail',true,function(){window.RC_API&&window.RC_API.simLink();}));
  r.appendChild(chip('Plan des écrans',false,function(){showPnl(false);window.RC_API&&window.RC_API.openPlan();}));
  r.appendChild(chip('Planche des icônes',false,function(){location.hash='icones';}));
  pb.appendChild(r);
  pb.appendChild(h4('Fenêtre'));pb.appendChild(el('p','txt',innerWidth+' × '+innerHeight+' · '+cls()));
  pb.appendChild(hint('Les notes sont rangées par taille (téléphone, tablette, PC) : un repère s’affiche à la taille où la note a été prise.'));
  pb.appendChild(h4('Version de la maquette'));pb.appendChild(el('p','txt',VERSION));
}

/* Notes */
function noteLine(n){return n.n+'. ['+n.taille+' · '+(n.cible||'')+(n.statut==='traitée'?' · traitée':'')+'] '+n.texte+(n.reponse?'\n   Réponse : '+n.reponse:'');}
function notesText(L){
  var by={},order=[];L.slice().sort(function(a,b){return a.n-b.n;}).forEach(function(n){if(!by[n.ecran]){by[n.ecran]=[];order.push(n.ecran);}by[n.ecran].push(n);});
  var out=['Notes sur la maquette RoK Companion ('+VERSION+')',''];
  order.forEach(function(k){out.push((by[k][0].titre||k)+' (#'+k+')');by[k].forEach(function(n){out.push('  '+noteLine(n));});out.push('');});
  return out.join('\n').trim();
}
function copyNotes(L){
  var t=notesText(L);
  try{navigator.clipboard.writeText(t).then(function(){say('Notes copiées.');},function(){S.copy=t;render();});}catch(e){S.copy=t;render();}
}
function rNotes(){
  if(dbState==='attente')pb.appendChild(hint('Connexion à l’espace des notes…'));
  if(dbState==='local')pb.appendChild(hint('Hors claude.ai : les notes restent dans ce navigateur. Sur la page publiée, elles sont partagées avec Claude.'));
  var r=row();
  r.appendChild(chip(S.pin?'Touche la maquette…':'Ajouter une note',S.pin,function(){startPin();},dbState==='attente'));
  r.appendChild(chip('Cet écran',S.scope==='ecran',function(){S.scope='ecran';render();}));
  r.appendChild(chip('Tous les écrans ('+NOTES.length+')',S.scope==='tous',function(){S.scope='tous';render();}));
  pb.appendChild(r);
  if(S.copy){var ta=el('textarea','copy');ta.value=S.copy;ta.readOnly=true;pb.appendChild(hint('La copie automatique est refusée ici : le texte est sélectionné, copie-le.'));pb.appendChild(ta);setTimeout(function(){ta.focus();ta.select();},30);S.copy=null;}
  if(S.draft){
    pb.appendChild(h4('Nouvelle note'));
    pb.appendChild(hint(S.draft.taille+' · '+S.draft.cible));
    var t=el('textarea');t.id='rcDraft';t.placeholder='Ta remarque : ce qui ne va pas, ce que tu veux à la place…';t.value=S.draft.texte||'';t.oninput=function(){S.draft.texte=t.value;};pb.appendChild(t);
    var r2=row();r2.style.marginTop='8px';
    r2.appendChild(chip('Enregistrer',true,saveDraft));
    if(assets){var f=el('input');f.type='file';f.accept='image/*';f.hidden=true;f.id='rcPhoto';f.onchange=function(){var file=f.files&&f.files[0];if(!file)return;say('Envoi de l’image…');assets.upload(file).then(function(a){S.draft.photo=a.id;say('Image jointe.');render();},function(){say('Image refusée (20 Mo au plus).');});};pb.appendChild(f);
      r2.appendChild(chip(S.draft.photo?'Image jointe ✓':'Joindre une image',!!S.draft.photo,function(){f.click();}));}
    r2.appendChild(chip('Annuler',false,function(){S.draft=null;draw();render();}));pb.appendChild(r2);
    setTimeout(function(){if(document.activeElement!==t)t.focus();},30);
  }
  var L=S.scope==='tous'?NOTES:notesHere();
  pb.appendChild(h4((S.scope==='tous'?'Toutes les notes':'Notes de cet écran')+' ('+L.length+')'));
  if(L.length)pb.appendChild(row()).appendChild(chip('Copier ces notes',false,function(){copyNotes(L);}));
  if(!L.length){pb.appendChild(hint('Aucune note pour l’instant. « Ajouter une note », puis touche l’endroit concerné.'));return;}
  var groups=S.scope==='tous'?groupBy(sorted(L)):[[null,sorted(L)]];
  groups.forEach(function(g){
    if(g[0])pb.appendChild(el('div','grp',(g[1][0].titre||g[0])));
    var ul=el('ul','nl');
    g[1].forEach(function(n){ul.appendChild(noteItem(n));});
    pb.appendChild(ul);
  });
  if(S.hl){var x=pb.querySelector('li.hl');if(x)setTimeout(function(){x.scrollIntoView({block:'nearest'});},0);}
}
function groupBy(L){var m={},o=[];L.forEach(function(n){if(!m[n.ecran]){m[n.ecran]=[];o.push(n.ecran);}m[n.ecran].push(n);});return o.map(function(k){return [k,m[k]];});}
function noteItem(n){
  var li=el('li',(n.statut==='traitée'?'done':'')+(S.hl===n.id?' hl':''));
  var h=el('div','h');h.appendChild(el('span','n',String(n.n)));h.appendChild(el('span',null,n.taille+' · '+(n.statut||'ouverte')+(n.cree?' · '+new Date(n.cree).toLocaleDateString('fr-FR',{day:'numeric',month:'short'}):'')));li.appendChild(h);
  if(S.edit&&S.edit.id===n.id){
    var et=el('textarea');et.value=S.edit.texte;et.oninput=function(){S.edit.texte=et.value;};li.appendChild(et);
    var ea=el('div','a');var es=el('button',null,'Enregistrer');es.type='button';es.onclick=function(){var t=(S.edit.texte||'').trim();if(!t)return;S.edit=null;updNote(n,{texte:t.slice(0,4000),modifie:new Date().toISOString()});render();};ea.appendChild(es);
    var ec=el('button',null,'Annuler');ec.type='button';ec.onclick=function(){S.edit=null;render();};ea.appendChild(ec);li.appendChild(ea);
    setTimeout(function(){if(document.activeElement!==et)et.focus();},30);return li;
  }
  li.appendChild(el('div','t',n.texte));if(n.cible)li.appendChild(el('div','c',n.cible));
  if(n.photo){var im=el('img');im.src='/_blob/'+n.photo;im.alt='Image jointe à la note '+n.n;li.appendChild(im);}
  if(n.reponse){var rp=el('div','rp');rp.appendChild(el('b',null,'Claude : '));rp.appendChild(document.createTextNode(n.reponse));li.appendChild(rp);}
  var a=el('div','a');
  function btn(t,fn){var b=el('button',null,t);b.type='button';b.onclick=fn;a.appendChild(b);return b;}
  btn('Voir',function(){gotoNote(n);});
  btn('Modifier',function(){S.edit={id:n.id,texte:n.texte};render();});
  btn(n.statut==='traitée'?'Rouvrir':'Marquer traitée',function(){updNote(n,{statut:n.statut==='traitée'?'ouverte':'traitée'});render();});
  var del=btn('Supprimer',function(){if(del.dataset.c)delNote(n);else{del.dataset.c='1';del.textContent='Confirmer la suppression';}});
  li.appendChild(a);return li;
}
function gotoNote(n){
  S.hl=n.id;
  function go(){var p=posOf(n);if(p)scrollTo({top:Math.max(0,p.y-180),behavior:'smooth'});if(n.taille!==cls())say('Note prise sur '+n.taille+' : son repère s’affiche à cette taille.');draw();}
  if(CUR().id!==n.ecran){S.scope='ecran';location.hash=n.ecran;setTimeout(go,350);}else go();
  if(innerWidth<=640)showPnl(false);else render();
}
function startPin(){
  if(S.pin){stopPin();return;}
  if(S.insp)stopInsp();
  S.pin=true;S.draft=null;var c=el('div');c.id='rcCatch';c.innerHTML='<p>Touche l’endroit de ta note · Échap pour annuler</p>';
  c.addEventListener('click',function(e){
    c.style.display='none';var t=document.elementFromPoint(e.clientX,e.clientY);c.remove();S.pin=false;
    if(!t||mine(t)){refresh();return;}
    var r=t.getBoundingClientRect(),C=CUR();
    S.draft={ecran:C.id,titre:C.title||C.id,taille:cls(),w:innerWidth,h:innerHeight,x:Math.round(e.clientX+scrollX),y:Math.round(e.clientY+scrollY),
      ancre:pathOf(t),fx:r.width?+((e.clientX-r.left)/r.width).toFixed(3):0,fy:r.height?+((e.clientY-r.top)/r.height).toFixed(3):0,cible:describe(t),texte:''};
    S.tab='notes';S.scope='ecran';showPnl(true);draw();
  });
  document.body.appendChild(c);if(innerWidth<=640)pnl.hidden=true;paintBub();render();
}
function stopPin(){S.pin=false;var c=$('rcCatch');if(c)c.remove();paintBub();render();}
function saveDraft(){
  var d=S.draft;if(!d)return;var t=(d.texte||'').trim();if(!t){say('Écris ta remarque avant d’enregistrer.');return;}
  var doc={n:nextN(),ecran:d.ecran,titre:d.titre,taille:d.taille,w:d.w,h:d.h,x:d.x,y:d.y,ancre:d.ancre,fx:d.fx,fy:d.fy,cible:d.cible,texte:t.slice(0,4000),statut:'ouverte',version:VERSION,cree:new Date().toISOString()};
  if(d.photo)doc.photo=d.photo;
  Promise.resolve(addNote(doc)).then(function(){S.draft=null;say('Note '+doc.n+' enregistrée.');refresh();},function(e){say('Enregistrement impossible'+(e&&e.code?' ('+e.code+')':'')+'.');});
}

/* Modifs */
function chgList(){var c=CUR(),L=(CHANGES[c.id]||CHANGES[c.screen]||[]).concat(CHANGES['*']);return L.map(function(x,i){return {n:i+1,sel:x.sel,t:x.t};});}
function rChg(){
  pb.appendChild(h4('Ce qui a changé ici · '+VERSION));
  var L=chgList(),ol=el('ol','chg');L.forEach(function(c){var li=el('li',null,c.t);li.value=c.n;ol.appendChild(li);});pb.appendChild(ol);
  var r=row();r.style.marginTop='10px';r.appendChild(chip(S.chgOn?'Masquer les cadres':'Montrer les cadres',S.chgOn,function(){S.chgOn=!S.chgOn;LS.set('chg',S.chgOn);draw();render();}));pb.appendChild(r);
  pb.appendChild(hint('Chaque changement est encadré en bleu sur l’écran, avec son numéro.'));
}

/* Inspecter */
function rInsp(){
  var r=row();r.appendChild(chip(S.insp?'Arrêter l’inspecteur':'Inspecter un élément',S.insp,function(){S.insp?stopInsp():startInsp();}));
  if(S.sel)r.appendChild(chip('Effacer',false,function(){S.sel=null;drawSel();render();}));pb.appendChild(r);
  if(!S.sel){pb.appendChild(hint('Touche un élément de l’écran pour voir sa taille, sa police, ses couleurs et ses marges.'));return;}
  var o=info(S.sel);
  pb.appendChild(h4('Élément'));var cr=el('div','crumbs'),chain=[],e=S.sel;while(e&&e!==document.body&&chain.length<5){chain.unshift(e);e=e.parentElement;}
  chain.forEach(function(x){var b=el('button',x===S.sel?'on':'',nameOf(x));b.type='button';b.title=nameOf(x);b.onclick=function(){S.sel=x;drawSel();render();};cr.appendChild(b);});
  pb.appendChild(cr);
  var dl=el('dl');kv(dl,'Taille',o.taille);kv(dl,'Police',o.police);kv(dl,'Texte',o.texte);colorKv(dl,'Couleur',o.couleur);if(o.fond)colorKv(dl,'Fond',o.fond);else kv(dl,'Fond','dégradé ou image');
  if(o.contraste)kv(dl,'Contraste',o.contraste+(o.contraste<4.5?' (faible)':''));kv(dl,'Marges',o.marge);kv(dl,'Retraits',o.retrait);kv(dl,'Bordure',o.bord);kv(dl,'Arrondi',o.rayon);
  pb.appendChild(dl);
  pb.appendChild(row()).appendChild(chip('Noter sur cet élément',false,function(){var t=S.sel,rr=t.getBoundingClientRect(),C=CUR();stopInsp();
    S.draft={ecran:C.id,titre:C.title||C.id,taille:cls(),w:innerWidth,h:innerHeight,x:Math.round(rr.left+scrollX+rr.width/2),y:Math.round(rr.top+scrollY),ancre:pathOf(t),fx:.5,fy:0,cible:describe(t),texte:''};
    S.tab='notes';S.scope='ecran';render();draw();}));
}
function kv(dl,k,v){if(v==null||v==='')return;dl.appendChild(el('dt',null,k));dl.appendChild(el('dd',null,String(v)));}
function colorKv(dl,k,c){if(!c)return;var dd=el('dd');var s=el('span','sw');s.style.background=c.css;dd.appendChild(s);dd.appendChild(document.createTextNode(c.hex+(c.a<1?' · '+Math.round(c.a*100)+' %':'')));dl.appendChild(el('dt',null,k));dl.appendChild(dd);}
function nameOf(e){var s=e.tagName.toLowerCase();if(e.id)s+='#'+e.id;else if(e.classList.length)s+='.'+[].slice.call(e.classList,0,2).join('.');return s;}
function rgb(s){var m=/rgba?\(([^)]+)\)/.exec(s||'');if(!m)return null;var p=m[1].split(/[ ,/]+/).filter(Boolean).map(Number);var a=p.length>3?p[3]:1;
  return {r:p[0],g:p[1],b:p[2],a:a,css:s,hex:'#'+[p[0],p[1],p[2]].map(function(v){return ('0'+Math.round(v).toString(16)).slice(-2);}).join('')};}
function lum(c){return [c.r,c.g,c.b].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce(function(s,v,i){return s+v*[.2126,.7152,.0722][i];},0);}
function px(v){return String(Math.round(parseFloat(v)*10)/10);}
function four(cs,p){var a=['Top','Right','Bottom','Left'].map(function(s){return px(cs[p+s+(p==='border'?'Width':'')]);});if(a[0]===a[1]&&a[1]===a[2]&&a[2]===a[3])return a[0]+' px';if(a[0]===a[2]&&a[1]===a[3])return a[0]+' / '+a[1]+' px';return a.join(' ')+' px';}
function info(e){
  var cs=getComputedStyle(e),r=e.getBoundingClientRect(),o={};
  o.taille=Math.round(r.width)+' × '+Math.round(r.height)+' px';
  o.police=cs.fontFamily.split(',')[0].replace(/"/g,'')+' · '+px(cs.fontSize)+' px / '+(cs.lineHeight==='normal'?'normal':px(cs.lineHeight)+' px')+' · '+cs.fontWeight;
  var tx=(e.innerText||e.value||'').replace(/\s+/g,' ').trim();o.texte=tx?tx.slice(0,60)+(tx.length>60?'…':''):'';
  o.couleur=rgb(cs.color);
  var x=e,bg=null;while(x&&x.nodeType===1){var c=getComputedStyle(x);if(c.backgroundImage&&c.backgroundImage!=='none'){bg=false;break;}var b=rgb(c.backgroundColor);if(b&&b.a>.5){bg=b;break;}x=x.parentElement;}
  if(bg===null)bg=rgb(getComputedStyle(document.body).backgroundColor);
  o.fond=bg||null;
  if(bg&&o.couleur&&tx){var l1=lum(o.couleur),l2=lum(bg);o.contraste=Math.round((Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)*10)/10;}
  o.marge=four(cs,'margin');o.retrait=four(cs,'padding');
  o.bord=parseFloat(cs.borderTopWidth)?four(cs,'border')+' · '+(rgb(cs.borderTopColor)||{hex:''}).hex:'';
  o.rayon=parseFloat(cs.borderTopLeftRadius)?px(cs.borderTopLeftRadius)+' px':'';
  return o;
}
function drawSel(){
  if(!S.sel||!document.contains(S.sel)){box.hidden=true;S.sel=null;return;}
  var r=S.sel.getBoundingClientRect();box.hidden=false;box.style.left=r.left+'px';box.style.top=r.top+'px';box.style.width=r.width+'px';box.style.height=r.height+'px';
}
function onMove(e){if(!S.insp)return;var t=e.target;if(mine(t)){hov.hidden=true;return;}var r=t.getBoundingClientRect();hov.hidden=false;hov.style.left=r.left+'px';hov.style.top=r.top+'px';hov.style.width=r.width+'px';hov.style.height=r.height+'px';}
function onPick(e){if(!S.insp||mine(e.target))return;e.preventDefault();e.stopPropagation();if(e.type!=='click')return;S.sel=e.target;drawSel();if(innerWidth<=640)pnl.hidden=false;S.tab='insp';render();placePnl();paintBub();}
function startInsp(){if(S.pin)stopPin();S.insp=true;document.body.classList.add('rc-insp');if(innerWidth<=640)pnl.hidden=true;paintBub();render();}
function stopInsp(){S.insp=false;hov.hidden=true;document.body.classList.remove('rc-insp');paintBub();render();}
document.addEventListener('pointermove',onMove,true);
['click','pointerdown','mousedown','pointerup','mouseup'].forEach(function(t){document.addEventListener(t,onPick,true);});
addEventListener('scroll',function(){if(S.sel)drawSel();if(S.insp)hov.hidden=true;},{passive:true});

/* États */
function rEtats(){
  var A=window.RC_API;if(!A){pb.appendChild(hint('Indisponible.'));return;}
  pb.appendChild(h4('Compte'));var r=row();
  r.appendChild(chip('Compte d’essai',A.user()==='gouverneur@exemple.fr',function(){A.demo();}));
  r.appendChild(chip('Nouveau compte sans profil',false,function(){A.empty();}));
  r.appendChild(chip('Écran de connexion',!A.user(),function(){A.logout();}));pb.appendChild(r);
  var P=A.profiles();
  if(P.length){pb.appendChild(h4('Profil actif'));var r2=row();P.forEach(function(p){r2.appendChild(chip(p.name,p.on,function(){A.setProfile(p.k);render();}));});pb.appendChild(r2);
    pb.appendChild(h4('Ma ville'));var r3=row();r3.appendChild(chip('Saisie rapide',false,function(){A.quick();}));pb.appendChild(r3);}
  pb.appendChild(hint('Tout se passe dans ce navigateur : recharger la page remet les exemples (le compte d’essai reste connecté).'));
}

/* ---------- clavier ---------- */
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape')return;
  if(S.pin){stopPin();return;}if(S.insp){stopInsp();return;}
  if(!pnl.hidden&&pnl.contains(document.activeElement)){showPnl(false);}
},true);

/* ---------- démarrage ---------- */
placeBub();paintBub();
if(LS.get('open',innerWidth>700))showPnl(true);
render();redraw();
})();
