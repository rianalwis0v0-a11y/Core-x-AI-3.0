// server/openai.ts

import { google } from "googleapis";
import fs from "fs";
import fetch from "node-fetch";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// -------------------- Google Drive Setup -------------------- //
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const CREDENTIALS_PATH = "credentials.json"; // your downloaded credentials
const TOKEN_PATH = "token.json"; // stores OAuth token after first auth

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

export async function readDriveFile(auth: any, fileId: string): Promise<string> {
  const drive = google.drive({ version: "v3", auth });
  const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });

  return new Promise<string>((resolve) => {
    let data = "";
    res.data.on("data", chunk => data += chunk);
    res.data.on("end", () => resolve(data));
  });
}

export async function writeDriveFile(
  auth: any,
  folderId: string,
  name: string,
  content: string
) {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = { name, parents: [folderId] };
  const media = { mimeType: "application/json", body: content };

  await drive.files.create({ resource: fileMetadata, media, fields: "id" });
}

// -------------------- Ollama Connection -------------------- //
const OLLAMA_API_URL = "http://127.0.0.1:11434/api/chat"; // change if cloud-hosted

export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", // your Ollama model
        messages: messages,
      }),
    });

    const data = await response.json();
    return data?.message?.content || data?.content || "No response from Ollama.";
  } catch (error: any) {
    console.error("Ollama API Error:", error);
    return "Error connecting to Ollama API.";
  }
}

// -------------------- Example Loop: Drive Hub -------------------- //
// Optional: watches Drive folder for input, sends to Ollama, writes output
export async function processDriveChat(folderId: string, inputFileId: string) {
  const auth = await authorize();

  // 1️⃣ Read user messages from Drive
  const inputJson = await readDriveFile(auth, inputFileId);
  const messages: ChatMessage[] = JSON.parse(inputJson);

  // 2️⃣ Get Ollama reply
  const reply = await getChatCompletion(messages);

  // 3️⃣ Write response back to Drive
  await writeDriveFile(auth, folderId, "response.json", JSON.stringify({ reply }, null, 2));

  console.log("✅ Chat processed and response saved to Drive");
    }
