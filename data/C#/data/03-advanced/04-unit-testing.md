# Lesson 4: Unit Testing

When building software, verifying that your code behaves exactly as expected is critical. Testing your application manually by running it and clicking around is slow, repetitive, and prone to human error. **Unit Testing** solves this by automating the verification process.

A unit test isolates a small, specific "unit" of code (typically a single method) and runs a programmatic check to guarantee it produces the correct output for a given input.

---

## 1. Why Write Unit Testing?

* **Prevents Regression:** If you rewrite or optimize a method months down the line, running your unit tests immediately flags whether you accidentally broke working features.
* **Improves Code Design:** Code that is tightly coupled or messy is incredibly difficult to test. Writing tests forces you to keep your classes modular, decoupled, and cleanly organized.
* **Acts as Live Documentation:** Unit tests demonstrate exactly how a method is expected to be consumed and how it should respond to edge cases.

---

## 2. Core Concepts: AAA Pattern

The industry standard for structuring a single unit test follows the **AAA (Arrange, Act, Assert)** pattern. This convention keeps tests uniform, structured, and easy to read.

| Phase | Description | Action |
| --- | --- | --- |
| **Arrange** | Initialization | Set up the objects, variables, and data required for the test. |
| **Act** | Execution | Invoke the specific method you are testing to capture its actual output. |
| **Assert** | Verification | Compare the actual outcome against your expected outcome. If they match, the test passes. |

---

## 3. Writing Your First Unit Test

In the .NET ecosystem, tests are kept in a completely separate project within your solution so production deployment files stay lightweight. Common testing frameworks include **xUnit**, **NUnit**, and **MSTest**.

Here is an example using **xUnit**:

### The Code to Test (Production Project)

```csharp
public class MathEngine
{
    public int Add(int a, int b)
    {
        return a + b;
    }
}

```

### The Unit Test (Test Project)

```csharp
using Xunit;

public class MathEngineTests
{
    // The [Fact] attribute tells the test runner that this is an executable test method
    [Fact]
    public void Add_TwoPositiveIntegers_ReturnsCorrectSum()
    {
        // 1. Arrange
        MathEngine engine = new MathEngine();
        int num1 = 5;
        int num2 = 10;
        int expectedResult = 15;

        // 2. Act
        int actualResult = engine.Add(num1, num2);

        // 3. Assert
        Assert.Equal(expectedResult, actualResult);
    }
}

```

---

## 4. Testing Edge Cases and Expected Exceptions

Good testing goes beyond checking standard scenarios; it must also verify that code gracefully rejects bad inputs. If a method is designed to throw an exception under specific conditions, you can verify that behavior using `Assert.Throws`.

```csharp
public class RegistrationProcessor
{
    public void ValidateAge(int age)
    {
        if (age < 18)
        {
            throw new ArgumentOutOfRangeException("Must be 18 or older.");
        }
    }
}

// In your Test class:
[Fact]
public void ValidateAge_UnderEighteen_ThrowsArgumentOutOfRangeException()
{
    // Arrange
    RegistrationProcessor processor = new RegistrationProcessor();

    // Act & Assert combined
    // Verifies that calling the method with '15' explicitly triggers the specified exception
    Assert.Throws<ArgumentOutOfRangeException>(() => processor.ValidateAge(15));
}

```

---

## 5. Isolating Dependencies: Mocking

Real-world classes rarely operate completely in isolation; they often depend on database connections, file systems, or external web services. If you try to run a unit test that interacts with a live database, it turns into an *integration test* and can fail due to network instability.

To keep unit tests isolated, fast, and deterministic, you use **Mocking libraries** (like `Moq` or `NSubstitute`) to create fake, simulated versions of dependent interfaces.

```csharp
// The interface our production class depends on
public interface IDataRepository
{
    int GetUserScore(int userId);
}

public class ScoreCalculator
{
    private readonly IDataRepository _repo;
    public ScoreCalculator(IDataRepository repo) => _repo = repo;

    public string CheckPerformance(int userId)
    {
        int score = _repo.GetUserScore(userId);
        return score >= 50 ? "Passing" : "Failing";
    }
}

// In your Test class (Using Moq syntax):
[Fact]
public void CheckPerformance_ScoreAboveFifty_ReturnsPassing()
{
    // 1. Arrange: Create a mock wrapper around the interface
    var mockRepo = new Moq.Mock<IDataRepository>();
    
    // Program the mock to return a fixed value '75' when called with any integer
    mockRepo.Setup(r => r.GetUserScore(Moq.It.IsAny<int>())).Returns(75);

    // Pass the mock object (.Object) into our target calculator class
    ScoreCalculator calculator = new ScoreCalculator(mockRepo.Object);

    // 2. Act
    string result = calculator.CheckPerformance(1);

    // 3. Assert
    Assert.Equal("Passing", result);
}

```