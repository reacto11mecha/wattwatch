import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { gedung, ruangan } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const lokasiRouter = createTRPCRouter({
  // --- GEDUNG ---
  createGedung: protectedProcedure
    .input(z.object({ nama: z.string().min(1), alamat: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const [newGedung] = await ctx.db.insert(gedung).values({
        id: crypto.randomUUID(),
        userId: ctx.session.user.id,
        nama: input.nama,
        alamat: input.alamat,
      }).returning();
      return newGedung;
    }),

  getGedung: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.gedung.findMany({
      where: eq(gedung.userId, ctx.session.user.id),
      with: { ruangan: true },
    });
  }),

  deleteGedung: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(gedung).where(eq(gedung.id, input.id));
      return { success: true };
    }),

  // --- RUANGAN ---
  createRuangan: protectedProcedure
    .input(z.object({ gedungId: z.string(), nama: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [newRuangan] = await ctx.db.insert(ruangan).values({
        id: crypto.randomUUID(),
        gedungId: input.gedungId,
        nama: input.nama,
        status: "Normal",
        efisiensiScore: 100,
      }).returning();
      return newRuangan;
    }),

  getRuanganById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.ruangan.findFirst({
        where: eq(ruangan.id, input.id),
        with: { perangkat: true, logKonsumsi: { limit: 50, orderBy: (logs, { desc }) => [desc(logs.timestamp)] } },
      });
    }),

  // --- D. Endpoint Statistik Dashboard (Data Riil) ---
    getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
      // Ambil data gedung, ruangan, dan log konsumsinya (hanya milik user yang login)
      const userGedung = await ctx.db.query.gedung.findMany({
        where: eq(gedung.userId, ctx.session.user.id),
        with: {
          ruangan: {
            with: { logKonsumsi: true } // Tarik log konsumsi dari database
          }
        }
      });

      // Variabel Penampung Agregasi
      let totalKwh = 0;
      let totalBiaya = 0;
      let potensiBoros = 0;
      let totalEfisiensi = 0;
      let ruanganCount = 0;

      const hourlyData = new Array(24).fill(0);
      const periodData = { Pagi: 0, Siang: 0, Malam: 0, "Dini Hari": 0 };
      const ruangWarning: { nama: string, kwh: number, status: string }[] = [];

      // Batas waktu hari ini (mulai jam 00:00)
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      userGedung.forEach(g => {
        g.ruangan.forEach(r => {
          ruanganCount++;
          totalEfisiensi += (r.efisiensiScore || 0);

          if (r.status === "Warning" || r.status === "Abnormal") {
            potensiBoros++;
          }

          let roomKwhToday = 0;

          r.logKonsumsi.forEach(log => {
            // Hanya hitung log yang masuk hari ini
            if (new Date(log.timestamp) >= startOfToday) {
              totalKwh += log.konsumsiKwh;
              totalBiaya += log.estimasiBiaya;
              roomKwhToday += log.konsumsiKwh;

              const hour = new Date(log.timestamp).getHours();
              hourlyData[hour] += log.konsumsiKwh;

              if (hour >= 6 && hour < 12) periodData["Pagi"] += log.konsumsiKwh;
              else if (hour >= 12 && hour < 18) periodData["Siang"] += log.konsumsiKwh;
              else if (hour >= 18 && hour < 24) periodData["Malam"] += log.konsumsiKwh;
              else periodData["Dini Hari"] += log.konsumsiKwh;
            }
          });

          // Masukkan ke daftar peringatan jika ruangan ini berstatus Warning dan ada datanya
          if ((r.status === "Warning" || r.status === "Abnormal") && roomKwhToday > 0) {
            ruangWarning.push({ nama: r.nama, kwh: roomKwhToday, status: r.status });
          }
        });
      });

      // Format data untuk Recharts
      const trenEnergi = hourlyData.map((val, idx) => ({
        jam: `${idx.toString().padStart(2, '0')}:00`,
        value: Number(val.toFixed(2))
      })).filter(d => d.value > 0); // Hanya tampilkan jam yang ada datanya

      const penggunaanPeriode = [
        { periode: "Pagi", value: Number(periodData["Pagi"].toFixed(2)) },
        { periode: "Siang", value: Number(periodData["Siang"].toFixed(2)) },
        { periode: "Malam", value: Number(periodData["Malam"].toFixed(2)) },
        { periode: "Dini Hari", value: Number(periodData["Dini Hari"].toFixed(2)) },
      ];

      return {
        totalKwh: Number(totalKwh.toFixed(3)),
        totalBiaya: Math.round(totalBiaya),
        potensiBoros,
        avgEfisiensi: ruanganCount > 0 ? Math.round(totalEfisiensi / ruanganCount) : 100,
        trenEnergi: trenEnergi.length > 0 ? trenEnergi : [{ jam: "00:00", value: 0 }],
        penggunaanPeriode,
        ruangWarning,
        semuaRuangan: userGedung.flatMap(g => g.ruangan).sort((a, b) => (b.efisiensiScore || 0) - (a.efisiensiScore || 0))
      };
    }),

    // --- E. Endpoint Laporan Energi (Data Riil Bulanan) ---
      getLaporanStats: protectedProcedure.query(async ({ ctx }) => {
        const userGedung = await ctx.db.query.gedung.findMany({
          where: eq(gedung.userId, ctx.session.user.id),
          with: {
            ruangan: {
              with: { logKonsumsi: true }
            }
          }
        });

        const bulanIni = new Date().getMonth();
        const tahunIni = new Date().getFullYear();

        let totalKwhBulanIni = 0;
        let totalBiayaBulanIni = 0;
        let potensiPemborosanBiaya = 0;

        // Inisialisasi array untuk 6 bulan terakhir agar grafik tidak kosong
        const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
        const trenBulananMap = new Map<string, number>();

        // Setup 6 bulan ke belakang
        for (let i = 5; i >= 0; i--) {
          const d = new Date(tahunIni, bulanIni - i, 1);
          trenBulananMap.set(namaBulan[d.getMonth()], 0);
        }

        const peringkatRuangan: any[] = [];

        userGedung.forEach(g => {
          g.ruangan.forEach(r => {
            let kwhRuanganBulanIni = 0;

            r.logKonsumsi.forEach(log => {
              const logDate = new Date(log.timestamp);
              const logBulan = logDate.getMonth();
              const logTahun = logDate.getFullYear();
              const namaBulanLog = namaBulan[logBulan];

              // Hitung Tren Bulanan
              if (trenBulananMap.has(namaBulanLog) && logTahun === tahunIni) {
                trenBulananMap.set(namaBulanLog, trenBulananMap.get(namaBulanLog)! + log.konsumsiKwh);
              }

              // Hitung Total Bulan Ini
              if (logBulan === bulanIni && logTahun === tahunIni) {
                totalKwhBulanIni += log.konsumsiKwh;
                totalBiayaBulanIni += log.estimasiBiaya;
                kwhRuanganBulanIni += log.konsumsiKwh;
              }
            });

            // Hitung Potensi Pemborosan (Misal: Ruangan dengan status Warning/Abnormal menyumbang 20% pemborosan dari total konsumsinya)
            if (r.status === "Warning" || r.status === "Abnormal") {
              potensiPemborosanBiaya += (kwhRuanganBulanIni * 1444) * 0.20; // Asumsi TDL Rp 1.444
            }

            peringkatRuangan.push({
              id: r.id,
              ruangan: r.nama,
              gedung: g.nama,
              efisiensiScore: r.efisiensiScore || 0,
            });
          });
        });

        // Format data untuk Recharts
        const trenBulanan = Array.from(trenBulananMap, ([bulan, value]) => ({ bulan, value: Number(value.toFixed(2)) }));

        // Sortir peringkat ruangan dari efisiensi tertinggi
        peringkatRuangan.sort((a, b) => b.efisiensiScore - a.efisiensiScore);

        // Hitung persentase potensi penghematan
        const persentasePenghematan = totalBiayaBulanIni > 0
          ? (potensiPemborosanBiaya / totalBiayaBulanIni) * 100
          : 0;

        return {
          totalKwh: Number(totalKwhBulanIni.toFixed(2)),
          totalBiaya: Math.round(totalBiayaBulanIni),
          potensiPemborosan: Math.round(potensiPemborosanBiaya),
          persentasePenghematan: Number(persentasePenghematan.toFixed(1)),
          trenBulanan,
          peringkatRuangan
        };
      }),
});
