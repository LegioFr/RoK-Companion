var O='#20160a';
function lg(id,x2,y2,stops){return '<linearGradient id="'+id+'" x1="0" y1="0" x2="'+x2+'" y2="'+y2+'">'+stops.map(function(s){return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'"'+(s[2]!=null?' stop-opacity="'+s[2]+'"':'')+'/>';}).join('')+'</linearGradient>';}
function rg(id,cx,cy,r,stops){return '<radialGradient id="'+id+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'">'+stops.map(function(s){return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'"'+(s[2]!=null?' stop-opacity="'+s[2]+'"':'')+'/>';}).join('')+'</radialGradient>';}

/* ---------- Dégradés, filtres et masques partagés ---------- */
var COB='M32 5C41.5 5 45 17 44.5 28 44 40 39 48.5 32 48.5 25 48.5 20 40 19.5 28 19 17 22.5 5 32 5Z';
var FLASK='M27.5 13V25.5L13 50.5Q10 57.5 17.5 57.5H46.5Q54 57.5 51 50.5L36.5 25.5V13Z';
var DEFS=
'<filter id="fSoft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>'+
'<filter id="fSoft1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation=".9"/></filter>'+
'<filter id="fDrop" x="-30%" y="-30%" width="170%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/><feOffset dx="1" dy="2" result="b"/><feComponentTransfer in="b" result="s"><feFuncA type="linear" slope=".6"/></feComponentTransfer><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
/* maïs */
lg('gCobBase',1,0,[[0,'#ffe680'],[.5,'#f2b81c'],[1,'#b8780a']])+
rg('gKernel',.36,.3,.8,[[0,'#fffbd6'],[.55,'#f8cf45'],[1,'#cf900e']])+
lg('gCobShade',1,0,[[0,'#ffffff',.35],[.35,'#ffffff',0],[.62,'#5a3500',0],[1,'#5a3500',.5]])+
lg('gHusk1',1,1,[[0,'#d2f59a'],[.4,'#74c650'],[.8,'#2f7f2b'],[1,'#1b5a1e']])+
lg('gHusk2',1,1,[[0,'#94d466'],[.5,'#3f9a35'],[1,'#1a571d']])+
/* bois */
rg('gEndW',.42,.36,.75,[[0,'#ffeccb'],[.45,'#f2c993'],[.85,'#d99d60'],[1,'#b9763d']])+
/* pierre */
lg('gRL',.6,1,[[0,'#f1f4f8'],[1,'#c4ccd6']])+
lg('gRM',.6,1,[[0,'#b6bfcb'],[1,'#8c97a5']])+
lg('gRD',.4,1,[[0,'#7d8795'],[1,'#525b68']])+
/* or */
rg('gCoinFace',.38,.32,.78,[[0,'#fffbe0'],[.3,'#ffe36e'],[.7,'#f0b62a'],[1,'#b6770b']])+
lg('gCoinRim',1,1,[[0,'#fff3b0'],[.45,'#eaa920'],[1,'#94600a']])+
lg('gCoinSide',1,0,[[0,'#7a4e04'],[.3,'#f6d04c'],[.62,'#d89c1c'],[1,'#7f5205']])+
/* gemme */
rg('gGemGlow',.5,.5,.5,[[0,'#ffffff',.8],[1,'#ffffff',0]])+
/* chevrons */
lg('gChevL',0,1,[[0,'#fff7cc'],[.55,'#f8d35a'],[1,'#e3aa25']])+
lg('gChevD',0,1,[[0,'#d99c1c'],[.6,'#a96d0b'],[1,'#7a4c06']])+
/* métal, bois, verre */
lg('gIronTop',0,1,[[0,'#f3f6f9'],[1,'#bcc5cf']])+
lg('gIronSide',0,1,[[0,'#97a1ad'],[1,'#56606c']])+
lg('gWoodH',1,0,[[0,'#6e3f18'],[.35,'#c98c50'],[.6,'#a5642e'],[1,'#5e3414']])+
lg('gLeather',1,0,[[0,'#3e1f0a'],[.4,'#7a4220'],[1,'#3a1c08']])+
lg('gBladeL',1,0,[[0,'#c9d1db'],[1,'#f7f9fb']])+
lg('gBladeD',1,0,[[0,'#8e98a5'],[1,'#626c79']])+
lg('gGoldM',0,1,[[0,'#fff1a6'],[.5,'#efbe3c'],[1,'#a26b0b']])+
lg('gGlass',1,0,[[0,'#e8f6ff',.75],[.5,'#bfe0f5',.45],[1,'#8db8dc',.7]])+
lg('gLiquid',0,1,[[0,'#a6f2ff'],[.45,'#3aa8ee'],[1,'#1858b8']])+
lg('gCork',1,0,[[0,'#8a5228'],[.4,'#d39a62'],[1,'#7a4520']])+
lg('gCrossTop',1,1,[[0,'#c8ffab'],[.5,'#62d652'],[1,'#33a83a']])+
lg('gCrossSide',1,1,[[0,'#3cae3c'],[1,'#145c22']])+
lg('gSand',0,1,[[0,'#fff0b8'],[1,'#e0a232']])+
'<clipPath id="cpCob"><path d="'+COB+'"/></clipPath>'+
'<clipPath id="cpFlask"><path d="'+FLASK+'"/></clipPath>';

function shadow(cx,cy,rx,ry,op){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#000" opacity="'+(op||.38)+'" filter="url(#fSoft)"/>';}
function poly(pts,fill,extra){return '<polygon points="'+pts+'" fill="'+fill+'"'+(extra||'')+'/>';}
function star(cx,cy,s,fill,op){
  var a=s*.28;
  return '<path d="M'+cx+' '+(cy-s)+'L'+(cx+a)+' '+(cy-a)+'L'+(cx+s)+' '+cy+'L'+(cx+a)+' '+(cy+a)+'L'+cx+' '+(cy+s)+'L'+(cx-a)+' '+(cy+a)+'L'+(cx-s)+' '+cy+'L'+(cx-a)+' '+(cy-a)+'Z" fill="'+fill+'"'+(op!=null?' opacity="'+op+'"':'')+'/>';
}
function sparkle(cx,cy,s){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+(s*.55)+'" fill="#fff" opacity=".55" filter="url(#fSoft1)"/>'+star(cx,cy,s,'#fff');}

/* ---------- Ressources ---------- */
function food(){
  var k='';
  for(var r=0;r<11;r++){
    var y=7.2+r*3.95, off=(r%2)?2.15:0;
    for(var c=0;c<7;c++){ var x=19.3+c*4.3+off; k+='<ellipse cx="'+x+'" cy="'+y+'" rx="2.2" ry="1.9" fill="url(#gKernel)" stroke="#b47c10" stroke-width=".45"/>'; }
  }
  var hs='stroke="#1d4a14" stroke-width="1.2" stroke-linejoin="round"';
  return shadow(32,58.5,17,3.6)+
  '<g transform="rotate(20 32 32)">'+
  '<path d="M30 57C22 49 18.5 35 21.5 20 25.5 30 29 40 31 49Z" fill="url(#gHusk2)" '+hs+'/>'+
  '<path d="'+COB+'" fill="url(#gCobBase)"/>'+
  '<g clip-path="url(#cpCob)">'+k+'<rect x="15" y="0" width="34" height="52" fill="url(#gCobShade)"/></g>'+
  '<path d="'+COB+'" fill="none" stroke="#7a4d05" stroke-width="1.3"/>'+
  '<ellipse cx="26.5" cy="19" rx="2.2" ry="8.5" fill="#fff" opacity=".6" filter="url(#fSoft1)"/>'+
  '<path d="M32 6C30 2.5 27.5 1.5 25 2.4M32 6C33.5 2.4 36 1 38.5 1.8M32 6C31.5 3 32.5 1 34 .2" fill="none" stroke="#c98c3e" stroke-width="1" stroke-linecap="round"/>'+
  '<path d="M32 6C30.5 3.4 29 2.4 27.4 2.6" fill="none" stroke="#f3d690" stroke-width=".7" stroke-linecap="round"/>'+
  '<path d="M31 61C18 57 11.5 44 14 24 20.5 33 26 41.5 31 50Z" fill="url(#gHusk1)" '+hs+'/>'+
  '<path d="M33.5 61C46 58 52.5 46 50.5 29 44.5 37.5 39 44 34 51Z" fill="url(#gHusk2)" '+hs+'/>'+
  '<path d="M32.2 62C28.6 56 28.6 50 31.2 45.5 34.2 50 35.2 56 32.2 62Z" fill="url(#gHusk1)" '+hs+'/>'+
  '<path d="M29.2 56.5C22.5 52 18 44 16.2 31M35.5 57C42 53 46.5 46 48.6 36" fill="none" stroke="#e6ffc4" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>'+
  '<path d="M16.5 30C17 40 20.5 48 27 54" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".35" filter="url(#fSoft1)"/>'+
  '</g>';
}
function wood(){
  var L=[[25,29],[15,47],[37,47]], d=[13,-9], n=[-.569,-.822], s='';
  function ln(x1,y1,x2,y2,w,c,op,f){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round"'+(op!=null?' opacity="'+op+'"':'')+(f?' filter="url(#fSoft1)"':'')+'/>';}
  s+=shadow(33,58.5,26,4.2);
  L.forEach(function(p){ /* corps des rondins : volume par bandes claires et sombres */
    var x=p[0],y=p[1],x2=x+d[0],y2=y+d[1];
    function off(k){return [n[0]*k,n[1]*k];}
    var lo=off(-5.2), hi=off(5.6);
    s+=ln(x,y,x2,y2,23.5,'#3b1d0a')+ln(x,y,x2,y2,20.8,'#8a5228')+
       ln(x+lo[0],y+lo[1],x2+lo[0],y2+lo[1],7.5,'#4b270e',.75,1)+
       ln(x+hi[0],y+hi[1],x2+hi[0],y2+hi[1],4.6,'#d6995a',.85,1);
    [-7,-3.5,1,4.2,7.6].forEach(function(k,i){
      var o=off(k), a=.15+i*.12, b=.55+((i*37)%30)/100;
      s+=ln(x+o[0]+d[0]*a,y+o[1]+d[1]*a,x+o[0]+d[0]*b,y+o[1]+d[1]*b,.9,i%2?'#3a1c08':'#c48448',.55);
    });
  });
  L.forEach(function(p){ /* faces coupées */
    var x=p[0],y=p[1];
    s+='<ellipse cx="'+x+'" cy="'+y+'" rx="10.6" ry="12.1" fill="#5c3015" stroke="#2e1606" stroke-width="1.3"/>'+
       '<ellipse cx="'+x+'" cy="'+y+'" rx="9.7" ry="11.2" fill="none" stroke="#3a1c08" stroke-width="1" stroke-dasharray="1.2 1.8"/>'+
       '<ellipse cx="'+x+'" cy="'+y+'" rx="8.8" ry="10.3" fill="#f5d7a6"/>'+
       '<ellipse cx="'+x+'" cy="'+y+'" rx="7.9" ry="9.4" fill="url(#gEndW)"/>'+
       '<ellipse cx="'+(x+.3)+'" cy="'+(y+.3)+'" rx="6.1" ry="7.2" fill="none" stroke="#b4743c" stroke-width=".8" opacity=".6"/>'+
       '<ellipse cx="'+(x+.4)+'" cy="'+(y+.5)+'" rx="4.3" ry="5.1" fill="none" stroke="#b4743c" stroke-width=".8" opacity=".6"/>'+
       '<ellipse cx="'+(x+.5)+'" cy="'+(y+.6)+'" rx="2.4" ry="2.9" fill="none" stroke="#a8682f" stroke-width=".8" opacity=".7"/>'+
       '<circle cx="'+(x+.6)+'" cy="'+(y+.7)+'" r=".9" fill="#8a4f22"/>'+
       '<ellipse cx="'+(x-3.2)+'" cy="'+(y-4.6)+'" rx="2.6" ry="1.5" fill="#fff" opacity=".55" filter="url(#fSoft1)" transform="rotate(-35 '+(x-3.2)+' '+(y-4.6)+')"/>'+
       '<path d="M'+(x+7.4)+' '+(y+4)+'A8.6 10 0 0 1 '+(x-1)+' '+(y+10.2)+'" fill="none" stroke="#5a2e10" stroke-width="1.6" opacity=".35"/>';
  });
  return s;
}
function stone(){
  var st=' stroke="#3a414b" stroke-width="1.15" stroke-linejoin="round"', e=' stroke="#ffffff" stroke-opacity=".28" stroke-width=".6" stroke-linejoin="round"';
  return shadow(33,58.5,27,4.2)+
  /* grosse roche du fond */
  poly('14,38 18,22 30,13 44,15 52,27 50,40 32,44','url(#gRD)',st)+
  poly('18,22 30,13 44,15 36,24 24,27','url(#gRL)',e)+
  poly('14,38 18,22 24,27 26,40','url(#gRM)',e)+
  poly('24,27 36,24 40,38 26,40','#a3adba',e)+
  poly('36,24 44,15 52,27 50,40 40,38','url(#gRD)',e)+
  '<path d="M20 22.5 30 14.2 43 16" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".75" filter="url(#fSoft1)"/>'+
  '<path d="M30 30l3 4 -1 3M45 26l2 5" fill="none" stroke="#48505c" stroke-width=".9" stroke-linecap="round"/>'+
  /* roche avant gauche */
  poly('6,52 9,41 20,35 30,39 32,51 22,58 10,58','url(#gRD)',st)+
  poly('9,41 20,35 30,39 20,44','url(#gRL)',e)+
  poly('6,52 9,41 20,44 18,55 10,58','url(#gRM)',e)+
  poly('20,44 30,39 32,51 22,58 18,55','url(#gRD)',e)+
  '<path d="M10.5 41 20 36 28.5 39.3" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".75" filter="url(#fSoft1)"/>'+
  /* roche avant droite */
  poly('30,50 34,40 46,36 57,41 59,52 50,59 36,59','url(#gRD)',st)+
  poly('34,40 46,36 57,41 46,46','url(#gRL)',e)+
  poly('30,50 34,40 46,46 42,57 36,59','url(#gRM)',e)+
  poly('46,46 57,41 59,52 50,59 42,57','url(#gRD)',e)+
  '<path d="M35.5 40 46 36.8 55.5 41" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".75" filter="url(#fSoft1)"/>'+
  '<path d="M12 47l2.5 3M38 47l3 2.5 0 3M52 48l2 3" fill="none" stroke="#48505c" stroke-width=".9" stroke-linecap="round"/>'+
  '<circle cx="24" cy="18.5" r=".7" fill="#8f9aa8"/><circle cx="38" cy="19" r=".7" fill="#8f9aa8"/><circle cx="15" cy="40.5" r=".6" fill="#8f9aa8"/><circle cx="50" cy="39" r=".6" fill="#8f9aa8"/><circle cx="25" cy="49" r=".6" fill="#3f4752"/>';
}
function coinStack(cx,ys,rx,ry,t){
  var s='';
  ys.forEach(function(y){
    var ticks='';
    for(var i=1;i<9;i++){var x=cx-rx+i*(2*rx/9); ticks+='M'+x.toFixed(1)+' '+(y+1.2)+'V'+(y+t+ry*Math.sqrt(Math.max(0,1-Math.pow((x-cx)/rx,2)))-1).toFixed(1);}
    s+='<path d="M'+(cx-rx)+' '+y+'V'+(y+t)+'A'+rx+' '+ry+' 0 0 0 '+(cx+rx)+' '+(y+t)+'V'+y+'Z" fill="url(#gCoinSide)" stroke="#6b4300" stroke-width="1.1" stroke-linejoin="round"/>'+
       '<path d="'+ticks+'" stroke="#8a5a06" stroke-width=".5" opacity=".7"/>'+
       '<ellipse cx="'+cx+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="url(#gCoinFace)" stroke="#6b4300" stroke-width="1.1"/>';
  });
  var top=ys[ys.length-1];
  return s+'<ellipse cx="'+cx+'" cy="'+top+'" rx="'+(rx*.7)+'" ry="'+(ry*.7)+'" fill="none" stroke="#b07a10" stroke-width="1"/>'+
    '<ellipse cx="'+(cx-3)+'" cy="'+(top-1.3)+'" rx="5" ry="1.2" fill="#fff" opacity=".7" filter="url(#fSoft1)"/>';
}
function coin(cx,cy,r){
  var ri=r*.78;
  return '<ellipse cx="'+(cx+3)+'" cy="'+(cy+.6)+'" rx="'+r+'" ry="'+r+'" fill="url(#gCoinSide)" stroke="#6b4300" stroke-width="1.2"/>'+
  '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="url(#gCoinRim)" stroke="#6b4300" stroke-width="1.2"/>'+
  '<circle cx="'+cx+'" cy="'+cy+'" r="'+ri+'" fill="url(#gCoinFace)" stroke="#a46a08" stroke-width="1"/>'+
  '<path d="M'+(cx+ri*.7)+' '+(cy-ri*.7)+'A'+ri+' '+ri+' 0 0 1 '+(cx-ri*.7)+' '+(cy+ri*.7)+'" fill="none" stroke="#fff6c8" stroke-width="1" opacity=".8"/>'+
  /* emblème frappé : couronne simple en relief */
  '<g transform="translate('+(cx-9)+' '+(cy-7)+')">'+
    '<path d="M1.5 13.5 0 3 5 7.5 9 0 13 7.5 18 3 16.5 13.5Z" fill="#c78a12" transform="translate(.8 .9)" opacity=".8"/>'+
    '<path d="M1.5 13.5 0 3 5 7.5 9 0 13 7.5 18 3 16.5 13.5Z" fill="#f7cf4a" stroke="#9a6206" stroke-width=".9" stroke-linejoin="round"/>'+
    '<rect x="1.5" y="14.2" width="15" height="2.4" rx="1" fill="#f0c03a" stroke="#9a6206" stroke-width=".8"/>'+
    '<path d="M2 4.5 5 8 9 1.6" fill="none" stroke="#fffbe0" stroke-width=".8" stroke-linecap="round" opacity=".9"/>'+
  '</g>'+
  '<path d="M'+(cx-r*.8)+' '+(cy-r*.3)+'A'+(r*.85)+' '+(r*.85)+' 0 0 1 '+(cx-r*.3)+' '+(cy-r*.8)+'" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8" filter="url(#fSoft1)"/>';
}
function gold(){ return shadow(34,58.5,26,4)+coinStack(44,[48,43,38,33,28],12.5,5,5)+coin(24,39.5,18)+sparkle(12.5,27,3.5)+sparkle(52,24,2.6); }
function gem(){
  var e=' stroke="#ffffff" stroke-opacity=".35" stroke-width=".6" stroke-linejoin="round"';
  var F=[
    ['6,26 23,13 16,19','#ff8a9a'],['23,13 32,20.5 16,19','#ff6b80'],['23,13 41,13 32,20.5','#ffb7c1'],
    ['41,13 48,19 32,20.5','#ec3a55'],['41,13 58,26 48,19','#b51530'],
    ['6,26 16,19 24,26','#f04a63'],['16,19 32,20.5 24,26','#ff7a8c'],['32,20.5 40,26 24,26','#f45a70'],
    ['32,20.5 48,19 40,26','#cf2440'],['48,19 58,26 40,26','#9c1029'],
    ['6,26 15,26 32,58','#ef3d57'],['15,26 24,26 32,58','#c81c37'],['24,26 40,26 32,58','#a8122c'],
    ['40,26 49,26 32,58','#850b22'],['49,26 58,26 32,58','#640518']
  ], s=shadow(32,59,18,3.4,.45);
  F.forEach(function(f){s+=poly(f[0],f[1],e);});
  return s+
  '<polygon points="23,13 41,13 58,26 32,58 6,26" fill="none" stroke="#4a0010" stroke-width="1.4" stroke-linejoin="round"/>'+
  '<ellipse cx="27" cy="22" rx="8" ry="5" fill="url(#gGemGlow)" opacity=".7"/>'+
  '<path d="M24.5 14.4 39.5 14.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".85"/>'+
  '<path d="M10 27.5 25 50" stroke="#ffd0d6" stroke-width="1.4" stroke-linecap="round" opacity=".6" filter="url(#fSoft1)"/>'+
  sparkle(46,12,5.5)+sparkle(22,34,2.4);
}

/* ---------- Outils des accélérateurs ---------- */
function hammer(){
  var o='#2a2f37';
  return '<line x1="15" y1="56" x2="38" y2="25" stroke="#3b1d0a" stroke-width="9.5" stroke-linecap="round"/>'+
  '<line x1="15" y1="56" x2="38" y2="25" stroke="#a8662f" stroke-width="7" stroke-linecap="round"/>'+
  '<line x1="13.6" y1="54.8" x2="36.6" y2="23.8" stroke="#e2a86a" stroke-width="2" stroke-linecap="round" opacity=".8" filter="url(#fSoft1)"/>'+
  '<line x1="16.6" y1="57.3" x2="39.4" y2="26.5" stroke="#5e3414" stroke-width="2" stroke-linecap="round" opacity=".7"/>'+
  '<line x1="16.2" y1="54.4" x2="22.6" y2="45.8" stroke="#3b1d0a" stroke-width="9.2" stroke-linecap="round"/>'+
  '<line x1="16.2" y1="54.4" x2="22.6" y2="45.8" stroke="url(#gLeather)" stroke-width="7.2" stroke-linecap="round"/>'+
  '<path d="M14.3 51.6l4.6 3.4M16.3 48.9l4.6 3.4M18.3 46.2l4.6 3.4" stroke="#a8693a" stroke-width=".9" stroke-linecap="round"/>'+
  '<g transform="rotate(37 40 21)">'+
    '<path d="M22 13.5 16 17.5V24.5L22 28.5Z" fill="url(#gIronSide)" stroke="'+o+'" stroke-width="1.2" stroke-linejoin="round"/>'+
    '<rect x="22" y="12.5" width="30" height="17" rx="1.5" fill="url(#gIronSide)" stroke="'+o+'" stroke-width="1.2"/>'+
    '<rect x="22" y="12.5" width="30" height="6.5" rx="1.5" fill="url(#gIronTop)"/>'+
    '<rect x="51" y="10.5" width="8" height="21" rx="2" fill="url(#gIronSide)" stroke="'+o+'" stroke-width="1.2"/>'+
    '<rect x="51" y="10.5" width="8" height="7.5" rx="2" fill="url(#gIronTop)"/>'+
    '<rect x="34.5" y="11.5" width="7" height="19" rx="1" fill="#6c7682" stroke="'+o+'" stroke-width="1"/>'+
    '<path d="M24 14H50M52.5 12.2H57.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".9" filter="url(#fSoft1)"/>'+
  '</g>';
}
function flask(){
  return '<ellipse cx="32" cy="46" rx="16" ry="9" fill="#5fd4ff" opacity=".35" filter="url(#fSoft)"/>'+
  '<path d="'+FLASK+'" fill="url(#gGlass)"/>'+
  '<g clip-path="url(#cpFlask)"><rect x="6" y="37" width="52" height="24" fill="url(#gLiquid)"/>'+
    '<ellipse cx="32" cy="37.5" rx="21" ry="2.6" fill="#d4f8ff"/>'+
    '<circle cx="25" cy="48" r="2.3" fill="#eafcff" opacity=".85"/><circle cx="36.5" cy="51.5" r="1.5" fill="#eafcff" opacity=".85"/><circle cx="31" cy="43.5" r="1.1" fill="#eafcff" opacity=".85"/><circle cx="40" cy="45" r=".9" fill="#eafcff" opacity=".85"/>'+
    '<path d="M14 54Q32 59 50 54V62H14Z" fill="#0e3f8a" opacity=".35"/></g>'+
  '<path d="'+FLASK+'" fill="none" stroke="#23384f" stroke-width="1.4" stroke-linejoin="round"/>'+
  '<path d="M30.2 27.5 18.2 49" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".85" filter="url(#fSoft1)"/>'+
  '<path d="M45.5 49.5 41.5 43" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>'+
  '<rect x="24.5" y="10" width="15" height="4.5" rx="2" fill="#d9eefc" stroke="#23384f" stroke-width="1.2"/>'+
  '<path d="M27 10V4Q27 2.4 28.6 2.4H35.4Q37 2.4 37 4V10Z" fill="url(#gCork)" stroke="#3b1d0a" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M29.4 4.2V8.6M32.4 3.6V9" stroke="#f0c894" stroke-width=".9" stroke-linecap="round" opacity=".8"/>';
}
function sword(){
  var o='#2a2f37';
  return '<path d="M32 2.5 27 10.5V40H32Z" fill="url(#gBladeL)"/>'+
  '<path d="M32 2.5 37 10.5V40H32Z" fill="url(#gBladeD)"/>'+
  '<path d="M32 2.5 37 10.5V40H27V10.5Z" fill="none" stroke="'+o+'" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M32 6V38" stroke="#ffffff" stroke-width=".7" opacity=".7"/>'+
  '<path d="M16.5 40.5Q32 37.2 47.5 40.5L47 45.2Q32 42.4 17 45.2Z" fill="url(#gGoldM)" stroke="#5a3a04" stroke-width="1.1" stroke-linejoin="round"/>'+
  '<rect x="28.9" y="44" width="6.2" height="11" rx="1.6" fill="url(#gLeather)" stroke="#2a1406" stroke-width="1"/>'+
  '<path d="M29 46.6h6M29 49.4h6M29 52.2h6" stroke="#a8693a" stroke-width=".8"/>'+
  '<circle cx="32" cy="58.3" r="4.2" fill="url(#gGoldM)" stroke="#5a3a04" stroke-width="1.1"/>'+
  '<circle cx="32" cy="58.3" r="1.6" fill="#d0203a"/><circle cx="31.5" cy="57.8" r=".6" fill="#fff" opacity=".8"/>';
}
function swords(){ return '<g transform="rotate(-42 32 32)">'+sword()+'</g><g transform="rotate(42 32 32)">'+sword()+'</g>'; }
function cross(){
  return '<path d="M24 7H40V24H57V40H40V57H24V40H7V24H24Z" fill="url(#gCrossSide)" stroke="#0d3a15" stroke-width="1.4" stroke-linejoin="round"/>'+
  '<path d="M26.5 9.5H37.5V26.5H54.5V37.5H37.5V54.5H26.5V37.5H9.5V26.5H26.5Z" fill="url(#gCrossTop)"/>'+
  '<path d="M11 36V28H28V11H36" fill="none" stroke="#f0ffe6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85" filter="url(#fSoft1)"/>'+
  '<path d="M24 7 26.5 9.5M40 7 37.5 9.5M57 24 54.5 26.5M57 40 54.5 37.5M40 57 37.5 54.5M24 57 26.5 54.5M7 40 9.5 37.5M7 24 9.5 26.5M40 24 37.5 26.5M40 40 37.5 37.5M24 40 26.5 37.5M24 24 26.5 26.5" stroke="#1d6a26" stroke-width=".8" opacity=".7"/>'+
  sparkle(48,16,3.4);
}
function hourglass(){
  var w='#3b1d0a';
  function post(x){return '<rect x="'+x+'" y="12" width="5" height="40" rx="2" fill="url(#gWoodH)" stroke="'+w+'" stroke-width="1.1"/>'+
    '<ellipse cx="'+(x+2.5)+'" cy="32" rx="3.6" ry="2.4" fill="url(#gWoodH)" stroke="'+w+'" stroke-width="1"/>';}
  return post(13.5)+post(45.5)+
  '<path d="M20.5 13H43.5C43.5 24 35.5 28 33.5 32 35.5 36 43.5 40 43.5 51H20.5C20.5 40 28.5 36 30.5 32 28.5 28 20.5 24 20.5 13Z" fill="#e6f4ff" fill-opacity=".35" stroke="#23384f" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="M23.5 18.5H40.5C39.5 24 34.5 27 32 30 29.5 27 24.5 24 23.5 18.5Z" fill="url(#gSand)"/>'+
  '<path d="M22 50.5C23 44 28 41.5 32 40.5 36 41.5 41 44 42 50.5Z" fill="url(#gSand)"/>'+
  '<path d="M32 30V41" stroke="#eab045" stroke-width="1.2"/>'+
  '<path d="M23.6 15.5C24 21 26.8 24.6 29.2 27.2M24 49C24.6 45.5 26.5 43.6 28.4 42.6" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".85" filter="url(#fSoft1)"/>'+
  '<rect x="9.5" y="5" width="45" height="8" rx="3" fill="url(#gWoodH)" stroke="'+w+'" stroke-width="1.2"/>'+
  '<rect x="9.5" y="51" width="45" height="8" rx="3" fill="url(#gWoodH)" stroke="'+w+'" stroke-width="1.2"/>'+
  '<rect x="11.5" y="6.3" width="41" height="2.4" rx="1.2" fill="url(#gGoldM)"/><rect x="11.5" y="52.3" width="41" height="2.4" rx="1.2" fill="url(#gGoldM)"/>';
}

/* ---------- Accélérateurs ---------- */
function chevrons(){
  function c(x){
    return poly(x+',8 '+(x+14)+',8 '+(x+31)+',32 '+(x+17)+',32','url(#gChevL)')+
      poly((x+17)+',32 '+(x+31)+',32 '+(x+14)+',56 '+x+',56','url(#gChevD)')+
      '<path d="M'+x+' 8H'+(x+14)+'L'+(x+31)+' 32 '+(x+14)+' 56H'+x+'L'+(x+17)+' 32Z" fill="none" stroke="#5a3a04" stroke-width="1.4" stroke-linejoin="round"/>'+
      '<path d="M'+(x+2)+' 9.6H'+(x+13)+'L'+(x+28)+' 30.5" fill="none" stroke="#fffbe6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>';
  }
  return c(5)+c(25);
}
/* composition 1 : grands chevrons, outil posé devant */
function acc1(tool){ return shadow(34,59,24,3.4,.3)+chevrons()+'<use href="#t-'+tool+'" x="21" y="20" width="43" height="43" filter="url(#fDrop)"/>'; }
/* composition 2 : outil en grand, petits chevrons en badge */
function acc2(tool){ return shadow(34,59,20,3.4,.3)+'<use href="#t-'+tool+'" x="7" y="5" width="54" height="54" filter="url(#fDrop)"/>'+'<g transform="translate(0 1) scale(.44)" filter="url(#fDrop)">'+chevrons()+'</g>'; }


/* ---------- Icônes de l'appli : même rendu peint que les ressources ---------- */
function lgU(id,y1,y2,stops){return '<linearGradient id="'+id+'" gradientUnits="userSpaceOnUse" x1="0" y1="'+y1+'" x2="0" y2="'+y2+'">'+stops.map(function(s){return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'"/>';}).join('')+'</linearGradient>';}
var FIELD='M32 9C39 11.5 44.5 12.5 50.5 12.8 50 30 45 45.5 32 54.5 19 45.5 14 30 13.5 12.8 19.5 12.5 25 11.5 32 9Z';
DEFS+=
lgU('uGold',6,58,[[0,'#fff2b0'],[.45,'#f3c94a'],[.8,'#c48a14'],[1,'#8a5a08']])+
lgU('uSteel',6,58,[[0,'#ffffff'],[.45,'#c9d1db'],[.85,'#8f99a6'],[1,'#5d6672']])+
lgU('uGreen',6,58,[[0,'#d6ffc4'],[.45,'#62d652'],[.85,'#2a9c3a'],[1,'#167a2c']])+
lgU('uRed',6,58,[[0,'#ffc0c0'],[.45,'#ff5a5a'],[.85,'#d0202e'],[1,'#9a1020']])+
lgU('uAmber',4,60,[[0,'#fff7c0'],[.4,'#ffd23a'],[.8,'#f59a10'],[1,'#c06a00']])+
lg('gGloss',0,1,[[0,'#ffffff',.55],[.42,'#ffffff',.12],[.5,'#ffffff',0],[1,'#ffffff',0]])+
rg('gSclera',.45,.4,.7,[[0,'#ffffff'],[.7,'#eef3f8'],[1,'#c4cfdb']])+
rg('gIris',.42,.38,.62,[[0,'#fff1b0'],[.45,'#f0b83a'],[.9,'#b06a10'],[1,'#6a3e06']])+
rg('gEnamelG',.4,.3,.8,[[0,'#9af0a0'],[.55,'#2fb24e'],[1,'#0f6a2a']])+
lg('gParch',0,1,[[0,'#fff6df'],[1,'#e6c890']])+
lg('gParch2',0,1,[[0,'#fffaf0'],[1,'#ecd39c']])+
rg('gWax',.4,.35,.7,[[0,'#ff8a8a'],[.55,'#d0202e'],[1,'#7a0a14']])+
rg('gGemR',.38,.32,.7,[[0,'#ffc0c8'],[.6,'#e0203a'],[1,'#7a0a18']])+
rg('gGemB',.38,.32,.7,[[0,'#c8ecff'],[.6,'#2a7ae0'],[1,'#0a3a8a']])+
rg('gOrb',.36,.3,.75,[[0,'#fffbe0'],[.35,'#ffe36e'],[.75,'#e0a020'],[1,'#8a5a08']])+
lg('gBone',0,1,[[0,'#fffdf0'],[.5,'#ece2c4'],[1,'#bdae86']])+
lg('gTomb',1,1,[[0,'#e3e8ee'],[.55,'#aab4c0'],[1,'#7c8694']])+
lg('gWall',0,1,[[0,'#ece6d8'],[1,'#b4aa94']])+
lg('gPlaster',0,1,[[0,'#fff3dc'],[1,'#e2c89a']])+
lg('gRoofR',1,1,[[0,'#ff9a6a'],[.5,'#d0482a'],[1,'#8a2414']])+
lg('gRoofB',1,1,[[0,'#8ab8ff'],[.5,'#2a5ab8'],[1,'#173a7a']])+
lg('gWin',0,1,[[0,'#fff1a0'],[1,'#f08a20']])+
lg('gMarble',0,1,[[0,'#ffffff'],[1,'#cfd6df']])+
lg('gColumn',1,0,[[0,'#9aa4b0'],[.4,'#ffffff'],[1,'#b0bac6']])+
rg('gDial',.5,.4,.65,[[0,'#2a3a56'],[1,'#0b1220']])+
rg('gFace',.45,.4,.7,[[0,'#fffdf6'],[1,'#e2d4b0']])+
rg('gShade',.35,.3,.8,[[0,'#ffffff',.35],[.5,'#ffffff',0],[1,'#000000',.35]])+
lg('gSoil',0,1,[[0,'#a5743f'],[1,'#56361a']])+
lg('gLeafL',1,1,[[0,'#d2f59a'],[.5,'#4aa83a'],[1,'#1f6a22']])+
lg('gLeafR',0,1,[[0,'#b5ef84'],[1,'#2f8a2a']])+
lg('gFeather',1,0,[[0,'#ffffff'],[.5,'#f2ead6'],[1,'#c9ba92']])+
lg('gChestWood',0,1,[[0,'#d39a5c'],[.5,'#a5642e'],[1,'#6e3f18']])+
lg('gSteelH',1,0,[[0,'#6d7682'],[.35,'#e9eef3'],[.6,'#a9b3bf'],[1,'#5d6672']])+
lg('gTunic',0,1,[[0,'#5a96ff'],[.5,'#1f4fa8'],[1,'#12306a']])+
rg('gSkin',.42,.36,.7,[[0,'#ffe6cc'],[.6,'#e8b48a'],[1,'#b8805a']])+
lg('gFieldB',1,1,[[0,'#6aa8ff'],[.55,'#2a62c8'],[1,'#173a7a']])+
lg('gGroove',0,1,[[0,'#0b1220'],[1,'#2a3446']])+
'<clipPath id="cpField"><path d="'+FIELD+'"/></clipPath>';

var GOLD={t:'url(#uGold)',s:'#8a5a08',o:'#4a3004'}, STEEL={t:'url(#uSteel)',s:'#4b535e',o:'#22272e'},
    GREEN={t:'url(#uGreen)',s:'#146a2c',o:'#0b3a18'}, RED={t:'url(#uRed)',s:'#7a1020',o:'#3e0610'},
    AMBER={t:'url(#uAmber)',s:'#9a5a00',o:'#4a2a00'}, WHITE={t:'#ffffff',s:'#b9d9c4',o:'#0b3a18'};

/* tracé épais en relief (chevrons, croix, coches, flèches) */
function sg(d,w,C){
  return '<g fill="none" stroke-linecap="round" stroke-linejoin="round">'+
  '<path d="'+d+'" stroke="#000" stroke-opacity=".35" stroke-width="'+(w+2.6)+'" transform="translate(1.2 2.4)" filter="url(#fSoft1)"/>'+
  '<path d="'+d+'" stroke="'+C.o+'" stroke-width="'+(w+2.6)+'"/>'+
  '<path d="'+d+'" stroke="'+C.s+'" stroke-width="'+w+'"/>'+
  '<path d="'+d+'" stroke="'+C.t+'" stroke-width="'+(w-1.8)+'" transform="translate(-.3 -.7)"/>'+
  '<path d="'+d+'" stroke="#fff" stroke-opacity=".6" stroke-width="1.1" transform="translate(-.8 -1.9)"/>'+
  '</g>';
}
/* forme pleine en relief : épaisseur, contour, reflet vitré */
function fg(d,C){
  return '<path d="'+d+'" transform="translate(1.2 2.8)" fill="#000" opacity=".3" filter="url(#fSoft1)"/>'+
  '<path d="'+d+'" transform="translate(0 2)" fill="'+C.s+'" stroke="'+C.o+'" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="'+d+'" fill="'+C.t+'" stroke="'+C.o+'" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="'+d+'" fill="url(#gGloss)"/>';
}
function orb(cx,cy,r){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="url(#gOrb)" stroke="#4a3004" stroke-width="1"/><circle cx="'+(cx-r*.35)+'" cy="'+(cy-r*.38)+'" r="'+(r*.3)+'" fill="#fff" opacity=".85" filter="url(#fSoft1)"/>';}
function gemDot(cx,cy,r,g){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="url(#'+g+')" stroke="#2a0a10" stroke-width=".8"/><circle cx="'+(cx-r*.35)+'" cy="'+(cy-r*.4)+'" r="'+(r*.3)+'" fill="#fff" opacity=".85"/>';}
function P(a,r,cx,cy){var t=a*Math.PI/180;return [+(cx+r*Math.cos(t)).toFixed(2),+(cy+r*Math.sin(t)).toFixed(2)];}

/* 2 et 55 : œil */
function eye(slash){
  var E='M5 32C13 19 22.5 13.5 32 13.5S51 19 59 32C51 45 41.5 50.5 32 50.5S13 45 5 32Z';
  return shadow(32,56,20,3,.3)+
  '<path d="'+E+'" fill="url(#gSclera)"/>'+
  '<path d="M10 31C17 22 24 18 32 18S47 22 54 31" fill="none" stroke="#3a4a60" stroke-width="5" opacity=".18" filter="url(#fSoft1)"/>'+
  '<circle cx="32" cy="32" r="13" fill="url(#gIris)" stroke="#5a3a04" stroke-width="1.2"/>'+
  '<circle cx="32" cy="32" r="9" fill="none" stroke="#8a5208" stroke-width=".8" opacity=".6"/>'+
  '<circle cx="32" cy="32" r="5.5" fill="#140d04"/>'+
  '<circle cx="27.5" cy="27" r="2.6" fill="#fff"/><circle cx="36.5" cy="36.5" r="1.1" fill="#fff" opacity=".8"/>'+
  '<path d="'+E+'" fill="none" stroke="#4a3004" stroke-width="4.6" stroke-linejoin="round"/>'+
  '<path d="'+E+'" fill="none" stroke="url(#uGold)" stroke-width="2.8" stroke-linejoin="round"/>'+
  '<path d="M14 21l-3-4M22.5 15.8l-2-4.6M32 13.5V8.5M41.5 15.8l2-4.6M50 21l3-4" fill="none" stroke="#4a3004" stroke-width="3.2" stroke-linecap="round"/>'+
  '<path d="M14 21l-3-4M22.5 15.8l-2-4.6M32 13.5V8.5M41.5 15.8l2-4.6M50 21l3-4" fill="none" stroke="#f3c94a" stroke-width="1.5" stroke-linecap="round"/>'+
  (slash?sg('M12 10 52 54',5.5,RED):'');
}
/* 3 et 54 : bouclier vert, aucun accès au compte */
function shieldCheck(){
  var S='M32 4 55 12.5V31C55 45.5 45 55 32 60 19 55 9 45.5 9 31V12.5Z', S2='M32 10 49.5 16.8V31C49.5 42 41.8 49.6 32 53.6 22.2 49.6 14.5 42 14.5 31V16.8Z';
  return shadow(32,60,18,3,.35)+fg(S,GOLD)+
  '<path d="'+S2+'" fill="url(#gEnamelG)" stroke="#0b3a18" stroke-width="1.1"/><path d="'+S2+'" fill="url(#gGloss)"/>'+
  sg('M22 32 29.5 39.5 43 24',5.5,WHITE)+
  '<circle cx="32" cy="7.3" r="1.2" fill="#fff6c8"/><circle cx="12.5" cy="15" r="1.2" fill="#fff6c8"/><circle cx="51.5" cy="15" r="1.2" fill="#fff6c8"/>';
}
/* 4 : enveloppe scellée */
function envelope(){
  return shadow(32,57,24,3.4)+
  '<rect x="8" y="18" width="48" height="36" rx="3" fill="#b8955a" stroke="#6b4a1a" stroke-width="1.3"/>'+
  '<rect x="8" y="16" width="48" height="36" rx="3" fill="url(#gParch)" stroke="#6b4a1a" stroke-width="1.3"/>'+
  '<path d="M9 51 32 33 55 51Z" fill="#e3c992" opacity=".8"/>'+
  '<path d="M9 51 28 35M55 51 36 35" stroke="#a8844a" stroke-width="1.2" stroke-linecap="round"/>'+
  '<path d="M9 17 32 37 55 17Z" fill="url(#gParch2)" stroke="#6b4a1a" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M12 18.5 32 35.5" stroke="#fff" stroke-width="1.2" opacity=".7"/>'+
  '<circle cx="32" cy="37" r="7.5" fill="url(#gWax)" stroke="#5a0a10" stroke-width="1"/>'+
  '<circle cx="26" cy="42" r="2" fill="#b01828"/><circle cx="38.5" cy="42.5" r="1.6" fill="#b01828"/>'+
  star(32,37,4,'#ffb0b0',.8)+'<circle cx="29.5" cy="34" r="1.6" fill="#fff" opacity=".7"/>';
}
/* 5 : plus doré */
function plusG(){ return shadow(32,58,16,3,.3)+fg('M26 8.5H38V26H55.5V38H38V55.5H26V38H8.5V26H26Z',GOLD); }
/* 6 : couronne */
function crown(){
  return shadow(32,59,22,3.2)+fg('M7 23 19 33 32 11 45 33 57 23 52 47H12Z',GOLD)+
  '<path d="M11 45H53V53.5Q53 56 50.5 56H13.5Q11 56 11 53.5Z" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.3"/>'+
  '<path d="M12.5 47H51.5" stroke="#fff6c8" stroke-width="1" opacity=".8"/>'+
  gemDot(32,50.5,3.6,'gGemR')+gemDot(21,50.5,2.6,'gGemB')+gemDot(43,50.5,2.6,'gGemB')+
  orb(7,23,3.4)+orb(32,11,3.6)+orb(57,23,3.4)+sparkle(45,15,2.6);
}
function chev(d,C){ return sg(d,8,C); }
/* 8 : éclair (Puissance) */
function bolt(){
  var B='M38 3 12 36H29L23 61 52 25H35L44 3Z';
  return '<path d="'+B+'" fill="#ffd23a" opacity=".55" filter="url(#fSoft)"/>'+fg(B,AMBER)+sparkle(50,10,3);
}
/* 9 : crâne (Kills) */
function skull(){
  var K='M32 6C46 6 54 16 54 28C54 35 50.5 39.5 46 41.5V47C46 49 44.5 50 43 50H21C19.5 50 18 49 18 47V41.5C13.5 39.5 10 35 10 28 10 16 18 6 32 6Z';
  var EY='M15.5 29C15.5 24 19 22 23 22.5 27.5 23 28.5 27 27.5 31 26.5 35 22 36.5 19 35 16.5 34 15.5 32 15.5 29Z';
  return shadow(32,57,18,3)+
  '<path d="'+K+'" transform="translate(0 2)" fill="#8a7c58" stroke="#4a3f28" stroke-width="1.3"/>'+
  '<path d="'+K+'" fill="url(#gBone)" stroke="#4a3f28" stroke-width="1.4"/>'+
  '<path d="'+EY+'" fill="#1e1608"/><path d="'+EY+'" fill="#1e1608" transform="translate(64 0) scale(-1 1)"/>'+
  '<path d="M32 34 28.8 40.5H35.2Z" fill="#1e1608"/>'+
  '<path d="M21 44.5H43M24.5 44.5V50M29 44.5V50M35 44.5V50M39.5 44.5V50" stroke="#6b5c3a" stroke-width="1.2"/>'+
  '<path d="M39 8 36.8 13 39.5 16.5 37.5 20.5" fill="none" stroke="#8a7c58" stroke-width="1"/>'+
  '<ellipse cx="23" cy="14" rx="6" ry="3.5" fill="#fff" opacity=".7" filter="url(#fSoft1)"/>';
}
/* 10 : pierre tombale (Morts) */
function tomb(){
  var T='M15 56V25C15 13.5 22.5 7 32 7S49 13.5 49 25V56Z';
  return shadow(32,58,24,4)+
  '<ellipse cx="32" cy="57" rx="24" ry="4.6" fill="#5a3a1a"/>'+
  '<path d="'+T+'" transform="translate(3 1.5)" fill="#5d6672" stroke="#2c3239" stroke-width="1.2"/>'+
  '<path d="'+T+'" fill="url(#gTomb)" stroke="#2c3239" stroke-width="1.3"/><path d="'+T+'" fill="url(#gGloss)" opacity=".7"/>'+
  '<path d="M32 16V40M24 24H40" stroke="#eef2f6" stroke-width="4" stroke-linecap="round" transform="translate(.7 .9)"/>'+
  '<path d="M32 16V40M24 24H40" stroke="#56606c" stroke-width="4" stroke-linecap="round"/>'+
  '<path d="M24 46H40M26.5 50.5H37.5" stroke="#6d7783" stroke-width="1.3" stroke-linecap="round"/>'+
  '<path d="M9 58l2-6.5 2.2 6.5M17 59l1.6-5 1.6 5M43 59l2-6.5 2.2 6.5M51 58l1.6-5 1.6 5" fill="#3f9a35" stroke="#1d4a14" stroke-width="1" stroke-linejoin="round"/>';
}
function merlons(x0,x1,y,h,w){var s='',n=Math.round((x1-x0)/(w*1.6)),step=(x1-x0-w)/n;for(var i=0;i<=n;i++){s+='<rect x="'+(x0+i*step).toFixed(1)+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.1"/>';}return s;}
function bricks(x0,x1,y0,y1,dy){var s='';for(var y=y0+dy,k=0;y<y1;y+=dy,k++){s+='M'+x0+' '+y+'H'+x1;for(var x=x0+(k%2?6:3);x<x1;x+=7){s+='M'+x+' '+(y-dy)+'V'+y;}}return '<path d="'+s+'" stroke="#7d7462" stroke-width=".7" opacity=".55"/>';}
function winA(x,y,w,h){return '<path d="M'+x+' '+(y+h)+'V'+(y+w/2)+'A'+(w/2)+' '+(w/2)+' 0 0 1 '+(x+w)+' '+(y+w/2)+'V'+(y+h)+'Z" fill="url(#gWin)" stroke="#3a2a14" stroke-width="1"/>';}
function door(x,y,w,h){return '<path d="M'+x+' '+(y+h)+'V'+(y+w/2)+'A'+(w/2)+' '+(w/2)+' 0 0 1 '+(x+w)+' '+(y+w/2)+'V'+(y+h)+'Z" fill="url(#gWoodH)" stroke="#3b1d0a" stroke-width="1.2"/><path d="M'+(x+w/2)+' '+(y+2)+'V'+(y+h)+'" stroke="#3b1d0a" stroke-width=".9"/>';}
/* 11 : hôtel de ville (donjon) */
function keep(){
  return shadow(32,58,24,3.4)+
  '<path d="M32 18V3" stroke="#3b1d0a" stroke-width="1.8"/>'+
  '<path d="M32.8 4H46.5L42.5 7.5 46.5 11H32.8Z" fill="url(#uRed)" stroke="#3e0610" stroke-width=".9" stroke-linejoin="round"/>'+
  merlons(14,50,17,7,5)+
  '<rect x="14" y="23" width="36" height="35" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.3"/>'+
  bricks(14,50,23,58,5.5)+
  '<rect x="41" y="17" width="9" height="41" fill="#000" opacity=".16"/>'+
  winA(18.5,30,5,7)+winA(40.5,30,5,7)+door(26,45,12,13)+
  '<rect x="14" y="23" width="36" height="35" fill="none" stroke="#3a414b" stroke-width="1.3"/>';
}
/* 37 : château (Ma ville) */
function castle(){
  function tower(x){return '<rect x="'+x+'" y="22" width="15" height="36" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.2"/>'+bricks(x,x+15,22,58,5.5)+
    '<polygon points="'+(x-2)+',23.5 '+(x+7.5)+',5 '+(x+17)+',23.5" fill="url(#gRoofB)" stroke="#0e2a5a" stroke-width="1.2" stroke-linejoin="round"/>'+
    '<polygon points="'+(x+7.5)+',5 '+(x+17)+',23.5 '+(x+7.5)+',23.5" fill="#000" opacity=".2"/>'+winA(x+5,30,5,7);}
  return shadow(32,58,28,3.6)+
  merlons(20,44,28,6,4.5)+
  '<rect x="20" y="33" width="24" height="25" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.2"/>'+bricks(20,44,33,58,5.5)+
  '<path d="M25 58V47A7 7 0 0 1 39 47V58Z" fill="#1a1208" stroke="#3a2a14" stroke-width="1"/>'+
  '<path d="M27.5 43.5V58M32 40V58M36.5 43.5V58M25 49H39M25 53.5H39" stroke="#8f99a6" stroke-width="1.1"/>'+
  tower(6)+tower(43)+
  '<path d="M13.5 5V1" stroke="#3b1d0a" stroke-width="1.2"/><path d="M13.9 1.2H19L17.2 2.7 19 4.2H13.9Z" fill="#d0202e"/>';
}
/* 29 : maison (Accueil) */
function house(){
  return shadow(32,58,24,3.4)+
  '<rect x="39" y="12" width="7" height="14" fill="#a8482a" stroke="#4a1a0a" stroke-width="1.1"/><rect x="38" y="10.5" width="9" height="3" rx="1" fill="#7a3018" stroke="#4a1a0a" stroke-width="1"/>'+
  '<rect x="14" y="30" width="36" height="27" fill="url(#gPlaster)" stroke="#5a3a1a" stroke-width="1.2"/>'+
  '<path d="M14 42H50M23.5 30V57M40.5 30V57M14 30 23.5 42M50 30 40.5 42" stroke="#6e3f18" stroke-width="2"/>'+
  '<rect x="27.5" y="44" width="9" height="13" rx="1" fill="url(#gWoodH)" stroke="#3b1d0a" stroke-width="1.1"/><circle cx="34.5" cy="51" r=".9" fill="#f3c94a"/>'+
  '<rect x="16.5" y="45" width="5" height="6" fill="url(#gWin)" stroke="#3a2a14" stroke-width=".9"/><rect x="42.5" y="45" width="5" height="6" fill="url(#gWin)" stroke="#3a2a14" stroke-width=".9"/>'+
  '<polygon points="7,33 32,10 57,33" fill="url(#gRoofR)" stroke="#5a1a0a" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="M14.5 26H49.5M21 20H43M27 14.5H37" stroke="#7a2414" stroke-width=".9" opacity=".6"/>'+
  '<path d="M9 32 32 11.5" stroke="#ffd0b0" stroke-width="1.3" opacity=".75" filter="url(#fSoft1)"/>';
}
/* 30 : ville (Ma ville) */
function town(){
  function hs(x,y,w,h){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#gPlaster)" stroke="#5a3a1a" stroke-width="1.1"/>'+
    '<polygon points="'+(x-2.5)+','+(y+2)+' '+(x+w/2)+','+(y-11)+' '+(x+w+2.5)+','+(y+2)+'" fill="url(#gRoofR)" stroke="#5a1a0a" stroke-width="1.1" stroke-linejoin="round"/>'+
    '<rect x="'+(x+w/2-2.5)+'" y="'+(y+5)+'" width="5" height="5" fill="url(#gWin)" stroke="#3a2a14" stroke-width=".8"/>';}
  return shadow(32,58,28,3.4)+hs(5,35,17,22)+hs(42,38,17,19)+
  '<rect x="23" y="22" width="18" height="36" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.2"/>'+bricks(23,41,22,58,5.5)+
  '<polygon points="21,23.5 32,3 43,23.5" fill="url(#gRoofB)" stroke="#0e2a5a" stroke-width="1.2" stroke-linejoin="round"/><polygon points="32,3 43,23.5 32,23.5" fill="#000" opacity=".2"/>'+
  '<circle cx="32" cy="30" r="3.4" fill="url(#gFace)" stroke="#4a3004" stroke-width="1"/><path d="M32 28V30H33.6" stroke="#2a1a04" stroke-width=".8" fill="none"/>'+
  door(27,45,10,13);
}
/* 39 : académie (temple à colonnes) */
function temple(){
  var s=shadow(32,59,27,3.4)+
  '<rect x="4" y="54" width="56" height="5" rx="1" fill="url(#gMarble)" stroke="#4a5260" stroke-width="1.1"/>'+
  '<rect x="7" y="50" width="50" height="5" rx="1" fill="url(#gMarble)" stroke="#4a5260" stroke-width="1.1"/>';
  [11,21.5,32,42.5].forEach(function(x){s+='<rect x="'+(x+1)+'" y="29" width="7" height="21" fill="url(#gColumn)" stroke="#4a5260" stroke-width="1"/><path d="M'+(x+3.5)+' 30V49M'+(x+6)+' 30V49" stroke="#8a94a2" stroke-width=".6"/>';});
  return s+'<rect x="7" y="24" width="50" height="6" fill="url(#gMarble)" stroke="#4a5260" stroke-width="1.1"/>'+
  '<polygon points="5,24.5 32,7 59,24.5" fill="url(#gMarble)" stroke="#4a5260" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<polygon points="12,22.5 32,10 52,22.5" fill="#d9dfe6"/>'+
  '<path d="M26 20.5C29 19 31 19 32 20 33 19 35 19 38 20.5V16C35 14.5 33 14.5 32 15.5 31 14.5 29 14.5 26 16Z" fill="url(#uGold)" stroke="#4a3004" stroke-width=".9"/>';
}
/* 41 : muraille */
function rampart(){
  return shadow(32,58,28,3.4)+merlons(4,60,17,7,6)+
  '<rect x="4" y="23" width="56" height="34" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.3"/>'+bricks(4,60,23,57,5.6)+
  '<rect x="4" y="50" width="56" height="7" fill="#000" opacity=".12"/>'+
  '<path d="M23 57V41A9 9 0 0 1 41 41V57Z" fill="#1a1208" stroke="#3a2a14" stroke-width="1.2"/>'+
  '<path d="M26.5 35V57M32 32V57M37.5 35V57M23 42H41M23 47.5H41M23 53H41" stroke="#9aa4b0" stroke-width="1.1"/>'+
  '<path d="M4 23H60" stroke="#fff" stroke-width="1" opacity=".5"/>';
}
/* 15 : jauge (bonus de vitesse) */
function gauge(){
  function arc(r,a1,a2,c,w){var p=P(a1,r,32,35),q=P(a2,r,32,35);return '<path d="M'+p+'A'+r+' '+r+' 0 '+((a2-a1)>180?1:0)+' 1 '+q+'" fill="none" stroke="'+c+'" stroke-width="'+w+'"/>';}
  var s=shadow(32,60,20,3)+
  '<circle cx="32" cy="37" r="26" fill="#8a5a08" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="35" r="26" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="35" r="21" fill="url(#gDial)" stroke="#4a3004" stroke-width="1.1"/>'+
  arc(16.5,150,250,'#3ecf6e',4.2)+arc(16.5,250,320,'#f6c83a',4.2)+arc(16.5,320,390,'#ff4a4a',4.2);
  for(var a=150;a<=390;a+=30){var p=P(a,20,32,35),q=P(a,13,32,35);s+='<path d="M'+p+'L'+q+'" stroke="#e6ecf3" stroke-width="1" opacity=".75"/>';}
  var t=P(300,17,32,35);
  return s+'<path d="M32 35L'+t+'" stroke="#2a1a04" stroke-width="4" stroke-linecap="round"/><path d="M32 35L'+t+'" stroke="#ff6a3a" stroke-width="2.2" stroke-linecap="round"/>'+
  orb(32,35,4)+'<ellipse cx="27" cy="25" rx="11" ry="5" fill="#fff" opacity=".18" transform="rotate(-20 27 25)"/>';
}
/* 20 : cible (Objectifs) */
function target(){
  var s=shadow(31,60,22,3)+'<circle cx="31" cy="35" r="25.5" fill="#6e3f18" stroke="#3b1d0a" stroke-width="1.3"/>';
  [[23,'#d0202e'],[18,'#f6efe0'],[13,'#d0202e'],[8,'#f6efe0'],[4,'#f3c94a']].forEach(function(r){s+='<circle cx="31" cy="35" r="'+r[0]+'" fill="'+r[1]+'" stroke="#3e0610" stroke-width=".8"/>';});
  return s+'<circle cx="31" cy="35" r="23" fill="url(#gShade)"/>'+
  '<path d="M32 34 54 12" stroke="#3b1d0a" stroke-width="4" stroke-linecap="round"/><path d="M32 34 54 12" stroke="#c48448" stroke-width="2.2" stroke-linecap="round"/>'+
  '<path d="M50 9 55 4 56.5 11 61 9.5 56 15 51.5 13.5Z" fill="#f6efe0" stroke="#3e0610" stroke-width=".9" stroke-linejoin="round"/>'+
  '<path d="M53 12 58 7M51.5 10.5 56 6" stroke="#d0202e" stroke-width="1.6"/>'+
  '<circle cx="32" cy="34" r="1.6" fill="#22272e"/>';
}
/* 22 : bouclier héraldique (équipement) */
function shieldEquip(){
  var K='M32 4C40 7 47 8 55 8 55 30 49 49 32 60 15 49 9 30 9 8 17 8 24 7 32 4Z';
  return shadow(32,60,18,3)+fg(K,STEEL)+
  '<path d="'+FIELD+'" fill="url(#gFieldB)" stroke="#0e2a5a" stroke-width="1"/>'+
  '<g clip-path="url(#cpField)"><path d="M10 37 32 23 54 37V45L32 31 10 45Z" fill="url(#uGold)" stroke="#4a3004" stroke-width="1"/></g>'+
  '<path d="'+FIELD+'" fill="url(#gGloss)"/>'+star(32,17,4.5,'#ffe36e')+
  '<circle cx="32" cy="6.5" r="1.1" fill="#fff"/><circle cx="12" cy="10" r="1.1" fill="#fff"/><circle cx="52" cy="10" r="1.1" fill="#fff"/>';
}
/* 24 : horloge (Activité) */
function clock(){
  var s=shadow(32,60,18,3)+'<rect x="28" y="3" width="8" height="5" rx="1.5" fill="url(#uGold)" stroke="#4a3004" stroke-width="1"/>'+
  '<circle cx="32" cy="35" r="25" fill="#8a5a08" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="33" r="25" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="33" r="19.5" fill="url(#gFace)" stroke="#4a3004" stroke-width="1.1"/>';
  for(var a=0;a<360;a+=30){var p=P(a,17.5,32,33),q=P(a,a%90?15.5:14,32,33);s+='<path d="M'+p+'L'+q+'" stroke="#3a2a14" stroke-width="'+(a%90?1:1.8)+'" stroke-linecap="round"/>';}
  var h=P(300,9.5,32,33),m=P(30,14,32,33),sc=P(160,15,32,33);
  return s+'<path d="M32 33L'+h+'" stroke="#2a1a04" stroke-width="3" stroke-linecap="round"/><path d="M32 33L'+m+'" stroke="#2a1a04" stroke-width="2" stroke-linecap="round"/>'+
  '<path d="M32 33L'+sc+'" stroke="#d0202e" stroke-width="1" stroke-linecap="round"/>'+orb(32,33,2.6)+
  '<ellipse cx="25" cy="23" rx="10" ry="4.5" fill="#fff" opacity=".35" transform="rotate(-25 25 23)"/>';
}
/* 26 : pousse (Ferme) */
function sprout(){
  return shadow(32,59,24,3)+
  '<path d="M8 55C12 45 22 41 32 41S52 45 56 55Z" fill="url(#gSoil)" stroke="#3a220c" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<circle cx="20" cy="50" r="1" fill="#3a220c"/><circle cx="40" cy="48" r="1.1" fill="#3a220c"/><circle cx="46" cy="52" r=".9" fill="#c49a6a"/><circle cx="27" cy="47" r=".8" fill="#c49a6a"/>'+
  '<path d="M32 46C32 38 30.8 31 33 23" fill="none" stroke="#1d4a14" stroke-width="4.4" stroke-linecap="round"/><path d="M32 46C32 38 30.8 31 33 23" fill="none" stroke="#5cc04a" stroke-width="2.4" stroke-linecap="round"/>'+
  '<path d="M32 33C24 35 13 31 10 20 19.5 15.5 29 20 32 33Z" fill="url(#gLeafL)" stroke="#1d4a14" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M33 26C38 15.5 48 9.5 57 11.5 56 22 46.5 29 33 26Z" fill="url(#gLeafR)" stroke="#1d4a14" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M31 31C25 27 19 24 13 21M34.5 24.5C40 20 46 16 54 13" fill="none" stroke="#e6ffc4" stroke-width="1" opacity=".75"/>'+
  '<path d="M48 18.5C48 18.5 46.5 20.5 46.5 21.5A1.5 1.5 0 0 0 49.5 21.5C49.5 20.5 48 18.5 48 18.5Z" fill="#bfe8ff" stroke="#2a7ae0" stroke-width=".6"/>';
}
/* 27 : trophée (MGE) */
function trophy(){
  var H='M15 13C6 13 5.5 27 17 29', H2='M49 13C58 13 58.5 27 47 29';
  return shadow(32,60,16,3)+
  '<rect x="19" y="50" width="26" height="9" rx="1.6" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.2"/>'+
  '<rect x="23" y="46" width="18" height="5" rx="1" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.1"/>'+
  '<path d="M29 46V40H35V46Z" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.1"/><ellipse cx="32" cy="39.5" rx="5.5" ry="2.4" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.1"/>'+
  '<path d="'+H+'M'+H2.slice(1)+'" fill="none" stroke="#4a3004" stroke-width="5" stroke-linecap="round"/><path d="'+H+'M'+H2.slice(1)+'" fill="none" stroke="#f3c94a" stroke-width="2.8" stroke-linecap="round"/>'+
  fg('M14 8H50V14C50 28 42 37 32 37S14 28 14 14Z',GOLD)+
  '<ellipse cx="32" cy="8.5" rx="17.5" ry="2.6" fill="#8a5a08" stroke="#4a3004" stroke-width="1"/>'+
  star(32,21,6,'#fff2b0')+'<path d="M19 12C19 22 22 29 26 33" fill="none" stroke="#fff" stroke-width="2" opacity=".6" filter="url(#fSoft1)"/>'+sparkle(48,6,3);
}
/* 28 : drapeau (KvK) */
function banner(){
  return shadow(30,60,18,3)+
  '<path d="M16 9C26 5 34 13 44 9 48 7.5 52 7.5 57 9V35C47 33 40 39 30 36 24 34 20 35 16 36Z" fill="url(#uRed)" stroke="#3e0610" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M30 11C33 17 33 29 30 35.5M44 9.5C41 15 41 28 43.5 34" fill="none" stroke="#7a1020" stroke-width="2.5" opacity=".45" filter="url(#fSoft1)"/>'+
  '<path d="M19 12C27 9 34 16 44 12.5 48 11 51 11 54 12V32.5C46 31 40 36 30 33.3 25 32 21.5 32.4 19 33Z" fill="none" stroke="#f3c94a" stroke-width="1.1"/>'+
  star(36,22,6,'#f6d04c')+
  '<path d="M14 60V6" stroke="#3b1d0a" stroke-width="5" stroke-linecap="round"/><path d="M14 60V6" stroke="#a8662f" stroke-width="3" stroke-linecap="round"/><path d="M13.2 58V8" stroke="#e2a86a" stroke-width="1" opacity=".8"/>'+
  orb(14,5,3.4);
}
/* 31 : curseurs (Optimiser) */
function sliders(){
  function row(y,k){return '<rect x="7" y="'+(y-3.5)+'" width="50" height="7" rx="3.5" fill="url(#gGroove)" stroke="#22272e" stroke-width="1.1"/>'+
    '<rect x="8.5" y="'+(y-1.6)+'" width="'+(k-8.5)+'" height="3.2" rx="1.6" fill="url(#uGold)"/>'+
    '<circle cx="'+k+'" cy="'+(y+1.5)+'" r="8.5" fill="#000" opacity=".3" filter="url(#fSoft1)"/>'+orb(k,y,8);}
  return row(21,24)+row(43,41);
}
/* 32 : trois points (Plus) */
function dots(){ return shadow(32,44,24,3,.3)+orb(12,32,7.5)+orb(32,32,7.5)+orb(52,32,7.5); }
/* 33 et 45 : flèches de synchronisation */
function sync(C){
  function head(a,dir){var p=P(a,19,32,32),t=a*Math.PI/180,d=[Math.sin(t)*dir,-Math.cos(t)*dir],n=[Math.cos(t),Math.sin(t)];
    var tip=[p[0]+d[0]*8,p[1]+d[1]*8],b1=[p[0]+n[0]*7,p[1]+n[1]*7],b2=[p[0]-n[0]*7,p[1]-n[1]*7];
    return fg('M'+tip.map(function(v){return v.toFixed(1)}).join(' ')+'L'+b1.map(function(v){return v.toFixed(1)}).join(' ')+'L'+b2.map(function(v){return v.toFixed(1)}).join(' ')+'Z',C);}
  var a1=P(340,19,32,32),a2=P(200,19,32,32),b1=P(160,19,32,32),b2=P(20,19,32,32);
  return sg('M'+a1+'A19 19 0 0 0 '+a2,6.5,C)+sg('M'+b1+'A19 19 0 0 0 '+b2,6.5,C)+head(200,1)+head(20,1);
}
/* 36 : plume (Tout renseigner) */
function quill(){
  var s=shadow(26,59,18,3)+
  '<path d="M54 4C42 5.5 29 15 21 30L16.5 43 27 36C40 30 50.5 18 54 4Z" fill="url(#gFeather)" stroke="#6b5a3a" stroke-width="1.1" stroke-linejoin="round"/>';
  for(var i=0;i<9;i++){var t=i/9,x=50-t*30,y=8+t*30;s+='<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+'l'+(4-t*1.5).toFixed(1)+' 2.4M'+x.toFixed(1)+' '+y.toFixed(1)+'l-2.6 -3.4" stroke="#cbbd96" stroke-width=".7"/>';}
  return s+'<path d="M52 6C40 16 28 28 17.5 42.5" fill="none" stroke="#a8925e" stroke-width="1.3" stroke-linecap="round"/>'+
  '<path d="M41 11 44 15" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>'+
  '<path d="M16.5 41.5 10.5 56 22 45.5Z" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.1" stroke-linejoin="round"/><path d="M12.5 53 17 46" stroke="#4a3004" stroke-width=".8"/>'+
  '<path d="M9 57C9 57 7 60 7 61.2A2 2 0 0 0 11 61.2C11 60 9 57 9 57Z" fill="#2a4a9a"/>';
}
/* 42 : coffre (objet d'amélioration) */
function chest(){
  return shadow(32,59,25,3.2)+
  '<rect x="9" y="30" width="46" height="26" rx="2" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.3"/>'+
  '<path d="M9 30V24C9 15 19.5 10.5 32 10.5S55 15 55 24V30Z" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.3"/>'+
  '<path d="M9 40H55M9 48H55M14 24C16 18 23 15 32 15S48 18 50 24" stroke="#5a2e10" stroke-width=".9" opacity=".7" fill="none"/>'+
  '<path d="M16 12.5V56M43 12.5V56" stroke="#4a3004" stroke-width="6.5"/><path d="M16 12.5V56M43 12.5V56" stroke="url(#uGold)" stroke-width="4.5"/>'+
  '<rect x="8" y="28" width="48" height="4.5" rx="1" fill="url(#uGold)" stroke="#4a3004" stroke-width="1"/>'+
  '<rect x="27" y="26" width="10" height="12" rx="1.8" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.1"/>'+
  '<circle cx="32" cy="31" r="1.7" fill="#2a1a04"/><path d="M31.2 32H32.8L33.3 35.2H30.7Z" fill="#2a1a04"/>'+
  '<path d="M12 22C14 16 21 13 30 12.5" fill="none" stroke="#fff" stroke-width="1.6" opacity=".5" filter="url(#fSoft1)"/>'+sparkle(52,10,3.2);
}
/* 43 : alerte */
function warn(){
  return fg('M32 5C34 5 35.5 6 36.5 8L59 49C61 53 59 57 54.5 57H9.5C5 57 3 53 5 49L27.5 8C28.5 6 30 5 32 5Z',RED)+
  '<rect x="29.2" y="20" width="5.6" height="22" rx="2.8" fill="#fff" stroke="#3e0610" stroke-width=".9"/><circle cx="32" cy="48.5" r="3.4" fill="#fff" stroke="#3e0610" stroke-width=".9"/>';
}
/* 46 : hors connexion */
function wifiOff(){
  function a(r){var p=P(225,r,32,50),q=P(315,r,32,50);return 'M'+p+'A'+r+' '+r+' 0 0 1 '+q;}
  return sg(a(30),5,STEEL)+sg(a(20),5,STEEL)+sg(a(10),5,STEEL)+'<circle cx="32" cy="51.5" r="4.2" fill="url(#uSteel)" stroke="#22272e" stroke-width="1.1"/>'+sg('M12 10 52 56',5.5,RED);
}
/* 47 : étiquette (type de profil) */
function tag(){
  var T='M30 6H54C56 6 58 8 58 10V34C58 35 57.6 36 57 36.6L35 58.6C33.4 60.2 30.8 60.2 29.2 58.6L5.4 34.8C3.8 33.2 3.8 30.6 5.4 29L27 7.2C27.8 6.4 28.9 6 30 6Z';
  return '<path d="'+T+'" transform="translate(1 2.4)" fill="#000" opacity=".3" filter="url(#fSoft1)"/>'+
  '<path d="'+T+'" transform="translate(0 2)" fill="#b8955a" stroke="#6b4a1a" stroke-width="1.2"/>'+
  '<path d="'+T+'" fill="url(#gParch)" stroke="#6b4a1a" stroke-width="1.3"/>'+
  '<path d="M22 34 33 23M26 39.5 39.5 26M30.5 45 41 34.5" stroke="#b89a62" stroke-width="1.8" stroke-linecap="round"/>'+
  '<circle cx="47" cy="17" r="4.6" fill="none" stroke="#4a3004" stroke-width="3.6"/><circle cx="47" cy="17" r="4.6" fill="none" stroke="url(#uGold)" stroke-width="2"/><circle cx="47" cy="17" r="2.6" fill="#3a2a14"/>'+
  '<path d="M48.5 14.5C52 7 57 4.5 62 3" fill="none" stroke="#b01828" stroke-width="1.6" stroke-linecap="round"/>';
}
/* 48 : carte d'identité (ID joueur) */
function idCard(){
  return shadow(32,58,25,3)+
  '<rect x="5" y="15" width="54" height="38" rx="4" fill="#b8955a" stroke="#6b4a1a" stroke-width="1.2"/>'+
  '<rect x="5" y="13" width="54" height="38" rx="4" fill="url(#gParch)" stroke="#6b4a1a" stroke-width="1.3"/>'+
  '<path d="M5 21V17Q5 13 9 13H55Q59 13 59 17V21Z" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.1"/>'+
  '<rect x="10" y="25" width="16" height="20" rx="2" fill="url(#gFieldB)" stroke="#4a3004" stroke-width="1.1"/>'+
  '<circle cx="18" cy="32" r="3.8" fill="url(#gSkin)" stroke="#6b3e1e" stroke-width=".8"/><path d="M11.5 45C12 39.5 15 38 18 38S24 39.5 24.5 45Z" fill="url(#gTunic)"/>'+
  '<path d="M31 29H54M31 34.5H50M31 40H46" stroke="#8a6a3a" stroke-width="2" stroke-linecap="round"/>'+
  '<circle cx="51" cy="44.5" r="4" fill="url(#gWax)" stroke="#5a0a10" stroke-width=".8"/>';
}
/* 49 : cadenas (instantanés) */
function padlock(){
  return shadow(32,60,18,3)+sg('M21 30V20C21 13 26 8.5 32 8.5S43 13 43 20V30',6,STEEL)+
  fg('M18 28H46C48.8 28 51 30.2 51 33V53C51 55.8 48.8 58 46 58H18C15.2 58 13 55.8 13 53V33C13 30.2 15.2 28 18 28Z',GOLD)+
  '<circle cx="32" cy="40" r="3.8" fill="#2a1a04"/><path d="M30.2 42H33.8L35 50H29Z" fill="#2a1a04"/>'+
  '<circle cx="17.5" cy="32.5" r="1.2" fill="#fff2b0"/><circle cx="46.5" cy="32.5" r="1.2" fill="#fff2b0"/><circle cx="17.5" cy="53.5" r="1.2" fill="#fff2b0"/><circle cx="46.5" cy="53.5" r="1.2" fill="#fff2b0"/>';
}
/* 50 : corbeille (supprimer) */
function trash(){
  return shadow(32,60,16,3)+
  '<path d="M15 20H49L45.5 57C45.3 58.7 44 60 42.3 60H21.7C20 60 18.7 58.7 18.5 57Z" fill="url(#gSteelH)" stroke="#22272e" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="M25 26 26 54M32 26V54M39 26 38 54" stroke="#4b535e" stroke-width="2.2" stroke-linecap="round"/><path d="M25.8 26 26.8 54M32.8 26V54M39.8 26 38.8 54" stroke="#fff" stroke-width=".7" opacity=".6"/>'+
  '<path d="M26 13V9C26 8 27 7 28 7H36C37 7 38 8 38 9V13" fill="none" stroke="#22272e" stroke-width="4.4"/><path d="M26 13V9C26 8 27 7 28 7H36C37 7 38 8 38 9V13" fill="none" stroke="url(#uSteel)" stroke-width="2.4"/>'+
  fg('M13.5 13H50.5C52 13 53 14 53 15.5V18C53 19.5 52 20.5 50.5 20.5H13.5C12 20.5 11 19.5 11 18V15.5C11 14 12 13 13.5 13Z',RED);
}
/* 51 : personne (compte) */
function person(){
  return shadow(32,60,22,3)+
  '<path d="M9 59C9 45 18.5 37.5 32 37.5S55 45 55 59Z" fill="url(#gTunic)" stroke="#0e2a5a" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="M23.5 39 32 47 40.5 39" fill="none" stroke="#4a3004" stroke-width="4.4" stroke-linejoin="round"/><path d="M23.5 39 32 47 40.5 39" fill="none" stroke="url(#uGold)" stroke-width="2.6" stroke-linejoin="round"/>'+
  '<circle cx="32" cy="22" r="12" fill="url(#gSkin)" stroke="#6b3e1e" stroke-width="1.2"/>'+
  '<path d="M20 21C20 13 25.5 9.5 32 9.5S44 13 44 21C41 17 37 15.5 32 15.5S23 17 20 21Z" fill="#5a3414" stroke="#3a1e08" stroke-width="1"/>'+
  '<path d="M24 13C27 11 31 10.5 34 11" stroke="#a8693a" stroke-width="1.2" fill="none" stroke-linecap="round"/>'+
  '<path d="M13 52C15 45 20 41.5 26 40" stroke="#fff" stroke-width="1.6" fill="none" opacity=".4" filter="url(#fSoft1)"/>';
}
/* 52 : se déconnecter (porte et flèche) */
function logout(){
  return shadow(30,60,24,3)+
  '<rect x="7" y="6" width="30" height="53" rx="2" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.3"/>'+
  '<rect x="11.5" y="10.5" width="21" height="48.5" fill="#120c06"/>'+
  '<polygon points="11.5,10.5 24,15 24,56 11.5,59" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.1" stroke-linejoin="round"/>'+
  '<path d="M11.5 25 24 26.5M11.5 44 24 43.5" stroke="#4a3004" stroke-width="2"/><circle cx="21" cy="36" r="1.5" fill="#f3c94a"/>'+
  fg('M29 26.5H43V18.5L59 32 43 45.5V37.5H29Z',RED);
}
/* 53 : installer */
function install(){
  return sg('M9 43V51C9 54.5 11.5 57 15 57H49C52.5 57 55 54.5 55 51V43',5.5,STEEL)+fg('M26 4.5H38V27H48.5L32 45.5 15.5 27H26Z',GOLD);
}
/* 23 : épée (Combat, KvK) */
function swordNav(){ return shadow(32,59,14,2.6,.3)+'<g transform="rotate(40 32 32)">'+sword()+'</g>'; }

/* ---------- Retouches après l'avis de Mickaël (6 oct.) ---------- */
DEFS+=
lg('gTower',1,0,[[0,'#7d7462'],[.3,'#efe8da'],[.65,'#c2b8a2'],[1,'#7a7060']])+
lg('gLid',0,1,[[0,'#e6ae6c'],[1,'#a5642e']])+
lg('gSil',0,1,[[0,'#ffffff'],[1,'#c4cfdc']])+
lg('gPencil',0,1,[[0,'#ffd86a'],[1,'#e8961a']])+
'<clipPath id="cpMed"><circle cx="32" cy="32" r="20.5"/></clipPath>';

/* 11 et 37 : hôtel de ville en château (donjon, deux tours rondes, porte) */
function townhall(){
  function tower(x){return '<rect x="'+x+'" y="24" width="14" height="34" fill="url(#gTower)" stroke="#3a414b" stroke-width="1.2"/>'+
    '<rect x="'+(x-1.5)+'" y="20" width="17" height="6" rx="1" fill="url(#gTower)" stroke="#3a414b" stroke-width="1.1"/>'+
    '<rect x="'+(x-1.5)+'" y="15.5" width="4.5" height="5" fill="url(#gTower)" stroke="#3a414b" stroke-width="1"/>'+
    '<rect x="'+(x+4.75)+'" y="15.5" width="4.5" height="5" fill="url(#gTower)" stroke="#3a414b" stroke-width="1"/>'+
    '<rect x="'+(x+11)+'" y="15.5" width="4.5" height="5" fill="url(#gTower)" stroke="#3a414b" stroke-width="1"/>'+
    '<path d="M'+x+' 34H'+(x+14)+'M'+x+' 42H'+(x+14)+'M'+x+' 50H'+(x+14)+'" stroke="#7d7462" stroke-width=".7" opacity=".6"/>'+
    '<rect x="'+(x+5.5)+'" y="29" width="3" height="7" rx="1.5" fill="#1a1208"/>';}
  return shadow(32,59,29,3.6)+
  '<path d="M32 10V1.5" stroke="#3b1d0a" stroke-width="1.6"/><path d="M32.7 2H44L40.5 5 44 8H32.7Z" fill="url(#uRed)" stroke="#3e0610" stroke-width=".9" stroke-linejoin="round"/>'+
  merlons(20,44,9.5,5,4.5)+
  '<rect x="20" y="14" width="24" height="26" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.2"/>'+bricks(20,44,14,40,5.5)+
  '<rect x="37" y="9.5" width="7" height="30.5" fill="#000" opacity=".14"/>'+winA(28.5,19,7,9)+
  merlons(14,50,29,5,4.5)+
  '<rect x="14" y="34" width="36" height="24" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.2"/>'+bricks(14,50,34,58,6)+
  '<path d="M25 58V47A7 7 0 0 1 39 47V58Z" fill="#6b6150" stroke="#3a414b" stroke-width="1.2"/>'+
  '<path d="M27 58V47.5A5 5 0 0 1 37 47.5V58Z" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.1"/>'+
  '<path d="M32 43V58M27 51H37" stroke="#3b1d0a" stroke-width=".9"/><circle cx="34.5" cy="53.5" r=".9" fill="#f3c94a"/>'+
  tower(4)+tower(46)+
  '<path d="M6 25V56" stroke="#fff" stroke-width="1" opacity=".35"/><path d="M48 25V56" stroke="#fff" stroke-width="1" opacity=".35"/>';
}
/* 29 : maison redessinée */
function house2(){
  return shadow(32,59,25,3.4)+
  '<rect x="41" y="10" width="7" height="15" fill="#a8482a" stroke="#4a1a0a" stroke-width="1.1"/><rect x="40" y="8.5" width="9" height="3" rx="1" fill="#7a3018" stroke="#4a1a0a" stroke-width="1"/>'+
  '<rect x="13" y="31" width="38" height="26" fill="url(#gPlaster)" stroke="#5a3a1a" stroke-width="1.2"/>'+
  '<rect x="13" y="52" width="38" height="5" fill="url(#gWall)" stroke="#5a3a1a" stroke-width="1"/>'+
  '<path d="M27 57V46.5A5 5 0 0 1 37 46.5V57Z" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.1"/><circle cx="34.6" cy="52" r=".9" fill="#f3c94a"/>'+
  '<rect x="16" y="37" width="8" height="8" rx="1" fill="url(#gWin)" stroke="#3a2a14" stroke-width="1"/><path d="M20 37V45M16 41H24" stroke="#fff6dc" stroke-width="1.1"/>'+
  '<rect x="40" y="37" width="8" height="8" rx="1" fill="url(#gWin)" stroke="#3a2a14" stroke-width="1"/><path d="M44 37V45M40 41H48" stroke="#fff6dc" stroke-width="1.1"/>'+
  '<path d="M5 35 32 9 59 35 55.5 37.5 32 15 8.5 37.5Z" fill="#7a2414" stroke="#4a1208" stroke-width="1.1" stroke-linejoin="round"/>'+
  '<polygon points="8.5,34 32,11.5 55.5,34" fill="url(#gRoofR)" stroke="#5a1a0a" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M16 27Q24 25.4 32 27Q40 25.4 48 27M22.5 21Q27 19.6 32 21Q37 19.6 41.5 21" fill="none" stroke="#8a2a16" stroke-width="1" opacity=".7"/>'+
  '<circle cx="32" cy="25" r="3.6" fill="url(#gWin)" stroke="#3a2a14" stroke-width="1.1"/>'+
  '<path d="M10.5 33.2 32 12.6" stroke="#ffd0b0" stroke-width="1.4" opacity=".75" filter="url(#fSoft1)"/>';
}
/* 24 : parchemin de journal (Activité) */
function journal(){
  var s=shadow(32,60,22,3)+
  '<rect x="14" y="12" width="36" height="40" fill="url(#gParch)" stroke="#6b4a1a" stroke-width="1.3"/>'+
  '<rect x="44" y="12" width="6" height="40" fill="#000" opacity=".08"/>';
  [[22,'#3ecf6e'],[31,'#f3c94a'],[40,'#5a96ff']].forEach(function(r){s+='<circle cx="21" cy="'+r[0]+'" r="2.6" fill="'+r[1]+'" stroke="#4a3004" stroke-width=".8"/>'+
    '<path d="M26 '+(r[0]-1.2)+'H44M26 '+(r[0]+2)+'H38" stroke="#8a6a3a" stroke-width="1.5" stroke-linecap="round"/>';});
  function roll(y){return '<rect x="9" y="'+y+'" width="46" height="9" rx="4.5" fill="url(#gParch2)" stroke="#6b4a1a" stroke-width="1.2"/>'+
    '<path d="M13 '+(y+6.5)+'H51" stroke="#b8955a" stroke-width="1.2" opacity=".7"/><path d="M13 '+(y+2.2)+'H51" stroke="#fff" stroke-width="1" opacity=".7"/>'+
    '<ellipse cx="9" cy="'+(y+4.5)+'" rx="2.4" ry="4.5" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1"/><ellipse cx="55" cy="'+(y+4.5)+'" rx="2.4" ry="4.5" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1"/>';}
  return s+roll(6)+roll(49);
}
/* 36 : crayon qui écrit sur une feuille (Tout renseigner) */
function pencilSheet(){
  var T=[22,52],d=[.685,-.728],n=[.728,.685];
  function at(k,o){return [T[0]+d[0]*k+n[0]*(o||0),T[1]+d[1]*k+n[1]*(o||0)];}
  function pt(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}
  function ln(a,b,w,c,cap,op){return '<path d="M'+pt(a)+'L'+pt(b)+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="'+(cap||'butt')+'"'+(op?' opacity="'+op+'"':'')+'/>';}
  var C=at(8),E=at(37),F=at(42),G=at(47);
  return shadow(32,60,24,3)+
  '<path d="M8 8H38L46 16V56H8Z" fill="url(#gParch)" stroke="#6b4a1a" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="M38 8V16H46Z" fill="#d9bd85" stroke="#6b4a1a" stroke-width="1.1" stroke-linejoin="round"/>'+
  '<path d="M13 20H33M13 27H38M13 34H31M13 41H24" stroke="#8a6a3a" stroke-width="1.5" stroke-linecap="round"/>'+
  '<path d="M14 49C16 46 18 50 20 48" fill="none" stroke="#3a2a14" stroke-width="1.2" stroke-linecap="round"/>'+
  '<path d="M'+pt(C)+'L'+pt(G)+'" stroke="#000" stroke-opacity=".3" stroke-width="9" transform="translate(1.2 2.4)" filter="url(#fSoft1)"/>'+
  ln(C,E,9.4,'#4a2a00')+ln(C,E,7,'url(#gPencil)')+ln(at(8,1.2),at(37,1.2),1,'#c06a00','butt',.8)+ln(at(8,-1.4),at(37,-1.4),1.6,'#fff6c8','butt',.8)+
  ln(E,F,9.4,'#22272e')+ln(E,F,7,'#c9d1db')+'<path d="M'+pt(at(38.5,-3.5))+'L'+pt(at(38.5,3.5))+'M'+pt(at(40.5,-3.5))+'L'+pt(at(40.5,3.5))+'" stroke="#6d7682" stroke-width=".9"/>'+
  ln(F,G,9.4,'#7a2030','round')+ln(F,G,7,'#f08aa0','round')+
  '<polygon points="'+pt(at(8,3.6))+' '+pt(at(8,-3.6))+' '+pt(T)+'" fill="#f3d3a0" stroke="#6b4a1a" stroke-width="1" stroke-linejoin="round"/>'+
  '<polygon points="'+pt(at(2.6,1.2))+' '+pt(at(2.6,-1.2))+' '+pt(T)+'" fill="#2a2a2a"/>';
}
/* 42 : coffre redessiné (ferrures en fer, serrure dorée) */
function chest2(){
  var iron='#3a414b';
  return shadow(32,59,26,3.2)+
  '<rect x="8" y="31" width="48" height="25" rx="2" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.3"/>'+
  '<path d="M8 39.5H56M8 47.5H56" stroke="#5a2e10" stroke-width="1" opacity=".75"/>'+
  '<path d="M8 31V25C8 16.5 18.5 11 32 11S56 16.5 56 25V31Z" fill="url(#gLid)" stroke="#3b1d0a" stroke-width="1.3"/>'+
  '<path d="M9 24.5C11 18 20 14.5 32 14.5S53 18 55 24.5" fill="none" stroke="#7a4520" stroke-width="1" opacity=".7"/>'+
  '<path d="M15 12.8V56M49 12.8V56" stroke="#1c2027" stroke-width="6"/><path d="M15 12.8V56M49 12.8V56" stroke="'+iron+'" stroke-width="4.6"/><path d="M14 13.5V55M48 13.5V55" stroke="#9aa4b0" stroke-width="1"/>'+
  '<rect x="7" y="29" width="50" height="4.4" rx="1" fill="'+iron+'" stroke="#1c2027" stroke-width="1"/><path d="M8 30H56" stroke="#9aa4b0" stroke-width=".8"/>'+
  '<circle cx="15" cy="20" r="1" fill="#c9d1db"/><circle cx="15" cy="37" r="1" fill="#c9d1db"/><circle cx="15" cy="51" r="1" fill="#c9d1db"/><circle cx="49" cy="20" r="1" fill="#c9d1db"/><circle cx="49" cy="37" r="1" fill="#c9d1db"/><circle cx="49" cy="51" r="1" fill="#c9d1db"/>'+
  fg('M27 26H37V35.5L32 39.5 27 35.5Z',GOLD)+
  '<circle cx="32" cy="30.5" r="1.6" fill="#2a1a04"/><path d="M31.2 31.5H32.8L33.2 35H30.8Z" fill="#2a1a04"/>'+
  '<path d="M12 22C14.5 16.5 22 13.8 31 13.5" fill="none" stroke="#fff" stroke-width="1.6" opacity=".55" filter="url(#fSoft1)"/>';
}
/* 51 : médaillon doré avec silhouette (Compte) */
function medallion(){
  return shadow(32,60,20,3)+
  '<circle cx="32" cy="34" r="26" fill="#8a5a08" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="32" r="26" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="32" r="20.5" fill="url(#gFieldB)" stroke="#4a3004" stroke-width="1.1"/>'+
  '<g clip-path="url(#cpMed)"><circle cx="32" cy="26" r="7.6" fill="url(#gSil)"/><path d="M16 54C16 43 23 37 32 37S48 43 48 54Z" fill="url(#gSil)"/></g>'+
  '<circle cx="32" cy="32" r="20.5" fill="url(#gGloss)"/>'+
  '<path d="M12.5 26A20.5 20.5 0 0 1 26 12.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7" filter="url(#fSoft1)"/>';
}
function boltNoStar(){ var B='M38 3 12 36H29L23 61 52 25H35L44 3Z'; return '<path d="'+B+'" fill="#ffd23a" opacity=".55" filter="url(#fSoft)"/>'+fg(B,AMBER); }
function crossNoStar(){ return cross().replace(sparkle(48,16,3.4),''); }

/* ---------- Assemblage du sprite ---------- */
var SYM={
  'r-food':food(),'r-wood':wood(),'r-stone':stone(),'r-gold':gold(),'r-gem':gem(),
  't-hammer':hammer(),'t-flask':flask(),'t-swords':swords(),'t-cross':cross(),'t-hourglass':hourglass(),
  'i-eye':eye(false),'i-eyeoff':eye(true),'i-shield':shieldCheck(),'i-mail':envelope(),'i-plus':plusG(),'i-crown':crown(),
  'i-next':chev('M24 12 44 32 24 52',GOLD),'i-next2':chev('M24 12 44 32 24 52',STEEL),'i-back':chev('M40 12 20 32 40 52',GOLD),
  'i-bolt':bolt(),'i-skull':skull(),'i-tomb':tomb(),'i-keep':keep(),'i-castle':castle(),'i-house':house(),'i-town':town(),
  'i-temple':temple(),'i-wall':rampart(),'i-gauge':gauge(),'i-target':target(),'i-shield2':shieldEquip(),'i-sword':swordNav(),
  'i-clock':clock(),'i-sprout':sprout(),'i-trophy':trophy(),'i-flag':banner(),'i-sliders':sliders(),'i-dots':dots(),
  'i-update':sync(GOLD),'i-pending':sync(AMBER),'i-close':sg('M18 18 46 46M46 18 18 46',8,STEEL),'i-check':sg('M13 33 26 46 51 18',8.5,GREEN),
  'i-quill':quill(),'i-chest':chest(),'i-warn':warn(),'i-offline':wifiOff(),'i-tag':tag(),'i-id':idCard(),'i-lock':padlock(),
  'i-trash':trash(),'i-person':person(),'i-logout':logout(),'i-install':install()
};
SYM['i-bolt']=boltNoStar();SYM['i-hall']=townhall();SYM['i-house']=house2();SYM['i-journal']=journal();SYM['i-pencil']=pencilSheet();SYM['i-chest']=chest2();SYM['i-medal']=medallion();SYM['i-hosp']=crossNoStar();
/* ---------- Retouches, 2e tour (6 oct.) ---------- */
DEFS+='<clipPath id="cpChest"><path d="M8 56V25C8 16.5 18.5 11 32 11S56 16.5 56 25V56Z"/></clipPath>'+
lg('gSideWall',0,1,[[0,'#c9bfa8'],[1,'#8f8572']])+lg('gRoofT',0,1,[[0,'#c8583a'],[1,'#7a2414']]);
/* 42 : coffre, ferrures recoupées à la forme du coffre */
function chest3(){
  var iron='#3a414b';
  return shadow(32,59,26,3.2)+
  '<rect x="8" y="31" width="48" height="25" rx="2" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.3"/>'+
  '<path d="M8 39.5H56M8 47.5H56" stroke="#5a2e10" stroke-width="1" opacity=".75"/>'+
  '<path d="M8 31V25C8 16.5 18.5 11 32 11S56 16.5 56 25V31Z" fill="url(#gLid)" stroke="#3b1d0a" stroke-width="1.3"/>'+
  '<path d="M9 24.5C11 18 20 14.5 32 14.5S53 18 55 24.5" fill="none" stroke="#7a4520" stroke-width="1" opacity=".7"/>'+
  '<g clip-path="url(#cpChest)"><path d="M15 8V58M49 8V58" stroke="#1c2027" stroke-width="6"/><path d="M15 8V58M49 8V58" stroke="'+iron+'" stroke-width="4.4"/><path d="M14 8V58M48 8V58" stroke="#9aa4b0" stroke-width=".9"/></g>'+
  '<path d="M8 31V25C8 16.5 18.5 11 32 11S56 16.5 56 25V31M8 31V54Q8 56 10 56H54Q56 56 56 54V31" fill="none" stroke="#3b1d0a" stroke-width="1.3"/>'+
  '<rect x="7" y="29" width="50" height="4.4" rx="1" fill="'+iron+'" stroke="#1c2027" stroke-width="1"/><path d="M8 30H56" stroke="#9aa4b0" stroke-width=".8"/>'+
  '<circle cx="15" cy="22" r="1" fill="#c9d1db"/><circle cx="15" cy="37" r="1" fill="#c9d1db"/><circle cx="15" cy="51" r="1" fill="#c9d1db"/><circle cx="49" cy="22" r="1" fill="#c9d1db"/><circle cx="49" cy="37" r="1" fill="#c9d1db"/><circle cx="49" cy="51" r="1" fill="#c9d1db"/>'+
  fg('M27 26H37V35.5L32 39.5 27 35.5Z',GOLD)+
  '<circle cx="32" cy="30.5" r="1.6" fill="#2a1a04"/><path d="M31.2 31.5H32.8L33.2 35H30.8Z" fill="#2a1a04"/>'+
  '<path d="M20 15.5C24 14 27.5 13.6 31 13.5" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".55" filter="url(#fSoft1)"/>';
}
/* 24 : ligne de pouls dans un écran rond (Activité) */
function pulse(){
  var L='M12.5 34H21L25 25.5 30 43 35.5 17.5 40 38 43 34H51.5';
  var s=shadow(32,60,20,3)+
  '<circle cx="32" cy="34" r="26" fill="#8a5a08" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="32" r="26" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.3"/>'+
  '<circle cx="32" cy="32" r="20.5" fill="url(#gDial)" stroke="#4a3004" stroke-width="1.1"/>';
  var g='';for(var k=-15;k<=15;k+=7.5){g+='<path d="M'+(32+k)+' 11V53M11 '+(32+k)+'H53" stroke="#3a5a7a" stroke-width=".6" opacity=".55"/>';}s+='<g clip-path="url(#cpMed)">'+g+'</g>';
  return s+'<path d="'+L+'" fill="none" stroke="#3ecf6e" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" opacity=".55" filter="url(#fSoft1)"/>'+
  '<path d="'+L+'" fill="none" stroke="#3ecf6e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'+
  '<path d="'+L+'" fill="none" stroke="#eaffef" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/>'+
  '<circle cx="51.5" cy="34" r="2" fill="#eaffef"/>'+
  '<path d="M14 26A19 19 0 0 1 26 13.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".45" filter="url(#fSoft1)"/>';
}
/* 29 : maison en vue de trois quarts (Accueil) */
function house3(){
  function lerp(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
  var A=[21,18],B=[43,13.5],C=[35.5,36],D=[58,31.5],tiles='';
  for(var t=.2;t<.95;t+=.19){var p=lerp(A,C,t),q=lerp(B,D,t);tiles+='M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+'L'+q[0].toFixed(1)+' '+q[1].toFixed(1);}
  return shadow(33,59,27,3.4)+
  '<circle cx="47" cy="7" r="3.2" fill="#e6ecf3" opacity=".55" filter="url(#fSoft1)"/><circle cx="50.5" cy="3.5" r="2.4" fill="#e6ecf3" opacity=".4" filter="url(#fSoft1)"/>'+
  '<rect x="43" y="10" width="7" height="12" fill="#a8482a" stroke="#4a1a0a" stroke-width="1.1"/><rect x="42" y="8.5" width="9" height="2.8" rx="1" fill="#7a3018" stroke="#4a1a0a" stroke-width="1"/>'+
  /* mur latéral */
  '<path d="M34 35 54 31V53.5L34 57.5Z" fill="url(#gSideWall)" stroke="#3a414b" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M40.5 38.8 47.5 37.4V45.4L40.5 46.8Z" fill="url(#gWin)" stroke="#3a2a14" stroke-width="1"/><path d="M44 38.1V46.1M40.5 42.8 47.5 41.4" stroke="#fff6dc" stroke-width=".9"/>'+
  /* façade en pierre avec pignon */
  '<path d="M9 35 21 21.5 34 35V57.5H9Z" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.2" stroke-linejoin="round"/>'+
  bricks(9,34,35,57.5,5.5)+
  '<path d="M16 57.5V47A5.5 5.5 0 0 1 27 47V57.5Z" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.1"/><path d="M21.5 42.5V57.5" stroke="#3b1d0a" stroke-width=".8"/><circle cx="24.3" cy="52" r=".9" fill="#f3c94a"/>'+
  '<circle cx="21.5" cy="31.5" r="2.8" fill="url(#gWin)" stroke="#3a2a14" stroke-width="1"/>'+
  /* toit */
  '<path d="M'+A+'L'+B+'L'+D+'L'+C+'Z" fill="url(#gRoofT)" stroke="#4a1208" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="'+tiles+'" stroke="#5a1a0a" stroke-width=".9" opacity=".6"/>'+
  '<path d="M'+A+'L'+B+'" stroke="#ffb090" stroke-width="1.2" opacity=".7"/>'+
  '<path d="M7 36.5 21 19.5 36 36.5" fill="none" stroke="#4a1208" stroke-width="4.4" stroke-linejoin="round" stroke-linecap="round"/>'+
  '<path d="M7 36.5 21 19.5 36 36.5" fill="none" stroke="#b8482a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>'+
  '<path d="M8 35.5 20.6 20.3" stroke="#ffc0a0" stroke-width=".9" opacity=".8"/>';
}
SYM['i-chest']=chest3();SYM['i-pulse']=pulse();SYM['i-house']=house3();

/* ---------- Retouches, 3e tour (6 oct.) : trône (Accueil) et cloche (Activité) ---------- */
DEFS+=lg('gVelvet',1,1,[[0,'#ff7a7a'],[.5,'#c0182a'],[1,'#6a0814']]);
function throne(){
  var o='#4a3004',s=shadow(32,60,25,3.4)+
  fg('M17 35V12C17 8 20.5 5 24.5 4.6 28 4.2 30 3 32 1.6 34 3 36 4.2 39.5 4.6 43.5 5 47 8 47 12V35Z',GOLD)+
  '<path d="M21.5 34V13.5C21.5 11 23.5 9.2 26.5 9 29 8.8 30.5 8.2 32 7.3 33.5 8.2 35 8.8 37.5 9 40.5 9.2 42.5 11 42.5 13.5V34Z" fill="url(#gVelvet)" stroke="#4a0610" stroke-width="1"/>';
  [[27,15],[37,15],[32,20],[27,25],[37,25],[32,30]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.1" fill="#f3c94a" stroke="#4a3004" stroke-width=".5"/>';});
  s+='<path d="M24 12.5C26 10.8 29 10.4 31 10" stroke="#ffb0b0" stroke-width="1.2" fill="none" opacity=".7" stroke-linecap="round"/>'+
  gemDot(32,4.6,1.9,'gGemR')+
  /* accoudoirs */
  fg('M7 42V31C7 28.5 9 27 11.5 27H19V42Z',GOLD)+fg('M57 42V31C57 28.5 55 27 52.5 27H45V42Z',GOLD)+
  orb(9.5,28.5,3.2)+orb(54.5,28.5,3.2)+
  /* assise */
  '<rect x="13" y="34" width="38" height="8.5" rx="3.5" fill="url(#gVelvet)" stroke="#4a0610" stroke-width="1.1"/>'+
  '<path d="M16 36.3H48" stroke="#ff9a9a" stroke-width="1" opacity=".7" stroke-linecap="round"/>'+
  '<rect x="11" y="41.5" width="42" height="6.5" rx="1.6" fill="url(#uGold)" stroke="'+o+'" stroke-width="1.2"/>'+
  '<path d="M13 43H51" stroke="#fff2b0" stroke-width=".9" opacity=".8"/>'+gemDot(32,44.8,2,'gGemB')+
  /* pieds */
  '<rect x="19" y="48" width="26" height="6" fill="url(#gVelvet)" stroke="#4a0610" stroke-width="1"/>'+
  '<rect x="13" y="48" width="6" height="10" rx="1" fill="url(#uGold)" stroke="'+o+'" stroke-width="1.1"/><rect x="45" y="48" width="6" height="10" rx="1" fill="url(#uGold)" stroke="'+o+'" stroke-width="1.1"/>'+
  orb(16,58,2.6)+orb(48,58,2.6);
  return s;
}
function bell(){
  return shadow(32,60,17,3)+
  '<path d="M8 21C5 25 5 31 7.5 35M12.5 23.5C10.8 26 10.8 29.5 12.2 32M56 21C59 25 59 31 56.5 35M51.5 23.5C53.2 26 53.2 29.5 51.8 32" fill="none" stroke="#f3d982" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>'+
  '<circle cx="32" cy="7" r="3.6" fill="none" stroke="#4a3004" stroke-width="3.6"/><circle cx="32" cy="7" r="3.6" fill="none" stroke="url(#uGold)" stroke-width="2"/>'+
  orb(32,56.5,4.2)+
  fg('M32 10C21.5 10 16.5 18 16.5 28.5V38C16.5 42 13.5 45 10.5 47.5V50.5H53.5V47.5C50.5 45 47.5 42 47.5 38V28.5C47.5 18 42.5 10 32 10Z',GOLD)+
  '<path d="M9 48.5H55V52.5Q55 54.5 53 54.5H11Q9 54.5 9 52.5Z" fill="url(#uGold)" stroke="#4a3004" stroke-width="1.2"/>'+
  '<path d="M11 50H53" stroke="#fff2b0" stroke-width=".9" opacity=".8"/>'+
  '<path d="M17 36.5Q32 39.5 47 36.5M17 40Q32 43 47 40" fill="none" stroke="#8a5a08" stroke-width="1.1"/>'+
  '<path d="M22 20C20.5 25 20.5 32 21 40" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6" filter="url(#fSoft1)"/>';
}
SYM['i-throne']=throne();SYM['i-bell']=bell();

/* ---------- Propositions pour l'Accueil (n° 29), 4e tour ---------- */
/* A : maison dorée en relief, comme les autres icônes de navigation */
function accA(){ return shadow(32,59,22,3,.3)+fg('M41 22V10H48V22Z',GOLD)+fg('M32 6 59 30H52V56H38V41H26V56H12V30H5Z',GOLD); }
/* B : couronne sur un coussin de velours */
function accB(){
  return shadow(32,60,26,3)+
  '<path d="M5 47C5 41 12 38.5 32 38.5S59 41 59 47 52 57 32 57 5 53 5 47Z" fill="url(#gVelvet)" stroke="#4a0610" stroke-width="1.2"/>'+
  '<path d="M10 45C14 42.5 22 41.5 32 41.5S50 42.5 54 45" fill="none" stroke="#ff9a9a" stroke-width="1" opacity=".7"/>'+
  '<path d="M7 49.5V53.5M57 49.5V53.5" stroke="#4a3004" stroke-width="1.2"/>'+fg('M7 53 4.8 60H9.2Z',GOLD)+fg('M57 53 54.8 60H59.2Z',GOLD)+
  '<use href="#i-crown" x="11" y="0" width="42" height="42"/>';
}
/* C : grande porte d'entrée sous une arche de pierre */
function accC(){
  var s=shadow(32,60,26,3)+
  '<path d="M7 58V29A25 25 0 0 1 57 29V58Z" fill="url(#gWall)" stroke="#3a414b" stroke-width="1.3"/>';
  for(var a=190;a<=350;a+=20){var p=P(a,25,32,29),q=P(a,18,32,29);s+='<path d="M'+p+'L'+q+'" stroke="#7d7462" stroke-width=".9"/>';}
  return s+'<path d="M7 40H14M50 40H57M7 50H14M50 50H57" stroke="#7d7462" stroke-width=".8"/>'+
  '<path d="M14 58V29A18 18 0 0 1 50 29V58Z" fill="#ffcf6a"/>'+
  '<path d="M14 58V29A18 18 0 0 1 31 11.1V58Z" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.1"/>'+
  '<path d="M33 58V11.1A18 18 0 0 1 50 29V58Z" fill="url(#gChestWood)" stroke="#3b1d0a" stroke-width="1.1"/>'+
  '<path d="M20 20V58M25.5 14V58M38.5 14V58M44 20V58" stroke="#5a2e10" stroke-width=".9" opacity=".8"/>'+
  '<path d="M14 30H31M33 30H50M14 47H31M33 47H50" stroke="#2a2f37" stroke-width="2.4"/>'+
  '<circle cx="27.5" cy="38" r="2.4" fill="none" stroke="#f3c94a" stroke-width="1.3"/><circle cx="36.5" cy="38" r="2.4" fill="none" stroke="#f3c94a" stroke-width="1.3"/>'+
  '<path d="M32 12V58" stroke="#fff3c0" stroke-width="1.2" opacity=".9" filter="url(#fSoft1)"/>';
}
/* D : étendard du royaume à la couronne */
function accD(){
  return shadow(32,60,18,3)+
  '<path d="M15 11H49V52L32 43.5 15 52Z" fill="url(#gFieldB)" stroke="#0e2a5a" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M18 13H46V47.5L32 40.5 18 47.5Z" fill="none" stroke="#f3c94a" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M15 11H49V52L32 43.5 15 52Z" fill="url(#gGloss)" opacity=".6"/>'+
  '<use href="#i-crown" x="19" y="15" width="26" height="26"/>'+
  '<path d="M8 10H56" stroke="#3b1d0a" stroke-width="4.6" stroke-linecap="round"/><path d="M8 10H56" stroke="#a8662f" stroke-width="2.8" stroke-linecap="round"/>'+
  '<path d="M24 10 32 3 40 10" fill="none" stroke="#4a3004" stroke-width="1.6"/>'+orb(6.5,10,3)+orb(57.5,10,3)+orb(32,3,2.4);
}
/* E : pavillon royal (tente) */
function accE(){
  var s=shadow(32,60,26,3);
  var body='', roof='';
  for(var i=0;i<8;i++){var x0=10+i*5.5,x1=x0+5.5,c=i%2?'#f6efe0':'#2a5ab8';body+='<path d="M'+x0+' 31H'+x1+'L'+(x1+(i>=4?.6:-.6))+' 56H'+(x0+(i>=4?.6:-.6))+'Z" fill="'+c+'"/>';}
  for(var j=0;j<6;j++){var a=8+j*8,b=a+8,c2=j%2?'#f6efe0':'#2a5ab8';roof+='<path d="M32 9L'+a+' 31H'+b+'Z" fill="'+c2+'"/>';}
  return s+'<path d="M32 9V2" stroke="#3b1d0a" stroke-width="1.5"/><path d="M32.7 2.3H42L39 4.6 42 7H32.7Z" fill="url(#uRed)" stroke="#3e0610" stroke-width=".8"/>'+
  body+'<path d="M10 31H54L55 56H9Z" fill="url(#gShade)" opacity=".7"/><path d="M10 31H54L55 56H9Z" fill="none" stroke="#4a0610" stroke-width="1.2" stroke-linejoin="round"/>'+
  '<path d="M26 56 32 37 38 56Z" fill="#1a0a06" stroke="#0e2a5a" stroke-width="1"/><path d="M26 56 32 37 29.5 56Z" fill="#2a5ab8" opacity=".9"/>'+
  roof+'<path d="M32 9 8 31H56Z" fill="none" stroke="#0e2a5a" stroke-width="1.3" stroke-linejoin="round"/>'+
  '<path d="M8 31Q12 34 16 31Q20 34 24 31Q28 34 32 31Q36 34 40 31Q44 34 48 31Q52 34 56 31" fill="#f3c94a" stroke="#4a3004" stroke-width="1"/>'+orb(32,9,2.4);
}
SYM['i-acc-a']=accA();SYM['i-acc-b']=accB();SYM['i-acc-c']=accC();SYM['i-acc-d']=accD();SYM['i-acc-e']=accE();

