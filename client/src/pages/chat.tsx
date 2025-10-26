import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Trash2, LogIn } from "lucide-react";
import logoUrl from "@assets/file_00000000d59861faa5d2b201fab77f3a (1)_1761396857368.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface User {
  authenticated: boolean;
  id?: string;
  name?: string;
}

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check if user is authenticated
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: user?.authenticated === true,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", { role: "user", content });
      return res.json();
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
      const res = await apiRequest("DELETE", "/api/messages");
      return res.json();
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

  const handleLogin = () => {
    window.addEventListener("message", authComplete);
    const h = 500;
    const w = 350;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;

    const authWindow = window.open(
      "https://replit.com/auth_with_repl_site?domain=" + location.host,
      "_blank",
      "modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );

    function authComplete(e: MessageEvent) {
      if (e.data !== "auth_complete") {
        return;
      }

      window.removeEventListener("message", authComplete);
      authWindow?.close();
      location.reload();
    }
  };

  // Show login page if not authenticated
  if (!user?.authenticated) {
    return (
      <div className="flex flex-col h-screen">
        <header className="border-b bg-background shrink-0">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="Core X AI" className="h-7 w-7" />
              <h1 className="text-lg font-semibold">Core X AI v3.0</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img src={logoUrl} alt="Core X AI" className="h-16 w-16" />
              </div>
              <CardTitle className="text-2xl">Welcome to Core X AI v3.0</CardTitle>
              <CardDescription>
                Sign in with your Replit account to start chatting with our AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogin} className="w-full" size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Log in with Replit
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.name}
            </span>
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
