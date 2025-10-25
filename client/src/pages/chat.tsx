import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2 } from "lucide-react";
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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // TODO: Remove mock functionality - Replace with actual API call
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Thank you for your message: "${content}"\n\nThis is a demo response. In the full application, I'll be powered by OpenAI's GPT models to provide intelligent, context-aware responses.\n\nI can help you with:\n- Answering questions\n- Explaining complex concepts\n- Writing and debugging code\n- Creative brainstorming\n- And much more!\n\nHere's a code example:\n\`\`\`javascript\nconst greet = (name) => {\n  console.log(\`Hello, \${name}!\`);\n};\n\ngreet("World");\n\`\`\``,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-background shrink-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold" data-testid="text-app-title">
              AI Assistant
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
        {messages.length === 0 && !isTyping ? (
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
                  timestamp={message.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      <ChatInput
        onSend={handleSend}
        disabled={isTyping}
        placeholder={messages.length === 0 ? "Ask me anything..." : "Type your message..."}
      />
    </div>
  );
}
