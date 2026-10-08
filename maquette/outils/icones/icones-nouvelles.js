/* ---------- Repris des maquettes B03 validées : coffre de ressources, pack, nourriture à 88 %, accélérateurs (composition 1) ---------- */
DEFS+=lg('gChestW',0,1,[[0,'#c98c50'],[.5,'#8a5228'],[1,'#5e3414']])+
lg('gChestLid',0,1,[[0,'#e2a86a'],[.6,'#a5642e'],[1,'#6e3f18']])+
lg('gSack',1,0,[[0,'#6b4c28'],[.35,'#d8b47a'],[.65,'#b8915a'],[1,'#5e4222']])+
lg('gSackTop',0,1,[[0,'#e6c88e'],[1,'#a07a46']]);
function chestB03(){var w='#3b1d0a',s=shadow(32,58.5,25,3.8);
 s+='<g transform="translate(37 9) scale(.32)">'+'<path d="'+COB+'" fill="url(#gCobBase)" stroke="#7a4d05" stroke-width="3"/></g>'+coin(25,21,8);
 s+='<rect x="9" y="30" width="46" height="25" rx="3" fill="url(#gChestW)" stroke="'+w+'" stroke-width="1.3"/>'+
  '<path d="M10 38.5H54M10 46.5H54" stroke="#4a250c" stroke-width="1" opacity=".7"/><path d="M10 37.5H54M10 45.5H54" stroke="#e2a86a" stroke-width=".7" opacity=".5"/>'+
  '<path d="M8 31 11 21Q32 15 53 21L56 31Z" fill="url(#gChestLid)" stroke="'+w+'" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="M12.5 22.6Q32 17.4 51.5 22.6" fill="none" stroke="#f3d6a6" stroke-width="1.2" opacity=".7" filter="url(#fSoft1)"/>'+
  '<rect x="15" y="21" width="5" height="34" rx="1" fill="url(#gGoldM)" stroke="#5a3a04" stroke-width=".9"/><rect x="44" y="21" width="5" height="34" rx="1" fill="url(#gGoldM)" stroke="#5a3a04" stroke-width=".9"/>'+
  '<rect x="27" y="33" width="10" height="11" rx="2" fill="url(#gGoldM)" stroke="#5a3a04" stroke-width="1"/><circle cx="32" cy="37.6" r="1.6" fill="#3b1d0a"/><path d="M32 38.5V41.5" stroke="#3b1d0a" stroke-width="1.3" stroke-linecap="round"/>'+
  '<path d="M11 31.5H53" stroke="#fff" stroke-width="1" opacity=".35"/>'+sparkle(50,13,3);
 return s}
function packB03(){var o='#4a3216',s=shadow(32,58.5,21,3.6);
 s+=coin(36,14,7);
 s+='<path d="M21 27Q11 35 12.5 46.5Q14 57.5 32 57.5Q50 57.5 51.5 46.5Q53 35 43 27Z" fill="url(#gSack)" stroke="'+o+'" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="M17 36Q16 47 22 53" fill="none" stroke="#f3dfb0" stroke-width="2" stroke-linecap="round" opacity=".45" filter="url(#fSoft1)"/>'+
  '<path d="M22 40.5Q32 43.5 42 40.5M20 48Q32 51 44 48" fill="none" stroke="#7a5a32" stroke-width=".9" stroke-dasharray="1.6 1.6" opacity=".8"/>'+
  '<path d="M23 27Q22 20 26 17.5Q32 21 38 17.5Q42 20 41 27Z" fill="url(#gSackTop)" stroke="'+o+'" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M21.5 27.5Q32 31.5 42.5 27.5" fill="none" stroke="#5e3414" stroke-width="3.2" stroke-linecap="round"/><path d="M21.5 27Q32 31 42.5 27" fill="none" stroke="#c98c50" stroke-width="1.2" stroke-linecap="round"/>'+
  '<path d="M33 30Q36 35 33.5 38M33 30Q30 35 31 38.5" fill="none" stroke="#5e3414" stroke-width="1.6" stroke-linecap="round"/>';
 return s}
SYM['r-food']='<g transform="translate(32 31.1) scale(.88) translate(-32 -31.1)">'+food()+'</g>';
SYM['p-chest']=chestB03();SYM['p-pack']=packB03();
[['build','hammer'],['research','flask'],['train','swords'],['heal','cross'],['general','hourglass']].forEach(function(a){SYM['a-'+a[0]]=acc1(a[1]);});

/* ---------- Nouvelles icônes, même rendu peint (non validées) ---------- */
DEFS+=lg('nEbony',0,1,[[0,'#6a4a3a'],[.45,'#3a2418'],[1,'#160c06']])+
rg('nEbonyEnd',.42,.36,.75,[[0,'#8a6248'],[.6,'#4a2e1e'],[1,'#24140a']])+
lgU('nBlue',6,58,[[0,'#cfe4ff'],[.45,'#4a86e8'],[.85,'#1f4fa8'],[1,'#12306a']]);
var BROWN={t:'url(#gChestWood)',s:'#5e3414',o:'#2a1406'}, BLUE={t:'url(#nBlue)',s:'#12306a',o:'#0a1a3a'},
    PARCH={t:'url(#gParch)',s:'#b8955a',o:'#6b4a1a'};

/* Importer : appareil photo */
function nCamera(){
  return shadow(32,58,24,3.2)+fg('M7 22H19L23.5 14H40.5L45 22H57V53H7Z',STEEL)+
  '<rect x="10" y="25" width="10" height="5" rx="1.5" fill="url(#gWin)" stroke="#3a2a14" stroke-width=".8"/>'+
  '<circle cx="32" cy="37" r="13" fill="url(#gGoldM)" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="37" r="9" fill="url(#gDial)" stroke="#22272e" stroke-width="1"/>'+
  '<circle cx="32" cy="37" r="5" fill="#0b1220" stroke="#3a5070" stroke-width="1"/>'+
  '<circle cx="28.8" cy="33.8" r="2.6" fill="#fff" opacity=".85"/><circle cx="35" cy="40" r="1" fill="#fff" opacity=".6"/>';
}
/* Importer une vidéo : caméra */
function nVideo(){
  return shadow(32,57,24,3)+fg('M5 19H40V49H5Z',STEEL)+fg('M40 30 59 19V49L40 38Z',GOLD)+
  '<circle cx="15" cy="34" r="6.5" fill="url(#gDial)" stroke="#22272e" stroke-width="1"/><circle cx="29" cy="34" r="6.5" fill="url(#gDial)" stroke="#22272e" stroke-width="1"/>'+
  '<circle cx="13.5" cy="32.5" r="1.6" fill="#fff" opacity=".8"/><circle cx="27.5" cy="32.5" r="1.6" fill="#fff" opacity=".8"/>'+gemDot(34.5,23.5,2.6,'gGemR');
}
/* Niveau VIP : écusson doré */
function nVip(){
  return shadow(32,58,22,3)+fg('M14 15H50Q57 15 57 22V43Q57 50 50 50H14Q7 50 7 43V22Q7 15 14 15Z',GOLD)+
  '<path d="M14 19H50Q53 19 53 22V43Q53 46 50 46H14Q11 46 11 43V22Q11 19 14 19Z" fill="none" stroke="#8a5a08" stroke-width="1"/>'+
  '<text x="32" y="41" text-anchor="middle" font-family="Noto Serif,Georgia,serif" font-weight="700" font-size="19" fill="#4a2c04">VIP</text>'+
  '<text x="31.4" y="40.2" text-anchor="middle" font-family="Noto Serif,Georgia,serif" font-weight="700" font-size="19" fill="#fff3c0" opacity=".35">VIP</text>'+
  gemDot(32,11,4,'gGemR')+sparkle(52,12,2.6);
}
/* Civilisation : couronne de laurier */
function nLaurel(){
  var s=shadow(32,58,18,3);
  [118,140,162,184,206,228].forEach(function(a,i){
    var p=P(a,20,32,33), q=P(180-a,20,32,33);
    s+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="6.4" ry="3" fill="url(#gLeafL)" stroke="#1d4a14" stroke-width=".9" transform="rotate('+(a+90+28)+' '+p[0]+' '+p[1]+')"/>';
    s+='<ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="6.4" ry="3" fill="url(#gLeafR)" stroke="#1d4a14" stroke-width=".9" transform="rotate('+(180-a+90-28)+' '+q[0]+' '+q[1]+')"/>';
  });
  return s+orb(32,31,9)+fg('M23 51 32 45 41 51 39 59 32 55 25 59Z',RED);
}
/* Écurie, cavalerie : fer à cheval */
function nHorseshoe(){
  var s=shadow(32,58,18,3)+sg('M17 10V33A15 15 0 0 0 47 33V10',10,STEEL);
  [[17,16],[17,26],[19.5,36],[44.5,36],[47,26],[47,16]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.6" fill="#22272e"/>';});
  return s+sparkle(50,8,2.6);
}
/* Champ de tir, archers : arc et flèche */
function nBow(){
  return shadow(32,59,20,2.8,.3)+
  '<path d="M17 6Q48 32 17 58" fill="none" stroke="#3b1d0a" stroke-width="7.5" stroke-linecap="round"/>'+
  '<path d="M17 6Q48 32 17 58" fill="none" stroke="#a8662f" stroke-width="5" stroke-linecap="round"/>'+
  '<path d="M18.5 8.5Q44 31 20 54" fill="none" stroke="#e2a86a" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>'+
  '<path d="M17 6V58" stroke="#efe6cc" stroke-width="1.2"/>'+
  sg('M9 32H52',3.4,{t:'#c98c50',s:'#7a4520',o:'#3b1d0a'})+fg('M50 26.5 61 32 50 37.5Z',STEEL)+
  fg('M13 32 6 26.5H11.5L17 32 11.5 37.5H6Z',RED);
}
/* Siège : catapulte */
function nCatapult(){
  function wheel(x,y){return '<circle cx="'+x+'" cy="'+y+'" r="6.5" fill="url(#gWoodH)" stroke="#3b1d0a" stroke-width="1.2"/><path d="M'+(x-6)+' '+y+'H'+(x+6)+'M'+x+' '+(y-6)+'V'+(y+6)+'" stroke="#5e3414" stroke-width="1"/><circle cx="'+x+'" cy="'+y+'" r="2" fill="url(#gGoldM)" stroke="#4a3004" stroke-width=".7"/>';}
  return shadow(32,59,26,3)+
  '<path d="M27 45 35 25 43 45" fill="none" stroke="#3b1d0a" stroke-width="5.5" stroke-linejoin="round"/><path d="M27 45 35 25 43 45" fill="none" stroke="#c98c50" stroke-width="3.2" stroke-linejoin="round"/>'+
  '<line x1="16" y1="44" x2="47" y2="13" stroke="#3b1d0a" stroke-width="6.5" stroke-linecap="round"/><line x1="16" y1="44" x2="47" y2="13" stroke="#a8662f" stroke-width="4.2" stroke-linecap="round"/>'+
  '<path d="M41 13Q47 19 53 13" fill="#5e3414" stroke="#2a1406" stroke-width="1"/>'+
  '<circle cx="47" cy="9" r="5.5" fill="url(#gRM)" stroke="#3a414b" stroke-width="1.1"/><circle cx="45.4" cy="7.4" r="1.6" fill="#fff" opacity=".6"/>'+
  '<rect x="7" y="43" width="50" height="7" rx="2" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.2"/>'+
  wheel(16,52)+wheel(48,52);
}
/* Casque */
function nHelmet(){
  return shadow(32,59,20,3)+fg('M30 12C27 5 32 1.5 38 3 34.5 5 35 8.5 35.5 12Z',RED)+
  fg('M11 42C11 22 19.5 11 32 11S53 22 53 42V54H41V42H23V54H11Z',STEEL)+
  '<rect x="18.5" y="29" width="27" height="4.5" rx="2.2" fill="#141820"/>'+
  '<path d="M32 12V29M32 34V42" stroke="#4b535e" stroke-width="1.2"/>'+
  '<circle cx="16" cy="45" r="1.4" fill="url(#gGoldM)"/><circle cx="48" cy="45" r="1.4" fill="url(#gGoldM)"/>';
}
/* Armure : cuirasse */
function nArmor(){
  return shadow(32,59,20,3)+fg('M14 11 24 7Q32 13 40 7L50 11 55 25 48 30V53Q32 60 16 53V30L9 25Z',STEEL)+
  '<path d="M32 13V55" stroke="#4b535e" stroke-width="1.2"/>'+
  '<path d="M18 33Q32 38 46 33M18 43Q32 48 46 43" fill="none" stroke="#5d6672" stroke-width="1.2"/>'+
  '<circle cx="20" cy="22" r="1.6" fill="url(#gGoldM)"/><circle cx="44" cy="22" r="1.6" fill="url(#gGoldM)"/>'+gemDot(32,23,3.4,'gGemB');
}
/* Gants : gantelet */
function nGlove(){
  return shadow(32,60,18,3)+
  fg('M18 50V32L13 24Q11 19 16 18L22 26V12Q22 9 25.5 9T29 12V24V8Q29 5 32.5 5T36 8V24V10Q36 7 39.5 7T43 10V26V16Q43 13 46.5 13T50 16V38Q50 45 45 50Z',STEEL)+
  '<path d="M29 13V24M36 11V24M43 15V26" stroke="#5d6672" stroke-width="1" opacity=".8"/>'+
  fg('M15 48H48V59H15Z',GOLD);
}
/* Bottes */
function nBoot(){
  return shadow(32,59,24,3)+fg('M17 11H37V37L52 42Q59 44.5 59 51V56H17Z',BROWN)+
  '<path d="M17 50H59" stroke="#2a1406" stroke-width="1.2"/>'+fg('M15 6H39V14H15Z',GOLD)+
  '<path d="M37 40Q44 44 50 43" fill="none" stroke="#e2a86a" stroke-width="1.2" opacity=".6"/>';
}
/* Accessoire : anneau */
function nRing(){
  return shadow(32,59,18,3)+
  '<ellipse cx="32" cy="40" rx="17" ry="15" fill="none" stroke="#4a3004" stroke-width="9.5"/>'+
  '<ellipse cx="32" cy="40" rx="17" ry="15" fill="none" stroke="url(#uGold)" stroke-width="6.5"/>'+
  '<path d="M17.5 35A17 15 0 0 1 26 26.5" fill="none" stroke="#fff6c8" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>'+
  fg('M23 22 27 15H37L41 22 32 28Z',GOLD)+gemDot(32,18,6.5,'gGemB')+sparkle(46,11,2.8);
}
/* Cuir : peau tannée */
function nLeather(){
  return shadow(32,59,22,3)+fg('M14 9Q22 13 32 9T50 9Q48 19 55 25Q50 33 55 41Q48 45 51 56Q42 52 32 56T13 56Q16 45 9 41Q14 33 9 25Q16 19 14 9Z',BROWN)+
  '<path d="M18 15Q32 19 46 15Q44 25 49 31Q45 37 49 45Q43 46 45 51Q32 48 19 51Q21 46 15 45Q19 37 15 31Q20 25 18 15Z" fill="none" stroke="#e2a86a" stroke-width=".9" stroke-dasharray="1.6 1.8" opacity=".75"/>';
}
/* Minerai : roche à cristaux */
function nOre(){
  var e=' stroke="#ffffff" stroke-opacity=".3" stroke-width=".6" stroke-linejoin="round"';
  return shadow(32,58.5,26,4)+
  poly('8,50 12,34 26,24 44,26 56,38 54,52 34,58 16,57','url(#gRD)',' stroke="#3a414b" stroke-width="1.2" stroke-linejoin="round"')+
  poly('12,34 26,24 44,26 34,36 20,38','url(#gRL)',e)+poly('20,38 34,36 38,50 22,52','url(#gRM)',e)+
  poly('24,30 28,14 33,30','url(#gGemB)',' stroke="#0a3a8a" stroke-width="1"')+poly('33,30 38,10 42,31','url(#gGemB)',' stroke="#0a3a8a" stroke-width="1"')+
  poly('42,40 47,26 51,41','url(#gGemB)',' stroke="#0a3a8a" stroke-width="1"')+sparkle(39,13,2.8);
}
/* Ébène : rondin sombre */
function nEbony(){
  return shadow(33,58,26,4)+
  '<line x1="18" y1="44" x2="46" y2="24" stroke="#120804" stroke-width="25" stroke-linecap="round"/>'+
  '<line x1="18" y1="44" x2="46" y2="24" stroke="url(#nEbony)" stroke-width="22"/>'+
  '<line x1="14" y1="38" x2="42" y2="18" stroke="#8a6248" stroke-width="3" stroke-linecap="round" opacity=".55" filter="url(#fSoft1)"/>'+
  '<ellipse cx="18" cy="44" rx="10" ry="12" fill="#24140a" stroke="#0a0402" stroke-width="1.3"/>'+
  '<ellipse cx="18" cy="44" rx="8" ry="10" fill="url(#nEbonyEnd)"/>'+
  '<ellipse cx="18.4" cy="44.5" rx="5" ry="6.4" fill="none" stroke="#2a1608" stroke-width=".9"/><ellipse cx="18.6" cy="44.8" rx="2.4" ry="3" fill="none" stroke="#2a1608" stroke-width=".9"/>';
}
/* Os de bête */
function nBone(){
  var k=function(x,y){return '<circle cx="'+x+'" cy="'+y+'" r="6" fill="url(#gBone)" stroke="#4a3f28" stroke-width="1.2"/>';};
  return shadow(32,58,22,3)+
  '<line x1="17" y1="47" x2="47" y2="17" stroke="#4a3f28" stroke-width="12" stroke-linecap="round"/>'+
  k(11,45)+k(19,53)+k(45,11)+k(53,19)+
  '<line x1="17" y1="47" x2="47" y2="17" stroke="url(#gBone)" stroke-width="9.4" stroke-linecap="round"/>'+
  '<path d="M19 42 42 19" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>';
}
/* Formations : perles dorées disposées comme les troupes */
function formation(pts){var s=shadow(32,59,24,3,.3);pts.forEach(function(p){s+=orb(p[0],p[1],5.4);});return s;}
function nWedge(){return formation([[32,12],[24,24],[40,24],[16,36],[32,36],[48,36],[8,48],[24,48],[40,48],[56,48]]);}
function nArchF(){var p=[];[200,224,248,270,292,316,340].forEach(function(a){p.push(P(a,24,32,46));});return formation(p);}
function nSquare(){return formation([[16,16],[32,16],[48,16],[16,32],[48,32],[16,48],[32,48],[48,48]])+'<circle cx="32" cy="32" r="4" fill="#3a5070" opacity=".6"/>';}
/* Sculpture : étoile dorée */
function nStar(){var d='',i;for(i=0;i<10;i++){var p=P(-90+i*36,i%2?11:24,32,33);d+=(i?'L':'M')+p[0]+' '+p[1];}return shadow(32,59,18,3)+fg(d+'Z',GOLD)+sparkle(50,12,3);}
/* Livre (expérience) */
function nBook(){
  return shadow(32,59,22,3)+
  '<path d="M16 50V56H52V50" fill="url(#gParch)" stroke="#6b4a1a" stroke-width="1.1"/><path d="M18 52H50M18 54H50" stroke="#c9a868" stroke-width=".7"/>'+
  fg('M12 10H48Q52 10 52 14V50H16Q12 50 12 46Z',BLUE)+
  '<path d="M16 10V50" stroke="#0a1a3a" stroke-width="1.2"/>'+
  '<path d="M45 10H52V17ZM12 43V50H19Z" fill="url(#gGoldM)"/>'+
  '<g transform="translate(34 30)">'+star(0,0,8,'#f3c94a')+'</g>';
}
/* Migration, passeports : carte */
function nMap(){
  return shadow(32,59,26,3)+fg('M7 14 21 9 35 14 49 9 57 12V52L43 57 29 52 15 57 7 54Z',PARCH)+
  '<path d="M21 9V52M35 14V57M49 9V52" stroke="#b8955a" stroke-width="1" opacity=".8"/>'+
  '<path d="M13 46Q20 34 28 38T42 26" fill="none" stroke="#b01828" stroke-width="2" stroke-dasharray="3 2.4" stroke-linecap="round"/>'+
  sg('M41 18 49 26M49 18 41 26',3.6,RED)+'<circle cx="13" cy="46" r="2.6" fill="url(#gGoldM)" stroke="#4a3004" stroke-width=".8"/>';
}
/* Information : médaillon bleu */
function nInfo(){
  return shadow(32,59,18,3)+'<circle cx="32" cy="32" r="22" fill="url(#gFieldB)"/>'+
  '<circle cx="32" cy="32" r="22" fill="none" stroke="#4a3004" stroke-width="5.4"/><circle cx="32" cy="32" r="22" fill="none" stroke="url(#uGold)" stroke-width="3.4"/>'+
  '<circle cx="32" cy="32" r="19" fill="url(#gGloss)"/>'+
  '<rect x="28.5" y="28" width="7" height="17" rx="2.4" fill="#fff"/><circle cx="32" cy="20.5" r="3.8" fill="#fff"/>';
}
/* Dépenser ou attendre : balance */
function nScale(){
  return shadow(32,60,16,2.6)+sg('M32 9V52',5,GOLD)+sg('M11 17H53',4.4,GOLD)+
  '<path d="M11 17 5 34M11 17 17 34M53 17 47 34M53 17 59 34" stroke="#8a5a08" stroke-width="1.1"/>'+
  fg('M3 34Q11 44 19 34Z',GOLD)+fg('M45 34Q53 44 61 34Z',GOLD)+fg('M20 52H44V58H20Z',GOLD)+orb(32,8,3.6);
}
/* Comparer : deux flèches opposées */
function nCompare(){
  return shadow(32,59,22,2.6,.3)+sg('M9 22H46',6,GOLD)+fg('M43 13 57 22 43 31Z',GOLD)+sg('M55 43H18',6,STEEL)+fg('M21 34 7 43 21 52Z',STEEL);
}
/* Rapport de combat : parchemin roulé et sceau */
function nScroll(){
  function roll(y){return '<rect x="9" y="'+(y-4)+'" width="46" height="8" rx="4" fill="url(#gParch2)" stroke="#6b4a1a" stroke-width="1.1"/><circle cx="9" cy="'+y+'" r="4" fill="url(#gWoodH)" stroke="#3b1d0a" stroke-width="1"/><circle cx="55" cy="'+y+'" r="4" fill="url(#gWoodH)" stroke="#3b1d0a" stroke-width="1"/>';}
  return shadow(32,60,22,3)+'<rect x="13" y="12" width="38" height="40" fill="url(#gParch)" stroke="#6b4a1a" stroke-width="1.1"/>'+
  '<path d="M19 21H45M19 27H45M19 33H38" stroke="#a8844a" stroke-width="1.3" stroke-linecap="round"/>'+
  roll(11)+roll(53)+'<circle cx="41" cy="42" r="6" fill="url(#gWax)" stroke="#5a0a10" stroke-width="1"/>'+star(41,42,3,'#ffb0b0',.8);
}
/* Partager : trois perles reliées */
function nShare(){
  return shadow(32,59,22,2.6,.3)+sg('M17 32 46 15M17 32 46 49',3.4,GOLD)+orb(15,32,8.5)+orb(47,15,8.5)+orb(47,49,8.5);
}
/* Codes cadeaux : boîte à ruban */
function nGift(){
  return shadow(32,60,22,3)+fg('M11 28H53V57H11Z',RED)+fg('M8 19H56V29H8Z',RED)+
  fg('M28 19H36V57H28Z',GOLD)+
  '<path d="M32 19C26 9 15 9 17 15S28 19 32 19ZM32 19C38 9 49 9 47 15S36 19 32 19Z" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.2" stroke-linejoin="round"/>'+orb(32,18,3)+sparkle(51,10,2.8);
}
/* Langue : globe */
function nGlobe(){
  return shadow(32,59,18,3)+'<circle cx="32" cy="31" r="22" fill="url(#gFieldB)" stroke="#0e2a5a" stroke-width="1.3"/>'+
  '<path d="M18 18Q24 22 22 28T28 36Q32 42 28 50M38 12Q44 18 40 24T48 32Q52 38 46 46" fill="none" stroke="#62d652" stroke-width="4.6" stroke-linecap="round" opacity=".85"/>'+
  '<path d="M10 31H54M32 9C42 15 42 47 32 53M32 9C22 15 22 47 32 53" fill="none" stroke="url(#uGold)" stroke-width="1.8"/>'+
  '<circle cx="32" cy="31" r="22" fill="url(#gGloss)"/>';
}
/* Copier : deux feuilles */
function nCopy(){
  return shadow(32,59,20,3)+fg('M10 8H38V44H10Z',PARCH)+fg('M24 20H54V58H24Z',PARCH)+
  '<path d="M30 30H48M30 37H48M30 44H42" stroke="#a8844a" stroke-width="1.3" stroke-linecap="round"/>';
}
/* Bilan : tableau et courbe montante */
function nChart(){
  return shadow(32,59,24,3)+fg('M8 10H56V52H8Z',PARCH)+
  '<path d="M14 46H50M14 16V46" stroke="#a8844a" stroke-width="1.2"/>'+
  sg('M16 41 26 31 33 36 46 21',4.2,GREEN)+fg('M41 17 50 16 49 25Z',GREEN);
}
/* Composer les marches : deux étendards (dessin du drapeau n° 28 repris) */
function nBanners(){
  return shadow(32,59,24,3,.3)+'<use href="#i-flag" x="-6" y="4" width="46" height="46"/><use href="#i-flag" x="22" y="10" width="46" height="46"/>';
}
/* Arche d'Osiris : ankh doré */
function nAnkh(){
  return shadow(32,60,14,2.6)+sg('M32 29C23.5 25 22.5 10 32 7 41.5 10 40.5 25 32 29Z',6,GOLD)+sg('M32 30V57M17 35H47',7,GOLD)+gemDot(32,35,3.2,'gGemB');
}

SYM['n-camera']=nCamera();SYM['n-video']=nVideo();SYM['n-vip']=nVip();SYM['n-laurel']=nLaurel();
SYM['n-horseshoe']=nHorseshoe();SYM['n-bow']=nBow();SYM['n-catapult']=nCatapult();
SYM['n-helmet']=nHelmet();SYM['n-armor']=nArmor();SYM['n-glove']=nGlove();SYM['n-boot']=nBoot();SYM['n-ring']=nRing();
SYM['n-leather']=nLeather();SYM['n-ore']=nOre();SYM['n-ebony']=nEbony();SYM['n-bone']=nBone();
SYM['n-wedge']=nWedge();SYM['n-arch']=nArchF();SYM['n-square']=nSquare();
SYM['n-star']=nStar();SYM['n-book']=nBook();SYM['n-map']=nMap();SYM['n-info']=nInfo();SYM['n-scale']=nScale();
SYM['n-compare']=nCompare();SYM['n-scroll']=nScroll();SYM['n-share']=nShare();SYM['n-gift']=nGift();SYM['n-globe']=nGlobe();
SYM['n-copy']=nCopy();SYM['n-chart']=nChart();SYM['n-banners']=nBanners();SYM['n-ankh']=nAnkh();
