# Lesson 6: Switch Statements

When you need to compare a single variable against a long list of potential values, chaining multiple `if` and `else if` statements together can quickly make your code cluttered and difficult to read. A **switch statement** provides a cleaner, more structured way to handle multi-way branching in C#.

---

## 1. Basic Switch Syntax

The switch statement evaluates a single expression once, matches the value of the expression against individual `case` labels, and executes the associated block of code.

```csharp
// Syntax
switch (expression)
{
    case value1:
        // Code to execute if expression == value1
        break;
    case value2:
        // Code to execute if expression == value2
        break;
    default:
        // Code to execute if no cases match
        break;
}

```

---

## 2. A Concrete Example

Imagine you are writing a script to handle the selection menu of an application or game. Here is how a switch statement cleanly processes the input:

```csharp
int menuSelection = 2;

switch (menuSelection)
{
    case 1:
        Console.WriteLine("Loading saved data...");
        break;
    case 2:
        Console.WriteLine("Opening configuration menu.");
        break;
    case 3:
        Console.WriteLine("Exiting application.");
        break;
    default:
        Console.WriteLine("Invalid selection. Please try again.");
        break;
}

```

---

## 3. Key Components of a Switch Statement

* **The Expression:** The variable or value inside the `switch()` parentheses. This is typically an integer, character, string, or enum.
* **The `case` Keyword:** Compares the expression against a literal value. If they match, execution starts immediately after that case label.
* **The `break` Keyword:** Formally exits the switch block. C# enforces a strict **no fall-through** rule. If you omit the `break` keyword (or another jump statement like `return`), the compiler will throw an error.
* **The `default` Keyword:** Optional but highly recommended. It acts exactly like the final `else` in an if-else chain, running only when none of the specified cases match the expression.

---

## 4. Case Grouping (Sharing Code)

While you cannot accidentally fall through from one executing case to another, you *can* deliberately stack multiple case labels together if they are meant to share the exact same block of code.

```csharp
char performanceGrade = 'B';

switch (performanceGrade)
{
    case 'A':
    case 'B':
    case 'C':
        Console.WriteLine("Passing grade confirmed.");
        break;
    case 'D':
    case 'F':
        Console.WriteLine("Academic remediation required.");
        break;
    default:
        Console.WriteLine("Unknown grade classification entered.");
        break;
}

```

---

## 5. Modern Alternative: Switch Expressions

In modern C# (version 8 and later), you can use a more compact, streamlined syntax called a **switch expression**. This approach treats the switch block as an expression that returns a direct value, removing the boilerplate `case`, `break`, and curly brace structures.

```csharp
int weaponTier = 3;

// Switch expression assigning a value directly to a variable
string weaponName = weaponTier switch
{
    1 => "Rusty Sword",
    2 => "Steel Blade",
    3 => "Enchanted Claymore",
    _ => "Unarmed" // The underscore (_) acts as the default fallback case
};

Console.WriteLine($"Equipped: {weaponName}");

```