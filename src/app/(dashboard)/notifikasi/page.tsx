"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  MapPin,
  Check,
  Filter
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

// --- MOCK DATA ---
const initialNotifications = [
  {
    id: 1,
    title: "Abnormal Usage Detected",
    description: "Ruang Produksi menggunakan listrik 32% lebih tinggi dari pola normal.",
    ruangan: "Ruang Produksi",
    waktu: "10 menit yang lalu",
    severity: "urgent",
    isRead: false,
  },
  {
    id: 2,
    title: "Potential Energy Waste",
    description: "Ruang 301 kosong selama 45 menit tetapi AC masih menyala.",
    ruangan: "Ruang 301",
    waktu: "1 jam yang lalu",
    severity: "warning",
    isRead: false,
  },
  {
    id: 3,
    title: "High Consumption",
    description: "Ruang 402 memiliki konsumsi listrik tertinggi hari ini.",
    ruangan: "Ruang 402",
    waktu: "3 jam yang lalu",
    severity: "warning",
    isRead: true,
  },
  {
    id: 4,
    title: "Energy Saving",
    description: "Ruang 101 berhasil menghemat Rp12.500 hari ini berkat pengoptimalan suhu AC.",
    ruangan: "Ruang 101",
    waktu: "5 jam yang lalu",
    severity: "success",
    isRead: true,
  },
];

export default function NotifikasiPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [notifications, setNotifications] = useState(initialNotifications);

  // Helper untuk mendapatkan icon dan warna berdasarkan severity
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "urgent":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-[#E05252]" />,
          badge: <Badge variant="outline" className="border-[#E05252] bg-[#E05252]/10 text-[#E05252]">Urgent</Badge>,
          border: "border-l-4 border-l-[#E05252]",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-[#F2A900]" />,
          badge: <Badge variant="outline" className="border-[#F2A900] bg-[#F2A900]/10 text-[#F2A900]">Warning</Badge>,
          border: "border-l-4 border-l-[#F2A900]",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-[#18A878]" />,
          badge: <Badge variant="outline" className="border-[#18A878] bg-[#18A878]/10 text-[#18A878]">Informasi</Badge>,
          border: "border-l-4 border-l-[#18A878]",
        };
      default:
        return {
          icon: <Info className="h-6 w-6 text-muted-foreground" />,
          badge: <Badge variant="outline">Info</Badge>,
          border: "border-l-4 border-l-border",
        };
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "Urgent") return n.severity === "urgent";
    if (activeFilter === "Warning") return n.severity === "warning";
    if (activeFilter === "Informasi") return n.severity === "success" || n.severity === "info";
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifikasi & Alert</h1>
          <p className="text-muted-foreground mt-1">
            Pantau peringatan sistem dan aktivitas penggunaan energi.
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead} className="bg-card shrink-0">
          <Check className="mr-2 h-4 w-4" /> Tandai semua dibaca
        </Button>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
          <Filter className="h-4 w-4" /> Filter:
        </div>
        {["Semua", "Urgent", "Warning", "Informasi"].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className={activeFilter === filter ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* NOTIFICATION LIST */}
      <div className="flex flex-col gap-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const style = getSeverityStyle(notif.severity);
            return (
              <Card
                key={notif.id}
                className={`overflow-hidden transition-all hover:shadow-md ${style.border} ${notif.isRead ? 'bg-card/50 opacity-75' : 'bg-card shadow-sm'}`}
              >
                <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                  <div className="mt-1 shrink-0 p-2 rounded-full bg-secondary/50">
                    {style.icon}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className={`font-semibold ${notif.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {style.badge}
                        {!notif.isRead && (
                          <span className="flex h-2 w-2 rounded-full bg-[#E05252]"></span>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm mt-1 mb-2 ${notif.isRead ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>
                      {notif.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {notif.ruangan}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {notif.waktu}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 rounded-lg border border-dashed border-border bg-card/50">
            <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium text-foreground">Tidak ada notifikasi</h3>
            <p className="text-sm text-muted-foreground">Semua sistem berjalan normal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
