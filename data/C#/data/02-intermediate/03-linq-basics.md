# Lesson 3: LINQ Basics

When working with data collections (like Lists, Arrays, or Dictionaries), you frequently need to filter, sort, or transform the data. Writing nested loops and conditional statements for these operations can quickly make your code long and unreadable.

To solve this, C# introduces **LINQ** (Language Integrated Query). LINQ provides a unified, readable syntax to query and manipulate data directly from your C# code, regardless of whether the data source is an in-memory collection, an XML file, or a database.

---

## 1. What is LINQ?

LINQ stands for **Language Integrated Query**. It embeds query capabilities directly into C# syntax, bringing SQL-like capabilities to your data structures.

To use LINQ, you must import the `System.Linq` namespace at the top of your file.

---

## 2. The Two Types of LINQ Syntax

LINQ offers two different syntax styles to write queries. Both produce identical performance and compilation results, so you can choose the one that fits your style or project standard.

### Query Syntax (SQL Style)

Looks very similar to database SQL queries. It is highly readable for complex queries.

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

List<int> numbers = new List<int> { 2, 5, 8, 11, 14, 17 };

// Query Syntax
var highNumbers = from num in numbers
                  where num > 10
                  select num;

```

### Method Syntax (Lambda Style)

Uses extension methods and **lambda expressions** (`=>`). It is incredibly compact and is the standard choice for most modern C# development.

```csharp
// Method Syntax (Achieves the exact same result)
var highNumbersMethod = numbers.Where(num => num > 10);

```

> **Understanding the Lambda (`=>`):** Read `num => num > 10` as *"for each element `num`, check if `num` is greater than 10"*.

---

## 3. Essential LINQ Operators

Here are the most common LINQ operators you will use to manipulate collections, using **Method Syntax**:

### Filtering: `Where`

Filters a collection based on a condition.

```csharp
string[] names = { "John", "Jane", "Alice", "Bob" };
var shortNames = names.Where(n => n.Length <= 4); 
// Result: "John", "Jane", "Bob"

```

### Transforming: `Select`

Projects or transforms each element of a collection into a new shape or data type.

```csharp
int[] scores = { 1, 2, 3, 4 };
var squaredScores = scores.Select(s => s * s); 
// Result: 1, 4, 9, 16

```

### Ordering: `OrderBy` and `OrderByDescending`

Sorts elements in a collection based on a specified key.

```csharp
List<int> prices = new List<int> { 50, 10, 90, 30 };
var sortedPrices = prices.OrderBy(p => p); 
// Result: 10, 30, 50, 90

```

---

## 4. Aggregating Data

LINQ includes built-in math and statistical operators that collapse an entire collection down into a single, summary value.

```csharp
List<int> dataset = new List<int> { 10, 20, 30, 40 };

int totalSum = dataset.Sum();         // Output: 100
double averageValue = dataset.Average(); // Output: 25.0
int highestValue = dataset.Max();     // Output: 40
int lowestValue = dataset.Min();      // Output: 10

```

---

## 5. Deferred Execution vs. Immediate Execution

One of the most important performance concepts to understand about LINQ is **Deferred Execution**.

When you write a LINQ filter (like `.Where()` or a query expression), the query is **not executed immediately**. Instead, C# saves the command plan. The data is only pulled and filtered when you actually iterate through it using a `foreach` loop, or when you explicitly force it to execute.

To force a LINQ query to execute immediately and save its results into memory, use termination methods like **`.ToList()`** or **`.ToArray()`**:

```csharp
List<int> values = new List<int> { 1, 2, 3 };

// Query plan is stored, but data hasn't been filtered yet
var query = values.Where(v => v > 1); 

// Execution is forced immediately. Results are calculated and saved right here.
List<int> concreteList = values.Where(v => v > 1).ToList(); 

```