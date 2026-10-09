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
  ['dx2','Supprime l’icône de la maquette déjà installée (appui long › Désinstaller), puis réinstalle-la depuis Chrome (menu ⋮ › Installer l’application) et ouvre-la depuis la nouvelle icône.','L’icône est l’anneau doré avec RC au milieu, son nom est « RoK Maquette », et elle s’ouvre sans barre du navigateur.',null,28,'icône RC (anneau doré) au lieu de la couronne (ta note 5) et nom « RoK Maquette » ; réinstalle la maquette pour les voir']]}
];
