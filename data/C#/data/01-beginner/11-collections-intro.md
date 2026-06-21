# Lesson 11: Introduction to Collections

While arrays are excellent for managing groups of data, their fixed size means you must know exactly how many items you need from the very beginning. In real-world software, data sets grow and shrink dynamically. To handle this, C# provides **Collections**—flexible data structures that resize themselves automatically.

Most common collections live inside the `System.Collections.Generic` namespace.

---

## 1. Arrays vs. Collections

| Feature | Arrays | Collections (Generic) |
| --- | --- | --- |
| **Size** | Fixed (cannot change after creation) | Dynamic (grows and shrinks automatically) |
| **Performance** | Faster for primitive fixed data sets | Highly optimized for dynamic data operations |
| **Namespace** | Built-in (`System`) | Requires `using System.Collections.Generic;` |
| **Type Safety** | Strongly typed | Strongly typed (when using Generics) |

---

## 2. The Dynamic Array: `List<T>`

A `List<T>` is essentially a wrapper around a traditional array that grows automatically as you add items. The `<T>` syntax represents a **Generic**, which means you replace the `T` with the specific data type you want the list to hold.

### Common Operations

```csharp
using System.Collections.Generic;

// 1. Instantiation (creating an empty list of strings)
List<string> shoppingList = new List<string>();

// 2. Adding items
shoppingList.Add("Milk");
shoppingList.Add("Eggs");
shoppingList.Add("Bread"); // The list automatically resizes to hold 3 items

// 3. Removing items
shoppingList.Remove("Eggs"); // Finds and removes "Eggs" from the collection

// 4. Checking size (Lists use 'Count', while arrays use 'Length')
Console.WriteLine($"Items to buy: {shoppingList.Count}"); // Output: 2

// 5. Checking for containment
if (shoppingList.Contains("Milk"))
{
    Console.WriteLine("Milk is already on the list.");
}

```

---

## 3. Key-Value Pairs: `Dictionary<TKey, TValue>`

A dictionary stores elements as pairs of data: a **Key** and a **Value**. Instead of looking up an item by an index number, you look it up using its unique key. Keys must be completely unique, but values can be duplicated.

Think of it like a real dictionary: you look up a unique word (the Key) to read its definition (the Value).

```csharp
using System.Collections.Generic;

// Instantiation: Dictionary<KeyType, ValueType>
Dictionary<string, double> productPrices = new Dictionary<string, double>();

// 1. Adding key-value pairs
productPrices.Add("Laptop", 999.99);
productPrices.Add("Phone", 499.50);
productPrices.Add("Headphones", 89.00);

// 2. Accessing a value using its key
Console.WriteLine($"The laptop costs: ${productPrices["Laptop"]}"); // Output: $999.99

// 3. Modifying a value
productPrices["Phone"] = 450.00; // Overwrites the existing value

// 4. Checking if a key exists before reading (Prevents KeyNotFoundException crashes)
if (productPrices.ContainsKey("Tablet"))
{
    Console.WriteLine(productPrices["Tablet"]);
}

```

---

## 4. First In, First Out: `Queue<T>`

A `Queue<T>` is a linear collection that mimics a real-world line. It processes data using the **FIFO (First In, First Out)** principle. The item that enters the queue first is always the first one to be taken out.

* **Enqueue:** Adds an item to the *back* of the line.
* **Dequeue:** Removes and returns the item from the *front* of the line.

```csharp
using System.Collections.Generic;

Queue<string> printedPages = new Queue<string>();

// Add items to the line
printedPages.Enqueue("DocumentA.pdf");
printedPages.Enqueue("DocumentB.pdf");

// Process items from the front
string firstJob = printedPages.Dequeue(); 
Console.WriteLine($"Printed: {firstJob}"); // Output: Printed: DocumentA.pdf

```

---

## 5. Last In, First Out: `Stack<T>`

A `Stack<T>` processes data using the **LIFO (Last In, First Out)** principle. Think of it like a physical stack of plates; you add new plates to the very top, and you can only remove the plate that was placed on top last.

* **Push:** Adds an item to the *top* of the stack.
* **Pop:** Removes and returns the item from the *top* of the stack.

```csharp
using System.Collections.Generic;

Stack<string> browserHistory = new Stack<string>();

// Navigating forward
browserHistory.Push("Homepage.com");
browserHistory.Push("Dashboard.com");
browserHistory.Push("SettingsPage.com");

// Clicking the 'Back' button (removes the last item added)
string previousPage = browserHistory.Pop();
Console.WriteLine($"Navigated back from: {previousPage}"); // Output: Navigated back from: SettingsPage.com

```