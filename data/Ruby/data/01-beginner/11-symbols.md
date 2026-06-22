## Lesson 11: Symbols

While we introduced symbols briefly during the basics, mastering Ruby requires a deep understanding of what a **Symbol** is at the engine level. A symbol is an immutable, internal identifier that maps directly to a unique entry in the Ruby interpreter's global symbol table.

---

## Strings vs. Symbols: The Architectural Divide

To write memory-efficient production Ruby, you must understand how the virtual machine (YARV) manages strings and symbols differently.

### 1. Memory Management & Object IDs

* **Strings are data containers:** Every time you declare a string, Ruby allocates a new chunk of memory and assigns it a unique `object_id`. This happens even if the text contents are completely identical.
* **Symbols are unique identifiers:** A symbol represents a single identity. No matter how many times you reference `:active` in your codebase, it points to the exact same memory address and shares one global `object_id`.

```ruby
# Strings allocate new memory every time
puts "status".object_id   # Output: 60140 (example)
puts "status".object_id   # Output: 60160 (different object)

# Symbols reuse the same memory address
puts :status.object_id    # Output: 1428388 (example)
puts :status.object_id    # Output: 1428388 (identical object)

```

### 2. Mutability

Strings can be modified in-place (e.g., using shovel tools `<<` or `gsub!`). **Symbols are strictly frozen and immutable.** Any attempt to treat a symbol like a mutable string will cause the interpreter to raise a `NoMethodError`.

---

## When to Use Strings vs. Symbols

Choosing the wrong type can severely degrade production performance. Use this definitive matrix to guide your architectural decisions:

| Scenario | Recommended Type | Rationale |
| --- | --- | --- |
| **User Input / Form Data** | **String** | Dynamic, variable text processing. |
| **Hash Keys** | **Symbol** | Speeds up dictionary lookups significantly; saves memory. |
| **Method Arguments / Flags** | **Symbol** | Communicates intent cleanly (e.g., `status: :pending`). |
| **API Response Payload Data** | **String** | Text content that changes across calls. |
| **Metaprogramming Targets** | **Symbol** | Used to reference method names or class names directly. |

---

## The Danger Zone: Symbol GC and Memory Leaks

Because symbols are kept in a global symbol table, historically they were never cleaned up by Ruby’s Garbage Collector (GC). This meant that converting arbitrary user input into symbols dynamically was a massive security vulnerability.

```ruby
# DANGER ZONE: Potential Memory Leak / Denial of Service (DoS)
# If malicious users pass random parameters, your memory will grow infinitely.
def unsafe_process(user_input)
  status_flag = user_input.to_sym 
end

```

### The Modern Reality (Ruby 2.2+)

Modern versions of Ruby feature **Symbol Garbage Collection**.

* **Immortal Symbols:** Symbols generated directly in your source code (like method names, constants, and hardcoded literals) are never cleared.
* **Mortal Symbols:** Symbols generated dynamically at runtime (e.g., via `to_sym`) are tracked by the GC and swept away if they are no longer referenced.

*Best Practice:* Even with Mortal Symbol GC, you should still avoid converting untrusted user strings into symbols arbitrarily to keep garbage collection pauses to a minimum.

---

## Interconversion Mechanics

You can convert strings to symbols and vice versa using explicit conversion methods.

```ruby
# String to Symbol
"john_doe".to_sym   # Returns: :john_doe
"john_doe".intern   # Returns: :john_doe (alias to to_sym)

# Symbol to String
:john_doe.to_s      # Returns: "john_doe"
:john_doe.id2name   # Returns: "john_doe" (internal identifier translation)

```