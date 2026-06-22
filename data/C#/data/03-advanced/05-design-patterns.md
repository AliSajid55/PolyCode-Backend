# Lesson 5: Design Patterns

When building software, developers frequently encounter the same architectural problems over and over again—such as managing a single global configuration, decoupling communication between elements, or creating complex objects step-by-step.

Instead of reinventing the wheel each time, you can apply **Design Patterns**. A design pattern is a reusable, time-tested template or blueprint that solves a common structural problem in software design. They are not specific pieces of code, but rather conceptual guidelines for structuring your classes and objects.

---

## 1. Classifications of Design Patterns

Design patterns are traditionally split into three fundamental categories based on their primary architectural objective:

* **Creational Patterns:** Deal with object creation mechanisms, ensuring objects are initialized safely and efficiently without exposing internal creation logic.
* **Structural Patterns:** Focus on how classes and objects compose together to form larger, flexible structures.
* **Behavioral Patterns:** Concerned with communication, algorithms, and assigning clear responsibilities between interacting objects.

---

## 2. Creational: The Singleton Pattern

The **Singleton Pattern** ensures that a class has **only one single instance** globally in memory throughout the lifetime of the application, and provides a single, unified point of access to it. It is commonly used for resource-intensive operations like central configuration managers, loggers, or database connection pools.

```csharp
using System;

public class ConfigurationManager
{
    // 1. A private static variable to hold the single instance
    private static ConfigurationManager _instance;

    // 2. A private constructor prevents external files from using 'new'
    private CarConfigurationManager() { }

    // 3. A public static property provides the global entry point
    public static ConfigurationManager Instance
    {
        get
        {
            // Create the instance only if it doesn't exist yet (Lazy Initialization)
            if (_instance == null)
            {
                _instance = new ConfigurationManager();
            }
            return _instance;
        }
    }

    public string Theme { get; set; } = "Dark Mode";
}

```

### Consuming the Singleton

```csharp
// Both variables point to the exact same object location on the heap
ConfigurationManager appSettings = ConfigurationManager.Instance;
ConfigurationManager userSettings = ConfigurationManager.Instance;

userSettings.Theme = "Light Mode";

Console.WriteLine(appSettings.Theme); // Output: Light Mode

```

---

## 3. Structural: The Adapter Pattern

The **Adapter Pattern** acts as a bridge between two incompatible interfaces. It wraps an existing class with a new interface layer so an old or third-party library can seamlessly work with your modern application code without altering either codebase directly.

Think of it like a physical travel adapter that lets you plug a three-prong electronic device into a two-prong wall outlet.

```csharp
// 1. The interface your application expects
public interface ITargetJsonReader
{
    void ReadJsonData();
}

// 2. An incompatible third-party class that you cannot modify directly
public class LegacyXmlReader
{
    public void ReadXmlData() => Console.WriteLine("Processing complex XML data stream...");
}

// 3. The Adapter Class combining them
public class DataAdapter : ITargetJsonReader
{
    private readonly LegacyXmlReader _legacyReader;

    public DataAdapter(LegacyXmlReader legacyReader) => _legacyReader = legacyReader;

    public void ReadJsonData()
    {
        // Translate the request smoothly behind the scenes
        _legacyReader.ReadXmlData();
    }
}

```

---

## 4. Behavioral: The Strategy Pattern

The **Strategy Pattern** allows you to define a family of interchangeable algorithms, encapsulate each one inside a separate class, and dynamically switch between them at runtime based on user actions or application settings. This completely eliminates messy, massive `if-else` or `switch` chains.

```csharp
using System;

// 1. The common Strategy interface
public interface IRenderStrategy
{
    void RenderUI();
}

// 2. Concrete Strategy A
public class HighGraphicsStrategy : IRenderStrategy
{
    public void RenderUI() => Console.WriteLine("Rendering detailed textures and realistic shadows.");
}

// 3. Concrete Strategy B
public class PerformanceStrategy : IRenderStrategy
{
    public void RenderUI() => Console.WriteLine("Disabling shadows to optimize framerate.");
}

// 4. The Context class using the strategy
public class QualityController
{
    private IRenderStrategy _strategy;

    // Allows swapping the algorithm dynamically at any moment
    public void SetStrategy(IRenderStrategy strategy) => _strategy = strategy;

    public void ApplyGraphics() => _strategy.RenderUI();
}

```

### Swapping Algorithms Dynamically

```csharp
QualityController engine = new QualityController();

// Target performance mode initially
engine.SetStrategy(new PerformanceStrategy());
engine.ApplyGraphics(); // Output: Disabling shadows to optimize framerate.

// Swap behavior seamlessly on the fly
engine.SetStrategy(new HighGraphicsStrategy());
engine.ApplyGraphics(); // Output: Rendering detailed textures and realistic shadows.

```

---

## 5. Summary Benefits of Design Patterns

* **Standardized Communication:** Giving patterns explicit names (like "Singleton" or "Adapter") allows developers to understand a complex architectural setup instantly without looking through hundreds of lines of code.
* **Extensibility:** Applying patterns like Strategy ensures you can add new features later (like a third rendering mode) by creating a new class, without risking bugs by modifying older code blocks.
* **Code Reusability:** Decoupling objects through established patterns ensures modules remain highly reusable across entirely different projects.