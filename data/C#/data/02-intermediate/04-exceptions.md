# Lesson 4: Exception Handling

No matter how well you write your code, runtime errors can still happen. A user might enter a word when a number is expected, a file you are trying to read might be missing, or a database server might drop its connection.

In C#, these runtime errors are called **Exceptions**. **Exception Handling** is the process of anticipating, catching, and recovering from these errors so your application can fail gracefully instead of crashing abruptly.

---

## 1. The `try-catch` Block

To handle potential errors, you wrap the risky code inside a `try` block. If an exception occurs within that block, C# stops execution and immediately jumps to the corresponding `catch` block, where you can handle the error.

```csharp
// Syntax
try
{
    // Code that might cause an error
}
catch (Exception ex)
{
    // Code to run if an error happens
}

```

### A Practical Example

```csharp
using System;

try
{
    Console.Write("Enter a number to divide 100 by: ");
    int input = int.Parse(Console.ReadLine());
    
    int result = 100 / input;
    Console.WriteLine($"Result: {result}");
}
catch (Exception ex)
{
    Console.WriteLine("An error occurred smoothly.");
    // ex.Message contains a built-in technical description of the error
    Console.WriteLine($"Error Details: {ex.Message}");
}

```

---

## 2. Catching Specific Exceptions

Catching the general `Exception` class acts as a universal safety net, but it isn't always a best practice. It is much better to catch **specific exception types** so you can provide tailored solutions or troubleshooting steps based on the exact error.

C# evaluates `catch` blocks from top to bottom. You should always order them from the most specific exception to the most general.

```csharp
try
{
    string[] items = { "Data1", "Data2" };
    // Potentially throws an IndexOutOfRangeException if index is invalid
    Console.WriteLine(items[5]); 
}
catch (IndexOutOfRangeException ex)
{
    // Runs specifically for indexing errors
    Console.WriteLine("Requested item position does not exist in this collection.");
}
catch (Exception ex)
{
    // Runs as a fallback safety net for any other unanticipated error
    Console.WriteLine($"Unexpected error: {ex.Message}");
}

```

---

## 3. The `finally` Block

The `finally` block is an optional block that executes **no matter what**—regardless of whether an exception was thrown or caught.

It is used to perform cleanup operations, such as closing file streams, releasing database links, or shutting down network sockets, ensuring resources are never left open in memory.

```csharp
try
{
    Console.WriteLine("Opening a connection to an external data file...");
    // Imagine processing logic here that might fail
}
catch (Exception)
{
    Console.WriteLine("Handling data processing error...");
}
finally
{
    // This line always executes, guaranteeing clean-up
    Console.WriteLine("Safely closing data connection stream.");
}

```

---

## 4. Throwing Exceptions Manually (`throw`)

You can deliberately signal your own runtime errors using the `throw` keyword along with a new instance of an exception class. This is useful for enforcing business rules or validating input parameters.

```csharp
public class Account
{
    public int Age { get; private set; }

    public void SetAge(int userAge)
    {
        if (userAge < 0)
        {
            // Halts execution and signals a invalid parameter error
            throw new ArgumentOutOfRangeException("Age cannot be negative.");
        }
        Age = userAge;
    }
}

```

---

## 5. Defensive Programming (Preventing Exceptions)

While `try-catch` blocks are powerful, processing exceptions causes an internal performance cost. Whenever possible, use **defensive programming** to check for errors *before* they happen.

```csharp
string rawInput = "abc";

// INSTEAD OF THIS (Throws an exception if parsing fails):
// int value = int.Parse(rawInput);

// DO THIS (Safely attempts to parse without throwing an exception):
if (int.TryParse(rawInput, out int cleanValue))
{
    Console.WriteLine($"Parsed successfully: {cleanValue}");
}
else
{
    Console.WriteLine("Invalid numeric text formatting provided.");
}

```