import { ORPCError } from "@orpc/client";
import { HTTP_STATUS_CODE, tryCatch } from "@santara/utils";
import { env } from "cloudflare:workers";
import { nanoid } from "nanoid";
import {
  chatInputSchema,
  chatResponseSchema,
  type AIChatResponse,
} from "../dtos/chat";
import { protectedProcedure } from "../index";

export const chatRouter = {
  sendMessage: protectedProcedure
    .input(chatInputSchema)
    .output(chatResponseSchema)
    .handler(async ({ input }) => {
      const { message, conversationId } = input;

      let conversationIdToUse = conversationId;
      if (!conversationIdToUse) {
        conversationIdToUse = nanoid();
      }

      const req = {
        query: message,
        conversationId: conversationIdToUse,
      };

      const { data: res, error: fetchErr } = await tryCatch(
        fetch(`${env.SANTARA_AI_API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        })
      );
      if (fetchErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to connect to Santara AI API",
          cause: fetchErr,
          data: { req },
        });
      }

      const { data: json, error: jsonErr } = await tryCatch(
        res.json() as Promise<AIChatResponse>
      );
      if (jsonErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to parse response from Santara AI API",
          cause: jsonErr,
          data: { req, res },
        });
      }

      if (!res.ok) {
        throw new ORPCError("BAD_GATEWAY", {
          status: HTTP_STATUS_CODE.BAD_GATEWAY,
          message: "Santara AI API returned an error",
          data: { req, res: json },
        });
      }

      const output = {
        answer: json.answer,
        sources: json.sources,
        conversationId: json.conversation_id,
      };

      return output;
    }),
};
