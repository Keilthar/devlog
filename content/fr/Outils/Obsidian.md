---
title: 📖 Gestion de projet - Obsidian
hidden: false
---

<style>
    p, li, div { text-align: justify; }
</style>

<!-- Tip -->
<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <a href="https://obsidian.md" target="_blank">Site officiel d'Obsidian</a>
        </div>
        <div class="callout-content">
            <div class="callout-content-inner">
                <img src="/static/png/Kanban_System.webp" alt="Unity ECS" width="100%"/>
            </div>
        </div>
    </blockquote>
</div>

---

🌈 **Le produit miracle est arrivé ! (non)**

Ah, le suivi de projet, les tickets, la documentation et la synchronisation Git... une grande passion qui anime tous les développeurs et développeuses de ce monde.
C'est une certaine définition de l'enfer que d'essayer d'industrialiser tout ça (on te déteste tous, **Jira** 😠).

Sauf qu'on a eu un nouvel arrivant dans le game : <span style="color: steelblue;">l'IA</span>. Alors si j'ai encore quelques doutes sur la future fin du métier de développeur et l'avènement du vide-coding, il y a un truc sur lequel l'IA est vachement bonne : l'application de **patterns** et la gestion de fichiers <span style="color: steelblue;">markdown</span> (`.md` pour les intimes).

Et vous savez quoi ? Il y a justement un outil de gestion de notes qui gère tout avec des fichiers Markdown : <a href="https://obsidian.md" target="_blank">Obsidian</a>. Son truc, c'est de centraliser des notes `.md`, au travers des metadata de leur frontmatter, ce qui permet de générer des vues et des représentations de type Kanban.

Début 2026, j'ai eu une illumination et je me suis dit qu'il y avait moyen d'entièrement automatiser le processus de gestion de projet en combinant **Obsidian pour le frontend et l'IA pour le backend** (mon cœur d'ingénieur qui saigne fort à l'écriture de cette phrase... 😭).

Ce que je vais vous présenter ici, c'est donc un **processus de gestion de projet via Obsidian, centralisé dans la codebase et automatisé par IA** (applicable au game dev ou non) :
- une <span style="color: steelblue;">centralisation documentataire</span> (spécifications fonctionnelles / techniques, dossier d'architecture / exploitation, schémas Excalidraw et Mermaid, dossiers de références de design...)
- une <span style="color: steelblue;">centralisation des skills IA</span>, qui deviennent agnostiques vis-à-vis de votre provider une fois le setup fait, avec une réplication automatisée de skills minimalistes à tous les clients IA présents dans le projet
- un <span style="color: steelblue;">workflow Kanban automatisé</span>, géré au travers de la discussion avec l'IA
- une <span style="color: steelblue;">synchronisation</span> de la rédaction des <span style="color: steelblue;">commits Git</span> avec le <span style="color: steelblue;">ticket Kanban</span> associé
- un <span style="color: steelblue;">suivi de projet intégré au code</span> : chaque partie d'une feature livrée est commitée ensemble (doc, tickets et code)

---
<div style="display: flex; gap: 20px; align-items: center;">
    <div>
            <img src="/static/png/Obsidian/Kanban_Interne.png" alt="Kanban Interne" width="100%"/>
            <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban par domaine fonctionnel, manipulé par IA</span></div>
    </div>
    <div>
        <img src="/static/png/Obsidian/Kanban_Base.png" alt="Kanban Base" width="100%"/>
        <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban global, synchronisé par metadata Obsidian</span></div>
    </div>
</div>

---
Le concept vous intéresse ? Je vous renvoie vers la page GitHub pour les **processus d'installation et d'utilisation** : https://github.com/Keilthar/Obsidian-Workflow

**Mon ressenti personnel sur cet outil**

Ça m'enlève une charge folle de gestion de l'avancement pour un projet ambitieux comme le mien. J'ai maintenant un workflow simple pour stocker une idée, puis la décomposer avec l'IA en tâches logiques, que je peux traiter au fil de l'eau sans devoir réexpliquer où on en est, ce qu'on a fait, où on va et pourquoi... ce qui est une charge mentale conséquente quand on travaille avec l'IA (le babysitting virtuel 🍼).

J'y gagne aussi une documentation fiable (que je ne lis absolument pas, l'IA me la résume 😌... un autre sujet qui serait d'ailleurs fort intéressant à philosopher : a-t-on encore besoin de docs dédiées aux humains ?).

Et un Git beaucoup plus propre, que ce soit au niveau déclaratif (titre standardisé, description complète), en termes de découpage (lots de fichiers logiques agrégés par l'IA et non plus par ma flemme monumentale) ou de récurrence (je tends lentement vers du commit plus atomique).

**Suite du devlog**

Ici, on ne va pas s'intéresser à comment s'en servir (vous avez un beau README pour ça), mais à comment je l'ai designé, avec la logique sous-jacente et les problématiques, ainsi qu'à la manière dont je l'ai implémenté pour mon gamedev.

---

**L'allègement par segmentation**

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <img src="/static/png/IndieDev_OneManArmy.jpg" alt="Worktree Obsidian" width="100%"/>
    </div>
    <div style="flex: 1;">

Le **gamedev** a une certaine particularité : on a **des périmètres fonctionnels très distincts** à devoir gérer dans la même application.

Gérer le comportement et le pathfinding des unités, ça n'a rien à voir avec la gestion des inputs du joueur pour contrôler son personnage, qui n'a rien à voir avec la gestion des assets pour générer la carte, etc., etc., etc.

(et je ne vous parle même pas des sous-sections avec les besoins spécifiques par corps de métier entre dev, design 2D/3D, animation, VFX, UI/UX, sound design...)
    </div>
</div>

Et même si certaines features peuvent être à la croisée de plusieurs périmètres fonctionnels, c'est quand même pratique de pouvoir organiser l'information par domaine. Ça a donc été l'un des principes cœur de mon design : la possibilité de **segmenter la gestion du projet** et de ne pas tout avoir dans un immense Kanban où je vais devoir filtrer parmi des dizaines de périmètres à chaque manipulation.

Dans le cadre de mon jeu, la structure ressemble à ça :

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <img src="/static/png/Obsidian/Worktree.png" alt="Worktree Obsidian" width="100%"/>
    </div>
    <div style="flex: 1;">

**<span style="color: pink;">/AI/Generic</span>** : ensemble des procédures utilisées par l'IA. Ce dossier est **agnostique**, indépendant du projet concerné et de l'IA qui va s'en servir.
Il contient :
- les processus pour interagir avec **<span style="color: pink;">/Obsidian</span>** et **<span style="color: pink;">/Git</span>**
- des skills transverses (exemple : **<span style="color: pink;">/SuperPowers</span>**)
- mes skills perso de coding (exemple : **<span style="color: pink;">/Unity</span>**), qui mériteront un article dédié tellement ça rend le coding par IA plus agréable...

`Project_Management_Workflow.md` est le <span style="color: steelblue;">point d'entrée</span> du répertoire : il décrit à l'IA comment et quand utiliser la documentation dans ces répertoires.


**<span style="color: pink;">/AI/Project</span>** : contient des éléments indicatifs spécifiques au projet pour donner du contexte à l'IA.

`Project_Description.md` est le <span style="color: steelblue;">point d'entrée</span> de ce répertoire : il contient une description générale du jeu et référencera d'autres docs au besoin (exemple `ToDo`)

---

**<span style="color: orange;">Domains</span>** :
- un **répertoire par domaine fonctionnel** de mon jeu. Chaque répertoire porte sa <span style="color: orange;">documentation</span>, un <span style="color: orange;">Kanban dédié</span> et les <span style="color: orange;">notes</span> associées aux <span style="color: orange;">tickets</span>
- deux fichiers `.base`, <span style="color: orange;">Documentation - Project</span> et <span style="color: orange;">Kanban - Project</span> : ce sont des **Kanbans globaux** qui listent respectivement toute la doc et tous les tickets existants dans le vault Obsidian

---

**<span style="color: gold;">Templates</span>** : templates utilisés par l'IA pour ajouter de nouveaux domaines avec toute l'arborescence et créer des tickets Kanban normalisés.
    </div>
</div>

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>Mini Kanbans et IA : le combo gagnant (de tokens)</span></div>
        </div>
        <div style="display: flex; gap: 20px; align-items: center;">
            <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                    <img src="/static/Gifs/smart.gif" alt="Smart" width="100%"/>
            </div>
            <div style="flex: 1;">
                <span>
Même si vous n'avez pas un besoin impérieux d'un tel découpage fonctionnel, vous y avez tout de même un intérêt économique :

ne pas faire exploser le contexte de l'IA en lui faisant charger un kanban unique composé de centaines de tickets (voire plus si vous faites des tickets/commits atomiques) !

Et pour un Kanban global de suivi d'un MVP ? Des fichiers <span style="color: steelblue;">BASE</span> ! C'est une feature d'agrégation d'<span style="color: steelblue;">Obsidian</span> utilisant les metadata des tickets => 0 coût IA !
                </span>
            </div>
        </div>
    </blockquote>
</div>

----

**Le big brain AI 🧠**

Comme je l'ai déjà mentionné, le setup IA se veut le plus **agnostique** et **centralisé** que possible. Mais vous allez me dire : pourquoi ?

Eh bien, j'ai deux problèmes majeurs :
- le premier : quand je change une procédure et que je switch d'une IA à l'autre (au hasard Claude et Codex), je suis obligé de **dupliquer** laborieusement les procédures dans tous les sous-répertoires concernés
- le second : j'ai des skills qui se superposent en termes de process. Par exemple, le skill `git commit` et le skill `project-management` ont tous les deux besoin d'accéder à la procédure de lecture/édition d'un ticket. Sans centralisation, je me retrouve à dupliquer la même procédure dans les deux skills. Et si je veux la changer et que j'en oublie un... kaboum 💥

L'idée est donc de créer un système à trois niveaux de responsabilités :
- des fichiers minimalistes côté AI providers : ils ne portent aucune responsabilité fonctionnelle et ne font que consommer des points d'entrée centralisés dans le vault
- ces points d'entrée ne vont définir qu'une logique d'enchaînement d'actions, mais pas le détail de l'action elle-même
- des procédures détaillées par actions (`Ticket_Create`, `Ticket_Move`, `Ticket_Remove`) qui peuvent être <span style="color: orange;">consommées par plusieurs points d'entrée</span>

<img src="/static/png/Obsidian/AI_Centralization.png" alt="Kanban Interne" width="100%"/>

C'est littéralement du **KISS appliqué à de la gestion de projet**. Chaque acteur a un périmètre restreint :
- l'AI provider est l'interface pour le client
- l'entry point est l'interface pour l'AI provider
- le process est le consommable de bout de chaîne, partageable et atomique

Côté IA, on se retrouve alors avec des fichiers d'une simplicité déconcertante : une simple liste de lecture, parfois associée à un trigger contextuel.

<img src="/static/png/Obsidian/AI_MDs.png" alt="Kanban Interne" width="100%"/>

Et donc, pour aller au bout de la démarche, j'ai créé un skill qui crée des skills minimalistes et les duplique entre tous les clients IA détectés dans le répertoire.

Je ne me pose donc plus de question désormais sur la synchronisation de mes IA avec mes process : seuls comptent mes points d'entrée et les processus unitaires par action en dessous. (C'est un peu drôle d'ailleurs, c'est l'exacte même approche que ma façon d'implémenter l'ECS, c'est du **data driven project management** par essence 😍)

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>À quoi servent les 2 skills vu qu'ils répètent un pointeur présent dans AGENTS.md et CLAUDE.md ?</span></div>
        </div>
        <div>
            <span>
Parfois l'IA se perd dans son contexte et ne suit plus certaines consignes, ça fait partie de ses inconvénients intrinsèques.

Si je constate une déviance ou après `/compact` de la discussion, je tape simplement `/project-management` ou `/superpowers` pour forcer l'IA à relire les procédures et ainsi les faire remonter dans son contexte. Avec cette technique, je peux maintenir une certaine cohérence de l'IA même dans des discussions longues.
            </span>
        </div>
    </blockquote>
</div>

----

**La metadata, ou plutôt le metasystem AI**

Techniquement parlant, le Kanban n'est qu'un support visuel dans ce process et plus du tout une interface, au sens interactif du terme. L'IA est à la fois le backend (ou plutôt les `.md` qu'elle tente de suivre) et la main invisible, pas du marché, mais du frontend.

Mais on a besoin d'un liant entre les deux couches. Dans une application standard, ce liant est la base de données. Ici, la base de données, ce sont les <span style="color: steelblue;">metadata</span> (au sens littéral du terme : la donnée de la donnée).

Et dans le cadre de ce combo IA et Obsidian, on a deux sources de <span style="color: steelblue;">metadata</span> :
- les `.md` qui portent la <span style="color: steelblue;">description contextuelle des actions</span> (descriptif projet, suite logique d'actions, documentation technique et fonctionnelle...), qui sont les <span style="color: steelblue;">rails</span> permettant à l'IA de savoir pourquoi elle fait ce qu'elle fait et comment. La logique backend, en soi. Sans ça, vous finissez avec un conducteur aveugle qui suivrait les ordres vocaux d'un GPS : "tournez à gauche". Pourquoi ? Quel angle ? Quelle vitesse ? Je sais pas... boom, le mur. Et c'est pour ça que je traite les fichiers `.md` comme je traite de l'ECS, c'est le même fondement logique.
- les <span style="color: steelblue;">frontmatters des tickets</span>, qui assurent la <span style="color: steelblue;">stabilité du système</span>. De quel état je pars ? Vers quel état je peux aller ? Et cette <span style="color: steelblue;">metadata</span> permet de faire le lien avec la représentation frontend.

Et c'est rigolo, mais en soi, le frontmatter YAML, c'est juste une base de données sur fichier plat. Ici, celui de mes tickets :

```yaml
---
ID:
Description:
domain:
related_domains: []
features: []
status:
mvp:
Created:
Done:
---
```

Et c'est là que la surcouche Obsidian permet d'alléger le processus côté IA. Le fait de pouvoir **agréger** les notes par leur <span style="color: steelblue;">metadata</span> dans des vues, c'est ce qui fait la force du combo pour nous, utilisateurs. Je peux agréger via :
- le plugin **Kanban** qui s'appuie sur un `.md` brut
- la feature <a href="https://obsidian.md/help/bases" target="_blank">BASE</a> qui utilise une `IndexedDB` interne, optimisée pour de l'affichage de type listing / tableau
- voire un script `DataviewJS`, avec son propre moteur d'indexation et une plus grande flexibilité de rendu

En soi, on pourrait faire des rendus bien plus intéressants que ce que j'ai implémenté ici. Et surtout verrouiller le système, empêchant de mauvaises manipulations par l'utilisateur, voire permettre une approche collaborative avec un verrou logique par IA (même si ça n'est pas une solution parfaite).

Bref, je n'ai fait ici qu'effleurer les possibilités. Ça ne reste qu'un side project monté en quelques mois pour m'aider au quotidien dans mon gamedev, qui reste ma priorité. Mais je vois un potentiel énorme comme alternative à ce genre de solution, surtout pour des projets à petite communauté, flexibles et itératifs.

J'espère en tout cas que ça vous donnera envie d'utiliser <span style="color: steelblue;">Obsidian</span>, dont je n'ai que peu développé ici les capacités en tant qu'outil de gestion de notes à part entière.

Sur ce, messieurs-dames, à vos tickets !

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
