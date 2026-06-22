## Lesson 1: Introduction to Algorithms in Ruby

Algorithms are step-by-step procedures designed to solve computational problems efficiently. While Ruby provides highly optimized built-in methods for sorting and searching (like `.sort` and `.find`), implementing these algorithms manually is essential for mastering algorithmic thinking, understanding time/space complexity, and optimizing performance bottlenecks.

In this module, we evaluate classical algorithms through the lens of Ruby's unique performance characteristics, such as object allocation overhead and dynamic array scaling.

---

## Big O Notation: Analyzing Performance

Before writing algorithmic code, we must quantify its efficiency using **Big O Notation**, which describes how execution time or memory space scales as the input size ($n$) grows toward infinity.

### 1. Time Complexity

Measures the number of operational steps required by an algorithm relative to the size of the input dataset ($n$).

### 2. Space Complexity

Measures the total amount of extra memory (RAM) allocated by an algorithm during execution. In Ruby, creating new arrays or cloning strings inside loops heavily spikes space complexity due to object instantiation overhead.

---

## Binary Search (Divide and Conquer)

Binary search is an optimized search algorithm used to find the position of a target value within a **sorted array**. It repeatedly divides the search interval in half, achieving an exceptionally fast time complexity of $O(\log n)$.

```ruby
def binary_search(array, target)
  low = 0
  high = array.length - 1

  while low <= high
    # Use integer division to isolate the middle element
    mid = low + (high - low) / 2
    guess = array[mid]

    if guess == target
      return mid # Target found; return index
    elsif guess > target
      high = mid - 1 # Target is in the lower half
    else
      low = mid + 1  # Target is in the upper half
    end
  end

  nil # Target does not exist in the collection
end

sorted_data = [12, 24, 35, 47, 59, 71, 83, 95]
puts binary_search(sorted_data, 47) # Output: 3

```

### Complexity Breakdown

* **Time Complexity:** $O(\log n)$ — Halving the search space each step means a collection of 1,000,000 items is fully searched in roughly 20 comparisons.
* **Space Complexity:** $O(1)$ — Performs the operations entirely in place using pointers, allocating zero extra arrays.

---

## Bubble Sort (Brute Force Matrix)

Bubble sort is a simple, iterative sorting algorithm. It steps through the array repeatedly, compares adjacent elements, and swaps them if they are in the wrong order. This process repeats until the entire array is sorted.

```ruby
def bubble_sort!(array)
  n = array.length
  
  loop do
    swapped = false

    # Subtract 1 to prevent out-of-bounds comparison on the last element
    (n - 1).times do |i|
      if array[i] > array[i + 1]
        # In-place parallel assignment swap syntax native to Ruby
        array[i], array[i + 1] = array[i + 1], array[i]
        swapped = true
      end
    end

    # Optimization: Break immediately if a full pass occurs without a single swap
    break unless swapped
  end

  array
end

unsorted_data = [64, 34, 25, 12, 22, 11, 90]
p bubble_sort!(unsorted_data) # Output: [11, 12, 22, 25, 34, 64, 90]

```

### Complexity Breakdown

* **Time Complexity:** $O(n^2)$ — Nested iteration loops cause execution time to explode exponentially on large datasets.
* **Space Complexity:** $O(1)$ — Modifying the array in-place via the destructive exclamation point (`!`) convention minimizes memory footprint.

---

## Ruby-Specific Performance Gotchas

When translating academic algorithms into Ruby, you must look out for language paradigms that can silently degrade your algorithm's Big O efficiency:

```ruby
# ANTI-PATTERN: Hidden O(n) operations inside loop blocks
array.each do |item|
  # array.include? must traverse the array under the hood, turning this block into O(n^2)
  puts item if secondary_array.include?(item) 
end

```

* **Hidden Traversals:** Built-in methods like `.include?`, `.insert`, `.delete`, and `.shift` are $O(n)$ operations because they force the engine to shift memory elements down the array line.
* **The Solution:** Switch to a **Hash** or a **Set** collection wrapper when checking for presence frequently, which leverages an internal hashing function to provide $O(1)$ lookup speeds.