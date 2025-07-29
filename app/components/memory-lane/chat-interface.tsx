"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatDistance } from "date-fns";
import { Brain, User } from "lucide-react";
import React, { useState } from "react";

// Types
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

interface MemoryReference {
  id: string;
  title: string;
  memory: Memory;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  memoryReferences?: MemoryReference[];
}

// Placeholder data
const mockMemories: Memory[] = [
  {
    id: "mem_1",
    content:
      "John has a severe peanut allergy and carries an EpiPen at all times. He also prefers organic, locally-sourced produce and follows a Mediterranean diet pattern.",
    metadata: {
      title: "John's Dietary Restrictions and Preferences",
      tags: ["diet", "allergies", "health"],
      source: "conversation",
    },
    createdAt: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "mem_2",
    content:
      "Company policy: All IT support tickets must be resolved within 24 hours during business days. Escalation to Level 2 support happens after 4 hours if unresolved.",
    metadata: {
      title: "IT Support Response Times",
      tags: ["policy", "support", "SLA"],
      source: "company_handbook",
    },
    createdAt: new Date("2024-01-10T14:15:00"),
  },
  {
    id: "mem_3",
    content:
      "Sarah mentioned she's lactose intolerant but can handle hard cheeses like aged cheddar. She loves Mediterranean cuisine and is trying to reduce gluten intake.",
    metadata: {
      title: "Sarah's Food Preferences",
      tags: ["diet", "lactose", "mediterranean"],
      source: "team_lunch_discussion",
    },
    createdAt: new Date("2024-01-20T12:45:00"),
  },
  {
    id: "mem_4",
    content:
      "VPN connection issues are usually resolved by switching to the backup server vpn-backup.company.com. If that fails, check if MFA is properly configured.",
    metadata: {
      title: "VPN Troubleshooting Steps",
      tags: ["VPN", "troubleshooting", "IT"],
      source: "support_ticket_resolution",
    },
    createdAt: new Date("2024-01-18T16:20:00"),
  },
];

const mockMessages: Message[] = [
  {
    id: "msg_1",
    type: "user",
    content:
      "I'm planning a team lunch for next week. Can you help me remember everyone's dietary preferences?",
    timestamp: new Date("2024-01-21T09:00:00"),
  },
  {
    id: "msg_2",
    type: "assistant",
    content:
      "I'd be happy to help you plan the team lunch! Based on what I remember about your team's dietary preferences, here's what I found:\n\nJohn has a severe peanut allergy and carries an EpiPen, so we need to be extra careful about cross-contamination. He prefers organic, locally-sourced options and follows a Mediterranean diet.\n\nSarah is lactose intolerant but can handle aged hard cheeses like cheddar. She also loves Mediterranean cuisine and is trying to reduce her gluten intake.\n\nFor the lunch planning, I'd recommend looking for restaurants that can accommodate these needs - perhaps a Mediterranean place that's allergy-conscious and offers gluten-free options?",
    timestamp: new Date("2024-01-21T09:01:30"),
    memoryReferences: [
      {
        id: "ref_1",
        title: "John's Dietary Restrictions",
        memory: mockMemories[0],
      },
      {
        id: "ref_2",
        title: "Sarah's Food Preferences",
        memory: mockMemories[2],
      },
    ],
  },
  {
    id: "msg_3",
    type: "user",
    content:
      "Perfect! Also, can you remind me about our IT support policies? I need to set expectations for the new team member.",
    timestamp: new Date("2024-01-21T09:05:00"),
  },
  {
    id: "msg_4",
    type: "assistant",
    content:
      "Absolutely! Here are the key IT support policies for your new team member:\n\nOur standard SLA requires all IT support tickets to be resolved within 24 hours during business days. If a ticket isn't resolved within 4 hours, it automatically escalates to Level 2 support.\n\nFor common issues like VPN problems, there are established troubleshooting steps - usually switching to the backup server resolves most connection issues, and if that doesn't work, checking MFA configuration is the next step.\n\nMake sure the new team member knows they can always submit tickets through our portal, and urgent issues during business hours will get priority attention.",
    timestamp: new Date("2024-01-21T09:06:45"),
    memoryReferences: [
      {
        id: "ref_3",
        title: "IT Support Response Times",
        memory: mockMemories[1],
      },
      {
        id: "ref_4",
        title: "VPN Troubleshooting Steps",
        memory: mockMemories[3],
      },
    ],
  },
  {
    id: "msg_5",
    type: "user",
    content:
      "Thanks! That's really helpful. One more thing - what was that backup VPN server address again?",
    timestamp: new Date("2024-01-21T09:10:00"),
  },
  {
    id: "msg_6",
    type: "assistant",
    content:
      "The backup VPN server address is vpn-backup.company.com. That's usually the first troubleshooting step when users experience connection issues with the primary VPN server.",
    timestamp: new Date("2024-01-21T09:10:15"),
    memoryReferences: [
      {
        id: "ref_5",
        title: "VPN Troubleshooting Steps",
        memory: mockMemories[3],
      },
    ],
  },
];

// Memory Reference Component
function MemoryReferenceSheet({ reference }: { reference: MemoryReference }) {
  const { memory } = reference;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded border transition-colors"
        >
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          {reference.title}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-md sm:max-w-lg mr-4 mt-4 mb-4 rounded-l-lg shadow-lg">
        <SheetHeader>
          <SheetTitle className="text-left">Memory Details</SheetTitle>
        </SheetHeader>
        <div className="m-4 space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">
              Title
            </h3>
            <p className="text-sm">
              {memory.metadata.title || "Untitled Memory"}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">
              Content
            </h3>
            <p className="text-sm leading-relaxed">{memory.content}</p>
          </div>

          {memory.metadata.tags && memory.metadata.tags.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {memory.metadata.tags.map((tag) => (
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
              {formatDistance(memory.createdAt, new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>

          {memory.metadata.source && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">
                Source
              </h3>
              <p className="text-xs text-muted-foreground capitalize">
                {memory.metadata.source.replace(/_/g, " ")}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Message Component
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.type === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Avatar className="w-8 h-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </>
                 ) : (
           <AvatarFallback className="bg-white text-black border">
             <Brain className="w-4 h-4" />
           </AvatarFallback>
         )}
      </Avatar>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className={`rounded-lg px-4 py-3 shadow-sm border ${
            isUser ? "bg-background border-border" : "bg-muted/50 border-border"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Memory References */}
          {message.memoryReferences && message.memoryReferences.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {message.memoryReferences.map((reference) => (
                  <MemoryReferenceSheet
                    key={reference.id}
                    reference={reference}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1 px-1">
          {formatDistance(message.timestamp, new Date(), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

// Main Chat Interface Component
export function ChatInterface() {
  return (
    <div className="w-full sm:max-w-[800px] sm:mx-auto sm:px-4">
      <div className="space-y-6">
        {mockMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
