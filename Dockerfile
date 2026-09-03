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

# Install nginx
RUN apk add --no-cache nginx

WORKDIR /app


# -------------------------
# NestJS
# -------------------------

COPY backend/package*.json ./backend/

RUN cd backend && npm ci 

COPY --from=backend-builder /app/backend/dist ./backend/dist


# -------------------------
# React
# -------------------------

COPY --from=frontend-builder /app/frontend/dist \
    /usr/share/nginx/html


# -------------------------
# Nginx
# -------------------------

COPY nginx/nginx.conf \
    /etc/nginx/http.d/default.conf.template


# -------------------------
# Start
# -------------------------

CMD ["sh", "-c", "\
sed \"s/\\${PORT}/$PORT/g\" /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf && \
cd /app/backend && \
npm run migration:run:prod && \
npm run seed:prod && \
node dist/main.js & \
nginx -g 'daemon off;' \
"]