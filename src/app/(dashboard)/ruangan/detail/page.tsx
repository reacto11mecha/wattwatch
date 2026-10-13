"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DetailRuanganPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get("id");

  // Fetch data ruangan beserta log konsumsinya.
  // refetchInterval: 5000 membuat halaman ini otomatis menarik data baru setiap 5 detik!
  const { data: ruangan, isLoading } = api.lokasi.getRuanganById.useQuery(
    { id: roomId ?? "" },
    { enabled: !!roomId, refetchInterval: 5000 }
  );

  if (!roomId) {
    return (
      <div className="p-6 text-center space-y-4">
        <p>ID Ruangan tidak ditemukan.</p>
        <Button onClick={() => router.push("/ruangan")}>Kembali ke Daftar Ruangan</Button>
      </div>
    );
  }

  if (isLoading) return <div className="p-8 animate-pulse">Memuat data real-time...</div>;
  if (!ruangan) return <div className="p-8 text-red-500">Data ruangan tidak ditemukan.</div>;

  // Format data untuk grafik Recharts
  const chartData = [...ruangan.logKonsumsi]
    .reverse() // Balik agar data terlama di kiri, terbaru di kanan grafik
    .map((log) => ({
      waktu: new Date(log.timestamp).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
      kWh: log.konsumsiKwh,
      biaya: log.estimasiBiaya,
    }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="link" className="p-0 text-gray-500 mb-2" onClick={() => router.push("/ruangan")}>
            &larr; Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">{ruangan.nama}</h1>
          <p className="text-gray-500">Pemantauan Lingkungan & Energi Real-time</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Status Ruangan</p>
          <Badge variant={ruangan.status === "Warning" ? "destructive" : "default"} className="text-lg py-1">
            {ruangan.status}
          </Badge>
        </div>
      </div>

      {/* KARTU INDIKATOR REAL-TIME */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center justify-center bg-blue-50 border-blue-100">
          <p className="text-sm font-semibold text-blue-600 mb-2">Suhu Ruangan</p>
          <p className="text-4xl font-bold text-blue-900">
            {ruangan.suhu !== null ? `${ruangan.suhu.toFixed(1)}°C` : "--"}
          </p>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center bg-teal-50 border-teal-100">
          <p className="text-sm font-semibold text-teal-600 mb-2">Kelembapan</p>
          <p className="text-4xl font-bold text-teal-900">
            {ruangan.kelembapan !== null ? `${ruangan.kelembapan.toFixed(1)}%` : "--"}
          </p>
        </Card>

        <Card className={`p-6 flex flex-col items-center justify-center border-2 ${ruangan.adaOrang ? "bg-red-50 border-red-400" : "bg-gray-50 border-gray-200"}`}>
          <p className={`text-sm font-semibold mb-2 ${ruangan.adaOrang ? "text-red-600" : "text-gray-500"}`}>
            Deteksi Pergerakan (PIR)
          </p>
          <p className={`text-2xl font-bold ${ruangan.adaOrang ? "text-red-600 animate-pulse" : "text-gray-700"}`}>
            {ruangan.adaOrang ? "⚠️ ADA ORANG" : "KOSONG"}
          </p>
        </Card>
      </div>

      {/* GRAFIK KONSUMSI ENERGI */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Grafik Konsumsi Listrik (PZEM-004T)</h2>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="waktu" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} kWh`} />
                <Tooltip
                  formatter={(value: number) => [`${value} kWh`, 'Konsumsi']}
                  labelStyle={{ color: 'black' }}
                />
                <Line type="monotone" dataKey="kWh" stroke="#1a73e8" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400 border-2 border-dashed rounded-md">
            Belum ada data konsumsi listrik yang terekam.
          </div>
        )}
      </Card>
    </div>
  );
}
