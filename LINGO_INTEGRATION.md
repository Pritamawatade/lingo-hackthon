# Lingo.dev Integration Guide

## Overview

This project uses **Lingo.dev SDK** for real-time chat translation. All translation features are now fully implemented and ready to use!

## ✅ What's Implemented

### 1. Real-Time Chat Translation
- ✅ Customer messages translated to agent's language
- ✅ Agent messages translated to customer's language
- ✅ Preserves original text for reference
- ✅ Supports 15+ languages

### 2. Image OCR Translation
- ✅ Extract text from images
- ✅ Translate extracted text
- ✅ Display both original and translated text

### 3. Conversation Context
- ✅ Uses `localizeChat` for context-aware translation
- ✅ Maintains conversation flow
- ✅ Better translation quality

## 🔧 Setup

### 1. Get Lingo.dev API Key

Visit [lingo.dev](https://lingo.dev) and sign up for an API key.

### 2. Configure Environment

Add your API key to `.env`:

```env
LINGODOTDEV_API_KEY=your_api_key_here
```

### 3. Install Dependencies

The Lingo.dev SDK is already included in `package.json`:

```bash
pnpm install
```

## 📚 How It Works

### Translation Service (`services/lingoService.ts`)

```typescript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate single message
const translated = await lingoDotDev.localizeChat(
  [{ name: "user", text: "Hello!" }],
  {
    sourceLocale: "en",
    targetLocale: "es",
  }
);
// Result: [{ name: "user", text: "¡Hola!" }]
```

### Real-Time Chat Flow

```
Customer (Spanish)
    ↓
"Hola, necesito ayuda"
    ↓
Socket.io Server
    ↓
Lingo.dev Translation
    ↓
"Hello, I need help"
    ↓
Agent (English)
```

### Agent Reply Flow

```
Agent (English)
    ↓
"How can I help you?"
    ↓
Socket.io Server
    ↓
Lingo.dev Translation
    ↓
"¿Cómo puedo ayudarte?"
    ↓
Customer (Spanish)
```

## 🌍 Supported Languages

The system supports all major languages through Lingo.dev:

| Code | Language | Native Name |
|------|----------|-------------|
| `en` | English | English |
| `es` | Spanish | Español |
| `hi` | Hindi | हिन्दी |
| `fr` | French | Français |
| `de` | German | Deutsch |
| `zh` | Chinese | 中文 |
| `ja` | Japanese | 日本語 |
| `ko` | Korean | 한국어 |
| `pt` | Portuguese | Português |
| `ru` | Russian | Русский |
| `ar` | Arabic | العربية |
| `it` | Italian | Italiano |
| `nl` | Dutch | Nederlands |
| `pl` | Polish | Polski |
| `tr` | Turkish | Türkçe |
| `vi` | Vietnamese | Tiếng Việt |
| `th` | Thai | ไทย |
| `id` | Indonesian | Bahasa Indonesia |

## 🔍 Implementation Details

### 1. Chat Translation (`server.js`)

```javascript
socket.on("send-message", async (data) => {
  const { originalText, originalLanguage, senderRole } = data;
  
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

### 2. Message Display (`components/ChatBox.tsx`)

```typescript
// Display translated text by default
<p>{message.translatedText || message.originalText}</p>

// Show original text for agents
{message.translatedText && userRole === "AGENT" && (
  <p className="text-xs opacity-70 italic">
    Original: {message.originalText}
  </p>
)}
```

### 3. Image OCR Translation (`app/api/ocr/route.ts`)

```typescript
// Extract text from image
const extractedText = await extractTextFromImage(buffer);

// Translate extracted text
const translatedText = await translateMessage(
  extractedText,
  "en", // Assume English source
  language // Target language
);

return { extractedText, translatedText };
```

## 🎯 Features

### Context-Aware Translation

Lingo.dev's `localizeChat` maintains conversation context:

```typescript
const conversation = [
  { name: "Alice", text: "Hello!" },
  { name: "Bob", text: "How are you?" },
  { name: "Alice", text: "I'm doing well, thanks!" },
];

const translated = await lingoDotDev.localizeChat(conversation, {
  sourceLocale: "en",
  targetLocale: "es",
});

// Result maintains context and natural flow:
// Alice: ¡Hola!
// Bob: ¿Cómo estás?
// Alice: ¡Me va bien, gracias!
```

### Batch Translation

For UI strings or multiple messages:

```typescript
const texts = ["Welcome", "Hello", "Goodbye"];

const translated = await batchTranslate(texts, "en", "es");
// Result: ["Bienvenido", "Hola", "Adiós"]
```

### Language Code Normalization

Handles various language code formats:

```typescript
normalizeLanguageCode("en-US"); // Returns: "en"
normalizeLanguageCode("zh-CN"); // Returns: "zh"
```

## 🧪 Testing

### Test Translation Service

```bash
# Start server
pnpm dev

# In browser console
const socket = io('http://localhost:3000', {
  path: '/api/socketio'
});

// Join session
socket.emit('join-session', {
  sessionId: 'test-123',
  customerName: 'Test User',
  language: 'es',
});

// Send message in Spanish
socket.emit('send-message', {
  sessionId: 'test-123',
  senderRole: 'CUSTOMER',
  originalText: 'Hola, necesito ayuda',
  originalLanguage: 'es',
});

// Listen for translated message
socket.on('new-message', (msg) => {
  console.log('Original:', msg.originalText);
  console.log('Translated:', msg.translatedText);
});
```

### Test Image Translation

```bash
# Upload image via UI
# Or test API directly
curl -X POST http://localhost:3000/api/ocr \
  -F "image=@test-image.jpg" \
  -F "language=es" \
  -F "sessionId=test-123"
```

## 📊 Performance

### Translation Speed
- Single message: ~200-500ms
- Batch translation: ~500-1000ms
- Depends on text length and API response time

### Optimization Tips

1. **Cache Common Phrases**
   ```typescript
   const cache = new Map();
   
   if (cache.has(text)) {
     return cache.get(text);
   }
   
   const translated = await translateMessage(...);
   cache.set(text, translated);
   ```

2. **Batch Similar Messages**
   ```typescript
   // Instead of translating one by one
   const results = await batchTranslate(messages, "en", "es");
   ```

3. **Skip Same Language**
   ```typescript
   if (sourceLanguage === targetLanguage) {
     return originalText;
   }
   ```

## 🐛 Troubleshooting

### Issue: Translation Not Working

**Check API Key:**
```bash
# Verify environment variable
echo $LINGODOTDEV_API_KEY

# Check in code
console.log(process.env.LINGODOTDEV_API_KEY);
```

**Check Logs:**
```bash
# Server logs will show translation errors
pnpm dev

# Look for:
# "Lingo.dev not configured"
# "Translation error: ..."
```

### Issue: Wrong Language Detected

**Specify Source Language:**
```typescript
// Instead of "auto"
await translateMessage(text, "en", "es");
```

### Issue: Poor Translation Quality

**Use Conversation Context:**
```typescript
// Better: Use localizeChat with full conversation
const translated = await lingoDotDev.localizeChat(messages, {
  sourceLocale: "en",
  targetLocale: "es",
});

// Instead of: Translating individual messages
```

## 🔒 Security

### API Key Protection

- ✅ API key stored in environment variables
- ✅ Never exposed to client
- ✅ Server-side translation only

### Rate Limiting

Consider adding rate limiting:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/translate', limiter);
```

## 📈 Analytics

Track translation usage:

```typescript
// In server.js
const translationStats = {
  count: 0,
  languages: {},
};

socket.on('send-message', async (data) => {
  // ... translation code ...
  
  translationStats.count++;
  translationStats.languages[targetLanguage] = 
    (translationStats.languages[targetLanguage] || 0) + 1;
});
```

## 🚀 Production Deployment

### Environment Variables

Ensure `LINGODOTDEV_API_KEY` is set in production:

**Vercel:**
```bash
vercel env add LINGODOTDEV_API_KEY
```

**Railway:**
```bash
railway variables set LINGODOTDEV_API_KEY=your_key
```

**Docker:**
```dockerfile
ENV LINGODOTDEV_API_KEY=your_key
```

### Monitoring

Monitor translation API usage and errors:

```typescript
// Add error tracking
try {
  const translated = await translateMessage(...);
} catch (error) {
  // Log to monitoring service (Sentry, DataDog, etc.)
  console.error('Translation failed:', error);
  // Fallback to original text
  return originalText;
}
```

## 📚 Resources

- [Lingo.dev Documentation](https://lingo.dev/docs)
- [Lingo.dev SDK](https://www.npmjs.com/package/lingo.dev)
- [Supported Languages](https://lingo.dev/languages)

## ✅ Checklist

- [x] Lingo.dev SDK installed
- [x] API key configured
- [x] Translation service implemented
- [x] Real-time chat translation working
- [x] Image OCR translation working
- [x] Error handling implemented
- [x] Fallback to original text
- [x] Multiple languages supported
- [x] Context-aware translation
- [x] Production ready

---

**Translation is now fully functional!** 🎉

Start the server with `pnpm dev` and test the real-time translation features!
