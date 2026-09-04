# =========================================================
# 1. Build React frontend
# =========================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

RUN npm run build


# =========================================================
# 2. Build NestJS backend
# =========================================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./

RUN npm run build


# =========================================================
# 3. Production image
# =========================================================
FROM node:20-alpine

# Install nginx + curl
RUN apk add --no-cache nginx curl

WORKDIR /app


# =========================================================
# NestJS
# =========================================================

COPY backend/package*.json ./backend/

RUN cd backend && npm ci

COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY backend/src/mail/templates ./backend/src/mail/templates

# =========================================================
# React
# =========================================================

COPY --from=frontend-builder /app/frontend/dist \
    /usr/share/nginx/html


# =========================================================
# Nginx
# =========================================================

COPY nginx/nginx.conf \
    /etc/nginx/http.d/default.conf.template


# =========================================================
# Start
# =========================================================
CMD ["sh", "-c", "\
echo '=== Starting ==='; \
sed \"s/\\${PORT}/$PORT/g\" /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf; \
cd /app/backend; \
echo '=== Migration ==='; \
npm run migration:run:prod || exit 1; \
echo '=== Seed ==='; \
npm run seed:prod || exit 1; \
echo '=== Starting NestJS ==='; \
node dist/main.js & \
NEST_PID=$!; \
sleep 3; \
kill -0 $NEST_PID 2>/dev/null || exit 1; \
echo '=== Starting nginx ==='; \
nginx -g 'daemon off;' \
"]