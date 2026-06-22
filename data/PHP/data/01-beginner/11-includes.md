## Lesson 11: Includes and Requires

As an application scales, housing all logic inside a single file becomes unmaintainable. PHP provides four file inclusion directives that allow you to split your codebase into modular components, reusable configuration blocks, and isolated templates.

---

## 1. The Inclusion Directives: Functional Differences

PHP offers four distinct ways to pull external files into the current execution thread: `include`, `require`, `include_once`, and `require_once`. Choosing the correct directive depends on how critical the external file is to your application's survival and how you want to handle duplicate executions.

### `include` vs. `require` (Failure Severity)

* **`include`**: If the target file is missing or inaccessible, the engine raises a `E_WARNING` message. **Execution does not stop.** The script continues processing subsequent lines of code. Use this for non-critical assets like footer layout modules.
* **`require`**: If the target file is missing, the engine raises a compilation `Fatal Error` (specifically a `CompileError` exception). **Execution halts immediately.** Use this for mission-critical architecture elements like database configurations, security layers, or dependency files.

### The `_once` Suffix (Execution Duplication)

* **`include` / `require**`: Pulls and executes the target file every single time the statement is hit. If a file defines a function or class and you include it twice, PHP will crash with a "Cannot redeclare function" fatal error.
* **`include_once` / `require_once**`: The engine tracks all imported files in an internal registry. If the target file has already been imported during the current request lifecycle, the subsequent import attempt is silently ignored.

### Directive Matrix

| Directive | Missing File Behavior | Multiple Imports Allowed? | Primary Use Case |
| --- | --- | --- | --- |
| **`include`** | Emits `E_WARNING`; continuous execution | Yes | Dynamic HTML components, templates, or view fragments. |
| **`require`** | Throws `Fatal Error`; halts execution | Yes | Repetitive procedural script segments. |
| **`include_once`** | Emits `E_WARNING`; continuous execution | **No (Safeguarded)** | Non-critical helper libraries. |
| **`require_once`** | Throws `Fatal Error`; halts execution | **No (Safeguarded)** | Core application setups, class definitions, and configs. |

---

## 2. Real-World Architecture: Building a Modular Layout

A classic architectural pattern for server-rendered web applications is to isolate layout scaffolding into a `templates` directory, using inclusions to assemble the view layer dynamically.

### Step 1: The Header Blueprint (`templates/header.php`)

```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle ?? 'Default Title', ENT_QUOTES, 'UTF-8') ?></title>
</head>
<body>
    <nav>
        <a href="/">Home</a> | <a href="/dashboard">Dashboard</a>
    </nav>

```

### Step 2: The Core Application Page (`index.php`)

```php
<?php
declare(strict_types=1);

// 1. Enforce inclusion of mission-critical business configuration
require_once __DIR__ . '/config/database.php';

// 2. Set contextual state variables for the template streams
$pageTitle = "Main System Dashboard";

// 3. Assemble the layout views
include __DIR__ . '/templates/header.php';
?>

<main>
    <h1>Welcome to the Application Core</h1>
    <p>This structural layout is dynamically injected by the PHP runtime engine.</p>
</main>

<?php
// 4. Pull in the terminal layout piece safely
include __DIR__ . '/templates/footer.php';

```

---

## 3. Path Resolution Strategy: The Absolute Path Rule

When referencing a file path inside your inclusion directives, you can use relative paths or absolute paths.

### The Relative Path Anti-Pattern

```php
// Dangerous: Depends entirely on the current working directory of the execution thread
include 'templates/header.php'; 
include '../config/database.php';

```

> **Production Warning:** Relative paths are resolved relative to the *current working directory* of the executing script, not the location of the file making the call. If your index file handles complex URL rewriting or routes through subfolders, relative lookups will break, causing erratic file-not-found errors.

### The Absolute Path Production Rule

Always build absolute paths using the native `__DIR__` magic constant. `__DIR__` resolves to the absolute, fully qualified directory path of the filesystem folder containing the current script file, ensuring predictable path evaluations regardless of entry point routing.

```php
// Production-Grade: Perfectly deterministic file mapping
require_once __DIR__ . '/../config/app_setup.php';

```

---

## 4. Returning Values from Inclusions

Files pulled into an execution thread via an inclusion directive are not strictly limited to side-effects or raw echo strings. They can return values directly to the calling file using a standard `return` statement. This approach is highly useful for managing configuration payloads.

### The Isolated Configuration Source (`config/app.php`)

```php
<?php
declare(strict_types=1);

// Return an isolated dictionary array directly to the compilation stream
return [
    'app_env' => 'production',
    'debug_mode' => false,
    'api_keys' => [
        'stripe' => 'sk_live_v90210'
    ]
];

```

### Capturing the Return Value (`bootstrap.php`)

```php
<?php
declare(strict_types=1);

// Capture the underlying return payload array directly into a local variable container
$config = require __DIR__ . '/config/app.php';

echo $config['app_env']; // Outputs: production

```