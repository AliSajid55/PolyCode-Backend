## Lesson 9: Strings

In PHP, a string is an ordered sequence of bytes where each character maps to a single byte. Because PHP does not natively track character encoding at the engine level (it leaves character mapping like UTF-8 to multibyte extensions), understanding how strings are declared, concatenated, and manipulated is vital for parsing text without data corruption.

---

## 1. String Declaration Declarations

PHP supports four distinct syntax paradigms for declaring string literals. Choosing the correct wrapper changes how the engine interprets variables and escape sequences inside the text.

### Single-Quoted Strings (`'`)

The simplest method. Characters are treated as literal text. Variables and standard escape sequences (like `\n`) **will not** expand.

```php
<?php
declare(strict_types=1);

$framework = 'Laravel';
echo 'Running on $framework\n'; 
// Outputs literally: Running on $framework\n

```

### Double-Quoted Strings (`"`)

Enables parsing automation. The engine performs **Variable Interpolation** (expanding variable names into their underlying values) and translates escape sequences into special characters.

```php
echo "Running on $framework\n"; 
// Outputs: Running on Laravel (followed by a newline character)

```

### Heredoc Syntax (`<<<`)

Acts exactly like a double-quoted string but allows you to isolate large, multi-line blocks of text, HTML templates, or SQL queries cleanly without messy quote escaping.

```php
$userId = 42;

// The identifier (SQL) can be any alphanumeric marker
$query = <<<SQL
SELECT * FROM users 
WHERE id = $userId 
LIMIT 1;
SQL;

```

### Nowdoc Syntax (`<<<'`)

Acts exactly like a single-quoted string, preserving multi-line blocks of raw text or code without performing any variable parsing or interpretation.

```php
$template = <<<'HTML'
<div class="alert">
    <p>Variables like $username will remain raw text here.</p>
</div>
HTML;

```

---

## 2. Advanced Variable Interpolation

When using double-quoted strings or Heredocs, complex variables (like array keys or object properties) can confuse the parser if adjacent to normal text. Use **Complex Curly Braces Syntax** (`{$variable}`) to explicitly define boundaries for the interpolation engine.

```php
$user = [
    'name' => 'Saad',
    'meta' => ['role' => 'Engineer']
];

// Anti-Pattern: Will cause a parsing error
// echo "Welcome back $user['name']"; 

// Production-Grade: Explicit interpolation boundaries
echo "Welcome back {$user['name']}. Your role is {$user['meta']['role']}.";

```

---

## 3. String Manipulation & Concatenation

PHP uses the dot operator (`.`) for concatenation, differentiating it from languages that use the plus operator (`+`).

```php
$firstName = "John";
$lastName = "Doe";

// Concatenation
$fullName = $firstName . ' ' . $lastName;

// Concatenating assignment
$fullName .= " MD"; // $fullName is now "John Doe MD"

```

### Direct Memory Byte Access

You can inspect or modify a string character-by-character using array-like offset brackets `[]`.

```php
$str = "PHP8";
echo $str[0]; // Outputs: P

$str[3] = "9"; 
echo $str;    // Outputs: PHP9

```

---

## 4. Multibyte Processing and Performance Functions

Because native string functions (like `strlen()`) count the number of **bytes** rather than characters, passing a multi-byte Unicode character (like an emoji or special character) will yield an incorrect length computation. Always use the **Multibyte (`mb_`)** extension functions when working with internationalized text streams.

| Operation | Standard Function (Byte-Based) | Multibyte Function (Character-Based) |
| --- | --- | --- |
| **Length Count** | `strlen("München")` // Returns **8** | `mb_strlen("München", "UTF-8")` // Returns **7** |
| **Sub-string Extraction** | `substr($str, 0, 3)` | `mb_substr($str, 0, 3, "UTF-8")` |
| **Case Conversion** | `strtolower($str)` | `mb_strtolower($str, "UTF-8")` |

### Common Production Text Tools

```php
$rawInput = "   /api/v1/users/   ";

// 1. Sanitize whitespace and trailing slashes
$cleaned = trim($rawInput, " /"); // Result: "api/v1/users"

// 2. Splitting a string into a structured array
$payload = "item1,item2,item3";
$items = explode(",", $payload); // Result: ['item1', 'item2', 'item3']

// 3. Joining an array back into a flat string
$csvLine = implode(",", $items); // Result: "item1,item2,item3"

```