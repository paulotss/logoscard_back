#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Railway deployment..."

# Build the TypeScript files
echo "📦 Building TypeScript files..."
npm run build

# Run database migrations
echo "🗄️  Running database migrations..."
npm run migrate

# Start the server
echo "🌟 Starting server..."
npm start 