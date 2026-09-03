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
echo '========================================'; \
echo 'STARTING CONTAINER'; \
echo '========================================'; \
echo \"PORT=$PORT\"; \
echo \"NODE_VERSION=$(node --version)\"; \
echo \"Working directory=$(pwd)\"; \
echo ''; \
echo '--- Files ---'; \
ls -la /app/backend; \
echo ''; \
echo '--- Dist ---'; \
ls -la /app/backend/dist; \
echo ''; \
echo '--- Nginx config template ---'; \
cat /etc/nginx/http.d/default.conf.template; \
echo ''; \
echo '--- Generating nginx config ---'; \
sed \"s/\\${PORT}/$PORT/g\" /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf; \
cat /etc/nginx/http.d/default.conf; \
echo ''; \
echo '--- Testing nginx config ---'; \
nginx -t; \
echo ''; \
echo '--- Running migrations ---'; \
cd /app/backend; \
npm run migration:run:prod; \
echo '--- Migration finished ---'; \
echo ''; \
echo '--- Running seed ---'; \
npm run seed:prod; \
echo '--- Seed finished ---'; \
echo ''; \
echo '========================================'; \
echo 'STARTING NESTJS'; \
echo '========================================'; \
node dist/main.js > /tmp/nest.log 2>&1 & \
NEST_PID=$!; \
echo \"NestJS PID=$NEST_PID\"; \
sleep 5; \
echo ''; \
echo '--- NestJS logs ---'; \
cat /tmp/nest.log; \
echo ''; \
echo '--- NestJS process ---'; \
ps; \
echo ''; \
echo '--- Testing NestJS :3000 ---'; \
curl -i http://127.0.0.1:3000/ || true; \
echo ''; \
echo '--- Testing NestJS API ---'; \
curl -i 'http://127.0.0.1:3000/api/posts?limit=10&page=1' || true; \
echo ''; \
if kill -0 $NEST_PID 2>/dev/null; then \
    echo '========================================'; \
    echo 'NestJS IS RUNNING'; \
    echo '========================================'; \
else \
    echo '========================================'; \
    echo 'ERROR: NestJS DIED'; \
    echo '========================================'; \
    exit 1; \
fi; \
echo ''; \
echo '========================================'; \
echo 'STARTING NGINX'; \
echo '========================================'; \
nginx -g 'daemon off;' \
"]