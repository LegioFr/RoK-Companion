// Contraste mesuré sur l'écran réel : on rend chaque texte transparent, on photographie le fond derrière, on compare.
// Usage : node contraste.cjs <url> <sortie.json> <état> <écran> <zone> [<état> <écran> <zone> ...]
const {chromium}=require('/opt/node-tools/node_modules/playwright');const fs=require('fs');const path=require('path');
const [url,outFile,...rest]=process.argv.slice(2);const jobs=[];for(let i=0;i<rest.length;i+=3)jobs.push(rest.slice(i,i+3));
const TAILLES=[['telephone',390,844],['tablette',800,1280],['pc',1920,1080]];
const DIR=path.join(process.env.ROBOT_SORTIE||__dirname,'fonds');fs.mkdirSync(DIR,{recursive:true});
(async()=>{const local=/localhost/.test(url);const b=await chromium.launch(local?{}:{proxy:{server:process.env.HTTPS_PROXY}});const out=[];
for(const [t,w,h] of TAILLES){const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:w,height:h}});
  await ctx.addInitScript(()=>{try{if(!sessionStorage.getItem('rb')){localStorage.clear();localStorage.setItem('rc-open','false');localStorage.setItem('rc-mode','demo');sessionStorage.setItem('rb','1');}}catch(e){}});
  const p=await ctx.newPage();await p.goto(url);await p.waitForTimeout(1200);
  for(const [st,hash,zone] of jobs){await p.evaluate(([s,h])=>window.RC_API.go(s,h),[st,hash]);await p.waitForTimeout(600);
    await p.addStyleTag({content:'#rcBub{display:none!important} *{transition:none!important;animation:none!important}'});
    const els=await p.evaluate(z=>{const root=document.querySelector(z);if(!root)return [];const L=[];let i=0;
      root.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);if(!(r.width>0&&r.height>0)||s.visibility==='hidden'||e.closest('[hidden]'))return;
        if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;e.setAttribute('data-ctr',i++);
        L.push({i:i-1,t:e.textContent.replace(/\s+/g,' ').trim().slice(0,50),c:s.color,fs:parseFloat(s.fontSize),fw:+s.fontWeight,x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height,ph:e.tagName==='INPUT'});});
      root.querySelectorAll('input[placeholder]').forEach(e=>{const r=e.getBoundingClientRect();if(!(r.width>0)||e.closest('[hidden]')||e.value)return;e.setAttribute('data-ctr',i++);
        L.push({i:i-1,t:'(texte d’exemple) '+e.placeholder,c:getComputedStyle(e,'::placeholder').color,fs:parseFloat(getComputedStyle(e).fontSize),fw:400,x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height,ph:true});});
      return L;},zone);
    await p.addStyleTag({content:'[data-ctr],[data-ctr] *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important} [data-ctr]::placeholder{color:transparent!important} [data-ctr] svg{visibility:hidden!important}'});
    await p.waitForTimeout(100);
    for(const e of els){const f=path.join(DIR,t+'-'+hash.slice(1)+'-'+e.i+'.png');
      try{await p.screenshot({path:f,fullPage:true,clip:{x:Math.max(0,e.x),y:Math.max(0,e.y),width:Math.max(2,Math.min(e.w,w-e.x)),height:Math.max(2,e.h)}});out.push({taille:t,ecran:hash,...e,f});}catch(err){}}
    await p.reload();await p.waitForTimeout(900);}
  await ctx.close();}
fs.writeFileSync(outFile,JSON.stringify(out));console.log('fonds photographiés :',out.length);await b.close();})();
