# Lesson 1: Algorithms in C#

In computer science, an **algorithm** is a step-by-step set of instructions or rules designed to solve a specific problem or perform a calculation. While data structures (like arrays, lists, and dictionaries) organize and store data, algorithms are the logic engines that manipulate that data to achieve a desired outcome.

When building performance-critical applications, choosing the right algorithm can be the difference between a program that runs in milliseconds and one that crashes the system due to high CPU utilization.

---

## 1. Measuring Performance: Big O Notation

Before writing an algorithm, you need a standardized way to measure its efficiency. We use **Big O Notation** to describe how the execution time or memory space of an algorithm grows as the size of the input data set ($n$) increases.

Big O focuses on the worst-case scenario:

| Notation | Name | Growth Behavior | C# Example Scenario |
| --- | --- | --- | --- |
| **$O(1)$** | Constant Time | Execution time stays exactly the same, completely independent of data size. | Looking up a value in a `Dictionary` using a unique key. |
| **$O(\log n)$** | Logarithmic Time | Execution time grows fractionally, splitting the data set in half with each step. | Searching an ordered array using a **Binary Search**. |
| **$O(n)$** | Linear Time | Execution time grows sequentially in direct proportion to the data size. | Looping through an unsorted array to find a specific element. |
| **$O(n \log n)$** | Linearithmic Time | Standard efficiency for advanced sorting mechanisms. | Sorting a collection using `Array.Sort()`. |
| **$O(n^2)$** | Quadratic Time | Execution time grows exponentially. Performance drops drastically with large datasets. | Nested loops processing an array (e.g., **Bubble Sort**). |

---

## 2. Searching Algorithms

Searching involves finding the exact position of a target element within a collection.

### Linear Search ($O(n)$)

Examines every single element from left to right sequentially until it finds a match. It is the only choice for completely unsorted data.

```csharp
public int LinearSearch(int[] array, int target)
{
    for (int i = 0; i < array.Length; i++)
    {
        if (array[i] == target) return i; // Target found at index i
    }
    return -1; // Target does not exist
}

```

### Binary Search ($O(\log n)$)

An incredibly fast search algorithm that requires the collection to be **fully sorted** beforehand. It starts in the absolute middle of the array. If the target is smaller than the middle item, it discards the right half of the data; if it is larger, it discards the left half. It repeats this splitting process continually.

```csharp
public int BinarySearch(int[] sortedArray, int target)
{
    int left = 0;
    int right = sortedArray.Length - 1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2; // Find the middle index

        if (sortedArray[mid] == target) return mid; // Target found!
        
        if (sortedArray[mid] < target)
            left = mid + 1; // Discard left half
        else
            right = mid - 1; // Discard right half
    }
    return -1;
}

```

---

## 3. Sorting Algorithms

Sorting is the process of rearranging a collection of items in a specific order (such as ascending or descending numerical value).

### Bubble Sort ($O(n^2)$)

A simple, entry-level sorting algorithm. It steps through the list repeatedly, compares adjacent elements, and swaps them if they are in the wrong order. The largest elements gradually "bubble" up to the top of the collection.

```csharp
public void BubbleSort(int[] array)
{
    int n = array.Length;
    for (int i = 0; i < n - 1; i++)
    {
        for (int j = 0; j < n - i - 1; j++)
        {
            if (array[j] > array[j + 1])
            {
                // Swap elements using C# tuple syntax
                (array[j], array[j + 1]) = (array[j + 1], array[j]);
            }
        }
    }
}

```

---

## 4. Recursion

A **recursive algorithm** is a method that solves a problem by calling *itself* with smaller inputs. Every valid recursive method must include:

1. **The Base Case:** A strict structural condition that stops the method from calling itself further, preventing infinite loops.
2. **The Recursive Step:** The logical progression where the method triggers itself while modifying the input argument to move closer to the base case.

### Factorial Example ($n!$)

The factorial of $5$ is $5 \times 4 \times 3 \times 2 \times 1 = 120$.

```csharp
public int Factorial(int n)
{
    // 1. Base Case: prevents infinite stack calls
    if (n <= 1) return 1; 

    // 2. Recursive Step: calls itself with a smaller input
    return n * Factorial(n - 1); 
}

```

> **Warning: StackOverflowException**
> Every time a method calls itself recursively, a new execution frame is pushed onto the system **Stack** memory. If your recursive logic missing a correct base case or handles massive datasets, the stack memory pool will completely deplete, triggering an immediate, uncatchable `StackOverflowException` crash.