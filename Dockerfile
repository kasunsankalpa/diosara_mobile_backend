# Use Node base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build NestJS project
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
