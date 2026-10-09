// Robot du stockage du site : écrit, relit et efface 30 documents dans la collection « essai » (jamais les données de Mickaël).
// Assez de documents pour dépasser 1 Ko (le stockage compresse alors le fichier : c'est ce qui avait bloqué les écritures le 2026-10-09).
// Usage : node robot-stockage.cjs [url]   (passe par le proxy de l'environnement, qui ajoute le code d'accès Vercel)
const B=(process.argv[2]||'https://rok-companion-maquette.vercel.app').replace(/\/$/,'');
const {execFileSync}=require('child_process');
const curl=(args)=>execFileSync('curl',['-sS','-m','30',...args],{encoding:'utf8'});
const post=o=>JSON.parse(curl(['-X','POST','-H','content-type: application/json','-d',JSON.stringify(o),B+'/api/db']));
let ok=0,ko=[];const t0=Date.now();
for(let i=1;i<=30;i++){const r=post({op:'set',col:'essai',id:'d'+i,data:{texte:'Document d’essai numéro '+i+', assez long pour que le fichier dépasse un kilo-octet.',i}});if(r.ok)ok++;else ko.push(i+':'+r.error);}
const u=post({op:'update',col:'essai',id:'d5',data:{maj:true}});
const docs=JSON.parse(curl([B+'/api/db?col=essai'])).docs;
const lu=Object.keys(docs).length,maj=docs.d5&&docs.d5.maj===true&&docs.d5.i===5;
let del=0;for(let i=1;i<=30;i++){if(post({op:'delete',col:'essai',id:'d'+i}).ok)del++;}
const reste=Object.keys(JSON.parse(curl([B+'/api/db?col=essai'])).docs).length;
console.log('écritures',ok+'/30',ko.length?'échecs '+ko.join(' ; '):'','| relus',lu+'/30','| mise à jour partielle',u.ok&&maj?'OK':'ÉCHEC','| effacés',del+'/30','| restants',reste,'|',Math.round((Date.now()-t0)/1000)+' s');
process.exit(ok===30&&lu===30&&maj&&del===30&&reste===0?0:1);
