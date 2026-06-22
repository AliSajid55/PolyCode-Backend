## Lesson 10: HTML Forms and PHP Processing

HTML forms are the primary interface for collecting user input on the web. When a user submits a form, the browser packages the input fields into an HTTP request and transmits them to the server. PHP captures this payload, populates native global data structures, and allows you to validate and process the incoming data.

---

## 1. Form Architecture: GET vs. POST Methodologies

An HTML form relies on two critical attributes: `action` (the destination URL processing the data) and `method` (the HTTP verb used to send the data).

```html
<form action="process.php" method="POST">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required>
    
    <button type="submit">Submit Data</button>
</form>

```

### The Importance of the `name` Attribute

The PHP engine maps incoming data based *entirely* on the HTML `name` attribute of each input element. If an input field lacks a `name` attribute, the browser will not include its value in the HTTP request payload, rendering it invisible to your backend script.

### Architectural Comparison: GET vs. POST

| Attribute Feature | GET Method | POST Method |
| --- | --- | --- |
| **Data Transmission** | Appends variables directly onto the URL query string (`?id=1&mode=edit`). | Packages data inside the hidden HTTP request body payload. |
| **Data Capacity** | Extremely limited (typically around 2,048 characters depending on the browser/server). | Digitally unlimited (restricted only by server configuration constraints like `post_max_size`). |
| **Security Cache** | Highly insecure for secrets. Stays exposed in browser history, server logs, and caches. | Safer for transit. Does not expose variables in the URL line (Requires TLS/HTTPS for complete privacy). |
| **Primary Use Case** | Idempotent operations: Searching, filtering, and pagination where bookmarking is needed. | State-changing operations: Creating accounts, submitting payments, or mutating database values. |

---

## 2. Superglobals: `$_GET`, `$_POST`, and `$_SERVER`

When an HTTP request hits PHP, the engine parses the incoming payload and automatically populates specific global arrays known as **Superglobals**. These arrays are available throughout every execution scope across your application without requiring explicit global import declarations.

* **`$_GET`**: An associative array of variables passed via the URL parameters.
* **`$_POST`**: An associative array of variables passed via the HTTP request body when using `method="POST"`.
* **`$_SERVER`**: A rich informational array containing headers, file paths, server configurations, and script locations.

### Inspecting Request Metadata Safely

```php
<?php
declare(strict_types=1);

// Route traffic cleanly based on the incoming HTTP Request Verb
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect the data sent via POST body
    $submittedUser = $_POST['username'] ?? '';
}

```

---

## 3. Defense-in-Depth: Validation, Sanitization, and Escaping

Accepting raw user data without filtering introduces severe operational vulnerabilities, such as **Cross-Site Scripting (XSS)** and malicious code execution. To protect your backend, implement a strict three-tier processing workflow:

1. **Validation**: Confirm the input matches structural rules (e.g., is this actually an email? Is the password long enough?).
2. **Sanitization**: Clean the data by stripping out unauthorized characters or illegal symbols.
3. **Escaping**: Convert special characters right before rendering data to the browser, rendering code injections inert.

### Secure Processing Implementation (`process.php`)

```php
<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Bounce traffic that tries to access this script via a direct URL GET request
    header('HTTP/1.1 405 Method Not Allowed');
    exit('Invalid request method.');
}

// 1. Collect and Sanitize input data arrays
$rawEmail = $_POST['email'] ?? '';
$cleanEmail = filter_var(trim($rawEmail), FILTER_SANITIZE_EMAIL);

// 2. Validate structural integrity
if (!filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)) {
    // Fail early if input breaks business expectations
    header('HTTP/1.1 400 Bad Request');
    exit('Invalid email address configuration submitted.');
}

// 3. Process data safely (e.g., save to a database)
// ...

// 4. Render output safely using defensive escaping
?>
<p>Registration complete for: <?= htmlspecialchars($cleanEmail, ENT_QUOTES, 'UTF-8') ?></p>

```

### Essential PHP Filtering Tools

* **`filter_var($var, FILTER_VALIDATE_EMAIL)`**: Returns the validated email string or `false` if structurally compromised.
* **`filter_var($var, FILTER_VALIDATE_INT)`**: Confirms if a variable is a valid integer representation. Can be fine-tuned with range arrays (`min_range`, `max_range`).
* **`htmlspecialchars($str, ENT_QUOTES, 'UTF-8')`**: Core mitigation tool against XSS. Transforms dangerous script syntax into harmless HTML text blocks. Always apply this right at the point of view-rendering.