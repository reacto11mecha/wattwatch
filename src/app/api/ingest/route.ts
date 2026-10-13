import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { perangkat, ruangan, logKonsumsi } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { device_id, api_key, suhu, kelembapan, konsumsi_kwh, adaOrang } = body;

    // 1. Validasi Keberadaan Data Dasar
    if (!device_id || !api_key) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 2. Cari Perangkat dan Validasi API Key
    const device = await db.query.perangkat.findFirst({
      where: eq(perangkat.id, device_id),
      with: { ruangan: { with: { gedung: true } } } // Tarik data ruangan dan gedungnya sekalian
    });

    if (!device || device.apiKey !== api_key) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetRuanganId = device.ruanganId;

    // 3. Update Status Real-time di Tabel Ruangan
    // Logika sederhana: Jika suhu sangat panas, ubah status jadi "Warning"
    let statusRuangan: "Normal" | "Warning" | "Abnormal" = "Normal";
    if (suhu > 35) statusRuangan = "Warning";

    await db.update(ruangan)
      .set({
        suhu: suhu,
        kelembapan: kelembapan,
        adaOrang: adaOrang,
        status: statusRuangan,
      })
      .where(eq(ruangan.id, targetRuanganId));

    // 4. Catat Log Konsumsi Listrik
    // Estimasi biaya (contoh: Tarif dasar listrik Rp 1.444 per kWh)
    const TDL = 1444;
    const estimasi = konsumsi_kwh * TDL;

    await db.insert(logKonsumsi).values({
      id: crypto.randomUUID(),
      ruanganId: targetRuanganId,
      konsumsiKwh: konsumsi_kwh,
      estimasiBiaya: estimasi,
    });

    console.log(`[Ingest API] Data masuk dari ${device_id} ke Ruangan ${targetRuanganId}`);
    return NextResponse.json({ success: true, message: "Data diterima" });

  } catch (error) {
    console.error("[Ingest API Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
