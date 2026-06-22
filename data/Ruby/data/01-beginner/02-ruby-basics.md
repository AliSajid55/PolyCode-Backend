## Lesson 2: Ruby Basics

Now that you understand the architecture and philosophy behind Ruby, it's time to dive into the core building blocks of the language syntax. Because Ruby treats everything as an object, its syntax is highly uniform, but it has specific rules regarding naming conventions, variables, and typing that you must master to write idiomatic code.

---

## Dynamic and Strong Typing

A common point of confusion is the difference between how Ruby handles data types versus languages like C++ or Java.

* **Dynamic Typing:** You do not declare the type of a variable when you create it. The Ruby interpreter determines the type at runtime based on the value assigned, and a variable can be reassigned to an entirely different type later.
* **Strong Typing:** Ruby enforces type safety at runtime. It will not implicitly convert incompatible types behind your back (unlike JavaScript). If you try to add an integer to a string, Ruby will throw a `TypeError` rather than guessing what you meant.

```ruby
x = 42       # Dynamic typing: x is inferred to be an Integer
x = "Forty"  # Perfectly legal; x is now a String

# Strong typing enforcement:
x + 2        # Throws TypeError: no implicit conversion of Integer into String

```

---

## Variable Scopes and Naming Conventions

In Ruby, **sigils** (the prefixes before a variable name) and **letter casing** aren't just cosmetic choices—they explicitly dictate the scope and visibility of the variable to the interpreter.

| Variable Type | Naming Convention / Sigil | Scope Description | Example |
| --- | --- | --- | --- |
| **Local Variable** | snake_case (starts with lowercase or `_`) | Scoped strictly to the current method, block, or module where it is declared. | `user_age = 25` |
| **Instance Variable** | Preceded by a single `@` | Bound to a specific instance of an object; accessible across methods within that object. | `@account_balance` |
| **Class Variable** | Preceded by a double `@@` | Shared across the entire class hierarchy (the class itself and all its subclasses). *Use with caution.* | `@@total_users` |
| **Global Variable** | Preceded by a `$` | Accessible anywhere within the entire Ruby process. Highly discouraged in production. | `$stderr` |
| **Constant** | ALL_CAPS or CamelCase | Globally scoped within its namespace. Changing its value triggers a interpreter warning, but not a hard error. | `MAX_CONNECTIONS = 10` |

---

## Core Data Types

While everything is an object under the hood, Ruby provides native syntactic support for several essential classes:

### 1. Numbers

Ruby handles numbers seamlessly. It automatically manages memory allocation for integers, abstracting away 32-bit vs 64-bit limits.

* **Integer:** Whole numbers (`5`, `-100`, `1_000_000`—underscores can be used as visual digit separators).
* **Float:** Floating-point numbers requiring decimal precision (`3.14`, `-0.005`).

### 2. Strings and Interpolation

Strings store textual data and can be defined using single or double quotes, but they behave differently:

* **Double Quotes (`""`):** Allow for string interpolation using the `#{}` syntax and support escape sequences (like `\n`).
* **Single Quotes (`''`):** Treat text as a literal string; no interpolation or escape processing occurs.

```ruby
name = "John"
puts "Hello, #{name}" # Outputs: Hello, John
puts 'Hello, #{name}' # Outputs: Hello, #{name}

```

### 3. Symbols

Symbols look like strings preceded by a colon (`:id`, `:status`). However, they are fundamentally different:

* **Strings are mutable:** Every time you declare `"apple"`, Ruby allocates a new object in memory.
* **Symbols are immutable and unique:** `:apple` is frozen. Every time you reference `:apple`, it points to the exact same object ID in memory. This makes them highly performant as identifiers or keys in a lookup.

### 4. Booleans and Nil

Ruby does not have a single `Boolean` class. Instead, it uses two distinct singleton objects:

* `true` (an instance of `TrueClass`)
* `false` (an instance of `FalseClass`)
* `nil` (an instance of `NilClass`, representing the total absence of a value).

> **The Ruby Truthiness Rule:** In conditional logic, absolutely every value evaluates to **truthy** *except* for `false` and `nil`. The number `0`, empty strings `""`, and empty arrays `[]` are all considered **true**.