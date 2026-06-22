# Lesson 2: Data Structures in C#

In computer science, a **data structure** is a specialized format for organizing, processing, retrieving, and storing data in a computer's memory. While algorithms represent the *logic*, data structures represent the *organization*.

Choosing the correct data structure directly impacts an algorithm's performance. A task that takes a long time using one structure can often be completed almost instantly using another.

---

## 1. Linear Data Structures

Linear structures arrange data elements sequentially, where each element is connected to its immediate predecessor and successor.

### Linked Lists

Unlike a traditional array, which stores elements in a contiguous, unbroken block of memory, a **Linked List** stores elements randomly across the heap. Each element is called a **Node**. A node contains the actual data value and a **Pointer** (reference link) tracking the memory address of the next node in the sequence.

* **Pros:** Fast insertions and deletions ($O(1)$) because you only need to update pointer references, not shift items.
* **Cons:** Slow element lookups ($O(n)$) because you cannot jump directly to an index; you must traverse from the "Head" node down the chain sequentially.

```csharp
using System;
using System.Collections.Generic;

public class LinkedListExample
{
    public static void Run()
    {
        // .NET provides a built-in doubly linked list (nodes point both forward and backward)
        LinkedList<string> playlist = new LinkedList<string>();

        playlist.AddLast("Song A");
        LinkedListNode<string> middleNode = playlist.AddLast("Song B");
        playlist.AddLast("Song C");

        // Fast insertion in the middle without shifting any memory
        playlist.AddAfter(middleNode, "Bonus Track");
    }
}

```

---

## 2. Non-Linear Data Structures

Non-Linear structures arrange data hierarchically or interconnectedly, making them ideal for complex, structural relationships.

### Binary Trees

A **Tree** organizes data hierarchically using nodes connected by edges. It starts at a single top node called the **Root**. In a **Binary Tree**, each parent node can have a maximum of two child nodes (typically called the left child and right child).

A **Binary Search Tree (BST)** enforces a strict sorting rule: for any given node, all values in its left subtree must be *smaller* than the node's value, and all values in its right subtree must be *larger*.

* **Search/Insertion Efficiency:** $O(\log n)$ on average, because every step down the tree discards half of the remaining possibilities.

```csharp
// A basic conceptual implementation of a Binary Tree Node
public class TreeNode
{
    public int Value { get; set; }
    public TreeNode Left { get; set; }
    public TreeNode Right { get; set; }

    public TreeNode(int value)
    {
        Value = value;
    }
}

```

### Graphs

A **Graph** consists of a network of data points called **Vertices** (or Nodes) that are connected to one another via lines called **Edges**. If the edges have a specific direction (like a one-way street or a Twitter follow relationship), it is a *Directed Graph*. If connections work seamlessly both ways (like a Facebook friendship), it is an *Undirected Graph*.

Graphs are used to map networks, social connections, flight paths, or game map pathfinding architectures.

```csharp
// Common representation of a Graph: An Adjacency List
// Maps a node to a list of all other neighboring nodes it connects to
Dictionary<string, List<string>> socialNetwork = new Dictionary<string, List<string>>();

socialNetwork.Add("Alice", new List<string> { "Bob", "Charlie" });
socialNetwork.Add("Bob", new List<string> { "Alice", "David" });

```

---

## 3. Advanced Structures: The Hash Table

A **Hash Table** (implemented as a `Dictionary<TKey, TValue>` or `HashSet<T>` in C#) converts a unique key into a numerical array index using a mathematical formula called a **Hash Function**.

Because the hash function calculates the exact memory bucket location instantly, a Hash Table achieves **$O(1)$ Constant Time** efficiency for lookups, insertions, and deletions, regardless of how massive the data set grows.

```csharp
HashSet<string> uniqueUsernames = new HashSet<string>();

// High-speed O(1) tracking
uniqueUsernames.Add("saad_khan");
uniqueUsernames.Add("alpha_dev");

// Instant constant time check, significantly faster than looping a list
if (uniqueUsernames.Contains("saad_khan"))
{
    Console.WriteLine("Username is already taken.");
}

```

---

## 4. Summary: When to Use Which?

| Scenario | Best Data Structure | Big O (Lookup) |
| --- | --- | --- |
| Storing a fixed dataset where you know the exact size ahead of time. | **Array** | $O(1)$ via index |
| Managing data that grows and shrinks rapidly with constant insertions/deletions in the middle. | **Linked List** | $O(n)$ search |
| Need to look up items instantaneously using a unique text string or ID key. | **Hash Table / Dictionary** | $O(1)$ |
| Modeling nested, hierarchical data layouts (like folder directories or HTML structures). | **Tree** | $O(\log n)$ average |
| Modeling complex networks (like electric grids, transport maps, or pathfinding routes). | **Graph** | Dependent on algorithm |