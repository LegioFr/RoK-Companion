/* Données du jeu utilisées par la maquette. Source, date et statut de chaque donnée : references/donnees-jeu.md.
   Une donnée « non vérifiée » vient d'une source extérieure et n'a pas encore été comparée à une capture du jeu. */
window.RC_JEU={
  /* Protection des ressources en ville par niveau de réserve (« Storehouse », nom du jeu : Réserve) : [nourriture, bois, pierre, or], en unités.
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
  /* Coffres « Choisissez un » (niveaux 1 à 5) et packs de ressources (au hasard), avec la couleur du fond de leur case dans l'Inventaire.
     Contenus lus dans le panneau de droite du jeu sur les captures de Mickaël du 10 oct. 2026 (vu:true) : coffres niveaux 1 à 5, packs B niv. 1,
     C niv. 1 et niv. 2. Pack A niv. 1 et pack niv. 3 : wiki seul (riseofkingdoms.fandom.com, page « Items/Resource Pack », révision du 6 mai 2024,
     lue par l'API le 10 oct. 2026), non vérifiés. Les coffres du wiki (page « Items/"Pick One" Resource Chest », révision du 24 mars 2023)
     donnent les mêmes nombres que le jeu. Aucun niveau 6 de coffre ni niveau 4 de pack trouvé (recherche du 10 oct. 2026). */
  coffres:{
    source:'captures de Mickaël du 10 oct. 2026 et wiki riseofkingdoms.fandom.com (API, 10 oct. 2026)',
    choix:[{id:'c1',nom:'Niveau 1',couleur:'vert',food:10000,wood:10000,stone:7500,gold:3000,vu:true},
      {id:'c2',nom:'Niveau 2',couleur:'vert',food:50000,wood:50000,stone:37500,gold:15000,vu:true},
      {id:'c3',nom:'Niveau 3',couleur:'bleu',food:150000,wood:150000,stone:112500,gold:50000,vu:true},
      {id:'c4',nom:'Niveau 4',couleur:'bleu',food:500000,wood:500000,stone:375000,gold:200000,vu:true},
      {id:'c5',nom:'Niveau 5',couleur:'violet',food:1500000,wood:1500000,stone:1125000,gold:600000,vu:true}],
    packs:[{id:'pA',nom:'A niv. 1',couleur:'gris',food:1000,wood:1000,vu:false},
      {id:'pB',nom:'B niv. 1',couleur:'gris',food:1000,wood:1000,stone:750,vu:true},
      {id:'pC',nom:'C niv. 1',couleur:'gris',food:1000,wood:1000,stone:750,gold:500,vu:true},
      {id:'p2',nom:'niv. 2',couleur:'vert',food:10000,wood:10000,stone:7500,gold:5000,vu:true},
      {id:'p3',nom:'niv. 3',couleur:'bleu',food:100000,wood:100000,stone:100000,gold:100000,vu:false}]
  },
  /* Points d'action : ce qu'ils rapportent (demande de Mickaël du 2026-10-10). Wiki riseofkingdoms.fandom.com, lu par l'API le 10 oct. 2026,
     non vérifié dans le jeu : pages « Barbarians » (révision du 2024-11-07), « Resources » (2025-05-31), « VIP » (2026-08-02),
     « Category:Peacekeeping » (2023-04-04). Détail : references/donnees-jeu.md. */
  pa:{
    verifie:false,
    cout:50,          // une attaque de barbares
    chaine:2,         // −2 à chaque attaque enchaînée sans rentrer en ville…
    chaineMax:10,     // …jusqu'à −10 (40 points)
    talent:10,        // talent « Insight » de l'arbre Maintien de la paix : −10 de plus (nom français à vérifier)
    recharge:45,      // 1 point toutes les 45 s environ, sans bonus
    plafond:1000,     // la recharge s'arrête à 1 000 (les potions peuvent dépasser)
    vipRecharge:[1,1,1.05,1.05,1.05,1.1,1.1,1.1,1.15,1.15,1.15,1.15,1.2,1.2,1.25,1.3,1.35,1.35,1.35], // VIP 0 à 18
    vipPlafond:{15:100,16:200,17:350,18:400},
    /* EXP gagnée par chaque commandant de la marche (le principal et le secondaire), sans bonus ; le butin donne en plus des tomes du savoir
       pour la même EXP. Niveaux 1 à 25 : tableau du wiki ; 26 à 40 : déduit du nombre de tomes du butin (100 EXP × niveau), non vérifié. */
    exp:function(n){return n<=10?106*n:100*n;},
    nivMax:40
  },
  /* Objets des onglets Boosts, Équipement, Attirail et Autre de l'Inventaire (2026-10-10).
     vu:1 = objet vu dans le jeu sur les captures de Mickaël du 10 oct. 2026 (nom en n, lu dans le panneau de droite quand il l'a touché).
     Sans vu : wiki riseofkingdoms.fandom.com (pages « Items/… », lues par l'API le 10 oct. 2026), non vérifié.
     nv:1 = nom pas encore lu dans le jeu (proposé par Claude, à vérifier). c = couleur du fond de la case :
     g gris (normal), v vert (avancé), b bleu (élite), p violet (épique), o orange (légendaire).
     Types de tuile : duree (h en heures), troupes, mat (5 qualités, 4 se combinent en 1 de la qualité au-dessus), qual (nombre par qualité),
     qual3 (3 formes par qualité), valeur (val par objet), compte. Les quantités de Mickaël ne sont pas ici : elles restent dans sa version réelle. */
  objets:{
    source:'captures de Mickaël du 10 oct. 2026 (noms du jeu) et wiki riseofkingdoms.fandom.com (API, 10 oct. 2026)',
    qualites:[['g','normal','normaux','normales'],['v','avancé','avancés','avancées'],['b','élite','élites','élites'],['p','épique','épiques','épiques'],['o','légendaire','légendaires','légendaires']],
    onglets:{
      boosts:[
        {id:'attaque',nom:'Attaque +5 %',icone:'t-swords',type:'duree',glow:'#ef8a7422',info:'Amélioration d’attaque : +5 % d’attaque pour toutes les troupes (+10 % pour la version avancée, d’après le wiki).',items:[
          {id:'att12',l:'12 h',h:12,c:'v',vu:1,n:'Amélioration d’attaque - 12 heures'},{id:'att24',l:'24 h',h:24,c:'b',vu:1,n:'Amélioration d’attaque - 24 heures'},{id:'att24a',l:'24 h, +10 %',h:24}]},
        {id:'defense',nom:'Défense +5 %',icone:'i-shield2',type:'duree',glow:'#8db6f222',info:'Amélioration de défense : +5 % de défense pour toutes les troupes (+10 % pour la version avancée, d’après le wiki).',items:[
          {id:'def12',l:'12 h',h:12,c:'v',vu:1,n:'Amélioration de défense - 12 heures'},{id:'def24',l:'24 h',h:24,c:'b',vu:1,n:'Amélioration de défense - 24 heures'},{id:'def24a',l:'24 h, +10 %',h:24}]},
        {id:'troupes',nom:'Troupes',icone:'n-banners',type:'troupes',glow:'#d8b24c22',info:'Réserves : capacité d’entraînement en plus, au prochain entraînement. Expansions : capacité d’unités de tous les commandants pendant 4 h.',items:[
          {id:'res5',l:'Réserve niv. 5 (+20 000)',cap:20000,c:'o',vu:1,n:'Réserve Niveau 5'},{id:'res6',l:'Réserve niv. 6 (+50 000)',cap:50000,c:'o',vu:1,n:'Réserve Niveau 6'},
          {id:'exp25',l:'Expansion basique (+25 %, 4 h)',c:'b',vu:1,n:'Expansion basique d’armée'},{id:'exp50',l:'Expansion avancée (+50 %, 4 h)',c:'p',vu:1,n:'Expansion avancée d’armée'}]}],
      equip:[
        {id:'cuir',nom:'Cuir',icone:'n-leather',type:'mat',items:[{id:'cuir_g',c:'g',vu:1},{id:'cuir_v',c:'v',vu:1},{id:'cuir_b',c:'b',vu:1},{id:'cuir_p',c:'p',vu:1,n:'Cuir (ÉPIQUE)'},{id:'cuir_o',c:'o'}]},
        {id:'fer',nom:'Minerai de fer',icone:'n-ore',type:'mat',items:[{id:'fer_g',c:'g',vu:1},{id:'fer_v',c:'v',vu:1},{id:'fer_b',c:'b',vu:1,n:'Minerai de fer (ÉLITE)'},{id:'fer_p',c:'p'},{id:'fer_o',c:'o'}]},
        {id:'ebene',nom:'Ébène',icone:'n-ebony',type:'mat',items:[{id:'ebene_g',c:'g',vu:1},{id:'ebene_v',c:'v',vu:1},{id:'ebene_b',c:'b',vu:1,n:'Ébène (ÉLITE)'},{id:'ebene_p',c:'p',vu:1},{id:'ebene_o',c:'o'}]},
        {id:'os',nom:'Os d’animal',icone:'n-bone',type:'mat',items:[{id:'os_g',c:'g',vu:1},{id:'os_v',c:'v',vu:1},{id:'os_b',c:'b',vu:1,n:'Os d’animal (ÉLITE)'},{id:'os_p',c:'p',vu:1},{id:'os_o',c:'o'}]},
        {id:'plans',nom:'Plans',icone:'n-scroll',type:'qual',info:'Un plan sert à forger la pièce qu’il dessine (ex. « Plan de « Rétribution de la Légion de l’Ombre » », légendaire).',items:[
          {id:'plan_g',c:'g',vu:1},{id:'plan_v',c:'v',vu:1},{id:'plan_b',c:'b',vu:1},{id:'plan_p',c:'p',vu:1},{id:'plan_o',c:'o',vu:1}]},
        {id:'fragments',nom:'Fragments de plan',icone:'n-copy',type:'qual',info:'30 fragments du même plan se combinent en 1 plan (jeu : « Combinez 30 fragments pour obtenir un plan »).',items:[
          {id:'frag_g',c:'g'},{id:'frag_v',c:'v',vu:1},{id:'frag_b',c:'b',vu:1},{id:'frag_p',c:'p',vu:1},{id:'frag_o',c:'o'}]},
        {id:'coffres_eq',nom:'Coffres à ouvrir',icone:'p-chest',type:'compte',carte:1,info:'Matériaux ou fragments de plan.',items:[
          {id:'cme_g',grp:'Matériaux',l:'Matériaux (pièce normale)',c:'g',vu:1,n:'Coffre de matériaux d’équipement'},{id:'cme_v',grp:'Matériaux',l:'Matériaux (pièce avancée)',c:'v',vu:1,nv:1},
          {id:'cmc_g',grp:'Matériaux',l:'Matériau normal au choix',c:'g',vu:1,n:'Coffre au choix de matériau d’équipement'},{id:'cmc_v',grp:'Matériaux',l:'Matériau avancé au choix',c:'v',vu:1,nv:1},
          {id:'cmc_b',grp:'Matériaux',l:'Matériau élite au choix',c:'b',vu:1,nv:1},{id:'cmc_p',grp:'Matériaux',l:'Matériau épique au choix',c:'p',vu:1,nv:1},{id:'cmc_o',grp:'Matériaux',l:'Matériau légendaire au choix',c:'o',vu:1,nv:1},
          {id:'lot_lo',grp:'Matériaux',l:'Lot de la Légion de l’Ombre',c:'v',vu:1,n:'Lot de matériau de la Légion de l’Ombre'},
          {id:'cfp_v',grp:'Fragments de plan',l:'Fragment de plan avancé au choix',c:'v',vu:1,n:'Coffre au choix de fragment de plan'},{id:'cfp_b',grp:'Fragments de plan',l:'Fragment de plan élite au choix',c:'b',vu:1},
          {id:'cfp_p',grp:'Fragments de plan',l:'Fragment de plan épique au choix',c:'p',vu:1},{id:'cfp_o',grp:'Fragments de plan',l:'Fragment de plan légendaire au choix',c:'o',vu:1}]},
        {id:'pieces',nom:'Pièces forgées',icone:'n-armor',type:'qual',fem:1,info:'Les pièces d’équipement de ton inventaire, portées ou non (le portrait du commandant qui la porte est dans le coin).',items:[
          {id:'piece_g',c:'g',vu:1},{id:'piece_v',c:'v',vu:1},{id:'piece_b',c:'b',vu:1},{id:'piece_p',c:'p',vu:1},{id:'piece_o',c:'o'}]}],
      attirail:[
        {id:'cform',nom:'Coffres au choix de formation',icone:'p-chest',type:'compte',info:'Une pièce d’attirail d’élite, épique ou légendaire au hasard, pour la formation de ton choix.',items:[
          {id:'cform',l:'Coffre au choix de formation',c:'b',vu:1,n:'Coffre au choix de formation'}]}],
      autre:[
        {id:'sculpt_choix',nom:'Sculptures au choix',icone:'i-crown',type:'qual',fem:1,top:1,glow:'#e6a64022',info:'S’échangent contre une sculpture de n’importe quel commandant de même rareté que tu possèdes (sauf exceptions).',items:[
          {id:'sch_v',c:'v',vu:1,n:'Sculpture de commandant avancé'},{id:'sch_b',c:'b',vu:1,n:'Sculpture de commandant d’élite'},{id:'sch_p',c:'p',vu:1,n:'Sculpture de commandant épique'},{id:'sch_o',c:'o',vu:1,n:'Sculpture de commandant légendaire'}]},
        {id:'sculpt_cmd',nom:'Sculptures de commandants',icone:'i-person',type:'qual',fem:1,top:1,glow:'#ad7be622',info:'Sculptures à un nom (ex. « Sculpture de Jules César ») : invoquent le commandant ou montent ses compétences. Compte-les par rareté.',items:[
          {id:'scm_v',c:'v',vu:1},{id:'scm_b',c:'b',vu:1},{id:'scm_p',c:'p',vu:1},{id:'scm_o',c:'o',vu:1}]},
        {id:'stellaires',nom:'Sculptures de lumière d’étoile',icone:'n-star',type:'qual3',fem:1,top:1,carte:1,glow:'#f3d98222',info:'Montent le niveau d’étoiles des commandants de même rareté. Bénie : bonus de chance en plus. Lot : beaucoup d’expérience.',items:[
          {id:'ste_o_s',q:'o',f:'simples',c:'o',vu:1,n:'Sculpture de lumière d’étoile éblouissante'},{id:'ste_o_b',q:'o',f:'bénies',c:'o',vu:1,n:'Sculpture de lumière d’étoile éblouissante bénie'},{id:'ste_o_l',q:'o',f:'lots',c:'o',vu:1,n:'Lot de sculptures de lumière d’étoile éblouissantes'},
          {id:'ste_p_s',q:'p',f:'simples',c:'p',vu:1,nv:1},{id:'ste_p_b',q:'p',f:'bénies',c:'p',vu:1,nv:1},{id:'ste_p_l',q:'p',f:'lots',c:'p',vu:1,nv:1},
          {id:'ste_b_s',q:'b',f:'simples',c:'b',vu:1,nv:1},{id:'ste_b_b',q:'b',f:'bénies',c:'b',vu:1,nv:1},{id:'ste_b_l',q:'b',f:'lots',c:'b',vu:1,nv:1},
          {id:'ste_v_s',q:'v',f:'simples',c:'v',vu:1,nv:1},{id:'ste_v_b',q:'v',f:'bénies',c:'v',vu:1,nv:1},{id:'ste_v_l',q:'v',f:'lots',c:'v',vu:1,nv:1}]},
        {id:'coffres_scm',nom:'Coffres de sculptures',icone:'p-chest',type:'compte',glow:'#e6a64022',info:'À ouvrir : des sculptures de commandants.',items:[
          {id:'tresor_reine',l:'Trésor de la Reine guerrière',c:'o',vu:1,n:'Trésor de la Reine guerrière'},{id:'coffre_scm',l:'Coffre de sculpture de commandant (au choix)',c:'o',vu:1,n:'Coffre de sculpture de commandant'}]},
        {id:'tomes',nom:'Tomes du savoir',icone:'n-book',type:'valeur',unite:'EXP',carte:1,glow:'#8db6f222',info:'Expérience pour tes commandants.',items:[
          {id:'xp1',l:'100 EXP',val:100,c:'v',vu:1,n:'Tome du savoir niv. 1'},{id:'xp2',l:'500 EXP',val:500,c:'b',vu:1},{id:'xp3',l:'1 000 EXP',val:1000,c:'p',vu:1},{id:'xp4',l:'5 000 EXP',val:5000,c:'p',vu:1},
          {id:'xp5',l:'10 000 EXP',val:10000,c:'p',vu:1},{id:'xp6',l:'20 000 EXP',val:20000,c:'o',vu:1},{id:'xp7',l:'50 000 EXP',val:50000,c:'o',vu:1}]},
        {id:'cles',nom:'Clés',icone:'i-lock',type:'compte',info:'Pour les coffres de la taverne.',items:[
          {id:'cle_ar',l:'Clé en argent',c:'p',vu:1,n:'Clé en argent'},{id:'cle_or',l:'Clé en or',c:'o',vu:1,n:'Clé en or'},
          {id:'cle_cr',l:'Clé de cristal (équipement)',c:'o',vu:1,n:'Clé de cristal'},{id:'cle_sv',l:'Clé de souverain (événements)',c:'o',vu:1,n:'Clé de souverain'}]},
        {id:'pa',nom:'Points d’action',icone:'t-flask',type:'valeur',unite:'points',carte:1,/* en dernier : tuile sur toute la largeur, place pour le calcul */glow:'#3ecf8e22',info:'Pour les barbares, les forts et certains événements.',items:[
          {id:'pa50',l:'50',val:50,c:'v',vu:1,n:'Récupération de points d’action urgente'},{id:'pa100',l:'100',val:100,c:'v',vu:1},{id:'pa500',l:'500',val:500,c:'b',vu:1},{id:'pa1000',l:'1 000',val:1000,c:'p',vu:1}]},
        {id:'constr',nom:'Château et tours de guet',icone:'i-keep',type:'compte',petit:1,vals:1,items:[
          {id:'livre_all',l:'Livre d’alliance (château)',c:'v',vu:1,n:'Livre d’alliance'},{id:'fleche_res',l:'Flèche de résistance (tours de guet)',c:'v',vu:1,n:'Flèche de résistance'}]},
        {id:'migration',nom:'Migration',icone:'n-map',type:'compte',petit:1,info:'Pour changer de royaume (immigration).',items:[
          {id:'passeport',l:'Page de passeport',c:'o',vu:1,n:'Page de passeport'}]}]
    }
  },
  /* Accélérateurs : durées en minutes (même étude). Les quatre types spécialisés vont de 1 min à 15 h ; l'universel en plus 24 h, 3 j, 7 j, 30 j.
     Durées vues sur les captures : 1 à 60 min, 3 h, 8 h, 15 h (pas pour chaque type) ; 24 h et plus : wiki et calculateur seulement (non vérifié). */
  accelerateurs:{
    source:'wiki riseofkingdoms.fandom.com et calculateur bulbaritos.com (6 oct. 2026), captures de Mickaël du 6 oct. 2026',
    specialises:[1,5,10,15,30,60,180,480,900],universel:[1,5,10,15,30,60,180,480,900,1440,4320,10080,43200],vues:[1,5,10,15,30,60,180,480,900]
  },
  /* Bâtiments à niveau du jeu (1 à 25), rangés comme dans le menu de construction : wiki riseofkingdoms.fandom.com, page « Buildings »
     et pages « Buildings/…/Requirements » (lues le 9 oct. 2026). Fermes, scieries, carrières, mines d'or et hôpitaux : 4 chacun,
     débloqués aux niveaux d'Hôtel de ville indiqués (page « City Hall/Requirements », révision du 4 janv. 2026).
     Sans niveau, donc pas suivis (noms du jeu, captures de Mickaël du 9 oct. 2026) : Forgeron, Hutte de bâtisseur, Tableau d'affichage,
     Poste de messagerie, Monument, Magasin, Amphithéâtre de la sagesse. Nouveaux bâtiments vus dans son menu, absents du wiki :
     Forum d'état, Musée, Mine de cristal, Centre de recherche de cristal (niveaux inconnus). Groupes : noms du menu du jeu (Économique, Militaire). */
  batiments:{
    source:'wiki riseofkingdoms.fandom.com (pages « Buildings », lues le 9 oct. 2026)',
    groupes:[['Économique',['ferme','scierie','carriere','mine','academie','entrepot','alliance','comptoir']],
      ['Militaire',['caserne','tir','ecurie','siege','hopital','eclaireurs','taverne','chateau']],
      ['Autres',['mur','tourguet']],
      ['Saison de KvK',['forum','minecristal','cristalrech'],'Bâtiments de la saison en cours. La mine et le centre de recherche de cristal sont retirés à la fin de la saison (guides de joueurs, non officiel).']],
    instances:{ferme:[1,3,6,9],scierie:[2,5,8,11],carriere:[1,7,10,13],mine:[10,12,14,16],hopital:[1,4,9,15]}
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
    {id:'ville',t:'Ressources de la ville',d:'Ramasser fermes, moulins à bois, carrières et mines d’or'},
    {id:'recolte',t:'Marches en récolte',d:'Toutes les marches libres envoyées sur la carte'},
    {id:'pa',t:'Points d’action',d:'Les dépenser sur les barbares avant qu’ils plafonnent'},
    {id:'canyon',t:'Canyon du crépuscule',d:'Les combats gratuits du jour'},
    {id:'lycee',t:'Amphithéâtre de la sagesse',d:'Le questionnaire du jour'},
    {id:'marchand',t:'Marchand mystérieux',d:'Regarder ses offres quand il est là'},
    {id:'evts',t:'Événements en cours',d:'Récupérer les récompenses quotidiennes'}
  ]
};
