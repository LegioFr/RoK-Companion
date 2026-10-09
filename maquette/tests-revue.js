/* Tests de la maquette, joués dans la bulle d'outils (onglet Tests, revue guidée).
   Un groupe = { g: titre, p: [état, écran] préparé avant son 1er test, l: tests }.
   Un test = [identifiant stable, ce qu'il faut faire, ce qu'on doit voir, préparation propre (facultative, sinon null),
   numéro de la version qui l'a modifié, pourquoi]. Règle : chaque modification de la maquette met à jour ces deux derniers champs
   des tests touchés ; la bulle les propose alors dans « À revoir » à Mickaël.
   États : 'out' déconnecté, 'attente' compte créé mais pas confirmé (mot de passe rok12345), 'demo' compte d'essai (':f1' choisit le profil actif), 'vide' nouveau compte sans profil.
   Les identifiants ne changent jamais : les résultats y sont rattachés.
   2026-10-09 : liste vidée à la demande de Mickaël (les 147 tests précédents et leurs résultats sont archivés dans
   outils/archive/). Les nouveaux tests seront écrits selon les types de tests qu'il choisira. */
window.RC_TESTS=[];
