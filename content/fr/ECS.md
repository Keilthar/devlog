---
title: ECS
---

<style>
    p, li, div { text-align: justify; }
</style>

<!-- Tip -->
<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><p>Tip :</p></div>
            <a href="https://docs.unity3d.com/Packages/com.unity.entities@0.17/manual/index.html" target="_blank">Manuel officiel Unity ECS</a>
        </div>
        <div class="callout-content">
            <div class="callout-content-inner">
                <img src="/static/png/ECS/Unity_ECS.png" alt="Unity ECS" width="100%"/>
            </div>       
        </div>
    </blockquote>
</div>

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

*Je vais ici parler dans un contexte **Game Dev**, mais fondamentalement, c'est un sujet qui est transverse au métaverse (ouai j'ose le mot 😏) du développement : **<span style="color: steelblue;">l'orienté Object</span> VS <span style="color: steelblue;">l'orienté Data</span>**.*

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**Aux origines de la galère : le <span style="color: steelblue;">OOP</span> !**

Le **OOP (Object Oriented Programming)** dispose de cette incroyable force qu'il épouse à merveille les prédispositions de nos cerveaux mollassons : on **découpe nos concepts métier en objets**, qui portent à la fois des **propriétés** et des **méthodes/fonctions**. Chaque objet a droit à son **instance distincte** et il pourra donc être **autonome** dans son coin. Et on pourra ensuite lentement tomber dans l'enfer des **héritages** et des dépendances en cascade... mais c'est un autre sujet. 😌

Dans le cadre du jeu vidéo, cette approche est trèèèèèès attrayante. Parce que non seulement ça colle d'un point de vue découpage fonctionnel (un objet par joueur / ennemi / décors / UI...), mais ça colle aussi vachement bien d'un point de vue gameplay :
je veux créer plusieurs ennemis distincts qui attaquent mon joueur ? Hop, une instance d'objet par ennemi, chacun avec ses propres points de vie, son propre attack pattern, sa propre reconnaissance du terrain et potentiellement, résultante de tout ça : un comportement unique par ennemi !

Tous les gros moteurs de jeux ont donc adopté cette approche dans leur design de base et dans le choix du langage adossé :
- <span style="color: steelblue;">Unreal Engine</span> avec le <span style="color: steelblue;">C++</span>
- <span style="color: steelblue;">Unity</span> avec le <span style="color: steelblue;">C#</span>
- <span style="color: steelblue;">GODOT</span> avec du <span style="color: steelblue;">C#</span> + <span style="color: steelblue;">GDScript</span> (qui est une variante intéressante, plus modulaire autour d'un concept de composition/noeud).

Mais tout aussi flexible et adapté qu'est le POO pour le game design, il a un problème majeur : il scale très mal. A vouloir regrouper au sein d'un même objet à la fois les données et ses traitements, par design les objets deviennent des éléments extrêmement volatiles dont on ne sait pas à l'avance, ni ce qu'ils vont faire, ni la taille mémoire qu'ils vont occuper.

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <span style="color: orange;">-- La flexibilité est un compromis de performance --</span>
        <img src="/static/png/ECS/GameObject_Entity_Memory.png" alt="Comparaison mémoire GameObject vs Entity" width="100%"/>
        <a href="https://ilogos.biz/what-is-unitys-new-data-oriented-technology-stack-dots/" target="_blank">Source de l'image</a>
    </div>
    <div style="flex: 1;">

Cette nature indéfinie de l'objet oblige une architecture qui permet de manager n'importe quel élément qui lui serait attaché. Ne pouvant anticiper la structure de l'objet, sa création se fait à la volée avec un **rangement mémoire parcélaire** (ou en moins poétique : le **yolo mode**).

Travailler sur un objet nécessite alors de le reconstituer façon fil d'Ariane, en remontant à chaque section de mémoire où une partie de ses données est stockée.

Or les accès mémoires, c'est le coeur de la performance et ce scan incessant pour reconstituer les objets est un couperet brutal.

</div>
</div>


<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**Le saint sauveur : le <span style="color: steelblue;">DOD</span> !**

L'**ECS** (Entity Component System) est une architecture qui rentre dans le paradigme du **DOD** (Data Oriented Design). Dans le cadre de **Unity**, c'est même très clair, on parle de **DOTS** (Data Oriented Technology Stack). *Promis je m'arrête là avec les acronymes des enfers infernaux.* 😚



<div style="display: flex; gap: 20px; align-items: center;">
    <div style="flex: 1;">

L'ECS en soi n'est pas un concept nouveau. Si j'en crois <a href="https://en.wikipedia.org/wiki/Entity_component_system" target="_blank">Wikipédia</a>, la 1ère version d'une architecture similaire à l'ECS dans un jeu commercial remonte à **Thief : The Dark Project en 1998**.

L'essence de l'ECS : ne plus organiser le code autour d'une logique fonctionnelle, mais d'une logique qui vise à optimiser l'agencement de la donnée, aussi sommairement nommé le <a href="https://fr.wikipedia.org/wiki/Principe_de_localit%C3%A9_(informatique)" target="_blank">principe de localité</a>.
</div>
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Thief_The_Dark_Project_boxcover.jpg/250px-Thief_The_Dark_Project_boxcover.jpg" alt="Thief: The Dark Project - Trailer" />
    </div>

</div>



Son design en soi est relativement simple :
- on remplace le concept d'objet par celui d'**<span style="color: steelblue;">entity</span>**, qui n'est qu'un identifiant unique.
- à cette entité, on va lier des **<span style="color: steelblue;">components</span>**, qui ne sont que des conteneurs de données (des *structs*)
- on regroupe les entités qui disposent des mêmes composants dans des **<span style="color: steelblue;">archetypes</span>** : toutes les entités appartenant à un même archétype sont rangées de manière contiguë en mémoire
- on peut alors **<span style="color: steelblue;">query</span>** des groupes d'entités en filtrant par composant (comme on requêterait une base de données)
- au travers de **<span style="color: steelblue;">systems</span>** centralisés, on traitera la donnée requêtée en masse via un découpage en **<span style="color: steelblue;">chunks</span>** et une répartition sur du **<span style="color: steelblue;">multi-threading</span>**

<img src="/static/png/ECS/Unity_ECS_Concept.png" alt="Concept ECS Unity" width="100%"/>

Cette approche permet d'augmenter d'au moins un facteur (x10) les performances. Pour vous donner un ordre d'idée, à FPS (Frames Per Second) équivalent, avec une approche GameObject, je vais commencer à saturer le CPU vers **5 000 à 10 000 unités** sur Unity. Je n'ai aucun souci à gérer plus de **100 000 unités dans une implémentation ECS** (et je pourrais en gérer + si mon GPU ne rendait pas l'âme en parallèle).

C'est une architecture extrêmement puissante, qui a trouvé moult cas d'usage : simulation de foules, de trafic, de villes et de projectiles/particules, qu'on retrouve souvent dans des types de jeu tel que les sandbox/openworld, RTS ou autres MMO qui manipulent de grandes quantités d'objets non-statiques et pour lesquels le DOD fait des merveilles.
 
Mais vous remarquerez que cette architecture n'est pas utilisée partout... 👀

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**Un grand pouvoir implique...**

Il est un piège dans lequel il ne faut pas tomber : **la performance pour la performance**, ce bon vieux over-engineering ! (et bon sang que c'est dur de ne pas tomber dans ce piège quand on fait de l'ingénierie...).

S'il est vrai que <span style="color: orange;">-- La flexibilité est un compromis de performance --</span>, il est tout aussi vrai que <span style="color: orange;">-- La performance est un compromis de flexibilité ET de productivité --</span>.

**La performance n'est que rarement un objectif** en soi (à part si vous vous appelez Google/Amazon et que vous devez répondre à des milliards de requêtes utilisateurs à la seconde). Non elle est surtout un **pré-requis minimal d'acceptation de l'utilisateur** :
- si la performance est trop dégradée, l'expérience utilisateur le sera aussi et il partira
- le corollaire n'est par contre pas vrai : être trop performant n'améliorera pas l'expérience perçue côté utilisateur et vous aurez dépensé temps/argent en pure perte

L'ECS étant une réponse de performance, il est par nature **plus complexe et peu flexible au changement**. Il est beaucoup plus long à mettre en place, impose des restrictions sur le type de données et globalement, rallonge drastiquement les temps de développement, même pour des features simples.

L'industrie a choisi comme toujours l'approche la plus pragmatique à l'utilisation de l'ECS et de l'OOP : l'**hybride**. Savoir choisir ce qui mérite une approche ECS pour la performance VS choisir l'approche OOP quand le fonctionnel et l'itération priment.

Mais si l'industrie a longtemps du traité l'ECS et l'OOP comme deux mondes séparés, une nouvelle voie s'ouvre. A la  <a href="https://youtu.be/BtObK0arD_M" target="_blank">GDC de mars 2026</a>, Unity a décidé de trancher le débat une bonne fois pour toute : pourquoi ne pas **fusionner** les 2 approches ?

<img src="https://pbs.twimg.com/media/HCq5KsqaUAcM-dR?format=jpg&name=large" alt="GDC Unity 2026" width="100%"/>

L'ECS deviendra un package core du moteur (et non plus un add-on à installer). Les entités deviennent le backend de tout le moteur, à la manière d'un [**Bevy**](https://bevy.org/) : les GameObjects ne disparaissent pas, ils deviennent une couche de confort par dessus les entités, le moteur prennant la main pour faire la conversion. La force du design OOP par dessus, la puissance de l'ECS par dessous.
<span style="color: orange;">-- L'ECS ne sera plus un choix, mais le socle. Le GameObject ne sera plus une alternative, mais une interface. --</span>

En d'autres termes, l'approche hybride dont je parlais plus haut ne sera plus un compromis d'architecture, mais le mode de fonctionnement par défaut du moteur. Vous voulez du prototypage rapide ? Vous restez au niveau GameObject. Vous voulez de la performance brute ? Le moteur vous permettra de basculer votre architecture en GameObjects sous l'ECS et de profiter de ses options. Même données, même moteur, mais deux mondes en un.

Et je vous avoue que j'ai très hâte que ce nouveau paradigme prenne forme. 😎
