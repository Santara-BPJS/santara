# syntax=docker/dockerfile:1.4
# Multi-stage Dockerfile for WhatsApp Bot using Bun

# Stage 1: Base with dependencies (cached layer)
FROM oven/bun:1.3.1-debian AS base

# Install system dependencies in a single cached layer
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    libxss1 libxtst6 libx11-xcb1 libxcb-dri3-0 libdrm2 libgbm1 libasound2 \
    libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libnspr4 libnss3 \
    libxcomposite1 libxdamage1 libxfixes3 libxrandr2 ca-certificates \
    libxkbcommon0 libpango-1.0-0 libpangocairo-1.0-0 libcairo2 libglib2.0-0 \
    --no-install-recommends

# Create a directory for Chromium to use
RUN mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix

# Set puppeteer env vars
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Stage 2: Install dependencies (heavily cached)
FROM base AS deps

# Copy package.json files for all workspaces
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY packages/utils/package.json ./packages/utils/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/storage/package.json ./packages/storage/
COPY apps/bot/package.json ./apps/bot/
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/

# Install all dependencies with cache mount
# Continue even if optional packages fail (exit code 1 from 1 failed optional package)
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile || \
    ([ -d node_modules ] && echo "Dependencies installed (some optional packages failed)" && exit 0)

# Stage 3: Builder (minimal - just copy source)
FROM deps AS builder

# Copy source files
COPY packages/db ./packages/db
COPY packages/utils ./packages/utils
COPY apps/bot ./apps/bot

# Stage 4: Production runner (slim)
FROM base AS runner

# Install gosu for safe privilege dropping
RUN apt-get update && apt-get install -y gosu && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1001 botuser && \
    useradd --uid 1001 --gid botuser --shell /bin/bash --create-home botuser

WORKDIR /app

# Copy node_modules from deps stage (where bun install ran)
COPY --from=deps --chown=botuser:botuser /app/node_modules ./node_modules

# Copy source files from builder
COPY --from=builder --chown=botuser:botuser /app/packages/db ./packages/db
COPY --from=builder --chown=botuser:botuser /app/packages/utils ./packages/utils
COPY --from=builder --chown=botuser:botuser /app/apps/bot ./apps/bot

# Copy entrypoint script
COPY apps/bot/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create data directories (will be overridden by volume mounts)
RUN mkdir -p /app/data && chown -R botuser:botuser /app/data

WORKDIR /app/apps/bot

VOLUME ["/app/data"]

ENV NODE_ENV=production \
    AUTH_INFO_PATH=/app/data/auth_info \
    WWEBJS_CACHE_PATH=/app/data/.wwebjs_cache

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD pgrep -f bun || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["bun", "run", "src/index.ts"]
