# Build stage
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS runner

# Create /data directory for HF Spaces persistent storage
RUN mkdir -p /data && chmod 777 /data

# Use /tmp for nginx writable paths
RUN mkdir -p /tmp/nginx && chmod 777 /tmp/nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set permissions
RUN chmod -R 755 /usr/share/nginx/html

# HF Spaces configuration
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"
EXPOSE 7860

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
