"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Brain,
  MessageSquare,
  Sparkles,
  Search,
  BookOpen,
  Link,
  Users,
  Calendar,
  ArrowRight,
  FileText
} from "lucide-react";
import type React from "react";

interface SuggestedPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "discovery",
    title: "Discovery",
    description: "Discover patterns and insights from your stored knowledge",
    prompt: "What interesting patterns can you find in my memories?",
    icon: Search
  },
  {
    id: "learning",
    title: "Learning",
    description: "Review what you've learned or discussed recently",
    prompt: "What have I learned or discussed in the past week?",
    icon: BookOpen
  },
  {
    id: "connections",
    title: "Connections",
    description: "Find connections between different topics in your memory",
    prompt: "How do the different topics in my memory connect to each other?",
    icon: Link
  },
  {
    id: "relationships",
    title: "Relationships",
    description: "Understand the people and relationships in your memories",
    prompt: "Tell me about the important people mentioned in my memories",
    icon: Users
  },
  {
    id: "planning",
    title: "Planning",
    description: "Use your memories to help with planning and decisions",
    prompt: "Help me plan something based on what you know about my preferences",
    icon: Calendar
  },
  {
    id: "summary",
    title: "Summary",
    description: "Get a comprehensive overview of your stored knowledge",
    prompt: "Give me a summary of the key topics and themes in my memories",
    icon: FileText
  }
];

interface NewChatWelcomeProps {
  onPromptClick?: (prompt: string) => void;
}

export function NewChatWelcome({ onPromptClick }: NewChatWelcomeProps) {
  const handlePromptClick = (prompt: string) => {
    if (onPromptClick) {
      onPromptClick(prompt);
    }
  };

  return (
    <div className="w-full sm:max-w-[800px] sm:mx-auto sm:px-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        {/* Suggested Prompts */}
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedPrompts.map((prompt) => {
              const IconComponent = prompt.icon;
              return (
                <Card 
                  key={prompt.id}
                  className="group relative overflow-hidden border border-border hover:border-border/60 transition-all duration-300 hover:shadow-md cursor-pointer"
                  onClick={() => handlePromptClick(prompt.prompt)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative px-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors mt-0.5">
                          <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-base">{prompt.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {prompt.description}
                          </p>
                        </div>
                      </div>
                      
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1 mt-1 flex-shrink-0" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-3 pt-6">
          <p className="text-sm text-muted-foreground">
            Or start typing in the input below to ask your own question
          </p>
        </div>
      </div>
    </div>
  );
} 