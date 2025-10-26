
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

async function getOllamaCompletion(
  messages: ChatMessage[]
): Promise<string> {
  const ollamaUrl = "http://127.0.0.1:11434";
  
  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        messages: messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content || "I apologize, but I couldn't generate a response.";
  } catch (error: any) {
    if (error.message?.includes("ECONNREFUSED") || error.code === "ECONNREFUSED") {
      throw new Error("Ollama is not running. Start it using the 'Start Ollama' workflow from the dropdown menu.");
    }
    throw new Error(`Ollama error: ${error.message}`);
  }
}

export async function getChatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  return getOllamaCompletion(messages);
}
