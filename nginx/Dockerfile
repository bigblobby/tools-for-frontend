# Build frontend stage
FROM node:20-alpine AS frontend-builder

# Accept build argument for Node.js memory limit
ARG NODE_OPTIONS=""
ENV NODE_OPTIONS=$NODE_OPTIONS

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

# Nginx stage
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
# Unified config works with or without SSL certificates
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files from frontend-builder stage
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
