// Régénère maquette/icones.js à partir des dessins validés (icones-validees.js, repris tels quels de la page
// « Icônes de l'appli peintes » v7) et des nouvelles icônes (icones-nouvelles.js).
// Usage : node maquette/outils/generer-icones.cjs
const fs = require('fs'), path = require('path');
const d = path.join(__dirname, 'icones');
const src = fs.readFileSync(path.join(d, 'icones-validees.js'), 'utf8') + '\n' + fs.readFileSync(path.join(d, 'icones-nouvelles.js'), 'utf8') +
  "\nvar sp='<defs>'+DEFS+'</defs>';Object.keys(SYM).forEach(function(k){sp+='<symbol id=\"'+k+'\" viewBox=\"0 0 64 64\" overflow=\"visible\">'+SYM[k]+'</symbol>';});return sp;";
const sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' + new Function(src)() + '</svg>';
fs.writeFileSync(path.join(__dirname, '..', 'icones.js'),
  "/* Généré par outils/generer-icones.cjs : ne pas modifier à la main. */\ndocument.body.insertAdjacentHTML('beforeend'," + JSON.stringify(sprite) + ");\n");
console.log('icones.js régénéré');
