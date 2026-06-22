## Lesson 6: Hotwire and Turbo

**Hotwire** (HTML Over The Wire) is an alternative approach to building modern, reactive web applications without writing complex JavaScript frameworks like React or Vue. Instead of sending raw JSON payloads and rendering components client-side, Hotwire keeps your template logic on the server, sending fully rendered HTML fragments directly over a persistent WebSocket connection or standard HTTP cycles.

The heart of Hotwire is **Turbo**, a suite of complementary techniques designed to maximize page speed and live interactivity.

---

## The Four Pillars of Turbo

Turbo splits its responsibilities across four distinct layers to speed up navigation, form submissions, and localized updates.

### 1. Turbo Drive

Turbo Drive accelerates standard multi-page web navigation. When a user clicks a link or submits a form, Turbo Drive intercepts the browser's default behavior. Instead of tearing down the entire DOM and reloading script assets, it fetches the page in the background via `fetch()`, swaps out the current `<body>` element, and merges the new `<head>` content cleanly without a full browser refresh.

### 2. Turbo Frames

Turbo Frames allow you to divide your web pages into completely isolated, independent context blocks. When an interaction occurs inside a specific frame, only that frame's content changes—the rest of the page remains entirely static.

```erb
<%# app/views/articles/show.html.erb %>
<h1><%= @article.title %></h1>

<%= turbo_frame_tag "article_comments" do %>
  <%= render @article.comments %>
  <%= link_to "Load More Comments", article_comments_path(@article, page: 2) %>
<% end %>

```

### 3. Turbo Streams

Turbo Streams deliver precise, live updates to any part of the page in response to asynchronous operations or backend database updates. Streams use a collection of standard CRUD-like actions (`append`, `prepend`, `replace`, `remove`, `update`) to alter targeted DOM nodes by matching their structural HTML IDs.

```ruby
# An incoming controller action can choose to render a Turbo Stream instead of a standard redirect
def create
  @comment = @article.comments.build(comment_params)

  if @comment.save
    respond_to do |format|
      format.html { redirect_to @article }
      # Directly targets the 'comments_list' DOM node on the live page and appends the new partial template
      format.turbo_stream { render turbo_stream: turbo_stream.append("comments_list", @comment) }
    end
  end
end

```

### 4. Turbo Native

Turbo Native helps wrap your HTML-over-the-wire web applications into native iOS and Android shells. It allows your web view elements to coordinate directly with native device navigation bars and system components.

---

## Live Real-Time Updates with ActionCable

To achieve reactive user experiences (like live chat rooms or real-time notifications), Turbo Streams can broadcast changes globally to all active connected browsers by integrating directly with **ActionCable** (Rails' WebSocket system).

You can configure your ActiveRecord models to automatically push out updates across active WebSocket lines the moment data shifts in the database:

```ruby
# app/models/comment.rb
class Comment < ApplicationRecord
  belongs_to :article

  # Lifecycle Hook: Automatically broadcasts this new comment to any client watching this specific article's feed
  after_create_commit -> { broadcast_append_to "article_#{article_id}_comments", target: "comments_list" }
end

```

On the front-end view template, you subscribe to this live broadcast stream using a single declarative helper:

```erb
<%# app/views/articles/show.html.erb %>
<%= turbo_stream_from "article_#{@article.id}_comments" %>

<div id="comments_list">
  <%= render @article.comments %>
</div>

```