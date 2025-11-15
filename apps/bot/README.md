# Santara WhatsApp Bot

AI-powered WhatsApp bot with conversation memory, caching, and smart reply decisions.

## Features

- 🤖 **AI-Powered Responses**: Uses Google Gemini for natural conversations
- 💾 **Conversation Memory**: Remembers context per chat (last 20 messages)
- ⚡ **Response Caching**: Caches identical messages for 1 hour
- 🎯 **Smart Reply Detection**: AI decides when to respond
- 🔄 **Graceful Shutdown**: Press 'q' or Ctrl+C to exit safely

## Local Development

### Prerequisites

- [Bun](https://bun.sh) v1.3.1 or later
- Google AI API Key ([Get one here](https://aistudio.google.com/apikey))

### Setup

1. **Install dependencies** (from project root):
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   ```bash
   cd apps/bot
   cp .env.example .env
   # Edit .env and add your GOOGLE_API_KEY
   ```

3. **Start the bot**:
   ```bash
   bun run dev
   ```

4. **Authenticate with WhatsApp**:
   - Scan the QR code with WhatsApp on your phone
   - WhatsApp > Settings > Linked Devices > Link a Device

5. **Reset authentication** (if needed):
   ```bash
   bun run dev auth reset
   ```

## Docker Deployment

### Quick Build (Fastest)

Use the provided build script:
```bash
cd apps/bot
./build.sh
```

This automatically enables BuildKit and optimized caching.

### Using Docker Compose (Recommended)

1. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env and add your GOOGLE_API_KEY
   ```

2. **Build and start the bot** (with BuildKit for faster builds):
   ```bash
   DOCKER_BUILDKIT=1 docker-compose up -d --build
   ```

3. **View logs to scan QR code**:
   ```bash
   docker-compose logs -f bot
   ```

4. **Subsequent starts** (no rebuild needed):
   ```bash
   docker-compose up -d
   ```

5. **Stop the bot**:
   ```bash
   docker-compose down
   ```

6. **Reset authentication**:
   ```bash
   # Remove the authentication volume
   docker-compose down -v
   docker-compose up -d
   ```

**Build Performance Tips:**
- First build: ~2-3 minutes (downloads Chromium + packages)
- Subsequent builds: ~30 seconds (uses cached layers)
- Enable BuildKit for 3-5x faster builds: `export DOCKER_BUILDKIT=1`

### Using Docker directly

1. **Build the image** (from project root with BuildKit):
   ```bash
   DOCKER_BUILDKIT=1 docker build -f apps/bot/Dockerfile -t santara-bot .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name santara-bot \
     -e GOOGLE_API_KEY=your_key_here \
     -v santara-data:/app/data \
     santara-bot
   ```

3. **View logs**:
   ```bash
   docker logs -f santara-bot
   ```

**Note:** Always use `DOCKER_BUILDKIT=1` for faster builds!

## Architecture

### Services

- **AIService**: Google Gemini integration for response generation and reply decisions
- **ConversationMemory**: In-memory storage of last 20 messages per chat
- **CacheService**: 1-hour TTL cache for identical message responses
- **WhatsApp**: WhatsApp Web.js client with event handlers

### Message Flow

1. Receive message → Skip if from bot
2. Store message in conversation memory
3. Check cache for exact match → Return if hit
4. Get last 10 messages as context
5. Ask AI: "Should I reply?"
6. If yes → Generate response with context
7. Cache response → Send reply → Store in memory

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Google AI Studio API key |
| `DATABASE_URL` | No | PostgreSQL connection string (if needed) |
| `AUTH_INFO_PATH` | No | Custom path for WhatsApp auth (default: `./auth_info`) |
| `WWEBJS_CACHE_PATH` | No | Custom path for WhatsApp cache (default: `./.wwebjs_cache`) |

### Customization

Edit `src/ai-service.ts` to customize:
- **Prompt personality**: Line 92-95 (response generation)
- **Reply decision logic**: Line 46-59 (shouldReply criteria)
- **AI model**: Line 70, 102 (`gemini-2.5-flash`)
- **Timeouts**: Line 77 (shouldReply: 15s), Line 109 (generateResponse: 30s)

Edit `src/conversation-memory.ts`:
- **Max messages**: Line 6 (`MAX_MESSAGES_PER_CHAT = 20`)

Edit `src/cache-service.ts`:
- **Cache TTL**: Line 6 (`CACHE_TTL_MS = 1 hour`)
- **Cleanup interval**: Line 7 (`CLEANUP_INTERVAL_MS = 5 minutes`)

## Commands

### Development
```bash
bun run dev              # Start development server
bun run dev auth reset   # Reset WhatsApp authentication
```

### Production
```bash
bun run build            # Build for production
bun run start start      # Start production server
bun run compile          # Compile standalone binary
```

### Docker
```bash
docker-compose up -d          # Start container
docker-compose down           # Stop container
docker-compose down -v        # Stop and remove volumes
docker-compose logs -f bot    # View logs
docker-compose restart bot    # Restart bot
```

## Troubleshooting

### Docker build warnings about failed packages
- Some optional dependencies may fail to install (e.g., `@biomejs/biome` platform-specific binaries)
- This is **expected and normal** - the build continues if core packages are installed
- The bot only needs: `whatsapp-web.js`, `@effect/*`, `qrcode-terminal`
- Optional dev tools (biome, lefthook) are not needed at runtime

### QR Code not showing
- Check logs: `docker-compose logs -f bot`
- Ensure port 3000 is not blocked
- Try resetting auth: `docker-compose down -v && docker-compose up -d`

### Bot not responding
- Check AI service logs for errors
- Verify `GOOGLE_API_KEY` is set correctly
- Check if shouldReply is working: Look for "Should reply decision" in logs

### Cleanup errors on shutdown
- Errors like `null is not an object (evaluating 'this.pupBrowser.close')` during shutdown are harmless
- This happens if the bot exits before WhatsApp client fully initializes
- The cleanup is now defensive and won't crash - just logs a warning

### Permission denied errors (EACCES)
- The container starts as root to fix volume permissions, then drops to `botuser` for security
- If you see "permission denied" errors, ensure volumes are properly mounted
- The entrypoint script automatically fixes `/app/data` permissions at startup

### Out of memory errors
- Increase Docker memory limit in `docker-compose.yml`
- Reduce `MAX_MESSAGES_PER_CHAT` in `conversation-memory.ts`

### Puppeteer/Chromium errors
- **Docker**: Chromium is pre-installed with all dependencies and 2GB shared memory
- **Local**: Install Chromium: `brew install chromium` (macOS) or `apt install chromium` (Linux)
- If you see "Protocol error" or "Session closed": The container might need more memory or shared memory
  - Increase memory in `docker-compose.yml` under `deploy.resources.limits.memory`
  - Shared memory is already set to 2GB in the compose file

## License

Private - Santara Project
