---
title: 📖 Gestion de projet - Obsidian
hidden: true
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

**Introduction**

Ha le suivi de projets, les tickets, la documentation et la synchronisation Git... une grande passion qui anime tout les développeurs et développeuses de ce monde.
C'est une certaine définition de l'enfer que d'essayer d'avoir une industrialisation de tout ça (on te déteste tous **Jira**).

Sauf qu'on a eu un nouvel arrivant dans le game : <span style="color: steelblue;">l'IA</span>. Alors si j'ai encore quelques doutes sur la future fin du métier de développeur et l'avènement du vide-coding, y a un truc sur lequel l'IA est vachement bonne : l'application de **patterns** et la gestion de fichiers <span style="color: steelblue;">markdown</span> (`.md` pour les intimes).

Et vous savez quoi ? Bah y a un outil de gestion de notes qui gère tout avec des markdowns : <a href="https://obsidian.md" target="_blank">Obsidian</a>. Je m'en servais déjà depuis 1 an pour gérer des notes personnelles et créer des schémas Excalidraw pour mon jeu. Début 2026, j'ai eu une illumination et je me suis dis qu'il y aurait moyen d'entièrement automatiser le process de gestion de projet en combinant Obsidian à une IA.

Ce que je vais vous présenter ici, c'est donc un **processus de gestion de projet centralisé dans la codebase et automatisé par IA** (orienté game dev ou non) :
- une <span style="color: steelblue;">centralisation documentataire</span> (spécifications fonctionnelles / techniques, dossier d'architecture / exploitation, schémas Excalidraw et Mermaids, dossiers de références de design...)
- une <span style="color: steelblue;">centralisation des skills IA</span> (qui deviennent agnostique de votre provider)
- un <span style="color: steelblue;">workflow Kanban automatisé</span> (vous ne toucherez jamais au kanban et aux tickets vous même, tout est fait par l'IA)
- un <span style="color: steelblue;">alignement</span> de la rédaction des <span style="color: steelblue;">commits GIT</span> sur le <span style="color: steelblue;">ticket Kanban</span> associé
- un <span style="color: steelblue;">suivi de projet intégré au code</span> : quand vous faites un commit, tout est sauvegardé, pas juste le code

Les limites de mon implémentation :
- je n'ai pas designé de garde-fou pour des utilisateurs en parallèle (même si je pense que c'est possible)
- se retenir absolument de mettre nos mains pateuses d'humain dans le process et passer par l'IA systématiquement (elle est dure celle là...)
- un coût d'entrée long : il faudra faire créer par l'IA les skills nécessaires pour gérer la chaine selon votre façon de travailler (je vous fournirais en exemple les miens, mais c'est un process perso adapté à mon workflow gamedev, pas forcément pertinent pour vous)

Ca fait plusieurs mois que je m'en sers, ça m'a demandé pas mal de rafinement du process mais j'en suis extrêmement satisfait désormais. Et je vous recommande de faire l'effort initial, c'est un investissement long terme que vous ne regretterez pas puisqu'**entièrement transposable d'un projet à un autre**.

---

**1 - Pré-requis**

A télécharger : 
- <a href="https://obsidian.md" target="_blank">Obsidian</a>
- votre IA coding (mon setup marche parfaitement avec Claude Sonnet 4.5 et GPT 5.3)

Ensuite on setup Obsidian :
1. l'idée est donc d'avoir la gestion de projet dans votre codebase. Pour ça, **à la racine de votre projet**, vous **créez un dossier `/Obsidian`** qui contiendra presque tout ce qu'on déploiera ici.

2. dans **Obsidian**, vous **créez un Vault dans ce répertoire**. Ca vous ajoutera un répertoire caché `.Obsidian`, qui portera les configs de l'outil.
Note : si vous ajoutez Obsidian à .gitignore, ce répertoire ne sera pas sauvegardé. Perso j'aime bien pouvoir tout retrouver ISO quand je change de machine, mais c'est à votre convenance !

---

**2 - Structure des répertoires**

Voici comment j'ai architecturé mon vault Obsidian :

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <img src="/static/png/Obsidian/Worktree.png" alt="Worktree Obsidian" width="100%"/>
    </div>
    <div style="flex: 1;">

**<span style="color: pink;">/AI/Generic</span>** : ensemble des procédures utilisées par l'IA. Ce dossier est **agnostique**, indépendant du projet concerné et de l'IA qui va s'en servir.
Il contient :
- les process pour interagir avec **<span style="color: pink;">/Obsidian</span>** et **<span style="color: pink;">/Git</span>**
- mes skills (exemple : **<span style="color: pink;">/SuperPowers</span>**)
- mes conventions de codes (exemple : **<span style="color: pink;">/Unity</span>**)

`Project_Management_Workflow.md` est le <span style="color: steelblue;">point d'entrée</span> du répertoire : il décrit à l'IA comment/quand utiliser la documentation dans ces répertoires.


**<span style="color: pink;">/AI/Project</span>** : contient des éléments indicatifs spécifiques au projet pour donner du contexte à l'IA.

`Project_Description.md` est le <span style="color: steelblue;">point d'entrée</span> de ce répertoire : il contient une description générale de l'application et référencera d'autres docs au besoin (exemple `ToDo`)

---

**<span style="color: orange;">Domains</span>** :
- un **répertoire par domaine fonctionnel** de mon application. Chaque répertoire portera sa <span style="color: orange;">documentation</span>, un <span style="color: orange;">Kanban dédié</span> et les <span style="color: orange;">notes</span> associées aux <span style="color: orange;">tickets</span>
- 2 fichiers `base`, <span style="color: orange;">Documentation - Project</span> et <span style="color: orange;">Kanban - Project</span> : ce sont des **Kanbans globaux** qui listent respectivement toute la doc et tous les tickets existants dans le vault Obsidian

---

**<span style="color: gold;">- Templates</span>** : templates utilisés par l'IA pour ajouter de nouveaux domaines avec toute l'arborescence et à créer des tickets Kanban normalisés.
    </div>
</div>

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>Pourquoi plusieurs Kanbans dans le projet ?</span></div>
        </div>
        <div style="display: flex; gap: 20px; align-items: center;">  
            <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                    <img src="/static/gifs/smart.gif" alt="Smart" width="100%"/>
            </div>
            <div style="flex: 1;">
                <span>
Question de contexte et de tokens !

L'idée est d'avoir des kanbans taille réduite, que l'IA va pouvoir gérer sans exploser son contexte à parcourir des dizaines, voir centaines, de tickets à chaque interaction.

Mais comme on a quand même besoin d'un Kanban global pour le suivi d'un MVP par exemple, j'utilise les fichiers Kanban `base`, qui est une feature d'**Obsidian** utilisant les metadatas dans les frontmatters des tickets (c'est à ça que sert Obsidian à la base ! Gérer des notes et des metadatas).
                </span>
            </div>
        </div>
        <div style="display: flex; gap: 20px; align-items: center;">  
            <div>
                    <img src="/static/png/Obsidian/Kanban_Interne.png" alt="Kanban Interne" width="100%"/>
                    <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban par domaine, manipulé par l'IA</span></div>
            </div>
            <div>
                <img src="/static/png/Obsidian/Kanban_Base.png" alt="Kanban Base" width="100%"/>
                <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban globale, `base` synchronisé par Obsidian</span></div>
            </div>
        </div>        
    </blockquote>
</div>

----

**Setup IA**

Comme je l'ai déjà mentioné, le stetup se veut le plus **agnostique** et **centralisé** que possible. L'idée est donc que les fichiers des IA ne portent aucune responsabilité et pointent simplement vers des <span style="color: steelblue;">points d'entrée</span> dans **Obsidian** et vous n'aurez ensuite plus jamais besoin de les retoucher.

Exemple pour mon setup, 1 `CLAUDE.md` et 2 fichiers `SKILL.md` minimalistes :

<img src="/static/png/Obsidian/AI_MDs.png" alt="Kanban Interne" width="100%"/>  

*J'ai l'exact même setup pour Codex avec un `AGENTS.md` : j'ai donc simplement à changer l'information dans un <span style="color: steelblue;">point d'entrée</span> et mes 2 IAs seront alignées, pas besoin de dupliquer l'info dans chaque fichier de config d'IA !*

A quoi me servent

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