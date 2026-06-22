## Lesson 10: Blocks

A **block** is an anonymous chunk of code that you can pass into a method as an argument. Blocks are not objects themselves, but they are a fundamental part of Ruby's control flow and functional programming features. They allow you to write a method that handles the broad strokes of an operation, while letting the caller dictate the exact logic executed inside it.

---

## Block Syntax and Implicit Yielding

As established in Lesson 6, blocks are declared using either `do...end` for multi-line execution or curly braces `{ }` for single-line operations.

To execute a block inside a custom method, use the **`yield`** keyword. When Ruby hits `yield`, it pauses execution of the method, jumps out to run the attached block, and then resumes the method with the block's return value.

```ruby
def execute_step
  puts "Step 1: Preparing environment..."
  yield if block_given? # Safely execute the attached block
  puts "Step 3: Operation cleanup completed."
end

# Executing the method with an attached block
execute_step do
  puts "Step 2: Processing core custom data injection."
end

# Output:
# Step 1: Preparing environment...
# Step 2: Processing core custom data injection.
# Step 3: Operation cleanup completed.

```

### The `block_given?` Guard

If you use the `yield` keyword inside a method, but the caller forgets to pass a block, Ruby throws a `LocalJumpError`. Always protect your implicit executions using the built-in conditional guard `block_given?`.

---

## Passing Parameters to Blocks

Blocks can accept their own arguments, which are defined inside vertical pipes (`|args|`). The method hosting the block passes these arguments directly via the `yield` statement.

```ruby
def run_benchmark
  start_time = Time.now
  
  # Yielding a value (the execution name) directly into the block
  yield("Database Query Task") if block_given?
  
  duration = Time.now - start_time
  puts "Task completed in #{duration} seconds."
end

run_benchmark do |task_name|
  puts "Currently executing: #{task_name}"
  sleep(1) # Simulate heavy performance load
end

```

---

## Explicit Block Arguments (`&block`)

If your method doesn't just want to execute a block blindly, but needs to store it, pass it to another method, or convert it into a reusable object, you must capture it **explicitly**.

To do this, add a final parameter prefixed with an ampersand (`&`). This tells Ruby to take the attached block and automatically turn it into a **`Proc` object** (a named, stored block).

```ruby
def network_request(url, &callback)
  puts "Fetching data from #{url}..."
  response_status = 200
  
  # Since 'callback' is now a full Proc object, we execute it using .call
  callback.call(response_status) if callback
end

network_request("https://api.example.com/v1") do |status|
  puts "Callback fired! Status received: #{status}"
end

```

---

## Block Scope and Variable Shadowing

Blocks have access to the variables defined in their outer scope (closure behavior). However, you must be careful with variable naming to avoid **shadowing**.

```ruby
user_id = 101
users = [1, 2, 3]

# Shadowing Danger Zone: naming the block parameter 'user_id'
users.each do |user_id|
  # Inside this block, the outer user_id is completely inaccessible
  puts "Processing local ID: #{user_id}" 
end

puts "Outer user_id remains: #{user_id}" # Output: 101 (unchanged)

```

If you deliberately want to declare a variable that is strictly isolated to the block's internal scope without altering or shadowing outer variables, use a semicolon (`;`) in your parameter definition:

```ruby
factor = 2
numbers = [1, 2, 3]

# 'result' is flagged as a block-local variable via the semicolon
numbers.each do |num; result|
  result = num * factor
  puts "Internal calculation: #{result}"
end

# Attempting to access 'result' here out here will raise a NameError

```