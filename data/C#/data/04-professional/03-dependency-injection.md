# Lesson 3: Dependency Injection

To build scalable, maintainable applications, your classes often need to interact with other classes. For example, a `UserProcessor` class might need a `DatabaseConnection` class to load data. When one class relies on another, it creates a **dependency**.

If a class creates its own dependencies manually using the `new` keyword, the classes become tightly coupled. This makes your code rigid, difficult to modify, and nearly impossible to unit test. **Dependency Injection (DI)** is a design pattern that solves this problem by passing (injecting) dependencies into a class from the outside, rather than forcing the class to build them internally.

---

## 1. The Core Problem: Tight Coupling

Consider this traditional, tightly coupled design:

```csharp
public class Car
{
    private V8Engine _engine;

    public Car()
    {
        // Tight Coupling: Car is completely stuck with a V8Engine
        _engine = new V8Engine(); 
    }
}

```

If you want to swap the `V8Engine` for an `ElectricEngine` later, you have to modify the internal code of the `Car` class. Furthermore, when writing a unit test for `Car`, you cannot swap out the engine for a mock or fake version to isolate your tests.

---

## 2. Inversion of Control via Constructor Injection

Dependency Injection implements a principle called **Inversion of Control (IoC)**. Instead of the class controlling its own dependencies, control is inverted and handed over to an external system.

The most common and secure way to inject dependencies is through a class's **Constructor**. We decouple the concrete classes by introducing an **Interface**.

```csharp
// 1. Establish an abstraction contract
public interface IEngine
{
    void Start();
}

public class V8Engine : IEngine
{
    public void Start() => Console.WriteLine("V8 engine roars to life.");
}

// 2. The class accepts the interface abstraction from the outside
public class Car
{
    private readonly IEngine _engine;

    // Car doesn't care what concrete engine it gets, as long as it implements IEngine
    public Car(IEngine engine)
    {
        _engine = engine;
    }

    public void Drive()
    {
        _engine.Start();
        Console.WriteLine("Car is moving.");
    }
}

```

Now, creating a car is highly flexible:

```csharp
// We can inject any engine variation seamlessly without changing the Car class code
IEngine petrolEngine = new V8Engine();
Car muscleCar = new Car(petrolEngine); 

// Ideal for unit testing—we can inject a mock engine effortlessly

```

---

## 3. The Dependency Injection Container

Manually passing dependencies into every constructor can become messy if a class depends on five different services, which in turn depend on other services. To manage this complexity, modern applications use a **DI Container** (or IoC Container).

The DI Container acts as a centralized factory ledger. You register your interfaces and their concrete classes with the container once at application startup. Whenever a class object is requested, the container automatically checks the ledger, instantiates all necessary dependencies behind the scenes, and injects them seamlessly.

---

## 4. Registering Services in .NET

In modern C# (such as ASP.NET Core), the DI Container is built directly into the framework. You register your service relationships inside `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Registering a dependency blueprint into the container ledger
builder.Services.AddScoped<IEngine, V8Engine>();

var app = builder.Build();

```

Once registered, you never call `new Car(new V8Engine())` yourself. If a Web API controller requests a `Car`, the .NET framework looks at `Program.cs`, detects that `Car` needs an `IEngine`, initializes a `V8Engine`, and hands the completed object to the controller automatically.

---

## 5. Summary Benefits of Dependency Injection

* **Loosely Coupled Code:** Classes become independent modules. Changes to an internal engine implementation will not break or alter the structural layout of the car.
* **Testability:** You can pass dummy, lightweight fake implementations (Mocks) into the constructor during unit testing to ensure you are only testing the specific logic of that isolated unit.
* **Maintainability:** Object creation logic is unified in a single, central ledger location (`Program.cs`) rather than scattered across hundreds of files throughout the codebase.