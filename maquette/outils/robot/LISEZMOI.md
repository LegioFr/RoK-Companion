# Robot de vérification de la maquette

Passé par Claude sur le **vrai site** avant chaque version (décision du 2026-10-09). Les résultats et captures vont dans
`$ROBOT_SORTIE` (par défaut ce dossier, ignoré par git).

- `robot-connexion.cjs [url]` : partie connexion (5 écrans de compte + Accueil sans profil). Mesures du graphisme aux tailles
  téléphone (390×844), tablette (800×1280), tablette en paysage (1280×800) et PC (1920×1080), puis fonctionnement, parcours et
  saisies (téléphone et tablette). Résultat : `resultat-connexion.json`.
- `robot-maville.cjs [url]` : Ma ville (Progression, les 6 onglets de l'Inventaire, ses fenêtres de saisie, Commandants, Équipements,
  Armements) et l'écran Importer, aux tailles téléphone (390×844), tablette de Mickaël (1028×1567), tablette en paysage (1280×800)
  et PC (1920×1080), puis 15 vérifications de fonctionnement sur la tablette. Version « Exemples » seulement. Résultat :
  `resultat-maville.json`. Constats connus et acceptés (v35) : pastilles en 11 px (« texte petit », style validé), onglets de
  Ma ville qui défilent sur téléphone (« hors écran »), bulle d'outils posée sur un bouton au téléphone (elle se déplace).
- `mesures.js` : mesures injectées dans la page (débordement, éléments hors écran, cibles trop petites, chevauchements, bulle qui
  cache un bouton, texte trop petit ou coupé, contraste quand le fond est uni).
- `contraste.cjs` + `contraste.py` : contraste mesuré sur les vraies couleurs (le texte est rendu transparent, le fond est
  photographié). `node contraste.cjs <url> sortie.json <état> <#écran> <zone> …` puis `python3 contraste.py sortie.json`.

Sur le site protégé, le navigateur passe par le proxy de l'environnement, qui ajoute le code d'accès Vercel.
Les tests n'écrivent rien dans les données de Mickaël (version « Exemples », rien n'est enregistré).
