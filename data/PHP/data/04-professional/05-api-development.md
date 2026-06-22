## Lesson 5: API Development in Laravel

Modern web architectures often separate the backend data layer from the client interface. Laravel serves as a powerful engine for building RESTful APIs, allowing you to return structured JSON payloads to frontends like React, Vue, or mobile applications instead of rendering server-side Blade templates.

---

## 1. The API Routing Layer

API routes are defined in the `routes/api.php` file. Routes registered here are nested under a global `api` middleware group automatically.

### API Route Features

* **Automatic Prefixing:** Every path is prefixed with `/api/` by default (e.g., `routes/api.php` defining `/users` maps to the physical URL `yourdomain.com/api/users`).
* **Stateless by Design:** These routes completely bypass session cookies, CSRF protection middleware, and web state management, making them lightweight and scale-ready.

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectApiController;

// Public read collection endpoint
Route::get('/projects', [ProjectApiController::class, 'index']);

// Protected write/mutation endpoints grouped together
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/projects', [ProjectApiController::class, 'store']);
    Route::delete('/projects/{id}', [ProjectApiController::class, 'destroy']);
});

```

---

## 2. API Controllers and JSON Serialization

When building an API controller, avoid formatting JSON strings manually or using `echo`. Instead, return arrays, collections, or Eloquent models directly from your controller methods. Laravel automatically intercepts the output and serializes it into a structurally sound JSON response payload with matching HTTP headers.

```php
<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $projects = Project::orderBy('created_at', 'desc')->get();

        // Returns a status 200 OK along with 'Content-Type: application/json' automatically
        return response()->json([
            'status' => 'success',
            'data' => $projects
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Validate incoming payload elements
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ]);

        // Create via mass assignment
        $project = Project::create($validated);

        // Explicitly return a 201 Created semantic code for successful generation paths
        return response()->json([
            'status' => 'created',
            'data' => $project
        ], 201);
    }
}

```

---

## 3. Data Transformation Architecture: API Resources

Returning raw Eloquent models directly to a client is risky in production. If you add a sensitive field to your database table (like `internal_notes` or `api_key`), the raw model output will automatically leak that data to your API payload.

Laravel solves this using **Eloquent API Resources**. They act as a specialized transformation layer, sitting directly between your Eloquent models and the final JSON response transmitted over the wire.

### Step 1: Generate the Resource Classifier

Execute this Artisan command in your terminal to create a transform module:

```bash
php artisan make:resource ProjectResource

```

### Step 2: Define the Data White-list Map (`app/Http/Resources/ProjectResource.php`)

Inside the resource class, use the `toArray()` method to explicitly outline exactly which fields are exposed and how they are structured.

```php
<?php
declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array structure.
     * * $this points directly to the underlying Eloquent Model instance properties automatically.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_title' => $this->title,
            'summary' => $this->description,
            'is_featured' => (bool)$this->is_featured,
            'timestamps' => [
                'published_at' => $this->created_at->toIso8601String(),
            ]
        ];
    }
}

```

### Step 3: Consume the Resource in the Controller

```php
use App\Http\Resources\ProjectResource;

public function show(int $id): ProjectResource
{
    $project = Project::findOrFail($id);

    // Wraps the model output precisely inside the structured format rules of ProjectResource
    return new ProjectResource($project);
}

```

---

## 4. API Authentication via Laravel Sanctum

Because API operations skip traditional cookie-based session stores, you must protect endpoints using token validation systems. **Laravel Sanctum** provides a featherweight, secure authentication system designed specifically for SPAs (Single Page Applications) and mobile APIs.

### The Sanctum Token Pipeline

1. A client application hits a login endpoint passing raw credentials.
2. The server verifies the credentials and generates a cryptographically signed plain-text string called a **Personal Access Token**.
3. The client stores this string locally (e.g., in secure memory or local storage).
4. For all subsequent data requests, the client injects this string into the HTTP request header as a Bearer token:
```text
Authorization: Bearer 3|qTx90210...

```


5. Sanctum intercepts the incoming header, hashes the incoming string, matches it against its internal token database, and reconstructs the authenticated user context securely.