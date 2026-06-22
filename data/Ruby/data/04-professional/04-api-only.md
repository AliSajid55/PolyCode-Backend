## Lesson 4: API-Only Rails Deep Dive

While Lesson 1 introduced Headless APIs conceptually, building a high-performance, API-only production system requires an advanced understanding of the underlying middleware architecture. Choosing an API-only profile isn't just about changing what your controllers return; it's a structural reconfiguration of the Rails request handling pipeline.

---

## The Middleware Stack: What Gets Stripped

The core difference between a standard Rails application and an API-only application lies in the **Middleware Stack**. Every HTTP request passes through a sequence of internal wrapper modules before reaching your routing table.

To inspect your current application's active middleware layer, execute the following command in your terminal:

```bash
$ bin/rails middleware

```

In an API-only configuration, Rails completely removes several bulky, browser-specific middleware components to optimize throughput and lower memory consumption per request:

| Middleware Removed | Core Browser Responsibility | Rationale for API Removal |
| --- | --- | --- |
| `ActionDispatch::Cookies` | Manages browser-side cookie jars. | API clients store stateless authentication tokens (like JWTs) locally. |
| `ActionDispatch::Session::CookieStore` | Orchestrates server-managed user sessions. | APIs are designed to be entirely stateless. |
| `ActionDispatch::Flash` | Handles temporary, single-redirect notice messages. | Messages are handled on the client UI based on backend JSON response keys. |
| `Rack::MethodOverride` | Inspects hidden `_method` form params to simulate PUT/DELETE. | Native API clients directly transmit true HTTP verbs natively. |

---

## ActionController::API vs. ActionController::Base

By stripping browser dependencies, your base controller configuration shifts to a lighter architectural footprint.

```ruby
# Standard Web App base class:
class ApplicationController < ActionController::Base; end

# API-Only App base class:
class ApplicationController < ActionController::API; end

```

By inheriting from `ActionController::API`, your controllers drop resource-intensive modules like template rendering engines, asset pipeline integration, and form forgery protection, while keeping core data routines:

* **`ActionController::StrongParameters`** (Data whitelisting guards)
* **`ActionController::Rendering`** (Data rendering pipelines)
* **`ActionController::Callbacks`** (`before_action` execution filters)

---

## Restoring Selective Middleware (The Hybrid Exception)

Occasionally, a production API must support a specific browser-centric feature—such as integrating an administrative panel that relies on cookie sessions, or providing third-party OAuth authentication. Rails allows you to surgically inject individual middleware components back into your API-only stack.

You configure these exceptions inside your `config/application.rb` manifest:

```ruby
# config/application.rb
module MarketApi
  class Application < Rails::Application
    config.load_defaults 7.0
    
    # Configure the app profile as API-only upfront
    config.api_only = true

    # Surgically restore cookie and session management back into the engine
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: '_market_session'
  end
end

```

---

## Streamlined Serialization: Fast JSON API Parsing

When serving thousands of API requests per second, the time spent converting ActiveRecord objects into JSON text strings can become a CPU bottleneck. Standard rendering formats (like `jbuilder` or old `active_model_serializers`) evaluate lazily and incur high memory overhead.

Modern production-grade Rails APIs deploy highly optimized, class-based serializers like `jsonapi-serializer` (derived from Fast JSON API), which uses a pre-compiled structural cache map to maximize throughput.

```ruby
# app/serializers/user_serializer.rb
class UserSerializer
  include JSONAPI::Serializer
  
  # Structural fields exposed to the wire
  attributes :email, :role
  
  # Dynamically computed attributes wrapped cleanly without modifying the model layer
  attribute :account_status do |object|
    object.active? ? "Verified" : "Action Required"
  end
end

```

Inside your controller, passing an ActiveRecord collection through a class-based serializer outputs an optimized data payload significantly faster than raw reflection:

```ruby
def index
  users = User.limit(100)
  
  # Returns a highly optimized JSON string complying with the JSON:API standard specification
  render json: UserSerializer.new(users).serializable_hash.to_json, status: :ok
end

```