## Lesson 4: Variables and Types

Now that you can run a script and output data, we need to look closer at how Ruby treats values and variables. Because Ruby is completely object-oriented, variables do not hold data values directly. Instead, **variables are pointers to locations in memory where objects reside.**

---

## Variable Reference and Mutability

When you assign a value to a variable, you are binding a name to an object reference. If you assign that variable to another variable, both point to the *exact same object* in memory.

This can lead to unexpected side effects if you modify (mutate) the object.

```ruby
# Example: Shared References
str1 = "John Doe"
str2 = str1

# Check the object identifiers in memory
puts str1.object_id == str2.object_id  # Output: true

# Mutating str2 alters the underlying object
str2.upcase!

puts str1  # Output: JOHN DOE (str1 changed because it pointed to the same object!)

```

### Avoiding Reassignment vs. Mutation Confusion

* **Reassignment (`=`)** changes the pointer. It makes a variable point to a completely different object in memory.
* **Mutation (e.g., `.upcase!`, `<<`)** alters the internal state of the existing object without changing the pointer.

To prevent an object from being mutated, you can use the `.freeze` method. If a string or array is frozen, any attempt to mutate it will raise a `FrozenError`.

---

## String vs. Symbol Memory Optimization

In Ruby, choosing between a String and a Symbol is fundamentally a memory-management decision.

### Memory Allocation Mechanics

* **Strings are mutable identifiers:** Every single time you type `"John Doe"`, Ruby instantiates a brand-new `String` object with a unique object ID.
* **Symbols are immutable identifiers:** When you type `:john_doe`, Ruby creates it exactly once. Every subsequent call to `:john_doe` references the identical object in memory.

```ruby
# Checking String memory footprints
puts "John Doe".object_id  # Output: 60120 (example)
puts "John Doe".object_id  # Output: 60140 (completely different object)

# Checking Symbol memory footprints
puts :john_doe.object_id   # Output: 1823468 (example)
puts :john_doe.object_id   # Output: 1823468 (exactly the same object)

```

### Best Practice Rules

* Use **Strings** when the data changes (e.g., user inputs, text processing, API response bodies).
* Use **Symbols** when the identifier stays constant (e.g., Hash keys, status flags like `:pending` or `:active`, and method arguments).

---

## Type Conversion (Casting)

Because Ruby is strongly typed, you must explicitly convert objects when passing them into methods that expect a different type. Ruby provides explicit casting methods named after the target type:

* `.to_i` $\rightarrow$ Convert to **Integer**
* `.to_f` $\rightarrow$ Convert to **Float**
* `.to_s` $\rightarrow$ Convert to **String**
* `.to_sym` or `.intern` $\rightarrow$ Convert to **Symbol**

```ruby
age_input = "25"
calculated_age = age_input.to_i + 5  # Explicitly cast to Integer before math
puts "Age is " + calculated_age.to_s # Explicitly cast to String for concatenation

# Safe Alternative: String Interpolation automatically calls .to_s under the hood
puts "Age is #{calculated_age}"

```

### Handling Safe Conversions

If you call `.to_i` on a string that does not look like a number, Ruby will not crash. Instead, it parses from the left until it hits a non-numeric character, returning `0` if it cannot find any valid digits:

```ruby
puts "42_employees".to_i # Output: 42
puts "John Doe 42".to_i  # Output: 0

```