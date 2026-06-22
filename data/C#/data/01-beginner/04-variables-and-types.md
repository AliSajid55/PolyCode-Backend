# Lesson 4: Variables

A variable is a named storage location in memory that holds a value. In C#, every variable has a specific **data type**, which determines the size and layout of the variable's memory.

---

## 1. Declaration and Initialization

To use a variable, you must **declare** its type and name. You can optionally **initialize** it with a value at the same time.

```csharp
// Syntax
type variableName = value;

// Examples
int age = 21;                  // Declared and initialized
string developerName = "John"; // Text value
double gpa;                    // Declared without initialization
gpa = 3.30;                    // Initialized later

```

---

## 2. Common Built-in Data Types

C# is a **strongly-typed** language, meaning every variable must have a declared type.

| Category | Type | Description | Example Value |
| --- | --- | --- | --- |
| **Integers** | `int` | 32-bit whole numbers | `int score = 450;` |
|  | `long` | 64-bit whole numbers (use `L` suffix) | `long largeCount = 7000000000L;` |
| **Floating-Point** | `double` | 64-bit double-precision fractional | `double average = 87.5;` |
|  | `float` | 32-bit single-precision fractional (use `f`) | `float pi = 3.1415f;` |
|  | `decimal` | 128-bit high-precision financial (use `M`) | `decimal price = 29.99M;` |
| **Characters** | `char` | Single 16-bit Unicode character | `char grade = 'A';` |
| **Strings** | `string` | Sequence of characters | `string message = "Hello World";` |
| **Booleans** | `bool` | Truth value (`true` or `false`) | `bool isCompleted = true;` |

---

## 3. Implicitly Typed Variables (`var`)

The `var` keyword lets the compiler infer the variable's type automatically based on the assigned value. This is strictly a compile-time convenience; the variable remains strongly typed.

```csharp
var speed = 60;           // Compiler infers 'int'
var health = 98.6f;       // Compiler infers 'float'
var title = "PolyCode";   // Compiler infers 'string'

// var currentStreak;     // ERROR: Implicitly typed variables must be initialized!

```

---

## 4. Constants (`const`)

If a variable's value should never change throughout the execution of the program, use the `const` keyword.

```csharp
const double MaxGpa = 4.00;
const int TargetFrameRate = 60;

// MaxGpa = 3.90;         // ERROR: A constant cannot be changed!

```

---

## 5. Variable Naming Rules & Conventions

### Rules (Enforced by Compiler)

* Must begin with a letter or an underscore (`_`).
* Cannot contain spaces or special symbols (e.g., `@`, `#`, `$`).
* Cannot use C# reserved keywords (like `int`, `class`, `public`) unless prefixed with `@`.
* Variables are **case-sensitive** (`age`, `Age`, and `AGE` are completely distinct variables).

### Conventions (Best Practices)

* Use **camelCase** for local variables (e.g., `enemyCount`, `playerHealth`).
* Use **PascalCase** for constants (e.g., `MaxPlayers`).
* Choose meaningful, descriptive names instead of abbreviations (e.g., use `timeElapsed` instead of `te`).