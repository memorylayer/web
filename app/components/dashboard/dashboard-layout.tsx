import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AIInput, AIInputTextarea, AIInputToolbar, AIInputSubmit } from "@/components/ai/input";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (message: string = inputValue) => {
    if (!message.trim()) return;

    const isOnMemoryLane = location.pathname === "/dashboard/memory-lane";

    if (!isOnMemoryLane) {
      // Store input and redirect to memory lane
      localStorage.setItem("ai-chat-input", message.trim());
      navigate("/dashboard/memory-lane");
      return;
    }

    // Submit the chat on memory lane page
    setIsSubmitting(true);
    try {
      // TODO: Implement actual chat submission logic here
      console.log("Submitting chat:", message);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInputValue("");
    } catch (error) {
      console.error("Error submitting chat:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [inputValue, location.pathname, navigate]);

  // Check for stored input when component mounts
  useEffect(() => {
    const storedInput = localStorage.getItem("ai-chat-input");
    if (storedInput && location.pathname === "/dashboard/memory-lane") {
      setInputValue(storedInput);
      localStorage.removeItem("ai-chat-input");
      // Auto-submit the stored input
      handleSubmit(storedInput);
    }
  }, [location.pathname, handleSubmit]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <ProtectedRoute>
      <div data-layout="dashboard" className="relative">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset className="relative">
            <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
              <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{title}</h1>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
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
              <div className="@container/main flex flex-1 flex-col gap-2 pb-24">
                {children}
              </div>
            </div>

            {/* AI Chat Input - Fixed at bottom of content area only */}
            <div className="absolute bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="p-4">
                <AIInput onSubmit={handleFormSubmit} className="shadow-lg">
                  <AIInputTextarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your memories..."
                    disabled={isSubmitting}
                  />
                  <AIInputToolbar>
                    <div className="flex-1" />
                    <AIInputSubmit 
                      disabled={!inputValue.trim() || isSubmitting}
                      status={isSubmitting ? "submitted" : "ready"}
                    />
                  </AIInputToolbar>
                </AIInput>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}
