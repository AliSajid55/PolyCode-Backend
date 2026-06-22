## Lesson 4: PHPUnit Testing

Writing production-grade code requires verification. You cannot rely on manual browser clicks or terminal dumps to ensure your application behaves correctly. **PHPUnit** is the de facto standard testing framework for PHP. It allows you to write automated Unit Tests to verify individual components in complete isolation, guaranteeing that future code refactors do not break existing business logic.

---

## 1. Automated Testing Methodologies

Before writing test assertions, you must understand the distinction between testing scopes:

* **Unit Testing:** Testing the smallest testable unit of code (typically a single method within a class) in absolute isolation. Any external dependencies, such as database handlers or network clients, are simulated or "mocked" so that the test focuses strictly on internal logical transformations.
* **Integration Testing:** Verifying that multiple modular components or architectural layers behave correctly when interacting with each other (e.g., testing that a Service Layer correctly mutates state inside a live test database).

---

## 2. Setting Up PHPUnit via Composer

PHPUnit is managed completely as a development dependency within your environment suite.

### Step 1: Installation

Run the following command in your terminal to append the package to your `composer.json` file's development array:

```bash
composer require --dev phpunit/phpunit

```

### Step 2: Configuration Framework (`phpunit.xml`)

Create a `phpunit.xml` configuration file in your project root directory. This tells the testing engine where to find your test suites and how to format execution reports.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/10.0/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Application Unit Test Suite">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
</phpunit>

```

---

## 3. Writing Your First Unit Test Case

To write a test case, create a class that extends **`PHPUnit\Framework\TestCase`**.

By convention, your test folder structure should mirror your source directory, and test files must be postfixed with `Test.php` (e.g., `OrderProcessorTest.php`). Individual test methods inside the class must either begin with the prefix `test` or carry the `/ @test */` annotation marker.

### The Source Component (`src/OrderProcessor.php`)

```php
<?php
declare(strict_types=1);

namespace App;

class OrderProcessor 
{
    public function calculateFinalTotal(float $subtotal, float $taxRate, float $discount = 0.0): float 
    {
        if ($subtotal < 0 || $taxRate < 0 || $discount < 0) {
            throw new \InvalidArgumentException("Financial parameters cannot be negative.");
        }

        $taxAmount = $subtotal * $taxRate;
        return ($subtotal + $taxAmount) - $discount;
    }
}

```

### The Isolated Test Wrapper (`tests/OrderProcessorTest.php`)

```php
<?php
declare(strict_types=1);

namespace Tests;

use PHPUnit\Framework\TestCase;
use App\OrderProcessor;
use InvalidArgumentException;

class OrderProcessorTest extends TestCase 
{
    // The AAA Pattern: Arrange, Act, Assert
    public function testCalculatesTotalCorrectlyWithTaxAndDiscount(): void 
    {
        // 1. Arrange: Setup the environment state components
        $processor = new OrderProcessor();

        // 2. Act: Execute the target method execution thread
        $result = $processor->calculateFinalTotal(100.00, 0.15, 10.00);

        // 3. Assert: Verify the resulting value matches expectations
        $this->assertEquals(105.00, $result);
    }

    public function testThrowsExceptionWhenNegativeSubtotalIsPassed(): void 
    {
        $processor = new OrderProcessor();

        // Inform the engine to expect a specific exception breakout ahead of time
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage("Financial parameters cannot be negative.");

        // This execution line must trigger the expected exception handler
        $processor->calculateFinalTotal(-50.00, 0.15);
    }
}

```

---

## 4. The AAA Architecture and Core Assertions

Every robust unit test follows the structural **AAA Pattern**:

1. **Arrange:** Initialize objects, declare variables, and prepare the code state.
2. **Act:** Invoke the specific method being tested.
3. **Assert:** Compare the actual output against the expected results using PHPUnit's native assertions matrix.

### Common Assertions Matrix

| Assertion Syntax Method | Target Validation Criteria |
| --- | --- |
| **`$this->assertEquals($expected, $actual)`** | Asserts that two variables evaluate to the same structural value (`==`). |
| **`$this->assertSame($expected, $actual)`** | Asserts that two variables have identical types and values (`===`). |
| **`$this->assertTrue($variable)`** | Asserts that the passed condition evaluates explicitly to a boolean `true`. |
| **`$this->assertCount($expectedCount, $array)`** | Asserts that the size matches the exact count of elements in the collection array. |
| **`$this->assertInstanceOf($ExpectedClass, $object)`** | Asserts that an object is an instance of a specified class or interface blueprint. |

---

## 5. Executing the Test Engine

To run your automated suite, invoke the vendor binary directly from your terminal console path:

```bash
./vendor/bin/phpunit

```

If everything is aligned, the engine reads your XML file, runs the test suites, and outputs a clean green verification report confirming all assertions passed successfully.