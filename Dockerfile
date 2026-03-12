# Stage 1: Vendor
FROM php:8.2-fpm as vendor

ENV NODE_VERSION=18.18.0
ENV COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zlib1g-dev \
    libzip-dev \
    zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_mysql gd mbstring exif pcntl bcmath xml zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Node.js (using nvm)
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} && nvm use v${NODE_VERSION} && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

WORKDIR /var/www

# Install dependencies
COPY project/composer.json project/composer.lock ./
RUN composer install --no-scripts --no-autoloader --no-interaction --ignore-platform-reqs

COPY project/package.json ./
# Remove lock file if it's from Windows
RUN rm -f package-lock.json && npm install

# Stage 2: Application
FROM php:8.2-fpm as app

WORKDIR /var/www

# Install runtime dependencies for PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng16-16 \
    libjpeg62-turbo \
    libfreetype6 \
    libonig5 \
    libxml2 \
    zlib1g \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy extensions and binaries from vendor stage
COPY --from=vendor /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=vendor /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
COPY --from=vendor /usr/bin/composer /usr/bin/composer
COPY --from=vendor /var/www/vendor /var/www/vendor
COPY --from=vendor /var/www/node_modules /var/www/node_modules
COPY --from=vendor /root/.nvm /root/.nvm
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=18.18.0
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
ENV APP_URL=http://localhost:8000

# Copy application code first, then the built vendor/node_modules
# Actually, the other way around is better to avoid overwriting them if they exist on host
# But COPY project/ ./ will overwrite everything if we are not careful.
# Since we have .dockerignore, project/vendor and project/node_modules will not be copied.
COPY project/ ./

# Build assets (using node_modules from vendor stage)
RUN npm run production

# Optimize autoloader
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/public

# Create storage link
RUN rm -rf public/storage && php artisan storage:link

EXPOSE 9000
CMD ["php-fpm"]
