# Stage 1 — Build React app
FROM node:22-alpine AS builder
WORKDIR /app

# Copy website frontend package files only
COPY frontend/website/package*.json ./frontend/website/
RUN cd frontend/website && npm install

# Copy website frontend source
COPY frontend/website/ ./frontend/website/

# Build website frontend with environment variables
ARG VITE_SITE_URL=https://leetbuddy.app
ARG VITE_VIDEO_URL
ARG VITE_CHROME_STORE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_VIDEO_URL=$VITE_VIDEO_URL
ENV VITE_CHROME_STORE_URL=$VITE_CHROME_STORE_URL
ENV NODE_ENV=production
RUN cd frontend/website && npm run build

# Stage 2 — Backend dependencies
FROM node:22-alpine AS backend-deps
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install production dependencies
RUN cd backend && npm install --omit=dev

# Stage 3 — Final image: NGINX + Node
FROM nginx:stable-alpine

# Install Node.js and dumb-init for proper signal handling
RUN apk add --no-cache nodejs npm dumb-init

# Create app directory
WORKDIR /app

# Copy backend source and dependencies
COPY backend/ ./backend/
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules

# Copy built website frontend to nginx directory
COPY --from=builder /app/frontend/website/dist /usr/share/nginx/html

# Copy NGINX config as template
COPY nginx/default.conf /etc/nginx/templates/default.conf.template

# Build args for internal ports (with defaults)
ARG WEBSITE_PORT=3001
ARG EXTENSION_PORT=3002

# Set environment variables from build args
ENV WEBSITE_PORT=$WEBSITE_PORT
ENV EXTENSION_PORT=$EXTENSION_PORT
ENV NODE_ENV=production

# Create an entrypoint that starts backend then delegates to nginx
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Start backend in background' >> /entrypoint.sh && \
    echo 'cd /app/backend && node index.js &' >> /entrypoint.sh && \
    echo 'BACKEND_PID=$!' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Handle shutdown gracefully - forward SIGQUIT to backend' >> /entrypoint.sh && \
    echo 'trap "kill -QUIT $BACKEND_PID 2>/dev/null || true; wait $BACKEND_PID 2>/dev/null || true; exit" SIGQUIT SIGTERM SIGINT' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Run nginx entrypoint (handles templates + starts nginx)' >> /entrypoint.sh && \
    echo 'exec /docker-entrypoint.sh "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Health check using PORT from environment
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -q --spider http://localhost:${PORT:-10000}/health || exit 1

# Use dumb-init with our wrapper entrypoint
ENTRYPOINT ["dumb-init", "--", "/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]