import OpenAI from "openai";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // store this in Replit secrets
});

export async function getChatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo"
      messages: messages,
    });

    return (
      completion.choices[0].message?.content ||
      "I couldn’t generate a response."
    );
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error("Error connecting to OpenAI API: " + error.message);
  }
}
