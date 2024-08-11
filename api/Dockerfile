# Use the official Node.js image as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# # Copy package.json and package-lock.json to the working directory
# COPY package.json .
# COPY pnpm-lock.yaml ./

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g nodemon
RUN npm install -g pnpm

 # fix this line
# RUN npm install --no-audit
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your Express app will run
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
