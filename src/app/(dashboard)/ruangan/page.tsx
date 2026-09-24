"use client";

import { Search, Filter, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

// --- MOCK DATA ---
const roomData = [
  {
    id: "R101",
    nama: "Ruang 101",
    gedung: "Gedung A",
    konsumsi: "12,4 kWh/hari",
    score: 94,
    status: "Normal",
  },
  {
    id: "R202",
    nama: "Ruang 202",
    gedung: "Gedung A",
    konsumsi: "18,2 kWh/hari",
    score: 87,
    status: "Normal",
  },
  {
    id: "R301",
    nama: "Ruang 301",
    gedung: "Gedung B",
    konsumsi: "27,5 kWh/hari",
    score: 63,
    status: "Warning",
  },
  {
    id: "R402",
    nama: "Ruang 402",
    gedung: "Gedung B",
    konsumsi: "34,8 kWh/hari",
    score: 41,
    status: "Abnormal",
  },
];

// Helper untuk warna badge status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Normal":
      return (
        <Badge variant="outline" className="border-[#18A878] bg-[#18A878]/10 text-[#18A878]">
          🟢 Normal
        </Badge>
      );
    case "Warning":
      return (
        <Badge variant="outline" className="border-[#F2A900] bg-[#F2A900]/10 text-[#F2A900]">
          🟠 Warning
        </Badge>
      );
    case "Abnormal":
      return (
        <Badge variant="outline" className="border-[#E05252] bg-[#E05252]/10 text-[#E05252]">
          🔴 Abnormal
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function DaftarRuanganPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Daftar Ruangan</h1>
        <p className="text-muted-foreground mt-1">
          Monitor konsumsi energi setiap ruangan secara real-time.
        </p>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari ruangan..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" /> Gedung
          </Button>
          <Button variant="outline" className="text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" /> Status
          </Button>
          <Button variant="outline" className="text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" /> Efisiensi
          </Button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead className="font-semibold text-foreground">Ruangan</TableHead>
              <TableHead className="font-semibold text-foreground">Gedung</TableHead>
              <TableHead className="font-semibold text-foreground">Konsumsi</TableHead>
              <TableHead className="font-semibold text-foreground">Efisiensi</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomData.map((room) => (
              <TableRow key={room.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-foreground">{room.nama}</TableCell>
                <TableCell className="text-muted-foreground">{room.gedung}</TableCell>
                <TableCell className="text-muted-foreground">{room.konsumsi}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{room.score}/100</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full ${
                          room.score >= 80 ? "bg-[#18A878]" :
                          room.score >= 60 ? "bg-[#F2A900]" : "bg-[#E05252]"
                        }`}
                        style={{ width: `${room.score}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(room.status)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/ruangan/detail`}>
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
                      <Eye className="mr-2 h-4 w-4" />
                      Detail
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
