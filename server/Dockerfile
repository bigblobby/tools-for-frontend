# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for canvas
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    librsvg-dev \
    pkgconfig

# Copy package files
COPY package*.json ./

# Install dependencies (canvas will build during this step)
RUN npm ci

# Remove build dependencies from builder stage to reduce size
RUN apk del .build-deps

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Install runtime dependencies for canvas (needed at runtime)
RUN apk add --no-cache \
    cairo \
    jpeg \
    pango \
    giflib \
    librsvg

# Copy package files
COPY package*.json ./

# Copy node_modules from builder (already built, including canvas)
COPY --from=builder /app/node_modules ./node_modules

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Note: .env file is loaded via docker-compose env_file directive
# Environment variables are set in docker-compose.yml

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3001

# Start the server
CMD ["node", "dist/index.js"]
