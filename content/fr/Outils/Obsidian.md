---
title: ?? Gestion de projet - Obsidian
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
                <a href="/static/png/Kanban_System.webp" target="_blank"><img src="/static/png/Kanban_System.webp" alt="Unity ECS" width="100%"/></a>
            </div>
        </div>
    </blockquote>
</div>

<p style="text-align: center;"><a href="../index.xml">🔊 S'abonner au flux RSS</a></p>

---

?? **Le produit miracle est arriv� ! (non)**

Ah, le suivi de projet, les tickets, la documentation et la synchronisation Git... une grande passion qui anime tous les d�veloppeurs et d�veloppeuses de ce monde.
C'est une certaine d�finition de l'enfer que d'essayer d'industrialiser tout �a (on te d�teste tous, **Jira** ??).

Sauf qu'on a eu un nouvel arrivant dans le game : <span style="color: steelblue;">l'IA</span>. Alors si j'ai encore quelques doutes sur la future fin du m�tier de d�veloppeur et l'av�nement du vide-coding, il y a un truc sur lequel l'IA est vachement bonne : l'application de **patterns** et la gestion de fichiers <span style="color: steelblue;">markdown</span> (`.md` pour les intimes).

Et vous savez quoi ? Il y a justement un outil de gestion de notes qui g�re tout avec des fichiers Markdown : <a href="https://obsidian.md" target="_blank">Obsidian</a>. Son truc, c'est de centraliser des notes `.md`, au travers des metadata de leur frontmatter, ce qui permet de g�n�rer des vues et des repr�sentations de type Kanban.

D�but 2026, j'ai eu une illumination et je me suis dit qu'il y avait moyen d'enti�rement automatiser le processus de gestion de projet en combinant **Obsidian pour le frontend et l'IA pour le backend** (mon c�ur d'ing�nieur qui saigne fort � l'�criture de cette phrase... ??).

Ce que je vais vous pr�senter ici, c'est donc un **processus de gestion de projet via Obsidian, centralis� dans la codebase et automatis� par IA** (applicable au game dev ou non) :
- une <span style="color: steelblue;">centralisation documentataire</span> (sp�cifications fonctionnelles / techniques, dossier d'architecture / exploitation, sch�mas Excalidraw et Mermaid, dossiers de r�f�rences de design...)
- une <span style="color: steelblue;">centralisation des skills IA</span>, qui deviennent agnostiques vis-�-vis de votre provider une fois le setup fait, avec une r�plication automatis�e de skills minimalistes � tous les clients IA pr�sents dans le projet
- un <span style="color: steelblue;">workflow Kanban automatis�</span>, g�r� au travers de la discussion avec l'IA
- une <span style="color: steelblue;">synchronisation</span> de la r�daction des <span style="color: steelblue;">commits Git</span> avec le <span style="color: steelblue;">ticket Kanban</span> associ�
- un <span style="color: steelblue;">suivi de projet int�gr� au code</span> : chaque partie d'une feature livr�e est commit�e ensemble (doc, tickets et code)

---
<div style="display: flex; gap: 20px; align-items: center;">
    <div>
            <a href="/static/png/Obsidian/Kanban_Interne.png" target="_blank"><img src="/static/png/Obsidian/Kanban_Interne.png" alt="Kanban Interne" width="100%"/></a>
            <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban par domaine fonctionnel, manipul� par IA</span></div>
    </div>
    <div>
        <a href="/static/png/Obsidian/Kanban_Base.png" target="_blank"><img src="/static/png/Obsidian/Kanban_Base.png" alt="Kanban Base" width="100%"/></a>
        <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban global, synchronis� par metadata Obsidian</span></div>
    </div>
</div>

<p style="text-align: center;"><a href="../index.xml">🔊 S'abonner au flux RSS</a></p>

---
Le concept vous int�resse ? Je vous renvoie vers la page GitHub pour les **processus d'installation et d'utilisation** : https://github.com/Keilthar/Obsidian-Workflow

**Mon ressenti personnel sur cet outil**

�a m'enl�ve une charge folle de gestion de l'avancement pour un projet ambitieux comme le mien. J'ai maintenant un workflow simple pour stocker une id�e, puis la d�composer avec l'IA en t�ches logiques, que je peux traiter au fil de l'eau sans devoir r�expliquer o� on en est, ce qu'on a fait, o� on va et pourquoi... ce qui est une charge mentale cons�quente quand on travaille avec l'IA (le babysitting virtuel ??).

J'y gagne aussi une documentation fiable (que je ne lis absolument pas, l'IA me la r�sume ??... un autre sujet qui serait d'ailleurs fort int�ressant � philosopher : a-t-on encore besoin de docs d�di�es aux humains ?).

Et un Git beaucoup plus propre, que ce soit au niveau d�claratif (titre standardis�, description compl�te), en termes de d�coupage (lots de fichiers logiques agr�g�s par l'IA et non plus par ma flemme monumentale) ou de r�currence (je tends lentement vers du commit plus atomique).

**Suite du devlog**

Ici, on ne va pas s'int�resser � comment s'en servir (vous avez un beau README pour �a), mais � comment je l'ai design�, avec la logique sous-jacente et les probl�matiques, ainsi qu'� la mani�re dont je l'ai impl�ment� pour mon gamedev.

---

**L'all�gement par segmentation**

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <a href="/static/png/IndieDev_OneManArmy.jpg" target="_blank"><img src="/static/png/IndieDev_OneManArmy.jpg" alt="Worktree Obsidian" width="100%"/></a>
    </div>
    <div style="flex: 1;">

Le **gamedev** a une certaine particularit� : on a **des p�rim�tres fonctionnels tr�s distincts** � devoir g�rer dans la m�me application.

G�rer le comportement et le pathfinding des unit�s, �a n'a rien � voir avec la gestion des inputs du joueur pour contr�ler son personnage, qui n'a rien � voir avec la gestion des assets pour g�n�rer la carte, etc., etc., etc.

(et je ne vous parle m�me pas des sous-sections avec les besoins sp�cifiques par corps de m�tier entre dev, design 2D/3D, animation, VFX, UI/UX, sound design...)
    </div>
</div>

Et m�me si certaines features peuvent �tre � la crois�e de plusieurs p�rim�tres fonctionnels, c'est quand m�me pratique de pouvoir organiser l'information par domaine. �a a donc �t� l'un des principes c�ur de mon design : la possibilit� de **segmenter la gestion du projet** et de ne pas tout avoir dans un immense Kanban o� je vais devoir filtrer parmi des dizaines de p�rim�tres � chaque manipulation.

Dans le cadre de mon jeu, la structure ressemble � �a :

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <a href="/static/png/Obsidian/Worktree.png" target="_blank"><img src="/static/png/Obsidian/Worktree.png" alt="Worktree Obsidian" width="100%"/></a>
    </div>
    <div style="flex: 1;">

**<span style="color: pink;">/AI/Generic</span>** : ensemble des proc�dures utilis�es par l'IA. Ce dossier est **agnostique**, ind�pendant du projet concern� et de l'IA qui va s'en servir.
Il contient :
- les processus pour interagir avec **<span style="color: pink;">/Obsidian</span>** et **<span style="color: pink;">/Git</span>**
- des skills transverses (exemple : **<span style="color: pink;">/SuperPowers</span>**)
- mes skills perso de coding (exemple : **<span style="color: pink;">/Unity</span>**), qui m�riteront un article d�di� tellement �a rend le coding par IA plus agr�able...

`Project_Management_Workflow.md` est le <span style="color: steelblue;">point d'entr�e</span> du r�pertoire : il d�crit � l'IA comment et quand utiliser la documentation dans ces r�pertoires.


**<span style="color: pink;">/AI/Project</span>** : contient des �l�ments indicatifs sp�cifiques au projet pour donner du contexte � l'IA.

`Project_Description.md` est le <span style="color: steelblue;">point d'entr�e</span> de ce r�pertoire : il contient une description g�n�rale du jeu et r�f�rencera d'autres docs au besoin (exemple `ToDo`)

---

**<span style="color: orange;">Domains</span>** :
- un **r�pertoire par domaine fonctionnel** de mon jeu. Chaque r�pertoire porte sa <span style="color: orange;">documentation</span>, un <span style="color: orange;">Kanban d�di�</span> et les <span style="color: orange;">notes</span> associ�es aux <span style="color: orange;">tickets</span>
- deux fichiers `.base`, <span style="color: orange;">Documentation - Project</span> et <span style="color: orange;">Kanban - Project</span> : ce sont des **Kanbans globaux** qui listent respectivement toute la doc et tous les tickets existants dans le vault Obsidian

---

**<span style="color: gold;">Templates</span>** : templates utilis�s par l'IA pour ajouter de nouveaux domaines avec toute l'arborescence et cr�er des tickets Kanban normalis�s.
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
                    <a href="/static/Gifs/smart.gif" target="_blank"><img src="/static/Gifs/smart.gif" alt="Smart" width="100%"/></a>
            </div>
            <div style="flex: 1;">
                <span>
M�me si vous n'avez pas un besoin imp�rieux d'un tel d�coupage fonctionnel, vous y avez tout de m�me un int�r�t �conomique :

ne pas faire exploser le contexte de l'IA en lui faisant charger un kanban unique compos� de centaines de tickets (voire plus si vous faites des tickets/commits atomiques) !

Et pour un Kanban global de suivi d'un MVP ? Des fichiers <span style="color: steelblue;">BASE</span> ! C'est une feature d'agr�gation d'<span style="color: steelblue;">Obsidian</span> utilisant les metadata des tickets => 0 co�t IA !
                </span>
            </div>
        </div>
    </blockquote>
</div>

<p style="text-align: center;"><a href="../index.xml">🔊 S'abonner au flux RSS</a></p>

----

**Le big brain AI ??**

Comme je l'ai d�j� mentionn�, le setup IA se veut le plus **agnostique** et **centralis�** que possible. Mais vous allez me dire : pourquoi ?

Eh bien, j'ai deux probl�mes majeurs :
- le premier : quand je change une proc�dure et que je switch d'une IA � l'autre (au hasard Claude et Codex), je suis oblig� de **dupliquer** laborieusement les proc�dures dans tous les sous-r�pertoires concern�s
- le second : j'ai des skills qui se superposent en termes de process. Par exemple, le skill `git commit` et le skill `project-management` ont tous les deux besoin d'acc�der � la proc�dure de lecture/�dition d'un ticket. Sans centralisation, je me retrouve � dupliquer la m�me proc�dure dans les deux skills. Et si je veux la changer et que j'en oublie un... kaboum ??

L'id�e est donc de cr�er un syst�me � trois niveaux de responsabilit�s :
- des fichiers minimalistes c�t� AI providers : ils ne portent aucune responsabilit� fonctionnelle et ne font que consommer des points d'entr�e centralis�s dans le vault
- ces points d'entr�e ne vont d�finir qu'une logique d'encha�nement d'actions, mais pas le d�tail de l'action elle-m�me
- des proc�dures d�taill�es par actions (`Ticket_Create`, `Ticket_Move`, `Ticket_Remove`) qui peuvent �tre <span style="color: orange;">consomm�es par plusieurs points d'entr�e</span>

<a href="/static/png/Obsidian/AI_Centralization.png" target="_blank"><img src="/static/png/Obsidian/AI_Centralization.png" alt="Kanban Interne" width="100%"/></a>

C'est litt�ralement du **KISS appliqu� � de la gestion de projet**. Chaque acteur a un p�rim�tre restreint :
- l'AI provider est l'interface pour le client
- l'entry point est l'interface pour l'AI provider
- le process est le consommable de bout de cha�ne, partageable et atomique

C�t� IA, on se retrouve alors avec des fichiers d'une simplicit� d�concertante : une simple liste de lecture, parfois associ�e � un trigger contextuel.

<a href="/static/png/Obsidian/AI_MDs.png" target="_blank"><img src="/static/png/Obsidian/AI_MDs.png" alt="Kanban Interne" width="100%"/></a>

Et donc, pour aller au bout de la d�marche, j'ai cr�� un skill qui cr�e des skills minimalistes et les duplique entre tous les clients IA d�tect�s dans le r�pertoire.

Je ne me pose donc plus de question d�sormais sur la synchronisation de mes IA avec mes process : seuls comptent mes points d'entr�e et les processus unitaires par action en dessous. (C'est un peu dr�le d'ailleurs, c'est l'exacte m�me approche que ma fa�on d'impl�menter l'ECS, c'est du **data driven project management** par essence ??)

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>� quoi servent les 2 skills vu qu'ils r�p�tent un pointeur pr�sent dans AGENTS.md et CLAUDE.md ?</span></div>
        </div>
        <div>
            <span>
Parfois l'IA se perd dans son contexte et ne suit plus certaines consignes, �a fait partie de ses inconv�nients intrins�ques.

Si je constate une d�viance ou apr�s `/compact` de la discussion, je tape simplement `/project-management` ou `/superpowers` pour forcer l'IA � relire les proc�dures et ainsi les faire remonter dans son contexte. Avec cette technique, je peux maintenir une certaine coh�rence de l'IA m�me dans des discussions longues.
            </span>
        </div>
    </blockquote>
</div>

<p style="text-align: center;"><a href="../index.xml">🔊 S'abonner au flux RSS</a></p>

----

**La metadata, ou plut�t le metasystem AI**

Techniquement parlant, le Kanban n'est qu'un support visuel dans ce process et plus du tout une interface, au sens interactif du terme. L'IA est � la fois le backend (ou plut�t les `.md` qu'elle tente de suivre) et la main invisible, pas du march�, mais du frontend.

Mais on a besoin d'un liant entre les deux couches. Dans une application standard, ce liant est la base de donn�es. Ici, la base de donn�es, ce sont les <span style="color: steelblue;">metadata</span> (au sens litt�ral du terme : la donn�e de la donn�e).

Et dans le cadre de ce combo IA et Obsidian, on a deux sources de <span style="color: steelblue;">metadata</span> :
- les `.md` qui portent la <span style="color: steelblue;">description contextuelle des actions</span> (descriptif projet, suite logique d'actions, documentation technique et fonctionnelle...), qui sont les <span style="color: steelblue;">rails</span> permettant � l'IA de savoir pourquoi elle fait ce qu'elle fait et comment. La logique backend, en soi. Sans �a, vous finissez avec un conducteur aveugle qui suivrait les ordres vocaux d'un GPS : "tournez � gauche". Pourquoi ? Quel angle ? Quelle vitesse ? Je sais pas... boom, le mur. Et c'est pour �a que je traite les fichiers `.md` comme je traite de l'ECS, c'est le m�me fondement logique.
- les <span style="color: steelblue;">frontmatters des tickets</span>, qui assurent la <span style="color: steelblue;">stabilit� du syst�me</span>. De quel �tat je pars ? Vers quel �tat je peux aller ? Et cette <span style="color: steelblue;">metadata</span> permet de faire le lien avec la repr�sentation frontend.

Et c'est rigolo, mais en soi, le frontmatter YAML, c'est juste une base de donn�es sur fichier plat. Ici, celui de mes tickets :

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

Et c'est l� que la surcouche Obsidian permet d'all�ger le processus c�t� IA. Le fait de pouvoir **agr�ger** les notes par leur <span style="color: steelblue;">metadata</span> dans des vues, c'est ce qui fait la force du combo pour nous, utilisateurs. Je peux agr�ger via :
- le plugin **Kanban** qui s'appuie sur un `.md` brut
- la feature <a href="https://obsidian.md/help/bases" target="_blank">BASE</a> qui utilise une `IndexedDB` interne, optimis�e pour de l'affichage de type listing / tableau
- voire un script `DataviewJS`, avec son propre moteur d'indexation et une plus grande flexibilit� de rendu

En soi, on pourrait faire des rendus bien plus int�ressants que ce que j'ai impl�ment� ici. Et surtout verrouiller le syst�me, emp�chant de mauvaises manipulations par l'utilisateur, voire permettre une approche collaborative avec un verrou logique par IA (m�me si �a n'est pas une solution parfaite).

Bref, je n'ai fait ici qu'effleurer les possibilit�s. �a ne reste qu'un side project mont� en quelques mois pour m'aider au quotidien dans mon gamedev, qui reste ma priorit�. Mais je vois un potentiel �norme comme alternative � ce genre de solution, surtout pour des projets � petite communaut�, flexibles et it�ratifs.

J'esp�re en tout cas que �a vous donnera envie d'utiliser <span style="color: steelblue;">Obsidian</span>, dont je n'ai que peu d�velopp� ici les capacit�s en tant qu'outil de gestion de notes � part enti�re.

Sur ce, messieurs-dames, � vos tickets !

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

