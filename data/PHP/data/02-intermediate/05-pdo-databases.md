## Lesson 5: PDO and Databases

Interacting with relational databases like MySQL or PostgreSQL safely requires an abstraction layer that sits between your PHP code and the database engine. **PDO (PHP Data Objects)** is a database abstraction layer that provides a uniform, object-oriented interface for executing queries, fetching datasets, and mitigating critical security vulnerabilities.

---

## 1. What is PDO and Why Use It?

Historically, PHP developers used the native `mysql` or `mysqli` extensions. These extensions tied the application tightly to a specific database engine. PDO abstracts this process entirely.

### Core Benefits of PDO

* **Database Driver Agility:** PDO utilizes a unified interface. If your backend shifts from MySQL to PostgreSQL, your application query code remains identical; you only change the initial connection string.
* **Native Security via Parameterization:** PDO natively supports **Prepared Statements**, which isolate SQL syntax from incoming user variables, eliminating SQL Injection vulnerabilities.
* **Object-Oriented Data Mapping:** PDO allows you to automatically cast row outputs straight into associative arrays, anonymous objects, or custom domain class structures.

---

## 2. Establishing a Secure Connection (DSN Matrix)

To open a connection, you instantiate a new `PDO` object. This requires a **Data Source Name (DSN)** string containing the driver name, host, database name, port, charset, and authentication credentials.

```php
<?php
declare(strict_types=1);

namespace App\Database;

use PDO;
use PDOException;

class DatabaseConnection 
{
    public static function connect(): PDO 
    {
        // 1. Define the Data Source Configuration details
        $host = '127.0.0.1';
        $db   = 'production_app';
        $user = 'db_user';
        $pass = 'secure_db_password_123';
        $charset = 'utf8mb4'; // Enforces complete Unicode support (including emojis)

        $dsn = "mysql:host={$host};dbname={$db};charset={$charset}";

        // 2. Set runtime driver behavior parameters
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Forces database errors to throw catchable PDOExceptions
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Sets array fetch arrays to default to associative maps
            PDO::ATTR_EMULATE_PREPARES   => false,                  // Disables artificial emulation, forcing native database engines to process prepared statements
        ];

        try {
            // 3. Establish and return the live connection handle object
            return new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            // Production Note: Log the exact message internally, but output a clean generic error to the screen
            error_log("Database Connection Failure: " . $e->getMessage());
            throw new PDOException("Database system connection failure.", (int)$e->getCode());
        }
    }
}

```

---

## 3. Mitigating SQL Injection with Prepared Statements

An **SQL Injection (SQLi)** attack occurs when an untrusted user input variable is directly concatenated into a raw SQL query string. This allows malicious data to alter the structural logic of the database query execution.

### The Vulnerable Anti-Pattern (Never Do This)

```php
// If $userInput is: 1 OR 1=1, the database deletes ALL rows
$userInput = $_POST['id'];
$pdo->query("DELETE FROM users WHERE id = " . $userInput);

```

### The Production-Grade Shield: Prepared Statements

Prepared statements separate the query structure from the data parameters. First, the server compiles the SQL template containing anonymous parameter placeholders (`?` or named parameters like `:id`). Then, the variables are sent separately and treated strictly as data literals, never as executable code.

### Executing Queries Safely with Named Placeholders

```php
<?php
declare(strict_types=1);

$pdo = \App\Database\DatabaseConnection::connect();

// 1. Prepare the compilation template string with named placeholders
$sql = "SELECT id, username, email FROM users WHERE role = :role AND status = :status";
$statement = $pdo->prepare($sql);

// 2. Map input variables to placeholders and execute the statement securely
$statement->execute([
    'role'   => 'administrator',
    'status' => 'active'
]);

// 3. Fetch data out of the compiled result stream
$admins = $statement->fetchAll();

foreach ($admins as $admin) {
    echo "Admin Name: " . htmlspecialchars($admin['username'], ENT_QUOTES, 'UTF-8') . PHP_EOL;
}

```

---

## 4. Database Mutations and Transactions

When executing data modification queries (`INSERT`, `UPDATE`, `DELETE`), you must keep track of affected rows and bundle multi-query operations together to protect data integrity.

### Data Insertion Pipeline

```php
$sql = "INSERT INTO logs (user_id, event, created_at) VALUES (:user_id, :event, :created_at)";
$statement = $pdo->prepare($sql);

$statement->execute([
    'user_id'    => 42,
    'event'      => 'user_login_success',
    'created_at' => date('Y-m-d H:i:s')
]);

// Retrieve the unique primary key generated by the insert statement execution
$newLogId = $pdo->lastInsertId();

```

### Atomicity Management via Transactions

A **Transaction** groups multiple database mutations into a single, atomic unit of work. If any single statement inside the group fails, the entire transaction is rolled back, preventing partial or corrupted data updates.

```php
<?php
declare(strict_types=1);

try {
    // Begin transaction isolation boundary
    $pdo->beginTransaction();

    // Query Step 1: Deduct balance from sender account
    $deduct = $pdo->prepare("UPDATE accounts SET balance = balance - :amount WHERE id = :id");
    $deduct->execute(['amount' => 250.00, 'id' => 1]);

    // Query Step 2: Add balance to receiver account
    $credit = $pdo->prepare("UPDATE accounts SET balance = balance + :amount WHERE id = :id");
    $credit->execute(['amount' => 250.00, 'id' => 2]);

    // Commit changes safely to the storage layer permanently
    $pdo->commit();
    
} catch (\Exception $e) {
    // If anything fails anywhere inside the boundary, revert ALL operations instantly
    $pdo->rollBack();
    error_log("Transaction failed and was completely reverted: " . $e->getMessage());
}

```