# Lesson 9: Classes and Objects

C# is an **Object-Oriented Programming (OOP)** language. In OOP, programs are structured around real-world data and objects rather than just isolated functions and logic. **Classes** and **objects** are the absolute foundation of this paradigm.

---

## 1. What is a Class vs. an Object?

* **Class:** A class is a blueprint, template, or schema used to create objects. It defines what data the object will hold and what actions it can perform. It doesn't occupy memory on its own.
* **Object:** An object is a concrete, real-world instance built from that class blueprint. It resides in memory and contains actual values.

Think of a class as an architectural blueprint for a house, and an object as the actual physical house built on the street. You can build multiple distinct houses from a single blueprint.

---

## 2. Declaring a Class

A class combines data (stored in **Fields** and **Properties**) and behavior (defined by **Methods**).

```csharp
// Definition of a blueprint
public class Player
{
    // 1. Fields (variables holding internal data)
    private string title; 

    // 2. Properties (controlled access to data)
    public string Name { get; set; }
    public int Level { get; set; }

    // 3. Methods (behaviors/actions the class can do)
    public void DisplayStatus()
    {
        Console.WriteLine($"Player: {Name} (Level {Level})");
    }
}

```

---

## 3. Instantiating an Object

To create an instance of a class, you use the `new` keyword. This allocates memory for the new object.

```csharp
// Inside your Main method or top-level program:

// 1. Create an instance (object) of the Player class
Player champion = new Player();

// 2. Assign values using properties
champion.Name = "John Doe";
champion.Level = 5;

// 3. Invoke methods to trigger behaviors
champion.DisplayStatus(); // Output: Player: John Doe (Level 5)

// 4. You can create entirely separate objects from the same class
Player rival = new Player();
rival.Name = "Jane Smith";
rival.Level = 12;

```

---

## 4. Constructors

A **constructor** is a special method inside a class that runs automatically when an object is created. It is primarily used to initialize properties or set up default data at the moment of instantiation.

* Constructors must have the **exact same name** as the class.
* They do not have a return type (not even `void`).

```csharp
public class Car
{
    public string Model { get; set; }
    public int Year { get; set; }

    // Constructor with parameters
    public Car(string modelName, int manufacturingYear)
    {
        Model = modelName;
        Year = manufacturingYear;
    }
}

// Usage:
// Values are passed directly during creation, saving setup steps
Car budgetCar = new Car("Sedan", 2024);
Console.WriteLine(budgetCar.Model); // Output: Sedan

```

---

## 5. Access Modifiers: `public` vs. `private`

C# enforces data protection and security rules using access modifiers. The two most common are:

* **`public`**: The code is accessible by any other class or part of the application.
* **`private`**: The code is strictly hidden and accessible *only* within the curly braces of the class it belongs to. By default, fields in C# are private if you omit a keyword.

```csharp
public class BankAccount
{
    public string AccountHolder { get; set; } // Visible everywhere
    private double balance = 500.00;          // Completely hidden from external files

    public void ShowBalance()
    {
        // Internal methods can access private fields seamlessly
        Console.WriteLine($"Balance: {balance}");
    }
}

```