# Lesson 7: Loops

In programming, you often need to execute a block of code multiple times. Instead of writing out the same instructions repeatedly, you use **loops**. Loops allow you to automate repetitive tasks by running a block of code as long as a specific condition remains true.

---

## 1. The `while` Loop

The `while` loop is the simplest looping structure. It evaluates a boolean condition *before* executing the loop body. If the condition is true, the code inside the block runs. Once the block finishes, the condition is evaluated again. This repeats until the condition becomes false.

```csharp
// Syntax
while (condition)
{
    // Code to repeat
}

// Example
int count = 1;

while (count <= 5)
{
    Console.WriteLine("Iteration: " + count);
    count++; // Crucial: updates the variable so the loop eventually ends
}

```

> **Warning: The Infinite Loop**
> If the loop condition never becomes false (for example, if you forget to increment `count` in the example above), your program will get stuck in an infinite loop, freezing the application or crashing the system.

---

## 2. The `do while` Loop

The `do while` loop is a variation of the `while` loop. The key difference is that it evaluates its condition at the *bottom* of the loop rather than the top. This guarantees that the code block will always execute **at least once**, regardless of whether the condition is true or false from the start.

```csharp
// Syntax
do
{
    // Code to repeat
} while (condition);

// Example
int choice;

do
{
    Console.WriteLine("1. Settings | 2. Quit");
    Console.Write("Enter selection: ");
    choice = int.Parse(Console.ReadLine());
} while (choice != 2); // Keeps looping until the user inputs 2

```

---

## 3. The `for` Loop

The `for` loop is ideal when you know exactly how many times you want to repeat a block of code. It groups three essential looping steps together into a single, clean line: **initialization**, **condition**, and **iterator**.

```csharp
// Syntax
for (initialization; condition; iterator)
{
    // Code to repeat
}

// Example
for (int i = 0; i < 5; i++)
{
    Console.WriteLine("Loop index is: " + i);
}

```

* **Initialization (`int i = 0`)**: Runs exactly once when the loop starts. It creates a counter variable.
* **Condition (`i < 5`)**: Evaluated before every iteration. If true, the loop body runs; if false, the loop exits.
* **Iterator (`i++`)**: Runs at the very end of every iteration, updating the counter variable before the condition is checked again.

---

## 4. Loop Control Statements: `break` and `continue`

Sometimes you need to alter the standard behavior of a loop mid-execution based on a dynamic condition. C# provides two keywords for this:

* **`break`**: Immediately terminates the entire loop and jumps to the code directly following the loop block.
* **`continue`**: Skips the rest of the code inside the *current* iteration and jumps straight to the next loop evaluation.

```csharp
// Example using break
for (int i = 1; i <= 10; i++)
{
    if (i == 6)
    {
        break; // Stops the loop entirely when i reaches 6
    }
    Console.Write(i + " "); 
}
// Output: 1 2 3 4 5

Console.WriteLine(); // Newline

// Example using continue
for (int i = 1; i <= 5; i++)
{
    if (i == 3)
    {
        continue; // Skips printing 3 and moves straight to i = 4
    }
    Console.Write(i + " ");
}
// Output: 1 2 4 5

```

---

## 5. Loop Comparison Summary

| Loop Type | Minimum Executions | Best Used When... |
| --- | --- | --- |
| **`while`** | 0 | You want to loop based on a condition, but don't know how many iterations it will take. |
| **`do while`** | 1 | You must execute the code block at least once (e.g., displaying a menu or prompting for input). |
| **`for`** | 0 | You know the exact number of iterations beforehand (e.g., counting from 1 to 100). |