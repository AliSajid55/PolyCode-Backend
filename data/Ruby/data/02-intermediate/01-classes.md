## Lesson 1: Classes

Since everything in Ruby is an object, **Classes** serve as the blueprints or templates used to construct those objects. A class defines the state (data) and behavior (methods) that the objects instantiated from it will possess.

---

## Class Instantiation and Anatomy

To define a class, use the `class` keyword followed by a name written in **CamelCase** (an absolute requirement for constants in Ruby).

```ruby
class UserAccount
  # Class body definitions go here
end

# Instantiating an object from the class
account = UserAccount.new

```

When you call `.new` on a class, Ruby allocates memory for a new object instance and immediately fires its internal constructor method: `initialize`.

---

## The Constructor (`initialize`) & Instance Variables

The `initialize` method is a special private method that runs automatically whenever an object is created. It is primarily used to set up the starting state of an object by capturing arguments passed to `.new` and assigning them to **Instance Variables** (prefixed with `@`).

```ruby
class UserAccount
  def initialize(username, email)
    @username = username  # Encapsulated state
    @email = email        # Encapsulated state
  end
end

# Passing data directly into the constructor
user1 = UserAccount.new("johndoe", "john@example.com")

```

### State Encapsulation

Instance variables are strictly protected. They are encapsulated inside the object instance and are completely invisible to the outside world. If you attempt to access an instance variable directly from outside the object, Ruby will throw a compilation or runtime error:

```ruby
# DANGER ZONE: This will crash the interpreter
# puts user1.@username 

```

---

## Encapsulation & Attribute Accessors

To allow external code to interact with an object's internal state, you must write explicit getter and setter methods, or use Ruby's built-in macro tools to automate them.

### 1. Manual Getter and Setter Methods

```ruby
class UserAccount
  def initialize(username)
    @username = username
  end

  # Getter method (Reader)
  def username
    @username
  end

  # Setter method (Writer)
  def username=(new_name)
    @username = new_name
  end
end

```

### 2. Built-in Attribute Accessor Macros (Preferred)

Writing manual accessors introduces boilerplate code. Ruby provides three clean, compile-time macros that generate these methods behind the scenes using symbols:

| Macro | Generated Methods | Access Level |
| --- | --- | --- |
| **`attr_reader`** | Creates only the getter method (`object.var`). | Read-Only |
| **`attr_writer`** | Creates only the setter method (`object.var = value`). | Write-Only |
| **`attr_accessor`** | Creates both the getter and setter methods. | Read & Write |

```ruby
class UserAccount
  attr_accessor :username  # Anyone can read or write this data
  attr_reader :email       # Read-only; cannot be changed after initialization

  def initialize(username, email)
    @username = username
    @email = email
  end
end

user = UserAccount.new("johndoe", "john@example.com")
user.username = "john_modified" # Allowed by attr_accessor
# user.email = "new@example.com" # Raises NoMethodError (undefined method `email=')

```

---

## Instance Methods vs. Class Methods

Methods within a class are divided based on whether they act on an individual instance or the class blueprint itself.

### 1. Instance Methods

These operate on a specific instance of an object and have full access to that object's unique instance variables.

```ruby
class UserAccount
  attr_reader :username

  def display_profile
    "User Profile: #{@username}" # Accesses specific instance data
  end
end

```

### 2. Class Methods

These are called directly on the Class name itself, rather than an instantiated object. They are commonly used for factory patterns, global lookups, or utility actions that do not require unique state.

To declare a class method, prefix the method name with the **`self`** keyword.

```ruby
class UserAccount
  # Class Method
  def self.generate_anonymous
    # Inside a class method, 'self' refers to the Class object itself
    new("anonymous_user", "anon@example.com")
  end
end

# Invoking the class method directly without creating an instance first
anon_user = UserAccount.generate_anonymous

```