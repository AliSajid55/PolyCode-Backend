## Lesson 2: Data Structures

A data structure is a specialized format for organizing, managing, and storing data in memory so that specific operations can be performed efficiently. While PHP arrays are highly flexible maps that mimic lists and dictionaries, utilizing dedicated data structures—either natively through the **SPL (Standard PHP Library)** or conceptually—allows you to optimize memory utilization and runtime performance for complex data pipelines.

---

## 1. Linear Data Structures: Stacks and Queues

Linear data structures organize elements sequentially. The two most fundamental processing engines are Stacks and Queues, which differ strictly in how elements are added and removed.

### Stacks (LIFO: Last-In, First-Out)

In a stack, the last element added is the first one to be removed. Think of a stack of plates: you can only place a new plate on the top (**Push**), and you can only remove a plate from the top (**Pop**). Stacks are highly useful for undo mechanisms, depth-first parsing, and managing call stacks.

```php
<?php
declare(strict_types=1);

// Using the optimized SPL implementation for maximum memory efficiency
$stack = new SplStack();

$stack->push('action_one');
$stack->push('action_two');

echo $stack->pop(); // Outputs: action_two (The last item pushed)

```

### Queues (FIFO: First-In, First-Out)

In a queue, the first element added is the first one to be processed and removed. Think of a line at a checkout counter: the first person to join the line is served first. Elements enter at the back (**Enqueue**) and exit from the front (**Dequeue**). Queues are widely used to manage background job workers and buffer asynchronous traffic.

```php
$queue = new SplQueue();

$queue->enqueue('job_id_101');
$queue->enqueue('job_id_102');

echo $queue->dequeue(); // Outputs: job_id_101 (The first item enqueued)

```

---

## 2. Linked Lists: Single vs. Double Navigation

A standard array allocates a contiguous block of memory to hold its elements. A **Linked List**, by contrast, stores elements scattered throughout memory. Each element is packaged inside an isolated object called a **Node**.

* **Singly Linked List:** Each node contains its underlying data value and a pointer (`next`) to the next node in the chain.
* **Doubly Linked List:** Each node contains its data value, a pointer to the `next` node, *and* a pointer to the `prev` node. This dual-link structure allows you to traverse the list backward and forward efficiently.

### Conceptual Implementation of a Doubly Linked List Node

```php
class ListNode 
{
    public mixed $data;
    public ?ListNode $next = null;
    public ?ListNode $prev = null;

    public function __construct(mixed $data) 
    {
        $this->data = $data;
    }
}

```

> **Performance Optimization:** PHP provides a native C-optimized implementation via **`SplDoublyLinkedList`**. When you need to manage an ordered list where you are frequently adding or removing elements from the absolute beginning or end, an `SplDoublyLinkedList` outperforms a standard array because it eliminates the need to re-index elements in memory ($O(1)$ mutation complexity).

---

## 3. Hierarchical Structures: Binary Search Trees (BST)

Linear structures become slow to search as they scale ($O(n)$ time complexity). Hierarchical structures, like **Trees**, break this linear bottleneck by organizing data recursively into parent and child relationships.

A **Binary Search Tree** is a specific type of tree architecture where each parent node has a maximum of two children (designated as `left` and `right`), subject to a strict sorting rule:

* All values in the **left** subtree must be *less than* the parent node's value.
* All values in the **right** subtree must be *greater than* the parent node's value.

### Query Efficiency Mapping

Because of this sorted structure, searching a balanced BST runs on **$O(\log n)$** time complexity. Each step down the tree allows you to discard half of the remaining possibilities, mimicking binary search logic natively in a dynamic memory graph.

```php
class TreeNode 
{
    public int $value;
    public ?TreeNode $left = null;
    public ?TreeNode $right = null;

    public function __construct(int $value) 
    {
        $this->value = $value;
    }

    /**
     * Recursive insertion algorithm to maintain BST rules
     */
    public function insert(int $newValue): void 
    {
        if ($newValue < $this->value) {
            if ($this->left === null) {
                $this->left = new TreeNode($newValue);
            } else {
                $this->left->insert($newValue);
            }
        } else {
            if ($this->right === null) {
                $this->right = new TreeNode($newValue);
            } else {
                $this->right->insert($newValue);
            }
        }
    }
}

```

---

## 4. Key Performance Characteristics

Choosing the right structure depends entirely on your application's data access patterns:

| Data Structure Class | Read Access Complexity | Insertion Complexity | Deletion Complexity | Primary Production Use Case |
| --- | --- | --- | --- | --- |
| **`SplFixedArray`** | $O(1)$ | Non-resizable | Non-resizable | Highly optimized numeric indexing where dataset bounds are known upfront. It completely cuts down the memory footprint compared to a standard array. |
| **`SplStack`** | $O(n)$ (Linear Search) | $O(1)$ (Push) | $O(1)$ (Pop) | Managing state history checkpoints, parsing nested bracket tokens, back-tracking routes. |
| **`SplQueue`** | $O(n)$ (Linear Search) | $O(1)$ (Enqueue) | $O(1)$ (Dequeue) | Buffer queues processing background jobs, print queues, data request streaming layers. |
| **Balanced BST** | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | Relational data lookups, building database storage indices, prioritizing dynamic sorted entries. |