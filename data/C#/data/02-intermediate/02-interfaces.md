# Lesson 2: Interfaces

As learned in the previous lesson, a C# class can only inherit from one single parent class. This limitation is known as single inheritance. To get around this restriction and allow classes to share a strict set of behaviors without forcing a parent-child relationship, C# uses **Interfaces**.

An interface is a completely abstract contract that defines *what* a class must do, but not *how* it does it.

---

## 1. What is an Interface?

An interface contains definitions for a group of related functionalities. Any class that implements an interface must provide the actual code (the implementation) for those definitions.

* **The Blueprint analogy:** If a class is a physical blueprint for building an item, an interface is a compliance certificate. It guarantees that the item will have specific interactive features, regardless of how it was built.
* **Naming Convention:** In C#, interface names always start with a capital letter **`I`** (e.g., `IDamageable`, `ILoggable`, `IPlayable`).

---

## 2. Declaring and Implementing an Interface

Interfaces look similar to classes, but you use the `interface` keyword, and methods inside it do not have a code body `{}`—they end directly with a semicolon.

```csharp
using System;

// 1. Interface declaration
public interface ISavable
{
    // A contract method with no implementation body
    void SaveData();
}

// 2. Implementing the interface in a class
public class GameProgress : ISavable
{
    public int CurrentLevel { get; set; }

    // The class MUST provide the concrete implementation of SaveData
    public void SaveData()
    {
        Console.WriteLine($"Saving game state: Reached Level {CurrentLevel}.");
    }
}

```

---

## 3. Multiple Interfaces

Unlike traditional class inheritance, a single class can implement as many interfaces as your application requires. This allows you to stitch separate behaviors onto a single entity cleanly.

```csharp
public interface IPlayable
{
    void Play();
}

public interface IStoppable
{
    void Stop();
}

// MediaProcessor implements BOTH contracts simultaneously
public class MediaProcessor : IPlayable, IStoppable
{
    public void Play()
    {
        Console.WriteLine("Media reproduction initialized.");
    }

    public void Stop()
    {
        Console.WriteLine("Media reproduction halted.");
    }
}

```

---

## 4. Interfaces vs. Abstract Classes

While both interfaces and abstract classes are used to enforce a structure and cannot be instantiated directly on their own, they serve fundamentally different design purposes:

| Feature | Interfaces | Abstract Classes |
| --- | --- | --- |
| **Inheritance** | A class can implement **multiple** interfaces. | A class can inherit from **only one** parent class. |
| **Implementation** | Historically cannot hold code logic (C# 8 allows default methods, but primarily holds declarations). | Can contain fully written methods alongside incomplete ones. |
| **Fields/Variables** | Cannot contain state variables or fields. | Can contain fields, constants, and variables to hold object state. |
| **Relationship** | Defines a peripheral capability (**"Can-Do"** relationship). | Defines a foundational identity (**"Is-A"** relationship). |

---

## 5. Explicit vs. Implicit Interface Implementation

By default, interfaces are implemented **implicitly**, which means the methods are declared as `public` directly inside the class code block.

However, if a class implements two separate interfaces that share a method with the exact same name, you can use **explicit implementation** to eliminate naming conflicts by prefixing the method name with the interface path.

```csharp
public interface IConsoleView
{
    void Render();
}

public interface IWebView
{
    void Render();
}

public class MultiRenderer : IConsoleView, IWebView
{
    // Explicitly implementing IConsoleView
    void IConsoleView.Render()
    {
        Console.WriteLine("Rendering plain text to system console.");
    }

    // Explicitly implementing IWebView
    void IWebView.Render()
    {
        Console.WriteLine("Rendering responsive layout components for web browsers.");
    }
}

```

To call an explicitly implemented method, you must cast the object to the specific interface type first:

```csharp
MultiRenderer engine = new MultiRenderer();

// engine.Render(); // ERROR: The compiler won't know which one you mean!

IConsoleView consoleTarget = engine;
consoleTarget.Render(); // Output: Rendering plain text to system console.

```