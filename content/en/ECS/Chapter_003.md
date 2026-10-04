---
title: 💡 3 - ECS, best practices
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
            <a href="https://docs.unity3d.com/Packages/com.unity.entities@6.5/manual/index.html" target="_blank">Official Unity ECS Manual</a>
        </div>
        <div class="callout-content">
            <div class="callout-content-inner">
                <a href="/static/png/ECS/Unity_ECS_System.png" target="_blank"><img src="/static/png/ECS/Unity_ECS_System.png" alt="Unity ECS System" width="100%"/></a>
            </div>       
        </div>
    </blockquote>
</div>

<p style="text-align: center;"><a href="../index.xml">🔊 Subscribe via RSS</a></p>

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

---


<div style="display: flex; gap: 20px; align-items: center;">
    <div style="flex: 1;">
<span style="color: orange; display: flex; justify-content: center; align-items: center;"> 🚧⚠️ 🚧 - - - WARNING - - - 🚧⚠️ 🚧 </span> 

I'm going to give you a list of rules that you should learn to think about/conceptualise as soon as you use an ECS.

They can make your life much easier, help you avoid a few pitfalls and, above all, keep you from constantly refactoring your **systems** and **components**.

However, <span style="color: orange;"> a rule is never absolute </span>. You don't apply a rule because "it's a rule", you apply it because you understand its usefulness and it suits the context you're in.

The rules I'm going to teach you here are therefore **to be considered almost systematically**, but **not to be applied almost systematically**!

It's important to keep that in mind, and it applies to all the "best practices" you'll ever read.

</div>
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <a href="/static/png/Sith_Absolute.jpg" target="_blank"><img src="/static/png/Sith_Absolute.jpg" alt="Sith_Absolute" width="100%"/></a>
    </div>
</div>



Here, then, are my commandments when it comes to writing in an ECS context:

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
                    <span>The ECS commandments</span>
                    <div class="callout-icon"></div>
                </div>
                <p style="text-align: left;"><strong>1 - Immortal, your Components shall not be</strong></p>
                <p style="text-align: left;"><strong>2 - Triggers and Filters, your Systems shall consume</strong></p>
                <p style="text-align: left;"><strong>3 - In the ECS, all your game data shall live</strong></p>
                <p style="text-align: left;"><strong>4 - Always generic, your Systems shall be</strong></p>
                <p style="text-align: left;"><strong>5 - Few Queries, your Systems shall consume</strong></p>
                <p style="text-align: left;"><strong>6 - Written by a single System, your Components shall be</strong></p>
                <p style="text-align: left;"><strong>7 - Name everything properly, you shall</strong></p>
                *I promise, I'll stop with the Star Wars memes...*
            </div>
        </div>
    </blockquote>
</div>

---

## 1 - Immortal, your Components shall not be

### Context

**<span style="color: orange;"> An entity is not an immutable functional object. </span>**

This is probably the hardest lesson to get into your head when you come from Object-Oriented programming.

**A component should only be present on an entity (or active, if the engine allows it) if it is useful at time T**
*<br>(**spoiler**: this statement will be qualified in the next rule, but it's a good starting point for reflection)*

The presence of a component defines the entity's state; the component isn't just a permanent container for data!


### Consequences

Not applying this rule will systematically lead to **<span style="color: orange;"> having to create preventive exit rules for your systems </span>**, so they can ignore "inactive" components that are still present on entities.
It will also create **<span style="color: orange;"> a passive load on the engine </span>** as your systems accumulate, each one constantly reading your components.

Example:

Your entity **CAN** move, so you have a component that stores the data to handle that movement.
Except that your entity doesn't move every frame. For example, it only moves when you've selected it and click somewhere. Most of the time, then, it is stationary.

If you assume that **BEING ABLE TO MOVE** is an immutable characteristic of the entity, you will de facto build a dedicated movement system that:
- will systematically be enabled and read the data in your component
- will contain a coded rule that decides whether the entity is actually moving or not.
  - will stop there for the entity in question if the check has failed
  - will modify the transform if the check has passed

Repeat that for every entity in your scene, every frame and for every system that exists: you'll have thousands of components constantly being read for no reason.


### Corrections

You select a unit, then click on the map:
- your input-reading system adds the movement component to the unit in question and fills in the data (start/target position + speed + progress, for example)
- your movement system sees the component, reads it and moves the transform according to its rules
- that same system checks whether the action has been completed (for this example: has the unit reached its destination?) and, if so, removes/disables the component

Your movement system no longer runs idly every frame (by checking whether the start and target positions are the same in order to exit pre-emptively, for example).

It becomes **<span style="color: steelblue;"> inactive through the absence of the component </span>**, until that component is next reintroduced by the input-reading system.

<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style="display: flex; align-items: center; gap: 24px;">
            <div style="flex: 1; min-width: 0;">

### Tips

With this logic, you can probably see 2 major types of systems emerging, which you may already have conceptualised in your projects without realising it:
- <span style="color: steelblue;"> initiator systems </span> (process a game state and enable/add the necessary component to the entities in question)
- <span style="color: steelblue;"> consumer systems </span> (read the components in question and disable/remove them from entities if the action has been carried through to completion)
  
Which is immensely practical to debug, with the ECS becoming, by its architecture, a living state machine (and, as a bonus, it lets you make nice architecture diagrams on Excalidraw...).
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

## 2 - Triggers and Filters, your Systems shall consume

### Context

**While an entity is not an immutable functional object,** **<span style="color: orange;"> an entity must not change its structure (archetype) too often! </span>** (or, as far as possible, ever).

Adding and removing components has a cost in an ECS architecture:
- adding/removing the component (Captain Obvious, at your service!)
- moving the entire entity and its components in memory, into a section associated with its new archetype (see my previous chapters)

While my recommendation in the rule "<span style="color: steelblue;"> 1 - Immortal, your Components shall not be </span>" is perfectly viable, it shouldn't be applied quite so bluntly, and I can now introduce you to the notion of:
- **<span style="color: steelblue;"> trigger components </span>**: a one-shot component, consumed (read then destroyed) by a system that should only run once on a particular occasion (example: a loading or saving Trigger)
- **<span style="color: steelblue;"> filtering components </span>**: a component that indicates a state and can remain present for shorter or longer periods (example: filtering units that are moving).


### Consequences

If your entity regularly changes state, adding/removing the component and **<span style="color: orange;"> copying data into the associated archetype can cost more than having your system run "idly"</span>** with a simple exit check.


### Corrections

ECS designers have anticipated this use case; each engine offers a solution that meets this need:
- Unity: a component can implement the `IEnableableComponent` interface, allowing it to have an activity bit
- Unreal Engine: a `SparseElement` component can be associated with an entity without modifying its archetype
- Bevy: a component can be declared `SparseSet`, which changes the entity's archetype when it is added/removed, but without moving the regular components in memory

These special components allow systems to **filter entities through their Query**, so they only run on relevant entities (or not at all if none are present).

We then change the query logic of the systems from rule 1:
- a query on the components to manipulate, which the system destroys when it has finished
  
into
- a query on the components to manipulate + filtering components; only the latter may (or may not) be destroyed/disabled

or
- a 1st query on a trigger component, which the system will destroy/disable once it has run
- a 2nd query on the components to manipulate + filtering components; only the latter may (or may not) be destroyed/disabled

The trigger controls when one-off systems run, while filtering avoids processing inactive entities. And depending on the engine and its configuration, you can also prevent the system from running when it has nothing to do (in Unity, we have `RequireForUpdate`, for example, forcing a system's `OnUpdate` to run only if a query returns entities, even though it currently has limitations with `IEnableableComponent`, much to my despair 😒).
<br> We return to this logic of a **<span style="color: steelblue;"> system that is inactive through the absence of a component </span>**.

<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">

### Tips

By keeping this rule in mind, you will naturally move towards a logic of:
- <span style="color: steelblue;">data component </span>: permanent, defined in the entity's base archetype
- <span style="color: steelblue;">state component </span>: temporary, defining what the entity is currently doing
  
A component can then carry no game data at all and simply be a **<span style="color: steelblue;"> trigger/filtering component </span>**, which is extremely powerful.

For example, you can completely do without any logic based on Events + Listeners, with all the sequencing problems that come with them.

So all the logic lives in the ECS... which is convenient, because that's the next point!
    </blockquote>
</div>

---

## 3 - In the ECS, all your game data shall live

### Context

**<span style="color: orange;">Outside initialisation systems, a system should only consume ECS components and no game variables/constants from the code.</span>**

Game values (private or public, static or const variables) useful to an ECS architecture are only useful during initialisation phases (the 1st instantiation of an entity with its components).
After that, every post-initialisation system should operate in a closed environment with the game data present in the ECS.

**Be careful, I'm only talking here about game values: the characteristics of your game objects and your scene that live throughout the game. I'm not talking about calculation variables and other local caches.**


### Consequences

Using a game variable/const in a system after the initialisation phase is most of the time a red flag, which **<span style="color: orange;">will almost systematically lead to a refactor</span>** because that variable is a characteristic of an entity (or a type of entities), rather than of the system itself.

Exception:

There are, of course, exceptions, such as variables that let systems listen for a given period of time, or that manage execution timings, which are characteristics of the system itself and don't necessarily need to be represented in the ECS (even though they could be).

Example:

All your units move at the same speed. So you introduce a `const float UnitMoveSpeed` in your movement system, which it will use to handle the movement of the `transforms`.
Then you'll introduce a mechanic that changes the unit's speed (a buff/debuff, a variation in speed from one entity to another, or even a notion of game execution speed), which will immediately require refactoring the entity, the components and all the systems that consume that variable.

### Corrections

Simply ask yourself who is responsible for the data: who should carry this information? Without even assuming future changes to mechanics that could fall into classic preventive over-engineering. Most of the time, the name of your variable will reveal where it belongs.

Writing a local variable in the code means saving yourself a few seconds of thought about the scope of a piece of data and almost systematically creating several minutes of refactoring for yourself later.
Generally speaking, in Data Oriented design, you should first ask yourself these 2 questions:
- what data do I need to meet my need?
- how do I group it to handle my need?

<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
    
### Tips

All engines have an editor that lets you inspect and modify entity components live.

Including these variables in components by default natively allows you to <span style="color: steelblue;"> fine-tune values live in the game </span> without going through the infernal cycle: change the value, compile, launch the game until you reach the phase you're interested in, test, exit, change the value... & bis repetita until you get the expected result.

You can even, for shared values, create independent reference entities, such as a `Unit_BaseStat` singleton entity that carries the common speed of your units. You can query these shared values in your systems and apply them to multiple entities. By changing the value in this reference from the editor, all the units in question will be affected live. It's an extraordinary tool that declarations in the code deprive you of.
    </blockquote>
</div>

---

## 4 - Always generic, your Systems shall be

### Context

**<span style="color: orange">Since a system carries no "game" variables, it therefore cannot (and must not) carry any data tied to a specific entity.</span>**

You should never create a system to manipulate ONE specific entity. The system manipulates **components** (not entities), for a given context. If the query happens to return only a single entity in the ECS, that should only be seen as a happy coincidence!


### Consequences

The classic consequence is a **<span style="color: orange">preventive restriction of components and systems to a limited functional context</span>**, which leads to **<span style="color: orange">the multiplication of components/systems across otherwise similar scopes</span>**, constant refactoring to extend the scope of the system and its components, and increasing difficulty following the architecture as the project grows.


### Corrections

**<span style="color: steelblue;"> A system reads components, it doesn't read entities </span>**. This is a VERY important concept. A system doesn't need to know what type of entity the components belong to.

To return to the movement system example, we don't care whether it moves your main character, an enemy or a projectile; the only thing it needs to read is:
```csharp
public struct COMP_Unit_Movement_Direction : IComponentData
{
    public float3 Direction;
    public float Speed;
}
```
and perform the calculation associated with that data. KISS (Keep It Stupidly Simple) in its rawest form.

And perhaps tomorrow, you'll realise that you have a new type of movement to handle and create a
```csharp
public struct COMP_Unit_Movement_ToPosition : IComponentData
{
    public float3 StartPosition;
    public float3 TargetPosition;
    public float Progression;
    public float Speed;
}
```
with a new dedicated system that performs a `Lerp` with that data. And which, likewise, will be blind to the entity's role and perform its calculation in its own corner.

<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style="display: flex; align-items: center; gap: 24px;">
            <div style="flex: 1; min-width: 0;">

### Tips

Create your systems as though the entity could be multiplied and made generic, even in the case of singleton entities.
<span style="color: steelblue;"> Turning a system's input queries into singleton queries is a late optimisation </span>, not a way to initialise a system (at least until you're used to ECS).

Adopt a Data Oriented approach:
- what is my need? Move the entity
- what is the input? A target position, a direction received from the keyboard/gamepad, an array of sequential positions, a spline trajectory coming from pathfinding...
- which system initiates this component? is there a risk of data conflicts with what already exists?
- de facto, does it fit into an existing component? or am I distorting it, in which case I need a new component?
- if it's an existing component, can the associated system handle it? no? I've probably missed something in the previous questions
- if it's a new component, can it coexist with the existing one? can this case occur? should I plan exclusions in my queries, or did I get the initialisation wrong?

This is a mental exercise to get used to, and it becomes natural with practice. And here too, you should feel in the air this need for a notion of **<span style="color: steelblue;"> initiator/consumer system </span>** and **<span style="color: steelblue;"> filtering component </span>**.
            </div>
        </div>
    </blockquote>
</div>

---

## 5 - Few Queries, your Systems shall consume

### Context

**<span style="color: orange"> Almost all your systems should only have between 1 and 3 queries as inputs. </span>**

Example:
- a trigger query
- a query on a singleton component with shared data
- a query on the entities' components (including data and filtering components)

If you design systems with a limited scope to make debugging easier for yourself, this structure will be sufficient most of the time.

Now, as already mentioned, nothing is absolute. Some systems will need more, because they bridge 2 distinct but connected functional scopes (examples: your units and your pathfinding architecture, or your input system and the elements associated with the player), or need to check for the presence of several filtering components on distinct entities (map state, pathfinding state, unit state...)

Example:
- a trigger query
- a query on a singleton component with shared data for scope 1
- a query on the entities' components (including data and filtering components) that the system will process for scope 1
- a query on a singleton component with shared data for scope 2
- a query on the entities' components (including data and filtering components) that the system will process for scope 2


### Consequences

A system that carries many queries is **<span style="color: orange"> a system that probably handles too many responsibilities </span>**. This will often mean:
- a system that is **<span style="color: orange"> very long and difficult to debug </span>**
- a system that **<span style="color: orange"> runs constantly and handles a whole bunch of exit cases where it produces nothing </span>** (**<span style="color: steelblue;"> raw `return` statements in systems are a red flag to watch out for </span>**)
- distorting components so that they carry the data the system needs, when it is the component that should define what the system does


### Corrections

Generally, if you follow the rule **<span style="color: steelblue;"> 2 - Triggers and Filters, your Systems shall consume </span>**, you will be almost immune to this problem.
Besides, **<span style="color: steelblue;"> a system should only have one single Trigger component, but it can have several filtering components </span>**. If you identify a need for several Triggers, that's an indication that separation is necessary.

---

## 6 - Written by a single System, your Components shall be

### Context

It is normal for several systems to read the same component, but **<span style="color: orange">cases that require several systems to write to the same data are rarer</span>**.

This is probably the least "absolute" rule on the list. However, it's a useful question to ask yourself when you encounter this case, because it often raises other questions about scope:
- either about components: has data from distinct scopes been gathered by mistake in the same component?
- or about systems: is one of my systems processing a scope that isn't its own?


### Consequences

The consequences are the classic problems of **<span style="color: orange"> one system overwriting another system's data in the same frame </span>**, with erratic behaviour depending on which system runs in a given frame and the debugging difficulties that come with it.


### Corrections

It can be perfectly legitimate for systems to touch the same component.
Example: the standard unit movement system and an explosion system that can throw units will both interact with the `transform`.
So you need to be able to manage a notion of unit state, in order to have a stable alternation in system execution.

Any conflict here can be resolved by the rule **<span style="color: steelblue;"> 2 - Triggers and Filters, your Systems shall consume </span>**: a unit being thrown cannot move normally.

A unit should therefore carry a `TAG_Unit_NormalMove` by default, replaced by `TAG_Unit_ProjectionMove` for the duration of that movement, then recover its `TAG_Unit_NormalMove` once the unit has recovered.
Each system only runs if its respective TAG is present/active, preventing any conflict over the entity's transform.

---

## 7 - Name everything properly, you shall

### Context

You will find, **<span style="color: orange">as your project grows, that the number of components and systems will very quickly explode. And that's normal! </span>**
For example, for my game, I currently have:
- 175 Systems
- 217 raw Components
- 64 buffer Components
- several hundred thousand entities in my scene

And I think that's only half of what I need for the final version of my game (currently, counting only the C# related to Unity's ECS, I have more than 60,000 lines of code, to give you an idea of the scale).

So I have a pressing need to find my way around this mess. And that will also be your case, admittedly to a lesser extent, but don't doubt it for a second.

### Consequences

One of the most commonly expressed difficulties around using ECS on the Internet is the **<span style="color: orange"> difficulty of managing this immense mass of data </span>**. And the bigger it gets, the more you lose track of what has been created and start **<span style="color: orange">duplicating data and components that already exist, amplifying the problem further </span>**.

And bear in mind that LLMs won't help you here, because they have no trouble absorbing all of that and creating more and more components. There's nothing easier than losing all autonomy within your own ECS.


### Corrections

Great rigour in naming conventions and organisation will save you from migraines.
Personally, I've adopted this convention:

Example for my components: `[ComponentType]_[NetworkPerimeter]_[FunctionalPerimeter]_[Scope] `

with
  - `ComponentType`:

| Prefix | Purpose | Contains data? | Can be enabled/disabled? |
|--------|--------|-----------|-----------|
| COMP | container for data specific to an entity | Always | Rarely |
| REF | container for shared data, singleton | Always | Never |
| TAG | filtering component | Rarely | Almost always |
| TRIG_SYS | system trigger component, destroyed by systems | Rarely | Never |

(*Note: the separation between TAG and TRIG_SYS is specific to my **Unity** convention because it offers the notion of `IEnableableComponent`. For other engines, the TAG will also be destroyable by systems, but I think it's still relevant to separate the 2 notions of a one-off system trigger and a temporary entity filtering tag, whatever its life cycle)*

  - `NetworkPerimeter`: Server, Client, Shared or Ghost (this is specific to online multiplayer for my game; it can be omitted for a single-player game)
  - `FunctionalPerimeter`: the component's functional scope (Player, Enemies, Decors, Ground, Projectile...)
  - `Scope`: which element of the functional scope the component carries (Stats, Movement, Attack, Animation...)

So, for my player, I'll have, for example:
- `COMP_Server_Player_Stats`, which carries all my player's base metadata (level, health points, base speed, attack power...)
- `COMP_Server_Player_Movement`, which carries all the runtime data for the current movement (movement direction, character orientation, speed modifier...)
- `TAG_Server_Player_IsMoving`, which carries no data and which I enable and disable according to the state of the player inputs
- `REF_Server_Players_Connected`, which is a singleton carrying the list of all players connected to the session
- and I'll have `TRIG_SYS_Server_Player_Despawn`, `TRIG_SYS_Server_Player_Spawn` to trigger the associated one-off systems

For systems, I follow exactly the same logic, with the naming convention: `SYS_[NetworkPerimeter]_[FunctionalPerimeter]_[Scope] `

So I'll have, for example:
- `SYS_Server_Player_Spawn`, which will consume (read then destroy) `TRIG_SYS_Server_Player_Spawn` to initialise a Player entity for a given player
- `SYS_Server_Player_Move`, which queries active `TAG_Server_Player_IsMoving` components + `COMP_Server_Player_Stats` and `COMP_Server_Player_Movement` to handle movement

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <a href="/static/png/ECS/Component_Filter.png" target="_blank"><img src="/static/png/ECS/Component_Filter.png" alt="Component filter" width="100%"/></a>
    </div>
    <div style="flex: 1;">

With this logic and autocompletion, I can instantly find all the data associated with a scope + the actions that can be performed on it.

Or search for components in the ECS editor to inspect them. My naming convention is a form of query through autocompletion in the editor (the code editor or the game engine).

</div>
</div>

<div style="display: flex; justify-content: center;">
    <blockquote class="callout tip" data-callout="tip">
        <div style="display: flex; align-items: center; gap: 24px;">
            <div style="flex: 1; min-width: 0;">

### Tips

Since components are used by many systems, I strongly encourage you to **<span style="color: steelblue;"> declare all your components in dedicated files </span>**, as you would for your public static constants/variables in a classic project.

This makes it possible to inspect duplicate data very quickly for a given scope. Don't declare your components in the same files as your systems; it will become hell to find your way around.
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
