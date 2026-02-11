# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose Vite dev backend port
EXPOSE 5173

# Start Vite in dev mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]