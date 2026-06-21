# Lesson 1: Building Web APIs

When building modern client-server architectures, the backend application rarely renders standard HTML pages directly. Instead, it acts as a centralized data engine that exposes endpoints over HTTP. These endpoints process incoming requests and return structured data (typically JSON). This architecture is a **Web API** (Application Programming Interface).

Frontend frameworks (like React, Angular, or Vue), mobile apps, and external third-party microservices all consume Web APIs to dynamically fetch and submit data.

---

## 1. RESTful API Architecture

Most modern Web APIs follow the principles of **REST** (Representational State Transfer). A RESTful API relies on standard **HTTP Methods** (Verbs) to map actions to specific URLs (Endpoints).

| HTTP Method | API Action | SQL/CRUD Equivalent | Safe / Idempotent |
| --- | --- | --- | --- |
| **`GET`** | Retrieve an existing resource or collection. | Read | Yes / Yes |
| **`POST`** | Create a brand-new resource. | Create | No / No |
| **`PUT`** | Update an existing resource completely (or replace it). | Update | No / Yes |
| **`DELETE`** | Remove a specific resource. | Delete | No / Yes |

* **Safe:** The request does not modify the underlying database state (e.g., viewing a product page).
* **Idempotent:** Making the exact same request multiple times sequentially yields identical results without side effects (e.g., deleting an object once vs. ten times).

---

## 2. API Structure: Controllers vs. Minimal APIs

ASP.NET Core provides two different approaches to building API endpoints: **Controllers** (traditional, class-based, highly structured) and **Minimal APIs** (modern, lightweight, streamlined design).

### The Minimal API Approach

Ideal for lightweight microservices or small applications where you want to keep routing layout compact:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Defining a fast GET endpoint returning a direct string array
app.MapGet("/api/status", () => new string[] { "Online", "Healthy" });

app.Run();

```

### The Controller-Based Approach

Ideal for large enterprise applications where you want to partition distinct modules cleanly into separate architectural files:

```csharp
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

// 1. Marks this class as an API entry point with automatic model validation and routing capabilities
[ApiController]
[Route("api/[controller]")] // Maps to: api/products
public class ProductsController : ControllerBase
{
    // A mock local collection simulating data storage
    private static readonly List<string> Items = new List<string> { "Keyboard", "Monitor" };

    // 2. Handles GET requests sent to: api/products
    [HttpGet]
    public ActionResult<IEnumerable<string>> GetAllProducts()
    {
        return Ok(Items); // Returns an HTTP 200 OK status containing the raw list
    }

    // 3. Handles POST requests sent to: api/products
    [HttpPost]
    public IActionResult AddProduct([FromBody] string newProduct)
    {
        if (string.IsNullOrWhiteSpace(newProduct))
        {
            return BadRequest("Product name cannot be empty."); // HTTP 400 Bad Request
        }

        Items.Add(newProduct);
        return StatusCode(201); // HTTP 201 Created status successfully generated
    }
}

```

---

## 3. Standard HTTP Status Codes

When an API processes an incoming request, it communicates the absolute outcome back to the client using structured **HTTP Status Codes**. Your API should always return accurate codes so client applications can handle the results correctly.

* **2xx Success:**
* `200 OK`: Request succeeded, data is attached in the response body.
* `201 Created`: Post request succeeded, a new item was successfully generated.


* **4xx Client Errors (The client sent bad data):**
* `400 Bad Request`: The input data failed validation checks or text formatting layout rules.
* `401 Unauthorized`: Authentication credentials are completely missing or invalid.
* `403 Forbidden`: Authentication succeeded, but user doesn't possess permissions to view or touch this specific data.
* `404 Not Found`: The requested URL path or unique resource ID does not exist in the system.


* **5xx Server Errors (The backend code crashed):**
* `500 Internal Server Error`: An unanticipated exception occurred inside the server code block.



---

## 4. Content Negotiation and Data Transfer Objects (DTOs)

### Content Negotiation

By default, modern ASP.NET Core APIs serialize C# objects automatically into **JSON** formatting layouts. When a client application submits a request, it can specify its preference via the HTTP `Accept` header (e.g., `Accept: application/json`), and the API transforms the model objects to match automatically.

### Data Transfer Objects (DTOs)

You should rarely expose your raw internal database entity classes directly to web clients. If your database table contains sensitive metadata fields (like password signatures, internal access logs, or administrative flags), exposing the object directly can introduce major security breaches.

Instead, create lightweight structural container classes called **Data Transfer Objects (DTOs)** containing only the precise fields safe to travel over the open web network.

```csharp
// Production Database Entity
public class UserAccount
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string EmailAddress { get; set; }
    public string PasswordHash { get; set; } // CRITICAL: Never send this over the network!
    public DateTime CreatedTimestamp { get; set; }
}

// Light Outbound Data Transfer Object
public class UserResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string EmailAddress { get; set; }
}

```

---

## 5. Securing Web APIs with CORS

When a web application built in JavaScript running on one domain (e.g., `https://myfrontend.com`) attempts to trigger an asynchronous fetch request to an API running on a completely different domain (e.g., `https://myapi.com`), modern web browsers automatically block the request for safety reasons. This browser safety rule is called **Same-Origin Policy**.

To grant explicit permission for safe cross-origin requests, you must configure **CORS (Cross-Origin Resource Sharing)** rules inside the API's middleware container pipeline.

```csharp
// Inside Program.cs, before builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
    {
        policy.WithOrigins("https://myfrontend.com") // Target safe domain link
              .WithMethods("GET", "POST")            // Restrict accessible actions
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Wire up CORS directly before final routing evaluation
app.UseCors("AllowFrontendApp");
app.MapControllers();

```