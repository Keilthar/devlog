---
title: 📖 Project management - Obsidian
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
            <a href="https://obsidian.md" target="_blank">Official Obsidian website</a>
        </div>
        <div class="callout-content">
            <div class="callout-content-inner">
                <a href="/static/png/Kanban_System.webp" target="_blank"><img src="/static/png/Kanban_System.webp" alt="Kanban" width="100%"/></a>
            </div>
        </div>
    </blockquote>
</div>
<p style="text-align: center;"><a href="../../index.xml">🔊 Subscribe via RSS</a></p>


---

🌈 **The miracle product has arrived! (no)**

Ah yes, project tracking, tickets, documentation, and Git synchronization... a great passion shared by all developers across the world.
Trying to industrialize all that is a fairly solid definition of hell (we all hate you, **Jira** 😠).

But we did get a new player in the game: <span style="color: steelblue;">AI</span>. Now, while I still have a few doubts about the upcoming death of the developer profession and the rise of vibe-coding, there is one thing AI is genuinely very good at: applying **patterns** and handling <span style="color: steelblue;">Markdown</span> files (`.md` for close friends).

And you know what? There just so happens to be a note-taking tool that runs entirely on Markdown files: <a href="https://obsidian.md" target="_blank">Obsidian</a>. Its whole thing is centralizing `.md` notes through frontmatter metadata, which lets it generate views and Kanban-like representations.

At the beginning of 2026, I had a little epiphany and realized there might be a way to fully automate project management by combining **Obsidian for the frontend and AI for the backend** (my engineer heart is bleeding heavily just writing that sentence... 😭).

So what I'm going to present here is a **project management process built through Obsidian, centralized in the codebase, and automated by AI** (for gamedev or anything else):
- a <span style="color: steelblue;">centralized documentation layer</span> (functional and technical specifications, architecture and operations notes, Excalidraw and Mermaid diagrams, design reference folders...)
- a <span style="color: steelblue;">centralized AI skills layer</span>, which becomes provider-agnostic once set up, with automatic replication of minimalist skills to every AI client present in the project
- an <span style="color: steelblue;">automated Kanban workflow</span> driven through conversations with the AI
- <span style="color: steelblue;">synchronized</span> writing of <span style="color: steelblue;">Git commits</span> from the associated <span style="color: steelblue;">Kanban ticket</span>
- <span style="color: steelblue;">project tracking embedded into the code</span>: every part of a delivered feature gets committed together (docs, tickets, and code)

---
<div style="display: flex; gap: 20px; align-items: center;">
    <div>
            <a href="/static/png/Obsidian/Kanban_Interne.png" target="_blank"><img src="/static/png/Obsidian/Kanban_Interne.png" alt="Kanban Interne" width="100%"/></a>
            <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Kanban by functional domain, manipulated by AI</span></div>
    </div>
    <div>
        <a href="/static/png/Obsidian/Kanban_Base.png" target="_blank"><img src="/static/png/Obsidian/Kanban_Base.png" alt="Kanban Base" width="100%"/></a>
        <div style="display: flex; justify-content: center; align-items: center; flex: 1;"><span>Global Kanban, synchronized through Obsidian metadata</span></div>
    </div>
</div>


---
Interested in the concept? Then head over to the GitHub page for the **installation and usage process**: https://github.com/Keilthar/Obsidian-Workflow

**My personal experience with this tool**

It removes a huge amount of progress-tracking overhead from an ambitious project like mine. I now have a simple workflow for storing an idea, then breaking it down with AI into logical tasks that I can handle over time without having to constantly re-explain where we are, what we've done, where we're going, and why... which is a pretty significant mental load when you work with AI (virtual babysitting 🍼).

I also get a reliable documentation layer out of it (which I absolutely do not read, the AI summarizes it for me 😌... that would actually be a pretty fun topic to philosophize about someday: do we still need docs written for humans?).

And I get a much cleaner Git history, whether we're talking about the declarative side of things (standardized title, complete description), how changes are split up (logical file sets grouped by AI instead of by my monumental laziness), or sheer frequency (I'm slowly drifting toward more atomic commits).

**The rest of the devlog**

This article is not about how to use the workflow (you have a nice README for that), but about how I designed it, the logic behind it, the problems it tries to solve, and how I implemented it for my own gamedev setup.

---

**Lighter through segmentation**

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <a href="/static/png/IndieDev_OneManArmy.jpg" target="_blank"><img src="/static/png/IndieDev_OneManArmy.jpg" alt="Worktree Obsidian" width="100%"/></a>
    </div>
    <div style="flex: 1;">

**Gamedev** has a particular trait: we have **very distinct functional scopes** to manage within the same application.

Handling unit behavior and pathfinding has nothing to do with managing player input to control a character, which has nothing to do with managing assets to generate the map, and so on, and so on, and so on.

(and I am not even getting into all the sub-sections with specific needs for each discipline: dev, 2D/3D design, animation, VFX, UI/UX, sound design...)
    </div>
</div>

And even if some features sit at the crossroads of several functional scopes, it is still convenient to organize information by domain. That became one of the core principles of my design: the ability to **segment project management** instead of dumping everything into one giant Kanban board where I have to filter through dozens of scopes every single time I touch something.

In the context of my game, the structure looks like this:

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <a href="/static/png/Obsidian/Worktree.png" target="_blank"><img src="/static/png/Obsidian/Worktree.png" alt="Worktree Obsidian" width="100%"/></a>
    </div>
    <div style="flex: 1;">

**<span style="color: pink;">/AI/Generic</span>**: all the procedures used by the AI. This folder is **agnostic**, independent of the specific project and of the AI that will consume it.
It contains:
- the processes used to interact with **<span style="color: pink;">/Obsidian</span>** and **<span style="color: pink;">/Git</span>**
- cross-cutting skills (example: **<span style="color: pink;">/SuperPowers</span>**)
- my own coding skills (example: **<span style="color: pink;">/Unity</span>**), which honestly deserve their own article because they make AI coding much nicer...

`Project_Management_Workflow.md` is the <span style="color: steelblue;">entry point</span> for this directory: it tells the AI how and when to use the documentation in these folders.


**<span style="color: pink;">/AI/Project</span>**: contains project-specific guidance to give the AI useful context.

`Project_Description.md` is the <span style="color: steelblue;">entry point</span> for this directory: it contains a general description of the game and can reference other docs when needed (for example `ToDo`).

---

**<span style="color: orange;">Domains</span>**:
- one **folder per functional domain** of my game. Each folder carries its own <span style="color: orange;">documentation</span>, a dedicated <span style="color: orange;">Kanban</span>, and the <span style="color: orange;">notes</span> associated with its <span style="color: orange;">tickets</span>
- two `.base` files, <span style="color: orange;">Documentation - Project</span> and <span style="color: orange;">Kanban - Project</span>: these are **global Kanban-style views** listing all documentation and all tickets across the Obsidian vault

---

**<span style="color: gold;">Templates</span>**: templates used by the AI to add new domains with their full folder structure and create normalized Kanban tickets.
    </div>
</div>

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>Mini Kanbans and AI: the winning combo (for tokens)</span></div>
        </div>
        <div style="display: flex; gap: 20px; align-items: center;">
            <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                    <a href="/static/Gifs/smart.gif" target="_blank"><img src="/static/Gifs/smart.gif" alt="Smart" width="100%"/></a>
            </div>
            <div style="flex: 1;">
                <span>
Even if you do not desperately need that kind of functional split, there is still an economic upside to it:

not blowing up your AI context by making it load one giant kanban filled with hundreds of tickets (or more, if you favor atomic tickets and commits)!

And for a global MVP tracking board? `.base` files! It is an <span style="color: steelblue;">Obsidian</span> aggregation feature built on ticket metadata => 0 AI cost!
                </span>
            </div>
        </div>
    </blockquote>
</div>


----

**Big brain AI 🧠**

As I already mentioned, the AI setup aims to be as **agnostic** and **centralized** as possible. But you may ask: why?

Well, I have two major problems:
- first: whenever I change a procedure and switch from one AI to another (say, Claude and Codex totally at random), I have to painstakingly **duplicate** those procedures across every relevant subfolder
- second: some skills overlap in terms of process. For example, the `git commit` skill and the `project-management` skill both need access to the ticket reading/editing procedure. Without centralization, I end up duplicating the same procedure in both skills. And if I want to change it and forget one of them... kaboom 💥

So the idea is to build a system with three levels of responsibility:
- minimalist files on the AI provider side: they carry no functional responsibility and only consume centralized entry points in the vault
- those entry points only define the chaining logic of actions, not the detailed action itself
- detailed action procedures (`Ticket_Create`, `Ticket_Move`, `Ticket_Remove`) that can be <span style="color: orange;">consumed by several entry points</span>

<a href="/static/png/Obsidian/AI_Centralization.png" target="_blank"><img src="/static/png/Obsidian/AI_Centralization.png" alt="Kanban Interne" width="100%"/></a>

This is literally **KISS applied to project management**. Each actor has a narrow scope:
- the AI provider is the interface for the client
- the entry point is the interface for the AI provider
- the process is the end-of-chain consumable, shareable and atomic

On the AI side, that leaves us with files of disarming simplicity: just a reading list, sometimes paired with a contextual trigger.

<a href="/static/png/Obsidian/AI_MDs.png" target="_blank"><img src="/static/png/Obsidian/AI_MDs.png" alt="Kanban Interne" width="100%"/></a>

And to take that logic all the way, I created a skill that creates minimalist skills and duplicates them across every AI client detected in the repository.

So now I no longer worry about synchronizing my AIs with my processes: all that matters are my entry points and the unit processes sitting beneath them. (Which is kind of funny, because it is the exact same approach I use when implementing ECS. This is **data-driven project management** at heart 😍)

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>What are the 2 skills for if they just repeat a pointer already present in AGENTS.md and CLAUDE.md?</span></div>
        </div>
        <div>
            <span>
Sometimes the AI loses the thread and stops following some instructions. That is simply one of its built-in flaws.

If I notice drift, or after a `/compact` in the conversation, I simply type `/project-management` or `/superpowers` to force the AI to reread the procedures and bring them back into context. With that trick, I can maintain a decent level of consistency even in long discussions.
            </span>
        </div>
    </blockquote>
</div>


----

**Metadata, or rather the AI metasystem**

Technically speaking, the Kanban is just a visual support in this process and no longer an interface in the interactive sense of the word. The AI is both the backend (or rather the `.md` files it tries to follow) and the invisible hand, not of the market, but of the frontend.

But we still need a link between those two layers. In a standard application, that link is the database. Here, the database is the <span style="color: steelblue;">metadata</span> (in the literal sense: data about data).

And in the context of this AI + Obsidian combo, we have two sources of <span style="color: steelblue;">metadata</span>:
- the `.md` files carrying the <span style="color: steelblue;">contextual description of actions</span> (project description, logical action flow, technical and functional documentation...), which act as the <span style="color: steelblue;">rails</span> that tell the AI why it is doing what it is doing and how. That is the backend logic, really. Without that, you end up with a blind driver following voice commands from a GPS: "turn left". Why? At what angle? At what speed? No idea... boom, wall. And that is exactly why I treat `.md` files the same way I treat ECS: the underlying logic is the same.
- the <span style="color: steelblue;">ticket frontmatters</span>, which ensure the <span style="color: steelblue;">stability of the system</span>. What state am I starting from? Which state can I move to next? That metadata is what links everything back to the frontend representation.

And it is kind of funny, but in a way, YAML frontmatter is just a flat-file database. Here is the one used for my tickets:

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

And this is where the Obsidian layer lightens the process on the AI side. The ability to **aggregate** notes through their <span style="color: steelblue;">metadata</span> into views is what makes this combo so strong for us users. I can aggregate through:
- the **Kanban** plugin, which relies on a raw `.md`
- the <a href="https://obsidian.md/help/bases" target="_blank">BASE</a> feature, which uses an internal `IndexedDB`, optimized for list and table-like display
- or even a `DataviewJS` script, with its own indexing engine and greater rendering flexibility

In theory, we could build much more interesting visual layers than what I implemented here. And we could also lock the system down to prevent bad user manipulations, or even support a collaborative approach with AI-managed logical locks (even if that would not be a perfect solution).

Anyway, I have only scratched the surface here. This is still just a side project I built over a few months to help me with my day-to-day gamedev work, which remains my actual priority. But I see huge potential in it as an alternative to this kind of tooling, especially for small, flexible, iterative communities and projects.

Hopefully this made you want to give <span style="color: steelblue;">Obsidian</span> a try. I barely even touched on what it can do as a note-taking tool in its own right.

With that said, get back to your tickets, ladies and gentlemen.

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
        data-lang="en"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>

