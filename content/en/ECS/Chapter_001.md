---
title: 💡 1 - ECS, the why
---

<style>
    p, li, div { text-align: justify; }
</style>

<!-- Tip -->
<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <a href="https://docs.unity3d.com/Packages/com.unity.entities@0.17/manual/index.html" target="_blank">Official Unity ECS Manual</a>
        </div>
        <div class="callout-content">
            <div class="callout-content-inner">
                <a href="/static/png/ECS/Unity_ECS.png" target="_blank"><img src="/static/png/ECS/Unity_ECS.png" alt="Unity ECS" width="100%"/></a>
            </div>
        </div>
    </blockquote>
</div>
<p style="text-align: center;"><a href="../index.xml">🔊 Subscribe via RSS</a></p>

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

*I'll be talking here in a **Game Dev** context, but fundamentally this is a topic that cuts across the entire metaverse (yes, I dare you this word here 😏) of development: **<span style="color: steelblue;">Object-Oriented</span> VS <span style="color: steelblue;">Data-Oriented</span>**.*

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**Where the pain began : <span style="color: steelblue;">OOP</span>!**

**OOP (Object Oriented Programming)** has this incredible strength: it naturally fits the way our lazy brains work:
- we **break down our concepts into objects**
- they carry both **properties** and **methods/functions**
- each object gets its own **distinct instance** and can therefore be **independent**
- and then we slowly descend into the hell of **inheritance chains** and cascading dependencies... but that's another story. 😌

In the context of game development, this approach is veeeery appealing. Not only does it fit from a functional decomposition standpoint (one object per player / enemy / decor / UI...), it also maps naturally to gameplay logic :

I want to create several distinct enemies that attack my player ? Easy - one object instance per enemy, each with their own health points, their own attack pattern, their own terrain awareness... and potentially, as a result of all that : a unique behaviour per enemy!

All the major game engines have adopted this approach in their core design and language choice:
- <span style="color: steelblue;">Unreal Engine</span> with <span style="color: steelblue;">C++</span>
- <span style="color: steelblue;">Unity</span> with <span style="color: steelblue;">C#</span>
- <span style="color: steelblue;">Godot</span> with <span style="color: steelblue;">C#</span> and its dedicated language <span style="color: steelblue;">GDScript</span> (an interesting variant, more modular around a composition/node concept).

But as **flexible** and **well-suited** as OOP is for **game design**, it has one major problem : it **scales** terribly. By trying to group both data and its processing within the same object, objects become extremely **volatile** elements whose memory footprint and behaviour can't be predicted in advance.

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <span style="color: orange;">-- Flexibility is a performance trade-off --</span>
        <a href="/static/png/ECS/GameObject_Entity_Memory.png" target="_blank"><img src="/static/png/ECS/GameObject_Entity_Memory.png" alt="GameObject vs Entity memory comparison" width="100%"/></a>
        <a href="https://ilogos.biz/what-is-unitys-new-data-oriented-technology-stack-dots/" target="_blank">Image source</a>
    </div>
    <div style="flex: 1;">

This undefined nature of objects forces an architecture that can manage whatever gets attached to them. Since the structure can't be anticipated, object creation happens on the fly with **fragmented memory allocation** (or less poetically: **yolo, I'll dump it wherever I find free space**).

Working with an object then requires reconstructing it like a breadcrumb trail, chasing down every memory section where a piece of its data was stored.

And memory access is the very heart of performance - that relentless scan to reassemble objects is a brutal bottleneck.

</div>
</div>


<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**The holy saviour : <span style="color: steelblue;">DOD</span> !**

**ECS** (Entity Component System) is an architecture that falls under the **DOD** (Data Oriented Design) paradigm. In the context of **Unity**, it's made very explicit - they call it **DOTS** (Data Oriented Technology Stack). *I promise I'll stop with the hellish acronyms now.* 😚



<div style="display: flex; gap: 20px; align-items: center;">
    <div style="flex: 1;">

ECS is not a new concept. According to <a href="https://en.wikipedia.org/wiki/Entity_component_system" target="_blank">Wikipedia</a>, the first version of a similar architecture in a commercial game dates back to **Thief: The Dark Project in 1998**.

**-Digression-** An extraordinary game, by the way, which I was lucky enough to play as a kid
(brace your retinas : <a href="https://www.youtube.com/watch?v=hHWYCfuPQHM" target="_blank">period trailers</a>).

It featured an impressive number of interactive, physics-enabled objects that you could throw to make noise, knock other things over, knock out guards etc... all in pursuit of the perfect heist with zero casualties. A landmark in stealth gaming.
**-End digression-**

</div>
    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
            <a href="https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Thief_The_Dark_Project_boxcover.jpg/250px-Thief_The_Dark_Project_boxcover.jpg" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Thief_The_Dark_Project_boxcover.jpg/250px-Thief_The_Dark_Project_boxcover.jpg" alt="Thief: The Dark Project" /></a>
    </div>

</div>

The essence of ECS: stop organising code around functional logic, and instead organise it to optimise how data is laid out in memory - also known as the <a href="https://en.wikipedia.org/wiki/Locality_of_reference" target="_blank">principle of locality</a>.

Its design is relatively simple:
- we replace the concept of object with that of an **<span style="color: steelblue;">entity</span>**, which is nothing more than a unique identifier.
- to that entity, we attach **<span style="color: steelblue;">components</span>**, which are nothing more than data containers (*structs*)
- entities sharing the same components are grouped into **<span style="color: steelblue;">archetypes</span>**: all entities belonging to the same archetype are stored contiguously in memory
- we can then **<span style="color: steelblue;">query</span>** groups of entities by filtering on components (much like querying a database)
- through centralised **<span style="color: steelblue;">systems</span>**, the queried data is processed in bulk via **<span style="color: steelblue;">chunk</span>** splitting and **<span style="color: steelblue;">multi-threading</span>**

<a href="/static/png/ECS/Unity_ECS_Concept.png" target="_blank"><img src="/static/png/ECS/Unity_ECS_Concept.png" alt="ECS Unity Concept" width="100%"/></a>

<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <div class="callout-title-inner"><span>OOP vs ECS implementation</span></div>
        </div>
        <div>
            <span>
In OOP, you'd have a character carrying a position, a direction and a speed, along with a Move() method that runs every frame.

In ECS, you create 3 data components, linked by the unique ID of an entity. An isolated system then queries all entities that have that combination of 3 components (regardless of archetype - only the component combination matters) and processes the movement calculation in parallel.</span>
        </div>
    </blockquote>
</div>


This approach can improve performance by at least a factor of 10. Examples speak louder:

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
        <span style="display: block; text-align: center; margin-top: 8px;">No ECS, 1k units, no VAT*, no simulation, no decors</span>
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
        <span style="display: block; text-align: center; margin-top: 8px;">ECS, 100k units with VAT*, basic simulation, no decors</span>
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
        <span style="display: block; text-align: center; margin-top: 8px;">ECS, 50k units with VAT*, advanced simulation, 180k decors</span>
    </div>
</div>
<div style = "display: flex; justify-content: center; align-items: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style = "display: flex; justify-content: center; align-items: center;" class="callout-title">
            <div class="callout-icon"></div>
            <span>VAT (Vertex Animated Texture)</span>
        </div>
        <div>
            <p>A technique that stores model animations in a texture read directly by the GPU.
            Greatly reduces CPU load, at the cost of RAM usage and reduced flexibility in the animation implementation process.
            <a href="https://stoyan3d.wordpress.com/2021/07/23/vertex-animation-texture-vat/" target="_blank">Link to an article if you want more details.</a></p>
        </div>
    </blockquote>
</div>

*- All 3 videos run at around 40-60 FPS. The OOP approach lets me animate 1,000 units (disclaimer: adding VAT would push that to roughly 5k-10k). With ECS, I can reach 100,000 units, with on top of that a simulation that lets them dodge and navigate via a vector flow field. The performance gap between the two implementations is staggering for this type of use case. -*

This makes it an extremely powerful architecture, which has found many use cases in simulations of :
- crowds
- traffic
- cities / ecosystems
- projectiles / particles
- sandbox / MMO

All of which involve large quantities of non-static objects and are exactly where DOD shines.

But you'll notice this list is fairly narrow - and that this architecture isn't used everywhere... 👀

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

**With great power comes...**

There's a trap that's easy to fall into : **performance for performance's sake** - good old over-engineering ! (And damn is it hard to resist when you're an engineer...).

If it's true that <span style="color: orange;">-- Flexibility is a performance trade-off --</span>, the reverse is equally true : <span style="color: orange;">-- Performance is a flexibility trade-off --</span>. And **flexibility** is one of the cornerstones of **productivity**.

**Performance is rarely an objective** in itself (unless you're Google/Amazon answering billions of user requests per second). It's primarily a **minimum acceptance threshold for the user** :
- if performance degrades too much, the user experience will too - and users will leave
- but being overly performant won't improve perceived experience and you'll have burned time/money for nothing

**Performance** is therefore a matter of **balance**: a strict lower bound that should never be crossed, and a soft upper bound that must be contained, in order to maximise feature output - which is the real goal.

Since ECS is a performance-driven answer, it is by nature **more complex and inflexible to change**. It takes much longer to set up, requires many distinct components, imposes restrictions on data types and generally stretches development time drastically - even for simple features.

The industry has, as always, chosen the pragmatic path : **hybrid**. Knowing when to reach for ECS for performance versus sticking with OOP when functionality and iteration speed matter most. ECS is for instance pointless in most games with contained scenes, which make up the vast majority of our catalogues. On the other hand, any kind of mass simulation will benefit massively from it.

But while the industry has long had to treat ECS and OOP as two separate worlds, a new path may be opening up. At the <a href="https://youtu.be/BtObK0arD_M" target="_blank">GDC in March 2026</a>, **Unity** decided to swing big : why not **merge** the two approaches?

<a href="https://pbs.twimg.com/media/HCq5KsqaUAcM-dR?format=jpg&name=large" target="_blank"><img src="https://pbs.twimg.com/media/HCq5KsqaUAcM-dR?format=jpg&name=large" alt="GDC Unity 2026" width="100%"/></a>

ECS would become a core engine package (no longer an optional add-on), in the spirit of [**Bevy**](https://bevy.org/) (a game engine in Rust that is natively ECS). Entities would become the backend of the entire engine, but GameObjects wouldn't disappear - they'd become a comfort layer on top of entities, with the engine handling the conversion. The clarity of OOP design on top, the power of ECS underneath.
<span style="color: orange;">-- ECS will no longer be a choice, but the foundation. The GameObject will no longer be an alternative, but an interface. --</span>

In other words, the hybrid approach I described above would no longer be an architectural compromise, but the engine's default mode of operation. Want rapid prototyping ? Stay at the GameObject level. Want raw performance ? The engine will let you shift your GameObject architecture toward ECS and unlock its full potential. Same data, same engine - two worlds in one.

And I'll admit I'm very curious to see how it turns out. 👀

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
