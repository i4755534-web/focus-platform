# Multi-stage Docker build for production optimization with security hardening
# Use multi-arch base images
FROM --platform=$BUILDPLATFORM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc* ./

# Install dependencies with security audit
RUN npm ci --only=production --ignore-scripts && npm audit --audit-level high && npm cache clean --force

# Stage 2: Builder
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build application
RUN npm run build

# Stage 3: Runner with distroless image for security
FROM gcr.io/distroless/nodejs18-debian12 AS runner
WORKDIR /app

# Create non-root user (distroless has non-root by default)
# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Health check (using distroless base which includes curl)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["/busybox/sh", "-c", "wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1"]

# Start application
CMD ["server.js"]