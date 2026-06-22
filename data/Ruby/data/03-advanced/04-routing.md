## Lesson 4: Routing

The Rails router is the dispatch engine of your application. It acts as the initial entry point for all incoming HTTP requests, parsing URLs and mapping them directly to specific controller actions.

---

## The Routing Engine Configuration

All application routes are defined inside a single location: `config/routes.rb`. When a browser transmits an HTTP request, the router searches this file sequentially from top to bottom until it finds a pattern match.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # Strict literal route mapping
  get '/about', to: 'pages#about'
  post '/login', to: 'sessions#create'
end

```

In this syntax, `'pages#about'` maps the path directly to the `PagesController` class and executes its `about` instance method (action).

---

## RESTful Routing and Resources

Rails is heavily built around **REST (Representational State Transfer)**, tracking standard CRUD actions across data resources. Instead of declaring individual routes for every single action manually, Rails provides a single declarative macro: `resources`.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  resources :articles
end

```

This single line automatically generates the **seven standard routes** required to handle complete CRUD interactions for an Article resource:

| HTTP Verb | Path | Controller Action | Named Helper | Purpose |
| --- | --- | --- | --- | --- |
| **`GET`** | `/articles` | `articles#index` | `articles_path` | List all articles |
| **`GET`** | `/articles/new` | `articles#new` | `new_article_path` | Render the creation form |
| **`POST`** | `/articles` | `articles#create` | `articles_path` | Save a new article to the database |
| **`GET`** | `/articles/:id` | `articles#show` | `article_path(:id)` | Display a specific single article |
| **`GET`** | `/articles/:id/edit` | `articles#edit` | `edit_article_path(:id)` | Render the update edit form |
| **`PATCH/PUT`** | `/articles/:id` | `articles#update` | `article_path(:id)` | Modify an existing article's data |
| **`DELETE`** | `/articles/:id` | `articles#destroy` | `article_path(:id)` | Erase an article from the database |

---

## Dynamic Segment Matching (`:id`)

Paths containing colons (like `/articles/:id`) indicate **dynamic segments**. The router matches any arbitrary value placed in that slot and delivers it to the target controller inside a global lookup hash called `params`.

```ruby
# Request: GET /articles/42
class ArticlesController < ApplicationController
  def show
    # params[:id] extracts "42" automatically from the request path
    @article = Article.find(params[:id])
  end
end

```

---

## Scoping and Nesting Routes

When logical relationships exist between database models (as established in Lesson 3), you can mirror those relationships directly inside your routing tables to generate structured, hierarchy-aware URLs.

```ruby
# config/routes.rb
resources :articles do
  resources :comments, only: [:index, :create]
end

```

### Navigating Nested Routes

Nesting constraints force child resources to scope their URLs relative to a parent ID container:

* **Generated Path:** `GET /articles/:article_id/comments`
* **Named Helper:** `article_comments_path(@article)`

Inside the receiving controller, you must extract both IDs to resolve the data context properly:

```ruby
class CommentsController < ApplicationController
  def create
    @article = Article.find(params[:article_id])
    @comment = @article.comments.build(comment_params)
    @comment.save
  end
end

```

---

## Non-RESTful Custom Routes

If your business logic requires actions that fall entirely outside the standard seven REST constraints, you can append custom collection or member sub-routes using explicit blocks:

```ruby
resources :articles do
  member do
    get 'preview' # Acts on a single item: GET /articles/:id/preview
  end

  collection do
    get 'search'  # Acts on the full set: GET /articles/search
  end
end

```