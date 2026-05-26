---
title: 💡 2 - ECS, penser la data
---

<style>
    p, li, div { text-align: justify; }
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
                <a href="/static/png/ECS/Unity_ECS.png" target="_blank"><img src="/static/png/ECS/Unity_ECS.png" alt="Unity ECS" width="100%"/></a>
            </div>       
        </div>
    </blockquote>
</div>

<p style="text-align: center;"><a href="../index.xml">🔊 S'abonner au flux RSS</a></p>

<p style="display: flex; justify-content: center; align-items: center;">________________________________________________________</p>

Maintenant que vous avez compris le <a href="https://keilthar.github.io/devlog/fr/ECS/Chapitre_001" target="_blank">pourquoi de l'architecture de l'ECS</a>, il est temps de s'intéresser plus en détail au **comment ça marche**  ⚙️.

Je vais traiter ici les bases des éléments qui composent un ECS et surtout la façon de les penser, qui est très différente de la façon de construire du code classique POO. Et ça vous demandera un temps d'adaptation non négligeable (personnellement ça m'a pris plusieurs mois avant de penser naturellement **Data Oriented**, mais une fois qu'on est dans le moule, c'est un bonheur).

Pour ça on va suivre tout du long de cet article un exemple simple d'entités représentant des unités qu'on voudra déplacer. On va s'attaquer à la logique même de l'ECS (liens entre Entities, Components et Systems) et surtout s'interroger sur comment on conceptualise l'architecture avec cette approche **Data Oriented**, que personnellement je renommerais même en **Data Driven**, vu l'état d'esprit dans lequel il nous plonge. Ce qui nous amènera d'ailleurs à revoir la définition basique des termes ECS et à les approfondir.

---

**Les Entities**

J'aurais tendance à dire qu'on a 2 définitions associées à une entité :
- **Technique** : c'est un simple identifiant unique qui relie entre eux des **Components**. Les entités peuvent alors être regroupées en **Archetypes** (des entités disposant des mêmes **Components**), qui seront rangées en mémoire de manière contigüe pour en optimiser l'accès en lecture/écriture.
  
- **Fonctionnelle** : c'est une représentation d'un concept métier. Une entité peut représenter un **GameObject** classique (Player, Unit, Projectile, Decor...). Mais dans le cadre d'un ECS, elle peut aussi être un **porteur de données centralisées**, type **Singleton** (avancement de la partie, système de points, taille de la carte...), remplaçant les classes et constantes static qu'on utilise habituellement pour partager de la data au travers du code.

```csharp
partial struct SYS_Unit_Spawn : ISystem
{
    public void OnCreate(ref SystemState state)
    {
        EntityManager EM = state.EntityManager;

        // Crée une entité vide avec un identifiant unique
        Entity UnitEntity = EM.CreateEntity(); 

        // Ajout des Components qui caractérisent
        // l'entité comme une unité mobile
        EM.SetName(UnitEntity, "Unit");
        EM.AddComponent(UnitEntity, new LocalTransform());
        EM.AddComponent(UnitEntity, new TAG_Unit());
        EM.AddComponent(UnitEntity, new COMP_Unit_Movement());
        // + tout autre component utile à l'unité
    }
}
```
---

**Les Components**

Dans le chapitre 1, j'avais décrit les **Components** comme de simples "conteneurs de données (des *structs*)".

Par exemple sur **Unity**, on va disposer de 2 grands types de **Components**, que sont les **IComponentData** (donnée simple) et les **IBufferElementData** (liste de données).

```csharp
// Component unique, sans aucune data, (dés)activable pour pouvoir query les unités
public struct TAG_Unit : IComponentData, IEnableableComponent {}

// Component simple car une unité n'a qu'une seule définition de son mouvement
public struct COMP_Unit_Movement : IComponentData
{
    public float3 Direction;
    public float Speed;
    public bool CanMove;
}

// Buffer car j'aurais besoin d'autant de struct que de types de dégats gérés
public struct BUFF_Unit_Defense : IBufferElementData
{
    public DamageType DamageType;
    public float DamageReduction;
}
```

Cependant avec cette définition, je vous ai un peu (beaucoup 😏) menti au nom de la simplification. Car c'est passer à côté de la philosophie générale de l'ECS que de définir les **Components** uniquement comme des porteurs de données. Ils sont bien plus que ça.

<div style="display: flex; gap: 20px; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1;">
        <a href="/static/png/ECS/Factorio_MainBus.png" target="_blank"><img src="/static/png/ECS/Factorio_MainBus.png" alt="Factorio Main Bus" width="100%"/></a>
    </div>
    <div style="flex: 1;">

En soi, l'ensemble des **Components** représente un **bus de données publiques**, dans lesquels les **Systems** vont aller piocher (soit en lecture, soit en écriture) pour produire des traitements. Pour ceux qui ont joué à **Factorio**, j'aime beaucoup me le représenter mentalement comme le **Main Bus** qui distribue les ressources dans la base.

Autrement dit, un **System** est aveugle à l'état d'avancement d'une entité spécifique, il n'interagit qu'au travers de la data exposée de manière générique. Ceci impose donc que l'entité porte au travers de sa data son état et sa logique fonctionnelle de l'instant T pour que le **System** concerné puisse travailler.

</div>
</div>

Les **Components** sont donc à la fois élément **porteur de data**, mais aussi élément de **filtrage de data** au travers des **Queries**. Ils définissent fondamentalement **qui peut interagir avec quoi et surtout pourquoi**. C'est un peu contre-intuitif de prime abord, car le principe d'une entité ECS, c'est justement de ne pas porter de traitements et par extension pas de logique, mais le fait que l'entité doit exposer des états soumet l'architecture à une logique **data driven** (c'est pour ça que je préfère ce terme à **data oriented**).

Et c'est quelque chose d'extrêmement clivant, puisque le POO tend à rendre les **objets autonomes et fermés** (ce qui est d'ailleurs un des fondamentaux du Clean Code, même si le "Clean" est à mon humble avis, fort discutable...).

Par nature, **l'ECS impose de rendre explicite l'intégralité de l'état d'une entité, pas juste sa data brute** et c'est une gymnastique mentale à laquelle nous ne sommes pas historiquement habitués.

---

**Les Queries**

Une **Query**, c'est une requête pour récupérer des entités spécifiques. Pour ça, on définit la structure minimale de **Components** attachés aux entités concernées.
Cette structure doit forcément contenir les **Components** qu'un **System** va lire et/ou modifier, mais elle peut aussi contenir des **Components** de filtrage qui ne seront pas du tout utilisés par le **System** en soi, mais permet à l'engine de réduire le périmètre à traiter selon une logique fonctionnelle.

```csharp
    // Query sur toutes les Unités avec un TAG_Unit Enabled
    EntityQuery Query_Units = SystemAPI.QueryBuilder()
                        .WithAll<TAG_Unit>()
                        .WithAll<LocalTransform>()
                        .WithAll<COMP_Unit_Movement>()
                        .Build();

    // Récupération des unités et leur data pour traitement ensuite
    NativeArray<Entity> Units = Query_Units.ToEntityArray(Allocator.Temp);
    NativeArray<COMP_Unit_Movement> UnitsMovements = Query_Units.ToComponentArray<COMP_Unit_Movement>(Allocator.Temp);

    // Imaginons qu'il n'existe qu'une seule et unique unité qu'on voudrait récupérer
    Entity MyUniqueUnit = SystemAPI.GetSingletonEntity<TAG_Unit>();
    COMP_Unit_Movement MyUniqueMovement = SystemAPI.GetSingleton<COMP_Unit_Movement>();
```

Et c'est là où on peut se rendre compte de la puissance de l'ECS, parce qu'au travers des **Components**, on peut gérer non seulement de la data, mais comme je disais auparavant, on peut aussi gérer des états/logique fonctionnelle.

Imaginons par exemple que je ne veuille pas détruire mes unités quand elles meurent, mais juste les sortir de la carte et les désactiver jusqu'à un prochain respawn. Et bien je pourrais simplement désactiver leur **Component** TAG_Unit quand leurs PVs atteignent 0, puis lorsque j'ai de nouveau besoin, les récupérer simplement via :

```csharp
    // Query toutes les Unités dont TAG_Unit est Disabled
    EntityQuery Query_Units = SystemAPI.QueryBuilder()
                        .WithDisabled<TAG_Unit>()
                        .Build();
```

Avec une approche POO classique, j'aurais dù gérer une liste d'unités désactivées, aller piocher dedans une unité, puis la retirer de la liste pour pouvoir enfin m'en servir.
Avec une approche ECS, plus besoin de faire un tracking par table/liste/hashmap.

Et à partir du moment où on commence à raisonner en état, on peut alors revoir la façon d'exposer la data. Reprenons mon exemple plus haut :

```csharp
public struct COMP_Unit_Movement : IComponentData
{
    public float3 Direction;
    public float Speed;
    public bool CanMove;
}
```

Dans une approche POO, avoir ces 3 informations ensemble semble tout à fait pertinent. Mais dans l'ECS, il serait bien meilleur de faire :
```csharp
public struct TAG_Unit_IsMovable : IComponentData, IEnableableComponent {}

public struct COMP_Unit_Movement : IComponentData
{
    public float3 Direction;
    public float Speed;
}
```

Ainsi un **System** gérant le mouvement de mes unités pourrait filtrer sur *TAG_Unit_IsMovable* et ne traiter que les unités concernées.
Là où un POO classique nous aurait obligé à récupérer toutes les unités et faire un *if (CanMove == false) return;*, nous obligeant à manipuler de la data inutile.

Cependant cette optimisation a aussi un coût : on démultiplie les struct qu'on manipule et si on n'est pas extrêmement rigoureux dans ses conventions de nommage et la compartimentation, 
ça peut très vite devenir un enfer de manager des centaines de **Components**. La **performance** de l'ECS a un **coût structurel et cognitif** non négligeable et génère une forme de boilerplate de structures qui peut devenir fatiguante à gérer (mais y a un truc un peu hype en ce moment qui est pas mal pour ce genre de tâche, ça commence par I et ça finit par A 🤖).

---

**Les Systems**

Les **Systems** sont des mini-usines dont l'objectif est de manipuler un set d'entités, qu'ils récupèrent via des **Queries**.
Un **System** par construction est optimisé pour ne **manipuler que des types de données stricts** (donc on oublie les types nullable ou a géométrie variable comme les strings, bref on oublie les objets managés).

Côté Unity, l'architecture s'appuie donc sur des *NativeArrays/NativeLists* ou des *FixedString64Bytes*, l'objectif étant de gérer finement l'allocation mémoire.

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

        // Récupération de la data des unités
        NativeArray<Entity> Units = Query_Units.ToEntityArray(Allocator.Temp);
        NativeArray<COMP_Unit_Movement> UnitsMovements = Query_Units.ToComponentArray<COMP_Unit_Movement>(Allocator.Temp);
        NativeArray<LocalTransform> UnitsTransforms = Query_Units.ToComponentArray<LocalTransform>(Allocator.Temp);

        // Boucle simple de mouvements
        float DeltaTime = SystemAPI.Time.DeltaTime();
        for (int UnitID = 0; UnitID < Units.Length; UnitID++)
        {
            COMP_Unit_Movement UnitMovement = UnitsMovements[UnitID];
            LocalTransform UnitTransfom = UnitsTransforms[UnitID];
            UnitTransfom.Position += DeltaTime * UnitMovement.Speed * UnitMovement.Direction;
            EM.SetComponent(Units[UnitID], UnitTransfom);
        }

        // Libération de la mémoire
        Units.Dispose();
        UnitsMovements.Dispose();
        UnitsTransforms.Dispose();
    }
}
```

Mais cet exemple est une implémentation extrêmement basique et peu optimisée (en plus d'être assez lourde à gérer). Parce qu'on dispose d'une approche bien plus performante qui exploite le rangement contigu en mémoire : les *IJobEntity*.

L'idée est plutôt simple : parallélisons le traitement sur plusieurs threads, chacun traitant un chunk d'entités.

```csharp
partial struct SYS_Unit_Move : ISystem
{
    public void OnCreate(ref SystemState state)
    {
        // le système ne tourne que s'il existe au moins une unité qui peut bouger
        state.RequireForUpdate<TAG_Unit_IsMovable>();
    }

    public void OnUpdate(ref SystemState state)
    {
        Job_UnitMove JobMove = new Job_UnitMove
        {
            DeltaTime = SystemAPI.Time.DeltaTime()
        }
        // planification parallélisée gérée par Unity automatiquement
        state.Dependency = JobMove.ScheduleParallel(state.Dependency);
    }

    [BurstCompile] // Compilation énervée profitant de l'implémentation stricte de l'ECS/Jobs
    [WithAll(typeof(TAG_Unit_IsMovable))] // Filtre sur les unités enabled
    partial struct Job_UnitMove : IJobEntity
    {
        public float DeltaTime;

        // Query, sur les components manipulés
        // avec en plus une notion de ReadWrite/ReadOnly stricte
        public void Execute(RefRW<LocalTransform> Transform,
                            RefRO<COMP_Unit_Movement> COMP_Movement) 
        {
            COMP_Unit_Movement UnitMovement = COMP_Movement.ValueRO;
            Transform.ValueRW.Position += DeltaTime * UnitMovement.Speed * UnitMovement.Direction;
        }
    }
}
```

En plus on insère le **[BurstCompile]** qui remplace la compilation C# via Mono/.NET JIT en code machine générique, par une compilation via LLVM (le même backend que Rust/Swift...) et du code machine optimisé.
C'est la raison qui fait qu'on n'utilise pas d'objets managés et on interdit par conception les exceptions, les allocations de garbage collector... On obtient alors la force de l'ECS (data contigüe) couplée à une compilation bas niveau forte (SIMD / cache locality) rendant le tout très performant.

Utiliser Unity dans un contexte ECS se rapproche très fortement de l'utilisation de langages très typés comme **Rust** (et **Bevy** est un ECS natif pour cette raison). Et c'est aussi une des difficultés à surmonter quand on vient du POO/GameObject classique, on passe sur une implémentation qui demande une certaine rigueur de code (que personnellement j'apprécie beaucoup et qui produit un résultat bien plus prédictif).

---

**Penser l'ECS**

J'aime beaucoup faire une comparaison entre l'architecture ECS et l'architecture d'un SGBD classique, parce que dans les 2 cas on applique une philosophie **Data Oriented/Driven**.

Une entité peut représenter une ligne d'une table, avec sa notion de PrimaryKey l'associant à un objet métier unique, et portant des **Components** qui sont en fait les colonnes de la table.
La table est alors une représentation de l'**Archetype** en mémoire. On peut alors se représenter les entités avec un *COMP_Unit_Movement* comme une table :

| Entity | Direction | Speed |
|--------|--------|-----------|
| 1 | (0, 0, 1) | 0.5 |
| 2 | (0.5, 0, 0.4) | 0.7 |
| 3 | (1, 0, 0.2) | 0.2 |

Je trouve ça très pratique comme représentation mentale, parce que si vous avez déjà fait de la requête SQL, vous adoptez tout de suite certains réflexes sur comment vous allez compartimenter la data en tables métier logique.

Mais une entité peut aussi représenter une table référentielle unique. Par exemple, mes unités peuvent voir leur vitesse de déplacement altérée. Plutôt que de stocker un NormalSpeed + CurrentSpeed dans chaque **Component** de chaque unité, ce qui n'aurait aucun sens car ça démultiplierait la même data :

| Entity | Direction | CurrentSpeed | NormalSpeed |
|--------|--------|-----------|-----------|
| 1 | (0, 0, 1) | 0.5 | 0.5 |
| 2 | (0.5, 0, 0.4) | 0.7 | 0.5 |
| 3 | (1, 0, 0.2) | 0.2 | 0.5 |


Je peux créer une entité singleton référentielle qui portera le NormalSpeed. Et personnellement, ces structures singletons référentielles, je les nomme justement **REF_***.

Je peux donc transformer ma data de mouvement d'unité ainsi :

```csharp
//***** COMPONENTS *****
// Filtre de query et état fonctionnelle du mouvement
public struct TAG_Unit_IsMovable : IComponentData, IEnableableComponent {}

// Capacité de mouvement à l'instant T
public struct COMP_Unit_Movement : IComponentData 
{
    public float3 Direction;
    public float SpeedMultiplier;
}

// singleton unique partagé par toutes les unités
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

        // je déclare un singleton unique au démarrage
        Entity REFMovementEntity = EM.CreateEntity();
        EM.SetName(REFMovementEntity, "REF_Unit_Movement");
        EM.AddComponent(REFMovementEntity, new REF_Unit_Movement
        {
            NormalSpeed = 0.5f
        });

        state.RequireForUpdate<TAG_Unit_IsMovable>();
        // le système a désormais besoin de l'existence du singleton pour tourner
        state.RequireForUpdate<REF_Unit_Movement>();
    }

    public void OnUpdate(ref SystemState state)
    {
        Job_UnitMove JobMove = new Job_UnitMove
        {
            // désormais je passe le Component du singleton dans mon job
            REF_Movement = SystemAPI.GetSingleton<REF_Unit_Movement>(),
            DeltaTime = SystemAPI.Time.DeltaTime()
        };
        state.Dependency = JobMove.ScheduleParallel(state.Dependency);
    }

    [BurstCompile]
    [WithAll(typeof(TAG_Unit_IsMovable))] // Filtre d'unité
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
                // vitesse référentielle unique qui ne changera jamais
                * REF_Movement.NormalSpeed
                // multiplicateur variable dans le temps spécifique à chaque unité, par défaut = 1
                * UnitMovement.SpeedMultiplier
                * UnitMovement.Direction;
        }
    }
}
```

Et l'avantage par rapport à une constante : je peux modifier la valeur en live du component *REF_Unit_Movement* sans avoir à recompiler le jeu (et en plus ça facilite le tuning et permet de faire évoluer les unités au cours de la partie).

Et c'est là à mon sens toute la beauté (et la difficulté) de l'approche ECS. Le **Data Oriented** porte bien son nom, puisque la consommation de la data est directement liée à la façon dont vous l'exposez, ce qui est à proprement parler l'approche inverse du POO qui vise à concevoir des objets qui sont des orchestrateurs autonomes.

Dans l'ECS, j'aurais tendance à dire que le plus important dans le design, c'est le **Component**. Faites un component fourre-tout et vous obtiendrez des systèmes monstrueux qui devront gérer des éléments logiques qui n'ont aucun rapport entre eux. Au contraire, faites des components trop fins et vous vous noierez dans un amas de structures avec des query de 10 km de long.

La conception des components et des entités demande un certain temps d'adaptation pour trouver un équilibre et de trouver une façon de raisonner avec des systèmes logiques. Personnellement j'aime l'approche KISS (Keep It Stupidly Simple) et je pars du principe qu'un **System** ne doit traiter qu'une action très limitée, ce qui le rend simple à debug et facilite de facto la conception des **Components** :
- de quoi a besoin un système qui va faire bouger mes unités ? -> si les **Components** query portent des données non utilisées, peut-être n'ont elles rien à faire ici
- cette data est partagée ou a besoin d'être reset à une valeur définie ? -> **Singleton référentiel**
- cette data est spécifique à chaque unité ? -> **Component** sur l'entité
- cette data est-elle répétable ? -> **IBuffer** vs **IComponent**


D'ailleurs comme l'ECS est orienté data, j'ai aussi adopté une compartimentation de mes dossiers avec des fichiers dédiés aux **Components**, parce que c'est important de pouvoir visualiser rapidement toute la data associée à un type d'entité donné.

<a href="/static/png/ECS/ECS_FileOrganization.png" target="_blank"><img src="/static/png/ECS/ECS_FileOrganization.png" alt="Organisation fichiers projet" width="100%"/></a>


Bref l'ECS demande une certaine pratique mais une fois qu'on est dedans, on se met à optimiser la data très naturellement (peut-être même trop et c'est actuellement une des difficultés que j'éprouve à trop over-engineer mes structures alors que j'ai 5 entités qui se battent en duel dans ma scène, mais je pense que ça mériterait un article dédié d'anti-pattern ECS à surveiller 👀).

En tout cas, c'est une approche très enrichissante dans la manière de penser une architecture !

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
