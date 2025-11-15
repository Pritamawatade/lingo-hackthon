# Real-Time Multilingual Support System

A full-stack web application that enables real-time chat between customers and agents with automatic translation, image OCR, and UI localization.

## 🌟 Features

- **Real-Time Chat**: WebSocket-based instant messaging with Socket.io
- **Automatic Translation**: Messages translated in real-time using Lingo API
- **Image OCR**: Upload images (menus, invoices, signs) for text extraction and translation
- **Multi-Language UI**: Support for English, Spanish, Hindi, French, German, and Chinese
- **Agent Dashboard**: Manage multiple customer sessions simultaneously
- **Translation Analytics**: Track translation metadata for insights

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Real-Time**: Socket.io for WebSocket connections
- **Database**: PostgreSQL with Prisma ORM
- **Translation**: Lingo CLI/API integration
- **OCR**: Tesseract.js for text extraction
- **Authentication**: JWT-based auth (NextAuth ready)

## 📁 Project Structure

```
/app
  /chat              - Customer chat interface
  /dashboard         - Agent dashboard
  /api               - API routes
  layout.tsx         - Root layout
  page.tsx           - Landing page
/components          - Reusable React components
  ChatBox.tsx        - Chat interface component
  ImageUpload.tsx    - Image upload & OCR component
  LanguageSwitcher.tsx - UI language selector
  SessionList.tsx    - Active sessions list
/lib                 - Utility functions
  useSocket.ts       - WebSocket hook
  prisma.ts          - Prisma client
/services            - Backend services
  lingoService.ts    - Translation service
  ocrService.ts      - OCR service
/prisma              - Database schema & migrations
/pages/api           - Next.js API routes (Socket.io)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm/pnpm/yarn
- PostgreSQL 14+ database
- Lingo API key (for translation)

### Installation

1. **Clone and install dependencies**:
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/multilingual_support"
JWT_SECRET="your-secret-key"
LINGO_API_KEY="your-lingo-api-key"
LINGO_API_URL="https://api.lingo.example.com"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

3. **Set up database**:
```bash
npm run db:push
```

4. **Run development server** (with Socket.io):
```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

> **Note**: Uses custom Node.js server for Socket.io support. For Next.js dev only (without Socket.io), use `pnpm dev:next`

## 🔧 Configuration

### Lingo CLI Integration

The project integrates with Lingo for:

1. **UI Translation** (Build-time):
   - Extract UI strings with Lingo CLI
   - Generate translation files for supported languages
   - Automatic UI localization

2. **Runtime Translation** (Real-time):
   - Chat message translation via Lingo API
   - Image text translation
   - Language detection

### Database Schema

Key models:
- **User**: Customer and agent accounts
- **Session**: Chat sessions with language preferences
- **Message**: Chat messages with original and translated text
- **Translation**: Translation metadata for analytics

## 📱 Usage

### Customer Flow

1. Visit `/chat`
2. Enter name and select language
3. Start chatting - messages auto-translate to agent's language
4. Upload images for OCR and translation

### Agent Flow

1. Visit `/dashboard` and login
2. View active customer sessions
3. Select a session to chat
4. See both original and translated messages
5. Reply in your language - auto-translates to customer

## 🌍 Supported Languages

- English (en) 🇬🇧
- Spanish (es) 🇪🇸
- Hindi (hi) 🇮🇳
- French (fr) 🇫🇷
- German (de) 🇩🇪
- Chinese (zh) 🇨🇳

## 🔐 Authentication

Currently uses simple authentication. For production:
- Implement NextAuth.js
- Add OAuth providers
- Secure JWT tokens
- Role-based access control

## 📊 Analytics

Translation metadata tracked:
- Source/target languages
- Translation time
- Message volume
- Session duration

## 🚧 TODO / Stretch Goals

- [ ] Voice chat with WebRTC
- [ ] Speech-to-text integration
- [ ] Text-to-speech for messages
- [ ] Multi-agent support
- [ ] Chat transcript download
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Lingo for translation services
- Tesseract.js for OCR
- Socket.io for real-time communication
- shadcn/ui for beautiful components

---

Built with ❤️ for seamless multilingual communication
