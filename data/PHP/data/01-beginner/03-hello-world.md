## Lesson 3: Hello World

It is time to execute your first script. While writing a "Hello World" application seems trivial in many languages, doing it properly in PHP requires understanding how the engine communicates with client streams, CLI contexts, and how data safely escapes to the browser.

---

## 1. Writing Your First Script

Let's create a lean, standard PHP file. Create a file named `index.php` in your environment directory.

```php
<?php
// Reason: Pure PHP file, so the closing tag is intentionally omitted to prevent accidental trailing whitespace injection.

echo "Hello, World!";

```

### Breaking It Down Line-by-Line

* `<?php`: Tells the Zend Engine parser to start interpreting everything that follows as executable backend code.
* `// ...`: A single-line comment. Use these cleanly to document *why* a complex logic pattern exists, not *what* a simple line does.
* `echo`: A core language construct that pushes string data straight into the HTTP response stream or standard output buffer.
* `"Hello, World!"`: A scalar string literal.
* `;`: The semicolon. PHP is a expression-terminated language; missing a semicolon triggers an immediate compilation `ParseError`.

---

## 2. Executing Your Code: CLI vs Web Server

PHP is versatile. It can run directly as a script in your terminal or as an engine behind an enterprise web router.

### Execution Path A: Command Line Interface (CLI)

Open your terminal, navigate to the directory containing your file, and run the PHP binary directly:

```bash
php index.php

```

**Output:**

```text
Hello, World!

```

> **Production Context:** CLI execution is how PHP handles cron jobs, queue workers (processing background tasks like sending emails via Amazon SQS or Redis), and command-line application tools like Laravel's Artisan.

### Execution Path B: Built-in Web Server

PHP includes a built-in server perfectly suited for local development. Run this command in your terminal:

```bash
php -S localhost:8000

```

Now open your browser and navigate to `http://localhost:8000`. The engine will catch the request, process `index.php`, and render the text inside your browser viewport.

---

## 3. Mixing PHP with HTML and Defensive Escaping

When building modern server-rendered views, you will routinely mix PHP into HTML layouts. When doing this, you must protect your output streams from **Cross-Site Scripting (XSS)** vulnerabilities by ensuring text values are safely escaped before hitting the user's browser.

Here is how a clean, safe template implementation looks:

```php
<?php
// Define our display data
$greeting = "Hello, World!";
$userInput = "<script>alert('compromised');</script>"; // Simulation of malicious user data
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PHP Lesson 3</title>
</head>
<body>

    <!-- 1. Clean template rendering using the Short Echo Tag -->
    <h1><?= $greeting ?></h1>

    <!-- 2. Secure escaping of dynamic data to block XSS injection -->
    <p>Safe Echo: <?= htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8') ?></p>

</body>
</html>

```

### Critical Security Rules

* **`htmlspecialchars()`:** Converts dangerous characters (like `<` and `>`) into safe HTML entities (`&lt;` and `&gt;`). If you output raw user input or untrusted database values without this, malicious users can inject JavaScript that steals cookies or hijacks your user sessions.
* **The `ENT_QUOTES` flag:** Forces the converter to escape both single and double quotes, sealing off attributes from injection breakouts.

---

The code is rendering and the pipelines are clear. Standing by for your next topic signal.