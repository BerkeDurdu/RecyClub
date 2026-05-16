# RecyClub Backend — multi-stage Dockerfile (SAD v2 §6.4)
# Stage 1: install full deps for a clean prune; Stage 2: copy prod deps only.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Non-root user for security
RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY config ./config
COPY scripts ./scripts
COPY src ./src
COPY server.js ./

USER app
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "server.js"]
