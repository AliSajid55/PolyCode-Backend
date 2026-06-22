## Lesson 3: Deployment

Deploying a Rails API into a production environment requires moving away from local development servers (like `bin/dev` or Puma in development mode) toward an architecture optimized for uptime, security, concurrency, and asset isolation.

---

## Production Architecture Blueprint

A resilient, production-grade Rails deployment separates core infrastructure responsibilities into isolated, specialized layers rather than running everything on a single compute instance.

* **The Reverse Proxy / Load Balancer (e.g., Nginx, AWS ALB):** Acts as the public-facing gateway. It terminates SSL/TLS, buffers slow client connections, and drops malicious structural payloads before routing requests to your internal application layer.
* **The Application Server (e.g., Puma):** A highly concurrent, multi-threaded Ruby server runner that executes your Rails engine code.
* **The Database Tier (e.g., Managed PostgreSQL):** Isolated from the web instances behind private subnets.
* **The Background Worker Pool (e.g., Sidekiq):** Runs on dedicated compute instances to process asynchronous jobs out of the web request path.

---

## Production Configuration Manifests

Before pushing code to a live host, you must secure your application environment using explicit configuration blocks inside `config/environments/production.rb`.

```ruby
# config/environments/production.rb
Rails.application.configure do
  # Force all data transmission over encrypted SSL/TLS channels
  config.force_ssl = true

  # Set log levels to ensure performance telemetry is tracked without flooding disk space
  config.log_level = :info

  # Ensure code is fully preloaded in memory (Eager Loading) for multi-threaded performance
  config.eager_load = true

  # Disable local asset serving; let an external Content Delivery Network (CDN) or Nginx handle them
  config.public_file_server.enabled = false
end

```

### Twelve-Factor Secrets Management

Never hardcode production database credentials, API secret keys, or encryption tokens inside your Git repository. Rails uses environmental orchestration or encrypted credentials manifests (`config/credentials/production.yml.enc`) decrypted at runtime via a server-level environment variable:

```bash
# Executing the live application server require providing the decryption key
RAILS_MASTER_KEY=1a2b3c4d5e6f7g... bundle exec puma -C config/puma.rb

```

---

## Containerization with Docker

Containerizing your Rails application via Docker ensures environment consistency across development, staging, and production clusters. Below is a production-optimized `Dockerfile` for a Rails API:

```dockerfile
# Use an explicit, lightweight official Ruby base image
FROM ruby:3.3-slim

# Install system dependencies needed for compiling native gems and running database drivers
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  curl \
  && rm -rf /var/lib/apt/lists/*

# Set the primary working directory inside the container image
WORKDIR /app

# Set production execution flags
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_WITHOUT=development:test

# Copy dependency manifests and install isolated gem footprints
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy the rest of the application source code layout
COPY . .

# Expose the production port used by the internal application server
EXPOSE 3000

# Execute the database migrations and boot the concurrent application server instance
CMD ["bash", "-c", "bundle exec rails db:migrate && bundle exec puma -C config/puma.rb"]

```

---

## The Production Execution Lifecycle: Preloading

As noted in the configuration section, `config.eager_load = true` is mandatory in production.

* **In Development:** Rails uses dynamic lazy loading. It only loads a class file into memory when a request explicitly hits a method that references it. This speeds up boot times while writing code.
* **In Production:** Puma spins up multiple separate worker processes to handle high concurrency. By enabling eager loading, Rails forces the interpreter to load **every single class** into memory *before* cloning the processes. This allows the OS to leverage **Copy-on-Write (CoW)** memory optimization, drastically lowering the aggregate RAM footprint of your server instances.