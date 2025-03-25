#!/bin/sh

# Create necessary directories for Nginx temporary files
mkdir -p /tmp/nginx/client_temp /tmp/nginx/proxy_temp /tmp/nginx/fastcgi_temp /tmp/nginx/uwsgi_temp /tmp/nginx/scgi_temp

# Ensure the directories are writable by the non-root user
chown -R appuser:appgroup /tmp/nginx

# Execute the provided command
exec "$@"
