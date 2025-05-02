# Stage 1: Build
FROM node:23.11.0-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:23.11.0-alpine AS runner

# Environment variables
ENV NODE_ENV=production

# Create app directory and use non-root user
WORKDIR /home/node/app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy only the necessary artifacts from builder
COPY --chown=appuser:appgroup --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --from=builder /app/prisma ./prisma
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup --from=builder /app/package.json ./

# (Optional) Expose app port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main.js"]
