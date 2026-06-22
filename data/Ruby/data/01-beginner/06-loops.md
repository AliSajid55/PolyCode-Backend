## Lesson 6: Iterations and Loops

In Ruby, traditional loops (like `for` loops) are rarely used in production. Instead, Ruby relies heavily on **Iterators**—which are methods that leverage blocks of code to process collections. This approach aligns with Ruby's object-oriented nature: collections know how to iterate over themselves.

---

## Traditional Loop Structures

While discouraged for standard collection processing, traditional loops are available for basic conditional repetition.

### 1. `while` and `until`

A `while` loop runs as long as a condition evaluates to **true**. An `until` loop is its logical inverse, running as long as a condition evaluates to **false**.

```ruby
counter = 0

while counter < 3
  puts "While: #{counter}"
  counter += 1
end

until counter == 0
  puts "Until: #{counter}"
  counter -= 1
end

```

### 2. The Bare `loop` and `break`

The `loop` method creates an infinite loop. It must be paired with a control keyword like `break` to exit based on a specific condition.

```ruby
quantity = 10

loop do
  quantity -= 2
  break if quantity <= 4
  puts "Remaining: #{quantity}"
end

```

---

## Idiomatic Ruby Iterators

Iterators are methods called on an object that pass each element of a collection to a **block** of code.

### 1. `times`

When you simply need to repeat an action a specific number of times, use the `times` method on an integer.

```ruby
5.times do |index|
  puts "Execution number #{index}"
end

```

### 2. `each`

The `each` method is the fundamental iterator for collections like Arrays and Hashes. It steps through every element one by one.

```ruby
items = ["laptop", "mouse", "keyboard"]

# Array iteration
items.each do |item|
  puts "Processing item: #{item}"
end

```

---

## Block Syntax: `do...end` vs. `{ }`

Ruby blocks can be written in two ways. The difference is purely syntactic style and operator precedence, not functionality.

* **`do...end`:** Used for multi-line blocks.
* **`{ }` (Braces):** Used strictly for single-line operations.

```ruby
# Multi-line style (do...end)
items.each do |item|
  cleaned_name = item.strip
  puts "Inventory: #{cleaned_name}"
end

# Single-line style ({ })
items.each { |item| puts "Inventory: #{item}" }

```

---

## Loop Control Keywords

Ruby provides three explicit keywords to alter loop or iterator execution mid-stream:

| Keyword | Action | Common Use Case |
| --- | --- | --- |
| **`break`** | Terminates the loop immediately and exits the block. | Stopping an operation early once a search target is found. |
| **`next`** | Skips the remainder of the *current* iteration and jumps to the next step. | Skipping invalid data or filtered values during processing. |
| **`redo`** | Repeats the *current* iteration from the beginning without re-evaluating the condition or fetching the next element. | Retrying a transient network connection or failed input step. |

```ruby
# Demonstrating next and break
[1, 2, 3, 4, 5].each do |number|
  next if number == 2   # Skips 2 entirely
  break if number == 5  # Exits the loop when hitting 5
  
  puts "Number: #{number}"
end
# Output:
# Number: 1
# Number: 3
# Number: 4

```