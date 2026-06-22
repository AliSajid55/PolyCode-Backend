## Lesson 5: Background Jobs (ActiveJob)

In a production web application, keeping the HTTP request-response cycle as fast as possible is critical. If a user triggers an action that takes a long time to complete—like sending a welcome email, processing a heavy file upload, or calling a slow third-party API—running that logic synchronously inside the controller will freeze the web browser and lock up server resources.

To solve this, Rails uses **Background Jobs** via the **ActiveJob** framework. ActiveJob allows you to hand off time-consuming tasks to a separate asynchronous queue infrastructure, letting your controller return an immediate response to the client.

---

## ActiveJob Architecture & Infrastructure

ActiveJob is a standard abstraction layer built into Rails. It provides a uniform API regardless of which specialized queuing backend runner you use in production.

To operate background jobs in a real system, you need three components:

1. **ActiveJob (The Rails API):** The built-in framework used to write job logic and declare parameters.
2. **The Queuing Engine / Runner (e.g., Sidekiq, Solid Queue):** An independent multi-threaded process that watches a queue and executes jobs sequentially.
3. **The Storage Backend (e.g., Redis, PostgreSQL):** A persistent data store where serialized job payloads wait until a runner picks them up.

---

## Generating and Defining a Job

You can generate a brand new job skeleton using the Rails CLI:

```bash
$ rails generate job SendSystemAlert

```

This creates a specialized file inside the `app/jobs/` directory:

```ruby
# app/jobs/send_system_alert_job.rb
class SendSystemAlertJob < ApplicationJob
  queue_as :default # Determines which queue priority lane this job sits in

  # The perform method holds the actual code that executes asynchronously
  def perform(user_id, alert_message)
    user = User.find(user_id)
    NotificationService.deliver(email: user.email, message: alert_message)
  rescue StandardError => e
    # Standard Ruby exception handling can be encapsulated cleanly inside the job shell
    Rails.logger.error("Failed to deliver alert to user #{user_id}: #{e.message}")
  end
end

```

---

## Enqueuing Strategies

Once a job is defined, you call it from your controllers or models using execution macros instead of instantiating the class directly. ActiveJob automatically handles serializing your arguments into JSON to pass them to the backend storage layer.

```ruby
# 1. Asynchronous Execution (Most Common)
# Enqueues the job to be executed immediately as soon as a worker is free.
SendSystemAlertJob.perform_later(user.id, "Your account profile has updated.")

# 2. Scheduled / Delayed Execution
# Pushes the job payload into the storage layer but flags it to wait for a specific time window.
SendSystemAlertJob.set(wait: 2.hours).perform_later(user.id, "Follow-up alert.")
SendSystemAlertJob.set(wait_until: Date.tomorrow.noon).perform_later(user.id, "Daily digest.")

```

> **The Object Serialization Rule:** When passing data into `perform_later`, try to pass basic system primitives (Integers, Strings, Symbols) or GlobalID-supported ActiveRecord models directly. Avoid passing complex, transient in-memory objects (like raw file streams or open network connections), because they cannot be cleanly converted into text strings inside the storage backend.

---

## Resiliency: Retries and Error Handling

Background jobs frequently interact with unstable external systems (like third-party payment gateways or SMS APIs). ActiveJob provides robust, declarative macros to automatically manage failures and re-run dropped jobs without manual intervention.

```ruby
class SendSystemAlertJob < ApplicationJob
  queue_as :notifications

  # Automatically retry the job if the external network api is down
  # wait: :exponentially_longer implements backoff (e.g., 3s, 15s, 63s...) to prevent hammering a broken server
  retry_on Net::OpenTimeout, wait: :exponentially_longer, attempts: 5

  # Discard the job cleanly if the user row was deleted before the worker ran
  discard_on ActiveRecord::RecordNotFound

  def perform(user_id, alert_message)
    # Core logic here
  end
end

```