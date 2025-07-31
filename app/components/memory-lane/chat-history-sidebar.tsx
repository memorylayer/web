"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";
import { 
  History, 
  MessageSquare, 
  MoreVertical, 
  PanelRightClose,
  PanelRightOpen,
  Trash2 
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatHistory } from "@/hooks/use-chat-history";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatHistorySidebar({ isOpen, onToggle }: ChatHistorySidebarProps) {
  const { chatHistory, currentSessionId, selectSession, deleteSession } = useChatHistory();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Click outside to close sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Trigger Button - Positioned absolutely on the right side */}
              <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-[110] transition-all duration-300",
          isOpen ? "right-80" : "right-4"
        )}
        aria-label="Toggle chat history"
      >
        {isOpen ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelRightOpen className="h-4 w-4" />
        )}
      </Button>

      {/* Sidebar - Positioned absolutely on the right side */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[100] transition-transform duration-300 ease-in-out w-80 border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="border-b px-4 py-3" style={{ flexShrink: 0 }}>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <h2 className="font-semibold text-lg">Chat History</h2>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <div className="px-2 py-2">
            {chatHistory.length > 0 ? (
              chatHistory.map((session) => (
                <div key={session.id} className="group relative mb-2">
                  <button 
                    type="button"
                    onClick={() => selectSession(session.id)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors hover:bg-accent/50 border border-transparent",
                      currentSessionId === session.id && "bg-accent border-border"
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 w-full">
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium text-sm truncate flex-1">
                          {session.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 text-left">
                        {session.lastMessage}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistance(session.timestamp, new Date(), { addSuffix: true })}
                      </span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu for session actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-3 w-3" />
                        <span className="sr-only">Session options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => deleteSession(session.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Session
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat history yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay - for mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onToggle}
          onKeyDown={(e) => e.key === 'Escape' && onToggle()}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}
    </>
  );
} 