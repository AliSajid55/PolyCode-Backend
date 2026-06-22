## Lesson 8: Arrays

An array is an ordered, integer-indexed collection of object references. Because Ruby is dynamically and strongly typed, a single array can store a diverse mix of completely unrelated data types (strings, integers, hashes, or even other arrays) simultaneously.

---

## Array Initialization and Syntactic Sugar

Ruby provides several distinct patterns for instantiating arrays depending on the performance context and readability requirements.

```ruby
# 1. Standard literal notation (Most common)
standard_array = ["apple", "banana", "cherry"]

# 2. Explicit Class Instantiation
empty_array = Array.new
sized_array = Array.new(3, "empty") # Prefills: ["empty", "empty", "empty"]

# 3. %w literal shortcut (Generates an array of strings without quotes or commas)
shortcut_strings = %w[john doe alice bob] # Returns: ["john", "doe", "alice", "bob"]

# 4. %i literal shortcut (Generates an array of symbols)
shortcut_symbols = %i[pending active archived] # Returns: [:pending, :active, :archived]

```

---

## Core Manipulation Methods

Ruby arrays act as dynamic stacks, queues, or double-ended queues out of the box, offering highly optimized memory resizing operations.

```ruby
queue = ["item1", "item2"]

# Adding elements
queue.push("item3")    # Adds to the end: ["item1", "item2", "item3"]
queue << "item4"       # Shovel operator (alias to push): ["item1", "item2", "item3", "item4"]
queue.unshift("item0") # Inserts at the front: ["item0", "item1", "item2", "item3", "item4"]

# Removing elements
queue.pop              # Removes from the end; returns "item4"
queue.shift            # Removes from the front; returns "item0"

```

---

## Indexing and Slicing Mechanics

Array indices start at `0`. However, Ruby introduces **negative indexing** and **range slicing** to manipulate subsets of elements effortlessly.

```ruby
letters = ["a", "b", "c", "d", "e"]

puts letters[0]   # Output: "a" (First element)
puts letters[-1]  # Output: "e" (Negative index wraps around to access the end)
puts letters[-2]  # Output: "d"

# Slicing with [start, length]
puts letters[1, 3] # Output: ["b", "c", "d"] (Start at index 1, grab 3 elements)

# Slicing with Ranges
puts letters[1..3] # Output: ["b", "c", "d"] (Inclusive range)
puts letters[1...3] # Output: ["b", "c"] (Exclusive range; drops the boundary)

```

### Out-of-Bounds Behavior

If you request an index that falls entirely outside the current bounds of the array, Ruby will safely return `nil` rather than throwing an index out-of-bounds error. If you want to force an error for safer runtime tracking, use the `.fetch` method:

```ruby
letters = ["a", "b"]

puts letters[5]       # Output: nil
letters.fetch(5)      # Raises KeyError: index 5 outside of array bounds
letters.fetch(5, "z") # Output: "z" (Returns specified default instead of crashing)

```

---

## Essential Functional Transformations

Arrays include Ruby's `Enumerable` module, giving them access to powerful data transformation methods that replace manual loops.

```ruby
numbers = [1, 2, 3, 4, 5]

# 1. Transform elements via .map (or .collect)
doubled = numbers.map { |n| n * 2 } 
# doubled = [2, 4, 6, 8, 10]

# 2. Filter elements via .select (or .reject for its inverse)
evens = numbers.select { |n| n.even? } 
# evens = [2, 4]

# 3. Accumulate / Reduce elements via .reduce (or .inject)
total = numbers.reduce(0) { |sum, n| sum + n } 
# total = 15

```