# Build frontend stage
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY client/ .

# Copy .env file if it exists (for Vite environment variables)
# Vite automatically reads .env files during build
COPY client/.env* ./

# Build the frontend application
# Vite will embed VITE_* environment variables at build time
RUN npm run build

# Caddy stage
FROM caddy:2-alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built frontend files from frontend-builder stage
COPY --from=frontend-builder /app/dist /usr/share/caddy

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]

