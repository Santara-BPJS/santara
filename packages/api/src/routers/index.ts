import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../index";
import { chatRouter } from "./chat";
import { folderAccessRouter } from "./folder-access";
import { storageRouter } from "./storage";
import { userRouter } from "./user";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: "This is private",
    user: context.session?.user,
  })),
  storage: storageRouter,
  chat: chatRouter,
  user: userRouter,
  folderAccess: folderAccessRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
