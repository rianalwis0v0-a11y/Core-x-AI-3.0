import express from "express";
import multer from "multer";
import { transcribeAudio } from "./voice/transcribe";
import { verifyVoice } from "./voice/verify";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const OLLAMA_API_URL = "http://127.0.0.1:11434/api/chat"; 
// 👆 Change to your cloud server IP if not local

// File upload (for voice)
const upload = multer({ dest: "uploads/" });
export const app = express();
app.use(express.json());

// 🔹 TEXT CHAT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const messages: ChatMessage[] = req.body.messages;

    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages,
      }),
    });

    const data = await response.json();
    const reply =
      data?.message?.content ||
      data?.content ||
      "I couldn’t generate a response.";

    res.json({ reply });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Failed to connect to Ollama" });
  }
});

// 🔹 VOICE CHAT ENDPOINT
app.post("/api/voice", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = req.file?.path;
    if (!audioPath) return res.status(400).send("No audio uploaded.");

    // Step 1️⃣ - Transcribe
    const text = await transcribeAudio(audioPath);

    // Step 2️⃣ - Verify Speaker
    const verified = await verifyVoice(audioPath);
    if (!verified) return res.status(403).json({ error: "Voice not verified" });

    // Step 3️⃣ - Send to AI
    const messages: ChatMessage[] = [{ role: "user", content: text }];

    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages,
      }),
    });

    const data = await response.json();
    const reply =
      data?.message?.content ||
      data?.content ||
      "I couldn’t generate a response.";

    res.json({ text, reply });
  } catch (error: any) {
    console.error("Voice Chat Error:", error);
    res.status(500).json({ error: "Voice processing failed" });
  }
});

export default app;
