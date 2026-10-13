"use client";

import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function PengaturanPage() {
  // Dalam aplikasi nyata, Anda mengambil data profil dari better-auth session di sini

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan Akun</h1>
        <p className="text-gray-500">Kelola informasi profil dan kredensial Anda.</p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Profil Pengelola</h2>

        <div className="space-y-1">
          <Label>Nama UMKM / Pengelola</Label>
          <Input defaultValue="Admin WattWatch" readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-1">
          <Label>Email</Label>
          <Input defaultValue="admin@wattwatch.com" readOnly className="bg-gray-50" />
          <p className="text-xs text-gray-500 mt-1">Mengubah profil saat ini dinonaktifkan pada versi prototipe.</p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-red-600">Zona Bahaya</h2>
        <p className="text-sm text-gray-600">Tindakan di bawah ini tidak dapat dibatalkan.</p>
        <Button variant="destructive" disabled>
          Hapus Akun & Seluruh Data
        </Button>
      </Card>
    </div>
  );
}
