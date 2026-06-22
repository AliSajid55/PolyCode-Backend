## Lesson 2: Namespaces

As applications scale and integrate third-party libraries via Composer, codebases run into a fundamental challenge: **naming collisions**. If two files define a class with the exact same name (e.g., `Response`), the engine throws a fatal compilation error. Namespaces solve this by partitioning the global code space into distinct, virtual directories.

---

## 1. What is a Namespace?

A namespace acts as a virtual directory structure for your code artifacts. Think of your operating system's filesystem: you cannot have two files named `User.php` in the same folder, but you can have one in `/app/Models/User.php` and another in `/app/Services/User.php`. Namespaces bring this exact isolation to classes, interfaces, functions, and constants inside PHP.

---

## 2. Declaring and Implementing Namespaces

A namespace must be declared at the **absolute top** of a file before any other code execution, with the sole exception of the `declare` directive. The backslash (`\`) character is used as the sub-namespace separator.

### File A: The Data Layer (`src/Models/User.php`)

```php
<?php
declare(strict_types=1);

namespace App\Models;

class User 
{
    public string $name = "Saad";
}

```

### File B: The External Service Layer (`src/Services/User.php`)

```php
<?php
declare(strict_types=1);

namespace App\Services;

class User 
{
    public function fetchRemoteData(): array 
    {
        return ['status' => 'active'];
    }
}

```

Both classes are safely named `User`, but they reside in entirely separate functional domains: `App\Models\User` and `App\Services\User`.

---

## 3. Consuming Namespaced Elements

When you are inside a file that needs to instantiate a namespaced class, you have three distinct strategies to reference it.

### Strategy A: Fully Qualified Class Names (FQCN)

You explicitly state the complete namespace path every time you reference the class. This is clean for single-use situations but becomes highly verbose.

```php
<?php
declare(strict_types=1);

// Prefix with a leading backslash to tell the engine to look from the global root space
$userModel = new \App\Models\User();

```

### Strategy B: Importing with the `use` Operator

By declaring a `use` statement at the top of your file, you import the class into the local file scope. This allows you to instantiate the class using its short name.

```php
<?php
declare(strict_types=1);

namespace App\Controllers;

// Import the specific classes into this file's scope
use App\Models\User;

class DashboardController 
{
    public function render(): void 
    {
        // Instantiates App\Models\User automatically
        $user = new User(); 
    }
}

```

### Strategy C: Aliasing with the `as` Keyword

If you need to import two distinct classes that share the same short name into the same file, resolve the conflict by renaming one of them locally using the `as` alias modifier.

```php
<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\User as UserModel;
use App\Services\User as UserService;

class SyncController 
{
    public function execute(): void 
    {
        $model = new UserModel();   // Resolves to App\Models\User
        $service = new UserService(); // Resolves to App\Services\User
    }
}

```

---

## 4. Falling Back to the Global Namespace

If a file has a namespace declared at the top, the PHP engine assumes *any* function or class call inside that file belongs to the current local namespace.

To instantiate core PHP classes (like `Exception`, `DateTime`, or `PDO`) from within a namespaced file, you must prefix the class name with a global fallback backslash (`\`), or import it explicitly using `use`.

```php
<?php
declare(strict_types=1);

namespace App\Services;

class TokenService 
{
    public function generate(): string 
    {
        // Anti-Pattern: Looks for App\Services\Exception and crashes
        // throw new Exception("Failed"); 

        // Production-Grade: Leading backslash forces look up in the global engine core
        throw new \Exception("System error occurred.");
    }
}

```