# Use Node.js as base image but add Python support
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements and install Python dependencies
COPY requirements.txt Pipfile* ./
RUN python3 -m pip install -r requirements.txt

# Copy Node.js package files
COPY server/package*.json ./server/
COPY app/package*.json ./app/

# Install Node.js dependencies
RUN cd server && npm install
RUN cd app && npm install

# Copy all application files
COPY . .

# Build the React frontend
RUN cd app && npm run build

# Expose port
EXPOSE 3000

# Set working directory to server
WORKDIR /app/server

# Start the Node.js server
CMD ["npm", "start"]