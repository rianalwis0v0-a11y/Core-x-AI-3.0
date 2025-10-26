import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatCompletion } from "./openai";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all messages
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send a message and get AI response
  app.post("/api/messages", async (req, res) => {
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

  // Clear all messages
  app.delete("/api/messages", async (_req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
