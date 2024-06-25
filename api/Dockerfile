# Use the official Node.js image as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install dependencies
RUN npm install -g nodemon

 # fix this line
RUN npm install --no-audit

# Copy the rest of the application code
COPY . .

# Expose the port on which your Express app will run
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
