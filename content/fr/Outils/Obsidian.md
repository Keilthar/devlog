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

Ce que je vais vous présenter ici, c'est donc un **processus de gestion de projet via Obsidian, centralisé dans la codebase et automatisé par IA** (applicable au game dev ou non) :
- une <span style="color: steelblue;">centralisation documentataire</span> (spécifications fonctionnelles / techniques, dossier d'architecture / exploitation, schémas Excalidraw et Mermaids, dossiers de références de design...)
- une <span style="color: steelblue;">centralisation des skills IA</span> (qui deviennent agnostique de votre provider)
- un <span style="color: steelblue;">workflow Kanban automatisé</span> (vous ne toucherez jamais au kanban et aux tickets vous même, tout est fait par l'IA)
- un <span style="color: steelblue;">alignement</span> de la rédaction des <span style="color: steelblue;">commits GIT</span> sur le <span style="color: steelblue;">ticket Kanban</span> associé
- un <span style="color: steelblue;">suivi de projet intégré au code</span> : quand vous faites un commit, tout est sauvegardé dans le même repo, pas juste le code

Les limites de mon implémentation :
- je n'ai **pas** designé de garde-fou pour des **utilisateurs en parallèle** (même si je pense que c'est possible)
- se retenir absolument de mettre nos mains pateuses d'humain dans le process et **passer par l'IA systématiquement** (elle est dure celle là...)
- un coût d'entrée qui peut être long (dépendra de vos exigences) : il faudra adapter les procédures `.md` pour gérer la chaine selon votre façon de travailler (je vous fournirais en exemple les miens comme base de travail)

Ca fait plusieurs mois que je m'en sers, ça m'a demandé pas mal de rafinement du process mais j'en suis extrêmement satisfait désormais. Et je vous recommande de faire l'effort initial, c'est un investissement sur le long terme que vous ne regretterez pas puisqu'**entièrement transposable d'un projet à un autre** une fois setup.

---

**1 - Installation**

A télécharger : 
- le logiciel Obsidian : https://obsidian.md
- ma config : https://github.com/Keilthar/Obsidian-Workflow
- votre IA coding (mon setup marche avec Claude Sonnet/Opus 4.5 et Codex GPT 5.3)

Ensuite 2 cas, votre projet est-il vierge de configurations IA (`CLAUDE.md`, `AGENTS.md` et/ou répertoires de skills) ?
1. OUI :
   - vous déposez tout le contenu du git à la racine de votre projet
2. NON :
   - vous déposez le répertoire `/Obsidian` à la racine de votre projet
   - vous déposer les 2 skills `project-management` / `superpowers` dans le sous-répertoire `/skills` de votre IA
(si vous avez déjà `superpowers`, ce skill ne rentre pas en conflit, c'est un simple wrapper qui regroupe en 1 commande tous les sous-skills stockés dans `/Obsidian`)
   - vous ajoutez le contenu de `CLAUDE.md` ou `AGENTS.md` (ils sont identiques) dans l'existant.

Ensuite vous ouvrez <span style="color: steelblue;">Obsidian</span>, vous ouvrez le répertoire `/Obsidian` en tant que coffre et ça vous demandera si vous me faîtes confiance (et je vous lâche mon meilleur : **trust me bro**).

Installation terminée.

---

**2 - Utilisation**

Vous avez un <span style="color: steelblue;">Example - Network</span> pour vous montrer la structure, je vous laisse le parcourir (spoiler : il est rigolo). Vous pouvez **supprimer ce répertoire** une fois que nous n'en avez plus besoin.

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <img src="/static/png/Obsidian/Example_Network.png" alt="Worktree Obsidian" width="100%"/>
    </div>
    <div style="flex: 1;">
Dans <span style="color: orange;">Domains</span> vous trouverez toute la structure de gestion du projet.

Un domaine représente un périmètre fonctionnel de l'application (un bloc de travail métier). Vous pourrez donc créer autant de domaines que vous le souhaiter (ou juste un seul si vous n'aimez pas le concept).

Chaque domaine contient :

- sa documentation
- ses tickets par phase
- un kanban dédié
- un fichier `info.md` qui permet à l'IA d'incrémenter les tickets avec un ID unique

Sous les dossiers domaines, vous avez 2 fichiers <span style="color: steelblue;">BASE</span>, qui sont des **kanbans globaux** gérés par <span style="color: steelblue;">Obsidian</span> (l'IA n'intervient pas dessus) :
- `Documentation - Project` liste toute la documentation existante
- `Kanban - Project` liste tous les tickets existants

Ils permettent de faire le suivi global du projet.
    </div>
</div>

---

<div style="display: flex; gap: 20px; align-items: center;">  
    <div>
            <img src="/static/png/Obsidian/Kanban_Interne.png" alt="Kanban Interne" width="100%"/>
            <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban par domaine, manipulé par l'IA</span></div>
    </div>
    <div>
        <img src="/static/png/Obsidian/Kanban_Base.png" alt="Kanban Base" width="100%"/>
        <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban globale <span style="color: steelblue;">BASE</span>, synchronisé par Obsidian</span></div>
    </div>
</div>  

---

Globalement l'utilisation est très simple, vous pouvez demander à l'IA :
1. de <span style="color: steelblue;">créer un domaine</span> :
   - elle vous demandera son nom et un préfixe de 3-4 lettres qui identifie les tickets qui lui sont liés (exemple Domaine Network -> préfixe NTW -> tickets NTW001, NTW002...)
   - elle vous créera toute l'arborescence à partir du template
2. de <span style="color: steelblue;">créer un nouveau ticket</span>, elle vous demandera la phase dans laquelle le placer (`Unplanned` ou `Planned`)
   - `Unplanned` : permet de référencer des idées, sans convention stricte sur le format du ticket
   - `Planned` : suit un process ticket strict, avec un identifiant unique du ticket, une description, un sommaire et une liste de tâches. Vous avez aussi la possibilité de lier le ticket à des <span style="color: steelblue;">related-domaine</span>, de gérer des notions de <span style="color: steelblue;">features</span> et de l'associer à un <span style="color: steelblue;">MVP</span> (notions que vous retrouverez dans le Kanban général <span style="color: steelblue;">BASE</span>)
3. de <span style="color: steelblue;">gérer un ticket existant</span> :
    - elle vous demandera son ID
    - elle pourra l'alimenter à votre demande, par exemple en résumant à l'intérieur les actions définies pendant un `/plan` ou un `brainstorm` de <span style="color: steelblue;">SuperPowers</span>
    - elle gèrera les changements de phases
4. de faire un <span style="color: steelblue;">GIT commit lié à un ticket</span>
    - le commit portera par défaut l'ID du ticket et un titre court dans son nom
    - elle récupèrera automatiquement le contenu du ticket et l'injectera dans la description du commit
    - vous pouvez faire des commits intermédiaires (ticket pas encore entièrement traité), elle suivra le même process, vous aurez juste des tâches non validées dans la description

Quelques règles simples :
- vous pouvez éditer les informations du ticket vous même
- ne touchez pas aux metadatas du ticket (sinon vous risquez de sortir le ticket des Kanbans globaux <span style="color: steelblue;">BASE</span>). L'IA pourra corriger le coût ça au cas où.
- ne faites pas de drag&drop des tickets pour les changer de phase : ça ne casse rien en soit, mais par contre, la metadata n'étant pas mise à jour par cette action, les Kanbans globaux <span style="color: steelblue;">BASE</span> ne seront pas à jour. Bouger un ticket de phase => demandez à l'IA.
- si vous vous rendez compte que l'IA ne suit plus correctement la procédure, invoquez le skill `/project-management` pour qu'elle relise la doc

Et voilà, rien de plus compliqué.

Dans la suite de l'article, je vous explique l'architecture, comment ça marche et le pourquoi du comment j'ai fais certains choix de design. Si vous voulez customiser le fonctionnement, je vous invite à y jeter un oeil sinon vous pouvez arrêter votre lecture ici. 😉

---

**3 - Structure des répertoires**

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
                    <img src="/static/Gifs/smart.gif" alt="Smart" width="100%"/>
            </div>
            <div style="flex: 1;">
                <span>
Question de contexte et de tokens !

L'idée est d'avoir des kanbans taille réduite, que l'IA va pouvoir gérer sans exploser son contexte à parcourir des dizaines, voir centaines, de tickets à chaque interaction.

Mais comme on a quand même besoin d'un Kanban global pour le suivi d'un MVP par exemple, j'utilise les fichiers Kanban `base`, qui est une feature d'<span style="color: steelblue;">Obsidian</span> utilisant les metadatas dans les frontmatters des tickets (c'est à ça que sert Obsidian à la base ! Gérer des notes et des metadatas).
                </span>
            </div>
        </div>      
    </blockquote>
</div>

----

**4 - Configuration IA**

Comme je l'ai déjà mentioné, le setup se veut le plus **agnostique** et **centralisé** que possible. L'idée est donc que les fichiers dans les répertoires standards des IA ne portent aucune responsabilité et pointent simplement vers des <span style="color: steelblue;">points d'entrée</span> dans <span style="color: steelblue;">Obsidian</span>. Vous n'aurez ensuite plus jamais besoin de les retoucher.

Exemple pour mon setup, 1 `CLAUDE.md` et 2 fichiers `SKILL.md` minimalistes :

<img src="/static/png/Obsidian/AI_MDs.png" alt="Kanban Interne" width="100%"/>  

*J'ai les exactes même fichiers pour Codex avec un `AGENTS.md` et les mêmes 2 `SKILL.md`. J'ai donc simplement à changer l'information dans un <span style="color: steelblue;">point d'entrée</span> dans <span style="color: steelblue;">Obsidian</span> et mes 2 IAs seront alignées sans aucune autre action. Plus besoin de dupliquer des `.md` dans leurs arborescences respectives !*

Ainsi non seulement <span style="color: steelblue;">Obsidian</span> héberge ma documentation projet, mais il porte aussi la data comportementale de l'IA qui le gère. Je peux donc pull mon repo GIT sur un nouveau poste et je retrouve mon IA dans mon setup projet.

Mieux ! Demain je crée un nouveau projet sous Unity ? Je n'ai qu'à :
- dupliquer mon répertoire `/Obsidian`
- supprimer les répertoires de **<span style="color: orange;">Domains</span>**
- réécrire une description du projet 

et je suis instantanément prêt à travailler.

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>A quoi servent les 2 skills vu qu'ils répètent un pointeur présent dans AGENTS.md et CLAUDE.md ?</span></div>
        </div>
        <div>
            <span>
 Parfois l'IA se perd dans son contexte et ne suivra plus certaines consignes, ça fait parti de leurs inconvénients intrinsèques. 
 
 Si je constate une déviance ou après `/compact` de la discussion, je tape simplement `/project-management` ou `/superpowers` pour forcer l'IA à relire les procédures et ainsi les faire remonter dans son contexte. Avec cette technique, je peux maintenir une consistance de l'IA même dans des discussions longues.
            </span>
        </div>
    </blockquote>
</div>



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