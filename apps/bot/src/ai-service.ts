import { LanguageModel } from "@effect/ai";
import { GoogleClient, GoogleLanguageModel } from "@effect/ai-google";
import { NodeHttpClient } from "@effect/platform-node";
import { Config, Context, Effect, Layer } from "effect";
import type { ConversationMessage } from "./types";

// AI Service interface
export class AIService extends Context.Tag("AIService")<
  AIService,
  {
    readonly shouldReply: (
      message: string,
      context: readonly ConversationMessage[]
    ) => Effect.Effect<boolean, Error>;
    readonly generateResponse: (
      message: string,
      context: readonly ConversationMessage[]
    ) => Effect.Effect<string, Error>;
  }
>() {}

// Helper to build conversation context string
const buildContextString = (
  context: readonly ConversationMessage[]
): string => {
  if (context.length === 0) {
    return "";
  }

  return context
    .map((msg) => {
      const role = msg.role === "user" ? "User" : "Assistant";
      return `${role}: ${msg.content}`;
    })
    .join("\n");
};

// Implementation using Google Gemini
export const AIServiceLive = Layer.effect(
  AIService,
  Effect.gen(function* () {
    return {
      shouldReply: (message: string, context: readonly ConversationMessage[]) =>
        Effect.gen(function* () {
          yield* Effect.log("Checking if should reply to message...");

          const contextStr = buildContextString(context);
          const prompt = `You are analyzing whether a WhatsApp bot should reply to a message in the SAKNTL group chat.

Previous conversation:
${contextStr || "(No previous context)"}

New message: "${message}"

Should the bot reply to this message? Consider:
- Is it a direct question or request?
- Is it addressing the bot or continuing a conversation with the bot?
- Is it a casual chat message that doesn't need bot intervention?
- Is it spam or irrelevant?

Respond with ONLY "YES" or "NO" (no explanation).`;

          const result = yield* LanguageModel.generateText({ prompt });

          const decision = result.text.trim().toUpperCase();
          const shouldReply = decision === "YES";

          yield* Effect.log(
            `Should reply decision: ${shouldReply ? "YES" : "NO"}`
          );

          return shouldReply;
        }).pipe(
          Effect.provide(GoogleLanguageModel.model("gemini-2.5-flash")),
          Effect.provide(
            GoogleClient.layerConfig({
              apiKey: Config.redacted("GOOGLE_API_KEY"),
            })
          ),
          Effect.provide(NodeHttpClient.layer),
          Effect.timeout("15 seconds"),
          Effect.mapError((error) => {
            const errorMessage = `AI shouldReply check failed: ${String(error)}`;
            return new Error(errorMessage);
          })
        ),

      generateResponse: (
        message: string,
        context: readonly ConversationMessage[]
      ) =>
        Effect.gen(function* () {
          yield* Effect.log("Generating AI response with context...");

          const contextStr = buildContextString(context);
          const prompt = `Kamu adalah asisten grup SAKNTL. Kita suka gimik dan bercanda dalam grup ini.

${contextStr ? `Previous conversation:\n${contextStr}\n\n` : ""}Current message: ${message}

Balas pesan dengan nada seperti Gen z yang santai, lucu, dan kasar. Jangan gunakan markdown atau format khusus apapun dalam balasanmu. Keep it simple and straightforward. Selalu jawab dalam bentuk teks biasa yang pendek. Jangan jelaskan dirimu sebagai bot. Gunakan gaya obrolan alami kayak manusia di grup.`;

          const result = yield* LanguageModel.generateText({ prompt });

          yield* Effect.log(`Generated response: ${result.text}`);
          yield* Effect.log(`Usage details: ${JSON.stringify(result.usage)}`);

          return result.text;
        }).pipe(
          Effect.provide(GoogleLanguageModel.model("gemini-2.5-flash")),
          Effect.provide(
            GoogleClient.layerConfig({
              apiKey: Config.redacted("GOOGLE_API_KEY"),
            })
          ),
          Effect.provide(NodeHttpClient.layer),
          Effect.timeout("30 seconds"),
          Effect.mapError((error) => {
            const errorMessage = `AI response generation failed: ${String(error)}`;
            return new Error(errorMessage);
          })
        ),
    };
  })
);
