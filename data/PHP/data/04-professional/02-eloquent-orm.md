## Lesson 2: Eloquent ORM

The **Eloquent ORM (Object-Relational Mapping)** is Laravel’s native implementation of the **Active Record design pattern**. In database architecture, an ORM abstracts database tables into programmable PHP classes. Every database table maps directly to a **Model** class, and every individual row inside that table is treated as an active object instance of that class, allowing you to run complex CRUD queries without writing raw SQL strings.

---

## 1. Active Record Architecture Model

Under the Active Record pattern, a model class inherits structural capabilities from a base framework class. This design means that a single model contains both the data properties *and* the database operations (saving, updating, deleting) associated with that data.

### Naming Conventions & Table Mapping

Eloquent relies on strict naming conventions to automate configuration overhead:

* **Table Names:** Lowercase and pluralized (e.g., `users`, `blog_posts`).
* **Model Class Names:** StudlyCaps and singularized (e.g., `User`, `BlogPost`).

If you need to connect a model to a non-standard database table structure, you can explicitly override the table name mapping inside your class definition:

```php
<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /**
     * Explicitly map the model to a custom table name.
     * * Optional: Only required if the table name is not the plural form "orders".
     */
    protected $table = 'customer_transactions';

    /**
     * Explicitly define the custom primary key.
     * * Optional: Only required if your primary key column is not named "id".
     */
    protected $primaryKey = 'transaction_id';
}

```

---

## 2. Mass Assignment Protection: Fillable vs. Guarded

When creating or updating records using user input arrays, you pass data directly into Eloquent methods using **Mass Assignment**.

### The Mass Assignment Vulnerability

If an application accepts all incoming request data blindly, a malicious actor can append unauthorized fields to the HTTP request payload (e.g., injecting `'is_admin' => true`). Eloquent would process this parameter, allowing the user to escalate their system privileges.

### The Security Shield

To eliminate this risk, you must explicitly declare how your model handles bulk inputs using either `$fillable` or `$guarded`. **You must choose only one approach per model.**

```php
class User extends Model
{
    /**
     * The Whitelist Approach ($fillable)
     * Only the specific columns listed here are allowed to be modified via mass assignment.
     */
    protected $fillable = ['username', 'email', 'password'];

    /**
     * The Blacklist Approach ($guarded)
     * Any column listed here is strictly blocked from mass assignment. 
     * An empty array [] means all columns are open to modifications.
     */
    // protected $guarded = ['is_admin', 'balance'];
}

```

---

## 3. Database CRUD Operations via Eloquent

Eloquent translates standard PHP object interactions into optimized, underlying SQL statements automatically.

### Creating Records

```php
// Shorthand Mass Assignment (Safe because fields are filtered by $fillable)
$user = User::create([
    'username' => 'dev_saad',
    'email'    => 'saad@example.com',
    'password' => password_hash('secret123', PASSWORD_ARGON2ID),
]);

```

### Reading and Querying Records

```php
// 1. Primary key lookup (returns a single model instance or null)
$user = User::find(42);

// 2. Querying specific conditions using method chaining
$activeAdmins = User::where('role', 'administrator')
                    ->where('status', 'active')
                    ->orderBy('created_at', 'desc')
                    ->get(); // Retreives the matching collection dataset

```

### Updating Records

```php
// Find the specific active record, mutate its property state, and persist changes
$user = User::findOrFail(42); // Throws a ModelNotFoundException if the ID does not exist
$user->email = 'new_email@example.com';
$user->save(); // Automatically executes an SQL UPDATE statement under the hood

```

### Deleting Records

```php
$user = User::findOrFail(42);
$user->delete(); // Removes the record from the database table

```

---

## 4. Eloquent Relationships (Relational Mapping)

Database tables rarely exist in isolation; they are linked via foreign keys. Eloquent maps these relationships to dynamic properties using simple method definitions.

### One-to-Many Relationship

A single User can author multiple Blog Posts, while each Blog Post belongs to exactly one User.

#### The Parent Model (`app/Models/User.php`)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    public function posts(): HasMany
    {
        // Tells Eloquent that the 'posts' table contains a 'user_id' foreign key pointer
        return $this->hasMany(Post::class);
    }
}

```

#### The Child Model (`app/Models/Post.php`)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

```

#### Querying Relational Connections

Once declared, you can access relational data seamlessly as if they were standard object properties:

```php
$user = User::findOrFail(1);

// Eloquent lazily loads the connected posts array collection on-demand
foreach ($user->posts as $post) {
    echo $post->title;
}

```