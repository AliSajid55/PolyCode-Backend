## Lesson 2: PHP Basics

Now that you understand how the engine processes files, let's look at how the language itself is structured. This lesson covers PHP's structural syntax rules, data typing rules, and variable scoping behavior that form the bedrock of clean backend architecture.

---

## 1. Escaping to PHP: Opening and Closing Tags

The PHP engine parses a file looking for specific tags to start and stop executing code. Anything outside these tags is ignored by the compiler and passed directly to the output buffer.

```php
<?php
// Your PHP engine execution starts here

echo "This is executed as backend code.";

// The closing tag below is completely optional in pure PHP files.
?>

```

### Production Rules for Tags

* **The Pure PHP Rule:** If your file contains *only* PHP code, **never** use the closing `?>` tag. Omitting it prevents accidental whitespace or newlines from being injected after the tag, which can break HTTP header redirects or corrupt JSON payloads.
* **The Short Echo Tag:** For clean templates where PHP is interspersed with HTML, use the short echo tag: `<?= $variable ?>` instead of `<?php echo $variable; ?>`.

---

## 2. Dynamic Typing and Strict Typing Modes

PHP is dynamically typed by default. Variables adapt to whatever type you assign them on the fly. However, relying on this behavior in production leads to silent runtime errors. Modern PHP allows you to enforce **Strict Types**.

### Enabling Type Safety

To enforce strict scalar type declarations across your application files, declare the strict types directive at the absolute top of your script:

```php
<?php
declare(strict_types=1);

// The engine will now throw a TypeError if types do not match scalar declarations.

```

### Core Primitive Data Types

| Data Type | Description | Production Example |
| --- | --- | --- |
| **String** | Alphanumeric sequences. | `$name = "Saad";` |
| **Integer** | Whole non-decimal numbers. | `$status = 200;` |
| **Float** | Decimal or floating-point numbers. | `$price = 99.99;` |
| **Boolean** | Logical truth values. | `$isActive = true;` |
| **Array** | Ordered or key-value mapped structures. | `$roles = ['admin', 'editor'];` |
| **Object** | Instances of programmer-defined classes. | `$user = new User();` |
| **Null** | Representing a variable with no value. | `$payload = null;` |

---

## 3. Variable Scope and Lifetime

Variables in PHP are declared using the `$` symbol followed by an alphanumeric name or underscore (e.g., `$userId`). Unlike languages like JavaScript where variables leak across nested blocks easily, PHP has strict boundaries.

### Local Scope

Variables declared inside a function are strictly isolated to that function execution block.

```php
function getStatus() {
    $localStatus = "active"; // Local scope
    return $localStatus;
}
// Accessing $localStatus here throws an Undefined Variable error.

```

### Global Scope

Variables declared outside any function reside in the global scope. To reference them inside functions, you must explicitly import them via the `global` keyword or use the `$GLOBALS` superglobal array.

```php
$config = ['db' => 'mysql'];

function connect() {
    global $config; // Explicit import required
    $db = $config['db']; 
}

```

> **Production Note:** Minimize or completely eliminate the use of the `global` keyword in modern applications. It introduces hidden state dependencies and destroys testability. Instead, cleanly inject variables as parameters into your functions or classes.

### Static Scope

A `static` variable retains its structural value even after the function finishes execution, acting as a lightweight, functional state container.

```php
function trackInvocations(): int {
    static $count = 0; // Initialized only once
    $count++;
    return $count;
}

echo trackInvocations(); // Outputs: 1
echo trackInvocations(); // Outputs: 2

```

---

## 4. Error Logging and Output Fundamentals

In modern backend architecture, how you output or look at data matters.

* **`echo` vs `print`:** `echo` is a language construct that accepts multiple parameters and returns nothing. `print` behaves like a function, returns `1`, and is slightly slower. Use `echo`.
* **Debugging Tools:** Never use `echo` to debug arrays or objects. Use `print_r($array)` or `var_dump($object)` for complete type inspection. In a production environment, wrap these with a comprehensive logger (like Monolog) to route output cleanly to system logs rather than dumping internal variable traces out to an end user.

---

The syntax boundaries are drawn. Standing by for your next topic signal.