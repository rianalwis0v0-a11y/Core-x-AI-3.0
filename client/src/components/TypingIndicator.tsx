import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start mb-4">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-start">
        <div className="rounded-2xl px-4 py-3 bg-card border border-card-border">
          <div className="flex gap-1" data-testid="typing-indicator">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
}
