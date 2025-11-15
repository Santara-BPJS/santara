#!/bin/bash
# Fast Docker build script with BuildKit

set -e

echo "🚀 Building Santara WhatsApp Bot with BuildKit..."
echo ""
echo "ℹ️  Note: Some optional packages may fail to install (e.g., @biomejs/biome)"
echo "   This is expected and won't affect the bot - it will continue building."
echo ""

# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build from project root
cd ../..

echo "📦 Building Docker image..."
docker build \
  -f apps/bot/Dockerfile \
  -t santara-bot:latest \
  --progress=plain \
  .

echo ""
echo "✅ Build complete!"
echo ""
echo "To run the bot:"
echo "  docker run -d --name santara-bot -e GOOGLE_API_KEY=your_key -v santara-data:/app/data santara-bot:latest"
echo ""
echo "Or use docker-compose:"
echo "  cd apps/bot && docker-compose up -d"
