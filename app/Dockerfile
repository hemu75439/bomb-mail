# Stage 1: Build the application
FROM node:18-slim AS builder


# RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json .
# COPY pnpm-lock.yaml ./
# COPY . .

# Install dependencies
RUN npm install --no-audit
# RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app/package*.json .
# COPY --from=builder pnpm-lock.yaml .
# COPY --from=builder /usr/src/app/.nuxt ./.nuxt
# COPY --from=builder /usr/src/app/static ./static
# COPY --from=builder /usr/src/app/nuxt.config.js ./
# COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/.output ./.output

# Expose the port the app runs on
EXPOSE 3000

# Command to start the application
# CMD ["npm", "run", "start"]
CMD [ "node", ".output/server/index.mjs" ]
