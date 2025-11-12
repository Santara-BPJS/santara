import { ORPCError } from "@orpc/client";
import { db, schema } from "@santara/db";
import { getRoleByIdx, getRoleByLabel } from "@santara/db/enums/role";
import { HTTP_STATUS_CODE, tryCatch } from "@santara/utils";
import { and, count, eq, ilike, or, type SQL } from "drizzle-orm";
import {
  deleteUserInputSchema,
  getUsersInputSchema,
  getUsersOutputSchema,
  updateUserInputSchema,
} from "../dtos/user";
import { protectedProcedure } from "../index";

export const userRouter = {
  getUsers: protectedProcedure
    .input(getUsersInputSchema)
    .output(getUsersOutputSchema)
    .handler(async ({ input }) => {
      const { search, role, status, page, limit } = input;
      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions: (SQL | undefined)[] = [];

      if (search) {
        conditions.push(
          or(
            ilike(schema.user.name, `%${search}%`),
            ilike(schema.user.email, `%${search}%`)
          )
        );
      }

      if (role !== undefined) {
        conditions.push(eq(schema.user.role, role));
      }

      if (status === "active") {
        conditions.push(eq(schema.user.emailVerified, true));
      } else if (status === "invited") {
        conditions.push(eq(schema.user.emailVerified, false));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const usersQuery = db
        .select({
          id: schema.user.id,
          name: schema.user.name,
          email: schema.user.email,
          role: schema.user.role,
          emailVerified: schema.user.emailVerified,
          image: schema.user.image,
          createdAt: schema.user.createdAt,
          updatedAt: schema.user.updatedAt,
          folderAccessCount: count(schema.userFolderAccess.folderId),
        })
        .from(schema.user)
        .leftJoin(
          schema.userFolderAccess,
          eq(schema.user.id, schema.userFolderAccess.userId)
        )
        .where(whereClause)
        .groupBy(schema.user.id)
        .limit(limit)
        .offset(offset);

      const totalQuery = db
        .select({ count: count() })
        .from(schema.user)
        .where(whereClause);

      const folderMetaQuery = db.select({ count: count() }).from(schema.folder);

      const { data: fetchData, error: fetchError } = await tryCatch(
        Promise.all([usersQuery, totalQuery, folderMetaQuery])
      );
      if (fetchError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch users",
          cause: fetchError,
          data: input,
        });
      }

      const [usersRecords, metaRecords, folderMetaRecords] = fetchData;

      if (!metaRecords) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch users metadata",
        });
      }

      const meta = metaRecords[0];
      if (!meta) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch users metadata",
        });
      }

      if (!folderMetaRecords) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch folder metadata",
        });
      }

      const folderMeta = folderMetaRecords[0];
      if (!folderMeta) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch folder metadata",
        });
      }

      const users = usersRecords.map((user) => {
        const userRole = getRoleByIdx(user.role);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: userRole ? userRole.label : "Unknown",
          emailVerified: user.emailVerified,
          image: user.image,
          folderAccessCount: user.folderAccessCount,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });

      return {
        users,
        totalFolder: folderMeta.count,
        total: meta.count,
        page,
        limit,
      };
    }),

  updateUser: protectedProcedure
    .input(updateUserInputSchema)
    .handler(async ({ input }) => {
      const { userId, ...updates } = input;

      const role = getRoleByLabel(updates.role);
      if (!role) {
        throw new ORPCError("BAD_REQUEST", {
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Invalid role",
          data: input,
        });
      }

      const { data: updateResult, error: updateError } = await tryCatch(
        db
          .update(schema.user)
          .set({
            ...updates,
            role: role.idx,
            updatedAt: new Date(),
          })
          .where(eq(schema.user.id, userId))
      );
      if (updateError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to update user",
          cause: updateError,
          data: input,
        });
      }

      if (updateResult.rowCount === 0) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "User not found",
          data: input,
        });
      }

      return;
    }),

  deleteUser: protectedProcedure
    .input(deleteUserInputSchema)
    .handler(async ({ input }) => {
      const { userId } = input;

      const { data: deleteResult, error: deleteError } = await tryCatch(
        db.delete(schema.user).where(eq(schema.user.id, userId))
      );
      if (deleteError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to delete user",
          cause: deleteError,
          data: input,
        });
      }

      if (deleteResult.rowCount === 0) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "User not found",
          data: input,
        });
      }

      return;
    }),
};
