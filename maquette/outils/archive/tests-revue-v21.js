/* Tests de la maquette, joués dans la bulle d'outils (onglet Tests, revue guidée).
   Un groupe = { g: titre, p: [état, écran] préparé avant son 1er test, l: tests }.
   Un test = [identifiant stable, ce qu'il faut faire, ce qu'on doit voir, préparation propre (facultative, sinon null),
   numéro de la version qui l'a modifié, pourquoi]. Règle : chaque modification de la maquette met à jour ces deux derniers champs
   des tests touchés ; la bulle les propose alors dans « À revoir » à Mickaël.
   États : 'out' déconnecté, 'attente' compte créé mais pas confirmé (mot de passe rok12345), 'demo' compte d'essai (':f1' choisit le profil actif), 'vide' nouveau compte sans profil.
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
  ['i8b','Crée un compte avec gouverneur@exemple.fr (adresse qui a déjà un compte).','Sous E-mail : « Un compte existe déjà avec cette adresse… ». Tu restes sur « Créer un compte ».',['out','#inscription'],8,'Adresse déjà utilisée : message d’erreur au lieu de la confirmation']
 ]},
 {g:'Confirmer l’e-mail',p:['attente','#confirmation'],l:[
  ['f1','Touche « Renvoyer l’e-mail ».','Message « E-mail renvoyé. » sous le bouton.',null,8,'Les tests de la confirmation préparent eux-mêmes un compte en attente'],
  ['f2','Regarde l’adresse affichée.','C’est celle du compte en attente de confirmation (attente…@exemple.fr), en entier.',null,8,'Les tests de la confirmation préparent eux-mêmes un compte en attente'],
  ['f3b','Retiens l’adresse affichée, touche « Retour à la connexion », puis connecte-toi avec cette adresse et le mot de passe rok12345.','Tu reviens sur « Confirme ton e-mail » avec « Confirme d’abord ton e-mail : touche le lien reçu. »',null,8,'Les tests de la confirmation préparent eux-mêmes un compte en attente'],
  ['f4','Fais comme si tu touchais le lien reçu par e-mail : touche « ✉ Simuler le lien de l’e-mail » dans ce bandeau.','Ton compte est confirmé : tu arrives connecté sur l’Accueil sans profil du nouveau compte.',['attente','#confirmation'],12,'Le bouton « Simuler le lien » est maintenant dans le bandeau du test']
 ]},
 {g:'Mot de passe oublié',p:['out','#mot-de-passe-oublie'],l:[
  ['o1','Touche « Envoyer le lien » sans adresse.','Le navigateur demande l’adresse.'],
  ['o2b','Écris gouverneur@exemple.fr, puis « Envoyer le lien ».','« E-mail envoyé à gouverneur@exemple.fr : touche le lien qu’il contient… »',null,9,'« Mot de passe oublié » dit si l’adresse n’a pas de compte'],
  ['o3b','Recommence avec une adresse qui n’a pas de compte (ex. personne@exemple.fr).','Encadré rouge « Aucun compte avec cette adresse. Vérifie-la, ou crée un compte. »',null,9,'« Mot de passe oublié » dit si l’adresse n’a pas de compte'],
  ['o4b','Juste après, regarde ce bandeau.','Pas de bouton « ✉ Simuler le lien de l’e-mail » : aucun e-mail n’est parti.',null,12,'Le bouton « Simuler le lien » est maintenant dans le bandeau du test'],
  ['o5','Renvoie le lien avec gouverneur@exemple.fr, puis fais comme si tu touchais le lien reçu : « ✉ Simuler le lien de l’e-mail » dans ce bandeau.','L’écran « Nouveau mot de passe » s’ouvre.',null,12,'Le bouton « Simuler le lien » est maintenant dans le bandeau du test'],
  ['o6','Touche « Retour à la connexion ».','Écran de connexion.',['out','#mot-de-passe-oublie']],
  ['o7','Sur téléphone, regarde le titre « Mot de passe oublié ? ».','Il tient sur une seule ligne.',['out','#mot-de-passe-oublie']]
 ]},
 {g:'Nouveau mot de passe',p:['out','#nouveau-mot-de-passe'],l:[
  ['n1','Écris « abc » dans les deux champs, puis « Enregistrer ».','« Au moins 8 caractères. »'],
  ['n2','Écris deux mots de passe différents.','« Les mots de passe ne correspondent pas. »'],
  ['n3','Touche les deux yeux.','Chacun affiche ou masque son champ.'],
  ['n4','Enregistre un bon mot de passe (ex. nouveau123), écrit deux fois.','Tu arrives connecté sur l’Accueil ; en bas, le message « Nouveau mot de passe enregistré. » reste quelques secondes.',null,17,'Les messages restent plus longtemps à l’écran'],
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
  ['r2','Touche 10 min, puis 30 min, puis 1 h.','3 actions en 10 min, 5 en 30 min, 5 en 1 h (dont « Entraîner des fantassins ») : jamais plus de 5. Chaque action a sa durée et le total s’affiche sous la liste (ex. « 5 actions · ≈ 38 min sur 1 h »).',null,18,'5 actions au plus (ta note 8)'],
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
  ['e1','Touche la carte « Objectif en cours ».','Le plan s’ouvre, avec le titre « Hôtel de ville 25 ».',null,17,'« Château 25 » devient « Hôtel de ville 25 » (ta note 6)'],
  ['e2','Avec Ferme 1, touche « Objectif en cours ».','L’écran Fermes s’ouvre.',['demo:f1','#accueil']],
  ['e3','Touche chaque événement, puis « Calendrier › ».','Chacun ouvre Événements.',['demo:main','#accueil']],
  ['e4','Touche « Me prévenir » sur « Gouverneur le plus puissant », puis touche à nouveau le bouton.','Le bouton devient « Rappel activé » (vert) et un message dit quand tu seras prévenu ; au 2e appui, le rappel est retiré. « Fête de la moisson » (date inconnue) n’a pas de bouton : « pas de rappel possible ».',['demo:main','#evenements'],17,'Bouton « Me prévenir » au lieu de « rappel activé » (ta note 7)'],
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
  ['t4','Si un texte te paraît petit : touche le rond bleu avec la clé (la bulle d’outils) › Inspecter, puis touche le texte.','Sa taille en px s’affiche : pose une note si c’est trop petit.']
 ]} ,
 /* ---------- Ma ville (ajoutés le 2026-10-09) ---------- */
 {g:'Ma ville · en-tête et onglets',p:['demo:neuf','#ma-ville-progression'],l:[
  ['mv1','Regarde le haut de Ma ville.','Titre « Ma ville », « Profil Principal » dessous, pastille verte « Synchronisé », boutons « Importer » et « Tout renseigner ».'],
  ['mv2','Touche chaque onglet : Progression, Inventaire, Commandants, Équipements, Armements.','Chaque onglet s’ouvre ; l’onglet choisi est doré. Sur téléphone, la rangée d’onglets défile sur le côté sans élargir la page.'],
  ['mv3','Regarde « Ma ville » dans le menu.','Entrée dorée (active) avec la pastille « 2 » (2 valeurs à renseigner).'],
  ['mv4','Regarde Ma ville avec le profil Ferme 1.','« Profil Ferme 1 » et ses propres valeurs (Hôtel de ville 21, VIP 8…).',['demo:f1','#ma-ville-progression']]
 ]},
 {g:'Ma ville · Progression',p:['demo:neuf','#ma-ville-progression'],l:[
  ['pg1','Regarde « Réglages ».','Hôtel de ville 24, Niveau VIP 17, Bâtisseurs 2, Bonus de vitesse « — » avec « à renseigner », Civilisation France.'],
  ['pg2','Regarde « Bâtiments ».','Mur, Académie, Caserne, Écurie, Champ de tir, Hôpital, Atelier de siège ; Atelier de siège affiche « — » et « à renseigner ». Sur tablette et PC, deux colonnes.'],
  ['pg3','Regarde « Recherches » et « Troupes ».','Étiquette « Prévu · B05 » ; barres Économie 68 % et Militaire 54 % ; chaque troupe avec son niveau et son nombre.'],
  ['pg4','Compare la pastille de Ma ville dans le menu et le nombre de « à renseigner » sur la page.','Le même nombre : 2.'],
  ['pg5','Touche la ligne « Caserne ».','L’écran de la valeur « Caserne » s’ouvre.']
 ]},
 {g:'Ma ville · corriger une valeur',p:['demo:neuf','#valeur-caserne'],l:[
  ['va1','Regarde l’écran de la Caserne.','Titre « Caserne », « Niveau », grand 23, bouton « Corriger » ; historique avec dates, motif « Changé en jeu » et pastilles « Saisie » ou « Import ».'],
  ['va2','Touche « Corriger ».','Fenêtre « Corriger : Caserne » avec « Nouveau niveau », la date du relevé et les 3 motifs (« Changé en jeu » choisi).'],
  ['va3','Touche « Enregistrer la correction » sans changer la valeur.','« C’est déjà la valeur enregistrée. »'],
  ['va4','Écris « abc », enregistre ; puis 30, enregistre.','« Saisis un nombre entier entre 0 et 25. » les deux fois.'],
  ['va5','Vide le champ et enregistre.','« Saisis une valeur. »'],
  ['va6','Mets 24, choisis le motif « Erreur de saisie », enregistre.','Message « Correction enregistrée. L’ancienne valeur reste dans l’historique. » ; grand 24 ; en tête de l’historique 24 · Erreur de saisie ; l’ancien 23 reste en dessous.'],
  ['va7','Touche « ‹ Ma ville ».','La Caserne affiche 24 dans la liste.'],
  ['va8','Rouvre « Corriger », change la valeur, puis ferme sans enregistrer (« Annuler », toucher à côté ou Échap).','Rien n’a changé.',['demo','#valeur-caserne']]
 ]},
 {g:'Ma ville · renseigner une valeur',p:['demo:neuf','#valeur-bonus'],l:[
  ['vr1','Regarde l’écran « Bonus de vitesse de construction ».','Grand « — », bouton « Renseigner », historique « Aucun relevé ».'],
  ['vr2','Touche « Renseigner ».','Fenêtre « Renseigner : Bonus de vitesse de construction », champ « Bonus (en %) », pas de motif (première saisie).'],
  ['vr3','Écris 42,57 puis enregistre ; puis 2000.','Un message demande un pourcentage entre 0 et 1000, avec une décimale au plus.'],
  ['vr4','Écris 42,5 et enregistre.','« Valeur enregistrée. » ; grand « 42,5 % » ; un relevé dans l’historique.'],
  ['vr5','Reviens à l’Accueil.','La bulle Bonus de vitesse affiche 42,5 % ; la pastille de Ma ville passe à 1 ; la 1re priorité devient « Renseigner : Atelier de siège » (la valeur suivante qui manque).'],
  ['vr6','Ouvre la Civilisation, « Corriger », choisis Rome, enregistre.','Une liste des 15 civilisations ; ensuite « Rome » s’affiche et « France » reste dans l’historique.',['demo','#valeur-civ']]
 ]},
 {g:'Ma ville · saisie rapide',p:['demo:neuf','#ma-ville-progression'],l:[
  ['sr1','Touche « Tout renseigner ».','Chaque ligne devient un champ ; une barre en bas montre « Saisie rapide », « Annuler » et « Enregistrer ».'],
  ['sr2','Écris 40 dans « Bonus de vitesse ».','La barre affiche « 1 valeur modifiée » ; pas de motif (c’est une première saisie).'],
  ['sr3','Change aussi le VIP de 17 à 18.','« 2 valeurs modifiées » ; les 3 motifs apparaissent (c’est une correction).'],
  ['sr4','Mets 30 au VIP, puis « Enregistrer ».','La ligne VIP passe en rouge avec « Saisis un nombre entier entre 0 et 19. » ; message « 1 valeur enregistrée. 1 ligne à corriger. » ; le bonus est gardé.'],
  ['sr5','Mets 18 au VIP, puis « Enregistrer ».','« 1 valeur enregistrée. » ; retour à l’affichage normal avec VIP 18.'],
  ['sr6','« Tout renseigner », change une valeur, puis « Annuler ».','Retour à l’affichage normal ; rien n’a changé.',['demo:neuf','#ma-ville-progression']],
  ['sr7','En saisie rapide, regarde la ligne Civilisation.','Une liste déroulante des civilisations.'],
  ['sr8','Va sur l’onglet Inventaire, puis touche « Tout renseigner ».','Ma ville repasse sur Progression, en saisie rapide.',['demo','#ma-ville-inventaire']]
 ]},
 {g:'Ma ville · Inventaire',p:['demo:neuf','#ma-ville-inventaire'],l:[
  ['in1','Regarde le haut de l’Inventaire.','Boutons Ressources (doré), Accélérateurs, Objets ; « Import du 2 oct. » à droite de « Ressources ».'],
  ['in2','Regarde « Ressources ».','Nourriture, Bois, Pierre, Or et Gemmes avec leur total ; à côté, Coffres de ressources 7 et Packs 2 (« leur contenu n’est pas compté »).'],
  ['in3','Touche « Nourriture », puis touche-la encore.','Elle se déplie : En ville 32 M, puis le nombre de caisses de chaque valeur ; puis elle se replie.'],
  ['in4','Touche « Accélérateurs ».','Construction, Recherche, Entraînement, Soins, Généraux avec leur total en jours et heures ; Généraux « Utilisables partout ».'],
  ['in5','Déplie « Construction ».','Le nombre d’accélérateurs de chaque durée (1 min : 212, 5 min : 140, 1 h : 195…).'],
  ['in6','Touche « Objets ».','Étiquette « Prévu · B06 » et 4 objets avec leur nombre.'],
  ['in7','Regarde l’Inventaire de Ferme 1.','Ses propres valeurs ; un type sans accélérateur affiche « 0 h » et « Aucun » une fois déplié.',['demo:f1','#ma-ville-inventaire']]
 ]},
 {g:'Ma ville · importer des captures',p:['demo:neuf','#import'],l:[
  ['im1','Regarde l’écran « Importer ».','4 étapes en haut (Captures, Analyse, Relecture, Résultat), la 1re en doré ; 3 cases vides ; « Aucune capture choisie… » ; « Analyser » grisé.'],
  ['im2','Touche « Choisir des captures » et prends 2 ou 3 images de ta galerie.','Tes images en miniature, « N captures choisies · 20 Mo au plus », message « Elles restent sur ton appareil. » ; « Analyser » devient actif.'],
  ['im3','Touche « Importer une vidéo » et choisis une vidéo.','Fenêtre « Vidéo choisie » avec son nom : la lecture des vidéos est prévue plus tard.'],
  ['im4','Touche « Utiliser les captures d’exemple ».','15 captures d’exemple ; « Analyser » actif.',['demo','#import']],
  ['im5','Touche « Analyser ».','Étape 2 : barre « Lecture de la capture k sur 15 » qui avance, puis passage tout seul à la Relecture.'],
  ['im6','Regarde la Relecture.','« 41 éléments lus », « 38 sûrs · 3 à vérifier », 3 cartes à vérifier (accélérateur 1 h, caisse de nourriture, pierre en ville).'],
  ['im7','Touche « Enregistrer » sans rien confirmer.','« Confirme au moins un élément avant d’enregistrer. »'],
  ['im8','Touche « Confirmer les 38 éléments sûrs ».','Le bouton devient « 38 éléments confirmés » (grisé) ; « 38 sûrs confirmés ».'],
  ['im9','Carte 1 : mets 1 300 puis « C’est bon » ; carte 2 : « Ignorer » ; carte 3 : « Changé en jeu ».','Chaque carte traitée s’estompe ; en haut, « tout est vérifié ».'],
  ['im10','Touche « Enregistrer ».','Étape 4 : « 40 valeurs enregistrées », « 1 correction avec un motif… », « 1 élément non vérifié : pas enregistré. »'],
  ['im11','Touche « Voir l’inventaire ».','« Import d’aujourd’hui » ; Pierre : En ville 12 M ; Accélérateurs › Construction › 1 h : 1 300.'],
  ['im12','Touche « Importer » en haut de Ma ville.','L’import reprend à l’étape 1, vide, prêt pour un nouvel import.'],
  ['im13','Pendant un import, touche « ‹ Ma ville ».','Retour à l’Inventaire.',['demo','#import']]
 ]},
 {g:'Ma ville · Commandants',p:['demo','#ma-ville-commandants'],l:[
  ['cm1','Regarde la liste.','8 commandants : initiale, nom, « Légendaire » (doré) ou « Épique » (violet), rôle, niveau et compétences (5-5-5-5).'],
  ['cm2','Touche les filtres Infanterie, Cavalerie, Archers, Rassemblement, Garnison, puis Tous.','La liste suit chaque filtre ; le filtre choisi est doré ; « Tous » remet les 8.'],
  ['cm3','Lis « À améliorer en priorité ».','Étiquette « Prévu · AJ-04 » ; 2 conseils numérotés, clairs.']
 ]},
 {g:'Ma ville · Équipements',p:['demo','#ma-ville-equipements'],l:[
  ['eq1','Regarde l’écran.','6 pièces avec leur rareté en couleur ; « Matériaux » : Cuir, Minerai, Ébène, Os de bête avec leur nombre.'],
  ['eq2','Touche chaque pièce.','Une fenêtre montre sa rareté et ses effets ; « Accessoires » : un emplacement vide.']
 ]},
 {g:'Ma ville · Armements',p:['demo','#ma-ville-armements'],l:[
  ['ar1','Regarde l’écran.','3 formations (Coin, Arc, Carré creux) ; Coin est choisie ; « Effets de la formation Coin » à côté.'],
  ['ar2','Touche Arc, puis Carré creux.','La formation choisie est encadrée en doré et ses effets s’affichent ; un effet inconnu affiche « — » en gris.']
 ]},
 {g:'Ma ville · tailles',p:['demo','#ma-ville-progression'],l:[
  ['mt1','Sur téléphone, ouvre chaque onglet de Ma ville et fais défiler.','Une colonne, rien ne dépasse à droite, rien n’est caché sous le menu ; en saisie rapide, la barre reste au-dessus du menu.'],
  ['mt2','Sur tablette en paysage ou sur PC.','Deux colonnes ; les onglets gardent une largeur fixe.']
 ]}
];
