"use client";

import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import {
  Zap,
  Wallet,
  TrendingDown,
  Leaf
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";
import Link from "next/link";

export default function LaporanPage() {
  const { data: laporan, isLoading } = api.lokasi.getLaporanStats.useQuery();

  if (isLoading || !laporan) {
    return <div className="p-8 animate-pulse text-gray-500">Menyusun laporan analitik...</div>;
  }

  // Palet warna untuk Bar Chart agar lebih berwarna
  const chartColors = ["#0d9488", "#0f766e", "#059669", "#10b981", "#34d399", "#6ee7b7"];

  // Helper untuk status tabel
  const getStatusEfisiensi = (score: number) => {
    if (score >= 90) return { text: "Sangat Efisien", color: "text-emerald-600" };
    if (score >= 70) return { text: "Efisien", color: "text-emerald-500" };
    if (score >= 50) return { text: "Perlu Perhatian", color: "text-yellow-600" };
    if (score >= 30) return { text: "Boros", color: "text-red-500" };
    return { text: "Sangat Boros", color: "text-red-600" };
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return "bg-emerald-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#f8fafc] min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Laporan Energi</h1>
        <p className="text-gray-500 mt-1">Analisis komprehensif penggunaan energi dan potensi penghematan.</p>
      </div>

      {/* 4 KARTU METRIK */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Konsumsi */}
        <Card className="p-6 rounded-2xl border-gray-200 shadow-sm flex flex-col justify-between bg-white">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-semibold text-gray-500">Total Konsumsi (Bulan Ini)</p>
            <Zap className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{laporan.totalKwh.toLocaleString('id-ID')} kWh</p>
            <p className="text-xs text-gray-400">+0% dari bulan lalu</p>
          </div>
        </Card>

        {/* Total Biaya */}
        <Card className="p-6 rounded-2xl border-gray-200 shadow-sm flex flex-col justify-between bg-white">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-semibold text-gray-500">Total Biaya (Estimasi)</p>
            <Wallet className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(laporan.totalBiaya)}
            </p>
          </div>
        </Card>

        {/* Potensi Pemborosan */}
        <Card className="p-6 rounded-2xl border-red-100 shadow-sm flex flex-col justify-between bg-[#fff8f8]">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-semibold text-red-500">Potensi Pemborosan</p>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-red-500 mb-2">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(laporan.potensiPemborosan)}
            </p>
            <p className="text-xs text-red-400">Berdasarkan deteksi abnormal usage</p>
          </div>
        </Card>

        {/* Potensi Penghematan */}
        <Card className="p-6 rounded-2xl border-emerald-100 shadow-sm flex flex-col justify-between bg-[#f0fdf4]">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-semibold text-emerald-600">Potensi Penghematan</p>
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600 mb-2">~ {laporan.persentasePenghematan}%</p>
            <p className="text-xs text-emerald-500">Jika mengikuti rekomendasi WattWatch</p>
          </div>
        </Card>
      </div>

      {/* GRAFIK TREN BULANAN */}
      <Card className="p-6 rounded-2xl shadow-sm border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Tren Penggunaan Energi Bulanan</h2>
        <p className="text-sm text-gray-500 mb-8">Perbandingan konsumsi listrik (kWh) sepanjang waktu</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={laporan.trenBulanan} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickCount={5} />
              <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => [`${value} kWh`, 'Konsumsi']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {laporan.trenBulanan.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* TABEL PERINGKAT EFISIENSI */}
      <Card className="rounded-2xl shadow-sm border-gray-200 bg-white overflow-hidden">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Peringkat Efisiensi Ruangan</h2>
          <p className="text-sm text-gray-500">Mengidentifikasi ruangan paling efisien dan paling boros</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0fdf4] border-y border-emerald-100 text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">Peringkat</th>
                <th className="px-6 py-4">Ruangan</th>
                <th className="px-6 py-4">Gedung</th>
                <th className="px-6 py-4">Efficiency Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {laporan.peringkatRuangan.length > 0 ? (
                laporan.peringkatRuangan.map((ruang, index) => {
                  const statusInfo = getStatusEfisiensi(ruang.efisiensiScore);
                  return (
                    <tr key={ruang.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <Link
                          href={`/ruangan/detail?id=${ruang.id}`}
                          className="hover:text-emerald-600 hover:underline transition-colors cursor-pointer"
                        >
                          {ruang.ruangan}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{ruang.gedung}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-800 w-6">{ruang.efisiensiScore}</span>
                          <div className="w-24 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${getScoreBarColor(ruang.efisiensiScore)}`}
                              style={{ width: `${ruang.efisiensiScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                    Belum ada data evaluasi ruangan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
