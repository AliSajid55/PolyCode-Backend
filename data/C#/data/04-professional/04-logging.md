# Lesson 4: Logging

When an application is running in production on a remote server, you can no longer attach a debugger or look at the standard console window to see what is happening. If a user encounters an error or a database transaction fails, you need a permanent record of events to diagnose the problem.

**Logging** is the practice of writing structural diagnostic messages to a persistent store (such as a file, database, or cloud monitoring service) while the application is running. It provides a historical timeline of system health, user activity, and unexpected failures.

---

## 1. Why Logging Over `Console.WriteLine`?

While `Console.WriteLine` works fine for quick debugging during local development, it is highly problematic for production software:

* **No Persistence:** Console output disappears as soon as the application restarts or the terminal window is closed.
* **No Structure:** Raw text strings are incredibly difficult to filter, search, or analyze when looking through millions of records.
* **No Severity Control:** You cannot easily turn off minor tracking messages without also hiding critical error warnings.

Structured logging frameworks solve this by categorizing messages by severity and transforming data into searchable objects.

---

## 2. Log Levels (Severity)

To prevent your log files from becoming overcrowded with useless information, logging frameworks categorize every message into a specific **Log Level**. This allows you to filter out minor messages in production while keeping them visible during local development.

The standard .NET logging levels, ordered from lowest to highest priority, are:

| Log Level | Purpose | Example Scenario |
| --- | --- | --- |
| **`Trace`** | Extremely granular, high-volume debugging details. | Tracking the exact byte payload of a network packet. |
| **`Debug`** | Standard diagnostic notes used during development. | "User validation method initiated for username: john_doe." |
| **`Information`** | General application milestones tracking normal workflow. | "Order #1042 successfully processed and payment confirmed." |
| **`Warning`** | An abnormal or unexpected event that doesn't halt the app. | "Database connection timed out, retrying attempt 2 of 3..." |
| **`Error`** | A critical failure that breaks the current operation or request. | "Payment processing failed due to an invalid API token." |
| **`Critical`** | A catastrophic system failure requiring immediate engineer attention. | "The primary database server is completely unreachable. App halting." |

---

## 3. Native Logging in .NET

Modern .NET incorporates a built-in logging abstraction via the `ILogger<T>` interface. The framework handles object creation automatically through Dependency Injection.

### Injecting and Using the Logger

```csharp
using Microsoft.Extensions.Logging;

public class PaymentProcessor
{
    // The generic type <PaymentProcessor> helps identify exactly which class generated the log
    private readonly ILogger<PaymentProcessor> _logger;

    public PaymentProcessor(ILogger<PaymentProcessor> logger)
    {
        _logger = logger;
    }

    public void ProcessTransaction(double amount)
    {
        // 1. Logging normal flow information
        _logger.LogInformation("Initiating transaction processing for amount: ${Amount}", amount);

        if (amount <= 0)
        {
            // 2. Logging a business logic validation warning
            _logger.LogWarning("Transaction rejected: Amount must be greater than zero.");
            return;
        }

        try
        {
            // Simulate bank connection logic...
        }
        catch (Exception ex)
        {
            // 3. Logging a runtime exception with its error details and stack trace
            _logger.LogError(ex, "An unhandled exception occurred while communicating with the bank gateway.");
        }
    }
}

```

---

## 4. Structured vs. Traditional Logging

Traditional logging takes variables and glues them into a single string literal. If you want to find all logs relating to a specific amount, you have to write complex text parsers.

* **Traditional (Text-based):** `_logger.LogInformation("User " + username + " logged in from " + ip);`
* **Structured (Object-based):** `_logger.LogInformation("User {Username} logged in from {IPAddress}", username, ip);`

Notice that structured logging uses named placeholders inside the text template. Advanced logging sinks extract these placeholders into separate indexable database columns. This allows you to instantly query your logs using database syntax like `WHERE Username == 'john_doe'`.

---

## 5. Popular Third-Party Frameworks

While .NET provides the default logging *interface*, developers often pair it with powerful third-party logging engines (often called "sinks" or "providers") to send logs to sophisticated destinations.

* **Serilog:** The industry standard for modern .NET applications. It focuses entirely on structured logging and offers hundreds of plugins to pipe logs directly to text files, SQL databases, Elasticsearch, or cloud metrics systems.
* **NLog:** A highly flexible, mature, and fast logging platform that uses XML or programmatic configurations.
* **Loggly / Seq / Application Insights:** Centralized dashboard tools where production servers upload log streams in real-time, allowing engineers to visualize error spikes and search historical data instantly.