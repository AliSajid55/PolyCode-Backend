# Lesson 5: Control Flow Introduction

By default, a C# program executes line by line, from top to bottom. **Control flow** statements allow you to break this linear path, making decisions and executing specific blocks of code only when certain conditions are met.

---

## 1. The `if` Statement

The `if` statement is the most fundamental conditional structure. It evaluates a boolean expression (a condition that results in either `true` or `false`). If the condition is true, the code block inside the curly braces runs.

```csharp
// Syntax
if (condition)
{
    // Code to execute if condition is true
}

// Example
int playerScore = 100;

if (playerScore >= 100)
{
    Console.WriteLine("Level Complete!");
}

```

---

## 2. Expanding with `else` and `else if`

You can extend an `if` statement to handle alternative outcomes when the initial condition turns out to be false.

* **`else if`**: Allows you to check an additional condition if the previous ones were false. You can chain multiple `else if` blocks together.
* **`else`**: Acts as a fallback block. It executes only if **none** of the preceding conditions were true.

```csharp
int currentSpeed = 75;
int speedLimit = 70;

if (currentSpeed > speedLimit + 10)
{
    Console.WriteLine("Dispatching highway patrol.");
}
else if (currentSpeed > speedLimit)
{
    Console.WriteLine("Displaying a speeding warning.");
}
else
{
    Console.WriteLine("Driving safely within the limit.");
}

```

---

## 3. Relational Operators

Conditional statements rely heavily on relational operators to compare values.

| Operator | Description | Example | Result (if `x = 5`, `y = 10`) |
| --- | --- | --- | --- |
| `==` | Equal to | `x == y` | `false` |
| `!=` | Not equal to | `x != y` | `true` |
| `>` | Greater than | `x > y` | `false` |
| `<` | Less than | `x < y` | `true` |
| `>=` | Greater than or equal to | `x >= 5` | `true` |
| `<=` | Less than or equal to | `y <= 10` | `true` |

> **Warning:** Do not confuse the assignment operator (`=`) with the equality operator (`==`). Use `=` to assign a value to a variable, and `==` to test if two values are equal.

---

## 4. Logical Operators

To check multiple conditions at the same time within a single `if` statement, you can combine expressions using logical operators.

* **Conditional AND (`&&`)**: Returns `true` only if **both** conditions are true.
* **Conditional OR (`||`)**: Returns `true` if **at least one** of the conditions is true.
* **Logical NOT (`!`)**: Inverts the value of a boolean expression (turns `true` to `false` and vice versa).

```csharp
bool hasKey = true;
bool structuralIntegrityIsLow = false;

// Using AND (&&)
if (hasKey && !structuralIntegrityIsLow)
{
    Console.WriteLine("The vault door safely unlocks.");
}

int externalTemperature = 38; // in Celsius
bool humidityIsHigh = true;

// Using OR (||)
if (externalTemperature > 35 || humidityIsHigh)
{
    Console.WriteLine("Activating climate control units.");
}

```

---

## 5. Scope and Braces

If the code inside an `if`, `else if`, or `else` statement consists of only a single line, C# allows you to omit the curly braces `{}`. However, including them is widely considered a best practice to ensure the code remains readable and less prone to logic bugs during updates.

```csharp
// Acceptable, but discouraged for long-term maintenance:
if (isGameOver)
    Console.WriteLine("Game Over.");

// Highly recommended convention:
if (isGameOver)
{
    Console.WriteLine("Game Over.");
}

```