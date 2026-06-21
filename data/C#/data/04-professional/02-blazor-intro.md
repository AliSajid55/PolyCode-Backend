# Lesson 2: Blazor Introduction

Traditionally, building modern, interactive web applications required a divided workflow: you would write your backend business logic in a server-side language like C#, but you were forced to write your frontend user interface (UI) logic in JavaScript (using frameworks like React, Angular, or Vue).

**Blazor** is an open-source web framework from Microsoft that completely changes this paradigm. It allows developers to build rich, highly interactive web user interfaces using **C# instead of JavaScript**.

---

## 1. What is Blazor?

The name "Blazor" comes from combining the words **Browser** and **Razor** (the C# HTML-templating engine). With Blazor, you can write full-stack web applications where both the client UI and the backend services share the exact same language, libraries, and data models.

Blazor achieves this using two distinct execution architectures:

| Hosting Model | Execution Location | How It Works | Pros / Cons |
| --- | --- | --- | --- |
| **Blazor WebAssembly** | **Client-Side** (Inside the Browser) | Compiles your C# code into binaries that run directly inside the browser using a high-performance web standard called **WebAssembly (Wasm)**. | **Pros:** Runs entirely on the user's device, offline capabilities.<br>

<br>**Cons:** Larger initial download size to load the runtime. |
| **Blazor Server** | **Server-Side** (On the Web Host) | Executes your C# code directly on the web server. The UI layout is rendered on the server and sent to the browser via a persistent, real-time **SignalR (WebSockets)** connection. | **Pros:** Near-instant initial page loading, secure server environment.<br>

<br>**Cons:** Requires a continuous network connection to process clicks. |

---

## 2. Core Building Blocks: Components

Blazor applications are built out of self-contained, reusable user interface modules called **Razor Components**. These components are saved in files with a `.razor` extension.

A component seamlessly blends standard HTML markup text with executable C# code blocks.

```razor
@* A standard Counter.razor component *@

<h3>Interactive Counter Component</h3>

<p role="status">Current score: @currentCount</p>

<button class="btn btn-primary" @onclick="IncrementCount">Click Me</button>

@code {
    // This C# block manages the data and logic for the HTML layout above
    private int currentCount = 0;

    private void IncrementCount()
    {
        currentCount++;
    }
}

```

---

## 3. Data Binding and Event Handling

Blazor simplifies UI synchronization by automatically updating the visual HTML elements whenever the underlying C# data structures change.

### One-Way Data Binding

Inserts a variable's value directly into an HTML element using the `@` character.

```razor
<p>Current Status: @applicationStatus</p>

```

### Two-Way Data Binding

Synchronizes data in both directions simultaneously. If a user types text into an input box, the C# variable updates instantly; if code changes the variable, the input text box shifts automatically to match.

```razor
<input @bind="username" placeholder="Enter username" />
<p>Hello, @username!</p>

@code {
    private string username;
}

```

---

## 4. Component Parameters and Communication

To create components that are genuinely reusable, you need a way to pass data into them from parent pages. You achieve this by creating public properties tagged with the **`[Parameter]`** attribute.

### The Child Component (`InfoAlert.razor`)

```razor
<div class="alert alert-info">
    <strong>@Title</strong> - @Message
</div>

@code {
    [Parameter]
    public string Title { get; set; } = "Notification";

    [Parameter]
    public string Message { get; set; }
}

```

### Consuming it on a Parent Page (`Index.razor`)

```razor
@page "/"

<h3>Dashboard</h3>

<InfoAlert Title="System Notice" Message="A scheduled backup is currently running." />
<InfoAlert Message="Your weekly performance metric report is ready." />

```

---

## 5. JavaScript Interoperability (JS Interop)

While Blazor allows you to build complete web applications without writing JavaScript, you still have total access to the existing JavaScript ecosystem when necessary. For instance, you might need to use a specialized third-party JavaScript chart library or access browser features like local storage or geolocation APIs.

This cross-language communication is handled through **JavaScript Interop** using the `IJSRuntime` service.

```razor
@inject IJSRuntime JSRuntime

<button @onclick="ShowBrowserAlert">Trigger JS</button>

@code {
    private async Task ShowBrowserAlert()
    {
        // Executes the native browser JavaScript 'alert' function dynamically
        await JSRuntime.InvokeVoidAsync("alert", "This message was generated via C#!");
    }
}

```