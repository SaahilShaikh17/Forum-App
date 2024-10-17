FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /client

COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client code into the container
COPY client/ .

# Expose the port that the React app will run on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
