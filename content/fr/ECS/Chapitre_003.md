---
title: 💡 3 - ECS, les bonnes pratiques
---

<style>
    article p, article li, article div { text-align: justify; }
    article h2 { color: steelblue; }
</style>

<!-- Tip -->
<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <a href="https://docs.unity3d.com/Packages/com.unity.entities@6.5/manual/index.html" target="_blank">Manuel officiel Unity ECS</a>
        </div>
        <div class="callout-content">
            <div class="callout-content-inner">
                <a href="/static/png/ECS/Unity_ECS_System.png" target="_blank"><img src="/static/png/ECS/Unity_ECS_System.png" alt="Unity ECS System" width="100%"/></a>
            </div>       
        </div>
    </blockquote>
</div>

<p style="text-align: center;"><a href="../index.xml">🔊 S'abonner au flux RSS</a></p>

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

---


<div style="display: flex; gap: 20px; align-items: center;">
    <div style="flex: 1;">
<span style="color: orange; display: flex; justify-content: center; align-items: center;"> 🚧⚠️ 🚧 - - - WARNING - - - 🚧⚠️ 🚧 </span> 

Je vais vous proposer une liste de règles que vous devriez apprendre à penser/conceptualiser dès que vous utilisez un ECS.

Elles pourront vous faciliter grandement la vie, vous évitant quelques pièges et surtout, vous permettront de ne pas refactoriser constamment vos **systèmes** et **composants**.

Cependant, <span style="color: orange;"> une règle n'est jamais absolue </span>. On n'applique pas une règle parce que "c'est une règle", on l'applique parce qu'on comprend son utilité et qu'elle est adaptée au contexte dans lequel vous vous trouvez.

Les règles que je vais donc vous enseigner ici sont **à considérer quasi-systématiquement**, mais **pas à appliquer quasi-systématiquement** !

C'est important de garder ça en tête et ça vaut pour toutes les "bonnes pratiques" que vous lirez un jour.

</div>
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <a href="/static/png/Sith_Absolute.jpg" target="_blank"><img src="/static/png/Sith_Absolute.jpg" alt="Sith_Absolute" width="100%"/></a>
    </div>
</div>



Voici donc mes commandements quand il s'agit d'écrire dans un cadre ECS :

<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style="display: flex; align-items: center; gap: 24px;">
            <div style="flex: 0 0 40%;">
                <a href="/static/png/Yoda_Backwards.jpg" target="_blank">
                    <img src="/static/png/Yoda_Backwards.jpg"
                         alt="Yoda"
                         style="display: block; width: 100%;"/>
                </a>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div class="callout-title"
                     style="display: flex; justify-content: center; align-items: center;">
                    <div class="callout-icon"></div>
                    <span>Les commandements ECS</span>
                    <div class="callout-icon"></div>
                </div>
                <p style="text-align: left;"><strong>1 - Immortels, tes Composants ne seront pas</strong></p>
                <p style="text-align: left;"><strong>2 - Des Déclencheurs et des Filtres, tes Systèmes consommeront</strong></p>
                <p style="text-align: left;"><strong>3 - Dans l'ECS, toute ta donnée métier vivra</strong></p>
                <p style="text-align: left;"><strong>4 - Toujours génériques, tes Systèmes seront</strong></p>
                <p style="text-align: left;"><strong>5 - Peu de Queries, tes Systèmes consommeront</strong></p>
                <p style="text-align: left;"><strong>6 - Écrits par un unique Système, tes Composants seront</strong></p>
                <p style="text-align: left;"><strong>7 - Tout bien nommer, tu devras</strong></p>
                *Promis, j'arrête avec les meme Star Wars...*
            </div>
        </div>
    </blockquote>
</div>

---

## 1 - Immortels, tes Composants ne seront pas

### Contexte

**<span style="color: orange;"> Une entité n'est pas un objet fonctionnel immuable. </span>**

C'est probablement la leçon la plus dure à se rentrer dans la tête quand on vient de l'Orienté Objet.

**Un composant ne devrait être présent sur une entité (ou actif, si le moteur le permet) que s'il est utile à l'instant T**
*<br>(**spoiler** : cette affirmation sera nuancée dans la règle suivante, mais elle est une bonne base de réflexion)*

La présence d'un composant définit l'état de l'entité, il n'est pas juste un porte-bagages de données permanent !


### Conséquences

Ne pas appliquer cette règle conduira systématiquement à **<span style="color: orange;"> devoir créer des règles de sortie préventives pour vos systèmes </span>**, afin d'ignorer les composants "inactifs" mais toujours présents sur les entités.
Cela créera aussi **<span style="color: orange;"> une charge passive pour le moteur </span>** au fur et à mesure que vos systèmes s'accumuleront, chacun lisant en permanence vos composants.

Exemple :

Votre entité **PEUT** bouger, vous avez donc un composant qui stocke la data pour gérer ce mouvement.
Sauf que votre entité ne bouge pas à chaque frame. Par exemple, elle ne bouge que quand vous l'avez sélectionnée et que vous cliquez à un endroit. La majorité du temps, elle est donc immobile.

Si vous partez du principe que **POUVOIR BOUGER** est une caractéristique immuable de l'entité, de facto vous allez construire un système dédié au mouvement qui :
- sera systématiquement activé et ira lire la data dans votre composant
- portera une règle codée qui décidera si l'entité est effectivement en train de bouger ou pas. 
  - s'arrêtera là pour l'entité en question si la vérification a bloqué
  - modifiera le transform si la vérification est passée

Vous répétez ça pour chaque entité dans votre scène, à chaque frame et pour chaque système qui existe : vous allez avoir des milliers de composants lus dans le vide en permanence.


### Corrections

Vous sélectionnez une unité, puis cliquez sur la carte :
- votre système de lecture d'input ajoute le composant de mouvement à l'unité concernée et renseigne la data (position de départ/d'arrivée + vitesse + progression par exemple)
- votre système de mouvement voit le composant, le lit et déplace le transform selon ses règles
- ce même système valide si l'action a été accomplie (pour l'exemple : l'unité est-elle arrivée à destination ?) et si oui, supprime/désactive le composant

Votre système de mouvement ne tourne plus à vide à chaque frame (en comparant si la position de départ et d'arrivée sont les mêmes pour sortir préemptivement par exemple).

Il devient **<span style="color: steelblue;"> inactif par l'absence du composant </span>**, jusqu'à la prochaine réintroduction de celui-ci par le système de lecture d'input.




<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style="display: flex; align-items: center; gap: 24px;">
            <div style="flex: 1; min-width: 0;">

### Astuces

Avec cette logique, vous voyez sûrement émerger 2 grands types de systèmes, que vous avez peut-être déjà conceptualisés dans vos projets sans vous en rendre compte :
- les <span style="color: steelblue;"> systèmes initiateurs </span> (traitent un état métier et activent/ajoutent le composant nécessaire aux entités concernées)
- les <span style="color: steelblue;"> systèmes consommateurs </span> (lisent les composants concernés et les désactivent/suppriment des entités si l'action a été menée jusqu'à son terme)
  
Ce qui est immensément pratique à déboguer, l'ECS devenant par architecture une machine à états vivante (et en prime, ça vous permet de faire de beaux schémas d'architecture sur Excalidraw...).
            </div>
            <div style="flex: 0 0 40%;">
                <a href="/static/png/ECS/DIAG_Audit.png" target="_blank">
                    <img src="/static/png/ECS/DIAG_Audit.png"
                         alt="Diag Excalidraw"
                         style="display: block; width: 100%;"/>
                </a>
            </div>
        </div>
    </blockquote>
</div>

---

## 2 - Des Déclencheurs et des Filtres, tes Systèmes consommeront

### Contexte

**Si une entité n'est pas un objet fonctionnel immuable,** **<span style="color: orange;"> une entité ne doit pas changer de structure (archétype) trop souvent ! </span>** (voire, dans la mesure du possible, jamais).

Ajouter et supprimer des composants, ça a un coût dans une architecture ECS :
- ajout/suppression du composant (captain Obvious, à votre service !)
- déplacement complet en mémoire de l'entité et de ses composants, dans une section liée à son nouvel archétype (cf. mes chapitres précédents)

Si ma recommandation dans la règle "<span style="color: steelblue;"> 1 - Immortels, tes Composants ne seront pas </span>" est parfaitement viable, elle ne doit pas être appliquée de manière aussi brute et je vais pouvoir vous introduire à la notion de :
- **<span style="color: steelblue;"> composants déclencheurs </span>** : un composant one-shot, consommé (lu puis détruit) par un système qui ne devrait s'exécuter qu'une fois ponctuellement (exemple : Trigger de chargement ou de sauvegarde)
- **<span style="color: steelblue;"> composants filtreurs </span>** : un composant qui informe d'un état, qui peut rester présent sur de plus ou moins longues périodes (exemple : filtre d'unités en mouvement).


### Conséquences

Si votre entité change régulièrement d'état, l'ajout/retrait du composant et **<span style="color: orange;"> la copie dans l'archétype associé peuvent avoir un coût supérieur au fait de faire tourner votre système "dans le vide"</span>** avec un test de sortie simple.


### Corrections

Les concepteurs des ECS ont prévu ce cas d'usage, chaque moteur propose une solution qui répond à ce besoin :
- Unity : l'interface `IEnableableComponent` peut être implémentée par un composant, lui permettant d'avoir un bit d'activité
- Unreal Engine : un composant `SparseElement` peut être associé à une entité, sans modifier son archétype
- Bevy : un composant peut être déclaré `SparseSet`, ce qui change d'archétype l'entité quand il est ajouté/supprimé, mais sans générer un déplacement en mémoire des composants classiques

Ces composants spéciaux permettent aux systèmes de pouvoir **filtrer les entités via leur Query**, afin de ne tourner que sur les entités pertinentes (voire pas du tout si aucune n'est présente).

On transforme alors la logique de query des systèmes de la règle 1 :
- une query sur les composants à manipuler, que le système détruit lorsqu'il a terminé
  
par
- une query sur les composants à manipuler + des composants de filtrage, seuls ces derniers peuvent (ou non) être détruits/désactivés

ou 
- une 1re query sur un composant de trigger, que le système détruira/désactivera une fois qu'il a tourné
- une 2de query sur les composants à manipuler + des composants de filtrage, seuls ces derniers peuvent (ou non) être détruits/désactivés

Le déclencheur permet de cadencer des systèmes ponctuels, tandis que le filtrage évite de traiter les entités inactives. Et selon le moteur et sa configuration, on peut aussi empêcher le système de s’exécuter quand il n’a rien à faire (sur Unity on dispose de `RequireForUpdate` par exemple, forçant le `OnUpdate` d'un système à ne s'exécuter que si une query renvoie des entités, même s'il a des limites actuellement avec les `IEnableableComponent`, à mon plus grand désespoir 😒).
<br> On revient dans cette logique de **<span style="color: steelblue;"> système inactif par l'absence de composant </span>**.

<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">

### Astuces

En vous rappelant cette règle, vous allez naturellement basculer dans une logique de :
- <span style="color: steelblue;">composant de données </span> : permanent, défini dans l'archétype de base de l'entité
- <span style="color: steelblue;">composant d'état </span> : temporaire, qui définit ce que fait actuellement l'entité
  
Un composant peut alors ne porter aucune donnée métier et n'être qu'un **<span style="color: steelblue;"> composant de déclenchement/filtrage </span>**, ce qui est extrêmement puissant.

Par exemple, vous pourrez entièrement vous passer de toute logique reposant sur des Events + Listeners, avec toutes les problématiques de séquençage qui en découlent.

Ainsi toute la logique vit dans l'ECS... ça tombe bien, c'est le point suivant !
    </blockquote>
</div>

---

## 3 - Dans l'ECS, toute ta donnée métier vivra

### Contexte

**<span style="color: orange;">En dehors des systèmes d'initialisation, un système ne devrait consommer que des composants de l'ECS et aucune variable/constante métier de code.</span>**

Les valeurs (variables private ou public, static ou const) métier utiles à une architecture ECS ne le sont qu'aux phases d'initialisation (1re instanciation d'une entité avec ses composants).
Ensuite tout système post-initialisation devrait fonctionner en vase clos avec la data métier présente dans l'ECS.

**Attention, je ne parle ici que des valeurs métiers, les caractéristiques de vos objets métiers et de votre scène, qui vivent tout au long du jeu. Je ne parle pas des variables de calcul et autres caches locaux.**


### Conséquences

L'utilisation d'une variable/const métier dans un système post-phase d'initialisation est la plupart du temps un red flag, qui **<span style="color: orange;">conduira presque systématiquement à un refactor</span>** car cette variable est une caractéristique d'une entité (ou d'un type d'entités) et non pas du système lui-même.

Exception :

Il y a bien entendu des exceptions, comme les variables qui permettent aux systèmes d'être à l'écoute pendant un temps donné, ou qui permettent de gérer des timings d'exécution, qui sont des caractéristiques du système lui-même et qui n'ont pas forcément lieu d'être transcrites dans l'ECS (même si elles pourraient).

Exemple :

Toutes vos unités se déplacent à la même vitesse. Vous introduisez donc une `const float UnitMoveSpeed` dans votre système de mouvement, qu'il utilisera pour gérer le déplacement des `transforms`.
Puis vous introduirez une mécanique qui change la vitesse de l'unité (un buff/debuff, une variation de vitesse d'une entité à l'autre ou même une notion de vitesse d'exécution du jeu) qui engendrera un refactoring immédiat de l'entité, des composants et de tous les systèmes qui consomment cette variable.

### Corrections

Posez-vous simplement la question de la responsabilité de la data : qui devrait porter cette information ? Sans même présumer de futurs changements de mécanique qui pourraient rentrer dans de l'over-engineering préventif classique. La plupart du temps, le nom de votre variable trahira son appartenance.

Écrire une variable locale dans le code, c'est s'économiser quelques secondes de réflexion sur la portée d'une donnée et s'engendrer quasi-systématiquement plusieurs minutes de refactor plus tard.
De manière générale, en Data Oriented, vous devriez d'abord vous poser ces 2 questions :
- quelles sont les données nécessaires pour répondre à mon besoin ?
- comment je les regroupe pour traiter mon besoin ?


<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
    
### Astuces

Tous les moteurs disposent d'un éditeur qui permet d'inspecter et modifier les composants des entités en live.

Inclure par défaut ces variables dans des composants vous permet nativement de <span style="color: steelblue;"> fine-tuner en live les valeurs en jeu </span> sans devoir faire le cycle infernal : changer la valeur, compiler, lancer le jeu jusqu'à arriver à la phase qui vous intéresse, tester, sortir, changer la valeur... & bis repetita jusqu'à obtenir le résultat attendu.

Vous pouvez même, dans le cas de valeurs partagées, créer des entités référentielles indépendantes, comme par exemple une entité singleton `Unit_BaseStat` qui porterait la vitesse commune de vos unités. Vous pouvez query dans vos systèmes ces valeurs partagées et les appliquer à plusieurs entités. En changeant la valeur dans ce référentiel depuis l'éditeur, l'ensemble des unités concernées sera affecté en live. C'est un outil extraordinaire dont vous privent les déclarations dans le code.
    </blockquote>
</div>

---

## 4 - Toujours génériques, tes Systèmes seront

### Contexte

**<span style="color: orange">Un système ne portant pas de variables "métier", il ne peut (et ne doit) donc porter aucune data liée à une entité donnée.</span>**

Vous ne devriez jamais créer un système pour manipuler UNE entité spécifique. Le système manipule **des composants** (pas des entités), pour un contexte donné. S'il se trouve que la query ne ramène qu'une unique entité dans l'ECS, ça ne devrait être vu que comme une heureuse coïncidence !


### Conséquences

La conséquence classique, c'est une **<span style="color: orange">réduction préventive des composants et systèmes à un contexte fonctionnel restreint</span>**, ce qui conduit à **<span style="color: orange">la multiplication des composants/systèmes sur des périmètres pourtant similaires</span>**, à des refactors constants pour étendre le périmètre du système et de ses composants, et à une difficulté croissante à suivre l'architecture à mesure que le projet grossit.


### Corrections

**<span style="color: steelblue;"> Un système lit des composants, il ne lit pas des entités </span>**. C'est TRÈS important comme concept. Un système n'a pas besoin de savoir à quel type d'entité les composants appartiennent.

Pour reprendre l'exemple du système de mouvement, on se fiche qu'il bouge votre personnage principal, un ennemi ou un projectile, la seule chose qu'il doit lire c'est :
```csharp
public struct COMP_Unit_Movement_Direction : IComponentData
{
    public float3 Direction;
    public float Speed;
}
```
et faire le calcul qui concerne cette data. Du KISS (Keep It Stupidly Simple) à l'état le plus brut.

Et peut-être demain, vous vous rendrez compte que vous avez un nouveau type de mouvement à gérer et vous créerez un 
```csharp
public struct COMP_Unit_Movement_ToPosition : IComponentData
{
    public float3 StartPosition;
    public float3 TargetPosition;
    public float Progression;
    public float Speed;
}
```
avec un nouveau système dédié qui fera un `Lerp` avec cette data. Et qui, pareil, sera aveugle du rôle de l'entité et fera son calcul dans son coin.

<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style="display: flex; align-items: center; gap: 24px;">
            <div style="flex: 1; min-width: 0;">

### Astuces

Créez vos systèmes comme si l'entité allait être multipliable et générique, même dans le cas des entités singleton.
<span style="color: steelblue;"> La transformation des queries d'entrée d'un système en queries singleton est une optimisation de fin </span>, pas une façon d'initialiser un système (du moins tant que vous n'avez pas l'habitude de l'ECS).

Adoptez une approche Data Oriented :
- quel est mon besoin ? Bouger l'entité
- quel est l'input ? Une position cible, une direction reçue du clavier/gamepad, un tableau de positions séquentielles, une trajectoire spline provenant du pathfinding...
- quel système initie ce composant ? est-ce que j'ai un risque de conflit de données avec l'existant ?
- de facto, ça rentre dans un composant existant ? ou je suis en train de le déformer et auquel cas j'ai besoin d'un nouveau composant ?
- si c'est un composant existant, le système associé peut le gérer ? non ? j'ai probablement loupé un truc dans les questions précédentes
- si c'est un nouveau composant, il peut cohabiter avec l'existant ? ce cas peut arriver ? dois-je prévoir des exclusions dans mes queries ou je m'y suis mal pris dans l'initialisation ?

C'est une gymnastique à prendre et qui devient naturelle avec la pratique. Et vous devriez là aussi sentir dans l'air, ce besoin d'une notion de **<span style="color: steelblue;"> système initiateur/consommateur </span>** et de **<span style="color: steelblue;"> composant de filtrage </span>**.
            </div>
        </div>
    </blockquote>
</div>

---

## 5 - Peu de Queries, tes Systèmes consommeront

### Contexte

**<span style="color: orange"> La quasi-intégralité de vos systèmes ne devrait avoir comme entrée qu'entre 1 et 3 queries. </span>**

Exemple :
- une query de trigger
- une query sur un composant singleton de données partagées
- une query sur les composants des entités (comprenant composants de données et de filtrage)

Si vous concevez des systèmes à périmètre limité pour vous faciliter le débug, cette structure sera la plupart du temps suffisante.

Maintenant, comme déjà évoqué, rien n'est absolu. Certains systèmes auront besoin de plus, car ils font la transition entre 2 périmètres fonctionnels distincts mais connexes (exemples : vos unités et votre architecture de pathfinding ou votre système d'input et les éléments associés au joueur), ou nécessitent de vérifier la présence de plusieurs composants de filtrage sur des entités distinctes (état de la carte, état du pathfinding, état des unités...)

Exemple :
- une query de trigger
- une query sur un composant singleton de données partagées pour le périmètre 1
- une query sur les composants des entités (comprenant composants de données et de filtrage) que le système traitera pour le périmètre 1
- une query sur un composant singleton de données partagées pour le périmètre 2
- une query sur les composants des entités (comprenant composants de données et de filtrage) que le système traitera pour le périmètre 2


### Conséquences

Un système qui porte de nombreuses queries est **<span style="color: orange"> un système qui gère probablement trop de responsabilités </span>**. Ça impliquera souvent :
- un système **<span style="color: orange"> très long et difficile à déboguer </span>**
- un système **<span style="color: orange"> qui tournera en permanence et gérera tout un tas de cas de sortie où il ne produira rien </span>** (**<span style="color: steelblue;"> les `return` bruts de fonderie dans les systèmes sont un red flag à surveiller </span>**)
- une distorsion des composants pour qu'ils portent la data nécessaire au système, alors que c'est le composant qui doit définir ce que le système fait


### Corrections

En général, si vous suivez la règle **<span style="color: steelblue;"> 2 - Des Déclencheurs et des Filtres, tes Systèmes consommeront </span>**, vous serez presque immunisés contre ce problème.
D'ailleurs, **<span style="color: steelblue;"> un système ne devrait avoir qu'un seul et unique composant Trigger, mais il peut avoir plusieurs composants de filtrage </span>**. Si vous distinguez le besoin de plusieurs Triggers, c'est un indicateur qu'une séparation est nécessaire.

---

## 6 - Écrits par un unique Système, tes Composants seront

### Contexte

Il est normal que plusieurs systèmes lisent un même composant, mais plus **<span style="color: orange">rares sont les cas qui nécessitent que plusieurs systèmes écrivent sur la même data</span>**.

Celle-ci est probablement la règle la moins "absolue" de la liste. Par contre, c'est une question qu'il est pertinent de se poser quand on arrive devant le cas, car elle soulève souvent d'autres questions de portée :
- soit des composants : les données de périmètres distincts ne seraient-elles pas rassemblées par erreur dans un même composant ?
- soit des systèmes : un de mes systèmes n'est-il pas en train de traiter un périmètre qui n'est pas le sien ?


### Conséquences

Les conséquences sont les soucis classiques de **<span style="color: orange"> réécriture de la data d'un système par un autre dans la même frame </span>**, avec le comportement erratique selon le système qui tournera à la frame donnée et les difficultés de debug qui vont avec.


### Corrections

Il peut être parfaitement légitime que des systèmes touchent au même composant.
Exemple : le système de mouvement standard des unités et un système d'explosion qui peut projeter les unités vont tous deux interagir avec le `transform`.
Il faut donc pouvoir gérer une notion de state de l'unité, afin d'avoir une alternance stable d'exécution des systèmes.

Tout conflit peut ici être résolu par la règle **<span style="color: steelblue;"> 2 - Des Déclencheurs et des Filtres, tes Systèmes consommeront </span>** : une unité projetée ne peut pas se déplacer normalement.

Une unité devrait donc porter par défaut un `TAG_Unit_NormalMove`, remplacé par le `TAG_Unit_ProjectionMove` le temps de celle-ci, puis récupérer son `TAG_Unit_NormalMove` une fois l'unité rétablie.
Chaque système ne tourne que si son TAG respectif est présent/actif, prévenant tout conflit sur le transform de l'entité.

---

## 7 - Tout bien nommer, tu devras

### Contexte

Vous constaterez, **<span style="color: orange">avec le grossissement de votre projet, que la quantité de composants et de systèmes va très vite exploser. Et c'est normal ! </span>**
Par exemple pour mon jeu, j'ai actuellement :
- 175 Systèmes
- 217 Composants bruts
- 64 Composants buffers
- plusieurs centaines de milliers d'entités dans ma scène

Et je pense que je n'ai là que la moitié du nécessaire pour la version finale de mon jeu (actuellement, si je ne compte que le C# lié à l'ECS d'Unity, j'ai plus de 60 000 lignes de code pour vous donner un ordre de grandeur).

J'ai donc un besoin impérieux de pouvoir m'y retrouver dans ce bazar. Et ça sera aussi votre cas, certes dans une moindre mesure, mais n'en doutez pas une seule seconde.

### Conséquences

Une des difficultés les plus exprimées autour de l'utilisation de l'ECS sur Internet est la **<span style="color: orange"> difficulté à gérer cet immense amas de données </span>**. Et plus il grandit, plus vous perdez le fil de ce qui a été créé et vous vous mettez **<span style="color: orange">à dupliquer de la data et des composants déjà existants, amplifiant encore le problème </span>**.

Et dites-vous que les LLMs ne vous aideront pas ici, car eux n'ont aucun souci à absorber tout ça et à créer encore et toujours plus de composants. Il n'y a rien de plus facile que de perdre toute autonomie dans son propre ECS.


### Corrections

Une grande rigueur dans les conventions de nommage et d'organisation vous sauvera de migraines. 
Personnellement j'ai adopté cette convention :

Exemple pour mes composants : `[ComponentType]_[NetworkPerimeter]_[FunctionalPerimeter]_[Scope] `

avec 
  - `ComponentType` :

| Préfixe | Utilité | Contient des données ? | (Dés)activable ? |
|--------|--------|-----------|-----------|
| COMP | conteneur de data spécifique à une entité | Toujours | Rarement |
| REF | conteneur de data partagé, singleton | Toujours | Jamais |
| TAG | composant de filtrage | Rarement | Presque toujours |
| TRIG_SYS | composant de trigger système, détruit par les systèmes | Rarement | Jamais |

(*Note : la séparation entre TAG et TRIG_SYS est spécifique à ma convention **Unity** car il propose la notion de `IEnableableComponent`. Pour les autres moteurs, le TAG sera lui aussi destructible par les systèmes, mais je pense qu'il reste pertinent de séparer les 2 notions de trigger ponctuel de système et de tag de filtrage temporaire des entités quelque soit son cycle de vie)

  - `NetworkPerimeter` : Server, Client, Shared ou Ghost (c'est spécifique au multijoueur en ligne pour mon jeu, il peut sauter pour un jeu solo)
  - `FunctionalPerimeter` : le périmètre fonctionnel du composant (Player, Enemies, Decors, Ground, Projectile...)
  - `Scope` : quel élément du périmètre fonctionnel est porté par le composant (Stats, Movement, Attack, Animation...)

Ainsi pour mon joueur, je vais avoir par exemple :
- `COMP_Server_Player_Stats` qui porte toute la metadata de base de mon joueur (niveau, points de vie, vitesse de base, puissance d'attaque...)
- `COMP_Server_Player_Movement` qui porte toute la data runtime du mouvement en cours (direction du mouvement, orientation du personnage, modificateur de vitesse...)
- `TAG_Server_Player_IsMoving` qui ne porte aucune data, que j'active et désactive selon l'état des inputs joueur
- `REF_Server_Players_Connected` qui est un singleton portant la liste de tous les joueurs connectés à la session
- et j'aurai des `TRIG_SYS_Server_Player_Despawn`, `TRIG_SYS_Server_Player_Spawn` pour déclencher des systèmes ponctuels associés

Côté systèmes, j'ai exactement la même logique avec comme convention de nommage : `SYS_[NetworkPerimeter]_[FunctionalPerimeter]_[Scope] `

J'aurai donc par exemple :
- `SYS_Server_Player_Spawn` qui consommera (lecture puis destruction) `TRIG_SYS_Server_Player_Spawn` afin d'initialiser une entité Player pour un joueur donné
- `SYS_Server_Player_Move` qui query les `TAG_Server_Player_IsMoving` actifs + `COMP_Server_Player_Stats` et `COMP_Server_Player_Movement` afin de gérer le mouvement

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <a href="/static/png/ECS/Component_Filter.png" target="_blank"><img src="/static/png/ECS/Component_Filter.png" alt="Component filter" width="100%"/></a>
    </div>
    <div style="flex: 1;">

Avec cette logique et l'autocomplétion, je peux instantanément retrouver l'ensemble de la data associée à un périmètre + les actions réalisables dessus.

Ou rechercher des composants dans l'éditeur ECS afin de les inspecter. Ma convention de nommage est une forme de query par autocomplétion de l'éditeur (de code ou du game engine).

</div>
</div>


<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style="display: flex; align-items: center; gap: 24px;">
            <div style="flex: 1; min-width: 0;">

### Astuces

Les composants étant utilisés par de nombreux systèmes, je vous invite très fortement à **<span style="color: steelblue;"> déclarer tous vos composants dans des fichiers dédiés </span>**, comme vous le feriez pour vos constantes/variables public static dans un projet classique.

Ceci permet d'inspecter très rapidement pour un périmètre donné les données en doublon. Ne déclarez pas vos composants dans les mêmes fichiers que vos systèmes, ça deviendra un enfer pour vous y retrouver.
            </div>
            <div style="flex: 0 0 40%;">
                <a href="/static/png/ECS/File_Organisation.png" target="_blank">
                    <img src="/static/png/ECS/File_Organisation.png"
                         alt="File Organisation"
                         style="display: block; width: 100%;"/>
                </a>
            </div>
        </div>
    </blockquote>
</div>

## Conclusion

Je rappelle encore une fois que ce sont **<span style="color: steelblue;"> des règles auxquelles il faut penser, mais pas des règles à appliquer systématiquement</span>**. Elles permettent de structurer votre pensée et l'architecture de votre ECS.

Oui, vous aurez forcément à un moment donné :
- des systèmes qui doivent tourner à chaque frame sans aucun trigger ni filtrage
- de la data qui vivra en dehors de l'ECS (les configurations/préférences du joueur ou la lecture des inputs sur Unity sont totalement hors ECS)
- des systèmes avec plein de queries en entrée
- des composants lus et écrits par plusieurs systèmes (le FlowField de mon jeu, c'est un gang-bang d'écriture parallélisé)

Là où vous devriez soupçonner que vous vous y prenez probablement mal, c'est si ces cas deviennent systématiques au travers de votre projet, car ils engendreront un retour de bâton conséquent après un certain temps.

À noter aussi que ces règles sont un formidable levier pour cadrer l'IA (et font, pour ma part, l'objet de `skills` dédiés dans les phases d'écriture mais aussi de review du code). L'ECS est incroyablement compatible avec l'IA, parce que très structuré/typé. Avec ces règles, je peux review très facilement tout périmètre codé par mon LLM, en inspectant simplement :
- les composants créés dans les fichiers dédiés (vérification des doublons et de la pertinence des champs)
- les systèmes créés (vérification de leur nom / fonction)
- les éléments de déclenchement/filtrage des systèmes (combien de queries ? quels états filtrent-elles ? le système est-il ponctuel et nécessite-t-il un déclencheur contrôlé ?)

Ces 3 règles de review me permettent de filtrer la quasi-intégralité des problèmes de performance. Ensuite, je peux me concentrer sur les systèmes les plus consommateurs qui font des calculs complexes, mais c'est à la marge. L'ECS devient alors un immense assemblage de petits systèmes `boilerplate`, avec un périmètre et des conditions d'exécution très restreintes, qui est une forme de **micro-segmentation** locale.

J'espère que ces règles vous aideront à cadrer vos projets en tout cas !

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
