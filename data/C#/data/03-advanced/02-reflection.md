# Lesson 2: Reflection

In most standard C# programs, the compiler takes your source code and locks down all types, fields, methods, and classes into an immutable structure before execution. Your code runs blindly based on those preset rules.

**Reflection** is a powerful feature in C# that allows a program to inspect its own metadata at runtime. It enables you to look inside compiled assemblies to dynamically discover information about classes, properties, methods, and attributes, and even instantiate objects or invoke methods on the fly without knowing they existed at compile time.

---

## 1. What is Reflection Used For?

Reflection forms the backbone of many advanced tools and frameworks you use daily:

* **IDE Tools:** Auto-completion windows (like IntelliSense) use reflection to inspect a class and show you its available methods.
* **Serialization/Deserialization:** Libraries like `System.Text.Json` use reflection to read an object's private and public fields and map them to JSON text.
* **Testing Frameworks:** Tools like NUnit or xUnit reflect over your project files to find any classes or methods tagged with a `[Test]` attribute and execute them automatically.

---

## 2. Accessing Metadata via the `Type` Class

The `System.Type` class is the main entry point for reflection. It represents a type declaration (such as a class, interface, array, or primitive value).

There are two primary ways to retrieve a `Type` object in C#:

```csharp
using System;

// Method 1: Using the typeof keyword (requires knowing the class name at compile time)
Type t1 = typeof(string);

// Method 2: Using GetType() on a concrete object instance at runtime
string placeholder = "John Doe";
Type t2 = placeholder.GetType();

Console.WriteLine($"Full Name: {t2.FullName}"); // Output: System.String

```

---

## 3. Inspecting a Class's Internal Structure

Once you hold a reference to a `Type`, you can extract granular structural details about its members using the `System.Reflection` namespace.

```csharp
using System;
using System.Reflection;

public class Employee
{
    public string Name { get; set; }
    public double Salary { get; set; }

    public void CalculateBonus() { }
}

public class InspectionProgram
{
    public static void Main()
    {
        Type targetType = typeof(Employee);

        Console.WriteLine($"Inspecting Class: {targetType.Name}");

        // 1. Discover Properties
        Console.WriteLine("\nProperties:");
        PropertyInfo[] properties = targetType.GetProperties();
        foreach (var prop in properties)
        {
            Console.WriteLine($" - {prop.PropertyType.Name} {prop.Name}");
        }

        // 2. Discover Methods
        Console.WriteLine("\nMethods:");
        MethodInfo[] methods = targetType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
        foreach (var method in methods)
        {
            Console.WriteLine($" - {method.Name}");
        }
    }
}

```

---

## 4. Dynamic Instantiation and Method Invocation

Reflection goes beyond simple inspection. You can use it to create an instance of a class dynamically and execute its logic without hardcoding it.

```csharp
using System;
using System.Reflection;

public class Calculator
{
    public int Add(int a, int b) => a + b;
}

public class DynamicProgram
{
    public static void Main()
    {
        Type calcType = typeof(Calculator);

        // 1. Dynamically create an instance of Calculator at runtime
        object calcInstance = Activator.CreateInstance(calcType);

        // 2. Find a specific method by its string name
        MethodInfo addMethod = calcType.GetMethod("Add");

        // 3. Define arguments to pass into the method
        object[] parameters = { 15, 30 };

        // 4. Invoke the method on our dynamic instance
        object result = addMethod.Invoke(calcInstance, parameters);

        Console.WriteLine($"Result of dynamic invocation: {result}"); // Output: 45
    }
}

```

---

## 5. Summary of Pros and Cons

While reflection is incredibly versatile, it introduces trade-offs that you must balance carefully:

| Advantages | Disadvantages |
| --- | --- |
| **Ultimate Flexibility:** Allows you to build highly dynamic frameworks, plugins, and extensible architectures. | **Performance Overhead:** Inspecting metadata and invoking members dynamically is significantly slower than standard, static compilation. |
| **Deep Access:** Can bypass standard security to inspect or modify hidden private members when debugging or serializing. | **No Compile-Time Safety:** If you misspell a method name string passed to `GetMethod()`, the error won't be caught until the program crashes at runtime. |
| **Decoupling:** Enables systems to work seamlessly with types they don't explicitly depend on. | **Security Issues:** Exposing absolute access to private application layers can introduce vulnerabilities if not carefully sandboxed. |