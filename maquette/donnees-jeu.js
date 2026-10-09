/* Données du jeu utilisées par la maquette. Source, date et statut de chaque donnée : references/donnees-jeu.md.
   Une donnée « non vérifiée » vient d'une source extérieure et n'a pas encore été comparée à une capture du jeu. */
window.RC_JEU={
  /* Protection des ressources en ville par niveau d'entrepôt : [nourriture, bois, pierre, or], en unités.
     Niveau 22 : l'or (500 K) est plus bas qu'au niveau 21 dans la source, sans doute une faute de frappe. */
  entrepot:{
    source:'riseofkingdomsguides.com, page « Storehouse » (mise à jour du 2 janv. 2026, consultée le 9 oct. 2026)',verifie:false,
    niveaux:{1:[300000,300000,225000,150000],2:[320000,320000,225000,160000],3:[350000,350000,262500,175000],4:[380000,380000,285000,190000],
      5:[410000,410000,307500,205000],6:[440000,440000,330000,220000],7:[470000,470000,352500,235000],8:[500000,500000,375000,250000],
      9:[525000,525000,393800,262500],10:[550000,550000,412500,275000],11:[600000,600000,450000,300000],12:[650000,650000,487500,325000],
      13:[700000,700000,525000,350000],14:[750000,750000,562500,375000],15:[800000,800000,600000,400000],16:[850000,850000,637500,425000],
      17:[900000,900000,675000,450000],18:[950000,950000,712500,475000],19:[1000000,1000000,750000,500000],20:[1100000,1100000,825000,550000],
      21:[1200000,1200000,900000,600000],22:[1400000,1400000,1050000,500000],23:[1500000,1500000,1130000,750000],24:[1500000,1500000,1130000,750000],
      25:[2500000,2500000,2500000,2500000]}
  },
  /* Prérequis et coût de chaque niveau d'Hôtel de ville : pre = [[bâtiment, niveau]], cout = [nourriture, bois, pierre, or], duree sans bonus.
     Deux sources concordantes : riseofkingdomsguides.com (2 janv. 2026) et le wiki riseofkingdoms.fandom.com, page
     « Buildings/City Hall/Requirements » (révision du 4 janv. 2026), consultées le 9 oct. 2026. Non vérifié sur une capture du jeu.
     Seul écart entre les deux : la durée du niveau 10 (1 j ou 22 h). */
  hdv:{
    source:'riseofkingdomsguides.com (2 janv. 2026) et wiki riseofkingdoms.fandom.com (4 janv. 2026), consultés le 9 oct. 2026',verifie:false,
    niveaux:{
      2:{pre:[],cout:[3500,3500,0,0],duree:'2 s'},3:{pre:[['mur',2]],cout:[6500,6500,0,0],duree:'5 min'},
      4:{pre:[['mur',3]],cout:[11800,11800,0,0],duree:'20 min'},5:{pre:[['mur',4],['hopital',4]],cout:[21300,21300,0,0],duree:'1 h'},
      6:{pre:[['mur',5],['eclaireurs',5]],cout:[36300,36300,12000,0],duree:'2 h'},7:{pre:[['mur',6],['entrepot',6]],cout:[54400,54400,19200,0],duree:'5 h'},
      8:{pre:[['mur',7],['caserne',7]],cout:[81800,81800,30800,0],duree:'10 h'},9:{pre:[['mur',8],['alliance',8]],cout:[122800,122800,49200,0],duree:'15 h'},
      10:{pre:[['mur',9],['academie',9]],cout:[184300,184300,78700,0],duree:'22 h à 1 j'},11:{pre:[['mur',10],['hopital',10]],cout:[277500,277500,120000,0],duree:'1 j 6 h'},
      12:{pre:[['mur',11],['entrepot',11]],cout:[417500,417500,180000,0],duree:'1 j 16 h'},13:{pre:[['mur',12],['tir',12]],cout:[627500,627500,270000,0],duree:'2 j 2 h'},
      14:{pre:[['mur',13],['alliance',13],['comptoir',13]],cout:[942500,942500,405000,0],duree:'2 j 12 h'},15:{pre:[['mur',14],['eclaireurs',14]],cout:[1400000,1400000,607500,0],duree:'2 j 22 h'},
      16:{pre:[['mur',15],['academie',15]],cout:[2100000,2100000,912500,0],duree:'4 j'},17:{pre:[['mur',16],['hopital',16]],cout:[3200000,3200000,1400000,0],duree:'4 j 20 h'},
      18:{pre:[['mur',17],['entrepot',17]],cout:[4800000,4800000,2100000,0],duree:'5 j 20 h'},19:{pre:[['mur',18],['ecurie',18]],cout:[7200000,7200000,3100000,0],duree:'7 j'},
      20:{pre:[['mur',19],['alliance',19]],cout:[10800000,10800000,4700000,0],duree:'8 j 6 h'},21:{pre:[['mur',20],['academie',20]],cout:[16200000,16200000,7000000,0],duree:'11 j'},
      22:{pre:[['mur',21],['hopital',21]],cout:[24300000,24300000,10600000,0],duree:'17 j 3 h'},23:{pre:[['mur',22],['entrepot',22]],cout:[36500000,36500000,15900000,0],duree:'23 j 23 h'},
      24:{pre:[['mur',23],['siege',23]],cout:[54800000,54800000,24000000,0],duree:'36 j'},
      25:{pre:[['mur',24],['comptoir',24]],cout:[82200000,82200000,36000000,0],plus:'1 Plan de maître',duree:'126 j 8 h'}}
  },
  /* Caisses à contenu fixe, en unités (étude B03 du 6 oct. 2026 : wiki riseofkingdoms.fandom.com et 15 captures de Mickaël).
     « vues » = tailles vues sur ses captures ; les autres viennent du wiki seul (non vérifiées). */
  caisses:{
    source:'wiki riseofkingdoms.fandom.com (API, consulté le 6 oct. 2026) et captures de Mickaël du 6 oct. 2026',
    food:{tailles:[1000,10000,50000,150000,500000,1500000,5000000],vues:'toutes'},
    wood:{tailles:[1000,10000,50000,150000,500000,1500000,5000000],vues:'toutes'},
    stone:{tailles:[750,7500,37500,112500,375000,1125000,3750000],vues:'toutes'},
    gold:{tailles:[500,3000,15000,50000,200000,600000,2000000],vues:[500,3000,15000,50000,200000]},
    gems:{tailles:[5,10,50,100,200,500,650,1000,2000],vues:[10]}
  },
  /* Accélérateurs : durées en minutes (même étude). Les quatre types spécialisés vont de 1 min à 15 h ; l'universel en plus 24 h, 3 j, 7 j, 30 j.
     Durées vues sur les captures : 1 à 60 min, 3 h, 8 h, 15 h (pas pour chaque type) ; 24 h et plus : wiki et calculateur seulement (non vérifié). */
  accelerateurs:{
    source:'wiki riseofkingdoms.fandom.com et calculateur bulbaritos.com (6 oct. 2026), captures de Mickaël du 6 oct. 2026',
    specialises:[1,5,10,15,30,60,180,480,900],universel:[1,5,10,15,30,60,180,480,900,1440,4320,10080,43200],vues:[1,5,10,15,30,60,180,480,900]
  },
  /* Bâtiments ajoutés le 9 oct. 2026 parce qu'ils sont des prérequis de l'Hôtel de ville. Noms français proposés par Claude : à vérifier dans le jeu. */
  nomsAVerifier:['eclaireurs','alliance','comptoir'],
  /* Réinitialisation quotidienne : 2 h du matin heure de France (Mickaël, 9 oct. 2026), soit minuit UTC. */
  reset:{heureUTC:0,source:'Mickaël, 9 oct. 2026'},
  /* Routine du jour : liste proposée par Claude le 9 oct. 2026, noms à vérifier dans le jeu ; Mickaël la corrige. */
  routine:[
    {id:'vip',t:'Coffre VIP quotidien',d:'Coffre gratuit et points VIP du jour'},
    {id:'taverne',t:'Taverne',d:'Coffres gratuits (argent, et or quand il est disponible)'},
    {id:'missions',t:'Missions quotidiennes',d:'Assez de missions pour ouvrir les coffres de points d’activité'},
    {id:'alliance',t:'Alliance',d:'Aider, donner à la technologie, ouvrir les cadeaux'},
    {id:'files',t:'Files toujours occupées',d:'Construction, recherche et entraînement lancés'},
    {id:'ville',t:'Ressources de la ville',d:'Ramasser fermes, scieries, carrières et mines d’or'},
    {id:'recolte',t:'Marches en récolte',d:'Toutes les marches libres envoyées sur la carte'},
    {id:'pa',t:'Points d’action',d:'Les dépenser sur les barbares avant qu’ils plafonnent'},
    {id:'canyon',t:'Canyon du crépuscule',d:'Les combats gratuits du jour'},
    {id:'lycee',t:'Lycée de la sagesse',d:'Le questionnaire du jour'},
    {id:'marchand',t:'Marchand mystérieux',d:'Regarder ses offres quand il est là'},
    {id:'evts',t:'Événements en cours',d:'Récupérer les récompenses quotidiennes'}
  ]
};
