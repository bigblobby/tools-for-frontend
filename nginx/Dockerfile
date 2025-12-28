# Build frontend stage
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY client/ .

# Build the frontend application
RUN npm run build

# Nginx stage
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files from frontend-builder stage
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
