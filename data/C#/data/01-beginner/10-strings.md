# Lesson 10: Strings

In C#, a **string** is a sequential collection of characters used to store and manipulate text. Strings are one of the most heavily used data types in programming, representing everything from a simple message to a massive block of formatted data.

---

## 1. Core Characteristics of Strings

* **Reference Type:** Unlike simple numbers (`int`, `float`), strings are reference types. However, C# handles them with special syntax that makes them look and feel like primitive values.
* **Immutability:** Strings are **immutable**. Once a string object is created in memory, its text content cannot be altered. Any operation that appears to modify a string (like adding text) actually creates a brand-new string object behind the scenes.

---

## 2. String Manipulation Methods

The `System.String` class provides a massive collection of built-in methods to extract, inspect, and alter text.

```csharp
string sampleText = "  Hello, World!  ";

// 1. Length property (returns total characters)
Console.WriteLine(sampleText.Length); // Output: 17

// 2. Changing Case
Console.WriteLine(sampleText.ToUpper()); // Output: "  HELLO, WORLD!  "
Console.WriteLine(sampleText.ToLower()); // Output: "  hello, world!  "

// 3. Trimming whitespace from ends
string cleanedText = sampleText.Trim(); 
Console.WriteLine(cleanedText); // Output: "Hello, World!"

// 4. Checking containment
bool hasHello = cleanedText.Contains("Hello"); // Returns true

// 5. Substring extraction (Start index, length)
string word = cleanedText.Substring(7, 5);
Console.WriteLine(word); // Output: "World"

```

---

## 3. Concatenation vs. Interpolation

When you need to combine variables and text together, C# offers two primary methods: standard concatenation and modern string interpolation.

### String Concatenation (`+` Operator)

Combines multiple pieces of text by gluing them together sequentially. While functional, it can become hard to read when mixing many variables.

```csharp
string role = "Admin";
int level = 4;

string basicGreeting = "User: " + role + " | Level: " + level;

```

### String Interpolation (`$` Operator)

Introduced in modern C#, this approach allows you to embed expressions and variables directly inside a string literal using curly braces `{}`. It is cleaner, faster to write, and widely considered the industry standard.

```csharp
string role = "Admin";
int level = 4;

// Notice the '$' prefix before the opening quote
string cleanGreeting = $"User: {role} | Level: {level}"; 

```

---

## 4. Escape Sequences and Verbatim Strings

### Escape Sequences

Certain characters cannot be typed directly into a string because they confuse the compiler (like a double quote) or represent structural changes (like a newline tab). You bypass this using a backslash (`\`) escape character.

```csharp
// \n inserts a new line
string lines = "First Line\nSecond Line";

// \" allows quotes inside a string literal
string quoted = "The manager said, \"Approved.\"";

// \\ renders a literal backslash
string path = "C:\\ProgramFiles\\App";

```

### Verbatim Strings (`@` Operator)

If your text contains a high concentration of backslashes (like a Windows folder directory path) or spans across multiple manual lines, you can prefix the string literal with an `@` symbol. This turns off all escape sequences and reads the text exactly as typed.

```csharp
// No double backslashes required
string cleanPath = @"C:\ProgramFiles\App";

// Multi-line block text preserved exactly as formatted
string blockText = @"
    Line 1
    Line 2
    Line 3";

```

---

## 5. Efficient Text Construction: StringBuilder

Because strings are immutable, combining texts repeatedly inside a loop (e.g., thousands of times) forces the system to generate thousands of temporary string objects, drastically draining processing memory.

If you are performing intensive, repetitive text additions, use the **`StringBuilder`** class located in `System.Text`. It allocates a dynamic block of mutable memory that allows text to grow seamlessly without creating performance penalties.

```csharp
using System.Text;

StringBuilder builder = new StringBuilder();

for (int i = 0; i < 5; i++)
{
    builder.Append("Word").Append(i).Append(" ");
}

string finalOutput = builder.ToString();
Console.WriteLine(finalOutput); // Output: Word0 Word1 Word2 Word3 Word4 

```