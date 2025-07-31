import { observable } from "@legendapp/state"
import type { ChatSession } from "./types"

interface ChatHistoryState {
  sessions: ChatSession[]
  currentSessionId: string | null
}

// Mock data for chat history
const mockChatHistory: ChatSession[] = [
  {
    id: "session_1",
    title: "Product Feature Discussion",
    lastMessage: "What are the user requirements we documented last week?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "session_2", 
    title: "Technical Implementation",
    lastMessage: "How should we structure the database schema for the new features?",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "session_3",
    title: "Bug Investigation",
    lastMessage: "The authentication flow seems to be failing intermittently",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "session_4",
    title: "Performance Optimization",
    lastMessage: "Database queries are running slower than expected",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "session_5",
    title: "UI/UX Design Review",
    lastMessage: "The new dashboard layout needs some adjustments",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    id: "session_6",
    title: "API Documentation",
    lastMessage: "We need to update the endpoint documentation for v2",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    id: "session_7",
    title: "Security Audit",
    lastMessage: "Review the latest security scan results",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
  },
  {
    id: "session_8",
    title: "Deployment Strategy",
    lastMessage: "Planning the next release deployment",
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
  }
]

// Create the chat history observable
export const chatHistoryState$ = observable<ChatHistoryState>({
  sessions: mockChatHistory,
  currentSessionId: "session_1" // Default to first session
})

// Actions for chat history management
export const chatHistoryActions = {
  /**
   * Select a chat session
   */
  selectSession: (sessionId: string) => {
    chatHistoryState$.currentSessionId.set(sessionId)
  },

  /**
   * Delete a chat session
   */
  deleteSession: (sessionId: string) => {
    const currentSessions = chatHistoryState$.sessions.get()
    const filteredSessions = currentSessions.filter(session => session.id !== sessionId)
    chatHistoryState$.sessions.set(filteredSessions)
    
    // If we deleted the current session, select the first remaining one
    const currentId = chatHistoryState$.currentSessionId.get()
    if (currentId === sessionId) {
      const firstSessionId = filteredSessions.length > 0 ? filteredSessions[0].id : null
      chatHistoryState$.currentSessionId.set(firstSessionId)
    }
  },

  /**
   * Create a new chat session
   */
  createNewSession: (title: string, lastMessage: string) => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title,
      lastMessage,
      timestamp: new Date()
    }
    
    const currentSessions = chatHistoryState$.sessions.get()
    chatHistoryState$.sessions.set([newSession, ...currentSessions])
    chatHistoryState$.currentSessionId.set(newSession.id)
  },

  /**
   * Update a session's last message
   */
  updateLastMessage: (sessionId: string, lastMessage: string) => {
    const currentSessions = chatHistoryState$.sessions.get()
    const updatedSessions = currentSessions.map(session => 
      session.id === sessionId 
        ? { ...session, lastMessage, timestamp: new Date() }
        : session
    )
    chatHistoryState$.sessions.set(updatedSessions)
  }
} 