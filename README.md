# Enigma JRD _Jeu de rôle de survie au tour par tour_

**Vous vous sentez beau, fort, puissant ?**

Alors vous vous trompez. Non, vous avez beau être un nain avec une masse impressionnante de graisse et de muscle, un elf à la haute stature et aux cheveux blonds, un vampire assoiffé de sang aux dents acérées, ou un humain au fort QI...vous êtes mal barré.

Dans enigmaJDR, tentez de trouver chaque jour la nourriture et l'eau nécessaire pour votre maigre subsistance au milieu d'un désert hostile peuplé d'immondes squelettes qui vous harcellent la nuit.
Tentez de survivre en formant des communautés solidaires autour de clans et protégez votre capitale.

Développez vos compétences habilement pour faire face à toutes les situations.
Apprenez des sorts pour vous déplacer mieux, être plus clairevoyant ou booster vos collectes de ressources.

Explorez un univers mystérieux où tout peut arriver...mais surtout, évitez de clamser.
Car vous vous retrouverez à la case départ et mal en point.


### Vous êtes un codeur ?
-----------------

C'est probablement pour ça que vous êtes là.
Oui, avant tout, enigmajdr est un tas de lignes de code que nous allons expliquer ici.
**Car le projet est open source et accessible à tous les petits génies et âmes de bonne volonté voulant apporter leur pierre à l'édifice.**

### technos utilisées:

D'abord c'est un projet WEB.
Le front-end est fait avec **[angular10+](https://angular.io/)** et le backend en **[nodejs](https://nodejs.org/en/)** avec **[express](https://expressjs.com/fr/)**.

> ### bon j'installe ça comment moi si je veux le tester chez moi ?

* C'est très simple. Tu télécharges le [repos](https://github.com/Math1987/enigma.git) et installe les dépendances depuis ton terminal _(à la racine du dossier enigma préalablement téléchargé)
(bon évidement je ne te fais pas l'offence de te demander d'installer au préalablement [nodejs](https://nodejs.org/en/) et [npm](https://www.npmjs.com/get-npm))_


```npm i```


* Il faut t'assurer d'avoir également installé **concurently & nodemon** 

```npm i -global concurrently nodemon```

* Ah oui il faut aussi que tu aies installé et activé **[mongodb](https://www.mongodb.com)**
(vu que tu es grand tu te débrouilleras très bien pour ça si c'est pas déja fait)

et voilà.
Il te reste juste à lancer le projet en mode développement: 

```npm run dev```

Ce qui se passe: 
_Il va compiler le dossier "api" (écrit en typescript parcequ'ici on ne rigole pas) en "js" dans le dossier dist.
Vu qu'angular aura au préalablement compilé le frontend ( avec ng --build nous y reviendrons plus tard), le site sera directement utilisable sur https://localhost:4001.
Oui par contre le certificat SSL est auto signé donc il faudra que tu dises à ton navigateur que oui il peut faire confiance à ce certificat.._

**<span style="color:red">!! MAIS ATTENTION !!</span>**
_Là tu es directement en lien avec la version prod du jeu !
Oui ça a un côté jouissif de jouer avec de vrais joueurs tout en faisant tourner le jeu sur sa machine en local, c'est émouvant.
Mais franchement inutile voir nuisible si tu veux tester sans pour autant entacher le jeu réel. D'autant plus que là tu es en lien avec l'API officielle du jeu qui tourne sur le serveur officiel. Donc si tu as fait une modif de l'API celle ci ne sera pas testable ici._

* Pour éviter ça la meilleur solution est encore d'utiliser angular.
Ouvre un autre terminal et tape simplement:

```ng serve```

Ouvre ton navigateur et rends-toi sur "http://localhost:4200"
Et là tu es dans un véritable environement de développement.
Tu peux modifier ce que tu veux et voir le rendu de tes magnifiques modifications directement sans impacter quoi que ce soit autre que ta propre machine.
C'est cool hein ?
Et si tu es convaincu que ce que tu as fait est bon.
Tu kill le process et tape un petit:

```ng build --prod```

Et là la magie d'angular et de l'armée de développeur surdiplômé et survitaminé de google fait son effet quasi instantanément: un joli petit dossier nommé "public" de données écrites en Hébreu ou en Chinois (enfin je crois ?) va se trouver miraculeusement dans le dossier "dist".

Alors tu sais ce qu'il te reste à faire.
Déjà tu peux vérifier que le changement à été opéré (s'il s'agit d'une modification côté frontend), en allant sur https://localhost:4001 et puis...
Tu l'envoies ici, sur github.

Et là notre équipe étudiera si ton amélioration est digne d'être implémentée dans le mystérieux jeu de EnigmaJDR. :)


Une petite remarque: 

Si tu travailles sur le frontend avec ton navigateur ouvert sur http://localhost:4200, 
Alors tu dois verrifier que le process de l'API tourne bien aussi depuis un autre terminal sur le port https://localhost:4001/api,
(on en avait parlé plus haut, la commande "npm run dev" par ex peut lancer le process...mais tu peux le faire aussi de manière plus old scool si tu ne souhaites pas recompiler le typscript en tapant simplement nodemon dist/index.js)
Bref...

EnigmaJDR est un projet fullstack en full JS passionnant et on pourrait en parler des heures.

Mais je vais simplement ici décrire brièvement la structure histoire de tenter d'éclairer un peu ta lanterne si tu es vraiment motivé pour participer à l'aventure et apporter ta lumière et ton énergie salvatrice à ce merveilleux projet. 

## Structure du projet
-----------------

### Déjà niveau **frontend**: 

Le dossier frontend se trouve dans src.
Là tu vois un dossier app et c'est là que ça se passe ;).
Il y a grosso modo 2 modules principaux lazy loadés.

Un pour la connexion et un pour le jeu.
(oui en fait si un joueur est déjà connecté il n'y a pas besoin de recharger le module de connexion, et inversement)

Le dossier shared:
Là il y a a boire et à manger.
Tout ce qui peut être partagé dans diverses composants. 
Des interfaces (pour un code safe et explicite), des classes ( à noter qu'on trouve dans les classes tout ce qui sert a afficher la vue 3D), les services (pour appel API) etc...

On utilise **[THREE JS](https://threejs.org/)** pour afficher la vue isométrique.

### Pour le **backend**
 
Tout se trouve dans le dossier api.
Le plus intéressant se situe sans doute au niveau du dosser Pattern.
C'est là que tous les éléments du jeu (plateau de jeu, nains, elfs, squelettes, arbres, reliques etc...) intéragissent. Je t'invite a te rendre sur l'objet index.pattern pour en savoir plus.

N'hésite pas à nous contacter pour toute question ou remarque !

Et hâte de voir quelles audacieuses features tu pourras nous soumettre.
@+, 

Math17
