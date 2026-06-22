## Lesson 7: Performance and Optimization

When scaling a Rails application to handle high traffic production environments, execution bottlenecks shift from the CPU to **database efficiency**, **memory usage**, and **caching**. Writing high-performance Rails requires understanding how ActiveRecord communicates with the database and where to intercept the execution pipeline to save compute cycles.

---

## The N+1 Query Problem

The N+1 query problem is the single most common performance killer in database-backed applications. It occurs when your code executes one initial query to fetch a parent collection, and then executes an additional query *for every single record* in that collection to load its associated data.

```ruby
# PRODUCTION ANTI-PATTERN: Triggers an N+1 Query
articles = Article.limit(10)

articles.each do |article|
  # Every loop iteration fires a separate SQL query to fetch the user name!
  puts article.user.name 
end

```

In this scenario, if you fetch 10 articles, you execute **11 queries total** (1 to fetch the articles, plus 10 individual hits to the `users` table). If you fetch 1,000 articles, your database will collapse under 1,001 queries.

### The Fix: Eager Loading (`includes`)

To solve this, use the `.includes` method. This tells ActiveRecord to load the associations upfront in a single, optimized query using an `IN` clause.

```ruby
# SECURE & OPTIMIZED: Triggers exactly 2 SQL queries total
articles = Article.includes(:user).limit(10)

articles.each do |article|
  puts article.user.name # Reads from memory cache instantly; no database hit
end

```

---

## Memory Bloat: `each` vs. `find_each`

Loading too many ActiveRecord instances into memory simultaneously causes memory bloat. If you run `User.all.each` on a production database with 500,000 records, Rails attempts to instantiate all 500,000 Ruby objects into RAM at once, spiking memory consumption and freezing the server during Garbage Collection sweeps.

### The Fix: Batch Processing (`find_each`)

The `find_each` method handles large datasets safely by querying records in batches (defaulting to 1,000 at a time) and freeing them from memory before pulling the next set.

```ruby
# Production-safe large dataset processing
User.where(active: true).find_each(batch_size: 2000) do |user|
  user.generate_compliance_report
end

```

---

## The Caching Tier

Caching bypasses heavy computation and database queries entirely by saving processed data to a blazing-fast, in-memory key-value store like **Redis** or **Memcached**.

### 1. Low-Level Caching

Low-level caching allows you to store specific evaluation results or API payloads directly within a customized cache key window.

```ruby
def external_market_rates
  # Checks if 'market_rates' key exists in Redis. 
  # If it does, returns it instantly. If not, runs the block and saves the output for 15 minutes.
  Rails.cache.fetch("market_rates", expires_in: 15.minutes) do
    ThirdPartyFinancialApi.fetch_current_rates
  end
end

```

### 2. Fragment Caching

Fragment caching stores chunks of rendered HTML inside your view templates. Rails intelligently hooks onto ActiveRecord's `updated_at` timestamps to automatically expire the cache when a database record is modified (known as Russian Doll caching).

```erb
<%# app/views/articles/index.html.erb %>
<% @articles.each do |article| %>
  <%# Cache key automatically updates if the article's updated_at timestamp shifts %>
  <% cache article do %>
    <div class="article-card">
      <h2><%= article.title %></h2>
      <p><%= article.truncated_body %></p>
    </div>
  <% end %>
<% end %>

```

---

## Selective Data Extraction: `pluck` vs. `map`

If you only need a single specific column value from a collection of records, loading full ActiveRecord objects is unnecessary overhead.

* **`map`** loads every database column, maps them into heavy ActiveRecord objects in RAM, and then discards everything except the targeted field.
* **`pluck`** bypasses object instantiation completely. It queries *only* the requested column and returns them as a raw array of Ruby primitives.

```ruby
# Slow, high memory footprint
emails = User.all.map { |u| u.email }

# Fast, highly optimized SQL execution (SELECT users.email FROM users)
emails = User.pluck(:email)

```