## Lesson 5: Testing Rails Applications

Testing full-stack Rails applications requires validating not just data models and backend logic, but also the user-facing presentation layer and browser interactions. In a standard Rails environment, we expand our testing matrix beyond simple unit tests to incorporate **System Specs** that control a headless browser.

---

## The Full-Stack Testing Matrix Strategy

A balanced Rails test suite relies on a clear hierarchy of testing responsibilities to maximize coverage while optimizing execution speed:

* **Model Specs (Unit Level):** Validate database schema constraints, active record business rules, custom queries, and validations in complete isolation.
* **System Specs (End-to-End Level):** Drive a real, headless browser instance through your application. They test the entire execution stack—including JavaScript execution, CSS rendering, cookie sessions, and multi-page user journeys.

---

## Writing Full-Stack Model Specs

Model specs focus purely on data integrity and business rules. They ensure that bad data cannot bypass application guardrails to corrupt your database.

```ruby
# spec/models/article_spec.rb
require 'rails_helper'

RSpec.describe Article, type: :model do
  describe "validations" do
    it "is valid with a title, body, and author" do
      user = User.new(email: "author@example.com")
      article = Article.new(title: "Ruby Testing", body: "Content goes here", user: user)
      expect(article).to be_valid
    end

    it "is invalid without a title" do
      article = Article.new(title: nil)
      expect(article).not_to be_valid
      expect(article.errors[:title]).to include("can't be blank")
    end
  end
end

```

---

## Writing System Specs (End-to-End Testing)

System specs simulate a real human interacting with your user interface. Under the hood, RSpec pairs with **Capybara** and a headless browser engine (like Headless Chrome) to navigate pages, click buttons, fill out forms, and assert against visible text elements.

```ruby
# spec/system/article_creation_spec.rb
require 'rails_helper'

RSpec.describe "Article Creation Workflow", type: :system do
  before do
    # Configure the test runner to use a headless browser to prevent visual window popups
    driven_by(:selenium_chrome_headless)
    
    # Setup mock data using standard ActiveRecord commands
    @user = User.create!(email: "editor@example.com", password: "secure_password")
  end

  it "allows an authenticated user to successfully author a new article" do
    # 1. Simulate authentication navigation
    visit "/login"
    fill_in "Email", with: @user.email
    fill_in "Password", with: "secure_password"
    click_button "Sign In"

    expect(page).to have_content("Welcome back, #{@user.email}")

    # 2. Navigate to the resource creation form
    click_link "New Article"

    # 3. Fill the form inputs and submit
    fill_in "Title", with: "Scaling Rails with Redis"
    fill_in "Body", with: "This article details production-grade caching strategies."
    click_button "Publish Article"

    # 4. Assert the final UI output state
    expect(page).to have_current_path("/articles/#{Article.last.id}")
    expect(page).to have_content("Article was successfully created.")
    expect(page).to have_css("h1", text: "Scaling Rails with Redis")
  end
end

```

---

## Managing Test Fixtures with FactoryBot

While you can create test data using manual `Model.create!` statements, large test suites quickly become cluttered with repetitive setups. The production standard for managing test data cleanly is **FactoryBot**. Factories act as blueprint templates for generating valid ActiveRecord objects on demand.

### 1. Defining a Factory Blueprint

```ruby
# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    # Use sequences to automatically increment variables and prevent uniqueness validation errors
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "protected_password_123" }
    role { "standard" }

    # Nested traits allow you to modify state attributes dynamically
    trait :admin do
      role { "admin" }
    end
  end
end

```

### 2. Utilizing Factories Inside Specs

Using factories minimizes setup noise inside your test blocks:

```ruby
# Generates and saves a standard user to the test database instantly
user = create(:user)

# Generates an admin user by leveraging the trait macro
admin_user = create(:user, :admin)

# Instantiates an object in memory without writing it to disk (faster execution)
unsaved_user = build(:user)

```