# ── Stage 1: Install production dependencies ─────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# ── Stage 2: Build the application ───────────────────────────
FROM deps AS builder

# Copy source (node_modules already in deps layer)
COPY . .

RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────
FROM node:20-alpine AS runner

# Create non-root group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy compiled output and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=deps    /app/node_modules ./node_modules
COPY package.json   ./

# Drop privileges
USER appuser

EXPOSE 3001

CMD ["node", "dist/main.js"]
