## Lesson 9: Hashes

A **Hash** is a collection of unique key-value pairs. It is often referred to as a dictionary, associative array, or map in other programming paradigms. Hashes allow for rapid data retrieval because values are looked up using an associated key rather than an ordered integer index.

---

## Hash Syntax and Evolution

Ruby has two distinct syntactic styles for declaring hashes. While you will encounter both in production environments, one is heavily preferred for modern development.

### 1. The Modern Symbol Syntax (Preferred)

When your hash keys are symbols, Ruby provides a clean, JSON-like syntax. The colon moves to the *end* of the symbol name, replacing the rocket operator.

```ruby
user_profile = {
  name: "John Doe",
  role: "admin",
  active: true
}

```

### 2. The Rocket Syntax (Legacy / Advanced)

The older syntax utilizes the "hash rocket" (`=>`). This syntax is mandatory if your keys are strings, integers, constants, or objects instead of symbols.

```ruby
# Necessary when keys are not symbols
translations = {
  "one" => "uno",
  "two" => "dos"
}

```

---

## Core Operations

Hashes are highly dynamic; you can read, add, update, and delete entries on the fly.

```ruby
config = { host: "localhost", port: 8080 }

# 1. Reading values
puts config[:host]  # Output: localhost

# 2. Adding or updating entries
config[:port] = 9000     # Updates existing key
config[:timeout] = 30    # Adds a brand new key-value pair

# 3. Deleting entries
config.delete(:timeout)  # Removes the key and returns its value: 30

```

### Handling Missing Keys and Defaults

By default, looking up a key that does not exist in a hash safely returns `nil`. If you require a different default behavior—such as initializing missing values to zero or an empty array—you must configure it explicitly:

```ruby
# Standard behavior
cargo = { boxes: 5 }
puts cargo[:crates]  # Output: nil

# Configuring a static default value
safe_cargo = Hash.new(0)
puts safe_cargo[:crates]  # Output: 0

# Configuring a dynamic block default (creates a new array instance per missing key)
matrix = Hash.new { |hash, key| hash[key] = [] }
matrix[:row_a] << "data"
puts matrix[:row_a]  # Output: ["data"]

```

---

## Common Iteration and Transformation Methods

Because Hashes mix in the `Enumerable` module, you can traverse and filter key-value pairs cleanly without using raw loops.

```ruby
inventory = { laptops: 12, smartphones: 0, monitors: 4 }

# 1. Standard Iteration via .each
inventory.each do |key, value|
  puts "Item: #{key}, Stock: #{value}"
end

# 2. Filtering via .select
in_stock = inventory.select { |item, quantity| quantity > 0 }
# Returns: { laptops: 12, monitors: 4 }

# 3. Transforming values via .transform_values
doubled_stock = inventory.transform_values { |quantity| quantity * 2 }
# Returns: { laptops: 24, smartphones: 0, monitors: 8 }

```

---

## Performance Characteristic: Keyword Arguments vs. Hashes

In older versions of Ruby, hashes were frequently used to pass arbitrary configurations into methods. In modern Ruby (3.0+), **Keyword Arguments** and **Hashes** are explicitly separated.

If a method expects explicit keyword parameters, you cannot pass a raw hash positional argument without explicitly converting it using the double-splat (``) operator:

```ruby
def connect(host:, port:)
  puts "Connecting to #{host}:#{port}"
end

options = { host: "localhost", port: 3000 }

# Danger Zone: This raises an ArgumentError in Ruby 3.0+
# connect(options) 

# Correct: Explicitly destructure the hash into keyword arguments
connect(**options)

```