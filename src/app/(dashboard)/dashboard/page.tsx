"use client";

import {
  Zap,
  Wallet,
  AlertTriangle,
  Activity,
  Calendar,
  ChevronRight,
  Power,
  Lightbulb,
  ThermometerSnowflake,
  Microwave
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";

// --- MOCK DATA ---
const trenData = [
  { time: "00:00", kwh: 12 }, { time: "04:00", kwh: 8 },
  { time: "08:00", kwh: 35 }, { time: "12:00", kwh: 58 },
  { time: "16:00", kwh: 45 }, { time: "20:00", kwh: 22 },
  { time: "24:00", kwh: 15 }
];

const periodeData = [
  { periode: "Pagi", kwh: 120 },
  { periode: "Siang", kwh: 250 },
  { periode: "Malam", kwh: 180 },
  { periode: "Dini Hari", kwh: 45 },
];

const efficiencyScores = [
  { ruang: "Ruang 101", score: 94, color: "bg-[#18A878]" }, // Success
  { ruang: "Ruang 202", score: 87, color: "bg-[#18A878]" },
  { ruang: "Ruang 301", score: 63, color: "bg-[#F2A900]" }, // Warning
  { ruang: "Ruang 402", score: 41, color: "bg-[#E05252]" }, // Alert Red
];

// Konfigurasi Chart shadcn
const chartConfig = {
  kwh: {
    label: "Konsumsi (kWh)",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Halo, Admin!</h1>
          <p className="text-muted-foreground">Berikut ringkasan konsumsi energi hari ini.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 shadow-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hari Ini, 24 Sept 2026</span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Konsumsi Energi</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.284 kWh</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estimasi Biaya</CardTitle>
            <Wallet className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp1.927.000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Potensi Boros</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#E05252]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E05252]">7 Ruangan</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency Score</CardTitle>
            <Activity className="h-4 w-4 text-[#18A878]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#18A878]">82/100</div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tren Penggunaan Energi</CardTitle>
            <CardDescription>Perubahan konsumsi selama 24 jam (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={trenData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="kwh" stroke="var(--color-kwh)" strokeWidth={3} dot={{ fill: "var(--color-kwh)" }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Penggunaan per Periode</CardTitle>
            <CardDescription>Distribusi beban listrik harian (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={periodeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="periode" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="kwh" fill="var(--color-kwh)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Alerts & Insights */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card className="border-[#E05252]/50 bg-[#E05252]/5 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#E05252]" />
                <CardTitle className="text-lg text-[#E05252]">Peringatan Boros Listrik</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 font-medium text-foreground">
                <span className="font-bold">Ruang Produksi:</span> Konsumsi listrik 32% lebih tinggi dari pola normal.
              </p>
              <Button size="sm" variant="outline" className="border-[#E05252] text-[#E05252] hover:bg-[#E05252] hover:text-white">
                Lihat Detail <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">WattWatch Insight</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-primary-foreground/90">
                Penggunaan listrik di Ruang Produksi meningkat pada jam operasional tertentu. Sistem mendeteksi AC dan Mesin bekerja bersamaan tanpa jeda.
              </p>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Lihat Rekomendasi <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Efficiency & Devices */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Efficiency Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {efficiencyScores.map((item) => (
                <div key={item.ruang} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.ruang}</span>
                    <span className="font-bold">{item.score}/100</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Perangkat Mayor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-border p-2">
                <div className="flex items-center gap-2">
                  <ThermometerSnowflake className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">AC Sentral</span>
                </div>
                <span className="rounded-full bg-[#18A878]/10 px-2 py-0.5 text-xs font-bold text-[#18A878]">ON</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Lampu Utama</span>
                </div>
                <span className="rounded-full bg-[#18A878]/10 px-2 py-0.5 text-xs font-bold text-[#18A878]">ON</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-2">
                <div className="flex items-center gap-2">
                  <Microwave className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Oven Industri</span>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">OFF</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
