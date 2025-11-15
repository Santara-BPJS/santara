/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: TODO */
/** biome-ignore-all lint/style/noMagicNumbers: TODO */
import { Command } from "@effect/cli";
import { FileSystem } from "@effect/platform";
import { Effect } from "effect";
import { AIServiceLive } from "./ai-service";
import { CacheServiceLive } from "./cache-service";
import { ConversationMemoryLive } from "./conversation-memory";
import { WhatsApp, WhatsAppLive } from "./whasapp";

const main = Command.make("start", {}, () =>
  Effect.gen(function* () {
    yield* Effect.log("Starting WhatsApp bot...");

    // Access the WhatsApp service to ensure it's initialized
    yield* WhatsApp;

    // Log successful startup
    yield* Effect.log("WhatsApp bot is running.");
    yield* Effect.log("Press 'q' or type 'quit' to stop the bot.");

    // Handle graceful shutdown on stdin input and SIGTERM
    yield* Effect.async<void>((resume) => {
      let buffer = "";
      let isShuttingDown = false;

      const cleanup = () => {
        process.stdin.removeListener("data", onData);
        process.removeAllListeners("SIGTERM");
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.pause();
      };

      const handleShutdown = (reason: string) => {
        // Prevent multiple shutdown calls
        if (isShuttingDown) {
          return;
        }
        isShuttingDown = true;

        // Clean up listeners immediately
        cleanup();

        Effect.gen(function* () {
          yield* Effect.log(`${reason}. Shutting down WhatsApp bot...`);
        })
          .pipe(Effect.catchAll((error) => Effect.log(String(error))))
          .pipe(Effect.runPromise);

        resume(Effect.void);
      };

      // Enable stdin to listen for input
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }
      process.stdin.resume();
      process.stdin.setEncoding("utf8");

      const onData = (key: string) => {
        // Check for 'q' key press
        if (key === "q" || key === "Q") {
          handleShutdown("Received 'q' key");
          return;
        }

        // Check for Ctrl+C
        if (key === "\u0003") {
          handleShutdown("Received Ctrl+C");
          return;
        }

        // Accumulate buffer for 'quit' command
        if (key === "\r" || key === "\n") {
          if (buffer.trim().toLowerCase() === "quit") {
            handleShutdown("Received 'quit' command");
            return;
          }
          buffer = "";
        } else if (key === "\u007f" || key === "\b") {
          // Backspace
          buffer = buffer.slice(0, -1);
        } else if (key.charCodeAt(0) >= 32 && key.charCodeAt(0) <= 126) {
          // Printable characters
          buffer += key;
        }
      };

      process.stdin.on("data", onData);
      process.on("SIGTERM", () => handleShutdown("Received SIGTERM"));

      // Cleanup function (in case resume is called from elsewhere)
      return Effect.sync(cleanup);
    });

    yield* Effect.log("Bot stopped. Cleaning up resources...");
  }).pipe(
    Effect.provide(WhatsAppLive),
    Effect.provide(AIServiceLive),
    Effect.provide(ConversationMemoryLive),
    Effect.provide(CacheServiceLive),
    Effect.onExit((exit) =>
      Effect.gen(function* () {
        if (exit._tag === "Failure") {
          yield* Effect.log(`Bot exited with error: ${String(exit.cause)}`);
        } else {
          yield* Effect.log("Bot shutdown complete.");
        }
      })
    ),
    Effect.catchAll((error) =>
      Effect.gen(function* () {
        yield* Effect.log(`Failed to start WhatsApp bot: ${String(error)}`);
        yield* Effect.fail(error);
      })
    )
  )
);

const whatsappAuth = Command.make("auth").pipe(
  Command.withSubcommands([
    Command.make("reset", {}, () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;

        yield* fs.remove("./auth_info", { recursive: true });

        yield* Effect.log("WhatsApp authentication data has been reset.");
      }).pipe(
        Effect.catchAll((error) =>
          Effect.gen(function* () {
            yield* Effect.log(
              `Failed to reset authentication: ${String(error)}`
            );
            yield* Effect.fail(error);
          })
        )
      )
    ),
  ])
);

const command = Command.withSubcommands(main, [whatsappAuth]);

export const cli = Command.run(command, {
  name: "bot",
  version: "1.0.0",
});
