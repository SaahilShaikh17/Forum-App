FROM node:18-alpine

FROM node:18-alpine

# Set the working directory inside the container to /server
WORKDIR /server

# Copy only the package.json and package-lock.json to install dependencies
COPY server/package*.json ./

# Install server dependencies
RUN npm install

# Copy the rest of the server code into the /server directory
COPY server/ .

# Expose the backend port
EXPOSE 5000

# Command to start the server
CMD ["npm", "start"]

