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

| | Lecture gratuite | Haiku 5.5 | Haiku 5.5 (consigne v2) | Sonnet 5.5 |
|---|---|---|---|---|
| Quantités justes | 41/41 | 41/41 | 41/41 | 41/41 |
| Valeurs du haut justes | 36/37 (« 750 » lu « 50 ») | 37/37 | 37/37 | 37/37 |
| Objet reconnu | non fait | 38/45, **7 faux** (le soin pris pour de la construction) | 38/45, 7 « inconnu », 0 faux | 38/45, 7 « inconnu », 0 faux |
| Cases coupées signalées, sans rien inventer | — | 12/12 | 12/12 | 12/12 |
| Barre du haut | — | 15/15 | 15/15 | 15/15 |
| Onglet et panneau | — | 3/3 | 3/3 | 3/3 |
| Coût pour les 3 captures | 0 $ | 0,0053 $ | 0,0051 $ | 0,0886 $ |
| Coût par capture | 0 $ | ≈ 0,0018 $ | ≈ 0,0017 $ | ≈ 0,030 $ |
| Durée par capture | 0,3 s de chargement, puis 1,2 s pour les 78 zones | 8,6 à 13,2 s | 8,2 à 11,6 s | 10,0 à 12,1 s |

- **Jetons** : 6 202 en entrée par capture (6 295 avec la consigne v2) et 1 545 à 2 885 en sortie (la réflexion est comprise). Tarifs relevés le 2026-10-06 : Haiku 5.5 à 0,10 $ / 0,50 $, Sonnet 5.5 à 2 $ / 10 $ par million de jetons.
- **Consigne v2** (2026-10-09) : elle décrit l'icône de chaque type d'accélérateur, d'après l'étude du 6 octobre (établi et marteau, fiole, cible, rouleau de bandage, sablier). Avec elle, Haiku ne se trompe plus : il dit « inconnu » pour les 7 accélérateurs de soin, comme Sonnet.
- **Coût total de l'essai** : 0,0998 $, avec la lecture de test faite à la mise en place de la clé.

## Limites

- L'échantillon est petit : 3 captures et 45 cases, sur les seuls onglets Ressources et Accélérateurs. Les onglets Boosts, Équipement, Attirail et Autre (objets nommés) n'ont pas été essayés.
- Aucun modèle ne reconnaît sûrement l'accélérateur de soin, qui est marqué « inconnu ». Dans l'appli, il faudrait demander le type à Mickaël, ou montrer au modèle une petite image de référence de chaque icône.
- Un seul passage par modèle : la régularité d'un passage à l'autre n'est pas mesurée.

## Pistes pour la suite (au choix de Mickaël)

1. **Haiku 5.5 seul, avec la consigne v2** : il lit les nombres et les objets d'une capture entière pour environ 0,002 $. Ce qui reste « inconnu » est demandé au joueur.
2. **Lecture gratuite, puis Haiku pour les cases douteuses** : moins cher, mais beaucoup plus long à construire (détection de la grille, images de référence des icônes). Le gain est de quelques centimes par mois.
3. **Sonnet 5.5** : aucune différence avec Haiku v2 sur cet échantillon, pour environ 17 fois plus cher.
