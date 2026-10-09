/* Tests de Mickaël, joués dans la bulle d'outils (onglet Tests, revue guidée).
   Depuis le 2026-10-09 : Claude vérifie d'abord sur le vrai site avec son robot (outils/robot/) le fonctionnement, les parcours,
   les saisies, les calculs et ce qui se mesure. Ici, seulement ce que Mickaël seul peut juger : graphisme à l'œil, sa tablette,
   clarté des textes, prise en main. 5 à 10 points par écran.
   Un groupe = { g: titre, p: [état, écran] préparé avant son 1er test, l: tests }.
   Un test = [identifiant stable, ce qu'il faut faire, ce qu'on doit constater, préparation propre (facultative, sinon null),
   numéro de la version qui l'a modifié, pourquoi]. Règle : chaque modification de la maquette met à jour ces deux derniers champs
   des tests touchés ; la bulle les propose alors dans « Corrections à vérifier ».
   États : 'out' déconnecté, 'attente' compte créé mais pas confirmé, 'demo' compte d'essai (':f1' choisit le profil actif),
   'vide' nouveau compte sans profil. Les identifiants ne changent jamais : les résultats y sont rattachés.
   Anciens tests (147, jusqu'au 2026-10-09) et leurs résultats : outils/archive/. */
window.RC_TESTS=[
 {g:'Se connecter',p:['out','#connexion'],l:[
  ['cx1','Regarde l’écran « Se connecter » dans son ensemble.','Il te plaît : logo, titre, champs et boutons sont bien alignés, rien ne paraît serré, vide ou de travers.',null,27,'plus de défilement inutile ; « Pas encore de compte ? » retiré (tes notes 1 et 2)'],
  ['cx2','Lis tous les textes, y compris les petits : « E-mail », « Mot de passe », « Mot de passe oublié ? » et la ligne verte du bas.','Tu les lis sans effort sur ta tablette. (Sur téléphone, ces petits textes font 11 px, comme dans la maquette validée : dis-moi s’ils te paraissent trop petits.)'],
  ['cx3','Touche le champ E-mail.','Le clavier s’ouvre sans cacher le champ. En faisant défiler, tu atteins le bouton « Se connecter » sans fermer le clavier.'],
  ['cx4','Tourne la tablette (portrait puis paysage), puis remets-la.','L’écran se remet en place à chaque fois, rien n’est coupé ni décalé.'],
  ['cx5','Touche l’œil à droite du champ Mot de passe, deux fois.','L’œil est facile à toucher du doigt et tu comprends ce qu’il fait (montrer puis cacher le mot de passe).'],
  ['cx6','Écris gouverneur@exemple.fr, un mauvais mot de passe, puis touche « Se connecter ».','Le message « E-mail ou mot de passe incorrect. » se voit bien et se comprend. (Texte proposé par Claude : dis-moi s’il te va.)'],
  ['cx7','Connecte-toi maintenant avec gouverneur@exemple.fr et le mot de passe rok12345, sans aide.','Tu as trouvé tout de suite où écrire et quoi toucher, et tu arrives sur l’Accueil.']]},
 {g:'Créer un compte',p:['out','#connexion'],l:[
  ['in1','Touche « Créer un compte » en bas, puis « Se connecter » pour revenir, deux ou trois fois.','La carte garde la même taille d’un écran à l’autre, et aucun des deux écrans ne défile.',null,27,'les 5 écrans de compte ont la même taille de carte (ta note 3)'],
  ['in2','Sur « Créer un compte », remplis les 3 champs à la suite avec le clavier de la tablette.','Le clavier ne cache jamais le champ où tu écris ; la touche « Suivant » du clavier, si elle existe, passe au champ suivant.',['out','#inscription']],
  ['in3','Trompe-toi exprès : adresse « mickael@exemple », mot de passe « abc », confirmation « abd », puis « Créer mon compte ».','Les messages rouges sous les champs se voient bien et tu sais tout de suite quoi corriger.',['out','#inscription']],
  ['in4','Lis les messages : « Saisis une adresse valide, par exemple nom@exemple.fr. », « Au moins 8 caractères. », « Les mots de passe ne correspondent pas. »','Ils sont clairs et sur le bon ton. (Les deux premiers sont proposés par Claude.)'],
  ['in5','Remplace l’adresse par gouverneur@exemple.fr, mets deux mots de passe identiques de 8 caractères, puis « Créer mon compte ».','Le message « Un compte existe déjà avec cette adresse… » est clair et te dit quoi faire.']]},
 {g:'Confirmer l’e-mail',p:['attente','#confirmation'],l:[
  ['cf1','Regarde et lis l’écran « Confirme ton e-mail ».','Tu comprends qu’il faut ouvrir l’e-mail reçu. La phrase est maintenant « Un e-mail de confirmation t’a été envoyé. ».',null,27,'phrase « Un e-mail de confirmation t’a été envoyé. » (ta note 4)'],
  ['cf2','Touche « Renvoyer l’e-mail ».','Le message « E-mail renvoyé. » se voit bien.'],
  ['cf3','Touche « ✉ Simuler le lien de l’e-mail » dans le bandeau des tests (c’est comme toucher le lien reçu par e-mail).','Tu arrives sur l’Accueil d’un compte neuf, avec le message « E-mail confirmé. Bienvenue ! ». L’arrivée te paraît claire et le bouton « Créer mon premier profil » saute aux yeux.']]},
 {g:'Mot de passe oublié',p:['out','#connexion'],l:[
  ['mo1','Touche « Mot de passe oublié ? » sous le champ E-mail.','Le lien est facile à toucher du doigt. Le titre de cet écran est plus petit que « Se connecter », comme dans la maquette validée : dis-moi si ça te gêne.'],
  ['mo2','Écris personne@exemple.fr, puis « Envoyer le lien ».','Le message « Aucun compte avec cette adresse. Vérifie-la, ou crée un compte. » est clair.',['out','#mot-de-passe-oublie']],
  ['mo3','Écris gouverneur@exemple.fr, puis « Envoyer le lien ».','Le message « E-mail envoyé à gouverneur@exemple.fr : touche le lien qu’il contient… » est clair.'],
  ['mo4','Touche « ✉ Simuler le lien de l’e-mail » dans le bandeau, choisis un nouveau mot de passe (deux fois le même, 8 caractères ou plus), puis « Enregistrer ».','Tu es connecté et le message « Nouveau mot de passe enregistré. » reste affiché assez longtemps pour être lu.']]},
 {g:'Déconnexion et appli installée',p:['demo','#plus'],l:[
  ['dx1','Dans Plus, touche « Se déconnecter », puis confirme.','Tu reviens sur « Se connecter » avec « Tu es déconnecté. Tes profils restent enregistrés. » : c’est clair.'],
  ['dx2','Supprime l’icône de la maquette déjà installée (appui long › Désinstaller), puis réinstalle-la depuis Chrome (menu ⋮ › Installer l’application) et ouvre-la depuis la nouvelle icône.','L’icône est l’anneau doré avec RC au milieu, son nom est « RoK Maquette », et elle s’ouvre sans barre du navigateur.',null,28,'icône RC (anneau doré) au lieu de la couronne (ta note 5) et nom « RoK Maquette » ; réinstalle la maquette pour les voir']]},
 {g:'Accueil · vue d’ensemble',p:['demo','#accueil'],l:[
  ['ac1','Regarde l’Accueil sur ta tablette, en portrait.','La nouvelle organisation te convient : le profil sur toute la largeur, à gauche ce qu’il faut faire (alertes, priorités, routine), à droite où tu en es (en cours, événements, objectif, aperçu, semaine). Tout se lit bien, rien n’est serré.'],
  ['ac2','Tourne la tablette en paysage, puis remets-la en portrait.','L’Accueil reste lisible dans les deux sens et se remet en place.'],
  ['ac3','Passe d’un profil à l’autre avec les onglets en haut (Principal, Ferme 1, Ferme 2).','Tout suit le profil choisi, y compris « En cours », « À surveiller » et « Ma semaine ».',null,34,'les deux colonnes commencent à la même hauteur (ta note 7)'],
  ['ac12','Crée un profil sur ce compte neuf (« Créer mon premier profil »), puis regarde l’Accueil.','Une seule carte « Renseigne ta ville » en haut à gauche, avec le nombre de valeurs et, à droite, « Tout renseigner », qui ouvre la saisie rapide de Ma ville. Les valeurs à renseigner ne sont pas répétées dans les priorités ni dans « À surveiller ».',['vide','#accueil'],34,'bouton « Tout renseigner » à droite de la carte (ta note 8)']]},
 {g:'Accueil · priorités et routine',p:['demo','#accueil'],l:[
  ['ac4','Change le temps de jeu (10 min, 30 min, 1 h) au-dessus des priorités.','La liste s’adapte au temps choisi et tu comprends pourquoi certaines actions apparaissent ou disparaissent.',null,34,'ligne « N actions · ≈ X min sur Y » retirée (ta note 6)'],
  ['ac5','Dans « Routine du jour », coche deux tâches.','Les cases sont faciles à toucher, les tâches cochées laissent la place aux suivantes et le compteur avance.',null,34,'la tâche cochée s’efface en fondu (ta note 9)'],
  ['ac6','Touche « Tout voir », puis « Modifier la liste » : renomme une ligne, retires-en une, ajoutes-en une, puis « Enregistrer ».','La modification est facile et la liste change bien sur l’Accueil.',null,34,'heure en UTC (minuit), phrases retirées (tes notes 10 et 11)']]},
 {g:'Accueil · en cours et alertes',p:['demo','#accueil'],l:[
  ['ac7','Dans « En cours », touche « + Ajouter » et ajoute une recherche avec un temps restant écrit comme dans le jeu (par exemple 1j 4h 30m).','C’est facile à saisir et l’heure de fin affichée est juste.'],
  ['ac8','Lis « À surveiller ».','Chaque alerte est claire et tu sais quoi faire : ressources exposées au pillage, bâtisseur libre, marche incomplète, inventaire ancien.'],
  ['ac9','Touche « 1 bâtisseur libre ».','La fenêtre d’ajout s’ouvre, déjà réglée sur « Construction ».']]},
 {g:'Accueil · événements',p:['demo','#accueil'],l:[
  ['ac10','Regarde « Prochains événements », puis touche « Calendrier ».','Les dates et les heures (heure de France) sont claires, et un événement en cours se repère tout de suite.'],
  ['ac11','Dans le calendrier, touche « Ajouter » et ajoute un événement avec une date dans quelques jours.','C’est facile ; il apparaît à sa place dans le calendrier et sur l’Accueil.']]},
 {g:'Ma ville · progression',p:['demo','#ma-ville-progression'],l:[
  ['vp1','Regarde Ma ville › Progression sur ta tablette, en portrait, puis en paysage.','C’est propre et lisible : l’Hôtel de ville en haut avec ce qu’il manque pour le niveau 25, puis les réglages et les bâtiments en tuiles.'],
  ['vp2','Lis la carte de l’Hôtel de ville, puis touche « Mur 24 ».','Tu comprends tout de suite ce qu’il manque, le coût et la durée ; « Mur 24 » ouvre la valeur du Mur. Si un prérequis ou un coût te semble faux par rapport au jeu, laisse une note.'],
  ['vp3','Regarde les bâtiments : Économique, Militaire, Autres.','Il ne manque aucun bâtiment à niveau de ton jeu, ils sont rangés comme dans le jeu et portent les noms du jeu (Réserve, Moulin à bois, Comptoir…). Sinon, laisse une note.'],
  ['vp6','Regarde le dernier groupe, « Saison de KvK ».','Forum d’état, Mine de cristal et Centre de recherche de cristal y sont ; tu comprends que les deux bâtiments de cristal disparaissent à la fin de la saison.'],
  ['vp5','Touche la tuile « Fermes », puis « Corriger » : change le niveau d’une ferme et enregistre.','Une case par ferme, c’est clair ; la tuile affiche ensuite le bon niveau.'],
  ['vp4','Regarde le badge en haut, à côté de « Importer ».','Il dit « Exemples, non enregistrés » et c’est clair. Dans ta version réelle, il dira « Enregistré », ou « En attente d’envoi » si l’enregistrement n’a pas pu partir.']]},
 {g:'Ma ville · inventaire',p:['demo','#ma-ville-inventaire'],l:[
  ['vi1','Regarde les onglets de l’inventaire : Ressources, Accélérateurs, Boosts, Équipement, Attirail, Autre.','Ce sont les onglets de l’Inventaire du jeu, dans le même ordre.'],
  ['vi2','Touche « Nourriture », puis « Modifier ». Change « En ville » (par exemple 40,5 M) et le nombre d’une caisse, puis « Enregistrer ».','La fenêtre est facile à remplir, les tailles de caisses sont celles du jeu, et le total de la nourriture change.'],
  ['vi3','Dans Accélérateurs, ouvre « Généraux », puis « Modifier ».','Les durées sont celles du jeu. Celles marquées d’un * (24 h et plus) ne sont pas encore vérifiées : dis-moi si tu en as dans ton inventaire.'],
  ['vi4','Dans « Autre », touche « Ajouter un objet », ajoute un objet de ton inventaire avec sa quantité, puis touche-le pour le modifier et le supprimer.','C’est simple et clair.']]},
 {g:'Essai de lecture par l’IA',p:['demo','#import'],l:[
  ['ia1','En bas de l’écran Importer, dans « Essai de lecture par l’IA », envoie 3 captures entières de ton Inventaire : une de l’onglet Ressources, une des Accélérateurs, une de ton choix.','Les 3 captures apparaissent en miniature, chacune avec « Retirer ». Je les utiliserai pour l’essai.']]}
];
