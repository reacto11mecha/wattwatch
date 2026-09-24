"use client";

import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Users,
  Wind,
  Lightbulb,
  Refrigerator,
  Microwave,
  AlertTriangle,
  Lightbulb as IdeaIcon,
  TrendingDown,
  Clock,
  Zap,
  Wallet,
  Activity
} from "lucide-react";
import Link from "next/link";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { Badge } from "~/components/ui/badge";

// --- MOCK DATA TREN KONSUMSI ---
const trendData = [
  { time: "08:00", kwh: 1.2 }, { time: "09:00", kwh: 2.5 },
  { time: "10:00", kwh: 2.8 }, { time: "11:00", kwh: 3.1 },
  { time: "12:00", kwh: 2.9 }, { time: "13:00", kwh: 2.7 },
  { time: "14:00", kwh: 2.8 }, { time: "15:00", kwh: 2.6 },
];

const chartConfig = {
  kwh: {
    label: "Konsumsi (kWh)",
    color: "hsl(var(--primary))",
  },
};

export default function DetailRuanganPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* HEADER & NAVIGATION */}
      <div className="flex flex-col gap-4">
        <Link href="/ruangan" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Ruangan
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Detail Ruangan — Ruang Produksi</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">Gedung B • Lantai 1</span>
              <Badge variant="outline" className="border-[#E05252] bg-[#E05252]/10 text-[#E05252] font-semibold">
                🔴 Abnormal Usage Detected
              </Badge>
            </div>
          </div>
          <Button variant="outline" className="shrink-0 bg-background text-foreground">
            Lihat Laporan Lengkap
          </Button>
        </div>
      </div>

      {/* SUMMARY METRICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Konsumsi Hari Ini</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,4 kWh</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estimasi Biaya</CardTitle>
            <Wallet className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp18.600</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency Score</CardTitle>
            <Activity className="h-4 w-4 text-[#E05252]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-[#E05252]">63/100</div>
              <div className="h-2 w-full max-w-[80px] overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[63%] bg-[#E05252]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Durasi Penggunaan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8j 42m</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* KONDISI RUANGAN (Sensors & Devices) */}
        <Card className="lg:col-span-1 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Kondisi Ruangan</CardTitle>
            <CardDescription>Status real-time sensor & perangkat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual Placeholder */}
            <div className="aspect-video w-full rounded-lg bg-secondary/50 flex items-center justify-center border border-border/50">
               <span className="text-muted-foreground text-sm flex items-center gap-2">
                 <Users className="h-4 w-4"/> Ruang Kosong (PIR Sensor)
               </span>
            </div>

            {/* Sensor Data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Thermometer className="h-4 w-4" /> <span className="text-xs font-medium">Suhu</span>
                </div>
                <span className="text-lg font-bold text-foreground">22°C</span>
              </div>
              <div className="flex flex-col p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Droplets className="h-4 w-4" /> <span className="text-xs font-medium">Kelembapan</span>
                </div>
                <span className="text-lg font-bold text-foreground">55%</span>
              </div>
            </div>

            {/* Device Status */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground mb-2">Perangkat Aktif</h4>
              <div className="flex items-center justify-between rounded-md border border-border p-2.5">
                <div className="flex items-center gap-3">
                  <Wind className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">AC Sentral</span>
                </div>
                <Badge variant="outline" className="border-[#18A878] bg-[#18A878]/10 text-[#18A878]">ON</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-2.5">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Lampu Produksi</span>
                </div>
                <Badge variant="outline" className="border-[#18A878] bg-[#18A878]/10 text-[#18A878]">ON</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-2.5">
                <div className="flex items-center gap-3">
                  <Refrigerator className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Kulkas Pendingin</span>
                </div>
                <Badge variant="outline" className="border-[#18A878] bg-[#18A878]/10 text-[#18A878]">ON</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-2.5 opacity-60">
                <div className="flex items-center gap-3">
                  <Microwave className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Oven Listrik</span>
                </div>
                <Badge variant="outline" className="text-muted-foreground">OFF</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TREN ENERGI & INSIGHTS */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Konsumsi Energi Hari Ini</CardTitle>
              <CardDescription>Pemantauan daya per jam (kWh)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="kwh" stroke="var(--color-kwh)" strokeWidth={3} dot={{ fill: "var(--color-kwh)" }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Waste Detection & Recommendation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-[#E05252] bg-[#E05252]/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#E05252]" />
                  <CardTitle className="text-lg text-[#E05252]">Waste Detection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">
                  Ruangan terpantau <span className="font-bold">kosong selama 2 jam 15 menit</span> (tidak ada aktivitas manusia terdeteksi oleh sensor PIR), tetapi <span className="font-bold">AC dan Lampu masih menyala</span> dengan konsumsi tinggi.
                </p>
                <div className="flex items-center gap-2 p-3 bg-white rounded-md border border-[#E05252]/20">
                  <TrendingDown className="h-5 w-5 text-[#E05252]" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Estimasi Pemborosan Harian</span>
                    <span className="text-lg font-bold text-[#E05252]">Rp52.800 / hari</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <IdeaIcon className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">WattWatch Recommendation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-primary-foreground/90">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>Matikan AC dan Lampu Produksi setelah 20 menit tanpa aktivitas terdeteksi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>Optimalkan suhu AC dari 22°C menjadi 26°C.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>Matikan seluruh perangkat *non-essential* setelah jam operasional toko selesai.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>Periksa filter AC secara berkala karena tarikan awal dayanya terpantau lebih tinggi dari normal.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
