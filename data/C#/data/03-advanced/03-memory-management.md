# Lesson 3: Memory Management

When an application runs, it needs space in the computer's memory to store variables, track method calls, and manage complex objects. In some languages, like C or C++, developers must manually allocate and free up this memory—a process that easily leads to memory leaks or system crashes if done incorrectly.

C# manages memory automatically using a built-in mechanism called the **Garbage Collector (GC)**. However, to write high-performance applications, you must understand how C# organizes memory into two primary locations: the **Stack** and the **Heap**.

---

## 1. The Stack vs. The Heap

The .NET runtime divides memory allocation into two entirely different architectures:

| Feature | The Stack | The Heap |
| --- | --- | --- |
| **Structure** | Sequential, organized "Last-In, First-Out" (LIFO) structure. | Distributed, unstructured pool of memory fragments. |
| **Allocation** | Managed automatically by the CPU. Extremely fast. | Managed by the Garbage Collector. Slower to allocate and clean. |
| **What it stores** | Value Types (`int`, `bool`, `double`, structs) and variable reference pointers. | Reference Types (Class instances, Strings, Arrays, Collections). |
| **Lifespan** | Variables are instantly destroyed as soon as the method execution exits its scope `{}`. | Objects remain in memory until the Garbage Collector deletes them. |

---

## 2. Value Types vs. Reference Types

How a variable behaves when copied depends entirely on whether it lives on the Stack or the Heap:

### Value Types (Lives on the Stack)

When you assign one value type to another, C# creates a completely independent copy of the actual data. Modifying the copy has no effect on the original.

```csharp
int original = 10;
int copy = original; // A brand new copy is pushed onto the stack
copy = 20;

Console.WriteLine(original); // Output: 10 (completely unchanged)

```

### Reference Types (Lives on the Heap)

When you create an object, the actual object data is stored on the Heap, while a small pointer tracking its memory address is stored on the Stack. If you copy a reference type, you are only copying the *pointer address*, not the actual object itself. Both variables end up pointing to the exact same memory location on the heap.

```csharp
public class Box { public int Size { get; set; } }

// Inside main code execution:
Box originalBox = new Box() { Size = 5 };
Box copyBox = originalBox; // Copies the reference pointer address

copyBox.Size = 50; // Modifies the shared heap data

Console.WriteLine(originalBox.Size); // Output: 50 (the original object was changed!)

```

---

## 3. Garbage Collection Mechanics

The **Garbage Collector (GC)** runs automatically in the background on an internal execution thread. Its core objective is to reclaim memory occupied by objects on the Heap that are no longer accessible or referenced anywhere in your running code.

The GC optimizes its operations using an architecture split into three generations:

* **Generation 0:** Holds short-lived objects (such as local variables inside a method). The GC collects this generation frequently because it is fast and small.
* **Generation 1:** Acts as a buffer zone for objects that survived a Gen 0 collection sweep.
* **Generation 2:** Holds long-lived objects (such as static data or application-wide singletons). Sweeping Generation 2 requires a full collection, which can momentarily pause application performance.

---

## 4. Managing Unmanaged Resources: `IDisposable`

The Garbage Collector is highly optimized for cleaning up managed memory (like standard C# objects). However, it does not know how to automatically release **unmanaged resources**—such as active database connections, file handles on the hard drive, open network sockets, or graphics pipelines.

To handle this, classes that interact with unmanaged resources implement the **`IDisposable`** interface, which exposes a contract method called `.Dispose()`. You must call this method explicitly to free up resources immediately when you are finished using them.

```csharp
using System.IO;

public class FileUtility
{
    public void WriteData()
    {
        // StreamReader implements IDisposable
        StreamReader reader = new StreamReader("data.txt");
        try
        {
            // Read file logic
        }
        finally
        {
            // Forces the system handle to close immediately, preventing memory leaks
            reader.Dispose(); 
        }
    }
}

```

---

## 5. The Elegant Alternative: The `using` Statement

Because manually writing `try-finally` blocks to guarantee resource safety can clutter your files, C# provides a streamlined syntax shortcut called the **`using` statement**.

The `using` block automatically converts into a `try-finally` structure behind the scenes, ensuring `.Dispose()` is fired immediately when execution leaves the block, even if an exception crashes the internal code.

```csharp
using System.IO;

public void CleanWriteData()
{
    // The resource is completely scoped to these curly braces
    using (StreamReader reader = new StreamReader("data.txt"))
    {
        string text = reader.ReadToEnd();
        // Process data safely...
    } // reader.Dispose() is triggered automatically RIGHT HERE
}

```

### Modern shorthand (C# 8+)

You can even omit the curly braces entirely by placing the `using` keyword directly in front of the variable declaration. The object will automatically dispose itself when execution hits the end of the surrounding method block:

```csharp
public void ModernWriteData()
{
    using var reader = new StreamReader("data.txt");
    string text = reader.ReadToEnd();
    
    // Additional processing logic...
} // reader disposes automatically at the closing brace of the method

```