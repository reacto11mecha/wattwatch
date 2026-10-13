"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";

export default function RuanganPage() {
  const utils = api.useUtils(); // Untuk refresh data setelah input
  const router = useRouter();

  // State untuk form sederhana
  const [namaGedungBaru, setNamaGedungBaru] = useState("");
  const [namaRuanganBaru, setNamaRuanganBaru] = useState("");
  const [activeGedungId, setActiveGedungId] = useState<string | null>(null);

  // State untuk menyimpan kredensial yang baru digenerate agar bisa di-copy
  const [kredensialBaru, setKredensialBaru] = useState<{ id: string; apiKey: string; namaRuangan: string } | null>(null);

  // Queries
  const { data: daftarGedung, isLoading } = api.lokasi.getGedung.useQuery();

  // Mutations
  const createGedung = api.lokasi.createGedung.useMutation({
    onSuccess: () => {
      utils.lokasi.getGedung.invalidate(); // Refresh data
      setNamaGedungBaru("");
    },
  });

  const createRuangan = api.lokasi.createRuangan.useMutation({
    onSuccess: () => {
      utils.lokasi.getGedung.invalidate();
      setNamaRuanganBaru("");
      setActiveGedungId(null);
    },
  });

  const createPerangkat = api.perangkat.createPerangkat.useMutation({
    onSuccess: (data, variables) => {
      // Tampilkan hasil kredensial ke layar
      setKredensialBaru({
        id: data.id,
        apiKey: data.apiKey,
        namaRuangan: variables.nama, // Pinjam nama untuk display
      });
      alert("Alat berhasil didaftarkan! Silakan copy ID dan API Key yang muncul di atas layar.");
    },
  });

  if (isLoading) return <div className="p-8">Memuat data...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Ruangan & Perangkat</h1>
        <p className="text-gray-500">Kelola lokasi dan hubungkan ESP32 WattWatch Anda di sini.</p>
      </div>

      {/* --- KOTAK PERINGATAN KREDENSIAL (Hanya muncul saat baru pairing) --- */}
      {kredensialBaru && (
        <Card className="p-6 bg-blue-50 border-blue-400">
          <h2 className="text-xl font-bold text-blue-800 mb-2">🎉 Pairing Berhasil!</h2>
          <p className="text-sm text-red-600 font-semibold mb-4">
            SIMPAN DATA INI SEKARANG. API Key tidak akan ditampilkan lagi setelah Anda merefresh halaman.
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-bold">Device ID</label>
              <Input readOnly value={kredensialBaru.id} className="font-mono bg-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold">API Key</label>
              <Input readOnly value={kredensialBaru.apiKey} className="font-mono bg-white" />
            </div>
          </div>
          <Button className="mt-4" onClick={() => setKredensialBaru(null)}>Tutup & Saya Sudah Copy</Button>
        </Card>
      )}

      {/* --- FORM TAMBAH GEDUNG --- */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Tambah Gedung Baru</h2>
        <div className="flex gap-4">
          <Input
            placeholder="Contoh: Pabrik Roti Cabang A"
            value={namaGedungBaru}
            onChange={(e) => setNamaGedungBaru(e.target.value)}
          />
          <Button
            disabled={!namaGedungBaru || createGedung.isPending}
            onClick={() => createGedung.mutate({ nama: namaGedungBaru })}
          >
            {createGedung.isPending ? "Menyimpan..." : "Simpan Gedung"}
          </Button>
        </div>
      </Card>

      {/* --- DAFTAR GEDUNG & RUANGAN --- */}
      <div className="space-y-6">
        {daftarGedung?.length === 0 && (
          <p className="text-gray-500 italic">Belum ada gedung. Silakan tambah gedung terlebih dahulu.</p>
        )}

        {daftarGedung?.map((gedung) => (
          <Card key={gedung.id} className="p-6">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">{gedung.nama}</h2>

            {/* List Ruangan di dalam Gedung ini */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {gedung.ruangan.length === 0 && <p className="text-sm text-gray-400">Belum ada ruangan di gedung ini.</p>}

              {gedung.ruangan.map((ruang) => (
                <div key={ruang.id} className="border p-4 rounded-md flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-lg">{ruang.nama}</h3>
                    <p className="text-sm text-gray-500">Status: {ruang.status}</p>
                  </div>

                  {/* Tombol Pairing ESP32 untuk Ruangan Ini */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => createPerangkat.mutate({ ruanganId: ruang.id, nama: `Alat ${ruang.nama}` })}
                    disabled={createPerangkat.isPending}
                  >
                    + Pairing ESP32
                  </Button>
                  <Button size="sm" variant="default" onClick={() => router.push("/ruangan/detail?id=" + ruang.id)}>Lihat Detail</Button>
                </div>
              ))}
            </div>

            {/* Form Tambah Ruangan Inline */}
            {activeGedungId === gedung.id ? (
              <div className="flex gap-2 mt-4 bg-gray-100 p-3 rounded-md">
                <Input
                  placeholder="Nama Ruangan (Cth: Ruang Produksi 1)"
                  value={namaRuanganBaru}
                  onChange={(e) => setNamaRuanganBaru(e.target.value)}
                />
                <Button
                  onClick={() => createRuangan.mutate({ gedungId: gedung.id, nama: namaRuanganBaru })}
                  disabled={!namaRuanganBaru || createRuangan.isPending}
                >
                  Simpan
                </Button>
                <Button variant="ghost" onClick={() => { setActiveGedungId(null); setNamaRuanganBaru(""); }}>Batal</Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setActiveGedungId(gedung.id)}>
                + Tambah Ruangan
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
