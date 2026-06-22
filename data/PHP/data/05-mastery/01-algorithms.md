## Lesson 1: Algorithm Fundamentals in PHP

An algorithm is a step-by-step, deterministic sequence of instructions designed to solve a specific computational problem. In production environments, writing functional code is only half the battle; your code must also execute efficiently. Understanding how to analyze, benchmark, and optimize algorithmic structures is what separates high-throughput backends from systems that buckle under load.

---

## 1. Asymptotic Analysis: Big O Notation

**Big O notation** is a mathematical framework used to describe the execution time or space requirements of an algorithm as the input size ($n$) grows toward infinity. It measures the execution complexity in the **worst-case scenario**, allowing you to predict performance characteristics independently of hardware specifications.

### The Complexity Hierarchy

| Big O Notation | Growth Classification | Performance Characterization | Typical PHP Code Example |
| --- | --- | --- | --- |
| $O(1)$ | **Constant Time** | Execution time remains flat, completely unaffected by the dataset size. | Direct associative array key lookup (`$arr['key']`). |
| $O(\log n)$ | **Logarithmic Time** | Execution speed drops by half with each iterative execution step. | Binary search on a pre-sorted numeric index array. |
| $O(n)$ | **Linear Time** | Execution time scales in direct, 1:1 proportion to the input size. | A standard `foreach` loop inspecting every element. |
| $O(n \log n)$ | **Linearithmic Time** | Standard efficiency baseline for highly optimized sorting logic. | PHP's internal Timsort implementation (`sort()`). |
| $O(n^2)$ | **Quadratic Time** | Execution performance degrades rapidly; highly dangerous at scale. | Nested loops evaluating cross-multiplication pairs. |

---

## 2. Linear vs. Binary Search Mechanics

Searching for specific records within an array collection is a fundamental operational pattern. The layout of your data dictates how efficiently you can query it.

### Linear Search ($O(n)$)

Linear search iterates through an array from the absolute beginning, evaluating each element sequentially until a match is found. It requires no pre-sorting configurations, but becomes a massive processing bottleneck as the array grows.

```php
<?php
declare(strict_types=1);

function linearSearch(array $haystack, int $needle): ?int 
{
    foreach ($haystack as $index => $value) {
        if ($value === $needle) {
            return $index; // Found match, exit early
        }
    }
    return null; // Exhausted array without resolution
}

```

### Binary Search ($O(\log n)$)

Binary search scales exceptionally well, but it carries a strict prerequisite: the array **must be pre-sorted**. It works by evaluating the exact midpoint of the array. If the midpoint value matches the target, execution finishes. If the target is smaller, the upper half of the array is discarded; if larger, the lower half is discarded. This divide-and-conquer strategy repeats until the target is isolated.

```php
function binarySearch(array $sortedHaystack, int $needle): ?int 
{
    $low = 0;
    $high = count($sortedHaystack) - 1;

    while ($low <= $high) {
        // Calculate mid-point safely avoiding integer overflow vulnerabilities
        $mid = $low + (int)(($high - $low) / 2);
        $currentValue = $sortedHaystack[$mid];

        if ($currentValue === $needle) {
            return $mid;
        }

        if ($currentValue > $needle) {
            $high = $mid - 1; // Discard upper half boundary
        } else {
            $low = $mid + 1;  // Discard lower half boundary
        }
    }

    return null; // Value does not exist within the dataset array
}

```

---

## 3. Basic Sorting: Bubble Sort ($O(n^2)$)

While you should always rely on PHP's internal sorting utilities like `sort()` or `usort()` (which run on highly optimized, native C-level algorithms), implementing a foundational sorting routine illustrates pointer swapping mechanics.

**Bubble Sort** steps through an array repeatedly, compares adjacent elements, and swaps them if they are in the wrong order. This pass-through loops repeatedly until the entire array is sorted.

```php
function bubbleSort(array $data): array 
{
    $size = count($data);
    
    for ($i = 0; $i < $size; $i++) {
        $swapped = false;
        
        // The last $i elements are already structurally in place
        for ($j = 0; $j < $size - $i - 1; $j++) {
            if ($data[$j] > $data[$j + 1]) {
                // Execute pointer structural swap mutation
                $temporary = $data[$j];
                $data[$j] = $data[$j + 1];
                $data[$j + 1] = $temporary;
                
                $swapped = true;
            }
        }
        
        // Optimization: If no elements were swapped during this pass, the array is sorted
        if (!$swapped) {
            break;
        }
    }
    
    return $data;
}

```

---

## 4. Practical Micro-Benchmarking Tools

To accurately evaluate the performance of your code blocks, use micro-benchmarking routines to measure the exact execution duration and memory allocation characteristics.

```php
// 1. Snapshot the initial resource parameters
$startTime = microtime(true);
$startMemory = memory_get_usage();

// 2. Execute the algorithmic target routine block
$dataset = range(1, 100000);
binarySearch($dataset, 99999);

// 3. Compute execution deltas
$executionDuration = microtime(true) - $startTime;
$memoryDelta = memory_get_usage() - $startMemory;

error_log(sprintf(
    "Performance Metrics: Duration: %f seconds | Memory Consumption: %d bytes",
    $executionDuration,
    $memoryDelta
));

```