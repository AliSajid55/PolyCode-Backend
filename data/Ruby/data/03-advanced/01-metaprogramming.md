## Lesson 1: Introduction to Metaprogramming

Metaprogramming is the art of writing code that writes code at runtime. In Ruby, metaprogramming is not a specialized sub-language or an advanced macro system; it is a natural consequence of Ruby's highly dynamic object model. Because classes, modules, and method tables are mutable objects open for modification at runtime, you can dynamically inspect, define, and alter code behavior while your application is actively executing.

---

## The Core Concept: Open Classes & Monkey Patching

In Ruby, class definitions are never closed. When you use the `class` keyword for an existing class (even core standard library classes like `String` or `Integer`), you aren't redefining it—you are reopening it. Adding or modifying methods inside an open class is colloquially known as **Monkey Patching**.

```ruby
# Reopening the built-in String class
class String
  def kebab_case
    self.downcase.strip.gsub(/[\s_]+/, '-')
  end
end

puts "John Doe User".kebab_case # Output: john-doe-user

```

### The Danger Zone of Monkey Patching

While powerful, monkey patching core classes carries high architectural risk. If you introduce a custom method that collides with an existing core method, or if two separate third-party gems patch the exact same method name, the last evaluation wins, silently overriding behavior and causing bugs across your dependency chain.

---

## Dynamic Method Execution via `send`

Normally, you invoke a method using dot notation (`object.method_name`). However, if the method you want to call depends on runtime conditions or user configuration, you can use the **`send`** method to pass the method name dynamically as a symbol or a string.

```ruby
class DocumentProcessor
  def export_pdf; "Converting to PDF..." end
  def export_html; "Converting to HTML..." end
end

processor = DocumentProcessor.new
user_choice = "pdf"

# Dynamically building and invoking the method name at runtime
format_method = "export_#{user_choice}"
puts processor.send(format_method) # Output: Converting to PDF...

```

### Bypassing Encapsulation Safety

The `send` method can access and execute **private methods** on an object, completely bypassing standard visibility restrictions. If you want to dynamically execute methods while maintaining strict public encapsulation boundaries, use **`public_send`** instead.

---

## Dynamic Method Definition via `define_method`

Instead of hardcoding every method manually using the `def` keyword, you can use **`define_method`** (a private class method) to generate instance methods programmatically on the fly. This is highly effective for reducing boilerplate code when defining a series of repetitive, predictable routines.

```ruby
class UserProfile
  # A list of dynamic statuses we want to support
  STATUSES = [:pending, :active, :suspended, :archived]

  STATUSES.each do |status_name|
    # Generates a predicate method (e.g., pending?, active?) for each status
    define_method("#{status_name}?") do
      @status == status_name
    end
  end

  def initialize(status)
    @status = status
  end
end

user = UserProfile.new(:active)
puts user.active?    # Output: true
puts user.suspended? # Output: false

```

---

## Ghost Methods via `method_missing`

When an object receives a message (a method call) that it does not understand, the Ruby runtime engine crawls up the lookup chain (`ancestors`). If it hits the top without finding a match, it circles back and fires a special fallback method on the receiver: **`method_missing`**.

By overriding `method_missing`, you can intercept unknown method calls and respond to them dynamically. Methods handled this way are referred to as **Ghost Methods**.

```ruby
class DataRow
  def initialize(attributes = {})
    @attributes = attributes # e.g., { first_name: "John", last_name: "Doe" }
  end

  # Intercepting undefined method calls
  def method_missing(method_name, *args, &block)
    # Check if the missing method name matches a key in our attributes hash
    if @attributes.key?(method_name)
      @attributes[method_name]
    else
      # Critical: Always hand off execution to super if you can't handle it
      super
    end
  end

  # Crucial Best Practice: If you override method_missing, always override respond_to_missing?
  def respond_to_missing?(method_name, include_private = false)
    @attributes.key?(method_name) || super
  end
end

row = DataRow.new(first_name: "John", role: "Admin")
puts row.first_name # Output: John (Handled cleanly by method_missing)
# puts row.age      # Raises NameError / NoMethodError via super handoff

```