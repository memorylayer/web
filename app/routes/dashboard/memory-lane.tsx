import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ChatInterface } from "@/components/memory-lane/chat-interface";
import { ChatHistorySidebar } from "@/components/memory-lane/chat-history-sidebar";
import { useState } from "react";

export default function MemoryLanePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <DashboardLayout title="Memory Lane">
      <div className="flex flex-col h-full relative">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-6">
            <ChatInterface />
          </div>
        </div>
        
        {/* Chat History Sidebar */}
        <ChatHistorySidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar} 
        />
      </div>
    </DashboardLayout>
  );
}
