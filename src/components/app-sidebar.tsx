"use client";

import {
  Home,
  Building2,
  BarChart3,
  Bell,
  Settings,
  Zap,
  LogOut,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Ruangan", url: "/ruangan", icon: Building2 },
  { title: "Laporan", url: "/laporan", icon: BarChart3 },
  { title: "Notifikasi", url: "/notifikasi", icon: Bell },
  { title: "Pengaturan", url: "/pengaturan", icon: Settings },
];

export function AppSidebar({ name, email }: { name?: string; email?: string }) {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/50 bg-primary">
      {/* HEADER: Logo */}
      <SidebarHeader className="p-4 md:p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary-foreground shadow-sm">
            <Zap className="h-5 w-5" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-primary-foreground">
            WattWatch
          </span>
        </Link>
      </SidebarHeader>

      {/* CONTENT: Menu Navigasi */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg py-5 text-base transition-colors data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold text-sidebar-foreground/80"
                  >
                    <Link href={item.url}>
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER: Profil & Tagline */}
      <SidebarFooter className="p-4">
        <div className="mb-4 rounded-xl bg-sidebar-accent/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-primary-foreground">{name}</p>
              <p className="truncate text-xs text-primary-foreground/70">{email}</p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs font-medium text-primary-foreground/50">
          Watch Your Watt. <br/> Control Your Cost
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
