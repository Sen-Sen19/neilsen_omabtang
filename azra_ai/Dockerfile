# Use an official PHP image
FROM php:8.2-cli

# Install curl extension for PHP
RUN apt-get update && apt-get install -y curl unzip && docker-php-ext-install curl

# Copy your PHP code to /app
WORKDIR /app
COPY . .

# Expose port (for Railway)
EXPOSE 8080

# Start PHP built-in server
CMD ["php", "-S", "0.0.0.0:8080"]
