# Lesson 1: Inheritance

In object-oriented programming, classes can inherit fields, properties, and methods from other classes. This concept is called **Inheritance**. It allows you to create a new class that reuses, extends, or modifies the behavior defined in an existing class.

Inheritance is fundamental for code reusability and establishing a natural hierarchy across your data structures.

---

## 1. Parent vs. Child Classes

Inheritance involves two primary roles:

* **Base Class (Parent / Superclass):** The existing class whose members are being inherited.
* **Derived Class (Child / Subclass):** The new class that inherits those members and can add new ones or override existing behaviors.

In C#, a derived class uses the colon (`:`) syntax to inherit from a base class.

---

## 2. A Basic Inheritance Example

Imagine you are building an application that manages different types of electronic devices. Instead of rewriting shared properties like `Brand` and `TurnOn()` for every single device, you can group them into a single base class.

```csharp
using System;

// Base Class (Parent)
public class ElectronicDevice
{
    public string Brand { get; set; }

    public void TurnOn()
    {
        Console.WriteLine($"{Brand} device is powering up...");
    }
}

// Derived Class (Child)
// Laptop inherits everything from ElectronicDevice
public class Laptop : ElectronicDevice
{
    public int RamGigabytes { get; set; }

    public void OpenIde()
    {
        Console.WriteLine($"Opening development environment on this {Brand} laptop.");
    }
}

```

### Using the Derived Class

An object instantiated from the `Laptop` class has immediate access to its own unique members *and* the members defined in the `ElectronicDevice` class:

```csharp
Laptop developerLaptop = new Laptop();

// Accessing inherited property and method
developerLaptop.Brand = "GenericTech";
developerLaptop.TurnOn(); // Output: GenericTech device is powering up...

// Accessing unique derived property and method
developerLaptop.RamGigabytes = 16;
developerLaptop.OpenIde(); // Output: Opening development environment on this GenericTech laptop.

```

---

## 3. The `protected` Access Modifier

In the basics course, we covered `public` and `private`. Inheritance introduces a third essential access modifier: **`protected`**.

* Members marked `private` are completely hidden from child classes.
* Members marked `protected` remain private to the outside world, but are fully accessible inside the code blocks of any **derived child classes**.

```csharp
public class Asset
{
    protected double monetaryValue = 1200.00; // Accessible only to child classes
}

public class Vehicle : Asset
{
    public void DisplayValue()
    {
        // Valid: Vehicle can see monetaryValue because it is protected
        Console.WriteLine($"Asset Value: ${monetaryValue}"); 
    }
}

```

---

## 4. Method Overriding: `virtual` and `override`

Sometimes, a child class needs a completely different implementation for a method it inherits from its parent. This is achieved via **Method Overriding**.

* **`virtual` Keyword:** Placed in the base class method signature to grant permission for child classes to change its behavior.
* **`override` Keyword:** Placed in the derived class method signature to provide a brand-new definition for that inherited method.

```csharp
public class Animal
{
    // The virtual keyword allows children to override this function
    public virtual void MakeSound()
    {
        Console.WriteLine("The animal makes a generic sound.");
    }
}

public class Dog : Animal
{
    // The override keyword rewrites the implementation for Dog instances
    public override void MakeSound()
    {
        Console.WriteLine("The dog barks loudly!");
    }
}

```

---

## 5. C# Inheritance Constraints

To prevent messy, unmanageable code architecture, C# enforces a few strict limitations on how inheritance can be applied:

* **Single Inheritance Only:** A derived class can inherit from **only one** base class. You cannot write `public class SmartPhone : Phone, Camera`. (To achieve multiple inheritance behavior, C# uses *Interfaces*, which will be covered in a later lesson).
* **The `sealed` Keyword:** If you apply the `sealed` keyword to a class definition, you permanently lock it. No other class can ever inherit from a sealed class.

```csharp
public sealed class SecurityGateway
{
    // No class can use ':' to inherit from this class
}

```