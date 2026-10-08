# Mémoire du projet RoK Companion

Ce document est la mémoire du projet. Claude ne se souvient de rien d'une session à l'autre : tout ce qui compte est écrit ici.
**Règle : chaque décision de Mickaël est écrite ici au moment où elle est prise**, avec sa date. Une décision qui reste seulement dans une conversation est perdue.

Dernière mise à jour : 2026-10-08.

---

## 1. Le projet

- **Quoi :** une appli web compagnon pour Rise of Kingdoms (« RoK Companion ») : suivre son compte (profils, bâtiments, inventaire), importer ses captures d'écran de l'Inventaire, planifier sa progression (premier objectif : Château 25), préparer ses combats.
- **Pour qui :** Mickaël d'abord ; d'autres joueurs plus tard, peut-être.
- **Indépendant du dépôt `LegioFr/RoK`** (décision du 2026-10-08) : ce dépôt-là est laissé de côté, sans modification. On n'en reprend que des références (dossier `references/`).

## 2. Façon de travailler (décision du 2026-10-08)

- **Claude pilote** : il dit quoi faire, propose, demande ce dont il a besoin, code, teste et montre le résultat.
- **Mickaël fournit et valide** : captures du jeu, choix, comptes et clés de services, tests sur son téléphone.
- **Ordre :**
  1. **Maquette finale** : on la fait évoluer écran par écran (Mickaël dit quoi changer, Claude propose aussi) jusqu'à la validation de la version finale. **Toutes les fonctions de la maquette doivent marcher** (connexion, changement de profil, import de photos, etc.).
  2. **En parallèle :** recherches web approfondies sur le jeu, en partant de sa toute dernière version ; Mickaël complète avec des photos.
  3. **Une fois la maquette validée : le code.** Claude dit quoi faire.
- **Mémoire :** ce document. Une nouvelle session commence par le lire (voir `CLAUDE.md`).
- **Langue :** français, tutoiement.

## 3. État actuel (2026-10-08)

### Maquette
- **Source :** `maquette/` (`index.html`, `styles.css`, `app.js`, `icones.js`). Ouvrir `maquette/index.html` dans un navigateur suffit.
- **Copie publiée :** https://claude.ai/artifact/Ku6BeFs1sgqTc8ihWTP47i (privée, visible par Mickaël). Pour la mettre à jour : `python3 maquette/outils/assembler.py`, puis publier le fichier produit sur la même adresse (lire l'artefact d'abord depuis une nouvelle session).
- **Icônes :** `maquette/icones.js` est généré par `node maquette/outils/generer-icones.cjs` à partir de `maquette/outils/icones/` (dessins validés repris tels quels + nouvelles icônes).
- **Ce qui marche déjà** (en mémoire du navigateur, perdu au rechargement) : changement et ajout de profil, suppression (refusée pour le profil actif tant qu'un autre existe), saisie et correction avec historique, saisie rapide, filtres, import de captures (vraies images choisies, lecture **simulée**), plan Château 25 recalculé (bonus de vitesse, pierre envoyée par la ferme), réservation, dépenser ou attendre, budget, fermes, migration, temps de jeu, composition des marches, comparaison, préparation de session, rapports, événements et rappels, bilan, codes cadeaux, réglages de Plus, déconnexion.
- **Ce qui manque encore à la maquette :**
  - les **écrans de connexion** (création de compte, connexion, mot de passe oublié) : ils existent dans les maquettes validées (`references/maquettes-validees/ROK_UI_B01_0*.html`) mais ne sont pas encore intégrés ;
  - la **conservation des données** d'une visite à l'autre (stockage du navigateur) ;
  - la **vraie lecture des captures** avec tesseract.js (voir `references/etude-lecture-captures-b03.md`) ;
  - les **vraies données du jeu** : tous les chiffres sont des exemples.

### Statut des écrans
| Écran | Statut |
|---|---|
| Accueil (base), fiche profil, Ma ville (Progression, Inventaire), écran d'une valeur, Plus (compte, installation, mise à jour) | **Validés** dans le projet RoK (voir `references/`) |
| Import de captures (4 étapes) | **Validé** dans RoK (maquettes B03 v3) |
| Ajouts sur l'Accueil (priorités du jour, objectif en cours, ma semaine) | Proposés par Claude, à revoir |
| Commandants, Équipements, Armements | Proposés par Claude, à revoir |
| Optimiser, Plan Château 25, Dépenser ou attendre, Budget, Fermes, Migration, Temps de jeu | Proposés par Claude, à revoir |
| Combat, Composer, Comparer, Préparer une session, Rapports | Proposés par Claude, à revoir |
| Événements et KvK, Bilan, Codes cadeaux | Proposés par Claude, à revoir |

**Attention :** les écrans « proposés par Claude » ont été inventés en une heure à partir de descriptions d'une ligne. Ce sont des points de départ, pas des décisions.

### Icônes
- **Validées par Mickaël (dans RoK, 2026-10-06) :** les 55 icônes de l'appli (version 7, `references/icones/icones-app-peintes-v7.html`) et celles de l'Inventaire (ressources, accélérateurs en composition 1, coffre, pack). Les n° 2, 4 et 55 (œil, enveloppe, œil barré) restent **au trait**.
- **À valider :** 35 nouvelles icônes dessinées par Claude dans le même style (planche dans la maquette, écran « Icônes ») et 10 réutilisations de dessins validés à d'autres endroits.

## 4. Décisions

| Date | Décision |
|---|---|
| 2026-10-08 | Projet indépendant de `LegioFr/RoK`, dans ce dépôt `LegioFr/RoK-Companion`. |
| 2026-10-08 | Claude pilote, Mickaël fournit et valide. Maquette finale d'abord, code ensuite. |
| 2026-10-08 | Toutes les fonctions de la maquette doivent être fonctionnelles. |
| 2026-10-08 | Recherches web sur la dernière version du jeu + photos de Mickaël. |
| 2026-10-08 | Mémoire entre sessions : ce document, dans ce dépôt. |
| 2026-10-08 | On reprend comme références tout ce qui a été validé visuellement dans RoK (`references/`). |

## 5. Questions ouvertes (à trancher plus tard)

- **Visibilité du dépôt :** il est **public**. Recommandation de Claude : le passer en privé (Settings → General → Danger Zone → Change visibility). Ne jamais y mettre de secret, quelle que soit la visibilité.
- **Technique pour le code** (à décider au moment du code) : RoK utilisait Next.js, Supabase (base et comptes) et Vercel (hébergement). Point de départ probable, à confirmer.
- **IA pour les captures :** idée retenue pour l'instant = lecture locale gratuite (tesseract.js) d'abord, IA seulement pour les cases douteuses. Estimation de coût (tarifs Anthropic du 2026-10-08, exemples) :
  - capture entière : environ 0,001 $ avec Claude Haiku 5.5, 0,02 $ avec Sonnet 5.5 ;
  - cases douteuses seulement : moins d'un centime par mois pour un joueur ;
  - prévoir une limite par utilisateur et un plafond de dépense.
- **Données du jeu :** ce qui peut venir des captures (coûts, durées, prérequis, effets affichés) et ce qui est inconnu de tous (formule exacte des combats) : l'appli compare et explique, elle ne prédit pas un combat.

## 6. Prochaines étapes

1. Mickaël : passer le dépôt en privé (recommandé).
2. Revue de la maquette, écran par écran, en commençant par **la connexion et l'Accueil**.
3. Ajouter à la maquette : écrans de connexion, conservation des données dans le navigateur, vraie lecture des captures (tesseract.js), testée sur les captures de Mickaël (les 15 captures de l'étude RoK ne sont pas dans les dépôts : les redonner).
4. Recherches sur le jeu, en commençant par ce qui sert aux premiers écrans : bâtiments et prérequis jusqu'au Château 25, ressources, caisses, accélérateurs.

## 7. Journal des sessions

- **2026-10-08** (session Claude Code ouverte sur `LegioFr/RoK`) : discussion sur l'IA pour les captures et son coût ; création d'une maquette de l'appli finale (22 écrans), puis des icônes peintes (55 validées reprises, 35 nouvelles), puis de toutes les fonctions ; décision de lancer ce projet séparé ; création de ce dépôt, de ce document, rangement de la maquette et des références.
