## Lesson 1: REST APIs with Rails

When building a modern web application, Rails is often stripped of its traditional HTML-rendering view layer and deployed strictly as a **Headless API server**. In this architecture, Rails acts as a high-performance backend that serves structured data payloads (typically JSON) to client-side single-page applications (like React, Vue, or mobile apps).

---

## Configuring a Lightweight API-Only Application

A standard Rails application boots up with middleware designed for browser interactions (like cookies, flash messages, sessions, and asset management pipelines). For a pure data API, these layers introduce unnecessary resource overhead.

You can initialize a lightweight, streamlined Rails instance optimized purely for API routing from the CLI:

```bash
$ rails new market_api --api

```

### What the `--api` Flag Alters Under the Hood:

* **Controller Hierarchy:** Configures `ApplicationController` to inherit from `ActionController::API` instead of `ActionController::Base`. This drops browser-specific modules like CSRF protection, cookies, and explicit HTML form rendering helpers.
* **Middleware Stack:** Strips down the internal tracking stack to exclude asset generation, session engines, and view layout compilation systems.
* **Generators:** Alters scaffolding commands to automatically bypass creating HTML view files, generating only data-routing controllers and schema migration scripts.

---

## Rendering Structured JSON

In an API context, the controller's responsibility shifts from rendering an ERB template to formatting data payloads via serialization streams.

```ruby
# app/controllers/api/v1/articles_controller.rb
module Api
  module V1
    class ArticlesController < ApplicationController
      
      def index
        @articles = Article.all
        # Renders the collection directly into a JSON array with an HTTP 200 OK status
        render json: @articles, status: :ok
      end

      def show
        @article = Article.find(params[:id])
        render json: @article, status: :ok
      rescue ActiveRecord::RecordNotFound => e
        # Standard API error-handling response format
        render json: { error: "Resource not found", details: e.message }, status: :not_found
      end

    end
  end
end

```

---

## Explicit API Versioning and Routing

Production APIs require strict version control boundaries (e.g., `v1`, `v2`) to ensure that shipping backend updates doesn't breaking older, live client applications relying on fixed payload structures.

You implement version control in your routing table using structural namespaces:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :articles, only: [:index, :show, :create, :update, :destroy]
    end
  end
end

```

### The Resulting Controller and Directory Architecture

To match the routing map above, your file directory must be structured hierarchically, and your controllers must be nested inside matching explicit Ruby modules:

* **File Location:** `app/controllers/api/v1/articles_controller.rb`
* **Class Definition:** `class Api::V1::ArticlesController < ApplicationController`
* **URL Endpoint Pattern:** `GET /api/v1/articles`

---

## Handling Serializers (Data Masking)

Passing a raw ActiveRecord model directly into `render json:` is a security and performance anti-pattern. Doing so forces Rails to serialize every single column in that database row—including internal attributes, hashed password strings, and system tokens—and expose them to the web.

To isolate and pick exactly which fields to output, use a dedicated serialization engine like the `jsonapi-serializer` or custom resource classes.

```ruby
# app/serializers/article_serializer.rb
class ArticleSerializer
  include JSONAPI::Serializer
  
  # Whitelist exactly which attributes are permitted to be exposed in the payload
  attributes :title, :slug, :truncated_content
  
  # Declare associations to include nested relational blocks programmatically
  belongs_to :user
end

```

Inside your controller, you wrap your data with this serializer before passing it to the render stream:

```ruby
def show
  @article = Article.find(params[:id])
  # Generates a secured, explicitly formatted data schema
  render json: ArticleSerializer.new(@article).serializable_hash.to_json
end

```