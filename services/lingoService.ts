/**
 * Lingo.dev Translation Service for Runtime Chat Translation
 *
 * Uses Lingo.dev SDK's localizeChat for real-time message translation
 */

import { LingoDotDevEngine } from "lingo.dev/sdk";

// Initialize Lingo.dev engine
const getLingoDotDev = () => {
  const apiKey = process.env.LINGODOTDEV_API_KEY;

  if (!apiKey) {
    console.warn("LINGODOTDEV_API_KEY not configured");
    return null;
  }

  return new LingoDotDevEngine({
    apiKey,
  });
};

interface ChatMessage {
  name: string;
  text: string;
}

/**
 * Translate a single message using Lingo.dev's localizeChat
 */
export async function translateMessage(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  const lingoDotDev = getLingoDotDev();

  if (!lingoDotDev) {
    console.warn("Lingo.dev not configured, returning original text");
    return text;
  }

  // Skip translation if source and target are the same
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  // Skip if text is empty
  if (!text || !text.trim()) {
    return text;
  }

  try {
    console.log(
      `Translating: "${text}" from ${sourceLanguage} to ${targetLanguage}`
    );

    // Use localizeChat with single message
    const conversation: ChatMessage[] = [{ name: "user", text }];

    const translated = await lingoDotDev.localizeChat(conversation, {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
    });

    const translatedText = translated[0]?.text || text;
    console.log(`Translated: "${translatedText}"`);

    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    // Fallback: return original text
    return text;
  }
}

/**
 * Translate multiple messages in a conversation using Lingo.dev
 * This maintains context across messages for better translation quality
 */
export async function translateConversation(
  messages: Array<{ name: string; text: string }>,
  sourceLanguage: string,
  targetLanguage: string
): Promise<Array<{ name: string; text: string }>> {
  const lingoDotDev = getLingoDotDev();

  if (!lingoDotDev) {
    console.warn("Lingo.dev not configured, returning original messages");
    return messages;
  }

  // Skip translation if source and target are the same
  if (sourceLanguage === targetLanguage) {
    return messages;
  }

  try {
    console.log(
      `Translating conversation (${messages.length} messages) from ${sourceLanguage} to ${targetLanguage}`
    );

    const translated = await lingoDotDev.localizeChat(messages, {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
    });

    console.log(`Conversation translated successfully`);
    return translated;
  } catch (error) {
    console.error("Conversation translation error:", error);
    return messages;
  }
}

/**
 * Batch translate multiple texts using Lingo.dev
 */
export async function batchTranslate(
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string
): Promise<string[]> {
  const lingoDotDev = getLingoDotDev();

  if (!lingoDotDev) {
    return texts;
  }

  // Skip translation if source and target are the same
  if (sourceLanguage === targetLanguage) {
    return texts;
  }

  try {
    // Convert texts to chat format
    const conversation: ChatMessage[] = texts.map((text, index) => ({
      name: `msg_${index}`,
      text,
    }));

    const translated = await lingoDotDev.localizeChat(conversation, {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
    });

    return translated.map((msg) => msg.text);
  } catch (error) {
    console.error("Batch translation error:", error);
    return texts;
  }
}

/**
 * Language code mapping for Lingo.dev
 */
export const LANGUAGE_CODES: Record<string, string> = {
  en: "en",
  es: "es",
  hi: "hi",
  fr: "fr",
  de: "de",
  zh: "zh",
  ja: "ja",
  pt: "pt",
  ar: "ar",
  it: "it",
  nl: "nl",
  pl: "pl",
  tr: "tr",
  vi: "vi",
  th: "th",
};

/**
 * Normalize language code for Lingo.dev
 */
export function normalizeLanguageCode(code: string): string {
  const baseCode = code.split("-")[0].toLowerCase();
  return LANGUAGE_CODES[baseCode] || baseCode;
}

/**
 * Check if Lingo.dev is configured
 */
export function isLingoConfigured(): boolean {
  return !!process.env.LINGODOTDEV_API_KEY;
}
