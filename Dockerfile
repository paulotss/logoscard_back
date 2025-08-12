FROM node:20

WORKDIR /app

# Give ownership of the workdir to the node user
RUN chown node:node /app

# Switch to non-root user for safety
USER node

# Copy only the package files first
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY --chown=node:node . .

EXPOSE 3001

# Default command (used if docker-compose doesn't override it)
CMD ["npm", "run", "dev"]
