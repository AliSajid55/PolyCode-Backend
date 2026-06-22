## Lesson 6: Testing with RSpec

Testing is a core discipline in professional Ruby development. While Ruby includes a built-in testing library (`Minitest`), the industry standard for production-grade applications is **RSpec**. RSpec is a Behavior-Driven Development (BDD) framework designed to describe the expected behavior of your code in a highly readable, human-centric format.

---

## RSpec Architecture: Anatomy of a Spec

RSpec files are called "specs" and typically live in a project's `spec/` directory, mirroring the structure of your source code (e.g., `lib/calculator.rb` matches `spec/calculator_spec.rb`).

The framework uses a DSL (Domain Specific Language) built around clear logical blocks:

* **`describe`**: Group together a collection of related tests, usually targeting a specific class or complex module.
* **`context`**: Subdivide a `describe` block based on specific environmental conditions or states (e.g., *when user is logged in*, *when inventory is empty*).
* **`it`**: Defines an individual test case (or "example") expressing a single specific behavior.
* **`expect(...).to`**: The core assertion step that validates the actual runtime output against the anticipated result.

```ruby
# spec/calculator_spec.rb
require 'calculator'

RSpec.describe Calculator do
  describe "#divide" do
    context "with valid, non-zero numbers" do
      it "returns the correct quotient" do
        calc = Calculator.new
        expect(calc.divide(10, 2)).to eq(5)
      end
    end

    context "when dividing by zero" do
      it "raises a ZeroDivisionError" do
        calc = Calculator.new
        expect { calc.divide(10, 0) }.to raise_error(ZeroDivisionError)
      end
    end
  end
end

```

---

## Core Matchers

Matchers compare the actual value returned by your code to your expectations. RSpec provides a rich library of matchers to handle value checking, truthiness, collections, and errors.

| Matcher Group | Example | Purpose |
| --- | --- | --- |
| **Equivalence** | `expect(val).to eq(5)` | Validates value equality (`==`). |
| **Identity** | `expect(val).to be(target)` | Validates exact object identity (`equal?` / same object ID). |
| **Truthiness** | `expect(val).to be_truthy` | Passes if the value is anything except `false` or `nil`. |
| **Collection** | `expect(arr).to include("admin")` | Checks if an array, hash, or string contains a specific element. |
| **Predicate** | `expect(user).to be_active` | Dynamic sugar. Automatically calls `user.active?` behind the scenes. |
| **Error Handling** | `expect { block }.to raise_error` | Evaluates if a block of code intentionally throws an exception. |

---

## Test Lifecycle Hooks and DRYing Specs

To keep your specs clean and prevent code duplication (DRY), RSpec offers setup hooks and explicit subject declarations.

### 1. Hooks (`before` and `after`)

Hooks run setup or teardown logic automatically around your examples.

* `before(:each)` runs the block before *every single* individual `it` example.
* `before(:all)` runs exactly *once* before the entire suite in that block begins.

```ruby
RSpec.describe DatabaseClient do
  before(:each) do
    @client = DatabaseClient.new(host: "localhost")
    @client.connect
  end

  after(:each) do
    @client.disconnect
  end
  
  # ... tests go here
end

```

### 2. `let` vs. `let!` (Lazy vs. Eager Loading)

Instead of assigning instance variables inside `before` hooks, modern idiomatic RSpec uses `let` blocks to define memoized helper methods.

* **`let(:user)` (Lazy-Loaded):** The block is not executed until the specific `:user` variable is called for the first time inside an `it` block. If a test doesn't explicitly mention `user`, the setup memory is skipped entirely.
* **`let!(:user)` (Eager-Loaded):** The block is forced to execute *before* every single example, exactly like a `before(:each)` hook. This is mandatory when your setup needs to trigger database side-effects before the main assertions run.

```ruby
RSpec.describe UserManagement do
  # Lazy-loaded: created only when called
  let(:config) { Configuration.load_defaults } 
  
  # Eager-loaded: forced into existence before the test executes
  let!(:database) { Database.seed_test_records } 

  it "loads the active profile configuration" do
    expect(config.active?).to be true
  end
end

```