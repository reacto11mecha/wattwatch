"use client";

import { useEffect, useState, useTransition } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LogOut, KeyRound, User as UserIcon } from "lucide-react";
// Sesuaikan path import ini dengan lokasi file snippet server action Anda disimpan
import {
  getCurrentUser,
  checkHasPassword,
  createPassword,
  changePassword,
  logoutAction
} from "~/server/actions";

export default function PengaturanPage() {
  const [profile, setProfile] = useState<{ name: string; email: string; nip: string | null } | null>(null);
  const [hasPassword, setHasPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getCurrentUser();
        const passStatus = await checkHasPassword();
        setProfile(userData);
        setHasPassword(passStatus);
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleSavePassword() {
    setStatusMsg({ text: "Memproses...", type: "info" });
    try {
      if (hasPassword) {
        await changePassword(currentPassword, newPassword);
      } else {
        await createPassword(newPassword);
        setHasPassword(true);
      }
      setStatusMsg({ text: "Password berhasil diperbarui!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      setStatusMsg({ text: "Gagal: Pastikan password saat ini benar.", type: "error" });
    }
  }

  if (isLoading) return <div className="p-8 text-gray-500 animate-pulse">Memuat data pengguna...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pengaturan Akun</h1>
          <p className="text-gray-500">Kelola informasi profil, keamanan, dan sesi Anda.</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => startTransition(() => logoutAction())}
          disabled={isPending}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isPending ? "Keluar..." : "Logout"}
        </Button>
      </div>

      {/* --- KARTU PROFIL --- */}
      <Card className="p-6 space-y-4 shadow-sm border-gray-200">
        <div className="flex items-center gap-2 border-b pb-2">
          <UserIcon className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">Profil Pengguna</h2>
        </div>

        <div className="grid gap-4 mt-4">
          <div className="space-y-1">
            <Label>Nama Lengkap</Label>
            <Input value={profile?.name || ""} readOnly className="bg-gray-50" />
          </div>
          <div className="space-y-1">
            <Label>Email (Google)</Label>
            <Input value={profile?.email || ""} readOnly className="bg-gray-50" />
          </div>
          {profile?.nip && (
            <div className="space-y-1">
              <Label>NIP</Label>
              <Input value={profile.nip} readOnly className="bg-gray-50" />
            </div>
          )}
        </div>
      </Card>

      {/* --- KARTU KEAMANAN & PASSWORD --- */}
      <Card className="p-6 space-y-4 shadow-sm border-gray-200">
        <div className="flex items-center gap-2 border-b pb-2">
          <KeyRound className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">
            {hasPassword ? "Ubah Password" : "Buat Password Akun"}
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          {hasPassword
            ? "Perbarui kata sandi Anda secara berkala untuk menjaga keamanan."
            : "Anda mendaftar menggunakan Google. Buat kata sandi sekarang agar dapat login menggunakan Email dan Password."}
        </p>

        <div className="grid gap-4 mt-4">
          {hasPassword && (
            <div className="space-y-1">
              <Label>Password Saat Ini</Label>
              <Input
                type="password"
                placeholder="Masukkan password lama"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <Label>{hasPassword ? "Password Baru" : "Buat Password"}</Label>
            <Input
              type="password"
              placeholder="Minimal 8 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {statusMsg.text && (
            <p className={`text-sm font-medium ${statusMsg.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
              {statusMsg.text}
            </p>
          )}

          <Button
            className="w-fit"
            disabled={!newPassword || (hasPassword && !currentPassword)}
            onClick={handleSavePassword}
          >
            Simpan Password
          </Button>
        </div>
      </Card>
    </div>
  );
}
