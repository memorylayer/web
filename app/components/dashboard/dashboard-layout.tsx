import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div data-layout="dashboard">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
              <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{title}</h1>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="ghost"
                    asChild
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <a
                      href="https://memorylayer.dev/docs"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="dark:text-foreground"
                    >
                      Documentation
                    </a>
                  </Button>
                </div>
              </div>
            </header>
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}
