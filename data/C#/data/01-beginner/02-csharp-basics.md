# Lesson 2: C# Basics

Once your environment is ready, mastering the absolute foundational building blocks of C# syntax ensures you can read, write, and debug code effectively.

---

## 1. Core Anatomy of C# Code

Every element of a standard C# file follows a rigid structure designed for organization:

```csharp
using System; // 1. Namespace Import

namespace ApplicationBasics // 2. Namespace Container
{
    class Program // 3. Class Definition
    {
        static void Main(string[] args) // 4. Application Entry Point
        {
            // 5. Statements and Expressions
            Console.WriteLine("Basic C# syntax structured cleanly."); 
        }
    }
}

```

---

## 2. Fundamental Syntax Rules

| Rule | Description | Example |
| --- | --- | --- |
| **Semicolon Termination** | Every independent instruction/statement must end with a semicolon. | `int score = 100;` |
| **Case Sensitivity** | The compiler treats lowercase and uppercase characters entirely differently. | `string name;` is distinct from `string Name;` |
| **Code Blocks** | Code execution blocks are grouped together using curly braces `{}`. | `if (true) { // code here }` |

---

## 3. Code Comments

Comments are completely ignored by the compiler. They are used exclusively to document intent for yourself and other developers.

```csharp
// 1. Single-Line Comment: Everything on this line is ignored.

/* 2. Multi-Line Comment:
   This allows you to write long paragraphs
   spanning multiple lines without repeating symbols. */

/// <summary>
/// 3. XML Documentation Comment: 
/// Used above classes or methods to generate automated IDE documentation tools.
/// </summary>

```

---

## 4. Basic Input and Output (I/O)

Interacting with the console screen is the quickest way to test logic and see immediate text feedback.

### Outputting Text

* `Console.Write()`: Prints text to the screen but leaves the cursor on the exact same line.
* `Console.WriteLine()`: Prints text to the screen and moves the cursor down to a brand-new line.

### Inputting Text

* `Console.ReadLine()`: Pauses program execution and waits for the user to type text into the terminal and press **Enter**. It always returns the user input as a `string`.

```csharp
Console.Write("Enter your username: ");
string username = Console.ReadLine();

Console.WriteLine("Welcome back, " + username + "!");

```