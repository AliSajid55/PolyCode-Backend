## Lesson 6: PSR Standards

When multiple developers or open-source teams contribute to an ecosystem, they must write code that looks, feels, and operates uniformly. **PSR (PHP Standard Recommendation)** is a set of specifications authored and maintained by the **PHP-FIG (Framework Interoperability Group)**. Adhering to these standards ensures that distinct components, frameworks, and libraries can interoperate seamlessly.

---

## 1. Core Structural Framework Standards

While there are dozens of accepted recommendations, a few core standards dictate how codebases are visually formatted, autoloaded, and organized in production environments.

### The Standard Tier Matrix

| PSR Identifier | Specification Category | Operational Intent |
| --- | --- | --- |
| **PSR-1** | Basic Coding Standard | Absolute baseline naming rules and file construction bounds. |
| **PSR-12** | Extended Coding Style Guide | Structural layout rules (braces, spacing, indents, line limits). |
| **PSR-4** | Autoloading Standard | System specification mapping namespaces to physical file folders. |
| **PSR-3** | Logger Interface | Unified object signature for passing error metrics cleanly. |
| **PSR-7 / PSR-15** | HTTP Message Interfaces | Standardized blueprints for Request, Response, and Middleware objects. |

---

## 2. Coding Layout Architecture: PSR-1 & PSR-12

PSR-1 and PSR-12 dictate how your code must look to maintain readable consistency across distinct codebases.

### Structural File Constraints (PSR-1)

* **No Side-Effect Mixing:** A single file should *either* declare symbols (classes, functions, constants) *or* execute side effects (echo output, modify files, connect to databases). It should never do both simultaneously.
* **Namespace Hierarchy:** All PHP classes must be explicitly namespaced under a vendor-first hierarchy.
* **Naming Conventions:** Class names must use `StudlyCaps`, method names must use `camelCase`, and global constants must use `UPPER_CASE_UNDERSCORED`.

### Formatting Constraints (PSR-12)

* **Indentation:** You must use exactly **4 spaces** for indentation. Hard tabs are strictly forbidden.
* **Line Length:** There is a soft limit of 120 characters per line; lines should rarely exceed this boundary.
* **Keywords:** All internal language keywords (such as `true`, `false`, `null`, `foreach`, `as`) must be written in lowercase.
* **Brace Placement:** Opening braces for classes and methods *must* go on the **next line** (`Fly-style`). Opening braces for control flow structures (like `if`, `while`, `switch`) *must* stay on the **same line**.

### Compliant Implementation Example

```php
<?php
declare(strict_types=1);

namespace App\Services; // PSR-1: Namespace declared at top

use InvalidArgumentException;

// PSR-12: Class brace opens on the next line
class OrderVerificationService 
{
    // PSR-12: Explicit visibility mapping on all properties
    private const MAX_ATTEMPTS = 3;

    // PSR-12: Method brace opens on the next line
    public function executeVerification(int $userId, string $token): bool 
    {
        // PSR-12: Control structures keep braces on the same line with 4-space indents
        if ($userId <= 0) {
            throw new InvalidArgumentException("User identification pointer is invalid.");
        }

        return hash_equals(self::MAX_ATTEMPTS . '_token', $token);
    }
}

```

---

## 3. Structural Autoloading Mapping: PSR-4

As covered during dependency management, **PSR-4** dictates how namespace fragments translate into physical operating system directories. This standard allows the PHP engine to automatically locate and resolve classes without developers maintaining massive, slow files filled with manual `require` statements.

### The File System Resolution Rules

Under PSR-4, a contiguous string of a namespace maps directly to a specific entry directory path. Sub-namespaces translate sequentially into subdirectories, and the terminating Class Name maps precisely to the filename.

* **Vendor Namespace Mapping:** `App\` maps to the `/src` folder root.
* **Sub-Namespace Pathing:** `App\Security\Authentication\` maps to `/src/Security/Authentication/`.
* **Class Target File:** `App\Security\Authentication\TokenManager` will look for the file at exactly `/src/Security/Authentication/TokenManager.php`.

Because PHP is case-sensitive on Linux filesystems, your class capitalization **must exactly match** your filesystem naming scheme, or the autoloader will fail at runtime.

---

## 4. Operational Interfaces: PSR-3 & PSR-7

Beyond text layout styles, FIG defines common interface blueprints that decouple application logic from concrete tool implementations.

### PSR-3: Logging Standard

PSR-3 defines a standard interface (`Psr\Log\LoggerInterface`) containing methods for handling logs (such as `info()`, `warning()`, `critical()`). By writing your code to type-hint this interface, your application can change logging engines (e.g., swapping out Monolog for an AWS CloudWatch logger) without modifying your application code.

### PSR-7 & PSR-15: HTTP Handlers

PSR-7 outlines how HTTP Requests and Responses are treated as immutable value objects. PSR-15 layers on top of this by defining standard blueprints for **Middleware** components. This allows developers to build universal packages—such as an authentication checker or a request rate limiter—that can plug into any framework that supports the PSR standard.