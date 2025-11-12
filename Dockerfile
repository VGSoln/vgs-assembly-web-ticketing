# Frontend Dockerfile for VGS Assembly Web Ticketing
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using legacy-peer-deps due to react-leaflet React 18/19 conflict)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start development server on port 3001
CMD ["npm", "run", "dev", "--", "-p", "3001"]
