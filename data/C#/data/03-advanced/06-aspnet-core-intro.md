# Lesson 6: ASP.NET Core Introduction

When building modern software ecosystems, you need a way to serve web pages, handle browser requests, process forms, or expose APIs that mobile apps and frontend frameworks (like React or Angular) can talk to. **ASP.NET Core** is Microsoft’s modern, open-source, high-performance web framework designed exactly for this purpose.

It is completely cross-platform, allowing you to develop and deploy web applications natively across Windows, macOS, and Linux.

---

## 1. The Architecture of a Web Request

ASP.NET Core applications primarily run as a console application behind the scenes that boots up a lightweight, highly optimized web server called **Kestrel**.

When a user typed a URL into a browser or a mobile app triggers an API request, the data travels over the network to your server. Here is the high-level path it takes:

```
[ Client Browser / App ] 
          │
          ▼ (HTTP Request)
┌────────────────────────────────────────┐
│           ASP.NET Core Engine          │
│                                        │
│  [ Kestrel Web Server ]                │
│             │                          │
│             ▼                          │
│  [ Middleware Pipeline ] (Auth, Log)   │
│             │                          │
│             ▼                          │
│  [ Routing / Controller ] (Your Code)  │
└────────────────────────────────────────┘

```

1. **Kestrel Server:** Intercepts the raw HTTP request packet from the network.
2. **Middleware Pipeline:** Processes the request through a series of sequential software components (checking security permissions, logging details, compressing text).
3. **Routing & Execution:** Directs the request to your actual C# code (a Controller or Minimal API endpoint) to query a database and send a response back.

---

## 2. Setting Up an ASP.NET Core Web App

The entry point of a modern ASP.NET Core application relies on the `Program.cs` file to initialize the web host and configure services.

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

// 1. Create a builder instance to configure application services
var builder = WebApplication.CreateBuilder(args);

// Add application services here (e.g., builder.Services.AddControllers())

// 2. Build the application host pipeline
var app = builder.Build();

// 3. Define a simple web endpoint (Minimal API)
app.MapGet("/", () => "Welcome to an ASP.NET Core Web Service!");

// 4. Start the Kestrel server to listen for incoming web requests
app.Run();

```

---

## 3. Understanding Dependency Injection (DI)

ASP.NET Core features built-in, native support for **Dependency Injection (DI)**. DI is a design pattern that passes dependent objects into a class rather than forcing the class to instantiate them manually using `new`. This makes your web layers incredibly loose, modular, and easy to unit test.

You register your application dependencies inside `Program.cs`, and the framework automatically supplies them to your classes via their constructors when a request comes in.

### Registering a Service

```csharp
// Inside Program.cs, before builder.Build()
builder.Services.AddScoped<IMailService, SendGridMailService>();

```

### Injecting into a Component

```csharp
public class NotificationController
{
    private readonly IMailService _mailService;

    // The framework automatically detects IMailService and injects the configured class here
    public NotificationController(IMailService mailService)
    {
        _mailService = mailService;
    }
}

```

---

## 4. The 3 Service Lifetimes

When registering dependencies into the internal DI container, you must tell ASP.NET Core exactly how long those objects should live in memory before being cleaned up:

| Lifetime | Registration Method | Behavior | Best Used For |
| --- | --- | --- | --- |
| **Transient** | `AddTransient<T>` | A brand-new instance is created **every single time** it is requested. | Lightweight, stateless utilities or calculation engines. |
| **Scoped** | `AddScoped<T>` | One single instance is created **per HTTP request**. All classes handling that specific web request share that same instance. | Database contexts (`DbContext`) and business repositories tracking user state. |
| **Singleton** | `AddSingleton<T>` | One instance is created the **very first time** it is requested and lives permanently throughout the entire application lifecycle. | Configuration caches, background tasks, or memory logs. |

---

## 5. Middleware Pipeline

**Middleware** consists of individual code modules assembled sequentially into an execution pipeline to handle requests and responses. Each component can decide whether to pass the request to the next middleware component or short-circuit the pipeline entirely (e.g., blocking an unauthenticated request).

You wire up middleware inside `Program.cs` using `app.Use...` statements:

```csharp
var app = builder.Build();

// Order matters significantly in the middleware pipeline!
app.UseDeveloperExceptionPage(); // 1. Catch errors early
app.UseStaticFiles();             // 2. Serve physical images/CSS styles
app.UseRouting();                 // 3. Evaluate matching route paths
app.UseAuthentication();          // 4. Identify who the user is
app.UseAuthorization();           // 5. Check if user has explicit access rights

app.MapControllers();             // 6. Execute final controller action logic

```