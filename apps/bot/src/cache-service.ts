/** biome-ignore-all lint/style/noMagicNumbers: TODO */
import { Context, Effect, Layer } from "effect";
import type { CacheEntry } from "./types";

// Configuration
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Cache Service interface
export class CacheService extends Context.Tag("CacheService")<
  CacheService,
  {
    readonly get: (key: string) => Effect.Effect<string | null, never>;
    readonly set: (key: string, value: string) => Effect.Effect<void, never>;
    readonly clear: (key: string) => Effect.Effect<void, never>;
    readonly clearAll: Effect.Effect<void, never>;
  }
>() {}

// In-memory implementation with TTL
export const CacheServiceLive = Layer.scoped(
  CacheService,
  Effect.gen(function* () {
    // Store: message -> cache entry
    const store = new Map<string, CacheEntry>();

    // Cleanup expired entries periodically
    const cleanupExpired = () => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (entry.expiresAt <= now) {
          store.delete(key);
        }
      }
    };

    // Start cleanup interval
    const intervalId = setInterval(cleanupExpired, CLEANUP_INTERVAL_MS);

    // Register cleanup on scope close
    yield* Effect.addFinalizer(() =>
      Effect.sync(() => {
        clearInterval(intervalId);
        store.clear();
      })
    );

    return {
      get: (key: string) =>
        Effect.sync(() => {
          const entry = store.get(key);
          if (!entry) {
            return null;
          }

          // Check if expired
          if (entry.expiresAt <= Date.now()) {
            store.delete(key);
            return null;
          }

          return entry.response;
        }),

      set: (key: string, value: string) =>
        Effect.sync(() => {
          const now = Date.now();
          const entry: CacheEntry = {
            response: value,
            timestamp: now,
            expiresAt: now + CACHE_TTL_MS,
          };
          store.set(key, entry);
        }),

      clear: (key: string) =>
        Effect.sync(() => {
          store.delete(key);
        }),

      clearAll: Effect.sync(() => {
        store.clear();
      }),
    };
  })
);
