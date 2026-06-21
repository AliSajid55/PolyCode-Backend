# Lesson 1: Introduction to C#

C# (pronounced "C-Sharp") is a modern, object-oriented, type-safe programming language developed by Microsoft. It runs on the .NET platform and is widely used for building everything from desktop software and enterprise web applications to mobile apps and video games.

---

## 1. Why Learn C#?

* **Versatility:** Power backend web services, cross-platform mobile apps (via MAUI), cloud-native applications, and games (via Unity or Raylib).
* **Memory Management:** You don't have to manage memory manually. C# uses an automatic **Garbage Collector (GC)** that reclaims memory occupied by objects no longer in use.
* **Strong Type Safety:** The language enforces strict rules at compile time, catching errors before your application even runs.
* **Massive Ecosystem:** Supported by a massive community, robust documentation, and a rich standard library provided by the .NET ecosystem.

---

## 2. The .NET Ecosystem

C# and .NET work together. Think of C# as the language you write, and .NET as the engine and toolset that executes it.

```
[ Your C# Source Code (.cs) ]
              │
              ▼ (Compiler: csc)
[ Common Intermediate Language (CIL) ]
              │
              ▼ (.NET Runtime / JIT)
[ Native Machine Code (010101) ]

```

When you build a C# application, it compiles into **Common Intermediate Language (IL)**. When the application runs, the **Just-In-Time (JIT)** compiler inside the .NET runtime translates that IL code into native machine code optimized for the host operating system.

---

## 3. Core Architecture Concepts

* **Managed Code:** Code written in C# is called "managed code" because its execution is entirely supervised by the .NET runtime, which handles safety, security, and memory.
* **Cross-Platform:** Modern .NET runs natively across Windows, Linux, and macOS.

---

---

