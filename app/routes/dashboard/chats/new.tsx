import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { NewChatWelcome } from "@/components/memory-lane/new-chat-welcome";
import { ChatSidebar } from "@/components/memory-lane/chat-sidebar";

export default function NewChatPage() {

  const handlePromptClick = (prompt: string) => {
    // Find the AI input textarea and populate it with the prompt
    const textareas = document.querySelectorAll('textarea[name="message"]');
    const aiTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement; // Get the last one (should be the AI input)
    
    if (aiTextarea) {
      // Set the value
      aiTextarea.value = prompt;
      
      // Trigger input event to update any React state
      const inputEvent = new Event('input', { bubbles: true });
      aiTextarea.dispatchEvent(inputEvent);
      
      // Focus the textarea
      aiTextarea.focus();
      
      // Set cursor to end
      aiTextarea.setSelectionRange(prompt.length, prompt.length);
      
      // Trigger resize if it's an auto-resizing textarea
      const resizeEvent = new Event('change', { bubbles: true });
      aiTextarea.dispatchEvent(resizeEvent);
    }
  };

  return (
    <DashboardLayout title="New Chat">
      <div className="flex flex-col h-full relative">
        {/* Welcome/Empty State */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-6">
            <NewChatWelcome onPromptClick={handlePromptClick} />
          </div>
        </div>
        
        {/* Chat Sidebar */}
        <ChatSidebar />
      </div>
    </DashboardLayout>
  );
}
