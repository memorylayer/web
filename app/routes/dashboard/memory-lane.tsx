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
      </div>
    </DashboardLayout>
  );
}
