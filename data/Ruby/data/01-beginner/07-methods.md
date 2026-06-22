## Lesson 7: Methods

Methods bundle reusable logic into named routines. In Ruby, methods always return a value, support flexible argument architectures, and use specific naming conventions to communicate their behavior to other developers.

---

## Method Definition and Return Values

Methods are defined using the `def` keyword and concluded with `end`.

```ruby
def calculate_total(price, tax)
  price + tax
end

```

### Implicit Return

Unlike languages like C++ or Java, you do not need to explicitly use the `return` keyword at the end of a method. **Ruby automatically returns the value of the very last expression evaluated inside the method body.**

### Explicit Return

You only use the explicit `return` keyword when you need to exit a method early (guard clauses).

```ruby
def divide(numerator, denominator)
  return 0 if denominator == 0 # Guard clause: explicit early exit
  numerator / denominator      # Implicit return
end

```

---

## Argument Flexibility

Ruby provides several ways to pass data into methods, allowing you to design highly versatile APIs.

### 1. Positional Arguments

Standard arguments mapped by the order they are passed. They are strictly mandatory unless assigned a default value.

```ruby
def greet(name, greeting = "Hello")
  "#{greeting}, #{name}!"
end

puts greet("John Doe")           # Output: Hello, John Doe! (uses default)
puts greet("John Doe", "Welcome") # Output: Welcome, John Doe!

```

### 2. Keyword Arguments

Arguments mapped by explicit names rather than positioning. This improves code readability and allows arguments to be passed in any order.

```ruby
def create_user(username:, role: "guest", active: true)
  # Logic here
end

# Calling with clear identifiers
create_user(username: "johndoe", active: false)

```

### 3. Splat Operator (`*`) for Variable Arguments

When a method needs to accept an arbitrary number of positional arguments, use the single splat operator (`*`). It bundles the incoming values into a standard Array.

```ruby
def group_members(lead, *others)
  puts "Lead: #{lead}"
  puts "Team: #{others.join(', ')}"
end

group_members("John Doe", "Jane", "Alice", "Bob")
# Output:
# Lead: John Doe
# Team: Jane, Alice, Bob

```

---

## Naming Conventions and Sigils

Ruby method names are written in `snake_case`. Beyond standard alphanumeric characters, Ruby allows special suffix characters at the end of method names to cleanly signal their intent:

| Suffix | Meaning / Convention | Example |
| --- | --- | --- |
| **`?`** (Question mark) | **Predicate Method:** Returns a strictly boolean value (`true` or `false`). | `user.active?` |
| **`!`** (Exclamation mark) | **Bang Method:** Warns the developer that the method modifies the receiver in-place (mutation) or performs a dangerous/destructive action. | `name.upcase!` |

---

## Method Scope and Visibility

By default, methods defined inside a class are **public**. You can control their visibility using explicit keywords:

* **`public`:** Can be called by anyone from anywhere.
* **`private`:** Can only be called internally by the object itself. You cannot call a private method with an explicit receiver (e.g., you cannot do `object.private_method`).

```ruby
class Account
  def display_balance
    fetch_secure_data # Allowed: implicit internal call
  end

  private

  def fetch_secure_data
    # Sensitive internal data retrieval logic
  end
end

```