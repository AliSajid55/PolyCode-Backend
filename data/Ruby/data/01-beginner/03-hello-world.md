## Lesson 3: Hello World

It is time to execute your first lines of Ruby code. This lesson breaks down the exact syntax used to print data to the screen, introduces the interactive terminal environment, and unpacks the subtle differences between Ruby’s primary output methods.

---

## The Interactive Ruby Shell (IRB)

Before writing code into script files, professional Ruby developers often use **IRB (Interactive Ruby)**. It is a Read-Eval-Print Loop (REPL) shell built right into the environment. It allows you to test expressions and run code snippets in real-time.

To use it:

1. Open your system terminal.
2. Type `irb` and press enter.
3. Type your code, hit enter, and the shell will immediately print the return value.

---

## Writing Your First Script

To create a permanent executable script, create a file named `hello_world.rb` using your code editor and write the following line:

```ruby
puts "Hello, John Doe!"

```

To run this file from your system terminal, invoke the Ruby interpreter followed by the filename:

```bash
$ ruby hello_world.rb
# Output: Hello, John Doe!

```

---

## Deep Dive: Output Methods (`puts`, `print`, `p`)

Ruby gives you multiple ways to send text data to the standard output channel (`$stdout`). While they look similar on the surface, they handle formatting, newlines, and raw return values completely differently.

| Method | Appends Newline (`\n`)? | Evaluates Escape Sequences? | inspects Object Properties? | Primary Use Case |
| --- | --- | --- | --- | --- |
| **`puts`** | **Yes** (if not already present) | Yes | No (calls `.to_s`) | General, clean user-facing output. |
| **`print`** | **No** | Yes | No (calls `.to_s`) | Continuous console logging or inline text prompts. |
| **`p`** | **Yes** | No | **Yes** (calls `.inspect`) | **Debugging**. Displays type information and structural literals. |

### Visualizing the Differences

To truly understand how these three differ under the hood, analyze how they process strings with escape characters and arrays:

```ruby
# Example 1: Handling Newlines and Escape Characters
puts "John\nDoe"
# Output:
# John
# Doe

print "John\nDoe"
# Output:
# John
# Doe (Note: Next terminal prompt will append directly right here)

p "John\nDoe"
# Output: "John\nDoe" (Outputs literal quotes and reveals raw escape characters)


# Example 2: Handling Arrays
names = ["John", "Jane"]

puts names
# Output:
# John
# Jane

p names
# Output: ["John", "Jane"]

```

> **The Return Value Rule:** Like almost every expression in Ruby, output methods return a value to the caller. Both `puts` and `print` execute their task and return `nil`. The `p` method, however, returns the **exact object** that was passed into it, making it incredibly easy to chain mid-expression during debugging.