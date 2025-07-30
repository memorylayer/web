import { useState, useCallback } from "react";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

// Mock chat history data
const mockChatHistory: ChatSession[] = [
  {
    id: "session_1",
    title: "Team Lunch Planning",
    lastMessage: "Thanks! That's really helpful. One more thing - what was that backup VPN server address again?",
    timestamp: new Date("2024-01-21T09:10:00"),
  },
  {
    id: "session_2", 
    title: "Project Timeline Discussion",
    lastMessage: "Can you help me remember the key milestones for Q2?",
    timestamp: new Date("2024-01-20T14:30:00"),
  },
  {
    id: "session_3",
    title: "Client Meeting Notes",
    lastMessage: "What were the main action items from yesterday's client call?",
    timestamp: new Date("2024-01-19T16:45:00"),
  },
  {
    id: "session_4",
    title: "Code Review Feedback",
    lastMessage: "Can you recall the performance optimization suggestions?",
    timestamp: new Date("2024-01-18T11:20:00"),
  },
  {
    id: "session_5",
    title: "Product Feature Discussion",
    lastMessage: "What are the user requirements we documented last week?",
    timestamp: new Date("2024-01-17T13:15:00"),
  },
  {
    id: "session_6",
    title: "Bug Reports Discussion",
    lastMessage: "Let's prioritize the critical bugs for this sprint",
    timestamp: new Date("2024-01-16T10:30:00"),
  },
  {
    id: "session_7",
    title: "Marketing Strategy",
    lastMessage: "What's our approach for the Q2 campaign?",
    timestamp: new Date("2024-01-15T15:45:00"),
  },
  {
    id: "session_8",
    title: "User Research Findings",
    lastMessage: "The usability test results are quite interesting",
    timestamp: new Date("2024-01-14T11:20:00"),
  },
  {
    id: "session_5",
    title: "Product Feature Discussion",
    lastMessage: "What are the user requirements we documented last week?",
    timestamp: new Date("2024-01-17T13:15:00"),
  },
];

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(mockChatHistory);
  const [currentSessionId, setCurrentSessionId] = useState<string>("session_1");

  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setChatHistory(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(chatHistory[0]?.id || "");
    }
  }, [currentSessionId, chatHistory]);

  const createNewSession = useCallback((title: string, lastMessage: string) => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title,
      lastMessage,
      timestamp: new Date(),
    };
    setChatHistory(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  }, []);

  return {
    chatHistory,
    currentSessionId,
    selectSession,
    deleteSession,
    createNewSession,
  };
} 