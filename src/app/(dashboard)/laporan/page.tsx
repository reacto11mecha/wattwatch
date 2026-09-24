"use client";

import {
  Download,
  Filter,
  Zap,
  Wallet,
  TrendingDown,
  Leaf,
  ChevronDown
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// --- MOCK DATA ---
const trenBulananData = [
  { bulan: "Jan", kwh: 3100 },
  { bulan: "Feb", kwh: 3400 },
  { bulan: "Mar", kwh: 3200 },
  { bulan: "Apr", kwh: 3800 },
  { bulan: "Mei", kwh: 3600 },
  { bulan: "Jun", kwh: 4100 },
  { bulan: "Jul", kwh: 3900 },
];

const distribusiBiayaData = [
  { name: "AC & Pendingin", value: 45, fill: "hsl(var(--chart-1))" }, // Dark Green
  { name: "Peralatan Produksi", value: 25, fill: "hsl(var(--chart-2))" }, // Teal
  { name: "Pencahayaan", value: 20, fill: "hsl(var(--chart-4))" }, // Warning/Yellow
  { name: "Lainnya", value: 10, fill: "hsl(var(--muted-foreground))" }, // Gray
];

const rankingEfisiensi = [
  { ruang: "Ruang 101", gedung: "Gedung A", score: 94, status: "Sangat Efisien" },
  { ruang: "Ruang 202", gedung: "Gedung A", score: 87, status: "Efisien" },
  { ruang: "Ruang 301", gedung: "Gedung B", score: 63, status: "Perlu Perhatian" },
  { ruang: "Ruang 402", gedung: "Gedung B", score: 41, status: "Boros" },
  { ruang: "Ruang Produksi", gedung: "Gedung B", score: 38, status: "Sangat Boros" },
];

const chartConfig = {
  kwh: {
    label: "Konsumsi (kWh)",
    color: "hsl(var(--primary))",
  },
};

export default function LaporanPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* HEADER & FILTER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Laporan Energi</h1>
          <p className="text-muted-foreground mt-1">
            Analisis komprehensif penggunaan energi dan potensi penghematan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-card">
            <Filter className="mr-2 h-4 w-4" /> Filter <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Konsumsi (Bulan Ini)</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">38.450 kWh</div>
            <p className="text-xs text-muted-foreground mt-1 text-[#E05252]">
              +5% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Biaya (Estimasi)</CardTitle>
            <Wallet className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Rp57.675.000</div>
          </CardContent>
        </Card>
        <Card className="border-[#E05252]/30 bg-[#E05252]/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#E05252]">Potensi Pemborosan</CardTitle>
            <TrendingDown className="h-4 w-4 text-[#E05252]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E05252]">Rp5.240.000</div>
            <p className="text-xs text-[#E05252]/80 mt-1">
              Berdasarkan deteksi abnormal usage
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#18A878]/30 bg-[#18A878]/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#18A878]">Potensi Penghematan</CardTitle>
            <Leaf className="h-4 w-4 text-[#18A878]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#18A878]">~ 9.1%</div>
            <p className="text-xs text-[#18A878]/80 mt-1">
              Jika mengikuti rekomendasi WattWatch
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar Chart (Tren Bulanan) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Penggunaan Energi Bulanan</CardTitle>
            <CardDescription>Perbandingan konsumsi listrik (kWh) sepanjang tahun</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={trenBulananData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="bulan" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="kwh" fill="var(--color-kwh)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Donut Chart (Distribusi Biaya) */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Distribusi Penggunaan</CardTitle>
            <CardDescription>Berdasarkan kategori perangkat</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center pb-6">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribusiBiayaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {distribusiBiayaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => [`${value}%`, 'Proporsi']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="w-full space-y-2 mt-4">
              {distribusiBiayaData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RANKING EFISIENSI */}
      <Card>
        <CardHeader>
          <CardTitle>Peringkat Efisiensi Ruangan</CardTitle>
          <CardDescription>Mengidentifikasi ruangan paling efisien dan paling boros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead className="w-[80px]">Peringkat</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Gedung</TableHead>
                  <TableHead>Efficiency Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankingEfisiensi.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium text-foreground">{item.ruang}</TableCell>
                    <TableCell className="text-muted-foreground">{item.gedung}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{item.score}</span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full ${
                              item.score >= 80 ? "bg-[#18A878]" :
                              item.score >= 60 ? "bg-[#F2A900]" : "bg-[#E05252]"
                            }`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${
                        item.score >= 80 ? "text-[#18A878]" :
                        item.score >= 60 ? "text-[#F2A900]" : "text-[#E05252]"
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
