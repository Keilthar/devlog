---
title: 💡 2 - ECS, thinking the data
---

<style>
    p, li, div { text-align: justify; }
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
                <a href="/static/png/ECS/Unity_ECS.png" target="_blank"><img src="/static/png/ECS/Unity_ECS.png" alt="Unity ECS" width="100%"/></a>
            </div>
        </div>
    </blockquote>
</div>

<p style="text-align: center;"><a href="./en/index.xml">🔊 Subscribe via RSS</a></p>

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

Now that you've understood the <a href="https://keilthar.github.io/devlog/en/ECS/Chapter_001" target="_blank">why behind ECS architecture</a>, it's time to look more closely at **how it works** ⚙️.

Here, I'll cover the basic building blocks of an ECS and, above all, how to think about them, which is very different from the way we usually structure classic OOP code. And it does require a real adaptation period (personally, it took me several months before I started thinking naturally in a **Data Oriented** way, but once you're in that mindset, it's a delight).

To do that, we'll follow a simple example all the way through this article: entities representing units that we want to move. We'll dig into the actual logic of ECS (the relationships between Entities, Components and Systems) and, more importantly, ask ourselves how we conceptualise architecture with this **Data Oriented** approach, which I'd personally almost rename **Data Driven**, given the mindset it pushes us into. This will also lead us to revisit the basic definitions of ECS terms and deepen them a bit.

---

**Entities**

I'd say there are 2 definitions associated with an entity:
- **Technical**: it's simply a unique identifier that links **Components** together. Entities can then be grouped into **Archetypes** (entities that share the same **Components**), which are stored contiguously in memory to optimise read/write access.

- **Functional**: it's a representation of a business concept. An entity can represent a classic **GameObject** (Player, Unit, Projectile, Decor...). But in an ECS, it can also act as a **holder for centralised data**, like a **Singleton** (game progression, score system, map size...), replacing the static classes and constants we usually rely on to share data throughout the codebase.

```csharp
partial struct SYS_Unit_Spawn : ISystem
{
    public void OnCreate(ref SystemState state)
    {
        EntityManager EM = state.EntityManager;

        // Creates an empty entity with a unique identifier
        Entity UnitEntity = EM.CreateEntity(); 

        // Adds the Components that define
        // the entity as a moving unit
        EM.SetName(UnitEntity, "Unit");
        EM.AddComponent(UnitEntity, new LocalTransform());
        EM.AddComponent(UnitEntity, new TAG_Unit());
        EM.AddComponent(UnitEntity, new COMP_Unit_Movement());
        // + any other component useful to the unit
    }
}
```
---

**Components**

In chapter 1, I described **Components** as simple "data containers (*structs*)".

For example, in **Unity**, there are 2 major kinds of **Components**: **IComponentData** (single data) and **IBufferElementData** (a list of data).

```csharp
// Unique Component, with no data, enable/disable-able so units can be queried
public struct TAG_Unit : IComponentData, IEnableableComponent {}

// Simple Component because a unit only has one movement definition
public struct COMP_Unit_Movement : IComponentData
{
    public float3 Direction;
    public float Speed;
    public bool CanMove;
}

// Buffer because I'd need as many structs as there are handled damage types
public struct BUFF_Unit_Defense : IBufferElementData
{
    public DamageType DamageType;
    public float DamageReduction;
}
```

However, with that definition, I kind of (very much 😏) lied to you in the name of simplification. Because defining **Components** purely as data carriers misses the broader philosophy of ECS. They are more than that.

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <a href="/static/png/ECS/Factorio_MainBus.png" target="_blank"><img src="/static/png/ECS/Factorio_MainBus.png" alt="Factorio Main Bus" width="100%"/></a>
    </div>
    <div style="flex: 1;">

Taken together, **Components** form a kind of **public data bus** that **Systems** read from and write to in order to produce processing. For those who have played **Factorio**, I really like picturing it mentally as the **Main Bus** that distributes resources throughout the base.

In other words, a **System** is blind to the progress or internal state of any specific entity, it only interacts through generically exposed data. That means the entity must carry, through its data, its current state and functional logic so that the relevant **System** can do its job.

</div>
</div>

So **Components** are both **data carriers** and **data filtering elements** through **Queries**. Fundamentally, they define **who can interact with what, and above all why**. That's a little counter-intuitive at first, because the whole point of an ECS entity is precisely that it does not carry behaviour or processing, but the fact that the entity must expose states pushes the architecture toward a **data driven** logic (which is why I prefer that term over **data oriented**).

And that's something extremely divisive, because OOP tends to make **objects autonomous and closed-off** (which is, incidentally, one of the fundamentals of Clean Code, even if how "clean" that is is, in my humble opinion, highly debatable...).

By nature, **ECS forces you to make the full state of an entity explicit, not just its raw data**, and that's a mental exercise we historically are not used to.

---

**Queries**

A **Query** is a request used to retrieve specific entities. To do that, we define the minimal **Component** structure attached to the targeted entities.
That structure must obviously contain the **Components** a **System** will read and/or modify, but it can also include **filtering Components** that the **System** itself will not use directly, while still allowing the engine to reduce the scope of work according to functional logic.

```csharp
    // Query on all Units with an enabled TAG_Unit
    EntityQuery Query_Units = SystemAPI.QueryBuilder()
                        .WithAll<TAG_Unit>()
                        .WithAll<LocalTransform>()
                        .WithAll<COMP_Unit_Movement>()
                        .Build();

    // Retrieves units and their data for later processing
    NativeArray<Entity> Units = Query_Units.ToEntityArray(Allocator.Temp);
    NativeArray<COMP_Unit_Movement> UnitsMovements = Query_Units.ToComponentArray<COMP_Unit_Movement>(Allocator.Temp);

    // Let's imagine there is only a single unique unit we want to retrieve
    Entity MyUniqueUnit = SystemAPI.GetSingletonEntity<TAG_Unit>();
    COMP_Unit_Movement MyUniqueMovement = SystemAPI.GetSingleton<COMP_Unit_Movement>();
```

And that's where you can start to see the power of ECS, because through **Components**, you can manage not only data, but also, as I said earlier, states/functional logic.

Let's imagine, for example, that I don't want to destroy my units when they die, but simply move them off the map and disable them until their next respawn. Well, I could simply disable their `TAG_Unit` **Component** when their HP reaches 0, and then, when I need them again, retrieve them through:

```csharp
    // Query all Units whose TAG_Unit is disabled
    EntityQuery Query_Units = SystemAPI.QueryBuilder()
                        .WithDisabled<TAG_Unit>()
                        .Build();
```

With a classic OOP approach, I would have had to manage a list of disabled units, pick one from it, and then remove it from the list before finally being able to use it.
With an ECS approach, there is no need anymore to track that through a table/list/hashmap.

And from the moment you start thinking in terms of state, you can then rethink how data is exposed. Let's go back to my earlier example:

```csharp
public struct COMP_Unit_Movement : IComponentData
{
    public float3 Direction;
    public float Speed;
    public bool CanMove;
}
```

In an OOP approach, having these 3 pieces of information together seems perfectly relevant. But in ECS, it would be much better to do:
```csharp
public struct TAG_Unit_IsMovable : IComponentData, IEnableableComponent {}

public struct COMP_Unit_Movement : IComponentData
{
    public float3 Direction;
    public float Speed;
}
```

That way, a **System** handling unit movement could filter on *TAG_Unit_IsMovable* and only process the relevant units.
Whereas classic OOP would force us to retrieve all units and do `if (CanMove == false) return;`, making us handle a chunk of useless data.

However, this optimisation also has a cost: it multiplies the number of structs you manipulate and, if you're not extremely rigorous with naming conventions and compartmentalisation, 
it can very quickly become a nightmare to manage hundreds of **Components**. ECS **performance** comes with a very real **structural and cognitive cost**, and generates a kind of structural boilerplate that can become tiring to deal with (though there is a somewhat trendy thing these days that's pretty good for this sort of task, it starts with A and ends with I 🤖).

---

**Systems**

**Systems** are mini-factories whose purpose is to manipulate a set of entities, which they retrieve through **Queries**.
A **System**, by construction, is optimised to **manipulate only strict data types** (so forget nullable types or variable-size things like strings, in short, forget managed objects).

On the Unity side, the architecture therefore relies on *NativeArrays/NativeLists* or *FixedString64Bytes*, with the goal of tightly controlling memory allocation.

```csharp
partial struct SYS_Unit_Move : ISystem
{
    EntityQuery Query_Units;

    public void OnCreate(ref SystemState state)
    {
        Query_Units = SystemAPI.QueryBuilder()
                        .WithAll<TAG_Unit>()
                        .WithAll<LocalTransform>()
                        .WithAll<COMP_Unit_Movement>()
                        .Build();
    }

    public void OnUpdate(ref SystemState state)
    {
        EntityManager EM = state.EntityManager;

        // Retrieves unit data
        NativeArray<Entity> Units = Query_Units.ToEntityArray(Allocator.Temp);
        NativeArray<COMP_Unit_Movement> UnitsMovements = Query_Units.ToComponentArray<COMP_Unit_Movement>(Allocator.Temp);
        NativeArray<LocalTransform> UnitsTransforms = Query_Units.ToComponentArray<LocalTransform>(Allocator.Temp);

        // Simple movement loop
        float DeltaTime = SystemAPI.Time.DeltaTime();
        for (int UnitID = 0; UnitID < Units.Length; UnitID++)
        {
            COMP_Unit_Movement UnitMovement = UnitsMovements[UnitID];
            LocalTransform UnitTransfom = UnitsTransforms[UnitID];
            UnitTransfom.Position += DeltaTime * UnitMovement.Speed * UnitMovement.Direction;
            EM.SetComponent(Units[UnitID], UnitTransfom);
        }

        // Frees memory
        Units.Dispose();
        UnitsMovements.Dispose();
        UnitsTransforms.Dispose();
    }
}
```

But this example is an extremely basic and poorly optimised implementation (on top of being fairly heavy to manage). Because there is a much more performant approach that takes advantage of contiguous memory layout: *IJobEntity*.

The idea is fairly simple: let's parallelise processing over multiple threads, each one handling a chunk of entities.

```csharp
partial struct SYS_Unit_Move : ISystem
{
    public void OnCreate(ref SystemState state)
    {
        // the system only runs if at least one unit can move
        state.RequireForUpdate<TAG_Unit_IsMovable>();
    }

    public void OnUpdate(ref SystemState state)
    {
        Job_UnitMove JobMove = new Job_UnitMove
        {
            DeltaTime = SystemAPI.Time.DeltaTime()
        }
        // parallel scheduling handled automatically by Unity
        state.Dependency = JobMove.ScheduleParallel(state.Dependency);
    }

    [BurstCompile] // Advanced compilation taking advantage of the strict ECS/Jobs implementation
    [WithAll(typeof(TAG_Unit_IsMovable))] // Filter on enabled units
    partial struct Job_UnitMove : IJobEntity
    {
        public float DeltaTime;

        // Query on the manipulated components
        // with an added strict ReadWrite/ReadOnly notion
        public void Execute(RefRW<LocalTransform> Transform,
                            RefRO<COMP_Unit_Movement> COMP_Movement) 
        {
            COMP_Unit_Movement UnitMovement = COMP_Movement.ValueRO;
            Transform.ValueRW.Position += DeltaTime * UnitMovement.Speed * UnitMovement.Direction;
        }
    }
}
```

On top of that, we add **[BurstCompile]**, which replaces the generic C# machine code produced through Mono/.NET JIT with LLVM-based compilation (the same backend used by Rust/Swift...) and highly optimised machine code.
That's why we don't use managed objects and why exceptions, garbage collector allocations, and so on are effectively forbidden by design. You get the strength of ECS (contiguous data) combined with strong low-level compilation (SIMD / cache locality), making the whole thing very performant.

Using Unity in an ECS context feels a lot like working with highly typed languages such as **Rust** (and **Bevy** is a native ECS for that reason). And it's also one of the difficulties to overcome when coming from classic OOP/GameObject workflows: you move to an implementation that requires a certain coding rigour (which I personally enjoy a lot, and which produces a far more predictable result).

---

**Thinking in ECS**

I really like comparing ECS architecture to a classic DBMS architecture, because in both cases we're applying a **Data Oriented/Driven** philosophy.

An entity can represent a row in a table, with its notion of a PrimaryKey associating it with a unique business object, while carrying **Components** that are essentially the columns of that table.
The table then becomes a representation of the **Archetype** in memory. So we can picture entities with a *COMP_Unit_Movement* as a table like this:

| Entity | Direction | Speed |
|--------|--------|-----------|
| 1 | (0, 0, 1) | 0.5 |
| 2 | (0.5, 0, 0.4) | 0.7 |
| 3 | (1, 0, 0.2) | 0.2 |

I find that to be a very practical mental model, because if you've already written SQL queries, you immediately adopt certain reflexes about how you're going to compartmentalise data into logical business tables.

But an entity can also represent a unique reference table. For example, my units can have their movement speed altered. Instead of storing a `NormalSpeed + CurrentSpeed` in every unit **Component**, which would make little sense because it would duplicate the same data:

| Entity | Direction | CurrentSpeed | NormalSpeed |
|--------|--------|-----------|-----------|
| 1 | (0, 0, 1) | 0.5 | 0.5 |
| 2 | (0.5, 0, 0.4) | 0.7 | 0.5 |
| 3 | (1, 0, 0.2) | 0.2 | 0.5 |


I can create a singleton reference entity that carries the `NormalSpeed`. And personally, I name these singleton reference structures precisely with the **REF_*** prefix.

I can therefore transform my unit movement data like this:

```csharp
//***** COMPONENTS *****
// Query filter and functional movement state
public struct TAG_Unit_IsMovable : IComponentData, IEnableableComponent {}

// Movement capability at time T
public struct COMP_Unit_Movement : IComponentData 
{
    public float3 Direction;
    public float SpeedMultiplier;
}

// unique singleton shared by all units
public struct REF_Unit_Movement : IComponentData 
{
    public float NormalSpeed;
}

//***** SYSTEM *****
partial struct SYS_Unit_Move : ISystem
{
    EntityManager EM;

    public void OnCreate(ref SystemState state)
    {
        EM = state.EntityManager;

        // I declare a unique singleton on startup
        Entity REFMovementEntity = EM.CreateEntity();
        EM.SetName(REFMovementEntity, "REF_Unit_Movement");
        EM.AddComponent(REFMovementEntity, new REF_Unit_Movement
        {
            NormalSpeed = 0.5f
        });

        state.RequireForUpdate<TAG_Unit_IsMovable>();
        // the system now also needs the singleton to exist
        state.RequireForUpdate<REF_Unit_Movement>();
    }

    public void OnUpdate(ref SystemState state)
    {
        Job_UnitMove JobMove = new Job_UnitMove
        {
            // I now pass the singleton Component into my job
            REF_Movement = SystemAPI.GetSingleton<REF_Unit_Movement>(),
            DeltaTime = SystemAPI.Time.DeltaTime()
        };
        state.Dependency = JobMove.ScheduleParallel(state.Dependency);
    }

    [BurstCompile]
    [WithAll(typeof(TAG_Unit_IsMovable))] // Unit filter
    partial struct Job_UnitMove : IJobEntity
    {
        [ReadOnly] public REF_Unit_Movement REF_Movement;
        public float DeltaTime;

        public void Execute(RefRW<LocalTransform> Transform,
                            RefRO<COMP_Unit_Movement> COMP_Movement) 
        {
            COMP_Unit_Movement UnitMovement = COMP_Movement.ValueRO;
            Transform.ValueRW.Position +=
                DeltaTime
                // unique reference speed that never changes
                * REF_Movement.NormalSpeed
                // time-varying multiplier specific to each unit, default = 1
                * UnitMovement.SpeedMultiplier
                * UnitMovement.Direction;
        }
    }
}
```

And the advantage compared with a constant is that I can modify the value of the *REF_Unit_Movement* component live without having to recompile the game (and on top of that it makes tuning easier and allows units to evolve during the game).

And that's where, in my opinion, all the beauty (and difficulty) of ECS lies. **Data Oriented** really lives up to its name, because data consumption is directly tied to the way you expose that data, which is, strictly speaking, the opposite of OOP, whose goal is to design objects that act as autonomous orchestrators.

In ECS, I'd tend to say that the most important thing in design is the **Component**. Make one bloated catch-all component and you'll end up with monstrous systems that have to manage logical concerns that have nothing to do with one another. On the other hand, make your components too fine-grained and you'll drown in a pile of structures with queries ten kilometres long.

Designing components and entities takes some time before you find the right balance and the right way to reason in terms of logical systems. Personally, I like the KISS approach (Keep It Stupidly Simple), and I work on the principle that a **System** should only handle a very limited action, which makes it easier to debug and naturally simplifies **Component** design:
- what does a system that moves my units need? -> if the queried **Components** carry unused data, maybe they have no business being here
- is this data shared or does it need to be reset to a defined value? -> **Reference singleton**
- is this data specific to each unit? -> **Component** on the entity
- is this data repeatable? -> **IBuffer** vs **IComponent**


Also, since ECS is data-oriented, I've adopted a folder layout with files dedicated to **Components**, because it's important to be able to quickly visualise all the data associated with a given entity type.

<a href="/static/png/ECS/ECS_FileOrganization.png" target="_blank"><img src="/static/png/ECS/ECS_FileOrganization.png" alt="Project file organisation" width="100%"/></a>


In short, ECS takes some practice, but once you're in it, you start optimising data very naturally (maybe even a bit too naturally, and that's currently one of the difficulties I run into, over-engineering my structures when I only have 5 lonely entities fighting in my scene, though I think that would deserve its own dedicated article on ECS anti-patterns to watch out for 👀).

In any case, it's a very enriching way to think about architecture!

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
