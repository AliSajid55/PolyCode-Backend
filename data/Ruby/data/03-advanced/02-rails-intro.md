## Lesson 2: Introduction to Rails

**Ruby on Rails** (commonly shortened to Rails) is a server-side web application framework written in Ruby. Released by David Heinemeier Hansson in 2004, Rails revolutionized web development by prioritizing developer productivity, rapid prototyping, and elegant software architecture.

Rails is a **highly opinionated framework**. It operates under the belief that there is a "right way" to design web applications, and by adhering to its architectural patterns, you eliminate trivial configuration choices.

---

## Core Operational Philosophies

To write idiomatic Rails, you must embrace its two foundational guiding principles:

* **Convention over Configuration (CoC):** Rails assumes a standard configuration layout for databases, file names, URL routing, and server configurations. Instead of writing sprawling XML or YAML setup manifests (like in Enterprise Java or parts of Node.js), Rails automatically infers relationships based on your naming conventions.
* **Don't Repeat Yourself (DRY):** Every piece of business logic, database configuration, or UI component must have a single, unambiguous representation within the system. Rails provides abstractions like active record associations, partial views, and controller filters to prevent code duplication.

---

## The Model-View-Controller (MVC) Architecture

Rails enforces the **Model-View-Controller (MVC)** architectural pattern to cleanly isolate business logic, data persistence, user routing, and presentation layers.

### 1. The Controller (The Coordinator)

The Controller intercepts incoming HTTP web requests from the routing subsystem. It communicates with the Model to fetch or alter data, processes necessary business logic computations, and then hands off the relevant state payload to the View to compile a response.

### 2. The Model (The Data and Rules)

The Model represents the data structures, database schema mappings, validation checks, and core business rules of your application. In Rails, models inherit from **`ActiveRecord::Base`**, providing an Object-Relational Mapping (ORM) layer that lets you manipulate SQL database rows as standard Ruby objects.

### 3. The View (The Presentation)

The View handles rendering the UI payload returned to the user's browser. Rails traditionally uses **ERB (Embedded Ruby)** files (`.html.erb`), which allow you to interpolate server-side Ruby code directly into standard HTML structures.

---

## Standard Project Anatomy

When you generate a new Rails application via the CLI, it provisions an organized folder layout. Below are the primary production directories you must navigate:

| Directory | Core Purpose | Critical Subdirectories |
| --- | --- | --- |
| **`app/`** | The core application code. Contains all models, views, controllers, assets, and background workers. | `app/models/`, `app/controllers/`, `app/views/` |
| **`config/`** | System configuration variables, database access credentials, environment toggles, and HTTP routing tables. | `config/routes.rb`, `config/database.yml` |
| **`db/`** | Database configurations. Holds your active database schema file and sequential migration scripts. | `db/migrate/`, `db/schema.rb` |
| **`config/routes.rb`** | The application routing file. Maps literal incoming URL patterns directly to specific controller actions. | N/A |

---

## The Rails Request-Response Cycle

When a user interacts with a live Rails application, their request follows a strict linear execution pipeline:

1. **The Browser** triggers an HTTP request (e.g., `GET /users`).
2. **The Router** (`config/routes.rb`) reads the path `/users` and matches it to a specific controller action (e.g., `UsersController#index`).
3. **The Controller** (`app/controllers/users_controller.rb`) boots up, fires any auth or logging filters, and asks the model for data: `User.all`.
4. **The Model** (`app/models/user.rb`) translates `User.all` into an optimized SQL query (`SELECT * FROM users;`), executes it against the database, wraps the raw rows into an array of Ruby objects, and returns them to the controller.
5. **The Controller** assigns those objects to an instance variable (`@users`) and explicitly or implicitly calls the view layer.
6. **The View** (`app/views/users/index.html.erb`) parses the `@users` collection, generates the final raw HTML structure, and hands it back to the controller.
7. **The Controller** wraps the HTML payload into a valid HTTP 200 OK response stream and pipes it back down to the browser.