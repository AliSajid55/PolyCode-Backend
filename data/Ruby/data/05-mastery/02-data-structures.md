## Lesson 2: Data Structures in Ruby

Data structures are specific formats for organizing, managing, and storing data in computer memory so that operations can be performed efficiently.

While Ruby provides highly flexible, dynamic, and abstract data types out of the box (like `Array` and `Hash`), understanding how to implement and manipulate foundational low-level data structures manually is essential for building highly optimized code and writing scalable backend algorithms.

---

## The Linked List

A **Linked List** is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element is a separate object, called a **Node**. Each node contains its own data payload and a reference (a pointer) to the next node in the sequence.

```ruby
class Node
  attr_accessor :value, :next_node

  def initialize(value)
    @value = value
    @next_node = nil
  end
end

class LinkedList
  attr_reader :head

  def initialize
    @head = nil
  end

  # Append a new node to the end of the list: O(n) time complexity
  def append(value)
    new_node = Node.new(value)
    
    if @head.nil?
      @head = new_node
      return
    end

    current = @head
    current = current.next_node while current.next_node
    current.next_node = new_node
  end

  # Traversal utility to print the list: O(n)
  def display
    elements = []
    current = @head
    while current
      elements << current.value
      current = current.next_node
    end
    puts elements.join(" -> ")
  end
end

list = LinkedList.new
list.append("Node A")
list.append("Node B")
list.append("Node C")
list.display # Output: Node A -> Node B -> Node C

```

### Complexity Breakdown

* **Insertion/Deletion at Head:** $O(1)$ — Extremely fast compared to standard arrays, as no elements need to be shifted in memory.
* **Access/Search:** $O(n)$ — Slow, because you must traverse sequential pointers from the head node down the line to find a specific index.

---

## Stacks and Queues

Stacks and Queues are abstract linear data structures defined strictly by how data enters and exits the collection. While they can be emulated easily using native Ruby arrays, building them explicitly highlights their architectural boundaries.

### 1. The Stack (LIFO)

A Stack follows the **Last-In, First-Out** principle. The last item added to the stack is the very first one to be removed (similar to a stack of dinner plates).

```ruby
class Stack
  def initialize
    @store = []
  end

  # Push an item onto the top of the stack: O(1)
  def push(element)
    @store.push(element)
  end

  # Pop the top item off the stack: O(1)
  def pop
    @store.pop
  end

  # Look at the top element without removing it: O(1)
  def peek
    @store.last
  end
end

```

### 2. The Queue (FIFO)

A Queue follows the **First-In, First-Out** principle. The first item added to the collection is the first one removed (similar to standing in a checkout line).

```ruby
class Queue
  def initialize
    @store = []
  end

  # Enqueue: Add an element to the back of the queue: O(1)
  def enqueue(element)
    @store.push(element)
  end

  # Dequeue: Remove an element from the front of the queue
  # DANGER: Using array.shift on a raw array requires Ruby to re-index 
  # all remaining elements in memory, dropping performance to O(n).
  def dequeue
    @store.shift
  end
end

```

---

## Binary Search Trees (BST)

A **Binary Search Tree** is a non-linear, hierarchical data structure. Each node contains a data value and a maximum of two child references (`left` and `right`).

A BST maintains a strict ordering property: for any given node, all elements in its left subtree must be *less than* the node's value, and all elements in its right subtree must be *greater than* the node's value.

```ruby
class TreeNode
  attr_accessor :value, :left, :right

  def initialize(value)
    @value = value
    @left = nil
    @right = nil
  end
end

class BinarySearchTree
  def initialize
    @root = nil
  end

  def insert(value)
    if @root.nil?
      @root = TreeNode.new(value)
    else
      insert_node(@root, value)
    end
  end

  private

  # Recursive insertion method to maintain the BST property
  def insert_node(current_node, value)
    if value < current_node.value
      if current_node.left.nil?
        current_node.left = TreeNode.new(value)
      else
        insert_node(current_node.left, value)
      end
    else
      if current_node.right.nil?
        current_node.right = TreeNode.new(value)
      else
        insert_node(current_node.right, value)
      end
    end
  end
end

```

### Complexity Breakdown

* **Search / Insertion / Deletion (Balanced Tree):** $O(\log n)$ — Each branching decision cuts the remaining search space directly in half.
* **Search / Insertion / Deletion (Unbalanced Tree):** $O(n)$ — If items are inserted in sorted order (e.g., `1, 2, 3, 4`), the tree degenerates into a straight line, acting exactly like a standard linked list.