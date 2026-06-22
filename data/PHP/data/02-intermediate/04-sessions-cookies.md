## Lesson 4: Sessions and Cookies

HTTP is inherently stateless. Every request a client makes to a server is treated as an isolated transaction, meaning the server has no native way of remembering who a user is between page loads. Sessions and cookies bridge this gap, allowing you to persist user state, manage authentication tokens, and track user preferences across an application lifecycle.

---

## 1. What is a Cookie?

A **cookie** is a compact text file stored directly on the client's machine by the web browser. Cookies are managed via HTTP headers: the server sends a `Set-Cookie` header in its response, and the browser automatically sends that cookie data back to the server inside the `Cookie` header of every subsequent HTTP request.

### Setting and Reading Cookies Safely

To set a cookie, use PHP's native `setcookie()` function. This must be invoked **before any HTML output or whitespace** is sent to the response stream, as it alters HTTP headers directly.

```php
<?php
declare(strict_types=1);

// Syntax: setcookie(name, value, expires, path, domain, secure, httponly)
$cookieValue = "dark_mode";
$expirationTime = time() + (86400 * 30); // 30 days in the future

setcookie('user_preference', $cookieValue, [
    'expires' => $expirationTime,
    'path' => '/',
    'domain' => '',
    'secure' => true,      // Sent only over HTTPS connections
    'httponly' => true,    // Blocks JavaScript access (mitigates XSS cookie theft)
    'samesite' => 'Lax'    // Mitigates Cross-Site Request Forgery (CSRF) attacks
]);

```

### Accessing a Cookie Value

Once a cookie is set by the browser, its value is parsed into the `$_COOKIE` superglobal array on the next request.

```php
$theme = $_COOKIE['user_preference'] ?? 'light_mode';

```

---

## 2. What is a Session?

A **session** stores user state on the *server* rather than the client machine. This makes sessions ideal for sensitive transactional data, such as authentication records or shopping cart details.

### The Session Architecture Lifecycle

1. When you invoke `session_start()`, PHP generates a unique, cryptographically secure identifier called a **Session ID** (typically an alphabetic string).
2. The server stores this identifier as a cookie (usually named `PHPSESSID`) on the user's browser.
3. Concurrently, a matching state file is created in the server's private filesystem.
4. On subsequent requests, the browser transmits the `PHPSESSID` cookie. PHP reads this ID, searches for the matching server-side data file, and reconstructs the session state automatically.

---

## 3. Implementing and Managing Sessions

To use sessions, you must invoke `session_start()` at the absolute top of your script before rendering any markup or headers. Once initialized, interact with the state via the `$_SESSION` superglobal.

### Initializing and Writing to a Session

```php
<?php
declare(strict_types=1);

// Initialize or resume the active session
session_start();

// Write user authentication data safely into the session structure
$_SESSION['user_id'] = "usr_90210";
$_SESSION['role'] = "administrator";
$_SESSION['logged_in_at'] = time();

```

### Reading Session Data

```php
<?php
declare(strict_types=1);

session_start();

// Verify user authorization state
if (!isset($_SESSION['user_id'])) {
    header('Location: /login.php');
    exit;
}

echo "Authenticated user ID: " . $_SESSION['user_id'];

```

### Destroying a Session Completely

When logging a user out, clear the local runtime data, instruct the server to clean up its local file storage, and clear the client-side tracking cookie.

```php
<?php
declare(strict_types=1);

session_start();

// 1. Flush all local environment session variables from memory
$_SESSION = [];

// 2. Terminate the browser tracking cookie entry
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Delete the backing server state storage file completely
session_destroy();

```

---

## 4. Architectural Comparison: Cookies vs. Sessions

| Feature Criteria | Cookies | Sessions |
| --- | --- | --- |
| **Storage Location** | Client Browser Environment | Secure Backend Server Filesystem |
| **Data Capacity** | Max 4KB per cookie element | Virtually unlimited (bounded by server storage space) |
| **Security Profile** | Low. Vulnerable to client-side manipulation and interception. | High. Only the opaque Session ID is exposed to the client. |
| **Typical Use Cases** | Tracking user themes, tracking analytics tokens, persistence choices. | Handling login authentication, processing checkouts, multi-step forms. |