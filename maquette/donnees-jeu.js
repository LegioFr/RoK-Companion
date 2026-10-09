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
