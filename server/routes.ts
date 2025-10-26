import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatCompletion } from "./openai";
import { insertMessageSchema } from "@shared/schema";

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-replit-user-id'];
  const userName = req.headers['x-replit-user-name'];
  
  if (!userId || !userName) {
    return res.status(401).json({ 
      error: "Authentication required. Please log in with your Replit account." 
    });
  }
  
  // Attach user info to request for later use
  (req as any).user = {
    id: userId,
    name: userName
  };
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
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
    const userId = req.headers['x-replit-user-id'];
    const userName = req.headers['x-replit-user-name'];
    
    if (!userId || !userName) {
      return res.json({ authenticated: false });
    }
    
    res.json({
      authenticated: true,
      id: userId,
      name: userName
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
