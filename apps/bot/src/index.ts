import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { cli } from "./cli";

const program = cli(process.argv).pipe(Effect.provide(BunContext.layer));

BunRuntime.runMain(program);
