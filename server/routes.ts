import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatCompletion } from "./openai";
import { insertMessageSchema } from "@shared/schema";
import { registerUser, loginUser, verifySession, logout } from "./auth";
import cookieParser from "cookie-parser";

// Authentication middleware
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.coreXToken;
  
  if (!token) {
    return res.status(401).json({ 
      error: "Authentication required. Please log in with your Core X account." 
    });
  }
  
  const user = await verifySession(token);
  if (!user) {
    return res.status(401).json({ 
      error: "Invalid or expired session. Please log in again." 
    });
  }
  
  (req as any).user = user;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }
      
      await registerUser(username, email, password);
      res.json({ success: true, message: "Account created successfully" });
    } catch (error: any) {
      if (error.message?.includes("UNIQUE")) {
        return res.status(400).json({ error: "Username or email already exists" });
      }
      res.status(500).json({ error: error.message });
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      
      if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      const session = await loginUser(usernameOrEmail, password);
      
      res.cookie("coreXToken", session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "lax",
      });
      
      res.json({ 
        success: true, 
        user: { id: session.userId, username: session.username }
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", async (req, res) => {
    const token = req.cookies.coreXToken;
    if (token) {
      await logout(token);
    }
    res.clearCookie("coreXToken");
    res.json({ success: true });
  });
  
  // Get all messages (requires authentication)
  app.get("/api/messages", requireAuth, async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send a message and get AI response (requires authentication)
  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const validated = insertMessageSchema.parse(req.body);
      
      // Store user message
      const userMessage = await storage.addMessage(validated);
      
      // Get conversation history for context
      const allMessages = await storage.getMessages();
      const conversationHistory = allMessages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Add system message at the beginning for context
      const messagesForAI = [
        {
          role: "system" as const,
          content: "You are Core X AI v3.0, an intelligent assistant running on Ollama with Llama 3.2. You help users with questions, coding, problem-solving, and creative tasks. Be helpful, clear, and concise.",
        },
        ...conversationHistory,
      ];

      // Get AI response
      const aiResponse = await getChatCompletion(messagesForAI);
      
      // Store AI response
      const assistantMessage = await storage.addMessage({
        role: "assistant",
        content: aiResponse,
      });

      res.json({
        userMessage,
        assistantMessage,
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Clear all messages (requires authentication)
  app.delete("/api/messages", requireAuth, async (_req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get current user info
  app.get("/api/user", async (req, res) => {
    const token = req.cookies.coreXToken;
    
    if (!token) {
      return res.json({ authenticated: false });
    }
    
    const user = await verifySession(token);
    if (!user) {
      return res.json({ authenticated: false });
    }
    
    res.json({
      authenticated: true,
      id: user.userId,
      name: user.username
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
