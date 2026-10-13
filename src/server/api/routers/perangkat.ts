import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { perangkat } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const perangkatRouter = createTRPCRouter({
  createPerangkat: protectedProcedure
    .input(z.object({
      ruanganId: z.string(),
      nama: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Generate API Key yang unik
      const generatedApiKey = `ww-sec-${crypto.randomUUID()}`;

      const [newPerangkat] = await ctx.db.insert(perangkat).values({
        id: `WW-${crypto.randomUUID().substring(0, 8).toUpperCase()}`, // Contoh ID: WW-A1B2C3D4
        ruanganId: input.ruanganId,
        nama: input.nama,
        apiKey: generatedApiKey,
        isAktif: true,
      }).returning();

      return newPerangkat; // Frontend akan menampilkan ID dan apiKey ini sekali saja
    }),

  deletePerangkat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(perangkat).where(eq(perangkat.id, input.id));
      return { success: true };
    }),
});
