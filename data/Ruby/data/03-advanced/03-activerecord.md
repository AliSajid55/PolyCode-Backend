## Lesson 3: ActiveRecord

**ActiveRecord** is the Object-Relational Mapping (ORM) layer built into Ruby on Rails. It implements the classic Active Record architectural pattern, where a single database table maps directly to a Ruby class, and individual rows in that table map directly to instantiated objects of that class.

ActiveRecord abstracts away the complexities of raw SQL. It allows you to create, read, update, delete, validate, and relate data structures using pure, idiomatic Ruby.

---

## Convention Over Configuration (Mapping Rules)

To eliminate manual configuration mapping manifests, ActiveRecord assumes strict naming conventions when linking your Ruby models to database tables:

* **Class Names (Ruby):** Singular, written in CamelCase (e.g., `UserAccount`, `ProductLine`).
* **Table Names (Database):** Plural, written in snake_case (e.g., `user_accounts`, `product_lines`).

| Ruby Model Class | Target Database Table | Primary Key | Foreign Key Convention |
| --- | --- | --- | --- |
| `User` | `users` | `id` (Integer / UUID auto-increment) | `user_id` |
| `BlogPost` | `blog_posts` | `id` | `blog_post_id` |

---

## Database Migrations

A **Migration** is a version-control system for your database schema. Instead of executing manual `ALTER TABLE` statements directly in a SQL console, you write database changes sequentially in Ruby files.

You generate migrations using the Rails Command Line Interface (CLI):

```bash
$ rails generate migration CreateUsers name:string email:string active:boolean

```

This creates a timestamped file inside the `db/migrate/` directory:

```ruby
# db/migrate/20260622120000_create_users.rb
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email
      t.boolean :active, default: true

      t.timestamps # Automatically adds 'created_at' and 'updated_at' columns
    end
    add_index :users, :email, unique: true
  end
end

```

To execute this change against your database environment, run:

```bash
$ rails db:migrate

```

---

## Core CRUD Operations

ActiveRecord provides high-level finder and persistence methods that translate seamlessly into database queries behind the scenes.

```ruby
# 1. CREATE
# Instantiates and commits a row to the database instantly
user = User.create(name: "John Doe", email: "john@example.com")

# 2. READ
user = User.find(1)                  # Look up strictly by primary key ID (raises error if missing)
user = User.find_by(email: "john@example.com") # Look up by attribute; returns nil if missing
active_users = User.where(active: true)        # Returns an ActiveRecord::Relation collection

# 3. UPDATE
user = User.find(1)
user.update(name: "John Modified")   # Updates attributes and saves immediately

# 4. DELETE
user = User.find(1)
user.destroy                         # Deletes the row and triggers lifecycle callbacks

```

---

## Validations and Lifecycle Callbacks

ActiveRecord allows you to intercept operations to protect data integrity and automate business logic hooks.

### 1. Validations

Validations run automatically before data is saved to the database. If a validation fails, the save operation returns `false` and appends detailed errors to the object.

```ruby
class User < ApplicationRecord
  # Guarantees fields are present and unique before database entry
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end

```

### 2. Lifecycle Callbacks

Callbacks hook into specific moments of an object’s existential timeline (e.g., before saving, after creating, after destroying) to execute secondary automation routines.

```ruby
class User < ApplicationRecord
  before_validation :normalize_email
  after_create :send_welcome_email

  private

  def normalize_email
    self.email = email.downcase.strip if email.present?
  end

  def send_welcome_email
    NotificationMailer.welcome(self).deliver_later
  end
end

```

---

## Defining Relationships (Associations)

ActiveRecord makes declaring foreign key relationships across tables straightforward using declarative macros.

```ruby
# One-to-Many Relationship
class User < ApplicationRecord
  has_many :blog_posts, dependent: :destroy # If user dies, destroy their posts
end

class BlogPost < ApplicationRecord
  belongs_to :user # Expects a 'user_id' foreign key on the blog_posts table
end

```

### Navigating the Relationship

Once these macros are declared, ActiveRecord dynamically adds relational methods onto your objects:

```ruby
user = User.find(1)
# Returns an array-like collection of all blog posts linked to this user's ID
user.blog_posts 

new_post = user.blog_posts.build(title: "New Ruby Guide")
new_post.save # Automatically links user_id behind the scenes

```