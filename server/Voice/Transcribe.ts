// /server/voice/transcribe.ts
import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";

const execAsync = util.promisify(exec);

/**
 * Uses a Whisper CLI to transcribe audio.
 * You can change the command to match your setup:
 *   pip install -U openai-whisper
 *   whisper myaudio.wav --model small --output_dir ./tmp
 */
export async function transcribeAudio(filePath: string): Promise<string> {
  const outDir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  const txtPath = path.join(outDir, `${base}.txt`);

  try {
    // Call whisper CLI
    const cmd = `whisper "${filePath}" --model small --output_dir "${outDir}" --no_timestamp --verbose false`;
    await execAsync(cmd);

    if (fs.existsSync(txtPath)) {
      const text = fs.readFileSync(txtPath, "utf8").trim();
      return text;
    } else {
      console.warn("No transcription file found:", txtPath);
      return "";
    }
  } catch (err) {
    console.error("Transcription failed:", err);
    return "";
  }
}
