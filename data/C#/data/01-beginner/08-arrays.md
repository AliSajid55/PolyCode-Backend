# Lesson 8: Arrays

When working with data, you often need to store a collection of related items. Instead of declaring separate variables like `int score1`, `int score2`, and `int score3`, you can use an **array**. An array is a structural collection that allows you to store multiple values of the same data type under a single variable name.

---

## 1. Core Characteristics of Arrays

* **Fixed Size:** Once you create an array, its length is permanently locked. You cannot add or remove elements to change its size dynamically.
* **Single Data Type:** An array can only hold values that match its declared type (e.g., an `int` array can only store integers).
* **Zero-Indexed:** Array positions are numbered starting at `0`. The first element is at index `0`, the second is at index `1`, and the last element is at index `Length - 1`.

---

## 2. Declaration and Initialization

There are multiple ways to declare and populate arrays in C# depending on whether you know the values ahead of time.

```csharp
// Method 1: Declare a fixed size and fill it later
int[] runTimes = new int[5]; // Allocates space for 5 integers (defaulted to 0)

// Method 2: Declare and initialize values immediately
int[] primeNumbers = new int[] { 2, 3, 5, 7, 11 };

// Method 3: Streamlined shorthand syntax
int[] highScores = { 95, 88, 100, 92 };

```

---

## 3. Accessing and Modifying Elements

You interact with specific slots inside an array using square brackets `[]` along with the element's index.

```csharp
string[] inventory = { "Shield", "Potion", "Sword" };

// Accessing an element
Console.WriteLine(inventory[0]); // Output: Shield

// Modifying an element
inventory[1] = "Elixir"; // Overwrites "Potion" with "Elixir"

Console.WriteLine(inventory[1]); // Output: Elixir

```

> **Warning: IndexOutOfRangeException**
> If you attempt to access an index that does not exist (such as `inventory[3]` or `inventory[-1]` in the 3-element array above), your program will crash with an `IndexOutOfRangeException` error.

---

## 4. Looping Through Arrays

Because arrays are sequentially structured collections, loops are the most efficient tool for processing their contents.

### Using a standard `for` loop

The `for` loop is ideal if you need to know the index of each item or intend to modify the elements during the loop. C# arrays provide a `.Length` property to determine their size automatically.

```csharp
int[] scores = { 10, 20, 30, 40 };

for (int i = 0; i < scores.Length; i++)
{
    Console.WriteLine($"Element at index {i} is {scores[i]}");
}

```

### Using a `foreach` loop

The `foreach` loop is a cleaner, safer syntax designed explicitly for reading through collections. It completely eliminates the risk of indexing errors, though it does not give you access to the index counter and keeps the array values read-only during execution.

```csharp
string[] names = { "Alice", "Bob", "Charlie" };

foreach (string name in names)
{
    Console.WriteLine("Hello " + name);
}

```

---

## 5. Common Array Properties and Methods

C# includes built-in functionality within the `System` namespace to manipulate array data easily.

```csharp
int[] values = { 5, 2, 8, 1, 9 };

// 1. Get total element count
Console.WriteLine(values.Length); // Output: 5

// 2. Sort elements in ascending order
Array.Sort(values); // Array is now { 1, 2, 5, 8, 9 }

// 3. Reverse the order of elements
Array.Reverse(values); // Array is now { 9, 8, 5, 2, 1 }

// 4. Clear/Reset elements back to default values (0 for integers)
// Clears 2 elements starting at index 1
Array.Clear(values, 1, 2); // Array becomes { 9, 0, 0, 2, 1 }

```