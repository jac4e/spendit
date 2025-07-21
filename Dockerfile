# 1) Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# 2) Serve stage
FROM nginx:alpine AS web
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy entrypoint and template
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY templates/config.json.template /usr/share/nginx/html/assets/config.json.template
RUN chmod +x /docker-entrypoint.sh

LABEL org.opencontainers.image.source="https://github.com/jac4e/spendit"

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
