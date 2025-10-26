
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, LogOut } from "lucide-react";
import logoUrl from "@assets/image_1761479863390.png";
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
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    username: "",
    email: "",
    password: "",
  });

  // Check if user is authenticated
  const { data: user, refetch: refetchUser } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: user?.authenticated === true,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { usernameOrEmail: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json();
    },
    onSuccess: () => {
      refetchUser();
      toast({
        title: "Login successful",
        description: "Welcome to Core X AI!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json();
    },
    onSuccess: () => {
      setIsLogin(true);
      toast({
        title: "Account created",
        description: "Please log in with your new account",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout");
      return res.json();
    },
    onSuccess: () => {
      refetchUser();
      toast({
        title: "Logged out",
        description: "See you later!",
      });
    },
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
        description: error.message || "Failed to send message",
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      usernameOrEmail: formData.usernameOrEmail,
      password: formData.password,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  };

  // Show login page if not authenticated
  if (!user?.authenticated) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <header className="border-b bg-background shrink-0">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-end">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img src={logoUrl} alt="Core X" className="h-20 w-20" />
              </div>
              <CardTitle className="text-2xl">
                {isLogin ? "Log in to Core X" : "Create Core X Account"}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Enter your credentials to access Core X AI" 
                  : "Sign up to start using Core X AI"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="usernameOrEmail">Username or Email</Label>
                    <Input
                      id="usernameOrEmail"
                      type="text"
                      placeholder="Enter your username or email"
                      value={formData.usernameOrEmail}
                      onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                  <div className="text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-primary hover:underline"
                    >
                      Create Core X Account
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      placeholder="Create a password (min 8 characters)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={8}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                  <div className="text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-primary hover:underline"
                    >
                      Already have an account? Log in
                    </button>
                  </div>
                </form>
              )}
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
            <Button variant="ghost" size="icon" onClick={() => logoutMutation.mutate()}>
              <LogOut className="h-5 w-5" />
            </Button>
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
