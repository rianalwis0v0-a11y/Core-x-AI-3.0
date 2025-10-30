// /server/voice/verify.ts

/**
 * Checks if the passphrase appears in the transcribed text.
 * Returns true if found (case-insensitive).
 */
export function verifyVoice(transcribedText: string, passphrase: string): boolean {
  if (!transcribedText || !passphrase) return false;

  const normalizedText = transcribedText.toLowerCase();
  const normalizedPhrase = passphrase.toLowerCase();

  return normalizedText.includes(normalizedPhrase);
}
