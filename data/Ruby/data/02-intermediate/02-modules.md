## Lesson 2: Modules and Mixins

Unlike languages like C++, Ruby does not support multiple inheritance. A class can inherit from exactly one parent class. To share behavior across unrelated classes without duplicating code, Ruby uses **Modules**. When a module's methods are injected into a class, it is called a **Mixin**.

---

## The Core Difference: Classes vs. Modules

While both classes and modules are containers for methods, constants, and other class definitions, they have distinct roles:

* **Classes** focus on state and instantiation. They can create objects (via `.new`) and inherit from a superclass.
* **Modules** focus on organization and shared behavior. They cannot be instantiated, and they cannot inherit from other modules or classes.

---

## Modules as Namespaces

Namespacing isolates constants and classes within a protected container. This prevents naming collisions when your codebase scales or when you import third-party libraries (gems) that use identical class names.

You access namespaced components using the **scope resolution operator (`::`)**.

```ruby
# Resolving a naming conflict via Namespacing
module CloudStorage
  class Client
    def connect
      "Connecting to cloud storage api..."
    end
  end
end

module LocalStorage
  class Client
    def connect
      "Opening local disk storage..."
    end
  end
end

# Usage
cloud_client = CloudStorage::Client.new
local_client = LocalStorage::Client.new

```

---

## Modules as Mixins (`include` vs. `extend`)

Mixins allow you to inject a module's methods directly into a class. Ruby provides two primary directives to do this, and they dictate *where* those methods end up.

### 1. `include` (Instance-Level Methods)

Using `include` injects the module's methods as **instance methods** on the receiving class. Any object instantiated from that class can call them.

```ruby
module Loggable
  def log_info(message)
    puts "[INFO] #{Time.now}: #{message}"
  end
end

class UserProfile
  include Loggable # Injects methods at the instance level
end

user = UserProfile.new
user.log_info("User logged in successfully.") # Called on the instance

```

### 2. `extend` (Class-Level Methods)

Using `extend` injects the module's methods as **class methods** directly onto the class blueprint itself.

```module Shareable
  def generate_public_token
    SecureRandom.hex(16)
  end
end

class Report
  extend Shareable # Injects methods at the class level
end

# Called directly on the Class; instances of Report do not have this method
token = Report.generate_public_token

```

---

## Method Lookup Chain (`ancestors`)

When you call a method on a Ruby object, the runtime engine searches through a strict, linear hierarchy to find that method. Modules injected via `include` or `prepend` alter this lookup path.

You can inspect this exact order for any class by calling the `.ancestors` class method:

```ruby
module Debugger
  def locate
    "Inside Debugger module"
  end
end

class SuperClass; end

class SubClass < SuperClass
  include Debugger
end

p SubClass.ancestors
# Output: [SubClass, Debugger, SuperClass, Object, Kernel, BasicObject]

```

### The Lookup Order Strategy

1. **The Class Itself:** Ruby checks the object's direct class first.
2. **Prepended Modules:** Modules added via `prepend` inject themselves *before* the class itself.
3. **Included Modules:** Modules added via `include` insert themselves directly *after* the class, overriding any methods in the parent superclass.
4. **Superclass:** Ruby climbs up to the explicit parent class, then through its own included modules, all the way up to `Object`.