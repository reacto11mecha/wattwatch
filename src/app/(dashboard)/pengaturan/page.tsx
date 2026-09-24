"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Zap,
  Wifi,
  Database,
  Cpu,
  AlertCircle,
  Save
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";

export default function PengaturanPage() {
  // State untuk interaktivitas form saat didemokan
  const [isSaving, setIsSaving] = useState(false);
  const [autoPowerOff, setAutoPowerOff] = useState(true);
  const [ecoMode, setEcoMode] = useState(true);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000); // Simulasi loading
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola profil, preferensi notifikasi, dan konfigurasi sistem WattWatch Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* KOLOM KIRI: Profil & Notifikasi */}
        <div className="flex flex-col gap-6 md:col-span-2">

          {/* PROFIL ADMIN */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                <CardTitle>Profil Admin</CardTitle>
              </div>
              <CardDescription>Informasi akun pengelola sistem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" defaultValue="Admin WattWatch" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@umkm.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Super Admin" disabled className="bg-muted" />
              </div>
            </CardContent>
          </Card>

          {/* PENGATURAN NOTIFIKASI */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                <CardTitle>Pengaturan Notifikasi</CardTitle>
              </div>
              <CardDescription>Pilih jenis peringatan yang ingin Anda terima.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox id="notif-waste" defaultChecked />
                <Label htmlFor="notif-waste" className="text-sm font-normal">Alert pemborosan energi</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="notif-abnormal" defaultChecked />
                <Label htmlFor="notif-abnormal" className="text-sm font-normal">Konsumsi abnormal</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="notif-report" defaultChecked />
                <Label htmlFor="notif-report" className="text-sm font-normal">Laporan harian</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="notif-ai" defaultChecked />
                <Label htmlFor="notif-ai" className="text-sm font-normal">Rekomendasi sistem (WattWatch Insight)</Label>
              </div>
            </CardContent>
          </Card>

          {/* PENGATURAN OTOMATISASI (PROTOTYPE CONCEPT) */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <CardTitle>Pengaturan Otomatisasi</CardTitle>
              </div>
              <CardDescription>Atur tindakan otomatis untuk menghemat energi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Alert Note */}
              <div className="flex items-start gap-3 rounded-md border border-[#F2A900]/30 bg-[#F2A900]/10 p-4">
                <AlertCircle className="h-5 w-5 text-[#F2A900] shrink-0 mt-0.5" />
                <div className="text-sm text-[#F2A900] font-medium leading-relaxed">
                  <span className="font-bold">Catatan Prototipe:</span> Fitur otomatisasi ini adalah rancangan pengembangan masa depan. MVP WattWatch saat ini berfokus secara eksklusif pada pemantauan (monitoring) dan pelaporan (reporting).
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Matikan perangkat saat ruangan kosong</Label>
                  <p className="text-sm text-muted-foreground">Otomatis memutus daya jika sensor PIR tidak mendeteksi aktivitas.</p>
                </div>
                <Switch
                  checked={autoPowerOff}
                  onCheckedChange={setAutoPowerOff}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durasi jeda sebelum dimatikan (menit)</Label>
                <Input
                  id="duration"
                  type="number"
                  defaultValue="20"
                  disabled={!autoPowerOff}
                  className="max-w-[150px]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="space-y-0.5">
                  <Label className="text-base">Mode Hemat Energi</Label>
                  <p className="text-sm text-muted-foreground">Membatasi penggunaan alat berdaya tinggi di luar jam operasional.</p>
                </div>
                <Switch
                  checked={ecoMode}
                  onCheckedChange={setEcoMode}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/30 border-t border-border px-6 py-4">
              <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                {isSaving ? "Menyimpan..." : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Simpan Pengaturan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

        </div>

        {/* KOLOM KANAN: Status Sistem */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Sistem</CardTitle>
              <CardDescription>Konektivitas komponen IoT real-time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Wi-Fi (ESP32)</span>
                </div>
                <Badge variant="outline" className="border-[#18A878] bg-[#18A878]/10 text-[#18A878]">
                  🟢 Connected
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <Badge variant="outline" className="border-[#18A878] bg-[#18A878]/10 text-[#18A878]">
                  🟢 Connected
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Sensor (PZEM & DHT)</span>
                </div>
                <Badge variant="outline" className="border-[#18A878] bg-[#18A878]/10 text-[#18A878]">
                  🟢 Connected
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
