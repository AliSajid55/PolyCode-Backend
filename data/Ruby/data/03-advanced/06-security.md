## Lesson 6: Security in Rails

Rails is engineered with a "secure by default" philosophy. It includes built-in mitigations for the most common web vulnerabilities outlined in the OWASP Top 10. However, understanding how these automated defenses function—and where human error can accidentally bypass them—is critical for protecting production data.

---

## Cross-Site Scripting (XSS)

XSS occurs when an application accepts untrusted user input and renders it directly onto a webpage without escaping it, allowing malicious JavaScript to execute in a victim's browser.

### The Rails Defense: Automated HTML Escaping

By default, the Rails ERB view layer automatically HTML-escapes all strings rendered via the `<%= %>` tag, converting dangerous characters (like `<`, `>`, `&`) into safe HTML entities.

```erb
<%# If user_input is "<script>stealCookies();</script>" %>
<%= user_input %>
<%# Rails safely renders: &lt;script&gt;stealCookies();&lt;/script&gt; %>

```

### Bypassing Safety (The Danger Zone)

If you deliberately need to render raw HTML (e.g., from a rich-text markdown editor), you can bypass escaping using the `.html_safe` method or the `raw` view helper.

```ruby
# DANGER ZONE: If user_input contains malicious JS, you have an XSS vulnerability
<%= user_input.html_safe %>
<%= raw(user_input) %>

```

*Best Practice:* Never call `.html_safe` directly on unvalidated, raw user parameter inputs. If you must render HTML raw, pass it through an explicit sanitization library first, such as the `sanitize` helper method, which strips out script tags while keeping safe formatting tags like `<b>` or `<i>`.

---

## SQL Injection (SQLi)

SQL Injection happens when raw string manipulation is used to construct database queries, allowing a malicious actor to inject custom SQL commands to bypass authentication or drop tables.

### The Rails Defense: Parameterized Queries

ActiveRecord natively sanitizes arguments passed as hashes or arrays into your search queries, separating the SQL command structure from the data parameters.

```ruby
# SECURE: Rails automatically parameterizes and binds the input safely
User.where(email: params[:email])
User.where("email = ?", params[:email])

```

### Bypassing Safety (The Danger Zone)

Passing a dynamically constructed string directly into a pure SQL fragment string entirely bypasses ActiveRecord's sanitization layer.

```ruby
# DANGER ZONE: Vulnerable to SQL Injection
# If params[:email] is "admin@test.com' OR '1'='1", it returns all users
User.where("email = '#{params[:email]}'")

```

---

## Cross-Site Request Forgery (CSRF)

CSRF tricking a victim's browser into executing an unwanted action (such as changing an email or transferring funds) on a trusted site where the user is currently authenticated.

### The Rails Defense: Authenticity Tokens

Rails mitigates CSRF attacks by embedding a unique, cryptographic, session-tied token into every non-GET form render, and validating that token upon form submission.

1. **Token Insertion:** The `form_with` helper macro automatically generates a hidden input field named `authenticity_token` in your HTML forms.
2. **Controller Enforcement:** The root controller forces verification using the `protect_from_forgery` macro:

```ruby
class ApplicationController < ActionController::Base
  # Automatically drops the session or raises an exception if the CSRF token is missing/invalid
  protect_from_forgery with: :exception 
end

```

---

## Mass Assignment (Strong Parameters)

Mass assignment occurs when a user submits unexpected model parameters via an HTTP request (e.g., passing `user[admin]=true` inside a profile updates form), allowing them to alter protected database columns.

### The Rails Defense: Strong Parameters

Rails enforces strict controller-level access controls to whitelist exactly which parameters are permitted to modify an ActiveRecord model.

```ruby
class UsersController < ApplicationController
  def update
    @user = User.find(params[:id])
    # Permits name and email updates, but silently drops admin or balance fields
    if @user.update(user_params)
      redirect_to @user
    end
  end

  private

  def user_params
    # Require the parent key to be present, and whitelist specific internal scalar values
    params.require(:user).permit(:name, :email)
  end
end

```