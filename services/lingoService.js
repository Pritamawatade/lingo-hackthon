/**
 * Lingo.dev Translation Service for Runtime Chat Translation (CommonJS)
 * 
 * Uses Lingo.dev SDK's localizeChat for real-time message translation
 */

const { LingoDotDevEngine } = require("lingo.dev/sdk");

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

/**
 * Translate a single message using Lingo.dev's localizeChat
 */
async function translateMessage(text, sourceLanguage, targetLanguage) {
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
    console.log(`Translating: "${text}" from ${sourceLanguage} to ${targetLanguage}`);

    // Use localizeChat with single message
    const conversation = [{ name: "user", text }];

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
async function translateConversation(messages, sourceLanguage, targetLanguage) {
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
    console.log(`Translating conversation (${messages.length} messages) from ${sourceLanguage} to ${targetLanguage}`);

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
 * Check if Lingo.dev is configured
 */
function isLingoConfigured() {
  return !!process.env.LINGODOTDEV_API_KEY;
}

module.exports = {
  translateMessage,
  translateConversation,
  isLingoConfigured,
};
