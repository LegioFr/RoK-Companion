# Mémoire du projet RoK Companion

Ce document est la mémoire du projet. Claude ne se souvient de rien d'une session à l'autre : tout ce qui compte est écrit ici.
**Règle : chaque décision de Mickaël est écrite ici au moment où elle est prise**, avec sa date. Une décision qui reste seulement dans une conversation est perdue.

Dernière mise à jour : 2026-10-08.

---

## 1. Le projet

- **Quoi :** une appli web compagnon pour Rise of Kingdoms (« RoK Companion ») : suivre son compte (profils, bâtiments, inventaire), importer ses captures d'écran de l'Inventaire, planifier sa progression (premier objectif : Hôtel de ville 25), préparer ses combats.
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
- **Bulle d'outils de revue** (`maquette/revue.js`, demandée par Mickaël le 2026-10-08, reprise de l'espace « Maquettes RoK » `HUtnnmoSkKwyunzTrzkYpY`) : bouton flottant déplaçable, 5 onglets — **Écran** (statut et explication de l'écran, plan, simulation du lien d'e-mail), **Notes** (épinglées à l'endroit exact, rangées par écran et par taille téléphone / tablette / PC, image jointe possible), **Modifs** (changements de la version, encadrés en bleu ; liste `CHANGES` en tête de `revue.js`, à remettre à jour à chaque version), **Inspecter** (taille, police, couleurs, contraste, marges d'un élément), **États** (compte d'essai, nouveau compte sans profil, connexion, profil actif, saisie rapide). Elle remplace le bandeau de la maquette. Onglet **Tests** (ajouté le 2026-10-08, à la demande de Mickaël) : liste des tests de la connexion jusqu'à l'Accueil (`maquette/tests-revue.js`, 87 tests en 14 groupes, identifiants stables), revue guidée en petit bandeau en haut (« ✓ C'est bon », « ✗ Problème » qui fait poser une note, « Passer »), chaque test ouvre l'écran dans le bon état. Résultats dans la collection `tests` de l'artefact (un document par test : `etat` ok ou ko, `taille`, `note`, `captures` = identifiants d'images, lisibles avec `Artifact` `read` + `path` = l'identifiant). « 📷 Capture » joint une ou plusieurs captures d'écran à un test (demandé par Mickaël le 2026-10-08) ; un test avec capture est un problème ; à lire en début de session avec les notes. **Règle pour Claude (demande de Mickaël du 2026-10-08) : à chaque modification de la maquette, marquer les tests touchés dans `maquette/tests-revue.js` avec le numéro de version et la raison (5e et 6e champs), et monter `VNUM` dans `revue.js`.** La bulle les liste alors dans « À revoir après mes modifications » (onglet Tests, ouvert tout seul une fois par version), avec « ▶ Revoir ces N tests » qui ne passe que par eux. Garder l'identifiant d'un test quand on le modifie. Les notes sont dans la base de l'artefact publié, collection `notes` : Claude les lit avec l'outil `ArtifactData` (`list`, collection `notes`), répond dans le champ `reponse` et passe `statut` à `traitée` quand c'est fait. Hors claude.ai (fichier ouvert en local), les notes restent dans le navigateur.
- **Icônes :** `maquette/icones.js` est généré par `node maquette/outils/generer-icones.cjs` à partir de `maquette/outils/icones/` (dessins validés repris tels quels + nouvelles icônes).
- **Ce qui marche déjà** (en mémoire du navigateur, perdu au rechargement) : **écrans de compte** (connexion, création de compte, confirmation de l'e-mail, mot de passe oublié, nouveau mot de passe, déconnexion ; compte d'essai `gouverneur@exemple.fr` / `rok12345`, gardé connecté jusqu'à la fermeture de l'onglet ; un compte créé commence sans profil), Accueil sans profil (B01-06), changement et ajout de profil, suppression (refusée pour le profil actif tant qu'un autre existe), saisie et correction avec historique, saisie rapide, filtres, import de captures (vraies images choisies, lecture **simulée**), plan Château 25 recalculé (bonus de vitesse, pierre envoyée par la ferme), réservation, dépenser ou attendre, budget, fermes, migration, temps de jeu, composition des marches, comparaison, préparation de session, rapports, événements et rappels, bilan, codes cadeaux, réglages de Plus, déconnexion.
- **Ce qui manque encore à la maquette :**
  - la **conservation des données** d'une visite à l'autre (stockage du navigateur) ;
  - la **vraie lecture des captures** avec tesseract.js (voir `references/etude-lecture-captures-b03.md`) ;
  - les **vraies données du jeu** : tous les chiffres sont des exemples.

### Statut des écrans
| Écran | Statut |
|---|---|
| Connexion, création de compte, confirmation de l'e-mail, mot de passe oublié, nouveau mot de passe (B01-01 à 05), Accueil sans profil (B01-06) | **Validés** dans RoK ; intégrés à la maquette le 2026-10-08, mêmes dimensions que les maquettes validées aux 3 tailles. Messages d'erreur et parcours entre les écrans : **proposés par Claude**, à valider |
| Accueil (base), fiche profil, Ma ville (Progression, Inventaire), écran d'une valeur, Plus (compte, installation, mise à jour) | **Validés** dans le projet RoK (voir `references/`) |
| Import de captures (4 étapes) | **Validé** dans RoK (maquettes B03 v3) |
| Ajouts sur l'Accueil (priorités du jour, objectif en cours, ma semaine) | Proposés par Claude, à revoir. Décidé le 2026-10-08 : temps de jeu gardé mais à rendre compréhensible (version proposée : question « Combien de temps as-tu pour jouer ? », durée de chaque action, titre « Priorités du jour ») ; Aperçu de ma ville revenu aux 6 bulles validées ; suppression de n'importe quel profil |
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
| 2026-10-08 | Intégrer à la maquette la bulle d'outils de l'espace « Maquettes RoK » (notes épinglées, etc.) pour que Mickaël puisse laisser ses remarques directement sur les écrans. |
| 2026-10-08 | **Suppression de profil** : on peut supprimer n'importe quel profil, y compris le profil actif (change la règle B01-3B1 reprise de RoK). Un autre profil devient alors actif. |
| 2026-10-08 | **Accueil, temps de jeu** (10 min / 30 min / 1 h) : principe gardé, mais il doit se comprendre sans explication. |
| 2026-10-08 | **Accueil, Aperçu de ma ville** : 6 bulles, celles de l'Accueil validé B04-01 (Bâtisseurs, Bonus de vitesse, totaux de nourriture, bois, pierre, or) à la place des accélérateurs de construction et de recherche. |
| 2026-10-08 | **Création de compte avec une adresse déjà utilisée** (note 4 de Mickaël) : l'appli le dit (« Un compte existe déjà avec cette adresse… ») au lieu de passer à la confirmation. |
| 2026-10-08 | **Mot de passe oublié** : pareil, l'appli dit « Aucun compte avec cette adresse… » ; avec une adresse connue, « E-mail envoyé à … » (textes proposés par Claude). Remplace le message unique validé dans RoK. |
| 2026-10-08 | **Deux séries de tests séparées** : « Corrections à vérifier » (tests modifiés par Claude, bandeau doré) et « Revue complète » (bandeau bleu), qui met de côté les tests en attente de vérification et reprend où Mickaël s'était arrêté ; un test vérifié dans les corrections compte comme fait et ne revient pas. |
| 2026-10-09 | **« Hôtel de ville », pas « Château »** : l'objectif s'appelle « Hôtel de ville 25 » partout (note 6 de Mickaël : c'est le nom du bâtiment dans le jeu). |
| 2026-10-09 | **Priorités du jour** : avec plus de temps, plus d'actions (note 5 : « Que 3 actions » en 1 h). Les actions sont prises dans l'ordre d'importance tant qu'elles tiennent dans le temps choisi ; le total s'affiche (« 7 actions · ≈ 42 min sur 1 h »). Durées : exemples proposés par Claude. |
| 2026-10-09 | **Priorités du jour : 5 actions au plus**, quel que soit le temps choisi (note 8 de Mickaël : ne pas remplir l'écran). |
| 2026-10-09 | **Rappels des événements** : bouton « Me prévenir » / « Rappel activé » (note 7 : « à quoi sert rappel activé ? ») ; pas de rappel pour une date inconnue. |
| 2026-10-08 | **Tests guidés dans la maquette** : liste complète des tests, chacun avec un lien qui ouvre le bon écran dans le bon état ; résultats partagés avec Claude. « Mieux vaut trop de tests que pas assez. » Agréable à faire, sans cacher l'écran. |

## 5. Questions ouvertes (à trancher plus tard)

- **Visibilité du dépôt :** il est **public**. Recommandation de Claude : le passer en privé (Settings → General → Danger Zone → Change visibility). Ne jamais y mettre de secret, quelle que soit la visibilité.
- **Technique pour le code** (à décider au moment du code) : RoK utilisait Next.js, Supabase (base et comptes) et Vercel (hébergement). Point de départ probable, à confirmer.
- **IA pour les captures :** idée retenue pour l'instant = lecture locale gratuite (tesseract.js) d'abord, IA seulement pour les cases douteuses. Estimation de coût (tarifs Anthropic du 2026-10-08, exemples) :
  - capture entière : environ 0,001 $ avec Claude Haiku 5.5, 0,02 $ avec Sonnet 5.5 ;
  - cases douteuses seulement : moins d'un centime par mois pour un joueur ;
  - prévoir une limite par utilisateur et un plafond de dépense.
- **Données du jeu :** ce qui peut venir des captures (coûts, durées, prérequis, effets affichés) et ce qui est inconnu de tous (formule exacte des combats) : l'appli compare et explique, elle ne prédit pas un combat.

## 6. Prochaines étapes

0. **Début de chaque session : lire les notes et les résultats de tests de Mickaël sur la maquette** (`ArtifactData`, `list`, collections `notes` et `tests`, artefact https://claude.ai/artifact/Ku6BeFs1sgqTc8ihWTP47i), les traiter, répondre dans `reponse`.
1. Mickaël : passer le dépôt en privé (recommandé).
2. Revue de la maquette : **connexion et Accueil testés en entier** (87 tests, 2026-10-09). Reste : Mickaël vérifie les 4 corrections v17 ; points ouverts à trancher : garder ou non « Objectif en cours » et « Ma semaine » sur l'Accueil ; valider les textes proposés (messages de connexion, durées des actions). **Ensuite : tests de Ma ville** (même méthode : groupes dans `tests-revue.js`, revue guidée).
3. Ajouter à la maquette : conservation des données dans le navigateur, vraie lecture des captures (tesseract.js), testée sur les captures de Mickaël (les 15 captures de l'étude RoK ne sont pas dans les dépôts : les redonner).
4. Recherches sur le jeu, en commençant par ce qui sert aux premiers écrans : bâtiments et prérequis jusqu'à l'Hôtel de ville 25, ressources, caisses, accélérateurs.

## 7. Journal des sessions

- **2026-10-08** (session Claude Code ouverte sur `LegioFr/RoK`) : discussion sur l'IA pour les captures et son coût ; création d'une maquette de l'appli finale (22 écrans), puis des icônes peintes (55 validées reprises, 35 nouvelles), puis de toutes les fonctions ; décision de lancer ce projet séparé ; création de ce dépôt, de ce document, rangement de la maquette et des références.
- **2026-10-08** (2e session, revue) : intégration des écrans de compte validés B01-01 à 05 (connexion, création, confirmation, mot de passe oublié, nouveau mot de passe) et de l'Accueil sans profil B01-06, avec un parcours qui marche ; vérifiés aux tailles 390, 768 et 1920 (mêmes dimensions que les maquettes validées). Textes proposés par Claude, à valider : « E-mail ou mot de passe incorrect. », « Au moins 8 caractères. », « Saisis une adresse valide, par exemple nom@exemple.fr. », « E-mail renvoyé. », « Confirme d'abord ton e-mail : touche le lien reçu. », « Tu es déconnecté. Tes profils restent enregistrés. », « Nouveau mot de passe enregistré. ». La création de compte mène toujours à la confirmation, même si l'adresse a déjà un compte (l'appli ne révèle pas qui a un compte, comme « Mot de passe oublié »). Bouton d'information de la maquette déplacé en bas à droite (il cachait « Ajouter »). Revue de l'Accueil commencée : écarts relevés avec l'Accueil validé B04-01, questions posées à Mickaël.
- **2026-10-08** (2e session, suite) : à la demande de Mickaël, bulle d'outils de revue intégrée à la maquette (`maquette/revue.js`) : Écran, Notes partagées avec Claude, Modifs, Inspecter, États. Comparer (versions côte à côte) et Contrôle (vérifications automatiques) de l'espace « Maquettes RoK » ne sont pas repris pour l'instant. Questions de la revue (connexion, Accueil) toujours en attente de réponse.
- **2026-10-08** (2e session, suite) : premières notes de Mickaël lues et traitées (suppression du profil actif, temps de jeu peu compréhensible, bulles de l'Aperçu). Décisions appliquées (version v6). Onglet Tests et revue guidée ajoutés à la bulle (87 tests de la connexion à l'Accueil). Reste ouvert : messages proposés de la connexion à valider ; garder ou non « Objectif en cours » et « Ma semaine » sur l'Accueil ; liste de tests de Ma ville à faire ensuite.
- **2026-10-08** (suite) : à la demande de Mickaël, captures d'écran jointes aux tests (bouton « 📷 Capture » dans la revue guidée et dans la liste), version v7.
- **2026-10-08** (suite) : Mickaël a fait les tests 1 à 22 (tablette) : 20 bons, 2 problèmes. Test 19 (adresse déjà utilisée) et test 22 (connexion d'un compte non confirmé) : la création de compte avec une adresse existante faisait semblant de réussir. Corrigé en v8 ; les tests de la confirmation préparent eux-mêmes un compte en attente (état `attente`). Tests renommés `i8b` et `f3b` pour être refaits.
- **2026-10-08** (suite) : v9, « Mot de passe oublié » dit si l'adresse n'a pas de compte (décision de Mickaël). Tests `o2b`, `o3b`, `o4b` à refaire.
- **2026-10-08** (suite) : v10, retour de Mickaël sur les captures des tests : miniatures abîmées (elles prenaient le style des captures de l'écran Importer : classes renommées `rc-shot`), visionneuse plein écran ajoutée (‹ ›, Fermer, Échap), suppression directe avec le × rouge puis « Confirmer la suppression » en voyant l'image. L'adresse d'image renvoyée à l'envoi est gardée dans `urls`.
- **2026-10-08** (suite) : v11, à la demande de Mickaël (il devait chercher dans tous les tests ce que j'avais modifié) : liste « À revoir après mes modifications » en haut de l'onglet Tests, revue guidée limitée à ces tests, badge « modifié en vN » dans la liste. Tests 19 à 23 et 25 à 27 marqués (v8, v9).
- **2026-10-08** (suite) : v12, Mickaël ne comprenait pas le test 23 (« Ouvre la bulle › Écran › Simuler le lien »). Le bouton « ✉ Simuler le lien de l’e-mail » est maintenant dans le bandeau de la revue guidée quand un e-mail est parti ; tests 23, 27, 28 réécrits et marqués v12. Règle : un test ne doit jamais supposer que Mickaël connaît la bulle ; l'action à faire est dans le bandeau ou décrite avec ce qu'il voit.
- **2026-10-08** (suite) : v13, le bouton « Simuler le lien » restait introuvable après un rechargement en pleine revue (la revue reprenait sans rouvrir l'écran du test). Corrigé : reprise = écran du test rouvert ; le bouton est affiché dès que le test en parle et prépare l'écran si besoin. Question de Mickaël : les barres du haut (navigateur et claude.ai) ne seront pas dans l'appli installée (voir réponse).
- **2026-10-08** (suite) : v14, Mickaël veut le rendu le plus proche de l'appli finale, sans la barre de Chrome ni celle de claude.ai. Ajouté : bulle › Écran › « ⛶ Plein écran » (API plein écran du navigateur ; **marche sur la tablette de Mickaël dans claude.ai**, vérifié le 2026-10-08). Solution de repli proposée si c'est refusé : publier aussi la maquette comme appli installable (Vercel), sans les notes partagées.
- **2026-10-08** (suite) : v15, à la demande de Mickaël : bandeau des tests déplaçable (glisser la ligne de titre ⠿, position gardée). Corrigé aussi : dans la série « À revoir », un test sans écran propre (ex. test 25) ouvre maintenant son écran ; les repères de notes traitées ou dont l'élément n'existe plus ne s'affichent plus.
- **2026-10-08** (suite) : v16, séries de tests séparées (demande de Mickaël, il avait peur de mélanger les corrections et la vraie revue).
- **2026-10-09** : Mickaël a fini la revue complète (87 tests sur tablette) : 83 bons, 4 problèmes (n4 message trop bref, r2 et note 5 trop peu d'actions en 1 h, e1 et note 6 « Hôtel de ville » au lieu de « Château », e4 et note 7 rappel incompris). Tout corrigé en v17 ; les 4 tests sont dans « Corrections à vérifier ». Messages éphémères : 3 à 7 s selon leur longueur.
- **2026-10-09** (suite) : corrections v17 vérifiées par Mickaël : 3 bonnes (Hôtel de ville 25, rappels, message du mot de passe), 1 reprise (priorités : 5 actions au plus, note 8) → v18.
