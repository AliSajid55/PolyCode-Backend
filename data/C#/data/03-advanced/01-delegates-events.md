# Lesson 1: Delegates and Events

In large applications, components often need to communicate with one another without being tightly coupled. For instance, a user interface button needs a way to tell a processing script that it was clicked, or a background file downloader needs to notify a progress bar when a chunk of data arrives.

In C#, this decoupled, communication-driven design is achieved using **Delegates** and **Events**.

---

## 1. What is a Delegate?

A **delegate** is a type-safe reference to a method. Think of a standard variable as something that points to a *value* (like an integer or a string); a delegate is a variable that points to a *method*.

Delegates allow you to pass methods as parameters to other methods, pass them around inside classes, or execute them dynamically at runtime.

### The 3-Step Process for Custom Delegates

```csharp
using System;

// 1. Declare the delegate layout (defines return type and parameter rules)
public delegate void MessageTarget(string text);

public class Program
{
    public static void Main()
    {
        // 2. Instantiate the delegate pointing to a matching method
        MessageTarget processor = DisplayToConsole;

        // 3. Invoke the method through the delegate variable
        processor("Hello via Delegate!"); 
    }

    public static void DisplayToConsole(string message)
    {
        Console.WriteLine(message);
    }
}

```

---

## 2. Built-in Generic Delegates: `Action` and `Func`

While you can declare custom delegates using the `delegate` keyword, modern C# provides pre-built generic delegates inside the `System` namespace that handle almost every scenario, saving you from writing boilerplate code.

* **`Action<T>`**: Points to a method that takes parameters but returns **`void`**.
* **`Func<T, TResult>`**: Points to a method that takes parameters and returns a **specific value type** (`TResult`). The final type parameter always represents the return value.

```csharp
// Action taking a string parameter and returning void
Action<string> logAction = msg => Console.WriteLine(msg);
logAction("Logging info...");

// Func taking two integers and returning an integer
Func<int, int, int> addFunc = (x, y) => x + y;
int result = addFunc(5, 10); // result is 15

```

---

## 3. Multicast Delegates

Delegates have a unique feature called **multicasting**. A single delegate variable can hold references to multiple methods simultaneously. When you invoke a multicast delegate, all associated methods execute sequentially in the order they were added.

You chain methods together using the **`+=`** operator and remove them using the **`-=`** operator.

```csharp
public static void TriggerAlerts()
{
    Action notificationPipeline = LogToDisk;
    notificationPipeline += BroadcastToConsole; // Added second method

    // Invoking the delegate executes both methods sequentially
    notificationPipeline(); 
}

public static void LogToDisk() { /* Code to write log */ }
public static void BroadcastToConsole() { /* Code to print text */ }

```

---

## 4. What is an Event?

While multicast delegates are powerful, exposing them publicly can introduce security flaws into your code architecture. Any external script could overwrite the entire pipeline (`pipeline = NewMethod;`) or trigger the execution arbitrarily.

An **event** is a protective wrapper built around a delegate. It acts strictly on a **Publisher-Subscriber** model:

* **The Publisher** owns the event and decides exactly when to broadcast it.
* **The Subscribers** can only register (`+=`) or unregister (`-=`) their own listening methods. They cannot trigger the event or modify other subscriptions.

---

## 5. Implementing a Publisher-Subscriber Event

Here is how to create a clean, modern event pipeline where an engine notifies a user interface component without directly depending on it.

```csharp
using System;

// 1. The Publisher Class
public class OperationEngine
{
    // Declaring the event wrapper using the built-in generic EventHandler
    public event EventHandler OnOperationCompleted;

    public void StartProcessing()
    {
        Console.WriteLine("Executing long operations...");
        // Simulate work...
        
        // Trigger the event safely, ensuring it has at least one subscriber (?.)
        // 'this' represents the sender, EventArgs.Empty signals no extra data
        OnOperationCompleted?.Invoke(this, EventArgs.Empty);
    }
}

// 2. The Subscriber Class
public class UserInterface
{
    public void BindToEngine(OperationEngine engine)
    {
        // Registering a listener method to the event using +=
        engine.OnOperationCompleted += HandleCompletion;
    }

    // The method signature must match the EventHandler pattern rules
    private void HandleCompletion(object sender, EventArgs e)
    {
        Console.WriteLine("UI updated successfully: Operation notification received!");
    }
}

```

### Execution Example

```csharp
public static void RunSystem()
{
    OperationEngine coreEngine = new OperationEngine();
    UserInterface display = new UserInterface();

    display.BindToEngine(coreEngine); // Establishing the link
    coreEngine.StartProcessing();     // Triggers the background work and event notification
}

```