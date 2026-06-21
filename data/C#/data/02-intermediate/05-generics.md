# Lesson 5: Generics

In C#, you often need to write code that performs the exact same logic regardless of the data type being processed. For example, a method that swaps two numbers works identically whether those numbers are `int`, `float`, or `double`.

Without **Generics**, you would have to write multiple overloaded versions of the same code for every single data type. Generics allow you to write a single class or method with a placeholder for the data type, deferring the specification of that type until the code is actually declared and instantiated.

---

## 1. The Problem: Code Duplication vs. Type Safety

Before generics, developers had two choices when writing reusable structures:

1. **Duplicate Code:** Write separate versions for `int`, `string`, `double`, etc. (unmaintainable).
2. **Use `object`:** Create a structure using the base `object` type, which can hold anything. However, this forces **boxing and unboxing** (performance loss) and risks runtime crashes if the wrong type is passed.

Generics solve this by providing **reusability** *and* **strict type safety** at compile time without any performance penalties.

---

## 2. Generic Methods

A generic method uses angle brackets containing a type parameter placeholder, traditionally named **`T`** (standing for *Type*).

```csharp
using System;

public class DataUtility
{
    // The <T> declares this as a generic method
    public void DisplayDetails<T>(T item)
    {
        Console.WriteLine($"Type: {item.GetType().Name} | Value: {item}");
    }
}

```

### Using the Generic Method

When calling the method, you can explicitly pass the target type in angle brackets, or let the compiler infer it automatically based on your argument:

```csharp
DataUtility utility = new DataUtility();

// Explicitly defining the type
utility.DisplayDetails<int>(250); // Output: Type: Int32 | Value: 250

// Implicitly inferring the type automatically
utility.DisplayDetails("John Doe"); // Output: Type: String | Value: John Doe

```

---

## 3. Generic Classes

You can apply the same generic design to an entire class blueprint. This is exactly how collections like `List<T>` operate behind the scenes.

```csharp
// A simple generic wrapper to hold data safely
public class DataBox<T>
{
    // The variable type depends entirely on what T is
    public T Content { get; set; }

    public DataBox(T initialContent)
    {
        Content = initialContent;
    }
}

```

### Instantiating the Generic Class

You lock down the placeholder type at the exact moment you instantiate the class object:

```csharp
// Creating a box strictly for integers
DataBox<int> intBox = new DataBox<int>(42);
int number = intBox.Content; // No casting required, type safe!

// Creating a box strictly for strings
DataBox<string> stringBox = new DataBox<string>("Generic Text");

```

---

## 4. Generic Constraints (`where`)

By default, a generic parameter `T` can be absolutely anything. However, if your code attempts to use specific operations—like instantiating a new object with `new T()` or comparing items—the compiler will throw an error because it cannot guarantee that *every* data type supports those actions.

You use the **`where`** keyword to apply rules and limits to what `T` can be.

```csharp
// Example using constraints
public class Repository<T> where T : class, new()
{
    // where T : class means T must be a reference type (not a struct or int)
    // where T : new() means T must have a public parameterless constructor
    
    public T CreateInstance()
    {
        return new T(); // Valid because the constraint guarantees a constructor exists
    }
}

```

### Common Constraint Types

| Constraint Syntax | Description |
| --- | --- |
| `where T : struct` | `T` must be a value type (like `int`, `bool`, `char`). |
| `where T : class` | `T` must be a reference type (like `string`, or any class object). |
| `where T : new()` | `T` must have a public parameterless constructor. |
| `where T : NameOfBaseClass` | `T` must inherit from or match the specified base class. |
| `where T : NameOfInterface` | `T` must implement or match the specified interface. |

---

## 5. Multiple Type Parameters

Generics are not limited to just one placeholder type. You can define multiple distinct type parameters separated by commas within the angle brackets.

```csharp
// A generic pair tracking two related but distinct data types
public class Pair<TKey, TValue>
{
    public TKey Key { get; set; }
    public TValue Value { get; set; }

    public Pair(TKey key, TValue value)
    {
        Key = key;
        Value = value;
    }
}

// Usage:
Pair<int, string> identityPair = new Pair<int, string>(101, "John Doe");

```