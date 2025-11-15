/**
 * Lingo.dev Translation Service (CommonJS version for server.js)
 *
 * Real implementation using Lingo.dev SDK for chat translation
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
 * Translate a single message using Lingo.dev
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

  try {
    // Use localizeChat for single message
    const conversation = [{ name: "user", text }];

    const translated = await lingoDotDev.localizeChat(conversation, {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
    });

    return translated[0]?.text || text;
  } catch (error) {
    console.error("Translation error:", error);
    // Fallback: return original text
    return text;
  }
}

/**
 * Translate multiple messages in a conversation
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
    const translated = await lingoDotDev.localizeChat(messages, {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
    });

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
