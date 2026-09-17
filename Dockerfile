# =======================================================
#  ExploreX - Production Container Dockerfile
# =======================================================

# Stage 1: Build Frontend & Backend Bundles
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy full application source code
COPY . .

# Build Vite frontend and bundled Node server (dist/server.cjs)
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built assets and server binary from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data_store.json ./data_store.json
COPY --from=builder /app/public ./public

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

# Expose server port
EXPOSE 3000

# Start production server
CMD ["node", "dist/server.cjs"]
