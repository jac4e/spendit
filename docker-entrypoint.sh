#!/bin/sh
# Replace placeholders with environment variable values
envsubst < /usr/share/nginx/html/assets/config.json.template > /usr/share/nginx/html/assets/app-settings.development.json
envsubst < /usr/share/nginx/html/assets/config.json.template > /usr/share/nginx/html/assets/app-settings.production.json

# Start nginx
exec nginx -g 'daemon off;'
