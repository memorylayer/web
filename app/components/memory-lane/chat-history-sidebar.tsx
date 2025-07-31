"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";
import { 
  ArrowLeft,
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
import { use$ } from "@legendapp/state/react";
import { 
  sidebarState$, 
  sidebarActions, 
  memoryState$, 
  memoryActions,
  chatHistoryState$,
  chatHistoryActions
} from "@/states";

export function ChatHistorySidebar() {
  const isOpen = use$(sidebarState$.isOpen);
  const view = use$(sidebarState$.view);
  const memoryDetail = use$(memoryState$.selectedMemory);
  const chatHistory = use$(chatHistoryState$.sessions);
  const currentSessionId = use$(chatHistoryState$.currentSessionId);
  
  const sidebarRef = useRef<HTMLDivElement>(null);



  const handleBackToHistory = () => {
    sidebarActions.showChatHistory();
    memoryActions.clearMemory();
  };

  // Click outside to close sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        sidebarActions.close();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        sidebarActions.close();
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
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button - Positioned absolutely on the right side */}
              <Button
        variant="outline"
        size="icon"
        onClick={sidebarActions.toggle}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-[110] transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
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
        <div className="border-b py-3" style={{ flexShrink: 0 }}>
          <div className="flex items-center">
            {view === "memory-detail" ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToHistory}
                  className="h-8 w-8 flex-shrink-0 ml-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="font-semibold text-lg flex-1 ml-2">Memory Details</h2>
              </>
            ) : (
              <>
                <div className="h-8 w-8 flex items-center justify-center flex-shrink-0 ml-2">
                  <History className="h-5 w-5" />
                </div>
                <h2 className="font-semibold text-lg flex-1 ml-2">Chat History</h2>
              </>
            )}
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {view === "memory-detail" && memoryDetail ? (
            // Memory Detail View
            <div className="px-4 py-4 space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  Title
                </h3>
                <p className="text-sm">
                  {memoryDetail.memory.metadata.title || "Untitled Memory"}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  Content
                </h3>
                <p className="text-sm leading-relaxed">{memoryDetail.memory.content}</p>
              </div>

              {memoryDetail.memory.metadata.tags && memoryDetail.memory.metadata.tags.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {memoryDetail.memory.metadata.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  Created
                </h3>
                <p className="text-sm">
                  {formatDistance(memoryDetail.memory.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {memoryDetail.memory.metadata.source && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    Source
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {memoryDetail.memory.metadata.source.replace(/_/g, " ")}
                  </p>
                </div>
              )}
            </div>
          ) : view === "chat-history" ? (
            // Chat History View
            <div className="px-2 py-2">
              {chatHistory.length > 0 ? (
                chatHistory.map((session) => (
                  <div key={session.id} className="group relative mb-2">
                    <button 
                      type="button"
                      onClick={() => chatHistoryActions.selectSession(session.id)}
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
                          onClick={() => chatHistoryActions.deleteSession(session.id)}
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
          ) : null}
        </div>
      </div>

      {/* Overlay - for mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm md:hidden"
          onClick={sidebarActions.close}
          onKeyDown={(e) => e.key === 'Escape' && sidebarActions.close()}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}
    </>
  );
} 