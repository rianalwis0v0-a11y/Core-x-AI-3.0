import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function getChatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: messages,
      max_completion_tokens: 8192,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  } catch (error: any) {
    if (error?.status === 401) {
      throw new Error("OpenAI API key is invalid or missing. Please add your API key in the Secrets tab.");
    }
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}
