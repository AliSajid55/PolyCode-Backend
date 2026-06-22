## Lesson 7: Functions

Functions are the primary building blocks for encapsulating reusable logic. In modern production-grade PHP, functions are tightly managed structures with explicit type safety, strict scope isolation, and flexible parameter handling.

---

## 1. Function Structure and Basic Execution

A function is declared using the `function` keyword, followed by a unique identifier, parameters, an optional return type, and the execution block.

```php
<?php
declare(strict_types=1);

// Function definition with strict typing
function generateSlug(string $title): string 
{
    $lowercased = strtolower($title);
    return str_replace(' ', '-', $lowercased);
}

// Execution
$slug = generateSlug("Modern PHP Tutorial"); 
echo $slug; // Outputs: modern-php-tutorial

```

### Execution Mechanics

* **Return Allocation:** The `return` statement halts execution inside the function immediately and passes control and the resulting expression value back to the caller stream.
* **Implicit Return:** If a function does not return a value or returns nothing, it implicitly evaluates to `null`. If the function has a `void` return type hint, using `return;` without a value is required to exit early.

---

## 2. Advanced Parameter Architecture

PHP provides versatile mechanics for passing data into functions, ranging from fallback defaults to variable-length arguments.

### Optional Parameters & Default Values

Parameters can be assigned default values. These must always be placed *after* any mandatory arguments.

```php
function buildEndpoint(string $path, string $format = 'json'): string 
{
    return "/api/v1/{$path}.{$format}";
}

echo buildEndpoint('users');           // Outputs: /api/v1/users.json
echo buildEndpoint('posts', 'xml');    // Outputs: /api/v1/posts.xml

```

### Variadic Parameters (The Splat Operator `...`)

When you need a function to accept an arbitrary, unknown number of arguments, use the `...` prefix. The engine collects all matching incoming values into a standard flat array.

```php
function sumIntegers(int ...$numbers): int 
{
    // $numbers is processed as a standard array containing all passed values
    return array_sum($numbers);
}

echo sumIntegers(10, 20, 30, 40); // Outputs: 100

```

### Named Arguments (PHP 8.0+)

Named arguments allow you to pass values to a function based on the parameter name instead of its strict position. This self-documents your code and allows skipping optional parameters entirely.

```php
function createSession(string $userId, bool $rememberMe = false, bool $secure = true): void 
{
    // Session initialization logic...
}

// Execution ignoring position and skipping the second argument entirely
createSession(secure: true, userId: 'usr_90210');

```

---

## 3. Anonymous Functions and Arrow Functions

PHP supports treating functions as first-class citizens, meaning they can be assigned to variables, passed as callbacks, or returned from other functions.

### Anonymous Functions (Closures)

An anonymous function is a function without a specified name. To import variables from the parent lexical scope into the function's internal scope, you must use the `use` language construct.

```php
$taxRate = 0.15;

// The closure explicitly inherits $taxRate from parent scope by value
$applyTax = function (float $subtotal) use ($taxRate): float {
    return $subtotal + ($subtotal * $taxRate);
};

echo $applyTax(100.00); // Outputs: 115

```

### Arrow Functions (PHP 7.4+)

Arrow functions are a highly concise syntax for simple, single-expression anonymous functions. They **automatically capture** variables from the parent scope by value, completely removing the need for the manual `use` clause.

```php
$factor = 2;
$numbers = [1, 2, 3, 4];

// Auto-captures $factor by value natively
$multiplied = array_map(fn(int $n): int => $n * $factor, $numbers);

print_r($multiplied); // Outputs: [2, 4, 6, 8]

```

---

The procedural block mechanics are set. Standing by for your next topic signal.