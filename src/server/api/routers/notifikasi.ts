import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { notifikasi } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const notifikasiRouter = createTRPCRouter({
  getNotifikasi: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.notifikasi.findMany({
      where: eq(notifikasi.userId, ctx.session.user.id),
      orderBy: [desc(notifikasi.createdAt)],
      limit: 20,
    });
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(notifikasi)
        .set({ isRead: true })
        .where(eq(notifikasi.id, input.id));
      return { success: true };
    }),
});
