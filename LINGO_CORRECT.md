# ✅ Lingo.dev Runtime Translation - Correct Implementation

## The Correct Approach

You were right! Lingo.dev DOES support runtime chat translation using `localizeChat`.

## How It Works

### Example from Lingo.dev Docs

```typescript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

const conversation = [
  { name: "Alice", text: "Hello!" },
  { name: "Bob", text: "How are you?" },
  { name: "Alice", text: "I'm doing well, thanks!" },
];

const translated = await lingoDotDev.localizeChat(conversation, {
  sourceLocale: "en",
  targetLocale: "es",
});

for (const message of translated) {
  console.log(`${message.name}: ${message.text}`);
}

// Output:
// Alice: ¡Hola!
// Bob: ¿Cómo estás?
// Alice: ¡Me va bien, gracias!
```

## Our Implementation

### 1. Single Message Translation

```typescript
// services/lingoService.ts
export async function translateMessage(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  const lingoDotDev = new LingoDotDevEngine({
    apiKey: process.env.LINGODOTDEV_API_KEY,
  });

  // Convert single message to conversation format
  const conversation = [{ name: "user", text }];

  const translated = await lingoDotDev.localizeChat(conversation, {
    sourceLocale: sourceLanguage,
    targetLocale: targetLanguage,
  });

  return translated[0]?.text || text;
}
```

### 2. Conversation Translation

```typescript
// For better context-aware translation
export async function translateConversation(
  messages: Array<{ name: string; text: string }>,
  sourceLanguage: string,
  targetLanguage: string
): Promise<Array<{ name: string; text: string }>> {
  const lingoDotDev = new LingoDotDevEngine({
    apiKey: process.env.LINGODOTDEV_API_KEY,
  });

  const translated = await lingoDotDev.localizeChat(messages, {
    sourceLocale: sourceLanguage,
    targetLocale: targetLanguage,
  });

  return translated;
}
```

### 3. WebSocket Integration

```javascript
// server.js
socket.on("send-message", async (data) => {
  const { originalText, originalLanguage, senderRole } = data;
  
  // Import Lingo.dev service
  const { translateMessage } = require("./services/lingoService.js");
  
  // Determine target language
  const targetLanguage = senderRole === "CUSTOMER" ? "en" : originalLanguage;
  
  // Translate using Lingo.dev
  const translatedText = await translateMessage(
    originalText,
    originalLanguage,
    targetLanguage
  );
  
  // Broadcast translated message
  io.to(sessionId).emit("new-message", {
    originalText,
    translatedText,
    originalLanguage,
    translatedLanguage: targetLanguage,
  });
});
```

## Setup

### 1. Get Lingo.dev API Key

1. Go to [lingo.dev](https://lingo.dev)
2. Sign up for an account
3. Get your API key from dashboard

### 2. Configure Environment

```bash
# .env
LINGODOTDEV_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
pnpm install
```

This installs `lingo.dev` package which includes:
- UI localization (build-time)
- Chat translation (runtime via `localizeChat`)

### 4. Start Server

```bash
pnpm dev
```

## Testing

### Test Chat Translation

```bash
# 1. Start server
pnpm dev

# 2. Open customer chat
http://localhost:3000/chat

# 3. Select Spanish, send message
"Hola, necesito ayuda"

# 4. Open agent dashboard
http://localhost:3000/dashboard

# 5. See translated message
"Hello, I need help"
```

### Check Logs

Server logs will show:

```
Translating: "Hola, necesito ayuda" from es to en
Translated: "Hello, I need help"
```

## Features

### Context-Aware Translation

Lingo.dev's `localizeChat` maintains conversation context:

```typescript
const conversation = [
  { name: "Customer", text: "I need help" },
  { name: "Agent", text: "What can I do for you?" },
  { name: "Customer", text: "My order hasn't arrived" },
];

// Translates with full context for better quality
const translated = await lingoDotDev.localizeChat(conversation, {
  sourceLocale: "en",
  targetLocale: "es",
});
```

### Supported Languages

Lingo.dev supports major languages:

- English (en)
- Spanish (es)
- Hindi (hi)
- French (fr)
- German (de)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Portuguese (pt)
- Russian (ru)
- Arabic (ar)
- Italian (it)
- And more!

### Error Handling

```typescript
try {
  const translated = await translateMessage(text, from, to);
  return translated;
} catch (error) {
  console.error("Translation error:", error);
  return text; // Fallback to original
}
```

## Two Uses of Lingo.dev

### 1. UI Localization (Build-Time)

```typescript
// app/layout.tsx
import { LingoProvider } from "lingo.dev/react/rsc";

// Translates static UI strings
<button>{t("common.save")}</button>
```

**Files:**
- `locales/en.json`
- `locales/es.json`
- `components/LanguageSwitcher.tsx`

### 2. Chat Translation (Runtime)

```typescript
// services/lingoService.ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

// Translates dynamic user messages
const translated = await lingoDotDev.localizeChat(conversation, {
  sourceLocale: "en",
  targetLocale: "es",
});
```

**Files:**
- `services/lingoService.ts`
- `services/lingoService.js`
- `server.js`

## Advantages

✅ **Single SDK** - One package for both UI and chat translation
✅ **Context-aware** - Better translation quality with conversation context
✅ **Professional** - Enterprise-grade translation service
✅ **Consistent** - Same translation engine for UI and chat
✅ **Maintained** - Official Lingo.dev SDK with support

## Troubleshooting

### Translation Not Working

**Check API key:**
```bash
echo $LINGODOTDEV_API_KEY
```

**Check logs:**
```bash
pnpm dev

# Should see:
Translating: "..." from es to en
Translated: "..."
```

### Error: "Lingo.dev not configured"

**Solution:**
```bash
# Make sure API key is set in .env
LINGODOTDEV_API_KEY=your_key_here

# Restart server
pnpm dev
```

### Wrong Translation

**Check language codes:**
```typescript
// Use correct locale codes
sourceLocale: "en"  // English
targetLocale: "es"  // Spanish
```

## Example Flow

### Customer → Agent

```
1. Customer types: "Hola, necesito ayuda"
   ↓
2. WebSocket sends to server
   ↓
3. server.js calls translateMessage("Hola, necesito ayuda", "es", "en")
   ↓
4. Lingo.dev localizeChat translates
   ↓
5. Returns: "Hello, I need help"
   ↓
6. Broadcast to agent dashboard
   ↓
7. Agent sees: "Hello, I need help"
```

### Agent → Customer

```
1. Agent types: "How can I help you?"
   ↓
2. WebSocket sends to server
   ↓
3. server.js calls translateMessage("How can I help you?", "en", "es")
   ↓
4. Lingo.dev localizeChat translates
   ↓
5. Returns: "¿Cómo puedo ayudarte?"
   ↓
6. Broadcast to customer chat
   ↓
7. Customer sees: "¿Cómo puedo ayudarte?"
```

## Summary

✅ **Correct implementation** - Using Lingo.dev's `localizeChat`
✅ **Runtime translation** - Translates user messages in real-time
✅ **Context-aware** - Better quality with conversation context
✅ **Single API key** - One key for UI and chat translation
✅ **Professional service** - Enterprise-grade translation
✅ **Easy setup** - Just add API key and run

---

**Now using Lingo.dev correctly for runtime chat translation!** 🎉

Get your API key from [lingo.dev](https://lingo.dev) and add it to `.env`:

```bash
LINGODOTDEV_API_KEY=your_key_here
pnpm dev
```

Test it at http://localhost:3000/chat!
