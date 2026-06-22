## Lesson 6: Loops

When you need to execute a block of code repeatedly based on a specific condition or iterate over a collection of data, PHP provides four specialized loop constructs. Writing production-grade loops requires selecting the correct construct to minimize memory overhead and avoid infinite runtime executions.

---

## 1. Entry-Controlled Loops: `while` and `for`

Entry-controlled loops evaluate their conditional expressions *before* executing the inner block of code. If the condition evaluates to `false` immediately, the inner block is skipped entirely.

### The `while` Loop

A `while` loop runs indefinitely as long as its condition remains true. It is ideal when you do not know the exact number of iterations beforehand (e.g., streaming rows from a database cursor).

```php
<?php
declare(strict_types=1);

$stream = fopen('data.csv', 'r');

// Condition evaluated before each iteration
while (($row = fgetcsv($stream)) !== false) {
    // Process the data row
    error_log("Processing item: " . $row[0]);
}

fclose($stream);

```

### The `for` Loop

A `for` loop is ideal when you know exactly how many times the loop should run. It centralizes initialization, condition evaluation, and loop increments into a single line.

```php
// Initialization; Condition; Increment
for ($i = 0; $i < 5; $i++) {
    echo "Iteration index: {$i}\n";
}

```

---

## 2. Exit-Controlled Loops: `do-while`

An exit-controlled loop executes its code block **at least once** because the halting condition is evaluated at the *end* of the iteration cycle rather than the start.

```php
$retryCount = 0;
$maxRetries = 3;

do {
    $success = attemptApiConnection();
    $retryCount++;
    
    if ($success) {
        break;
    }
} while ($retryCount < $maxRetries);

```

> **Production Use-Case:** Use `do-while` when the logic inside the loop initializes or modifies the variable required by the evaluation condition.

---

## 3. Collection Iteration: `foreach`

The `foreach` construct is the standard choice for iterating through arrays and iterable objects. It abstracts away manual pointer tracking and index manipulation.

### Value-Only Iteration

```php
$activeUsers = ['Saad', 'Asim', 'Zayn'];

foreach ($activeUsers as $user) {
    echo "User: {$user}\n";
}

```

### Key-Value Pair Iteration

```php
$httpHeaders = [
    'Content-Type' => 'application/json',
    'X-Auth-Token' => 'secret_hash_value'
];

foreach ($httpHeaders as $key => $value) {
    echo "Header Name: {$key} | Header Value: {$value}\n";
}

```

### Modifying Values by Reference (`&`)

By default, `foreach` works on a *copy* of the array elements. If you need to modify the array values directly during iteration, use a reference operator (`&`).

```php
$prices = [10.0, 20.0, 30.0];

foreach ($prices as &$price) {
    $price = $price * 1.10; // Apply 10% tax directly to the original array element
}
unset($price); // CRITICAL: Always break the reference link after the loop!

```

> **Production Warning:** If you omit `unset($price)` after a reference loop, that variable remains bound to the last element of the array. A subsequent assignment to `$price` somewhere else in your script will silently overwrite that last array element, creating hard-to-track bugs.

---

## 4. Iteration Control: `break` and `continue`

To alter the execution path of a loop dynamically, use jump statements.

* **`break`**: Terminates execution of the current loop structure immediately.
* **`continue`**: Skips the remaining code inside the current iteration and jumps straight to the condition evaluation or next element step.

### Multi-Tier Loop Control

Both keywords accept an optional numeric argument instructing them how many nested loop layers to break out of or skip.

```php
foreach ($categories as $category) {
    foreach ($category->getItems() as $item) {
        if ($item->isInvalid()) {
            // Skips the rest of this item AND moves to the next category entirely
            continue 2; 
        }
    }
}

```

---
