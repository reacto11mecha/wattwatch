import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        {/* Area Konten Utama */}
        <main className="flex w-full flex-col">
          {/* Header Mobile / Trigger Sidebar */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-card px-4 md:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="font-bold text-foreground">WattWatch</div>
          </header>

          <div className="flex-1 p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
