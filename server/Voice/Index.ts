// /server/voice/index.ts
import { transcribeAudio } from "./transcribe";
import { verifyVoice } from "./verify";

/**
 * Process an audio file:
 *  - Transcribes speech to text
 *  - Checks if the text contains the passphrase
 *  - Returns both results
 */
export async function processVoice(filePath: string, passphrase: string) {
  const text = await transcribeAudio(filePath);
  const matched = verifyVoice(text, passphrase);

  return { text, matched };
}
