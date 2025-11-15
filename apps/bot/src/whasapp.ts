import { Context, Effect, Layer, Runtime } from "effect";
import qrcode from "qrcode-terminal";
import { Client, LocalAuth, type Message } from "whatsapp-web.js";
import { AIService } from "./ai-service";
import { CacheService } from "./cache-service";
import { ConversationMemory } from "./conversation-memory";
import type { ConversationMessage } from "./types";

// Service interface with Effect-based methods
class WhatsApp extends Context.Tag("WhatsApp")<
  WhatsApp,
  {
    readonly sendMessage: (
      to: string,
      message: string
    ) => Effect.Effect<void, Error>;
    readonly getClient: Effect.Effect<Client, never>;
  }
>() {}

// Create layer with proper resource management
export const WhatsAppLive = Layer.scoped(
  WhatsApp,
  Effect.gen(function* () {
    // Get services and runtime for executing Effects in event handlers
    const aiService = yield* AIService;
    const conversationMemory = yield* ConversationMemory;
    const cacheService = yield* CacheService;
    const runtime = yield* Effect.runtime<
      AIService | ConversationMemory | CacheService
    >();
    const runFork = Runtime.runFork(runtime);

    // Create and acquire WhatsApp client as a managed resource
    const authPath = process.env.AUTH_INFO_PATH || "./auth_info";
    const chromiumPath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;

    const client = yield* Effect.acquireRelease(
      Effect.try({
        try: () =>
          new Client({
            authStrategy: new LocalAuth({
              dataPath: authPath,
            }),
            puppeteer: {
              headless: true,
              executablePath: chromiumPath,
              args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process",
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
                "--disable-features=TranslateUI",
                "--disable-ipc-flooding-protection",
                "--disable-hang-monitor",
                "--disable-popup-blocking",
                "--disable-prompt-on-repost",
                "--disable-sync",
                "--disable-extensions",
                "--metrics-recording-only",
                "--no-default-browser-check",
                "--mute-audio",
                "--hide-scrollbars",
              ],
            },
          }),
        catch: (error) =>
          new Error(`Failed to create WhatsApp client: ${String(error)}`),
      }),
      // Cleanup function - destroy client on scope close
      (existingClient) =>
        Effect.gen(function* () {
          // Only destroy if client was initialized
          if (existingClient.pupBrowser) {
            yield* Effect.tryPromise({
              try: () => existingClient.destroy(),
              catch: (error) => error as Error,
            }).pipe(Effect.catchAll(() => Effect.void));
          } else {
            yield* Effect.log(
              "WhatsApp client was not fully initialized, skipping cleanup"
            );
          }
        })
    );

    // Setup event handlers with proper Effect execution
    client.on("ready", () => {
      const effect = Effect.gen(function* () {
        const url = new URL(`https://wa.me/+${client.info.wid.user}`);
        yield* Effect.log(
          `🔗 Bot WhatsApp siap! Akses melalui: ${url.toString()}`
        );
        yield* Effect.log(`📱 Nama bot: ${client.info.pushname}`);
        yield* Effect.log(`📞 Nomor bot: ${client.info.wid.user}`);
        yield* Effect.log("🤖 Bot sekarang mendengarkan pesan...\n");
      }).pipe(
        Effect.catchAll((error) =>
          Effect.log(`Error in ready handler: ${String(error)}`)
        )
      );

      runFork(effect);
    });

    client.on("qr", (qr: string) => {
      const effect = Effect.gen(function* () {
        yield* Effect.log("QR code diterima, pindai untuk mengautentikasi:");
        yield* Effect.sync(() => {
          qrcode.generate(qr, { small: true });
        });
      }).pipe(
        Effect.catchAll((error) =>
          Effect.log(`Error in QR handler: ${String(error)}`)
        )
      );

      runFork(effect);
    });

    client.on("authenticated", () => {
      const effect = Effect.gen(function* () {
        yield* Effect.log("Berhasil diautentikasi dengan WhatsApp.");
      }).pipe(
        Effect.catchAll((error) =>
          Effect.log(`Error in authenticated handler: ${String(error)}`)
        )
      );

      runFork(effect);
    });

    client.on("auth_failure", (msg: string) => {
      const effect = Effect.gen(function* () {
        yield* Effect.log(
          `Gagal mengautentikasi dengan WhatsApp: ${msg}. Coba lagi.`
        );
      }).pipe(
        Effect.catchAll((error) =>
          Effect.log(`Error in auth_failure handler: ${String(error)}`)
        )
      );

      runFork(effect);
    });

    client.on("disconnected", (reason: string) => {
      const effect = Effect.gen(function* () {
        yield* Effect.log(
          `Terputus dari WhatsApp: ${reason}. Menghubungkan ulang...`
        );
      }).pipe(
        Effect.catchAll((error) =>
          Effect.log(`Error in disconnected handler: ${String(error)}`)
        )
      );

      runFork(effect);
    });

    client.on("message", (message: Message) => {
      const effect = Effect.gen(function* () {
        // Skip bot's own messages
        if (message.fromMe) {
          return;
        }

        const chatId = message.from;
        const messageBody = message.body;

        yield* Effect.log(`Pesan diterima dari ${chatId}: ${messageBody}`);

        // Step 1: Store incoming message in conversation memory
        const userMessage: ConversationMessage = {
          timestamp: Date.now(),
          sender: chatId,
          role: "user",
          content: messageBody,
        };

        yield* conversationMemory.addMessage(chatId, userMessage);
        yield* Effect.log("User message added to conversation memory");

        // Step 2: Check cache for exact match
        const cachedResponse = yield* cacheService.get(messageBody);
        if (cachedResponse) {
          yield* Effect.log("Cache hit! Using cached response");

          yield* Effect.tryPromise({
            try: () => message.reply(cachedResponse),
            catch: (error) =>
              new Error(`Failed to send cached reply: ${String(error)}`),
          });

          // Store bot's cached response in memory
          const botMessage: ConversationMessage = {
            timestamp: Date.now(),
            sender: "bot",
            role: "assistant",
            content: cachedResponse,
          };
          yield* conversationMemory.addMessage(chatId, botMessage);

          return;
        }

        yield* Effect.log("Cache miss, checking if should reply...");

        // Step 3: Get conversation context (last 10 messages)
        const context = yield* conversationMemory.getHistory(chatId, 10);

        // Step 4: Ask AI if should reply
        const shouldReply = yield* aiService
          .shouldReply(messageBody, context)
          .pipe(
            Effect.catchAll((error) =>
              Effect.gen(function* () {
                yield* Effect.log(
                  `AI shouldReply error: ${String(error)}. Defaulting to NO.`
                );
                return false;
              })
            )
          );

        if (!shouldReply) {
          yield* Effect.log("AI decided NOT to reply. Skipping.");
          return;
        }

        yield* Effect.log("AI decided to reply. Generating response...");

        // Step 5: Generate response with context
        const response = yield* aiService
          .generateResponse(messageBody, context)
          .pipe(
            Effect.catchAll((error) =>
              Effect.gen(function* () {
                yield* Effect.log(
                  `AI response generation error: ${String(error)}. Using fallback.`
                );
                return "Maaf, saya sedang tidak bisa merespons sekarang. Coba lagi nanti ya!";
              })
            )
          );

        // Step 6: Cache the response
        yield* cacheService.set(messageBody, response);
        yield* Effect.log("Response cached for future use");

        // Step 7: Send reply
        yield* Effect.log(`Mengirim balasan: ${response}`);

        yield* Effect.tryPromise({
          try: () => message.reply(response),
          catch: (error) => new Error(`Failed to send reply: ${String(error)}`),
        });

        // Step 8: Store bot's response in memory
        const botMessage: ConversationMessage = {
          timestamp: Date.now(),
          sender: "bot",
          role: "assistant",
          content: response,
        };
        yield* conversationMemory.addMessage(chatId, botMessage);

        yield* Effect.log(`Successfully replied to ${chatId}`);
      }).pipe(
        Effect.catchAll((error) =>
          Effect.log(`Error in message handler: ${String(error)}`)
        )
      );

      runFork(effect);
    });

    client.on("group_join", (notification) => {
      const effect = Effect.gen(function* () {
        yield* Effect.log(`Bot ditambahkan ke grup: ${notification.chatId}`);
      }).pipe(
        Effect.catchAll((error) =>
          Effect.log(`Error in group_join handler: ${String(error)}`)
        )
      );

      runFork(effect);
    });

    // Initialize the client - this returns a Promise
    yield* Effect.tryPromise({
      try: () => client.initialize(),
      catch: (error) =>
        new Error(`Failed to initialize WhatsApp client: ${String(error)}`),
    });

    yield* Effect.log("WhatsApp client initialized successfully");

    // Return service implementation with Effect-based methods
    return {
      sendMessage: (to: string, message: string) =>
        Effect.tryPromise({
          try: () => client.sendMessage(to, message),
          catch: (error) =>
            new Error(`Failed to send message: ${String(error)}`),
        }).pipe(Effect.asVoid),
      getClient: Effect.succeed(client),
    };
  })
);

export { WhatsApp };
