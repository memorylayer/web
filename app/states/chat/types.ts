// Using a simplified Memory interface for UI components
interface Memory {
  id: string;
  content: string;
  metadata: {
    title?: string;
    tags?: string[];
    source?: string;
  };
  createdAt: Date;
}

export interface MemoryReference {
  id: string;
  title: string;
  memory: Memory;
}

export type SidebarView = "chat-history" | "memory-detail"

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
} 