/* Bulle d'outils de revue de la maquette (hors appli).
   Reprise de la bulle de l'espace « Maquettes RoK », adaptée à une maquette d'une seule page :
   Écran (statut, plan), Notes (épinglées à l'endroit exact, partagées avec Claude), Modifs (ce qui a changé),
   Inspecter (tailles, polices, couleurs, marges), États (comptes et profils de démonstration).
   Les notes vont dans la base de l'artefact (capacité db) ; hors claude.ai, elles restent dans ce navigateur. */
(function(){
'use strict';
var VNUM=13,VERSION='v'+VNUM+' · 8 oct. 2026';
/* Ce qui a changé dans cette version, par écran (« * » : partout). sel : élément encadré. */
var CHANGES={
  '*':[{sel:'',t:'Revue guidée : sur la confirmation de l’e-mail et le mot de passe oublié, le bouton « ✉ Simuler le lien de l’e-mail » est directement dans le bandeau du test.'}],
  'connexion':[{sel:'[data-auth="connexion"]',t:'Écran ajouté, repris de la maquette validée B01-01.'},
    {sel:'[data-auth="connexion"] .a-primary',t:'Connexion qui marche : e-mail ou mot de passe faux → « E-mail ou mot de passe incorrect. » (texte proposé).'}],
  'inscription':[{sel:'#suEmail',t:'Adresse déjà utilisée : « Un compte existe déjà avec cette adresse… » sous E-mail, au lieu de passer à la confirmation (ta note 4).'},
    {sel:'#suPw',t:'Texte proposé sous le champ : « Au moins 8 caractères. »'}],
  'confirmation':[{sel:'[data-auth="confirmation"]',t:'Les tests de cet écran préparent eux-mêmes un compte en attente (mot de passe rok12345) : plus besoin d’avoir fait les tests précédents.'}],
  'mot-de-passe-oublie':[{sel:'[data-auth="mot-de-passe-oublie"] .a-feedback',t:'Adresse sans compte : « Aucun compte avec cette adresse… ». Adresse connue : « E-mail envoyé à … » (ta décision).'},{sel:'[data-auth="mot-de-passe-oublie"] .a-primary',t:'Le lien de l’e-mail ne se simule que si un e-mail est vraiment parti.'}],
  'nouveau-mot-de-passe':[{sel:'[data-auth="nouveau-mot-de-passe"]',t:'Écran ajouté, repris de B01-05. Après « Enregistrer », tu es connecté.'}],
  'accueil':[{sel:'#homeTiles',t:'Aperçu de ma ville : les 6 bulles de l’Accueil validé (Bâtisseurs, Bonus de vitesse, 4 totaux), à ta demande.'},
    {sel:'.timepick',t:'Temps de jeu plus clair : la question « Combien de temps as-tu pour jouer ? » et la durée de chaque action. Titre « Priorités du jour » (le nombre change avec le temps).'},
    {sel:'#homeEmpty',t:'Accueil sans profil repris de B01-06 (onglet États → « Nouveau compte sans profil » pour le voir).'}],
  'profil':[{sel:'[data-act="delete-profile"]',t:'On peut supprimer n’importe quel profil, même l’actif : un autre profil devient actif (ta décision).'}],
  'plus':[{sel:'[data-act="sheet-logout"]',t:'Se déconnecter mène à l’écran de connexion.'},{sel:'[data-act="sheet-password"]',t:'Le mot de passe actuel est vérifié.'}]
};
var TABS=[['ecran','Écran'],['tests','Tests'],['notes','Notes'],['chg','Modifs'],['insp','Inspecter'],['etats','États']];
var ICO={
  tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  insp:'<circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="1.5"/>',
  pin:'<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z"/><circle cx="12" cy="10" r="2.2"/>',
  tests:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.5 1.5L7.5 5M3.5 12l1.5 1.5L7.5 11M3.5 18l1.5 1.5L7.5 17"/>',
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
function mine(e){return e&&e.closest&&e.closest('#rcBub,#rcPnl,#rcCatch,#rcLayer,#rcBox,#rcHov,#rcRun,#rcView');}

/* ---------- style ---------- */
var css=el('style');css.textContent=[
'#rcBub,#rcPnl,#rcCatch{--rc:#38bdf8;--rc-ink:#04121c;--rc-bg:#0a1220;--rc-s2:#111c2e;--rc-line:rgba(56,189,248,.45);--rc-cold:rgba(154,178,211,.2);--rc-fg:#e8f6ff;--rc-dim:#9fb3c8;font:14px/1.5 Roboto,system-ui,sans-serif;color:var(--rc-fg)}',
'#rcBub{position:fixed;z-index:130;width:54px;height:54px;display:grid;place-items:center;border-radius:50%;border:1px solid var(--rc-line);background:var(--rc-bg);color:var(--rc);box-shadow:0 8px 24px #0009;cursor:grab;touch-action:none;user-select:none}',
'#rcBub svg{width:26px;height:26px}#rcBub.act{background:var(--rc);color:var(--rc-ink)}',
'#rcBub .cnt{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:#d8b24c;color:#1c1408;font:800 11px/20px Roboto,sans-serif;text-align:center}#rcBub .cnt:empty{display:none}',
'#rcBub:focus-visible,#rcPnl button:focus-visible,#rcPnl textarea:focus-visible{outline:2px solid var(--rc);outline-offset:2px}',
'#rcPnl{position:fixed;z-index:131;width:min(392px,calc(100vw - 24px));max-height:min(620px,calc(100vh - 24px));display:flex;flex-direction:column;border:1px solid var(--rc-line);border-radius:16px;background:var(--rc-bg);box-shadow:0 18px 50px #000b}',
'#rcPnl .ph{display:flex;align-items:flex-start;gap:6px;padding:8px 8px 6px;border-bottom:1px solid var(--rc-cold)}',
'#rcPnl .rc-tabs{flex:1;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:2px}',
'#rcPnl .rc-tabs button{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-height:52px;padding:6px 0;border:0;border-radius:10px;background:transparent;color:var(--rc-dim);font:600 11.5px/1.1 Roboto,sans-serif;cursor:pointer}',
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
'#rcPnl .prog{height:6px;margin:8px 0 4px;border-radius:3px;background:#1b2a40;overflow:hidden}#rcPnl .prog i{display:block;height:100%;background:#3ecf8e}',
'#rcPnl details.tg{margin-top:8px;border:1px solid var(--rc-cold);border-radius:12px;background:var(--rc-s2)}#rcPnl details.tg>summary{display:flex;align-items:center;gap:8px;min-height:42px;padding:6px 10px;cursor:pointer;font-weight:700;list-style:none}#rcPnl details.tg>summary::-webkit-details-marker{display:none}',
'#rcPnl details.tg>summary .k{margin-left:auto;color:var(--rc-dim);font-weight:600;font-size:12px;white-space:nowrap}#rcPnl details.tg>summary .k b{color:#3ecf8e}#rcPnl details.tg>summary .k i{font-style:normal;color:#ef8a74}',
'#rcPnl .tl{list-style:none;margin:0;padding:0 8px 8px}#rcPnl .tl li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:2px 8px;padding:8px 2px;border-top:1px solid var(--rc-cold)}',
'#rcPnl .tl .m{grid-row:1/4;font-weight:800;text-align:center;color:var(--rc-dim)}#rcPnl .tl .m.ok{color:#3ecf8e}#rcPnl .tl .m.ko{color:#ef8a74}',
'#rcPnl .tl .rc-q{padding:0;border:0;background:none;color:var(--rc-fg);font:600 13px/1.4 Roboto,sans-serif;text-align:left;cursor:pointer}#rcPnl .tl .rc-q:hover{color:var(--rc)}#rcPnl .tl .e{color:var(--rc-dim);font-size:12px}',
'#rcPnl .tl .b{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}#rcPnl .tl .b button{min-height:30px;padding:0 9px;border:1px solid var(--rc-cold);border-radius:8px;background:transparent;color:var(--rc-fg);font:600 12px Roboto,sans-serif;cursor:pointer}#rcPnl .tl .b button.on.ok{background:#3ecf8e;border-color:#3ecf8e;color:#06140d}#rcPnl .tl .b button.on.ko{background:#ef8a74;border-color:#ef8a74;color:#1d0606}',
'#rcRun{position:fixed;z-index:133;top:calc(8px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);width:min(620px,calc(100vw - 16px));border:1px solid var(--rc-line);border-radius:14px;background:rgba(10,18,32,.97);box-shadow:0 12px 34px #000b;--rc:#38bdf8;--rc-cold:rgba(154,178,211,.2);--rc-fg:#e8f6ff;--rc-dim:#9fb3c8;color:var(--rc-fg);font:13.5px/1.45 Roboto,system-ui,sans-serif}',
'#rcRun .rh{display:flex;align-items:center;gap:8px;padding:6px 6px 6px 12px}#rcRun .rn{font-weight:800;color:var(--rc);white-space:nowrap}#rcRun .rg{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--rc-dim);font-weight:600}',
'#rcRun .rs{margin-left:auto;white-space:nowrap;font-weight:700;font-size:12px}#rcRun .rs.ok{color:#3ecf8e}#rcRun .rs.ko{color:#ef8a74}',
'#rcRun .ib{flex:none;min-width:36px;height:36px;padding:0 8px;border:0;border-radius:9px;background:transparent;color:var(--rc-dim);font:700 15px Roboto,sans-serif;cursor:pointer}#rcRun .ib:hover{background:#ffffff10;color:var(--rc-fg)}',
'#rcRun .rb{padding:0 12px 10px}#rcRun .ra{margin:0;font-weight:600;font-size:14.5px}#rcRun .re{margin:4px 0 0;color:var(--rc-dim)}#rcRun .re b{color:#cfe0ee}',
'#rcRun .rk{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}#rcRun .rk button{min-height:38px;padding:0 12px;border:1px solid var(--rc-cold);border-radius:10px;background:#111c2e;color:var(--rc-fg);font:700 13px Roboto,sans-serif;cursor:pointer}',
'#rcRun .rk .ok{background:#3ecf8e;border-color:#3ecf8e;color:#06140d}#rcRun .rk .ko{border-color:#ef8a7499;color:#ef8a74}#rcRun .rk .nx{margin-left:auto}',
'.rc-shots{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}#rcPnl .tl .rc-shots{grid-column:2}',
'.rc-shot{position:relative;width:72px;height:72px;flex:none}',
'.rc-shot .op{display:block;width:100%;height:100%;padding:0;border:1px solid rgba(154,178,211,.3);border-radius:9px;overflow:hidden;background:#000;cursor:zoom-in}',
'.rc-shot .op img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}',
'.rc-shot .rm{position:absolute;top:-7px;right:-7px;width:26px;height:26px;padding:0;border:2px solid #0a1220;border-radius:13px;background:#ef8a74;color:#1d0606;font:800 14px/22px Roboto,sans-serif;cursor:pointer}',
'.rc-shot .op:focus-visible,.rc-shot .rm:focus-visible,#rcView button:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}',
'#rcView{position:fixed;inset:0;z-index:140;display:flex;flex-direction:column;background:rgba(3,7,13,.94);color:#e8f6ff;font:14px/1.4 Roboto,system-ui,sans-serif}',
'#rcView .vh{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top,0px)) 10px 8px 14px}#rcView .vt{flex:1;min-width:0;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
'#rcView .vh button,#rcView .nv{min-height:40px;padding:0 14px;border:1px solid rgba(154,178,211,.3);border-radius:10px;background:#111c2e;color:#e8f6ff;font:700 13.5px Roboto,sans-serif;cursor:pointer}',
'#rcView .vh .del{border-color:#ef8a7499;color:#ef8a74}#rcView .vh .del.c{background:#ef8a74;color:#1d0606}',
'#rcView .vb{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 8px calc(10px + env(safe-area-inset-bottom,0px))}',
'#rcView .vb img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;box-shadow:0 10px 40px #000}',
'#rcView .nv{position:absolute;top:50%;transform:translateY(-50%);width:44px;padding:0;font-size:22px;background:#111c2ecc}#rcView .nv.p{left:10px}#rcView .nv.n{right:10px}',
'#rcPnl .rc-rv{margin:0 0 6px;padding:10px 12px;border:1px solid #d8b24c88;border-radius:12px;background:rgba(216,178,76,.08)}#rcPnl .rc-rvt{font-weight:800;color:#f3d982}',
'#rcPnl .rc-rvi{margin-top:6px;font-size:12.5px}#rcPnl .rc-rvi b{display:block;color:var(--rc-fg);font-weight:600}#rcPnl .rc-rvi span{color:var(--rc-dim)}',
'#rcPnl .tl .new{display:inline-block;margin-left:6px;padding:0 7px;border-radius:9px;background:#d8b24c;color:#1c1408;font:700 11px/18px Roboto,sans-serif;vertical-align:1px}',
'#rcRun .rm{margin:0 0 4px;color:#f3d982;font-size:12.5px;font-weight:600}',
'#rcRun .rk .sim{border-color:#d8b24c88;color:#f3d982}',
'#rcRun .rk .ph{border-color:var(--rc-line)}#rcRun.min .rb{display:none}#rcRun button:focus-visible{outline:2px solid var(--rc);outline-offset:2px}',
'#rcRun .sm{display:none}@media(max-width:640px){#rcRun .lg{display:none}#rcRun .sm{display:inline}#rcRun .rk{flex-wrap:nowrap;gap:4px;margin-top:6px}#rcRun .rk button{flex:1 1 auto;min-height:36px;padding:0 6px;font-size:12.5px;white-space:nowrap}#rcRun .rk .nx{margin-left:0}#rcRun .rb{padding:0 10px 8px}#rcRun .ra{font-size:13.5px}#rcRun .re{font-size:12.5px;margin-top:2px}#rcRun .rh{padding:4px 4px 2px 10px}}',
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
var db=null,dbState='attente',NOTES=[],assets=null,RES={};
function useLocal(){db=null;dbState='local';NOTES=LS.get('notes',[]);RES=LS.get('tests',{});refresh();announceReview();}
/* Une fois par version : s'il y a des tests à revoir, la bulle s'ouvre sur l'onglet Tests. */
function announceReview(){setTimeout(announceNow,0);}
function announceNow(){if(LS.get('seenRev',0)>=VNUM)return;var n=reviewList().length;LS.set('seenRev',VNUM);if(!n)return;S.tab='tests';LS.set('tab','tests');showPnl(true);say(n+' test'+(n>1?'s':'')+' à revoir après mes modifications.');}
function saveLocal(){LS.set('notes',NOTES);refresh();}
(function initDb(tries){
  if(location.protocol==='file:'){useLocal();if(window.claude&&window.claude.use)window.claude.use('assets').then(function(a){assets=a||null;render();paintRun();},function(){});return;}
  if(window.claude&&window.claude.use){
    window.claude.use('db').then(function(d){
      if(!d){useLocal();return;}
      db=d;dbState='ok';
      db.collection('notes').onSnapshot(function(s){NOTES=s.docs.map(function(x){var o=Object.assign({},x.data());o.id=x.id;return o;});refresh();},function(){useLocal();});
      db.collection('tests').onSnapshot(function(s){RES={};s.docs.forEach(function(x){RES[x.id]=x.data();});refresh();paintRun();announceReview();},function(){});
    },useLocal);
    window.claude.use('assets').then(function(a){assets=a||null;render();paintRun();},function(){});
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
  if(S.chgOn&&!(typeof RUN!=='undefined'&&RUN.on))chgList().forEach(function(c){
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
document.addEventListener('rc:route',function(){S.draft=null;if(S.insp)S.sel=null;drawSel();refresh();if(typeof paintRun==='function'&&FLAT)paintRun();});

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
    if(b.dataset.t==='tests'&&reviewList().length)b.appendChild(el('span','d'));
    if(b.dataset.t==='chg'&&chgList().length>CHANGES['*'].length)b.appendChild(el('span','d'));});
  if(pnl.hidden)return;
  var keep=pb.scrollTop;pb.innerHTML='';
  ({ecran:rEcran,tests:rTests,notes:rNotes,chg:rChg,insp:rInsp,etats:rEtats})[S.tab]();
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
      ancre:pathOf(t),fx:r.width?+((e.clientX-r.left)/r.width).toFixed(3):0,fy:r.height?+((e.clientY-r.top)/r.height).toFixed(3):0,cible:describe(t),texte:S.prefill||'',test:S.testRef||null};
    S.prefill=null;S.testRef=null;
    S.tab='notes';S.scope='ecran';showPnl(true);draw();
  });
  document.body.appendChild(c);if(innerWidth<=640)pnl.hidden=true;paintBub();render();
}
function stopPin(){S.pin=false;S.prefill=null;S.testRef=null;var c=$('rcCatch');if(c)c.remove();paintBub();render();}
function saveDraft(){
  var d=S.draft;if(!d)return;var t=(d.texte||'').trim();if(!t){say('Écris ta remarque avant d’enregistrer.');return;}
  var doc={n:nextN(),ecran:d.ecran,titre:d.titre,taille:d.taille,w:d.w,h:d.h,x:d.x,y:d.y,ancre:d.ancre,fx:d.fx,fy:d.fy,cible:d.cible,texte:t.slice(0,4000),statut:'ouverte',version:VERSION,cree:new Date().toISOString()};
  if(d.photo)doc.photo=d.photo;if(d.test)doc.test=d.test;
  Promise.resolve(addNote(doc)).then(function(){S.draft=null;if(d.test&&RES[d.test]){var o=Object.assign({},RES[d.test],{note:doc.n});saveRes(d.test,o);}say('Note '+doc.n+' enregistrée.');refresh();},function(e){say('Enregistrement impossible'+(e&&e.code?' ('+e.code+')':'')+'.');});
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

/* ---------- Tests : liste, résultats partagés, revue guidée ---------- */
var FLAT=[];
(window.RC_TESTS||[]).forEach(function(g){var prep=g.p;g.l.forEach(function(t,j){if(t[3])prep=t[3];FLAT.push({id:t[0],g:g.g,txt:t[1],att:t[2],own:j===0?g.p:(t[3]||null),prep:prep,maj:t[4]||0,why:t[5]||''});});});
FLAT.forEach(function(t,i){t.i=i;t.num=i+1;});
var RUN=LS.get('run',{on:false,i:0,min:false,list:null});
/* « À revoir » : tests modifiés depuis que Mickaël les a faits (ou nouveaux), à partir de la version où il a commencé à tester. */
function resV(r){if(!r)return 0;if(r.vn)return r.vn;var m=/v(\d+)/.exec(r.version||'');return m?+m[1]:0;}
function baseV(){var b=Infinity;Object.keys(RES).forEach(function(k){var v=resV(RES[k]);if(v&&v<b)b=v;});return b;}
function needsReview(t,b){if(!t.maj)return false;if(b==null)b=baseV();if(t.maj<b)return false;var r=RES[t.id];return !r||!r.etat||resV(r)<t.maj;}
function reviewList(){if(!FLAT)return [];var b=baseV();return FLAT.filter(function(t){return needsReview(t,b);});}
function saveRes(id,o){RES[id]=o;if(db)db.doc('tests/'+id).set(o).catch(function(){say('Résultat non enregistré.');});else LS.set('tests',RES);refresh();paintRun();}
function setRes(id,etat){var o={etat:etat,taille:cls(),w:innerWidth,version:VERSION,vn:VNUM,date:new Date().toISOString()};var old=RES[id]||{};if(old.note)o.note=old.note;if(old.captures)o.captures=old.captures;saveRes(id,o);}
function clearRes(id){var r=RES[id];if(r&&r.captures&&assets)r.captures.forEach(function(c){assets.delete(c).catch(function(){});});delete RES[id];if(db)db.doc('tests/'+id).delete().catch(function(){});else LS.set('tests',RES);refresh();paintRun();}
function stats(){var ok=0,ko=0;FLAT.forEach(function(t){var r=RES[t.id];if(r&&r.etat==='ok')ok++;else if(r&&r.etat==='ko')ko++;});return {ok:ok,ko:ko,done:ok+ko,all:FLAT.length};}
function firstTodo(){for(var i=0;i<FLAT.length;i++)if(!RES[FLAT[i].id])return i;return 0;}
function prep(t,force){var pr=force?t.prep:t.own;if(pr&&window.RC_API){window.RC_API.go(pr[0],pr[1]);}}
var run=el('div');run.id='rcRun';run.hidden=true;run.setAttribute('role','region');run.setAttribute('aria-label','Revue guidée');document.body.appendChild(run);
function startRun(i,list){RUN={on:true,i:i,min:false,list:list||null};LS.set('run',RUN);if(innerWidth<=640)showPnl(false);prep(FLAT[i],true);paintRun();}
function stopRun(){RUN.on=false;LS.set('run',RUN);paintRun();render();}
function stepRun(d){
  var L=RUN.list,j;
  if(L){var k=L.indexOf(RUN.i)+d;if(k<0)k=0;if(k>=L.length){stopRun();var n=reviewList().length;say(n?'Fin de la série : '+n+' test'+(n>1?'s':'')+' encore à revoir.':'Tous les tests modifiés sont revus. Merci !');return;}j=L[k];}
  else{j=RUN.i+d;if(j<0)j=0;if(j>=FLAT.length){stopRun();var st=stats();say('Revue terminée : '+st.ok+' bons, '+st.ko+' problème'+(st.ko>1?'s':'')+'.');return;}}
  RUN.i=j;LS.set('run',RUN);prep(FLAT[j],false);paintRun();
}
/* Captures d'écran jointes à un test (capacité assets) : un test avec capture est un problème. */
function addShots(t){
  if(!assets){say('Les captures se joignent sur la page publiée (claude.ai), pas dans ce fichier local.');return;}
  var f=el('input');f.type='file';f.accept='image/*';f.multiple=true;f.hidden=true;document.body.appendChild(f);
  f.onchange=function(){var files=[].slice.call(f.files||[]).filter(function(x){return /^image\//.test(x.type);});f.remove();if(!files.length)return;
    say(files.length>1?'Envoi de '+files.length+' captures…':'Envoi de la capture…');
    Promise.all(files.map(function(x){return assets.upload(x).then(function(a){return a;},function(){return null;});})).then(function(up){
      up=up.filter(Boolean);var ids=up.map(function(a){return a.id;});if(!ids.length){say('Capture refusée (20 Mo au plus par image).');return;}
      var o=Object.assign({etat:'ko',taille:cls(),w:innerWidth,version:VERSION,date:new Date().toISOString()},RES[t.id]||{});o.etat='ko';o.captures=(o.captures||[]).concat(ids);o.urls=Object.assign({},o.urls||{});up.forEach(function(a){if(a.url)o.urls[a.id]=a.url;});
      saveRes(t.id,o);say(ids.length>1?ids.length+' captures jointes au test '+t.num+'.':'Capture jointe au test '+t.num+'.');});};
  f.click();
}
function shotUrl(t,id){var r=RES[t.id];return (r&&r.urls&&r.urls[id])||('/_blob/'+id);}
function rmShot(t,id){var o=Object.assign({},RES[t.id]);o.captures=(o.captures||[]).filter(function(x){return x!==id;});if(o.urls){o.urls=Object.assign({},o.urls);delete o.urls[id];}saveRes(t.id,o);if(assets)assets.delete(id).catch(function(){});}
function shotsEl(t){
  var r=RES[t.id],L=(r&&r.captures)||[];if(!L.length)return null;var w=el('div','rc-shots');
  L.forEach(function(id,i){
    var c=el('div','rc-shot');var o=el('button','op');o.type='button';o.setAttribute('aria-label','Voir la capture '+(i+1)+' du test '+t.num+' en grand');
    var im=el('img');im.src=shotUrl(t,id);im.alt='';im.loading='lazy';o.appendChild(im);o.onclick=function(){viewShots(t,i);};c.appendChild(o);
    var x=el('button','rm','×');x.type='button';x.setAttribute('aria-label','Supprimer la capture '+(i+1));x.title='Supprimer cette capture';
    x.onclick=function(){viewShots(t,i,true);};c.appendChild(x);w.appendChild(c);});
  return w;
}
/* Visionneuse plein écran : ‹ › entre les captures du test, Supprimer (deuxième appui pour confirmer), Échap ou × pour fermer. */
var view=null;
function viewShots(t,i,askDel){
  closeView();var L=((RES[t.id]||{}).captures||[]).slice();if(!L.length)return;i=Math.max(0,Math.min(L.length-1,i));
  view=el('div');view.id='rcView';view.setAttribute('role','dialog');view.setAttribute('aria-modal','true');view.setAttribute('aria-label','Capture du test '+t.num);
  var h=el('div','vh');h.appendChild(el('span','vt','Test '+t.num+' · capture '+(i+1)+' sur '+L.length));
  var del=el('button','del'+(askDel?' c':''),askDel?'Confirmer la suppression':'Supprimer');del.type='button';
  del.onclick=function(){if(!del.classList.contains('c')){del.classList.add('c');del.textContent='Confirmer la suppression';return;}
    var id=L[i];rmShot(t,id);say('Capture supprimée.');var n=L.length-1;if(n)viewShots(t,Math.min(i,n-1));else closeView();};
  h.appendChild(del);var x=el('button',null,'Fermer');x.type='button';x.onclick=closeView;h.appendChild(x);view.appendChild(h);
  var b=el('div','vb');var im=el('img');im.src=shotUrl(t,L[i]);im.alt='Capture '+(i+1)+' du test '+t.num;b.appendChild(im);
  if(L.length>1){var pv=el('button','nv p','‹');pv.type='button';pv.setAttribute('aria-label','Capture précédente');pv.onclick=function(){viewShots(t,(i-1+L.length)%L.length);};b.appendChild(pv);
    var nx=el('button','nv n','›');nx.type='button';nx.setAttribute('aria-label','Capture suivante');nx.onclick=function(){viewShots(t,(i+1)%L.length);};b.appendChild(nx);}
  b.onclick=function(e){if(e.target===b)closeView();};view.appendChild(b);
  view.onkeydown=function(e){if(e.key==='ArrowLeft'&&L.length>1)viewShots(t,(i-1+L.length)%L.length);else if(e.key==='ArrowRight'&&L.length>1)viewShots(t,(i+1)%L.length);};
  document.body.appendChild(view);(askDel?del:x).focus();
}
function closeView(){if(view){view.remove();view=null;}}
function problem(t){setRes(t.id,'ko');S.prefill='Test '+t.num+' : ';S.testRef=t.id;say('Touche l’endroit du problème, puis décris-le.');startPin();}
function paintRun(){
  run.hidden=!RUN.on;if(!RUN.on)return;
  var t=FLAT[RUN.i];if(!t){stopRun();return;}var r=RES[t.id];
  run.className=RUN.min?'min':'';run.innerHTML='';
  var h=el('div','rh');var L=RUN.list;h.appendChild(el('span','rn',L?'À revoir '+(L.indexOf(RUN.i)+1)+'/'+L.length+' · test '+t.num:'Test '+t.num+'/'+FLAT.length));h.appendChild(el('span','rg',t.g));
  h.appendChild(el('span','rs'+(r?' '+r.etat:''),r?(r.etat==='ok'?'✓ bon':'✗ problème'+(r.note?' · note '+r.note:'')):''));
  var mn=el('button','ib',RUN.min?'▾':'▴');mn.type='button';mn.setAttribute('aria-label',RUN.min?'Déplier le test':'Réduire le test');mn.onclick=function(){RUN.min=!RUN.min;LS.set('run',RUN);paintRun();};h.appendChild(mn);
  var x=el('button','ib','✕');x.type='button';x.setAttribute('aria-label','Quitter la revue guidée');x.onclick=stopRun;h.appendChild(x);run.appendChild(h);
  var b=el('div','rb');if(needsReview(t)){var mj=el('p','rm');mj.textContent='Modifié en v'+t.maj+' : '+t.why;b.appendChild(mj);}b.appendChild(el('p','ra',t.txt));var e=el('p','re');e.appendChild(el('b',null,'Tu dois voir : '));e.appendChild(document.createTextNode(t.att));b.appendChild(e);
  var k=el('div','rk');
  function bt(cls,lg,sm,fn,lab){var z=el('button',cls);z.type='button';z.innerHTML='<span class="lg">'+lg+'</span><span class="sm">'+sm+'</span>';if(lab)z.setAttribute('aria-label',lab);z.onclick=fn;k.appendChild(z);}
  bt('','‹','‹',function(){stepRun(-1);},'Test précédent');
  bt('','Ouvrir l’écran','↻ Écran',function(){prep(t,true);},'Ouvrir l’écran du test');
  bt('ko','✗ Problème','✗ Problème',function(){problem(t);});
  bt('ok','✓ C’est bon','✓ Bon',function(){setRes(t.id,'ok');stepRun(1);});
  /* Le bouton est là dès que le test en parle ; s'il manque un e-mail envoyé, il prépare l'écran du test d'abord (compte en attente). */
  if(CUR().sim||/Simuler le lien/.test(t.txt))bt('sim','✉ Simuler le lien de l’e-mail','✉ Lien',function(){
    var A=window.RC_API;if(!A)return;
    if(CUR().sim){A.simLink();return;}
    if(t.prep&&t.prep[0]==='attente'){prep(t,true);setTimeout(function(){A.simLink();},200);return;}
    say('Fais d’abord la première partie du test : envoie le lien avec gouverneur@exemple.fr.');
  },'Simuler le clic sur le lien reçu par e-mail');
  var ncap=(r&&r.captures&&r.captures.length)||0;
  bt('ph','📷 Capture'+(ncap?' ('+ncap+')':''),'📷'+(ncap?' '+ncap:''),function(){addShots(t);},'Joindre une capture d’écran à ce test');
  bt('nx','Passer ›','›',function(){stepRun(1);},'Passer ce test');
  b.appendChild(k);var sh=shotsEl(t);if(sh)b.appendChild(sh);run.appendChild(b);
}
function rTests(){
  var st=stats();
  var RV=reviewList();
  if(RV.length){
    var box=el('div','rc-rv');box.appendChild(el('div','rc-rvt','À revoir après mes modifications ('+RV.length+')'));
    var why={};RV.forEach(function(t){(why[t.maj+' '+t.why]=why[t.maj+' '+t.why]||[]).push(t);});
    Object.keys(why).forEach(function(k){var L=why[k];var d=el('div','rc-rvi');d.appendChild(el('b',null,'v'+L[0].maj+' · '+L[0].why));
      d.appendChild(el('span',null,'Test'+(L.length>1?'s':'')+' '+L.map(function(t){return t.num;}).join(', ')));box.appendChild(d);});
    var rr=row();rr.style.marginTop='8px';rr.appendChild(chip('▶ Revoir ces '+RV.length+' test'+(RV.length>1?'s':''),true,function(){var L=RV.map(function(t){return t.i;});startRun(L[0],L);}));box.appendChild(rr);
    pb.appendChild(box);
  }
  pb.appendChild(h4('Tests jusqu’à l’Accueil · '+VERSION));
  pb.appendChild(el('p','txt',st.done+' sur '+st.all+' faits · '+st.ok+' bon'+(st.ok>1?'s':'')+' · '+st.ko+' problème'+(st.ko>1?'s':'')));
  var pg=el('div','prog');var bar=el('i');bar.style.width=Math.round(st.done/st.all*100)+'%';pg.appendChild(bar);pb.appendChild(pg);
  var r=row();r.style.marginTop='8px';
  var fi=firstTodo();
  r.appendChild(chip(RUN.on?'Revue en cours (test '+(RUN.i+1)+')':st.done?'▶ Continuer au test '+(fi+1):'▶ Commencer la revue guidée',true,function(){startRun(RUN.on?RUN.i:fi);}));
  pb.appendChild(r);
  pb.appendChild(hint('La revue guidée ouvre chaque écran dans le bon état et affiche le test en haut, en petit. « ✗ Problème » te fait poser une note à l’endroit concerné.'));
  pb.appendChild(h4('Liste'));
  var f=row();[['todo','À faire'],['ko','Problèmes'],['all','Tous']].forEach(function(x){f.appendChild(chip(x[1],(S.tf||'todo')===x[0],function(){S.tf=x[0];render();}));});pb.appendChild(f);
  var open=LS.get('tgo',{}),tf=S.tf||'todo',gi=-1,cur=null,ul=null;
  FLAT.forEach(function(t){
    var rr=RES[t.id];var show=tf==='all'||(tf==='todo'&&!rr)||(tf==='ko'&&rr&&rr.etat==='ko');
    if(cur!==t.g){cur=t.g;var L=FLAT.filter(function(x){return x.g===t.g;});var ok=L.filter(function(x){return RES[x.id]&&RES[x.id].etat==='ok';}).length,ko=L.filter(function(x){return RES[x.id]&&RES[x.id].etat==='ko';}).length;
      var vis=L.some(function(x){var q=RES[x.id];return tf==='all'||(tf==='todo'&&!q)||(tf==='ko'&&q&&q.etat==='ko');});
      ul=null;if(!vis)return;
      var d=el('details','tg');d.open=open[t.g]!==undefined?open[t.g]:(tf!=='all');var g=t.g;d.ontoggle=function(){open[g]=d.open;LS.set('tgo',open);};
      var sm=el('summary');sm.appendChild(el('span',null,t.g));var kk=el('span','k');kk.innerHTML='<b>'+ok+'</b>'+(ko?' · <i>'+ko+' ✗</i>':'')+' / '+L.length;sm.appendChild(kk);d.appendChild(sm);
      ul=el('ul','tl');d.appendChild(ul);pb.appendChild(d);
    }
    if(!ul||!show)return;
    var li=el('li');li.appendChild(el('span','m'+(rr?' '+rr.etat:''),rr?(rr.etat==='ok'?'✓':'✗'):String(t.num)));
    var q=el('button','rc-q',(rr?t.num+'. ':'')+t.txt);if(needsReview(t))q.appendChild(el('span','new','modifié en v'+t.maj));q.type='button';q.title='Faire ce test dans la revue guidée';q.onclick=function(){startRun(t.i);};li.appendChild(q);
    li.appendChild(el('span','e','Tu dois voir : '+t.att+(rr&&rr.note?' · note '+rr.note:'')));
    var b=el('div','b');
    function bt(txt,cls,fn){var z=el('button',cls,txt);z.type='button';z.onclick=fn;b.appendChild(z);return z;}
    bt('Aller ›','',function(){if(innerWidth<=640)showPnl(false);prep(t,true);});
    var nc=(rr&&rr.captures&&rr.captures.length)||0;
    function undo(z){if(nc&&!z.dataset.c){z.dataset.c='1';z.textContent='Effacer aussi '+(nc>1?'les '+nc+' captures':'la capture')+' ?';return;}clearRes(t.id);}
    var okb=bt('✓','ok'+(rr&&rr.etat==='ok'?' on':''),function(){if(rr&&rr.etat==='ok')undo(okb);else setRes(t.id,'ok');});
    var kob=bt('✗','ko'+(rr&&rr.etat==='ko'?' on':''),function(){if(rr&&rr.etat==='ko')undo(kob);else problem(t);});
    bt('📷'+(rr&&rr.captures&&rr.captures.length?' '+rr.captures.length:''),'',function(){addShots(t);});
    li.appendChild(b);var sh=shotsEl(t);if(sh)li.appendChild(sh);ul.appendChild(li);
  });
  if(tf!=='all'&&!pb.querySelector('details.tg'))pb.appendChild(hint(tf==='ko'?'Aucun problème signalé.':'Tous les tests sont faits. Bravo !'));
  pb.appendChild(h4('Remettre à zéro'));
  var z=row();z.appendChild(chip('Remettre les exemples',false,function(){window.RC_API&&window.RC_API.reset();}));
  var ce=chip('Effacer mes résultats',false,function(){if(!ce.dataset.c){ce.dataset.c='1';ce.textContent='Confirmer : effacer les '+st.done+' résultats';return;}Object.keys(RES).forEach(function(id){clearRes(id);});say('Résultats effacés.');});z.appendChild(ce);
  pb.appendChild(z);
  pb.appendChild(hint('« Remettre les exemples » recharge la maquette avec les profils d’exemple (tes notes et tes résultats restent).'));
}
paintRun();
/* Après un rechargement en pleine revue, on rouvre l'écran du test en cours (les données de démonstration sont reparties à zéro). */
if(RUN.on&&FLAT[RUN.i])setTimeout(function(){prep(FLAT[RUN.i],true);paintRun();},50);

/* ---------- clavier ---------- */
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape')return;
  if(view){closeView();return;}if(S.pin){stopPin();return;}if(S.insp){stopInsp();return;}
  if(!pnl.hidden&&pnl.contains(document.activeElement)){showPnl(false);}
},true);

/* ---------- démarrage ---------- */
placeBub();paintBub();
if(LS.get('open',innerWidth>700))showPnl(true);
render();redraw();
})();
