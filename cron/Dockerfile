# Use the official Node.js image
FROM node:18-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install --no-audit

# Copy the application code
COPY . .

# Command to run the cron job
CMD ["npm", "start"]