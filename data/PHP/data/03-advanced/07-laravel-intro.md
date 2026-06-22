## Lesson 7: Introduction to Laravel

When building modern, enterprise-grade applications, writing everything in raw PHP (Vanilla PHP) leads to recreating the wheel for every project. You have to write custom routing engines, database wrappers, authentication layers, and security filters manually. **Laravel** is an open-source, web application framework that provides an elegant, expressive syntax to automate these common tasks, allowing you to focus entirely on building your application's core business logic.

---

## 1. Why Laravel Dominates the PHP Ecosystem

Laravel has become the de facto standard framework for enterprise PHP development because it takes the complexity out of backend architecture while enforcing clean design patterns out of the box.

### Core Architecture Capabilities

* **Expressive MVC Architecture:** Laravel provides a clean implementation of the Model-View-Controller pattern, segregating data logic from the presentation layers.
* **The Eloquent ORM:** An advanced Active Record implementation that allows you to interact with your database using natural PHP syntax instead of writing raw SQL strings.
* **Robust Dependency Injection:** Features a powerful Inversion of Control (IoC) Service Container that automatically manages class dependencies across your entire application lifecycle.
* **Integrated Security:** Includes built-in defenses against SQL Injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF) automatically.

---

## 2. Directory Structure Blueprint

A fresh Laravel installation isolates code artifacts into specific, dedicated directories to maintain a strict separation of concerns.

```text
├── app/
│   ├── Http/
│   │   ├── Controllers/    <-- Handles incoming HTTP request logic
│   │   └── Middleware/     <-- HTTP request filters (Auth, CSRF, etc.)
│   └── Models/             <-- Eloquent Database Models (Data Layer)
├── config/                 <-- Universal application configuration files
├── database/
│   ├── migrations/         <-- Database schema version control state
│   └── seeders/            <-- Database dummy data population engines
├── public/                 <-- Web server entry point (index.php and assets)
├── resources/
│   └── views/              <-- Presentation template files (Blade templates)
└── routes/
    └── web.php             <-- Web request routing mapping file

```

---

## 3. The Core Laravel Request Lifecycle

To write optimized code in Laravel, you must understand exactly how a request travels through the framework from the moment a user hits a URL to the moment the response is rendered.

1. **The Entry Point (`public/index.php`):** All requests are directed here by your web server (Nginx/Apache). This script loads the Composer autoloader and retrieves an instance of the Laravel application.
2. **The HTTP/Console Kernels:** The request is passed into the HTTP Kernel. The Kernel configures error handling, boots environmental setups, and runs a baseline stack of **Middleware** (handling session persistence, CSRF checks, and maintenance modes).
3. **Service Providers Bootstrapping:** The Kernel boots the application's **Service Providers**. These are the central configuration hubs for the entire framework. They instantiate and configure components like the database, queue workers, routing, and validation engines.
4. **The Router:** Once bootstrapped, the request is passed to the Router. The Router matches the incoming URL to a defined route path, executes any route-specific middleware (e.g., forcing authentication), and directs the request to the matching **Controller**.
5. **The Controller & Response:** The Controller executes your specific business logic, pulls data via an Eloquent Model, and returns a View or a JSON response back through the middleware chain to the client's browser.

---

## 4. Writing Your First Route and Controller

Let's look at how easily Laravel maps an incoming web request to a controller to output a response.

### Step 1: Define the Web Route (`routes/web.php`)

Instead of parsing URLs manually, you define clean paths using the static `Route` facade.

```php
<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Maps a GET request on '/user/{id}' straight to the 'show' method inside UserController
Route::get('/user/{id}', [UserController::class, 'show']);

```

### Step 2: Create the Controller (`app/Http/Controllers/UserController.php`)

You can generate this class automatically using Laravel's command-line tool (`php artisan make:controller UserController`).

```php
<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * Handle the incoming request.
     * * Laravel automatically injects the dynamic '{id}' parameter into this method variable.
     */
    public function show(int $id): View
    {
        // 1. Fetch data utilizing the Eloquent ORM. 
        // Throws an automatic 404 error if the user record doesn't exist.
        $user = User::findOrFail($id);

        // 2. Pass the data directly into a Blade view template
        return view('user.profile', [
            'user' => $user
        ]);
    }
}

```