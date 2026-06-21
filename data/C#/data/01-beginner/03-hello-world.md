# Lesson 3: Hello World 

The "Hello, World!" program is the traditional starting point for learning any programming language. It is the simplest possible program that verifies your development environment is set up correctly.

---

## 1. The Code

Here is the standard anatomy of a basic C# program in its traditional format:

```csharp
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}

```

---

## 2. Line-by-Line Breakdown

C# is an object-oriented language that relies on a structured hierarchy. Here is what each part of the code does:

| Code Component | Description |
| --- | --- |
| `using System;` | Imports the `System` namespace, which contains fundamental classes like `Console` so you don't have to type `System.Console.WriteLine()`. |
| `namespace HelloWorld` | A container used to organize your code and prevent naming conflicts with other libraries or projects. |
| `class Program` | Every line of executable C# code must live inside a class. `Program` is the default name given to this main class. |
| `static void Main(...)` | The **Main method**. This is the absolute entry point of your application; the compiler looks for this exact block to start execution. |
| `Console.WriteLine(...)` | A built-imn method that prints text to the screen and appends a newline at the end. |

---

## 3. The Modern Alternative: Top-Level Statements

In modern C# (version 9 and later), you can skip the boilerplate layout entirely. The compiler automatically generates the namespace, class, and Main method behind the scenes.

The entire program can be written in a single line:

```csharp
Console.WriteLine("Hello, World!");

```

---

## 4. Compilation and Execution

C# is a compiled language running on the .NET framework. When you run the application, the code goes through a two-step process:

1. **Compilation:** The source code is compiled into standard Intermediate Language (IL) code.
2. **Execution:** The .NET Just-In-Time (JIT) compiler translates the IL code into native machine code that your computer executes.

---

## 5. Key Syntax Rules to Remember

* **Case Sensitivity:** C# is strictly case-sensitive. `Console` is not the same as `console`, and `Main` cannot be written as `main`.
* **Statement Termination:** Every individual statement must end with a semicolon (`;`). Forgetting a semicolon is one of the most common compilation errors.
* **String Literals:** Text must always be enclosed in double quotes (`"..."`). Single quotes (`'...'`) are reserved strictly for individual characters (`char`).# C# Hello World: A Concise Guide

The "Hello, World!" program is the traditional starting point for learning any programming language. It is the simplest possible program that verifies your development environment is set up correctly.

---

## 1. The Code

Here is the standard anatomy of a basic C# program in its traditional format:

```csharp
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}

```

---

## 2. Line-by-Line Breakdown

C# is an object-oriented language that relies on a structured hierarchy. Here is what each part of the code does:

| Code Component | Description |
| --- | --- |
| `using System;` | Imports the `System` namespace, which contains fundamental classes like `Console` so you don't have to type `System.Console.WriteLine()`. |
| `namespace HelloWorld` | A container used to organize your code and prevent naming conflicts with other libraries or projects. |
| `class Program` | Every line of executable C# code must live inside a class. `Program` is the default name given to this main class. |
| `static void Main(...)` | The **Main method**. This is the absolute entry point of your application; the compiler looks for this exact block to start execution. |
| `Console.WriteLine(...)` | A built-in method that prints text to the screen and appends a newline at the end. |

---

## 3. The Modern Alternative: Top-Level Statements

In modern C# (version 9 and later), you can skip the boilerplate layout entirely. The compiler automatically generates the namespace, class, and Main method behind the scenes.

The entire program can be written in a single line:

```csharp
Console.WriteLine("Hello, World!");

```

---

## 4. Compilation and Execution

C# is a compiled language running on the .NET framework. When you run the application, the code goes through a two-step process:

1. **Compilation:** The source code is compiled into standard Intermediate Language (IL) code.
2. **Execution:** The .NET Just-In-Time (JIT) compiler translates the IL code into native machine code that your computer executes.

---

## 5. Key Syntax Rules to Remember

* **Case Sensitivity:** C# is strictly case-sensitive. `Console` is not the same as `console`, and `Main` cannot be written as `main`.
* **Statement Termination:** Every individual statement must end with a semicolon (`;`). Forgetting a semicolon is one of the most common compilation errors.
* **String Literals:** Text must always be enclosed in double quotes (`"..."`). Single quotes (`'...'`) are reserved strictly for individual characters (`char`).