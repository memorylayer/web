import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ChatInterface } from "@/components/memory-lane/chat-interface";
import { ChatSidebar } from "@/components/memory-lane/chat-sidebar";
import { sidebarActions, memoryActions, type MemoryReference } from "@/states";

export default function MemoryLanePage() {
  const showMemoryDetail = (memoryRef: MemoryReference) => {
    memoryActions.selectMemory(memoryRef);
    sidebarActions.showMemoryDetail();
  };

  return (
    <DashboardLayout title="Memory Chat">
      <div className="flex flex-col h-full relative">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-6">
            <ChatInterface onMemoryClick={showMemoryDetail} />
          </div>
        </div>

        {/* Chat Sidebar */}
        <ChatSidebar />
      </div>
    </DashboardLayout>
  );
}
