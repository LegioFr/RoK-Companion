# Essai de lecture des captures par l'IA (2026-10-09)

Décision de Mickaël du 2026-10-09 : « pour l'IA on fait l'essai ». Le but est de comparer, sur ses propres captures, la lecture gratuite (tesseract.js), Claude Haiku 5.5 et Claude Sonnet 5.5, en cases justes et en coût réel, puis de le laisser choisir.

## Captures

- 3 captures de l'Inventaire du jeu (en français), envoyées par Mickaël le 2026-10-09 depuis la maquette (écran Importer › « Essai de lecture par l'IA »). Elles sont gardées dans l'espace privé du site (`captures/cmv1i246qlqnkkciy.jpg`, `cmv1i27poz0akolep.jpg`, `cmv1i2b0xczpgwuym.jpg`), au format 2880 × 1800, et **ne sont pas dans le dépôt**.
  - c1 : onglet Accélérateurs, avec 15 cases (dont 4 coupées par le défilement) ; panneau « Accélération - 1 minute ».
  - c2 : onglet Ressources, avec 14 cases (dont 4 coupées) ; panneau « Pack de ressources B niv. 1 ».
  - c3 : onglet Ressources, avec 16 cases (dont 4 coupées) ; même panneau.
- **Vérité** : Claude l'a relevée case par case, à l'œil, sur des agrandissements. Sur les 45 cases, 33 sont entières et 12 sont coupées. Cela donne 41 quantités visibles et 37 valeurs du haut visibles. Le type de chaque accélérateur vient de son icône, d'après l'étude du 2026-10-06 (le rouleau de bandage indique le soin, le sablier l'universel). Le relevé est dans l'espace temporaire de la session (`verite.json`), et il est reproduit dans le résumé ci-dessous.
- Barre du haut, identique sur les 3 captures : nourriture 84.2M, bois 107.2M, pierre 291.0M, or 148.9M, gemmes 67 518 (plus le cristal, à 0).

## Méthodes

- **IA** : la fonction `maquette/api/lire.js` du site envoie la capture entière, sans recadrage, avec une consigne et une sortie JSON imposée (`output_config.format`). Les réglages des modèles sont ceux par défaut. Le SDK utilisé est `@anthropic-ai/sdk` 0.127.0. Les 3 captures de chaque modèle ont été lues en même temps.
- **Lecture gratuite** : tesseract.js 7.0.0 avec le modèle `eng` best-int, liste de caractères « 0123456789 mh », une ligne par lecture. Chaque case est découpée en deux zones : la quantité (texte blanc en bas à droite) et la valeur du haut (texte foncé sur bandeau clair). Les zones sont seuillées puis agrandies 2 fois. Le programme tourne sur le serveur de la session, pas sur un téléphone. **Les positions des cases ont été données à la main pour cet essai** ; la détection automatique de la grille a été mesurée dans l'étude du 2026-10-06. La lecture gratuite ne reconnaît pas l'objet : il faudrait comparer les icônes à des images de référence.

## Résultats

| | Lecture gratuite | Haiku 5.5 | Haiku 5.5 (consigne v2) | Sonnet 5.5 | Sonnet 5.5 (consigne v2) | Opus 5.5 (consigne v2) |
|---|---|---|---|---|---|---|
| Quantités justes | 41/41 | 41/41 | 41/41 | 41/41 | 41/41 * | 41/41 |
| Valeurs du haut justes | 36/37 (« 750 » lu « 50 ») | 37/37 | 37/37 | 37/37 | 37/37 * | 37/37 |
| Objet reconnu | non fait | 38/45, **7 faux** (le soin pris pour de la construction) | 38/45, 7 « inconnu », 0 faux | 38/45, 7 « inconnu », 0 faux | **45/45** * | **45/45** |
| Cases coupées signalées, sans rien inventer | — | 12/12 | 12/12 | 12/12 | 12/12 | 12/12 |
| Barre du haut | — | 15/15 | 15/15 | 15/15 | 15/15 | 15/15 |
| Coût pour les 3 captures | 0 $ | 0,0053 $ | 0,0051 $ | 0,0886 $ | ≈ 0,087 $ | 0,1432 $ |
| Coût par capture | 0 $ | ≈ 0,0018 $ | ≈ 0,0017 $ | ≈ 0,030 $ | ≈ 0,029 $ | ≈ 0,048 $ |
| Durée par capture | 0,3 s de chargement, puis 1,2 s pour les 78 zones | 8,6 à 13,2 s | 8,2 à 11,6 s | 10,0 à 12,1 s | 10,7 s | 11,5 à 14,1 s |

\* Sonnet avec la consigne v2 n'a relu que la capture des accélérateurs (c1), le 2026-10-09 : 15 cases sur 15 justes, dont les 7 accélérateurs de soin reconnus. Sur c2 et c3, il était déjà sans faute avec la première consigne ; les chiffres du tableau supposent qu'il le reste.

- **Jetons** : 6 202 en entrée par capture (6 295 avec la consigne v2) et 966 à 2 885 en sortie (la réflexion est comprise). Tarifs relevés le 2026-10-06 : Haiku 5.5 à 0,10 $ / 0,50 $, Sonnet 5.5 à 2 $ / 10 $, Opus 5.5 à 4 $ / 20 $ par million de jetons.
- **Consigne v2** (2026-10-09) : elle décrit l'icône de chaque type d'accélérateur, d'après l'étude du 6 octobre (établi et marteau, fiole, cible, rouleau de bandage, sablier). Avec elle, Haiku ne se trompe plus : il dit « inconnu » pour les 7 accélérateurs de soin, comme Sonnet.
- **Opus 5.5** a été ajouté à la question de Mickaël (« tu as essayé avec Opus ? »). Il a lu les 3 captures avec la consigne v2 et n'a fait aucune erreur, accélérateurs de soin compris. Sonnet a alors relu la capture des accélérateurs avec la même consigne, pour comparer à égalité : lui non plus n'a fait aucune erreur.
- **Coût total de l'essai** : 0,27 $ (lecture de test 0,0008 $, Haiku 0,0104 $, Sonnet 0,1174 $, Opus 0,1432 $).

## Limites

- L'échantillon est petit : 3 captures et 45 cases, sur les seuls onglets Ressources et Accélérateurs. Les onglets Boosts, Équipement, Attirail et Autre (objets nommés) n'ont pas été essayés.
- Aucun modèle ne reconnaît sûrement l'accélérateur de soin, qui est marqué « inconnu ». Dans l'appli, il faudrait demander le type à Mickaël, ou montrer au modèle une petite image de référence de chaque icône.
- Un seul passage par modèle : la régularité d'un passage à l'autre n'est pas mesurée.

## Pistes pour la suite (au choix de Mickaël)

1. **Sonnet 5.5, avec la consigne v2** : 45 cases sur 45, pour environ 0,03 $ par capture. Un inventaire complet d'une quinzaine de captures coûte environ 0,45 $.
2. **Opus 5.5** : le même résultat sur cet échantillon, pour environ 0,05 $ par capture (0,72 $ l'inventaire). Il garde peut-être une marge sur les onglets pas encore essayés, comme les objets nommés de l'onglet Autre.
3. **Haiku 5.5, avec la consigne v2** : environ 0,002 $ par capture. Les nombres sont justes, mais les accélérateurs de soin restent « inconnu » et seraient demandés au joueur.
4. **Lecture gratuite, puis IA pour les cases douteuses** : la moins chère, mais la plus longue à construire.

Pour Mickaël seul, avec 100 $ de crédits par mois, les trois modèles restent très abordables. Le coût par joueur ne comptera que si l'appli s'ouvre à d'autres joueurs.

## Ajout du 2026-10-10 : onglets Boosts, Équipement, Attirail et Autre

- **Consigne v3** (`maquette/api/lire.js`) : chaque case reçoit un `id_objet` du catalogue de l'appli (118 objets, icône décrite d'après les captures de Mickaël du 10 oct.), plus la `couleur` de la case (ajoutée le même jour pour les coffres et packs).
- **Essai réel** : les 20 captures d'onglets envoyées par Mickaël le 10 oct. (Boosts 1, Équipement 9, Attirail 1, Autre 9), Claude Opus 5.5 : 20/20 lues, 6 à 25 s chacune, **1,486 $** au total (0,055 à 0,085 $, moyenne 0,074 $ par capture : la consigne est plus longue).
- **Justesse** : tous les objets nommés reconnus ; totaux après regroupement identiques au relevé de Claude à l'œil (plans 250 dont 4 légendaires, fragments 86, coffres d'équipement 988, pièces forgées 18, sculptures au choix 612, de commandants 7 043, de lumière d'étoile 5 804, tomes 13,9 M EXP, points d'action 151 250). 11 cases « inconnu » : objets dont le nom n'a pas encore été lu (coffres orange d'Autre, livres, rouleaux, décorations, carte).
