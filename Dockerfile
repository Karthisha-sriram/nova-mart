# Multi-stage production Dockerfile for NOVA MART on Azure App Service / Cloud Run
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build frontend and compile backend
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy runtime packages
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

EXPOSE 3000

CMD ["npm", "start"]
