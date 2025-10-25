import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import logoUrl from "@assets/file_00000000d59861faa5d2b201fab77f3a (1)_1761396857368.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("/api/messages", {
        method: "POST",
        body: { role: "user", content },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please check if your API key is set.",
        variant: "destructive",
      });
    },
  });

  // Clear messages mutation
  const clearMessagesMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/messages", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Conversation cleared",
        description: "All messages have been deleted.",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessageMutation.isPending]);

  const handleSend = async (content: string) => {
    await sendMessageMutation.mutateAsync(content);
  };

  const handleClearChat = () => {
    clearMessagesMutation.mutate();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-background shrink-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoUrl} alt="Core X AI" className="h-7 w-7" />
            <h1 className="text-lg font-semibold" data-testid="text-app-title">
              Core X AI v3.0
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-clear-chat">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all messages in the current conversation. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChat} data-testid="button-confirm-clear">
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {messages.length === 0 && !sendMessageMutation.isPending && !isLoading ? (
          <EmptyState onSuggestedPrompt={handleSend} />
        ) : (
          <div
            ref={messagesContainerRef}
            className="h-full overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-4 py-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={new Date(message.timestamp)}
                />
              ))}
              {sendMessageMutation.isPending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      <ChatInput
        onSend={handleSend}
        disabled={sendMessageMutation.isPending}
        placeholder={messages.length === 0 ? "Ask me anything..." : "Type your message..."}
      />
    </div>
  );
}
