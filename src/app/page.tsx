"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authClient } from "~/server/better-auth/client";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleGoogleLogin = async () => {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard", // Arahkan ke dashboard setelah login
    });
    setIsPending(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sisi Kiri: Form Login */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo & Branding */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary-foreground shadow-sm">
              <Zap className="h-6 w-6" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">WattWatch</h1>
              <p className="text-xs font-medium text-muted-foreground">
                Watch Your Watt. Control Your Cost
              </p>
            </div>
          </div>

          {/* Sapaan */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Selamat Datang 👋</h2>
            <p className="mt-2 text-muted-foreground">
              Masuk untuk memantau efisiensi energi UMKM Anda.
            </p>
          </div>

          {/* Form Auth */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email / Username</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@umkm.com"
                  className="py-5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="py-5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
            </div>

            <Button className="w-full py-6 text-base font-semibold shadow-sm">
              Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full py-6 text-base font-medium shadow-sm"
              onClick={handleGoogleLogin}
              disabled={isPending}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-2 h-5 w-5"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isPending ? "Memproses..." : "Google"}
            </Button>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Visual / Ilustrasi */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-secondary p-12 md:flex">
        <div className="relative flex h-full w-full max-w-lg flex-col items-center justify-center rounded-3xl bg-card p-12 text-center shadow-sm border border-border/50">
          <div className="mb-8 flex h-56 w-56 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Zap className="h-28 w-28" fill="currentColor" />
          </div>
          <h3 className="text-2xl font-bold text-primary">
            Monitoring Energi Real-time
          </h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Identifikasi pemborosan listrik dan hemat biaya operasional UMKM Anda
            dengan teknologi IoT dan analisis data cerdas.
          </p>
        </div>
      </div>
    </div>
  );
}
