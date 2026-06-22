## Lesson 6: DevOps for PHP

In production environments, deploying PHP applications manually via FTP or running shell commands directly on a server is an anti-pattern. Modern PHP DevOps bridges development and infrastructure by automating testing, integration, and delivery using containerization and automated orchestration pipelines.

---

## 1. Containerizing PHP Applications with Docker

Docker eliminates the "it works on my machine" problem by packaging your PHP runtime, Nginx configuration, and application dependencies into a single, predictable container image.

In production, it is a best practice to separate the web server (**Nginx**) from the PHP processing engine (**PHP-FPM**) into independent, specialized containers that communicate over a local network bridge.

### The Application Blueprint (`Dockerfile`)

This file defines how the PHP application container image is built, optimized, and secured.

```dockerfile
# 1. Use the official PHP-FPM alpine image for a minimal security footprint
FROM php:8.2-fpm-alpine

# 2. Install system dependencies and native PHP extensions needed for production
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip

# 3. Pull the official Composer binary directly from its verified image source
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Configure the working directory context inside the container filesystem
WORKDIR /var/www/html

# 5. Copy the application source code into the image container
COPY . .

# 6. Run production optimization installations
RUN composer install --no-dev --optimize-autoloader

# 7. Change filesystem ownership to the non-root web server user for safety
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]

```

---

## 2. Local Environment Orchestration via Docker Compose

To link your application, an Nginx web proxy, and a database instance together locally or in staging environments without manual configuration networking, use a `docker-compose.yml` manifest file.

```yaml
version: '3.8'

services:
  # The PHP Processing Engine
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: php_app_engine
    volumes:
      - .:/var/www/html
    networks:
      - app_network

  # The Reverse Proxy Web Server
  nginx:
    image: nginx:alpine
    container_name: php_nginx_proxy
    ports:
      - "80:80"
    volumes:
      - .:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    networks:
      - app_network

networks:
  app_network:
    driver: bridge

```

---

## 3. Continuous Integration pipelines (GitHub Actions)

Continuous Integration (CI) enforces code quality by automatically executing linting checks, security audits, and your PHPUnit test suites every single time a developer pushes code or opens a Pull Request on GitHub.

### The Integration Workflow Layout (`.github/workflows/ci.yml`)

```yaml
name: PHP Continuous Integration Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  laravel-tests:
    runs-on: ubuntu-latest

    services:
      # Spin up a live dynamic MySQL engine instance for database testing integration
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ALLOW_EMPTY_PASSWORD: yes
          MYSQL_DATABASE: testing_db
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
    - name: Checkout Code Repository Source
      uses: actions/checkout@v3

    - name: Setup PHP Environment Execution Thread
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: mbstring, dom, fileinfo, pdo_mysql
        coverage: none

    - name: Install Project Dependencies
      run: composer install --prefer-dist --no-progress

    - name: Prepare Test Environment Configurations
      run: |
        cp .env.example .env
        php artisan key:generate

    - name: Execute Automated Test Suites via PHPUnit
      env:
        DB_CONNECTION: mysql
        DB_HOST: 127.0.0.1
        DB_PORT: 3306
        DB_DATABASE: testing_db
        DB_USERNAME: root
      run: ./vendor/bin/phpunit

```

---

## 4. Zero-Downtime Deployment Strategies

When deploying updates to a live production server, you cannot take the application offline while copying new files or running database migrations. To keep the app active 100% of the time, DevOps architectures use specific deployment mechanics:

### Symlink Swapping (Atomic Deployments)

Instead of overwriting the active files in place, your deployment script clones the new release into a fresh, isolated directory timestamp. Once all optimizations (`composer install`, `config:cache`, etc.) and database migrations run successfully, a Linux **Symlink** (symbolic link pointer) shifts instantly to point Nginx to the new directory.

```
Before Swap: /var/www/html/current ---> Points to ---> /var/www/html/releases/v1.0
After Swap:  /var/www/html/current ---> Points to ---> /var/www/html/releases/v1.1

```

If something crashes during initialization, the link is never swapped, keeping your live traffic safe on the original version.

### Blue-Green Deployments

In containerized clusters (like Kubernetes or AWS ECS), you run two identical infrastructure environments called **Blue** (Current Live Production) and **Green** (New Release Stage). Traffic is routed entirely to Blue. You deploy and verify the container images on Green. Once verified, the load balancer shifts traffic completely from Blue to Green instantly.