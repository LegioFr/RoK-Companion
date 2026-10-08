# RoK Companion — instructions pour Claude

**Au début de chaque session, lis `MEMOIRE.md`** : c'est la mémoire du projet (état, décisions, prochaines étapes). Lis aussi les notes laissées par Mickaël sur la maquette publiée (voir `MEMOIRE.md`, « Bulle d'outils de revue »).

- Langue : français, tutoiement.
- Claude pilote le projet ; Mickaël fournit (captures, choix, comptes) et valide.
- **Écris chaque décision de Mickaël dans `MEMOIRE.md` au moment où elle est prise**, avec sa date, et mets à jour « État actuel », « Prochaines étapes » et le « Journal des sessions » avant la fin de la session.
- Ce projet est indépendant du dépôt `LegioFr/RoK` : n'y écris jamais. `references/` contient ce qui y avait été validé ; ce sont des points de départ, modifiables.
- Les écrans et icônes « proposés par Claude » ne sont pas validés tant que Mickaël ne l'a pas dit.
- Aucun secret (clé, mot de passe, jeton) dans le dépôt.
- Données du jeu : noter la source et la date de chaque donnée ; une valeur non vérifiée est signalée comme telle.
- Maquette : `maquette/` ; icônes régénérées par `node maquette/outils/generer-icones.cjs` ; copie publiable par `python3 maquette/outils/assembler.py`.
