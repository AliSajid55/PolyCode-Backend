## Lesson 5: Gems and Dependency Management

A **Gem** is the standardized package format for Ruby libraries and applications. It contains reusable code, assets, documentation, and a specification file. Ruby’s ecosystem relies on these packages to share open-source tools, extensions, and frameworks across projects globally.

---

## Anatomy of a Gem

Every gem in the ecosystem follows a strict directory structure so the Ruby installation can parse and load it seamlessly.

* `lib/`: Contains the executable Ruby source code files.
* `spec/` or `test/`: Contains the test suites (e.g., RSpec or Minitest files).
* `bin/`: Contains any executable scripts that get exposed to the user's system command line upon installation.
* `[name].gemspec`: The core configuration manifest. It lists the version, author, description, licenses, and external dependencies required for the gem to function.

---

## Direct Management via RubyGems

The native package management tool built into Ruby is **RubyGems**, invoked using the `gem` command in your terminal. This tool downloads packages directly from the central public repository, [RubyGems.org](https://rubygems.org).

```bash
# Fetch and install a package globally on your system
$ gem install httparty

# Uninstall a specific package
$ gem uninstall httparty

# List all gems currently installed on your local machine
$ gem list

```

Once a gem is installed on your system, you make its codebase accessible inside your custom scripts using the `require` keyword:

```ruby
require 'httparty'

# You can now utilize the gem's classes and methods directly
response = HTTParty.get("https://api.github.com/zen")
puts response.body

```

---

## Project-Level Isolation via Bundler

In production development, managing packages globally via `gem install` quickly causes issues. If Project A requires `httparty` version 2.0 and Project B requires version 2.5, installing them globally creates dependency conflicts.

To solve this, Ruby uses **Bundler**. Bundler isolates and locks the exact versions of dependencies required for a specific project.

### 1. The Gemfile

You declare all of your project's package dependencies inside a file named `Gemfile` located at the root of your project directory.

```ruby
# Gemfile
source 'https://rubygems.org'

gem 'rails', '~> 7.0'       # Optimistic version constraint (allows 7.x upgrades, bars 8.0)
gem 'pg', '>= 1.5', '< 2.0' # Range constraint
gem 'rspec', :groups => [:development, :test] # Environment scoping

```

### 2. Resolution and the Lockfile

To install the declared packages, run the install command from your project root:

```bash
$ bundle install

```

This command parses your `Gemfile`, runs a dependency resolution algorithm to find compatible versions, downloads them, and generates a **`Gemfile.lock`** file.

> **The Golden Rule of Bundler:** Never manually edit `Gemfile.lock`. This file records the exact version of every single gem installed. When deploying to production or onboarding a teammate, running `bundle install` reads the lockfile directly, ensuring that every environment runs on identical code down to the patch version.

### 3. Executing within the Bundle context

If a gem installs an executable system command (like `rails` or `rspec`), running that command directly from your terminal uses the global system version. To force the command to run using the exact version isolated in your project's lockfile, prefix it with `bundle exec`:

```bash
# Executes the exact version locked in this specific project
$ bundle exec rspec spec/

```