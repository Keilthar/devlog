---
title: ECS
---

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
                <img src="/static/png/Unity_ECS.png" alt="Unity ECS" width="100%"/>
            </div>       
        </div>
    </blockquote>
</div>

*Je vais ici parler dans un contexte **Game Dev**, mais en vrai, c'est un sujet qui est transverse au métaverse (ouai j'ose le mot 😏) du développement.*

**Aux origines de la galère : le <span style="color: steelblue;">POO</span> !**

Le POO (Programmation Orientée Objet) a cette incroyable force du repos mental de nos mollassons cerveaux : on **découpe nos concepts métier en objets**, qui portent à la fois des **propriétés** et des **méthodes/fonctions**. Chaque objet a droit à son **instance distincte** et il pourra donc être **autonome** dans son coin.

Dans le cadre du jeu vidéo, cette approche est trèèèèèès attrayante. Parce que non seulement ça colle d'un point de vue découpage fonctionnel (un objet par joueur / ennemi / décors / UI...), mais ça colle aussi vachement bien d'un point de vue gameplay :
je veux créer plusieurs ennemis qui attaquent mon joueur ? Une instance d'objet par ennemi, chacun avec ses propres points de vie, son propre attack pattern, sa propre reconnaissance du terrain et de facto un comportement qui lui est unique !

Tous les gros moteurs de jeux ont donc adopté cette approche dans leur design de base et le choix du langage adossé :
- <span style="color: steelblue;">Unreal Engine</span> avec le <span style="color: steelblue;">C++</span>
- <span style="color: steelblue;">Unity</span> avec le <span style="color: steelblue;">C#</span>
- <span style="color: steelblue;">GODOT</span> avec son <span style="color: steelblue;">GDScript</span> (qui est une variante plus modulaire autour du concept de noeud).

Mais tout aussi fléxible et adapté qu'est le POO pour le game design, il a un problème majeur : il scale très mal. A vouloir regrouper au sein d'un même objet à la fois données et traitements, par design les objets deviennent des éléments extrêmement volatiles dont on ne sait pas à l'avance ni ce qu'ils vont faire, ni la taille mémoire qu'ils vont prendre.

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <span style="color: orange;">La flexibilité a toujours un coût en performance</span>
        <img src="/static/png/GameObject_Entity_Memory.png" alt="Scope creep" width="100%"/>
        <a href="https://ilogos.biz/what-is-unitys-new-data-oriented-technology-stack-dots/" target="_blank">Source de l'image</a>
    </div>
    <div style="flex: 1;">

C'est une compromis universel auquel le POO n'échappe pas.

L'objet étant de nature indéfinie, l'architecture du POO permet de ranger les éléments qui compose l'objet n'importe où en mémoire. Et quand vous avez besoin de travailler sur un objet, vous avez besoin de le reconstituer façon fil d'ariane, en lisant chaque section de mémoire où une partie de ses informations sont stockées.

Hors les accès mémoires, c'est le coeur de la performance et c'est précisément cet enjeu que l'architecture ECS tend à optimiser.

</div>
</div>

**Le saint sauveur : le <span style="color: steelblue;">DOD</span> !**

L'**ECS** (Entity Component System) est une architecture qui rentre dans le paradigme du **DOD** (Data Oriented Design). Dans le cadre de **Unity**, la dénomination s'appelle **DOTS** (Data Ortiented Technology Stack). Promis je m'arrête là avec les acronymes des enfers infernaux. 😚

L'ECS en soit n'est pas un concept nouveau. Si j'en crois Wikipédia, le 1ère version d'un ECS fonctionnel dans un jeu commercial remonte à Thief : The Dark Project en 1998.

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <div style="display: flex; justify-content: center;">
            <iframe width="560" height="315" src="https://www.youtube.com/watch?v=hHWYCfuPQHM frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div style="flex: 1;">

C'est une compromis universel auquel le POO n'échappe pas.

L'objet étant de nature indéfinie, l'architecture du POO permet de ranger les éléments qui compose l'objet n'importe où en mémoire. Et quand vous avez besoin de travailler sur un objet, vous avez besoin de le reconstituer façon fil d'ariane, en lisant chaque section de mémoire où une partie de ses informations sont stockées.

Hors les accès mémoires, c'est le coeur de la performance et c'est précisément cet enjeu que l'architecture ECS tend à optimiser.

</div>
</div>


