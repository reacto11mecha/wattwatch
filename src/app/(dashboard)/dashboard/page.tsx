"use client";

import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import {
  Zap,
  Wallet,
  AlertTriangle,
  Activity,
  Calendar,
  Lightbulb,
  ChevronRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

export default function DashboardPage() {
  // Menarik agregasi data riil dari backend tRPC
  const { data: stats, isLoading } = api.lokasi.getDashboardStats.useQuery(undefined, {
    refetchInterval: 10000 // Auto-refresh setiap 10 detik agar sinkron dengan ESP32
  });

  if (isLoading || !stats) {
    return <div className="p-8 animate-pulse text-gray-500">Memuat wawasan energi real-time...</div>;
  }

  const tanggalHariIni = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(new Date());

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#f8fafc] min-h-screen">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Halo, Admin!</h1>
          <p className="text-gray-500 mt-1">Berikut ringkasan konsumsi energi hari ini berdasarkan data sensor.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm w-fit">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Hari Ini, {tanggalHariIni}</span>
        </div>
      </div>

      {/* --- 4 KARTU METRIK UTAMA --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 rounded-xl border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Total Konsumsi Energi</p>
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalKwh} kWh</p>
        </Card>

        <Card className="p-6 rounded-xl border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Estimasi Biaya</p>
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats.totalBiaya)}
          </p>
        </Card>

        <Card className={`p-6 rounded-xl shadow-sm flex flex-col justify-between ${stats.potensiBoros > 0 ? "border-red-100 bg-[#fff8f8]" : "border-gray-200"}`}>
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Potensi Boros</p>
            <AlertTriangle className={`w-5 h-5 ${stats.potensiBoros > 0 ? "text-red-500" : "text-gray-300"}`} />
          </div>
          <p className={`text-3xl font-bold ${stats.potensiBoros > 0 ? "text-red-500" : "text-gray-900"}`}>
            {stats.potensiBoros} Ruangan
          </p>
        </Card>

        <Card className="p-6 rounded-xl border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Rata-rata Efisiensi</p>
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-500">{stats.avgEfisiensi}/100</p>
        </Card>
      </div>

      {/* --- AREA GRAFIK --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-xl shadow-sm border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tren Penggunaan Energi</h2>
          <p className="text-sm text-gray-500 mb-6">Distribusi konsumsi setiap jam hari ini (kWh)</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="jam" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis dataKey="value" type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickCount={5} />
                <ZAxis range={[30, 30]} />
                <Scatter data={stats.trenEnergi} fill="#000000" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Penggunaan per Periode</h2>
          <p className="text-sm text-gray-500 mb-6">Akumulasi beban listrik (kWh)</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.penggunaanPeriode} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="periode" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickCount={5} />
                <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* --- AREA BAWAH (Peringatan, Insight & Efisiensi) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-2 space-y-4">
          {/* List Peringatan Riil dari Database */}
          {stats.ruangWarning.length > 0 ? (
            stats.ruangWarning.map((peringatan, idx) => (
              <Card key={idx} className="p-6 rounded-xl shadow-sm bg-[#fff8f8] border border-red-100">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-500">Peringatan {peringatan.status}</h3>
                </div>
                <p className="text-gray-800 mb-6">
                  <span className="font-bold">{peringatan.nama}:</span> Konsumsi listrik hari ini telah mencapai {peringatan.kwh.toFixed(2)} kWh diiringi dengan kondisi anomali ruangan.
                </p>
                <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50 justify-center">
                  Lihat Detail <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>
            ))
          ) : (
            <Card className="p-6 rounded-xl shadow-sm bg-gray-50 border-dashed text-center text-gray-500">
              Tidak ada peringatan pemborosan. Seluruh ruangan beroperasi dalam batas wajar.
            </Card>
          )}

          {/* Insight Card */}
          <Card className="p-6 rounded-xl shadow-sm bg-[#1e5c43] border-none text-white">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-emerald-300" />
              <h3 className="text-lg font-semibold text-white">WattWatch Insight</h3>
            </div>
            <p className="text-emerald-50 mb-6 text-sm leading-relaxed">
              Total biaya listrik Anda hari ini adalah {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats.totalBiaya)}.
              {stats.penggunaanPeriode.reduce((prev, current) => (prev.value > current.value) ? prev : current).periode} adalah periode dengan konsumsi energi tertinggi.
            </p>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full bg-[#2a7a5a] hover:bg-[#348c6a] text-white border-none justify-center">
                  Lihat Rekomendasi <ChevronRight className="w-4 h-4 ml-1"/>
                </Button>
              </SheetTrigger>

              <SheetContent className="sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center gap-2 text-2xl text-[#1e5c43]">
                    <Lightbulb className="w-6 h-6"/>
                    Analisis Cerdas
                  </SheetTitle>
                  <SheetDescription>
                    Rekomendasi berbasis korelasi data sensor PIR, Suhu, dan Daya.
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                  {/* Insight 1 */}
                  <div className="border-l-4 border-red-500 pl-4 py-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Ruang Kosong, Daya Tinggi</h4>
                    <p className="text-sm text-gray-600 mb-2">Sistem mendeteksi ruangan kosong selama 45 menit, namun konsumsi listrik stabil tinggi.</p>
                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm font-medium">
                      💡 Saran: Pasang otomasi pemutus arus AC jika sensor PIR tidak mendeteksi gerakan &gt;30 menit.
                    </div>
                  </div>

                  {/* Insight 2 */}
                  <div className="border-l-4 border-yellow-500 pl-4 py-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Inefisiensi Pendingin</h4>
                    <p className="text-sm text-gray-600 mb-2">Suhu ruangan stabil (23°C), namun kompresor AC bekerja dengan beban fluktuatif abnormal.</p>
                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm font-medium">
                      💡 Saran: Jadwalkan pembersihan filter AC. Efisiensi perangkat menurun 12% minggu ini.
                    </div>
                  </div>

                  {/* Insight 3 */}
                  <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Proyeksi Tagihan Membengkak</h4>
                    <p className="text-sm text-gray-600 mb-2">Beban listrik terfokus pada periode "Siang Hari". Tren saat ini akan melampaui batas wajar bulanan.</p>
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm font-medium">
                      💡 Saran: Geser jadwal penggunaan mesin berdaya tinggi (jika memungkinkan) ke luar periode jam sibuk siang hari.
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </Card>
        </div>

        {/* Kolom Kanan: Efficiency Score Riil */}
        <Card className="p-6 rounded-xl shadow-sm border-gray-200 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Efficiency Score</h2>
          <div className="space-y-6">
            {stats.semuaRuangan.length > 0 ? (
              stats.semuaRuangan.map((ruang) => (
                <div key={ruang.id}>
                  <div className="flex justify-between text-sm font-medium text-gray-800 mb-2">
                    <span>{ruang.nama}</span>
                    <span>{ruang.efisiensiScore || 0}/100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getScoreColor(ruang.efisiensiScore || 0)}`}
                      style={{ width: `${ruang.efisiensiScore || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center italic">Belum ada ruangan yang didaftarkan.</p>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
