# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - use unprivileged nginx
FROM nginxinc/nginx-unprivileged:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure correct permissions
USER root
RUN chmod -R 755 /usr/share/nginx/html && \
    mkdir -p /tmp/client_body /tmp/proxy /tmp/fastcgi /tmp/uwsgi /tmp/scgi && \
    chmod -R 777 /tmp
USER nginx

# HF Spaces port
EXPOSE 7860

CMD ["nginx", "-g", "daemon off;"]
