---
title: ðŸ’¡ 1 - ECS, le pourquoi
---

<style>
    p, li, div { text-align: justify; }
</style>

<!-- Tip -->
<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <a href="https://docs.unity3d.com/Packages/com.unity.entities@0.17/manual/index.html" target="_blank">Manuel officiel Unity ECS</a>
        </div>
        <div class="callout-content">
            <div class="callout-content-inner">
                <a href="/static/png/ECS/Unity_ECS.png" target="_blank"><img src="/static/png/ECS/Unity_ECS.png" alt="Unity ECS" width="100%"/></a>
            </div>       
        </div>
    </blockquote>
</div>

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

*Je vais ici parler dans un contexte **Game Dev**, mais fondamentalement, c'est un sujet qui est transverse au mÃ©taverse (ouai j'ose le mot ðŸ˜) du dÃ©veloppement : **<span style="color: steelblue;">l'orientÃ© Object</span> VS <span style="color: steelblue;">l'orientÃ© Data</span>**.*

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**Aux origines de la galÃ¨re : le <span style="color: steelblue;">OOP</span> !**

Le **OOP (Object Oriented Programming)** dispose de cette incroyable force qu'il Ã©pouse Ã  merveille les prÃ©dispositions de nos cerveaux mollassons :
- on **dÃ©coupe nos concepts mÃ©tier en objets**
- ils portent Ã  la fois des **propriÃ©tÃ©s** et des **mÃ©thodes/fonctions**
- chaque objet a droit Ã  son **instance distincte** et il pourra donc Ãªtre **autonome** dans son coin
- et on pourra ensuite lentement tomber dans l'enfer des **hÃ©ritages** et des dÃ©pendances en cascade... mais c'est un autre sujet. ðŸ˜Œ

Dans le cadre du jeu vidÃ©o, cette approche est trÃ¨Ã¨Ã¨Ã¨Ã¨Ã¨s attrayante. Parce que non seulement Ã§a colle d'un point de vue dÃ©coupage fonctionnel (un objet par joueur / ennemi / dÃ©cors / UI...), mais Ã§a colle aussi vachement bien d'un point de vue gameplay :

je veux crÃ©er plusieurs ennemis distincts qui attaquent mon joueur ? Hop, une instance d'objet par ennemi, chacun avec ses propres points de vie, son propre attack pattern, sa propre reconnaissance du terrain... et potentiellement, rÃ©sultante de tout Ã§a : un comportement unique par ennemi !

Tous les gros moteurs de jeux ont donc adoptÃ© cette approche dans leur design de base et dans le choix du langage adossÃ© :
- <span style="color: steelblue;">Unreal Engine</span> avec le <span style="color: steelblue;">C++</span>
- <span style="color: steelblue;">Unity</span> avec le <span style="color: steelblue;">C#</span>
- <span style="color: steelblue;">Godot</span> avec le <span style="color: steelblue;">C#</span> et son langage dÃ©diÃ© le <span style="color: steelblue;">GDScript</span> (qui est une variante intÃ©ressante, plus modulaire autour d'un concept de composition/noeud).

Mais tout aussi **flexible** et **adaptÃ©** qu'est le POO pour le **game design**, il a un problÃ¨me majeur : il **scale** trÃ¨s mal. A vouloir regrouper au sein d'un mÃªme objet Ã  la fois les donnÃ©es et ses traitements, par design les objets deviennent des Ã©lÃ©ments extrÃªmement **volatiles** dont on ne sait Ã  l'avance, ni ce qu'ils vont faire, ni la taille mÃ©moire qu'ils vont occuper.

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <span style="color: orange;">-- La flexibilitÃ© est un compromis de performance --</span>
        <a href="/static/png/ECS/GameObject_Entity_Memory.png" target="_blank"><img src="/static/png/ECS/GameObject_Entity_Memory.png" alt="Comparaison mÃ©moire GameObject vs Entity" width="100%"/></a>
        <a href="https://ilogos.biz/what-is-unitys-new-data-oriented-technology-stack-dots/" target="_blank">Source de l'image</a>
    </div>
    <div style="flex: 1;">

Cette nature indÃ©finie de l'objet oblige une architecture qui permet de manager n'importe quel Ã©lÃ©ment qui lui serait attachÃ©. Ne pouvant anticiper la structure de l'objet, sa crÃ©ation se fait Ã  la volÃ©e avec un **rangement mÃ©moire parcÃ©laire** (ou en moins poÃ©tique : **yolo, je te range oÃ¹ je trouve de la place libre**).

Travailler sur un objet nÃ©cessite alors de le reconstituer faÃ§on fil d'Ariane, en remontant Ã  chaque section de mÃ©moire oÃ¹ une partie de ses donnÃ©es est stockÃ©e.

Or les accÃ¨s mÃ©moires, c'est le coeur de la performance et ce scan incessant pour reconstituer les objets est un couperet brutal.

</div>
</div>


<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**Le saint sauveur : le <span style="color: steelblue;">DOD</span> !**

L'**ECS** (Entity Component System) est une architecture qui rentre dans le paradigme du **DOD** (Data Oriented Design). Dans le cadre de **Unity**, c'est mÃªme trÃ¨s clair, on parle de **DOTS** (Data Oriented Technology Stack). *Promis je m'arrÃªte lÃ  avec les acronymes des enfers infernaux.* ðŸ˜š



<div style="display: flex; gap: 20px; align-items: center;">
    <div style="flex: 1;">

L'ECS en soi n'est pas un concept nouveau. Si j'en crois <a href="https://en.wikipedia.org/wiki/Entity_component_system" target="_blank">WikipÃ©dia</a>, la 1Ã¨re version d'une architecture similaire Ã  l'ECS dans un jeu commercial remonte Ã  **Thief : The Dark Project en 1998**.

**-Digression-** Jeu extraordinaire au passage, auquel j'ai eu la chance de pouvoir jouer dans mon enfance
(attention vos rÃ©tines : <a href="https://www.youtube.com/watch?v=hHWYCfuPQHM" target="_blank">trailers d'Ã©poque</a>).

Il disposait d'une quantitÃ© impressionnante d'objets interagissables et dotÃ©s de physique, qu'on pouvait lancer pour faire du bruit, faire bouger d'autres objets, assommer des gardes etc etc... en vue de commettre le vol parfait sans aucun mort. Une rÃ©fÃ©rence en terme d'infiltration.
**-Fin de digression-**

</div>
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <a href="https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Thief_The_Dark_Project_boxcover.jpg/250px-Thief_The_Dark_Project_boxcover.jpg" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Thief_The_Dark_Project_boxcover.jpg/250px-Thief_The_Dark_Project_boxcover.jpg" alt="Thief: The Dark Project - Trailer" /></a>
    </div>

</div>

L'essence de l'ECS : ne plus organiser le code autour d'une logique fonctionnelle, mais d'une logique qui vise Ã  optimiser l'agencement de la donnÃ©e, aussi sommairement nommÃ© le <a href="https://fr.wikipedia.org/wiki/Principe_de_localit%C3%A9_(informatique)" target="_blank">principe de localitÃ©</a>.

Son design en soi est relativement simple :
- on remplace le concept d'objet par celui d'**<span style="color: steelblue;">entity</span>**, qui n'est qu'un identifiant unique.
- Ã  cette entitÃ©, on va lier des **<span style="color: steelblue;">components</span>**, qui ne sont que des conteneurs de donnÃ©es (des *structs*)
- on regroupe les entitÃ©s qui disposent des mÃªmes composants dans des **<span style="color: steelblue;">archetypes</span>** : toutes les entitÃ©s appartenant Ã  un mÃªme archÃ©type sont rangÃ©es de maniÃ¨re contiguÃ« en mÃ©moire
- on peut alors **<span style="color: steelblue;">query</span>** des groupes d'entitÃ©s en filtrant par composant (comme on requÃªterait une base de donnÃ©es)
- au travers de **<span style="color: steelblue;">systems</span>** centralisÃ©s, on traitera la donnÃ©e requÃªtÃ©e en masse via un dÃ©coupage en **<span style="color: steelblue;">chunks</span>** et une rÃ©partition sur du **<span style="color: steelblue;">multi-threading</span>**

<a href="/static/png/ECS/Unity_ECS_Concept.png" target="_blank"><img src="/static/png/ECS/Unity_ECS_Concept.png" alt="Concept ECS Unity" width="100%"/></a>

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>ImplÃ©mentation OOP vs ECS</span></div>
        </div>
        <div>
            <span>
En OOP, on aurait ici eu un personnage qui porterait une position, une direction et une vitesse ainsi qu'une mÃ©thode Move() qui s'exÃ©cuterait Ã  chaque frame.

En ECS, on crÃ©e 3 composants de donnÃ©es, liÃ©s entre eux par l'ID unique d'une entitÃ©. Ensuite un systÃ¨me isolÃ© va requÃªter toutes les entitÃ©s qui disposent de la combinaison de ces 3 composants (qu'ils appartiennent ou non au mÃªme archÃ©type, seule la combinaison de composants importe) et va traiter le calcul du mouvement en parallÃ¨le.</span>
        </div>
    </blockquote>
</div>


Cette approche permet d'augmenter d'au moins un facteur (x10) les performances. Des exemples seront plus parlant :

<div style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 300px;">
        <div style="position: relative; width: 100%; padding-bottom: 56.25%;">
            <iframe
                src="https://www.youtube.com/embed/XWHMD9CXapI?autoplay=1&mute=1&loop=1&playlist=XWHMD9CXapI"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
            </iframe>
        </div>
        <span style="display: block; text-align: center; margin-top: 8px;">Pas d'ECS, 1k unitÃ©s sans VAT*, sans simulation, sans dÃ©cors</span>
    </div>
    <div style="flex: 1; min-width: 300px;">
        <div style="position: relative; width: 100%; padding-bottom: 56.25%;">
            <iframe
                src="https://www.youtube.com/embed/f3AjoIE-H1c?autoplay=1&mute=1&loop=1&playlist=f3AjoIE-H1c"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
            </iframe>
        </div>
        <span style="display: block; text-align: center; margin-top: 8px;">ECS, 100k unitÃ©s avec VAT*, simulation simple, sans dÃ©cors</span>
    </div>
    <div style="flex: 1; min-width: 300px;">
        <div style="position: relative; width: 100%; padding-bottom: 56.25%;">
            <iframe
                src="https://www.youtube.com/embed/K5AgJVfSH3I?autoplay=1&mute=1&loop=1&playlist=K5AgJVfSH3I"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
            </iframe>
        </div>
        <span style="display: block; text-align: center; margin-top: 8px;">ECS, 50k unitÃ©s avec VAT*, simulation avancÃ©e, 180k dÃ©cors</span>
    </div>
</div>
<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <span>VAT (Vertex Animated Texture)</span>
        </div>
        <div>
            <p>C'est une technique d'animation qui stocke les mouvements des modÃ¨les dans une texture lue directement par le GPU.
            AllÃ¨ge fortement la charge CPU, au dÃ©triment d'un coÃ»t en RAM et d'une perte de flexibilitÃ© dans le process d'implÃ©mentation des animations.
            <a href="https://stoyan3d.wordpress.com/2021/07/23/vertex-animation-texture-vat/" target="_blank">Lien vers un article (anglais) si vous voulez plus de dÃ©tails.</a></p>
        </div>
    </blockquote>
</div>

*- Les 3 vidÃ©os tournent autour de 40-60 FPS. L'approche OOP me permet d'animer 1 000 unitÃ©s (disclaimer : en y ajoutant le VAT, entre 5k et 10k serait une cible envisageable). Avec l'approche ECS, je peux monter Ã  100 000 unitÃ©s, avec par dessus une simulation qui leur permet de s'esquiver et d'avoir un vrai pathfinding via un champs de vecteurs. L'Ã©cart de performance entre les 2 implÃ©mentations est abyssal pour ce genre de cas d'usage. -*

C'est donc une architecture extrÃªmement puissante, qui a trouvÃ© moult cas d'usage dans des simulations de :
- foules
- trafic
- villes / Ã©cosystÃ¨mes
- projectiles / particules
- sandbox / MMO

qui manipulent tous de grandes quantitÃ©s d'objets non-statiques et pour lesquels le DOD fait des merveilles.
 
Mais vous remarquerez que cette liste est plutÃ´t restreinte et qu'on n'utilise pas cette architecture partout... ðŸ‘€

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**Un grand pouvoir implique...**

Il est un piÃ¨ge dans lequel il ne faut pas tomber : **la performance pour la performance**, ce bon vieux over-engineering ! (et bon sang que c'est dur de ne pas tomber dans ce piÃ¨ge quand on fait de l'ingÃ©nierie...).

S'il est vrai que <span style="color: orange;">-- La flexibilitÃ© est un compromis de performance --</span>, l'inverse est tout aussi vrai <span style="color: orange;">-- La performance est un compromis de flexibilitÃ© --</span>. Or la **flexibilitÃ©** est l'un des coeurs de la **productivitÃ©**.

**La performance n'est que rarement un objectif** en soi (Ã  part si vous vous appelez Google/Amazon et que vous devez rÃ©pondre Ã  des milliards de requÃªtes utilisateurs Ã  la seconde). Non elle est surtout un **prÃ©-requis minimal d'acceptation de l'utilisateur** :
- si la performance est trop dÃ©gradÃ©e, l'expÃ©rience utilisateur le sera aussi et il partira
- mais Ãªtre trop performant n'amÃ©liorera pas l'expÃ©rience perÃ§ue cÃ´tÃ© utilisateur et vous aurez dÃ©pensÃ© temps/argent en pure perte

La **performance** est donc une **affaire d'Ã©quilibre** : une limite basse stricte Ã  ne jamais franchir et une limite haute diffuse Ã  tempÃ©rer, afin de maximiser la productivitÃ© de features, qui est le but premier.

L'ECS Ã©tant une rÃ©ponse de performance, il est par nature **plus complexe et peu flexible au changement**. Il est beaucoup plus long Ã  mettre en place, demande de nombreux composants distincts, impose des restrictions sur le type de donnÃ©es et globalement, rallonge drastiquement les temps de dÃ©veloppement, mÃªme pour des features simples.

L'industrie a choisi comme toujours l'approche la plus pragmatique : l'**hybride**. Savoir choisir ce qui mÃ©rite une approche ECS pour la performance VS choisir l'approche OOP quand le fonctionnel et l'itÃ©ration priment. L'approche ECS est par exemple inutile dans la plupart des jeux avec des scÃ¨nes restreintes, qui compose l'immense majoritÃ© de nos catalogues. Au contraire, la moindre simulation de masse gagnera massivement Ã  l'implementer.

Mais si l'industrie a longtemps dÃ» traiter l'ECS et l'OOP comme deux mondes sÃ©parÃ©s, une nouvelle voie s'ouvre peut-Ãªtre. A la  <a href="https://youtu.be/BtObK0arD_M" target="_blank">GDC de mars 2026</a>, **Unity** a dÃ©cidÃ© de taper fort : pourquoi ne pas **fusionner** les 2 approches ?

<a href="https://pbs.twimg.com/media/HCq5KsqaUAcM-dR?format=jpg&name=large" target="_blank"><img src="https://pbs.twimg.com/media/HCq5KsqaUAcM-dR?format=jpg&name=large" alt="GDC Unity 2026" width="100%"/></a>

L'ECS deviendrait un package core du moteur (et non plus un add-on Ã  installer), Ã  la maniÃ¨re d'un [**Bevy**](https://bevy.org/) (un moteur de jeu en Rust nativement ECS). Les entitÃ©s deviendront alors le backend de tout le moteur, mais pour autant les GameObjects ne disparaissent pas : ils deviennent une couche de confort par dessus les entitÃ©s, le moteur prenant la main pour faire la conversion. La force du design OOP par dessus, la puissance de l'ECS en dessous.
<span style="color: orange;">-- L'ECS ne sera plus un choix, mais le socle. Le GameObject ne sera plus une alternative, mais une interface. --</span>

En d'autres termes, l'approche hybride dont je parlais plus haut ne sera plus un compromis d'architecture, mais le mode de fonctionnement par dÃ©faut du moteur. Vous voulez du prototypage rapide ? Vous restez au niveau GameObject. Vous voulez de la performance brute ? Le moteur vous permettra de basculer votre architecture en GameObjects vers de l'ECS et ainsi profiter de ses options. MÃªme donnÃ©es, mÃªme moteur, mais deux mondes en un.

Et je vous avoue que je suis trÃ¨s curieux de voir le rÃ©sultat. ðŸ‘€

<script src="https://giscus.app/client.js"
        data-repo="Keilthar/devlog"
        data-repo-id="R_kgDORm6DmQ"
        data-category="General"
        data-category-id="DIC_kwDORm6Dmc4C5K9i"
        data-mapping="pathname"
        data-strict="1"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="dark"
        data-lang="fr"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>
