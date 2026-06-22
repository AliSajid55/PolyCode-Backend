# Lesson 4: Software Architecture

As an application grows from a solo capstone project into an enterprise ecosystem, how you structure your codebase determines whether it will succeed or collapse under its own weight. **Software Architecture** is the high-level blueprint that defines how your software components are organized, how they communicate with one another, and how they scale.

Good architecture separates responsibilities so that a change in one part of the system doesn't trigger a domino effect of bugs across the entire application.

---

## 1. Monolithic Architecture

A **Monolith** is an architectural pattern where the entire software application—including the user interface, backend business logic, and database access layers—is bundled together into a **single, unified codebase and deployment unit**.

```
┌────────────────────────────────────────────────────────┐
│                  Monolithic App                        │
│                                                        │
│  [ UI Layer ] ──► [ Business Logic ] ──► [ Data Access]│
└───────────────────────────┬────────────────────────────┘
                            ▼
                    [ Single Database ]

```

* **Pros:** Simple to build, test, and deploy initially. Communication between components is incredibly fast because it all happens within the same server memory.
* **Cons:** As the team grows, conflicts occur because everyone is modifying the same codebase. Scaling is inefficient—if one specific background calculation engine requires massive RAM, you have to duplicate and scale the *entire* application instance.

---

## 2. Microservices Architecture

A **Microservices Architecture** decomposes a large application into a collection of **small, independent, loosely coupled services**. Each microservice focuses on a single, isolated business capability (e.g., an `IdentityService`, a `CatalogService`, and a `PaymentService`), maintains its own private database, and runs as an independent process.

Services communicate over a network using lightweight protocols like HTTP REST APIs, gRPC, or asynchronous message brokers (like RabbitMQ or Azure Service Bus).

* **Pros:** Highly scalable. You can scale or update the `PaymentService` without touching or redeploying any other part of the system. Teams can work completely independently using different tech stacks.
* **Cons:** Introducing network communication brings high complexity. You have to handle network latency, data consistency across separate databases, and complex distributed logging configurations.

---

## 3. Layered (N-Tier) Architecture

Layered architecture organizes code into horizontal layers, where each layer has a specific role and only communicates with the layer directly beneath it. This is the foundation that most classic ASP.NET Core MVC and Web API applications build upon.

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│         (Blazor UI, Controllers, Razor Pages)          │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Business Logic Layer                   │
│             (Domain Rules, Processors)                 │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Data Access Layer                     │
│               (Entity Framework Core)                  │
└────────────────────────────────────────────────────────┘

```

* **Presentation Layer:** Intercepts user inputs and HTTP web requests.
* **Business Logic Layer (BLL):** Enforces core operational rules and data transformations.
* **Data Access Layer (DAL):** Directly talks to the database or external storage systems.

While structured, the main drawback is **top-down coupling**: the business logic layer is directly dependent on the specific data access framework you choose, making it difficult to swap databases or run isolated unit tests without complex mocking configurations.

---

## 4. Clean Architecture (Domain-Driven)

As discussed in your capstone planning, **Clean Architecture** (or Onion/Hexagonal Architecture) flips traditional layered design on its head. Instead of your core code depending on a database, **dependencies point inward** toward an independent core layer called the **Domain**.

* **Domain (The Core Circle):** Absolute rules, models, and entities. It has **zero dependencies** on external libraries (like EF Core) or software frameworks.
* **Application:** Use cases and interface definitions (contracts).
* **Infrastructure:** Implementations of your contracts (e.g., writing the actual database query or sending an email via a specific cloud provider).
* **Presentation:** Web APIs, Blazor interfaces, or terminal views.

Because the core domain layer only relies on raw language structures, your absolute core business logic is completely isolated from framework updates, database swaps, or external API failures, making the system incredibly durable and easily testable.

---

## 5. Architectural Trade-offs Summary

Choosing an architecture is never about finding the "best" pattern; it is about choosing the right set of trade-offs for your team and project scale.

| Architectural Pattern | Complexity | Testability | Best Used For |
| --- | --- | --- | --- |
| **Monolithic** | Low | Moderate | Small to mid-sized applications, rapid prototypes, and small, unified development teams. |
| **Microservices** | High | Complex | Massive enterprise systems with distinct sub-teams requiring separate deployment cycles. |
| **Layered (N-Tier)** | Moderate | Moderate | Standard business applications with straightforward data workflows. |
| **Clean Architecture** | High | Excellent | Long-term systems where business rules change frequently or code must stay completely decoupled from infrastructure. |