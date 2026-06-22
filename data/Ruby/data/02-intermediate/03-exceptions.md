## Lesson 3: Exception Handling

Errors at runtime are inevitable, whether due to network drops, bad user input, or missing files. Ruby handles these events using **Exceptions**. When an error occurs, Ruby halts the normal execution path and raises an exception object up the call stack until it is either rescued or crashes the program.

---

## The `begin...rescue...end` Architecture

The fundamental block for trapping and handling runtime errors is the `begin` structure. It isolates code that might fail and provides an alternate execution path.

```ruby
begin
  # Code that might raise an exception
  file = File.open("missing_config.json")
  puts file.read
rescue
  # Fallback code executed only if an error occurs
  puts "Configuration file could not be loaded. Applying system defaults."
end

```

### The Global Rescue Pitfall

Writing a bare `rescue` statement without an explicit error class is a common anti-pattern. By default, a bare rescue catches only errors that inherit from **`StandardError`**. While this sounds safe, it means you can accidentally swallow functional runtime bugs.

Always catch targeted exception classes to keep your error handling precise.

---

## Targeting Specific Exception Classes

Ruby features a rich hierarchy of built-in exception classes. You can chain multiple `rescue` clauses to handle different types of failures uniquely, and assign the error object to a variable using the rocket operator (`=>`).

```ruby
begin
  # Perform a risky combination of network and math operations
  numerator = 100
  denominator = params[:value].to_i
  result = numerator / denominator
  
  File.write("logs/output.txt", result)
rescue ZeroDivisionError => e
  puts "Math Error: Cannot divide by zero. Raw details: #{e.message}"
rescue IOError, Errno::ENOENT => e
  puts "Disk Error: System could not write logs. Raw details: #{e.message}"
rescue StandardError => e
  puts "Generic Error: An unexpected issue occurred: #{e.class} - #{e.message}"
end

```

---

## Ensuring Execution: `ensure` and `else`

To build resilient, production-grade workflows, you can extend the exception block with `else` and `ensure` clauses.

* **`else`:** Runs only if the code in the main `begin` block executes perfectly *without* throwing any errors.
* **`ensure`:** Guarantees execution of its block **no matter what**, regardless of whether an exception was raised, rescued, or uncaught. This is critical for releasing system resources, closing database connections, or wiping temporary files.

```ruby
def process_transaction(db_connection)
  begin
    db_connection.open
    db_connection.execute("UPDATE accounts SET balance = 0")
  rescue IOError => e
    puts "Transaction failed to execute: #{e.message}"
  else
    puts "Transaction committed successfully without errors."
  ensure
    # This line runs even if the block crashed or was rescued
    db_connection.close if db_connection
    puts "Database resource securely released."
  end
end

```

---

## Raising Exceptions Manually (`raise`)

You can force an exception to trigger intentionally in your business logic using the `raise` keyword (or its alias `fail`). This immediately halts execution and starts climbing back up the call stack.

```ruby
def verify_admin_status(user)
  unless user.role == "admin"
    # Pass the exception class and a descriptive error message
    raise ArgumentError, "Access Denied: User must be an administrator."
  end
  
  puts "Access authorized."
end

```

---

## Cleaner Code: Inline Method Rescues

If a method's *entire body* needs protection, you can drop the explicit `begin` and `end` keywords entirely. Ruby allows the method's implicit `def...end` shell to double as the boundary for a `rescue` block.

```ruby
# Clean, idiomatic production layout
def parse_payload(json_string)
  JSON.parse(json_string)
rescue JSON::ParserError
  {} # Return a safe empty hash if formatting is corrupt
end

```