## Lesson 5: Control Flow

Control flow dictates the execution path of your code based on runtime conditions. Ruby provides familiar structures like `if` and `else`, but introduces unique conditional expressions—such as `unless` and modifier forms—designed to maximize code readability.

---

## Conditional Structures

### 1. `if`, `elsif`, and `else`

Ruby uses `elsif` (note the spelling: no second "e") for chaining multiple conditions. Every conditional block must be explicitly closed with the `end` keyword.

```ruby
status = "pending"

if status == "active"
  puts "System is running."
elsif status == "pending"
  puts "System is initializing..."
else
  puts "System is offline."
end

```

### 2. `unless`

The `unless` statement is the exact structural inverse of `if`. It executes code only when the given condition evaluates to **false** (acting like `if !condition`).

```ruby
authenticated = false

unless authenticated
  puts "Access Denied."
end

```

*Best Practice:* Avoid using `unless` with an `else` clause or combining it with complex logical operators (like `!`, `&&`, or `||`). It quickly becomes confusing to read. Keep it simple.

### 3. Inline Modifiers (Postfix Form)

For concise, single-line conditional statements, Ruby allows you to place the `if` or `unless` keyword *after* the expression.

```ruby
# Clean, readable production idioms
return if connection.nil?
raise StandardError, "Invalid User" unless user_profile.valid?

```

---

## The `case` Statement

The `case` expression handles multi-branch conditional logic. Under the hood, it uses the **three-equals operator (`===`)**, also known as the case-equality or subsumption operator, to match values.

```ruby
role = "editor"

case role
when "admin"
  puts "Full root access granted."
when "editor", "moderator"
  puts "Limited access granted."
else
  puts "Guest access only."
end

```

### Powerful Matching Mechanics

Because `case` uses `===`, you can match against data types, regular expressions, or ranges directly:

```ruby
value = 42

case value
when 1..50
  puts "Value is within the 1-50 range."
when String
  puts "Value is a text string."
else
  puts "Unknown type or out of bounds."
end

```

---

## Logical Operators & Short-Circuiting

Ruby provides two sets of operators for logical evaluation, and they have different precedence rules.

| Operator | Type | Precedence | Description |
| --- | --- | --- | --- |
| **`&&`** | Short-circuit AND | **High** | Evaluates left side first. Evaluates right side only if left is truthy. |
| **`||`** | Short-circuit OR | **High** | Evaluates left side first. Evaluates right side only if left is falsy. |
| **`and`** | Control flow AND | **Very Low** | Used primarily for chaining separate side-effect commands, not logic expressions. |
| **`or`** | Control flow OR | **Very Low** | Used primarily for chaining separate side-effect commands, not logic expressions. |

```ruby
# Short-circuiting evaluation
user = nil
# This does not crash because 'user' is nil (falsy), stopping execution right there
is_admin = user && user.admin_privileges? 

# Danger zone: 'and' / 'or' precedence pitfall
result = true && false  # result is now false
result = true and false # result is now true (because '=' binds tighter than 'and')

```

---

## The Ternary Operator

For simple, inline variable assignments or expressions based on a true/false evaluation, use the ternary operator (`condition ? if_true : if_false`).

```ruby
age = 20
status = age >= 18 ? "allowed" : "restricted"

```