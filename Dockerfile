# Use the official Node.js image as the base image
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npx vite build

# Use the official nginx image as the base image for serving the built application
FROM nginx:alpine

# Ensure necessary directories exist and have correct permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/tmp/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/tmp/nginx /var/run /usr/share/nginx/html

# Copy the built application from the build stage to the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Ensure that nginx can access the copied files
RUN chown -R nginx:nginx /usr/share/nginx/html

# Change permissions for /var/run directory for nginx user
RUN chmod 755 /var/run && \
    chown nginx:nginx /var/run

# Set the user for Nginx to run as
USER nginx

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx will run on
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
