## Lesson 4: Deployment

Deploying a Laravel application to production requires moving away from local development shortcuts (like `php artisan serve`) and configuring a highly secure, performant server environment. A standard production stack typically runs on a **LEMP** engine (Linux, Nginx, MySQL, PHP-FPM).

---

## 1. The Production Environment File (`.env`)

The `.env` file houses your production credentials, API keys, and environment toggles. Missing a single setting here can leak internal codebase errors to the public or slow down performance.

```ini
APP_NAME=LaravelProduction
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

; CRITICAL: Never use a default or local key. 
; Generate a unique 32-character encryption key via: php artisan key:generate
APP_KEY=base64:XyZ...

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=prod_database
DB_USERNAME=prod_user
DB_PASSWORD=highly_secure_non_default_password

```

### Critical Security Toggles

* **`APP_ENV=production`**: Instructs the framework and third-party packages to run under strict production rules.
* **`APP_DEBUG=false`**: **Non-negotiable.** If left `true`, any runtime exception or database error will dump a full visual stack trace to the public web user, exposing database passwords, paths, and environment variables.

---

## 2. Server Configuration: Nginx Virtual Host Blueprint

Nginx does not process PHP code natively; it acts as a reverse proxy that receives HTTP traffic and routes it to **PHP-FPM** via a local Unix socket.

### Production Nginx Virtual Host Config (`/etc/nginx/sites-available/app.conf`)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    
    # CRITICAL: Always point the server root directly to Laravel's /public folder, NEVER the project root.
    root /var/www/html/your-project/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    # Core Laravel Request Routing Layout
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    # Forwarding PHP scripts to the PHP-FPM execution engine socket
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Verify your exact PHP version path
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Block access to hidden configuration files (.env, .git)
    location ~ /\.(?!well-known).* {
        deny all;
    }
}

```

---

## 3. Directory Permissions and Ownership

For security reasons, your web server should never run as the standard user or root. On Linux systems, Nginx and PHP-FPM run under the system user **`www-data`**. Your codebase files must be owned by this user, or at minimum, the server must have write permissions to the storage and cache directories.

Execute these commands in your production terminal inside your project root:

```bash
# 1. Change the ownership of the codebase files recursively to the web server user
sudo chown -R www-data:www-data /var/www/html/your-project

# 2. Grant explicit structural read/write rights to the cache and storage directories
sudo find /var/www/html/your-project -type f -exec chmod 644 {} \;
sudo find /var/www/html/your-project -type d -exec chmod 755 {} \;

# 3. Laravel requires runtime write rights inside these specific directories
sudo chmod -R 775 /var/www/html/your-project/storage
sudo chmod -R 775 /var/www/html/your-project/bootstrap/cache

```

---

## 4. Production Optimization Deployment Checklist

When deploying to a live server, running raw runtime calculations slows down performance. You must pre-compile configurations, routes, and views into static cache arrays.

A standard production deployment script includes the following operations:

```bash
# Pull the latest code changes from your main branch
git pull origin main

# Install packages excluding development tools
composer install --no-dev --optimize-autoloader

# 1. Compile configuration settings into a single flat file
php artisan config:cache

# 2. Compile route maps into a performant lookup array
php artisan route:cache

# 3. Pre-compile Blade template engines into raw HTML/PHP segments
php artisan view:cache

# 4. Run database migrations safely (The --force flag disables interactive confirmation prompts)
php artisan migrate --force

```

---

## 5. Deployment Commands Summary

| Artisan Optimization Command | Execution Effect | Reversal Command |
| --- | --- | --- |
| **`php artisan config:cache`** | Combines all config files into a single cached file for rapid reading. | `php artisan config:clear` |
| **`php artisan route:cache`** | Compiles the route table into a fast lookup array, bypassing parsing cycles. | `php artisan route:clear` |
| **`php artisan view:cache`** | Pre-renders Blade views into optimized code so they load instantly on request. | `php artisan view:clear` |
| **`php artisan migrate --force`** | Runs remaining database schema migrations without requiring manual confirmation. | N/A |