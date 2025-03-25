# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
RUN npm install --package-lock-only

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Create a non-root user with id=40000
RUN addgroup -g 40000 appgroup && adduser -u 40000 -G appgroup -s /bin/sh -D appuser

# Set permissions for the Nginx directories and create writable directories for temporary files
RUN mkdir -p /tmp/nginx/client_temp /tmp/nginx/proxy_temp /tmp/nginx/fastcgi_temp /tmp/nginx/uwsgi_temp /tmp/nginx/scgi_temp && \
    chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/log/nginx /tmp/nginx

# Replace the default Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add an entrypoint script to create necessary directories at runtime
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Switch to the non-root user
USER appuser

# Expose port 8080
EXPOSE 8080

# Use the entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Start Nginx server without overriding the PID directive
CMD ["nginx", "-g", "daemon off;"]