## Lesson 2: Authentication

Authentication is the process of verifying a user's identity—proving that they are exactly who they claim to be. When building REST APIs with Rails, authentication shifts away from traditional browser sessions and cookies toward stateless, token-based systems. The industry standard for securing stateless API communication is **JSON Web Tokens (JWT)**.

---

## The Core Blueprint: Token-Based Authentication

Unlike traditional web applications where the server stores session data in memory or a database, a stateless API server does not remember clients between requests.

Instead, the client exchanges valid credentials (username and password) for a cryptographically signed token. The client then stores this token locally and transmits it inside the HTTP **Authorization Header** for every subsequent request.

---

## Securing Passwords with `has_secure_password`

You must never store raw, plaintext user passwords in a database. Rails provides a built-in macro called `has_secure_password` that handles secure password hashing automatically using the **bcrypt** cryptographic algorithm.

### 1. Database Prerequisite

Your `users` table must possess a column named exactly `password_digest` to store the encrypted hash strings.

```ruby
# db/migrate/20260622130000_add_password_digest_to_users.rb
class AddPasswordDigestToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :password_digest, :string
  end
end

```

### 2. Model Configuration

Adding the macro to your model validates password presence on creation and exposes the `.authenticate` verification method.

```ruby
# app/models/user.rb
class User < ApplicationRecord
  # Automates password hashing, confirmation verification, and secure handling
  has_secure_password

  validates :email, presence: true, uniqueness: true
end

```

---

## Implementing JWT Token Encoding and Decoding

To manage JWT lifetimes safely, create a dedicated infrastructure utility service inside your `app/services/` or `lib/` directory to handle payload encoding and decoding using your application's secure master key.

```ruby
# app/services/jwt_service.rb
class JwtService
  # Fetch the application's unique secret key used to sign tokens
  SECRET_KEY = Rails.application.credentials.secret_key_base

  # Encode a payload hash into an encrypted token string
  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  # Decode a token string back into an accessible payload hash
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError
    nil # Return nil if token has expired or signature is corrupt
  end
end

```

---

## The Authentication Execution Pipeline

To lock down secure API endpoints, you intercept requests within your controllers using helper filters that extract and validate incoming authorization credentials.

### 1. The Central Guard (ApplicationController)

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :authenticate_request!

  attr_reader :current_user

  private

  def authenticate_request!
    # Extract the token from the Authorization header: "Bearer <token>"
    header = request.headers['Authorization']
    token = header.split(' ').last if header.present?
    decoded = JwtService.decode(token) if token

    # Find the user or halt execution with an explicit API error
    @current_user = User.find_by(id: decoded[:user_id]) if decoded

    render json: { error: "Not Authorized" }, status: :unauthorized unless @current_user
  end
end

```

### 2. The Authentication Action (AuthenticationController)

To allow users to log in and fetch a token initially, create a controller dedicated to handling user verification, and explicitly bypass the global authentication filter.

```ruby
# app/controllers/api/v1/authentication_controller.rb
class Api::V1::AuthenticationController < ApplicationController
  # Skip the credential check so public users can hit the login endpoint
  skip_before_action :authenticate_request!, only: [:login]

  def login
    user = User.find_by(email: params[:email])

    # .authenticate is exposed by has_secure_password to verify plaintext vs digest hash
    if user && user.authenticate(params[:password])
      token = JwtService.encode(user_id: user.id)
      render json: { token: token, user_id: user.id }, status: :ok
    else
      render json: { error: "Invalid email or password credentials" }, status: :unauthorized
    end
  end
end

```

### 3. Protecting Secure Endpoints

Any controller inheriting from `ApplicationController` automatically requires a valid token out of the box.

```ruby
# app/controllers/api/v1/profiles_controller.rb
class Api::V1::ProfilesController < ApplicationController
  # This action is fully protected; only executes if authenticate_request! succeeds
  def show
    render json: { status: "Authenticated", user: current_user.email }
  end
end

```