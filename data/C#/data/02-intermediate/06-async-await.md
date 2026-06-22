# Lesson 6: Async and Await

When an application runs a task that takes a long time—such as downloading a large file from the internet, reading a massive database file, or communicating with an external API—the program traditionally waits for that task to finish before moving on to the next line of code.

In a desktop application or game, this causes the user interface (UI) to freeze or stutter. **Asynchronous programming** using the **`async`** and **`await`** keywords solves this problem by allowing your application to start a long-running operation and move on to other work immediately, returning to finish the operation once the background task is complete.

---

## 1. Synchronous vs. Asynchronous Execution

* **Synchronous (Blocking):** Task A must completely finish before Task B can start. The execution thread is completely locked while waiting.
* **Asynchronous (Non-blocking):** Task A is initiated. While Task A is processing in the background, the execution thread is freed up to handle other operations (like processing user input or updating a UI animation). Once Task A completes, the program resumes its execution path.

---

## 2. The Core Keywords: `async` and `await`

Asynchronous code in C# relies on two fundamental keywords that always work as a pair:

* **`async`:** Placed in a method signature to signal to the compiler that the method contains asynchronous operations. An `async` method can return `Task` (for void operations) or `Task<T>` (for operations returning a value).
* **`await`:** Placed inside an async method right before a long-running task. It tells the program to pause execution of *this specific method* and temporarily free up the thread until the awaited task completes.

---

## 3. A Practical Example

Here is how you write an asynchronous method compared to a standard synchronous one:

```csharp
using System;
using System.Threading.Tasks;
using System.Net.Http;

public class NetworkUtility
{
    // 1. Mark the method signature with 'async' and wrap the return type in 'Task'
    public async Task<string> FetchWebPageAsync(string url)
    {
        using (HttpClient client = new HttpClient())
        {
            Console.WriteLine("Request initiated. Thread is free to handle other tasks...");

            // 2. Use 'await' to pause execution here without blocking the thread
            string content = await client.GetStringAsync(url);

            Console.WriteLine("Data downloaded successfully.");
            return content;
        }
    }
}

```

### Calling and Consuming Async Methods

When calling an asynchronous method, you must also use the `await` keyword, which means the calling method must also be marked as `async`:

```csharp
public async Task RunApplication()
{
    NetworkUtility utility = new NetworkUtility();
    
    // Program triggers the download and suspends execution here to stay responsive
    string webData = await utility.FetchWebPageAsync("https://example.com");
    
    Console.WriteLine($"Downloaded character count: {webData.Length}");
}

```

---

## 4. Async Return Types

When designing asynchronous methods, your return types follow a strict convention based on what data needs to be passed back:

| Return Type | Usage | Example |
| --- | --- | --- |
| **`Task`** | Used for asynchronous methods that perform an action but return no value (equivalent to returning `void`). | `public async Task LogDataAsync() { ... }` |
| **`Task<T>`** | Used for asynchronous methods that return a specific type of data (`T`). | `public async Task<int> CalculateTotalAsync() { ... }` |
| **`ValueTask<T>`** | A high-performance alternative to `Task<T>` used when the result might already be available synchronously in memory. | `public async ValueTask<int> ReadCacheAsync() { ... }` |

> **Warning: Avoid `async void**`
> You should almost never use `void` as a return type for an async method (e.g., `public async void Process()`). Errors and exceptions thrown inside an `async void` method cannot be caught by a traditional `try-catch` block and can cause the entire application to crash. The only acceptable exception is for UI event handlers.

---

## 5. Running Tasks in Parallel: `Task.WhenAll`

Sometimes you need to kick off multiple independent background operations simultaneously. Instead of awaiting them one by one sequentially, you can start them all at once and use `Task.WhenAll` to wait for all of them to conclude together. This drastically reduces total execution time.

```csharp
public async Task DownloadMultipleFiles()
{
    HttpClient client = new HttpClient();

    // Triggering tasks simultaneously without awaiting them individually yet
    Task<string> download1 = client.GetStringAsync("https://site-a.com");
    Task<string> download2 = client.GetStringAsync("https://site-b.com");
    Task<string> download3 = client.GetStringAsync("https://site-c.com");

    Console.WriteLine("All 3 downloads running in parallel in the background...");

    // Halts execution until ALL three operations complete safely
    string[] results = await Task.WhenAll(download1, download2, download3);

    Console.WriteLine("All downloads completed.");
}

```