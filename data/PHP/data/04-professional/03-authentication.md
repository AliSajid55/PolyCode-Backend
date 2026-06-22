## Lesson 3: Authentication

Authentication is the process of verifying the digital identity of a user attempting to access your application. Out of the box, Laravel provides an incredibly secure infrastructure for handling user sessions, verifying credentials, and protecting endpoints, abstracting away the manual database lookups and session hashing required in vanilla PHP.

---

## 1. The Core Authentication Architecture

Laravel’s authentication engine is driven by two main architectural components: **Guards** and **Providers**. These components are configured within the `config/auth.php` file.

### Guards

Guards define exactly *how* users are authenticated for each incoming request.

* For traditional web interfaces, Laravel uses the `session` guard, which reads credentials from the user's session state and verifies cookies.
* For stateless APIs, Laravel uses token-based guards (such as `token`, Sanctum, or Passport) that look for a cryptographically signed token inside the HTTP `Authorization` header.

### Providers

Providers define exactly *where* the user data is stored and retrieved from. By default, Laravel provides a `users` provider that uses the Eloquent ORM to query your database's `users` table.

---

## 2. Managing the Authentication Lifecycle Manual Controls

While Laravel offers complete, scaffolded authentication starter kits (like Laravel Breeze and Jetstream), you must understand how to manually validate and authenticate user sessions using the `Auth` facade.

### Authenticating a User (Login)

To log a user into your application, pass their raw credentials into the `Auth::attempt()` method. This method automatically retrieves the user using the configured Provider, applies safe timing-attack resistant comparisons via `password_verify()`, and initiates a secure session if the credentials match.

```php
<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class LoginController extends Controller
{
    public function authenticate(Request $request): RedirectResponse
    {
        // 1. Validate the incoming input payload format
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Attempt authentication check and session generation
        // The optional second argument handles the "Remember Me" perpetual cookie token lifecycle
        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            
            // 3. Security Best Practice: Regenerate the session ID to neutralize Session Hijacking
            $request->session()->regenerate();

            // Direct traffic to their intended URL or a default dashboard
            return redirect()->intended('dashboard');
        }

        // Fail early if matching records do not exist
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}

```

### Terminating a User Session (Logout)

When logging out a user, you must completely clear their session markers, flush data from memory, and invalidate their tracking cookie.

```php
public function logout(Request $request): RedirectResponse
{
    // 1. Instruct the framework guard to flush active memory tokens
    Auth::logout();

    // 2. Invalidate the underlying server-side session data store completely
    $request->session()->invalidate();

    // 3. Regenerate the Anti-CSRF token token to keep the browser instance secure
    $request->session()->regenerateToken();

    return redirect('/');
}

```

---

## 3. Retrieving Authenticated User Context

Once a user is successfully logged in, their data model instance is globally accessible across your application's routing lifecycles via the `Auth` facade.

```php
// 1. Retrieve the complete, active Eloquent User Model instance
$user = Auth::user();
echo $user->username;

// 2. Retrieve only the primary key identifier of the authenticated user
$userId = Auth::id();

// 3. Determine if the current client making the request is authenticated
if (Auth::check()) {
    // Client is logged in safely
}

```

---

## 4. Protecting Routes via Middleware

To block unauthenticated guests from accessing secure pages, assign Laravel's native `auth` middleware to your routes or route groups. If an unauthenticated user attempts to hit a route protected by the `auth` middleware, Laravel automatically intercepts the request and redirects them to a named route identifier named `login`.

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AccountController;

// Protect an individual route line
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth');

// Protect an entire block of contextual endpoints cleanly via a Route Group
Route::middleware(['auth'])->group(function () {
    
    Route::get('/account/settings', [AccountController::class, 'edit']);
    Route::post('/account/settings', [AccountController::class, 'update']);
    
});

```