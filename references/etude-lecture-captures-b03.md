# Preuves du Batch B03 — Projet RoK

Périmètre et décisions : `docs/batches/B03/MANIFEST.md`.

## B03-0 — étude de lecture des captures de l'Inventaire — 2026-10-06

Preuve rapportée par la session « ESSAI B03-0 — lecture des captures de l'Inventaire » (session Claude Code distincte, ouverte par le pilote sur accord de Mickaël), puis confrontée par le pilote à ses propres observations des mêmes captures. Étude hors dépôt : aucun commit, branche, fichier ni dépendance dans le dépôt ; aucune écriture Supabase, Vercel ou sur le site des maquettes.

- **Dépôt et base :** `LegioFr/RoK`, `test-preview` = `caf4a537499b828c15b5bf30145ebd99fdbb618a` (vérifié égal au distant).
- **Environnement :** conteneur cloud de la session d'étude (serveur, Node.js 22.22.0, en dehors d'un navigateur), dossier temporaire uniquement ; aucun service en ligne de lecture d'image ni IA tierce ; les captures ne sont pas sorties de la session.
- **Outils :** tesseract.js 5.1.1 et tesseract.js-core 5.1.1 (Apache-2.0), modèle `eng` 4.0.0 best-int via `@tesseract.js-data/eng` 1.0.0 (MIT), Python 3.13, Pillow 12.3.0, NumPy 2.5.3.
- **Corpus :** 15 captures d'écran de l'Inventaire du jeu fournies par Mickaël le 2026-10-06 (jeu en français, téléphone en paysage, 3088 × 1440), déposées dans l'espace privé du site des maquettes (campagne « Captures pour l'essai B03-0 », étapes c01 à c05). Les captures ne sont pas versionnées (B03-D4) ; empreintes SHA-256 des fichiers relevées par le pilote :
  - `0e531435fd3b8faa6b5ae74660a8b924740c243d8dd338a15ba9176d6e9edefd`, `213da7ad45e832abbda4319ab07df3308947c545e68406c8cab90cebb1f8712a`, `e9bdea8721d447f43bc3ed9b9da9faccbbaaac078877f46a1f41e59aa4a64bbb` (étape c01, Ressources) ;
  - `07f79533362e45bfc392987e06ffaa4892cc2b4adc359181b0c8d262df9dfdf0`, `7724f78365cde2568186f375c0b4765fe357322a19f15e57c8e756fd63f71705`, `1f405a7a960db53d4feb66195ae4ae55d65bf70a7c54776d17de6399b624aaf4` (étape c02, Accélérateurs) ;
  - `d493e8fc034153173a53d894f3b89db0ff73d61c07fadd4d5b0452d9afe84323`, `31ac7c7ba2b1c4e03a9af494964cf57ceb29442364d6a8d97f8624fe60d94c97`, `61bf97444358a7c5a4b5fe3689c3493375f8c8e7533424e35046e9e3c0c07c06`, `c19f9b7b99a7833ff683bd51165d347ace6f78ed2b6c0f3aae023d74249b0ba3`, `58dba3d4e5d1e77d300f63ce3f002c84583b674865d65b21920e188d6530b5c3`, `9bad144ec51e3adfb6fb6803ed94e46e3f6d875377ab1ca9466a40878cfc62dd` (étape c04, autres onglets) ;
  - `f4f48cf5c0f387c3438248e0fff59b4c89ec4f09e16507a1288190c345459686`, `0289eb361779294cff55a7b13ab3839efea0f949ae81f80439003b42bb77dfa5`, `17d374570155d6c7d73b8397676fdb96c78bd2369ca1c7057c4fb304a54c2b44` (étape c05, autres onglets).

### Disposition des écrans (NV-4)

- Onglets du jeu : Ressources, Accélérateurs, Boosts, Équipement, Attirail, Autre (pas d'onglet « Objets »).
- Grille de 4 colonnes, cases identiques sur les 15 captures ; chaque case porte une icône, une quantité en bas à droite et, pour 85 cases sur 188, une valeur en haut (« 7 500 », « 1m », « 8h »).
- Le nom n'est écrit que dans le panneau de droite, pour l'élément sélectionné : l'élément d'une case n'est identifiable que par son icône.
- Nombres des cases en entier avec espace (« 1 125 000 »), sans K ni M ; durées 1m, 5m, 10m, 15m, 30m, 60m, 3h, 8h, 15h.
- Barre du haut : six compteurs, dont les quatre ressources en ville arrondies (« 81.8M », inutilisables comme valeur exacte) et les gemmes en entier.
- La grille défile et les captures successives se recouvrent : une même case peut apparaître sur deux captures.
- Éléments à 0 : masqués par le jeu (déduction : aucune case à 0 sur 188 et listes de durées trouées), ce qui confirme FB04-03 (absent ≠ zéro).

### Lecture locale (option A de B03-D2)

Méthode : détection de la grille, découpe des cases, lecture par tesseract.js ; vérité relevée case par case sur les 188 cases exploitables (4 cases coupées par le défilement exclues).

| Onglet | Cases | Lignes justes | Temps médian par case | Temps max |
|---|---|---|---|---|
| Ressources | 39 | 38 (97,4 %) | 33 ms | 61 ms |
| Accélérateurs | 39 | 39 (100 %) | 23 ms | 38 ms |
| Boosts | 12 | 12 (100 %) | 22 ms | 100 ms |
| Équipement | 38 | 38 (100 %) | 9 ms | 16 ms |
| Autre | 60 | 58 (96,7 %) | 11 ms | 46 ms |
| **Total** | **188** | **185 (98,4 %)** | 16 ms | 100 ms |

- Valeur du haut lue juste sur 85 cases sur 85 ; les 3 erreurs sont des quantités.
- Règle « sûr » (confiance et cohérence vérifiable : nombre de chiffres lus égal au nombre de caractères détectés, pas de 0 initial, case entière) : 172 cases « sûres », 0 fausse. La confiance brute seule ne suffit pas (≥ 90 : 18 fausses sur 112). Règle calibrée sur ce seul corpus.
- Chargement du moteur : 0,9 à 2,4 s ; 188 cases en 3,75 s ; poids à télécharger dans un navigateur : environ 5,8 Mo. Mesures sur serveur, pas sur téléphone (NV-7).

### Identification de l'élément

- Couleur de fond → rareté : 57/69 justes (83 %), non fiable seule.
- Comparaison avec des icônes découpées dans les mêmes captures → famille : 69/70 (98,6 %) ; l'erreur avait un score nettement inférieur aux autres.
- Même case reconnue sur deux captures qui se recouvrent : 8/8.
- Aucune icône du jeu n'a été téléchargée ni utilisée hors des captures ; un catalogue de références livré avec l'appli poserait le risque R11.

### Écarts avec le catalogue local B04

- Ressources : le catalogue a nourriture, bois, pierre et or ; le jeu montre aussi les gemmes.
- Caisses : écart total. Catalogue 10K/100K/1M/10M pour chaque ressource ; observé : nourriture et bois 1 000, 10 000, 50 000, 150 000, 500 000, 1 500 000, 5 000 000 ; pierre 750, 7 500, 37 500, 112 500, 375 000, 1 125 000, 3 750 000 ; or 500, 3 000, 15 000, 50 000, 200 000 ; gemmes : une caisse. 29 paliers observés sur 33 sont absents du catalogue.
- Accélérateurs : 5 familles d'icônes, cohérentes en nombre avec les 5 types du catalogue (seule la construction est prouvée par le panneau de droite) ; durées 10m, 15m, 30m et 15h absentes du catalogue ; 24H, 3D et 7D du catalogue absentes des captures (inexistence non prouvée).
- Objets : au moins 102 objets distincts observés (Boosts, Équipement, Autre) pour 3 codes génériques au catalogue.
- Conséquence : sur le catalogue actuel, l'import rejetterait environ 95 % des cases lues (B03-D7). Suite décidée : B03-D14.

### Verdict

Seuil B03-D13 atteint pour la lecture des nombres sur ce corpus (98,4 %, aucune ligne « sûr » fausse) ; NON VÉRIFIÉ pour l'identification de bout en bout, qui dépend du catalogue (B03-D14). Décisions de Mickaël du 2026-10-06 : B03-D2 confirmée, B03-D14, B03-D15 (`MANIFEST.md`).

## B03-0 — recherche de la liste complète — 2026-10-06

Session « RECHERCHE B03-0 » (lecture seule, base `caf4a53`) arrêtée : l'accès réseau de l'environnement cloud refuse la lecture des pages des sources publiques (rok.lilith.com, riseofkingdoms.fandom.com, riseofkingdomsguides.com, www.pocketgamer.com, www.bulbaritos.com). Aucune liste produite, rien rempli de mémoire. Reprise après l'ouverture de ces domaines par Mickaël (B03-D14).

## B03-0 — recherche de la liste complète (reprise) — 2026-10-06

Preuve rapportée par la session « RECHERCHE B03-0 (reprise) » (session Claude Code distincte, lecture seule, ouverte par le pilote sur accord de Mickaël après l'ouverture des domaines web par Mickaël), base vérifiée `test-preview` = `2e4c0e7a0a7b821c5f6ff47957d3a5d21ec48923`, environnement : conteneur cloud de la session. Aucun fichier, commit, PR ni écriture Supabase, Vercel ou site des maquettes. Tout est proposition (`C-010`, `C-011`) ; données acceptées par Mickaël le 2026-10-06 (B03-D16).

- **Accès :** pages HTML du wiki communautaire `riseofkingdoms.fandom.com` refusées (403 / 402) ; son API MediaWiki publique en lecture seule (`api.php`) répond, utilisée sans contournement pour les pages Items/* et Resources. Bloqués par l'accès réseau : `www.riseofkingdomsguides.com`, `www.pocketgamer.fr`, `tseret.com`, `rok-calculator.com`, `rok-calc.vercel.app`. `rok.lilith.com` accessible, sans données d'objets. Aucune source officielle lisible.
- **Sources consultées le 2026-10-06 :** wiki, API MediaWiki : Items (2019-12-01), Items/Food, Wood, Stone, Gold (2021-08-22), Items/Gem (2025-01-29), Items/Resource Pack (2024-05-06), Items/"Pick One" Resource Chest (2023-03-24), Items/"Pick One" Speedup Chest, Building Speedup, Research Speedup (2020-04-30), Items/Training Speedup, Healing Speedup, Universal Speedup (2018-12-08), Resources (2025-05-31) — éditeurs communautaires, version du jeu inconnue ; <https://www.bulbaritos.com/calculators/speedup-calculator> (sans date lisible) ; <https://www.pocketgamer.com/rise-of-kingdoms/resources/> (2022-11-04) ; <https://riseofkingdomsguides.com/how-to-get-speedups-in-rise-of-kingdoms/> (mis à jour 2026-01-02).
- **Ressources :** nourriture, bois, pierre, or, gemmes (or : deux sources).
- **Caisses à contenu fixe :** nourriture et bois 1 000 · 10 000 · 50 000 · 150 000 · 500 000 · 1 500 000 · 5 000 000 ; pierre 750 · 7 500 · 37 500 · 112 500 · 375 000 · 1 125 000 · 3 750 000 ; or 500 · 3 000 · 15 000 · 50 000 · 200 000 · 600 000 · 2 000 000 ; gemmes 5 · 10 · 50 · 100 · 200 · 500 · 650 · 1 000 · 2 000.
- **Packs au hasard :** niv. 1 A, B et C, niv. 2, niv. 3 ; **coffres « Choisissez un »** niveaux 1 à 5 (contenus : section suivante, vérifiés par les captures) ; un coffre d'accélérateurs au choix (niv. 1 à 3) existe aussi dans le wiki, non observé sur les captures.
- **Accélérateurs :** cinq types (construction, recherche, entraînement, soins, universel), aucun sixième trouvé. Durées : 1, 5, 10, 15, 30, 60 min, 3 h, 8 h, 15 h pour les quatre types spécialisés ; les mêmes plus 24 h, 3 j, 7 j, 30 j pour l'universel (wiki et calculateur).
- **Niveaux de confiance proposés par ligne :** (A) captures et wiki : caisses de nourriture, bois et pierre, or jusqu'à 200 000 ; (B) wiki seul : or 600 000 et 2 000 000, tailles de gemmes autres que 10 ; (C) deux sources écrites : durées de 5 à 60 min et durées de l'universel ; (D) calculateur seul, avec 15 h vue sur les captures : 3 h, 8 h, 15 h des types spécialisés et 1 min.
- **Proposition de codes (`NON_VERIFIED`, `parameters_verified = false` inchangé) :** ressources `FOOD`, `WOOD`, `STONE`, `GOLD`, `GEM` ; caisses `<RES>_CRATE_<montant exact>` ; accélérateurs `SPEEDUP_<TYPE>_<DURÉE>` avec `CONSTRUCTION`, `RESEARCH`, `TRAINING`, `HEALING` (1MIN à 15H) et `GENERAL` (les mêmes plus 24H, 3D, 7D, 30D), `1H` devenant `60MIN` ; provenances `B03_D14_FANDOM_API_2026-10-06`, `B03_CAPTURES_2026-10-06`, `BULBARITOS_CALC_2026-10-06`. Coffres et packs : nouvelle famille décidée par B03-D21, codes à fixer par la mission B03-1A.
- **Incident signalé par la session :** des fichiers JSON temporaires écrits par erreur à la racine du dépôt local de la session, déplacés aussitôt hors du dépôt ; rien commité.

## B03-0 — captures du panneau de droite — 2026-10-06

Captures fournies par Mickaël le 2026-10-06 : 10 fichiers distincts déposés dans l'espace privé du site des maquettes (campagne « Noms des éléments du jeu (B03) », étapes `n01` et `n02`, 2880 × 1800 ; un onzième envoi est le doublon de la capture des 10 gemmes) et 8 captures envoyées dans la session pilote (2000 × 1250). Jeu en français. Lues à l'œil par le pilote ; non versionnées (B03-D4). Empreintes SHA-256 :

- accélérateurs et caisses (site) : `4839ecc18488d92016604fd27f7eaffcaedb1f00538fac35a87c68e66c1a3da5` (construction 1 min), `2808c3b27e328d3b07401a052a2a5ea773e847af3a54946d84e89d65019d6aa4` (entraînement 1 min), `d4e238b0e989483b36df9047bc9714dd9ac683312f290b6a4ec58c6c94ce04d6` (recherche 1 min), `ff6d180775270800b810b4a692d9edda35464a7ad0a293f8bf530209f6ef4172` (soin 5 min), `9144b7c2c5d7edb8c574a990c2d4a5be898f36a2f8f05d20c6b2722fd93b25cc` (universel 1 min), `5c6eab23869b7ebb9738e50035b40739cd8ef45bae91deb3b60ac54198769d78` (10 gemmes), `0dca72328e404d4f12dacdffc6b39751c81621c43a4622ae1b66edcb13b035b5` (nourriture), `faa789c72b5b6778ecdcdca0b6dd9ed4411fa8afa3be6cead286f4118fb4123d` (bois), `7c8098f1c608bf6e28a5bacb1f5cf2a19902cd24060936a17d983dc3e67257c2` (pierre), `b860af94b09b5dfdca32f287c295bf02d05f1995ca7914ac91573c29b9af5c49` (or) ;
- coffres et packs (fichiers reçus par la session pilote) : `123b77a57951d83f6d7351e18fb0ae02585cae7b2eda574d1842d8a1f17b2d28` (coffre niv. 5), `ff20aa9c730c8fdcbe67d2740cd3a3d5acce962e541db0d0723bc341d0d2c9d9` (niv. 4), `cb011f468cc8265dc02f20b1aeca6483a0b06e4d908e55283713cc72be01e859` (niv. 3), `6a07f1b4e656bb7be456300ae9b6867843aaf4aec296cac072a9e8ac4c407025` (niv. 2), `f7e224d1a2a11847c78bbacb86dfc74c7ebb6f0687a6d54b422f723f77984197` (niv. 1), `677d6be86be1ab0f8877547b5479d707187c14eccba4e13b3c750685733c323a` (pack niv. 2), `761809e1e690c9a6b7bb2a60a8964b0b78c481edf00d76050d0b89c4b4eb840c` (pack C niv. 1), `b046f4669b150054b73e59dffff14be9dd750fbe53934e185b5219560171e9d7` (pack B niv. 1).

Constats (texte du panneau de droite) :

- **Types d'accélérateurs :** établi et marteau = « Accélération de construction - 1 minute » ; cible = « Accélération d'entraînement - 1 minute » ; fiole = « Accélération de recherche - 1 minute » ; rouleau de bandage = « Accélération de soin - 5 minutes » ; sablier = « Accélération - 1 minute » (« Réduit le temps de n'importe quelle file de 1 minute »). NV-9 levé pour les types.
- **Caisses :** « 1 000 unités de nourriture », « 1 000 unités de bois », « 750 pierres », « 500 unités d'or », « 10 gemmes » (« Octroie à votre ville 10 gemmes ») : la valeur de la caisse de gemmes observée est vérifiée, 10 gemmes.
- **Coffres « Choisissez un »** (« Après utilisation, vous pouvez choisir entre… », nourriture / bois / pierres / or) : niv. 1 = 10 000 / 10 000 / 7 500 / 3 000 ; niv. 2 = 50 000 / 50 000 / 37 500 / 15 000 ; niv. 3 = 150 000 / 150 000 / 112 500 / 50 000 ; niv. 4 = 500 000 / 500 000 / 375 000 / 200 000 ; niv. 5 = 1 500 000 / 1 500 000 / 1 125 000 / 600 000. Identiques au wiki.
- **Packs au hasard** (« Vous octroie aléatoirement… ») : « Pack de ressources B niv. 1 » = 1 000 nourriture, 1 000 bois ou 750 pierres ; « Pack de ressources C niv. 1 » = 1 000 nourriture, 1 000 bois, 750 pierres ou 500 or ; « Pack de ressources niv. 2 » = 10 000 nourriture, 10 000 bois, 7 500 pierres ou 5 000 or. Identiques au wiki.
- Ces captures (2880 × 1800 et 2000 × 1250) montrent la même disposition que celles de l'étude (3088 × 1440).

## Maquettes B03 validées — 2026-10-06

- **Mission.** Session « MAQUETTES B03 », ouverte par le pilote sur accord de Mickaël du 2026-10-06 (« Lance les maquettes maintenant ») ; aucun code de l'application.
- **Dépôt, branche, base.** `LegioFr/RoK`, branche `claude/b03-maquettes`, base `test-preview` = `2e4c0e7a0a7b821c5f6ff47957d3a5d21ec48923`, puis fusion de `test-preview` = `e3fd660d27bc56c66cf69390e0bac0467b1ff131` avant l'envoi.
- **Revue.** Trois tours sur une page privée de revue (Artifact) puis sur le site des maquettes, sans envoi sur GitHub entre les tours (`DEVELOPMENT.md`, « Envois limités sur une PR ») : version 1 `8c5fb80`, version 2 `2cd6845` (choix B03-D18, B03-D20), version 3 `6cc47e7` (B03-D19, B03-D21, données des captures du panneau de droite).
- **Validation.** Mickaël valide la version 3 (`6cc47e7`) le 2026-10-06 : les 6 écrans, l'index, les icônes « coffre de ressources » et « pack », les nombres d'exemple des coffres et packs ; marques « Bon pour moi » sur les 6 écrans aux 4 tailles, sans note (rapporté par le pilote). Confirmation écrite par Mickaël dans la session « MAQUETTES B03 », avec l'accord de l'envoi unique. Les écrans 01 à 06 envoyés sont identiques octet pour octet à `6cc47e7` ; seul l'index change : bandeau « VALIDÉES » et mention de proposition retirée des deux icônes.
- **Environnement.** LOCAL, conteneur cloud de la session. Node 22.22.0 (24.21.0 absent du conteneur, non installé), pnpm 11.26.0, `pnpm install --frozen-lockfile`, aucune dépendance ajoutée. Chromium local (révision 1194) rattaché à Playwright 1.63.0 par des liens dans l'espace temporaire de la session, non versionnés.
- **Contrôles sur la version 3.**
  - `pnpm maquettes:controle docs/ux ROK_UI_B03_00_INDEX.html` : 59 pages × 4 tailles, zéro défaut, sans exception ajoutée, avec et sans les polices chargées.
  - Mesures Playwright, polices Noto Serif et Roboto chargées et vérifiées, à 360, 390, 768 et 1920 px, sur les états des écrans 01, 03, 04, 05, 06 et l'index : 184 mesures, aucun débordement, aucune erreur de page. Les titres « Importer », « Analyse » et « Résultat » tiennent sur une ligne ; la ligne des boutons d'import tient à 40 px.
  - `pnpm maquettes:icones` : 45 icônes uniques, planche relue à l'œil.
  - `pnpm guard` réussi ; `sha256sum -c SHA256SUMS.txt` réussi.
- **Images (R11).** Aucune image du jeu ni capture de Mickaël dans les fichiers. Les icônes pleines sont les dessins originaux de la page de référence des icônes ; seule retouche : nourriture ramenée à 88 % pour rester dans son cadre. Les icônes « coffre de ressources » et « pack » sont dessinées par cette session. Les captures et leurs zones sont des dessins neutres. Les quantités sont des exemples, pas les valeurs du compte de Mickaël (`C-064`).

## B03 — inventaire ROK-010 de l'outil de lecture — 2026-10-06

Inventaire en lecture seule fait pour le pilote (sous-agent de la session pilote), base `test-preview` = `e0a7abdce5c04bf81219b9af376b5f596687d331`, registre npm interrogé le 2026-10-06 (`npm view`, `npm pack`, `npm install --ignore-scripts` et `npm audit` dans un dossier temporaire hors dépôt) ; aucun code de paquet exécuté, dépôt non modifié. Il éclaire les décisions B03-D22 et B03-D23 (`MANIFEST.md`) ; la session de code le complète au moment de l'installation.

- **Paquets proposés :** `tesseract.js@7.0.0` et `tesseract.js-core@7.0.0` (Apache-2.0, publiés le 2025-12-15, 4 mainteneurs), modèle `@tesseract.js-data/eng@1.0.0` best-int (MIT, un mainteneur), en versions exactes. L'étude B03-0 portait sur la 5.1.1 : son résultat (98,4 %) ne vaut pas pour la 7.0.0 tant que le corpus n'est pas rejoué (`C-015`).
- **Dépendances :** 12 transitives, licences MIT, Apache-2.0 ou BSD-2-Clause, aucune copyleft ; `npm audit` : 0 vulnérabilité. Base GitHub Advisories interrogée directement : NON VÉRIFIÉ.
- **Script d'installation :** `postinstall: opencollective-postinstall || true`, à refuser explicitement (le dépôt impose `strictDepBuilds: true` ; syntaxe exacte du refus NON VÉRIFIÉE).
- **Poids réellement chargé :** worker 111 Ko, un cœur `*-lstm.wasm.js` de 3,9 Mo selon l'appareil, modèle 2,95 Mo : environ 7,0 Mo bruts, environ 4,5 Mo si le serveur compresse (compression NON VÉRIFIÉE). Les « environ 5,8 Mo » de l'étude correspondaient vraisemblablement au `.wasm` binaire non utilisé par défaut ; poids à remesurer dans un navigateur (NV-7), et texte des maquettes (« environ 6 Mo ») à aligner sur la mesure.
- **Hébergement et cache :** par défaut l'outil se charge depuis `cdn.jsdelivr.net` ; l'auto-hébergement passe par un dossier versionné de `public/` (`workerPath`, `corePath` en dossier, `langPath`, `workerBlobURL: false`). Le modèle décompressé est gardé par défaut dans IndexedDB sous une clé sans version : à versionner (B03-D23). Le précache Serwist prend `.next/static/**/*.js` : les gros fichiers doivent rester hors du bundle, et un test de build doit vérifier qu'aucun fichier de lecture n'entre dans le précache. `runtimeCaching` est vide ; aucune CSP n'est définie aujourd'hui. Compatibilité avec le build Next 16 : NON VÉRIFIÉE.
- **Alternatives écartées pour B03 minimal :** TextDetector (brouillon WICG, support NON VÉRIFIÉ) ; reconnaisseur de chiffres maison (piste d'évolution, même question que R11 pour la police du jeu) ; PaddleOCR via ONNX (environ 30 Mo) ; `scribe.js-ocr` (AGPL-3.0) ; Google Cloud Vision (option B, écartée par B03-D2).
- **Réversibilité :** bonne, tout reste dans `src/platform/vision` et `public/`, sans schéma ni donnée serveur.
