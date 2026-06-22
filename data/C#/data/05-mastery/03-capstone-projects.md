# Lesson 3: Capstone Projects in C#

To transition from an intermediate programmer to a confident software developer, you must move beyond isolated code snippets and build comprehensive, end-to-end applications. A **Capstone Project** integrates multiple advanced programming concepts—such as architecture design, databases, API integration, and asynchronous pipelines—into a single, cohesive ecosystem.

When building a portfolio-grade project, the focus shifts from simply writing functional code to designing scalable, maintainable, and clean architectures.

---

## 1. Architectural Blueprint: Clean Architecture

For larger projects, putting all your code into a single project folder creates a brittle system. Industry-standard portfolio applications often use a multi-layered design pattern like **Clean Architecture** or **Hexagonal Architecture**.

The fundamental rule is that dependencies only point *inward*. Your core business logic should never know what database or UI framework you are using.

* **Domain (Core):** Contains the absolute fundamental business entities (e.g., `User`, `Transaction`) and rules. This layer has zero dependencies on external libraries, databases, or frameworks.
* **Application:** Handles the use cases of your system (e.g., `RegisterUserCommand`, `ProcessPayment`). It acts as the coordinator, relying on abstract interfaces.
* **Infrastructure:** Implements the interfaces defined in the application layer. This is where Entity Framework Core (`DbContext`), file system storage, or external email API clients live.
* **Presentation (API / UI):** The entry point of the system—either an ASP.NET Core Web API, a Blazor application, or a console dashboard.

---

## 2. Project Idea 1: Full-Stack Web & API Ecosystem

**Focus:** *Web Architecture, Database Management, Security, and Dependency Injection.*

Build a comprehensive web ecosystem, such as an **Author's Interactive Toolkit** or a **Content Management Engine**. The solution splits cleanly into two distinct repos or multi-project solutions:

### The Backend: ASP.NET Core REST API

* Expose endpoints using the **Controller-Based** approach for structured handling.
* Implement **Entity Framework Core** with a relational database (SQLite or PostgreSQL) using a *Code-First* migration workflow.
* Secure your endpoints by separating database models from user-facing data using **Data Transfer Objects (DTOs)**.
* Protect your application from browser blocks by explicitly configuring **CORS** rules for your frontend domain.

### The Frontend: Blazor WebAssembly (or a JavaScript Framework)

* Create interactive, reusable **Razor Components** to manage user state.
* Use **Two-Way Data Binding** to capture input data dynamically without page reloads.
* Communicate asynchronously over the network with your backend API using `HttpClient` and `async/await`.

---

## 3. Project Idea 2: High-Performance Engine or Desktop Game

**Focus:** *Algorithms, Advanced Data Structures, and Low-Level Systems.*

Build a complex simulation, data processor, or interactive game engine, such as a **Pathfinding Grid Simulation** or a structured **Tower Defense / Strategy Game Engine**.

```
[ Game Loop Thread ] ──► [ Update Mechanics ] ──► [ Fixed Frame Render ]
                                │
                        (Requires High-Speed Lookup)
                                ▼
                   ┌─────────────────────────┐
                   │ Custom Data Structures  │
                   │ - High-Speed Hash Maps  │
                   │ - Pathfinding Graphs    │
                   └─────────────────────────┘

```

* **Custom Data Structures:** Instead of basic arrays, model spatial networks or map routes using **Graphs** and **Adjacency Lists**.
* **Pathfinding Algorithms:** Implement algorithms like **A* (A-Star)** or **Dijkstra's Algorithm** to calculate efficient routes across your data graph structure dynamically.
* **Memory Optimization:** Because loops in a simulation or game run thousands of times per second, use high-speed **Hash Tables** (`HashSet<T>`) for constant time $O(1)$ collision or coordinate checking. Avoid runtime heap allocation penalties by leveraging memory reusability techniques.

---

## 4. Engineering Best Practices for Capstone Success

Regardless of the project path you select, your codebase should demonstrate enterprise-grade engineering principles:

* **Automated Quality Gates:** Include a separate testing project inside your solution. Use the **AAA Pattern** and mocking libraries (`Moq`) to build thorough **Unit Tests** isolating your core business calculations.
* **Robust Exception Resilience:** Implement strategic, specific `try-catch-finally` blocks around unmanaged resources or unstable web actions, or utilize global middleware error catchers to avoid application-wide crashes.
* **Diagnostic Transparency:** Ditch `Console.WriteLine` in favor of a modern **Structured Logging** abstraction (`ILogger<T>`). Route your log output cleanly into a file or an analysis sink using template parameters like `LogInformation("Processing entity {EntityId}", id)`.
* **Continuous Integration Pipelines:** Check your project code into GitHub and create an automated **CI/CD Pipeline** using **YAML** syntax. Configure the pipeline to pull, compile, and run your unit test suite on every branch push, ensuring your code remains consistently deployable.