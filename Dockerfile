FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create a non-root user and switch to it
RUN useradd -m appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

CMD ["npm", "start"]
