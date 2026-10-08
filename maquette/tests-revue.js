/* Tests de la maquette, joués dans la bulle d'outils (onglet Tests, revue guidée).
   Un groupe = { g: titre, p: [état, écran] préparé avant son 1er test, l: tests }.
   Un test = [identifiant stable, ce qu'il faut faire, ce qu'on doit voir, préparation propre (facultative)].
   États : 'out' déconnecté, 'demo' compte d'essai (':f1' choisit le profil actif), 'vide' nouveau compte sans profil.
   Les identifiants ne changent jamais : les résultats y sont rattachés. */
window.RC_TESTS=[
 {g:'Se connecter',p:['out','#connexion'],l:[
  ['c1','Touche « Se connecter » sans rien remplir.','Le navigateur demande de remplir l’e-mail. Rien d’autre ne se passe.'],
  ['c2','Écris une adresse sans « @ » (ex. « mickael »), un mot de passe, puis « Se connecter ».','Le navigateur signale que l’adresse n’est pas valide.'],
  ['c3','Écris gouverneur@exemple.fr et un mauvais mot de passe, puis « Se connecter ».','Encadré rouge « E-mail ou mot de passe incorrect. » sous le bouton.'],
  ['c4','Après l’erreur, ajoute une lettre dans un des champs.','L’encadré rouge disparaît.'],
  ['c5','Touche l’œil à droite du mot de passe, puis touche-le encore.','Le mot de passe s’affiche en clair, puis se masque. L’œil est barré quand le mot de passe est visible.'],
  ['c6','Touche « Mot de passe oublié ? ».','L’écran « Mot de passe oublié ? » s’ouvre.'],
  ['c7','Touche « Créer un compte ».','L’écran « Créer un compte » s’ouvre.',['out','#connexion']],
  ['c8','Connecte-toi : gouverneur@exemple.fr, mot de passe rok12345.','Tu arrives sur l’Accueil du profil Principal.',['out','#connexion']],
  ['c9','Recharge la page (bouton du navigateur).','Tu restes connecté et tu reviens sur le même écran.',['demo','#accueil']],
  ['c10','Regarde l’écran en entier : logo, titre, champs, boutons, bulle verte en bas.','Tout est lisible et aligné, rien n’est coupé ni ne dépasse.',['out','#connexion']],
  ['c11','Sur téléphone ou tablette, touche le champ E-mail.','Le clavier s’ouvre sans cacher le champ ; tu peux faire défiler jusqu’au bouton.']
 ]},
 {g:'Créer un compte',p:['out','#inscription'],l:[
  ['i1','Écris une adresse sans « @ », le même mot de passe de 8 caractères deux fois, puis « Créer mon compte ».','Un message signale que l’adresse n’est pas valide.'],
  ['i2','Écris une bonne adresse et « abc » dans les deux mots de passe, puis « Créer mon compte ».','« Au moins 8 caractères. » sous le mot de passe.'],
  ['i3','Écris deux mots de passe différents de 8 caractères ou plus.','« Les mots de passe ne correspondent pas. » sous la confirmation.'],
  ['i4','Corrige le champ en erreur.','Son message rouge et son cadre rouge disparaissent dès que tu tapes.'],
  ['i5','Touche les deux yeux.','Chacun affiche ou masque son propre champ.'],
  ['i6','Touche « Se connecter » en bas.','Retour à l’écran de connexion.'],
  ['i7','Crée un compte avec une adresse inventée (ex. test1@exemple.fr) et un mot de passe de 8 caractères.','Écran « Confirme ton e-mail » avec ton adresse affichée.',['out','#inscription']],
  ['i8','Crée un compte avec gouverneur@exemple.fr (adresse qui a déjà un compte).','Même écran de confirmation : l’appli ne dit pas que l’adresse a déjà un compte.',['out','#inscription']]
 ]},
 {g:'Confirmer l’e-mail',p:['out','#confirmation'],l:[
  ['f1','Touche « Renvoyer l’e-mail ».','Message « E-mail renvoyé. » sous le bouton.'],
  ['f2','Regarde l’adresse affichée.','C’est celle du compte que tu viens de créer, en entier, même longue.'],
  ['f3','Touche « Retour à la connexion », puis connecte-toi avec le compte créé (pas encore confirmé).','Tu reviens sur « Confirme ton e-mail » avec « Confirme d’abord ton e-mail : touche le lien reçu. »'],
  ['f4','Ouvre la bulle › Écran › « Simuler le lien de l’e-mail ».','Tu arrives connecté sur l’Accueil sans profil du nouveau compte.',['out','#confirmation']]
 ]},
 {g:'Mot de passe oublié',p:['out','#mot-de-passe-oublie'],l:[
  ['o1','Touche « Envoyer le lien » sans adresse.','Le navigateur demande l’adresse.'],
  ['o2','Écris gouverneur@exemple.fr, puis « Envoyer le lien ».','« Si un compte correspond à cette adresse, un e-mail de réinitialisation a été envoyé. »'],
  ['o3','Recommence avec une adresse qui n’a pas de compte.','Exactement le même message.'],
  ['o4','Juste après, bulle › Écran › « Simuler le lien de l’e-mail ».','Message « Aucun compte avec cette adresse : aucun e-mail n’est parti. »'],
  ['o5','Renvoie le lien avec gouverneur@exemple.fr, puis bulle › Écran › « Simuler le lien de l’e-mail ».','L’écran « Nouveau mot de passe » s’ouvre.'],
  ['o6','Touche « Retour à la connexion ».','Écran de connexion.',['out','#mot-de-passe-oublie']],
  ['o7','Sur téléphone, regarde le titre « Mot de passe oublié ? ».','Il tient sur une seule ligne.',['out','#mot-de-passe-oublie']]
 ]},
 {g:'Nouveau mot de passe',p:['out','#nouveau-mot-de-passe'],l:[
  ['n1','Écris « abc » dans les deux champs, puis « Enregistrer ».','« Au moins 8 caractères. »'],
  ['n2','Écris deux mots de passe différents.','« Les mots de passe ne correspondent pas. »'],
  ['n3','Touche les deux yeux.','Chacun affiche ou masque son champ.'],
  ['n4','Enregistre un bon mot de passe (ex. nouveau123), écrit deux fois.','Tu arrives connecté sur l’Accueil avec « Nouveau mot de passe enregistré. »'],
  ['n5','Connecte-toi avec gouverneur@exemple.fr et l’ancien mot de passe rok12345, puis avec le nouveau.','L’ancien est refusé, le nouveau marche.',['out','#connexion']]
 ]},
 {g:'Accueil sans profil',p:['vide','#accueil'],l:[
  ['v1','Regarde l’écran.','Titre « Accueil », bloc « Aucun profil RoK » avec une couronne et le bouton doré « Créer mon premier profil ». Pas de pastille sur Ma ville.'],
  ['v2','Touche Ma ville, puis Optimiser, puis Combat dans le menu.','Message « Ajoute d’abord un profil. » et tu restes sur l’Accueil.'],
  ['v3','Touche Plus, puis reviens à l’Accueil.','Plus s’ouvre normalement.'],
  ['v4','Touche « Créer mon premier profil ».','Fenêtre « Créer mon premier profil », type « Principal » déjà choisi, exemple « Ex. Principal ».'],
  ['v5','Touche « Créer le profil » sans nom.','« Donne un nom au profil. » sous le champ.'],
  ['v6','Ferme la fenêtre avec « Annuler », puis rouvre-la et touche en dehors.','Elle se ferme sans rien créer.'],
  ['v7','Crée un profil nommé « Principal ».','Le tableau de bord apparaît : nom, « Actif », valeurs « — » (inconnues), jamais de zéros inventés.'],
  ['v8','Touche « Ajouter » en haut à droite (téléphone) ou « + » (tablette, PC).','La même fenêtre de création s’ouvre.',['vide','#accueil']]
 ]},
 {g:'Accueil · profils',p:['demo:main','#accueil'],l:[
  ['p1','Touche les onglets Principal, Ferme 1, Ferme 2.','Tout change : nom, emblème, chiffres, priorités, À surveiller, Aperçu, objectif. L’onglet choisi est doré.'],
  ['p2','Touche « + » (ou « Ajouter ») et crée un profil nommé « Ferme 1 ».','« Un profil porte déjà ce nom. »'],
  ['p3','Crée « Ferme 3 », type Ferme, avec un ID joueur.','Nouvel onglet ; Ferme 3 devient le profil actif, avec des valeurs « — ».'],
  ['p4','Sur téléphone, regarde la rangée d’onglets avec 4 profils.','Elle défile sur le côté sans élargir la page.']
 ]},
 {g:'Bloc profil et fiche',p:['demo:main','#accueil'],l:[
  ['b1','Regarde le bloc du profil.','Nom, « Actif », Royaume, Hôtel de ville, VIP, puis 6 chiffres lisibles et alignés.'],
  ['b2','Touche le bloc du profil.','La fiche du profil s’ouvre.'],
  ['b3','« Modifier le profil » : vide le nom et enregistre, puis mets « Principal 2 ».','Le nom vide est refusé ; ensuite le nouveau nom apparaît partout (fiche, onglets, Accueil).',['demo:main','#profil']],
  ['b4','Dans « Autres profils », ouvre Ferme 1.','Fiche de Ferme 1 avec le bouton « Rendre actif ».'],
  ['b5','Touche « Rendre actif ».','Message ; Ferme 1 devient le profil actif et l’Accueil suit.'],
  ['b6','Supprime Ferme 2 (pas active).','La confirmation dit tout ce qui sera supprimé ; après « Supprimer », Ferme 2 disparaît partout.',['demo:main','#profil-f2']],
  ['b7','Supprime le profil actif (Principal).','La confirmation dit quel profil deviendra actif ; après « Supprimer », c’est fait.',['demo:main','#profil']],
  ['b8','Supprime les profils restants un par un.','Après le dernier : Accueil sans profil.'],
  ['b9','Touche « ‹ Accueil » en haut de la fiche.','Retour à l’Accueil.',['demo:main','#profil']]
 ]},
 {g:'Priorités du jour',p:['demo:main','#accueil'],l:[
  ['r1','Lis la ligne « Combien de temps as-tu pour jouer ? ».','Tu comprends sans aide à quoi servent 10 min, 30 min et 1 h.'],
  ['r2','Touche 10 min, puis 30 min, puis 1 h.','10 min : 2 actions ; 30 min : 3 ; 1 h : la 3e change (Entraîner des fantassins). Chaque action affiche sa durée.'],
  ['r3','Touche chaque priorité, puis reviens.','Chacune ouvre l’écran qui permet de la faire.'],
  ['r4','Regarde les priorités de Ferme 1, puis de Ferme 2.','Elles sont propres à chaque profil.',['demo:f1','#accueil']]
 ]},
 {g:'À surveiller',p:['demo:main','#accueil'],l:[
  ['w1','Lis chaque ligne.','Chaque ligne est claire et son icône correspond.'],
  ['w2','Touche « Bonus de vitesse de construction à renseigner », « Renseigner », mets 42, enregistre, reviens à l’Accueil.','La ligne disparaît, la priorité « Renseigner » aussi, la bulle Bonus de vitesse affiche 42 % et la pastille de Ma ville passe de 2 à 1.'],
  ['w3','Touche « Marche 2 incomplète ».','L’écran Combat s’ouvre.',['demo:main','#accueil']],
  ['w4','Touche « Inventaire relevé il y a 6 jours », puis « Utiliser les captures d’exemple », « Analyser », confirme les éléments, « Enregistrer », reviens à l’Accueil.','La ligne « Inventaire relevé… » a disparu.',['demo:main','#accueil']]
 ]},
 {g:'Aperçu de ma ville',p:['demo:main','#accueil'],l:[
  ['a1','Regarde les 6 bulles.','Bâtisseurs, Bonus de vitesse, Total nourriture, Total bois, Total pierre, Total or.'],
  ['a2','Regarde Bonus de vitesse (profil Principal).','« — » et « à renseigner », jamais 0.'],
  ['a3','Touche chaque bulle.','Bâtisseurs et Bonus ouvrent l’écran de la valeur ; les totaux ouvrent Ma ville › Inventaire.'],
  ['a4','Touche « 2 à renseigner › ».','Ma ville › Progression s’ouvre.',['demo:main','#accueil']],
  ['a5','Compare le nombre « à renseigner » et la pastille sur Ma ville dans le menu.','C’est le même nombre.',['demo:main','#accueil']]
 ]},
 {g:'Objectif, événements, semaine',p:['demo:main','#accueil'],l:[
  ['e1','Touche la carte « Objectif en cours ».','Le plan Château 25 s’ouvre.'],
  ['e2','Avec Ferme 1, touche « Objectif en cours ».','L’écran Fermes s’ouvre.',['demo:f1','#accueil']],
  ['e3','Touche chaque événement, puis « Calendrier › ».','Chacun ouvre Événements.',['demo:main','#accueil']],
  ['e4','Touche un événement, puis touche-le encore.','Rappel activé (pastille « Rappel »), puis retiré.',['demo:main','#evenements']],
  ['e5','Touche « Ma semaine ».','Le Bilan s’ouvre.',['demo:main','#accueil']],
  ['e6','Dans Bilan, touche 30 jours puis 7 jours.','Les chiffres changent ; une période sans relevé est signalée.'],
  ['e7','Touche « ‹ Accueil » depuis Bilan, puis depuis Événements.','Retour à l’Accueil à chaque fois.']
 ]},
 {g:'Menu et compte',p:['demo:main','#accueil'],l:[
  ['m1','Touche chaque entrée du menu (en bas, ou à gauche sur PC).','Le bon écran s’ouvre ; l’entrée active est dorée.'],
  ['m2','Plus › Se déconnecter › Annuler.','La fenêtre se ferme ; tu restes connecté.',['demo','#plus']],
  ['m3','Plus › Se déconnecter › Se déconnecter.','Écran de connexion avec « Tu es déconnecté. Tes profils restent enregistrés. »'],
  ['m4','Plus › Mot de passe : mets un faux mot de passe actuel.','« Mot de passe actuel incorrect. »',['demo','#plus']],
  ['m5','Mets le bon mot de passe actuel, puis un nouveau trop court, puis deux différents, puis un bon.','Un message pour chaque erreur, puis « Mot de passe changé. »'],
  ['m6','Plus › Adresse e-mail : mets une adresse invalide, puis une bonne.','Erreur, puis la nouvelle adresse s’affiche sous « Adresse e-mail ».'],
  ['m7','Plus › Aucun accès à ton compte RoK.','Une fenêtre explique que l’appli ne se connecte jamais au jeu.']
 ]},
 {g:'Tailles et confort',p:['demo:main','#accueil'],l:[
  ['t1','Sur téléphone, fais défiler tout l’Accueil.','Une seule colonne, menu collé en bas, rien ne dépasse à droite, rien n’est caché sous le menu.'],
  ['t2','Sur tablette, en portrait puis en paysage.','Tout reste lisible ; l’Accueil s’adapte.'],
  ['t3','Sur PC (ou sur une fenêtre très large).','Menu à gauche, deux colonnes.'],
  ['t4','Si un texte te paraît petit : bulle › Inspecter, touche-le.','Sa taille en px s’affiche : pose une note si c’est trop petit.']
 ]}
];
