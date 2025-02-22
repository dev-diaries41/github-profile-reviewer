# Use an official Node.js runtime as a base image
FROM node:18

# Install required dependencies. This is needed for puppeteer to work in docker
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
    

# Create a new user with a specific UID and GID
RUN groupadd -r newuser && useradd -r -m -g newuser newuser

# Set the working directory inside the container
WORKDIR /home/newuser/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining application code and set ownership
COPY --chown=newuser:newuser . .

# Ensure the /home/newuser/app directory is writable
RUN chown -R newuser:newuser /home/newuser/app

# Build the TypeScript code
RUN npm run build

# Change to the newuser user
USER newuser

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "dist/index.js"]
