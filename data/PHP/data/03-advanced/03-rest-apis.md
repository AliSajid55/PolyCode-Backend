## Lesson 3: REST APIs

A **RESTful API (Representational State Transfer Application Programming Interface)** is an architectural style that allows decoupled systems to communicate over HTTP. In modern web development, PHP backend APIs process structural data requests from separate client frontends (such as React, Vue, or mobile applications) by exchanging stateless JSON payloads rather than server-rendered HTML.

---

## 1. Core Architectural Constraints of REST

To classify an API layer as truly RESTful, it must adhere to specific structural rules:

* **Statelessness:** Every single incoming HTTP request must contain all the contextual data and authentication tokens necessary to understand and process it. The server stores no session state about the client context in memory between requests.
* **Client-Server Decoupling:** The client interface and the server data storage layer are completely independent. The client doesn't care how data is stored, and the server doesn't care how data is rendered.
* **Uniform Interface:** Resources are identified uniformly via clear URLs, and actions are determined strictly by standardized HTTP verbs.

---

## 2. HTTP Verbs and Response Status Codes

REST maps data operations directly to standardized HTTP verbs, transforming a backend system into a clean CRUD engine.

### Restful Mapping Protocol

| HTTP Verb | Resource URI Pattern | DB Action (CRUD) | Idempotent? | Success Status |
| --- | --- | --- | --- | --- |
| **`GET`** | `/api/v1/users` | Read (Collection) | Yes | `200 OK` |
| **`GET`** | `/api/v1/users/42` | Read (Single Item) | Yes | `200 OK` |
| **`POST`** | `/api/v1/users` | Create | No | `201 Created` |
| **`PUT`** | `/api/v1/users/42` | Update (Replace) | Yes | `200 OK` |
| **`DELETE`** | `/api/v1/users/42` | Delete | Yes | `204 No Content` |

> **Idempotency Note:** An operation is idempotent if executing it multiple times yields the exact same system state change as running it once. Sending a `DELETE` request twice will result in the resource remaining deleted, whereas sending a `POST` request twice will generate two separate duplicate resources in your database.

---

## 3. Building a Production-Grade JSON Endpoint

When constructing a dedicated API endpoint in PHP, you must override default HTML browser routing by modifying HTTP headers to explicitly serve structured JSON payloads.

Here is a secure, object-oriented API controller designed to handle resource requests:

```php
<?php
declare(strict_types=1);

namespace App\Api\Controllers;

use PDO;
use Exception;

class UserApiController 
{
    public function __construct(private PDO $pdo) {}

    public function handleRequest(): void 
    {
        // 1. Enforce global JSON API compliance headers
        header('Content-Type: application/json; charset=UTF-8');
        header('Access-Control-Allow-Origin: *'); // Configure properly for production CORS bounds
        header('Access-Control-Allow-Methods: GET, POST');

        try {
            $method = $_SERVER['REQUEST_METHOD'];

            match ($method) {
                'GET'  => $this->getUserCollection(),
                'POST' => $this->createUserItem(),
                default => $this->respondWithError(415, "Unsupported HTTP execution method.")
            };

        } catch (Exception $e) {
            error_log("API Failure Trace: " . $e->getMessage());
            $this->respondWithError(500, "Internal server processing failure.");
        }
    }

    private function getUserCollection(): void 
    {
        $stmt = $this->pdo->query("SELECT id, username, email FROM users LIMIT 50");
        $users = $stmt->fetchAll();

        // Send a successful JSON array payload back across the wire
        http_response_code(200);
        echo json_encode(['status' => 'success', 'data' => $users]);
    }

    private function createUserItem(): void 
    {
        // Capture and decode the raw incoming JSON stream payload from the request body
        $rawPayload = file_get_contents('php://input');
        $data = json_decode($rawPayload, true);

        // Validate structure properties cleanly
        if (empty($data['username']) || !filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
            $this->respondWithError(400, "Malformed data fields or invalid structural payload syntax.");
            return;
        }

        $stmt = $this->pdo->prepare("INSERT INTO users (username, email) VALUES (:username, :email)");
        $stmt->execute([
            'username' => trim($data['username']),
            'email'    => $data['email']
        ]);

        http_response_code(201);
        echo json_encode([
            'status' => 'created',
            'id' => $this->pdo->lastInsertId()
        ]);
    }

    private function respondWithError(int $statusCode, string $errorMessage): void 
    {
        http_response_code($statusCode);
        echo json_encode([
            'status' => 'error',
            'error' => [
                'code' => $statusCode,
                'message' => $errorMessage
            ]
        ]);
    }
}

```

---

## 4. Key Implementation Rules for APIs

* **`file_get_contents('php://input')`**: Unlike standard forms that populate the `$_POST` array automatically, structured payloads sent via frontend clients (like AXIOS or Fetch using JSON formats) must be read directly from the raw input stream buffer of the request body.
* **`json_encode()` / `json_decode()**`: Always handle serialization mapping explicitly. When calling `json_decode()`, passing `true` as the second argument forces the object parser to convert elements straight into a predictable associative array structure.
* **`http_response_code()`**: Never leave your API to respond with a generic `200` status code if an error occurs. Express state boundaries using explicit HTTP semantic codes so connecting clients can intercept network conditions correctly.