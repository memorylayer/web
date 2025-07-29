import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ChatInterface } from "@/components/memory-lane/chat-interface";

export default function MemoryLanePage() {
  return (
    <DashboardLayout title="Memory Lane">
      <div className="flex flex-col h-full">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-6">
            <ChatInterface />
          </div>
        </div>

        {/* Chat Input Area - Fixed at bottom */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full max-w-3xl mx-auto px-4 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask anything, let's go down the memory lane..."
                className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="Send message"
                >
                  <title>Send message</title>
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
