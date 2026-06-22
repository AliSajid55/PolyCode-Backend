## Lesson 4: Variables and Data Types

In PHP, a variable is essentially a named pointer stored in memory that points to a core internal C structure called a **zval** (Zend Value). Understanding how to manipulate these pointers, force strict type compliance, and inspect memory representation is crucial for writing high-performance backend systems.

---

## 1. Variable Assignment and Memory Mechanics

PHP offers two ways to assign values to variables: **Assignment by Value** and **Assignment by Reference**.

### Assignment by Value (Default)

When you assign a variable to another, PHP utilizes a memory-saving mechanism called **Copy-on-Write (COW)**. The two variables point to the exact same memory space until one of them is modified.

```php
$a = "Initial Data";
$b = $a; // Both $a and $b point to the same internal zval memory container.

$b = "Modified Data"; // COW triggers. New memory is allocated specifically for $b.

```

### Assignment by Reference (`&`)

By prefixing a variable with an ampersand, you force both variables to point to the exact same memory container permanently. Modifying either variable alters the underlying value directly.

```php
$x = 10;
$y = &$x; // $y is a reference link to $x

$y = 50; 
echo $x; // Outputs: 50

```

---

## 2. Scalar and Compound Types in Action

PHP categorizes types into **Scalar** (single value), **Compound** (collection of values), and **Special** types.

### Type Categories

| Category | Type | Production Description | Example |
| --- | --- | --- | --- |
| **Scalar** | `bool` | Represents logical truth states. | `$isLogged = true;` |
| **Scalar** | `int` | Platform-dependent signed whole numbers. | `$id = 4529;` |
| **Scalar** | `float` | IEEE 754 precision floating-point numbers. | `$rate = 0.05;` |
| **Scalar** | `string` | A byte array (not Unicode native; supports up to 2GB). | `$slug = 'php-basics';` |
| **Compound** | `array` | An ordered map linking keys to values. | `$data = ['id' => 1];` |
| **Compound** | `object` | An instance of a user-defined class structure. | `$res = new Response();` |
| **Special** | `resource` | Holds a reference to an external system handler. | `$file = fopen('log.txt', 'r');` |
| **Special** | `null` | A deliberate marker representing an unassigned state. | `$token = null;` |

---

## 3. Strict Type Assertions & Type Hinting

While PHP's dynamic engine seamlessly juggles loose types, production code relies on strict boundaries to eliminate type mutation bugs.

### Type Coercion (Weak Mode - Default)

Without strict types, PHP will silently try to convert mismatched data types to satisfy parameter demands.

```php
<?php
function calculateTotal(int $price, int $quantity) {
    return $price * $quantity;
}

// PHP silently coerces the string "5" into an integer 5 and runs without error.
calculateTotal(10, "5"); 

```

### Strict Type Enforcement

By adding the `strict_types` directive as the **absolute first statement** in a file, scalar type hinting becomes rigid. The engine stops coercing values and throws a `TypeError` if data types don't match perfectly.

```php
<?php
declare(strict_types=1);

function calculateTotal(int $price, int $quantity): int {
    return $price * $quantity;
}

// This line now triggers a fatal TypeError because a string was passed instead of an int.
calculateTotal(10, "5"); 

```

---

## 4. Advanced Type Handling (PHP 8.x+)

Modern PHP allows for expressive, multi-type definitions directly within function signatures using **Union Types** and **Intersection Types**.

### Union Types (`|`)

Enables a property, parameter, or return type to accept multiple distinct types.

```php
// Explicitly states that the ID can be an integer or a UUID string, or null
function findUser(int|string|null $id): array|null {
    // Database lookup logic...
    return [];
}

```

### The `mixed` Type

The `mixed` type represents an explicit catch-all type. It is equivalent to a union type of `object|array|string|int|float|bool|null|resource`. Use this sparingly, primarily when migrating legacy un-typed codebases or dealing with polymorphic payload structures.

---

The type system rules are set. Standing by for your next topic signal.