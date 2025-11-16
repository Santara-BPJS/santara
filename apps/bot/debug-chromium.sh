#!/bin/bash
# Debug script to check Chromium setup in Docker container

echo "=== Chromium Debug Information ==="
echo ""

# Check if container is running
if ! docker ps | grep -q santara-whatsapp-bot; then
    echo "❌ Container not running. Start it first:"
    echo "   docker-compose up -d"
    exit 1
fi

echo "✅ Container is running"
echo ""

echo "1. Chromium executable:"
docker exec santara-whatsapp-bot which chromium || echo "   ❌ Chromium not found in PATH"
echo ""

echo "2. Chromium version:"
docker exec santara-whatsapp-bot chromium --version 2>&1 || echo "   ❌ Cannot get Chromium version"
echo ""

echo "3. Check if Chromium can start (headless):"
docker exec santara-whatsapp-bot timeout 10 chromium --headless --no-sandbox --disable-gpu --dump-dom about:blank 2>&1 | head -5 || echo "   ❌ Chromium failed to start"
echo ""

echo "4. Memory available in container:"
docker exec santara-whatsapp-bot free -h
echo ""

echo "5. /dev/shm size:"
docker exec santara-whatsapp-bot df -h /dev/shm
echo ""

echo "6. Container logs (last 20 lines):"
docker logs --tail 20 santara-whatsapp-bot
echo ""

echo "=== Debug Complete ==="
