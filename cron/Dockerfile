# Use the official Node.js image
FROM node:18-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    libnss3 \
    libgtk-3-0 \
    libgbm1 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libatspi2.0-0 \
    lsb-release \
    xdg-utils \
    xvfb \
    --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*


ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Install pnpm
RUN npm install -g pnpm

# Create and change to the app directory
WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY . .

# Install dependencies
RUN pnpm install

# Copy the application code
COPY . .

RUN npm i puppeteer -y

# # Install chrome
# RUN npx puppeteer browsers install chrome

# Command to run the cron job
CMD ["npm", "start"]