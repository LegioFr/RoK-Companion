"""Assemble la maquette en un seul fichier HTML (pour la publier comme artefact claude.ai).
Usage : python3 maquette/outils/assembler.py [sortie]   (par défaut : maquette/dist/rok-companion-maquette.html)"""
import json, re, sys, pathlib
m = pathlib.Path(__file__).resolve().parent.parent
html = (m / 'index.html').read_text()
css = (m / 'styles.css').read_text()
app = (m / 'app.js').read_text() + '\n' + (m / 'tests-revue.js').read_text() + '\n' + (m / 'revue.js').read_text()
sprite = json.loads(re.search(r"insertAdjacentHTML\('beforeend',(.*)\);\s*$", (m / 'icones.js').read_text(), re.S).group(1))
head = re.search(r'(<title>.*?</title>\n.*?)<link rel="stylesheet" href="styles.css">', html, re.S).group(1)
body = re.search(r'<body>\n(.*?)<script src="icones.js"></script>', html, re.S).group(1)
out = head + '<style>' + css + '</style>\n' + body + sprite + '\n<script>\n' + app + '</script>\n'
dst = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else m / 'dist' / 'rok-companion-maquette.html'
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text(out)
print(dst)
