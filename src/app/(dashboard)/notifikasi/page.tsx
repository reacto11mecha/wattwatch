"use client";

import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Bell, Check, AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function NotifikasiPage() {
  const utils = api.useUtils();

  // Ambil data notifikasi
  const { data: notifikasi, isLoading } = api.notifikasi.getNotifikasi.useQuery();

  // Fungsi untuk menandai sudah dibaca
  const markAsRead = api.notifikasi.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifikasi.getNotifikasi.invalidate(); // Refresh otomatis
    },
  });

  if (isLoading) return <div className="p-8 animate-pulse text-gray-500">Memuat notifikasi...</div>;

  // Helper untuk memilih ikon berdasarkan severity
  const getIcon = (severity: string) => {
    switch (severity) {
      case "Urgent": return <AlertTriangle className="text-red-500 w-6 h-6" />;
      case "Warning": return <AlertTriangle className="text-yellow-500 w-6 h-6" />;
      case "Success": return <CheckCircle className="text-green-500 w-6 h-6" />;
      default: return <Info className="text-blue-500 w-6 h-6" />;
    }
  };

  // Helper untuk warna badge
  const getBadgeVariant = (severity: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (severity) {
      case "Urgent": return "destructive";
      case "Warning": return "default";
      case "Success": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <Bell className="h-7 w-7 text-gray-700" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifikasi</h1>
          <p className="text-sm text-gray-500">Peringatan dan pembaruan sistem WattWatch</p>
        </div>
      </div>

      {notifikasi?.length === 0 ? (
        <Card className="p-12 text-center text-gray-500 border-dashed">
          Tidak ada notifikasi baru. Sistem berjalan normal.
        </Card>
      ) : (
        <div className="space-y-4">
          {notifikasi?.map((item) => (
            <Card
              key={item.id}
              className={`p-5 flex items-start gap-4 transition-colors ${
                item.isRead
                  ? 'bg-gray-50/50 border-gray-200 shadow-none'
                  : 'bg-white border-l-4 border-l-blue-500 shadow-sm'
              }`}
            >
              <div className="mt-1">
                {getIcon(item.severity)}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                  <h3 className={`text-lg font-semibold ${item.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                    {item.judul}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(item.createdAt).toLocaleString('id-ID', {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </span>
                </div>

                <p className={`text-sm mb-3 ${item.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                  {item.deskripsi}
                </p>

                <div className="flex items-center justify-between">
                  <Badge variant={getBadgeVariant(item.severity)}>{item.severity}</Badge>

                  {!item.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8"
                      onClick={() => markAsRead.mutate({ id: item.id })}
                      disabled={markAsRead.isPending}
                    >
                      <Check className="w-4 h-4 mr-1" /> Tandai sudah dibaca
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
