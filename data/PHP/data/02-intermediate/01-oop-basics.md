## Lesson 1: OOP Basics

Object-Oriented Programming (OOP) is a programming paradigm that structures software design around data, or **objects**, rather than functions and logic. In production-grade PHP, OOP allows you to build modular, extensible, and maintainable backends by binding data and behavior into cohesive units.

---

## 1. Classes and Objects: The Blueprint and the Instance

To understand OOP, you must differentiate between a class and an object.

* **Class:** A user-defined blueprint, template, or data structure. It defines the properties (data) and methods (behavior) that all objects created from it will possess.
* **Object:** A concrete instance of a class instantiated in memory. Each object has its own distinct state, though it shares the structural capabilities of its parent class.

```
[ Class: User Blueprint ] ---> Instantiation (new) ---> [ Object 1: Saad's Data ]
                                                   ---> [ Object 2: Asim's Data ]

```

---

## 2. Defining Properties, Methods, and Visibilities

Properties are variables bound inside a class, while methods are functions belonging to the class. Access to these internal structures is tightly managed using **Visibility Modifiers** to enforce encapsulation.

### The Three Visibility Modifiers

* **`public`**: The property or method can be accessed from anywhere—inside the class, by inherited classes, or externally from the global application scope.
* **`protected`**: Access is restricted. The property or method can *only* be accessed within the class itself or by subclasses that inherit from it.
* **`private`**: Strict isolation. The property or method can *only* be accessed within the exact class that defined it. Subclasses cannot access it.

### Code Implementation

```php
<?php
declare(strict_types=1);

class UserAccount 
{
    // Properties with explicit types and visibility
    public string $username;
    protected string $email;
    private string $passwordHash;

    // A public method to modify a private property safely
    public function setPassword(string $rawPassword): void 
    {
        // Enforce business logic rules internally before mutating state
        if (strlen($rawPassword) < 8) {
            throw new InvalidArgumentException("Password must be at least 8 characters.");
        }
        $this->passwordHash = password_hash($rawPassword, PASSWORD_ARGON2ID);
    }
}

```

---

## 3. Object Instantiation and the `$this` Pseudo-Variable

To create a live instance of a class, use the `new` keyword. Once instantiated, use the object operator (`->`) to access its public properties or invoke its methods.

Inside a class method, the special pseudo-variable `$this` acts as a direct pointer to the current, specific object instance executing the code.

```php
// 1. Instantiate an object instance in memory
$account = new UserAccount();

// 2. Assign values to public properties
$account->username = "dev_saad";

// 3. Invoke public methods to modify protected or private state safely
$account->setPassword("super_secure_password_123");

```

---

## 4. Object Lifetime: Constructors and Destructors

PHP provides specialized **Magic Methods** that intercept an object's lifecycle events. The two most common are `__construct()` and `__destruct()`.

### The Constructor (`__construct`)

Invoked automatically the exact moment an object is instantiated using `new`. It is primarily used to pass dependencies or initialize required internal state properties.

### The Destructor (`__destruct`)

Invoked automatically when there are no remaining references to the object instance in memory, or during the structural shutdown phase of the PHP script execution lifecycle. It is used to perform cleanups, close active database connections, or flush buffers.

### Production-Grade Implementation (PHP 8.0+ Constructor Property Promotion)

Modern PHP allows you to declare visibility, data types, and property initialization directly inside the constructor signature, cutting down boilerplate code drastically.

```php
<?php
declare(strict_types=1);

class DatabaseLogger 
{
    private $fileHandle;

    // Modern Constructor Property Promotion handles property declaration and assignment in one step
    public function __construct(
        public string $logFile,
        protected string $environment = 'production'
    ) {
        // Run manual setup side-effects safely
        $this->fileHandle = fopen($this->logFile, 'a');
    }

    public function log(string $message): void 
    {
        fwrite($this->fileHandle, "[{$this->environment}] " . $message . PHP_EOL);
    }

    // Destructor ensures resources clean up after execution finishes
    public function __destruct() 
    {
        if (is_resource($this->fileHandle)) {
            fclose($this->fileHandle);
        }
    }
}

// Usage
$logger = new DatabaseLogger('/var/log/app.log', 'development');
$logger->log("OOP system initialized successfully.");
// Object goes out of scope here; __destruct() triggers automatically.

```