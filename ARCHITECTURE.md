# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   Customer   │              │    Agent     │            │
│  │   Chat UI    │              │  Dashboard   │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                              │                     │
│         └──────────────┬───────────────┘                     │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  App Router  │  │  API Routes  │  │  WebSocket   │      │
│  │   (Pages)    │  │  (REST API)  │  │  (Socket.io) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Lingo     │  │     OCR      │  │     Auth     │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Lingo API   │  │  File Store  │      │
│  │   Database   │  │ (External)   │  │   (Images)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Customer Sends Message

```
Customer UI
    │
    ├─ User types message in Spanish
    │
    ▼
WebSocket Client (useSocket hook)
    │
    ├─ Emit "send-message" event
    │
    ▼
Socket.io Server (/pages/api/socket.ts)
    │
    ├─ Receive message
    ├─ Detect target language (agent's language)
    │
    ▼
Lingo Service (services/lingoService.ts)
    │
    ├─ Call Lingo API
    ├─ Translate: Spanish → English
    │
    ▼
Database (Prisma)
    │
    ├─ Save original message
    ├─ Save translated message
    │
    ▼
Socket.io Server
    │
    ├─ Broadcast to session room
    │
    ▼
Agent Dashboard
    │
    └─ Display translated message
```

### 2. Image Upload & Translation

```
Customer UI
    │
    ├─ User uploads image
    │
    ▼
ImageUpload Component
    │
    ├─ Preview image
    ├─ Create FormData
    │
    ▼
API Route (/app/api/ocr/route.ts)
    │
    ├─ Receive image file
    ├─ Convert to buffer
    │
    ▼
OCR Service (services/ocrService.ts)
    │
    ├─ Extract text with Tesseract.js
    │
    ▼
Lingo Service
    │
    ├─ Translate extracted text
    │
    ▼
Response to Client
    │
    ├─ Return extracted text
    ├─ Return translated text
    │
    ▼
Customer UI
    │
    └─ Display results
```

### 3. Authentication Flow

```
Login Form
    │
    ├─ User enters credentials
    │
    ▼
API Route (/app/api/auth/login/route.ts)
    │
    ├─ Validate input
    │
    ▼
Database (Prisma)
    │
    ├─ Find user by email
    │
    ▼
Auth Service (lib/auth.ts)
    │
    ├─ Compare password hash
    ├─ Generate JWT token
    │
    ▼
Response to Client
    │
    ├─ Return token
    ├─ Return user data
    │
    ▼
Client Storage
    │
    ├─ Store token (localStorage/cookie)
    │
    ▼
Authenticated Requests
    │
    └─ Include token in headers
```

## Component Hierarchy

```
App Layout (app/layout.tsx)
│
├─ Landing Page (app/page.tsx)
│   ├─ LanguageSwitcher
│   └─ Navigation Links
│
├─ Customer Chat (app/chat/page.tsx)
│   ├─ LanguageSwitcher
│   ├─ ChatBox
│   │   ├─ Message List
│   │   └─ Message Input
│   └─ ImageUpload
│       ├─ Upload Area
│       ├─ Preview
│       └─ Results Display
│
└─ Agent Dashboard (app/dashboard/page.tsx)
    ├─ LanguageSwitcher
    ├─ SessionList
    │   └─ Session Items
    └─ ChatBox
        ├─ Message List (with translations)
        └─ Message Input
```

## Database Schema

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │◄─────┐
│ email       │      │
│ password    │      │
│ name        │      │
│ role        │      │
│ language    │      │
└─────────────┘      │
                     │
                     │ agentId
┌─────────────┐      │
│   Session   │      │
├─────────────┤      │
│ id          │◄─────┼─────┐
│ customerId  │      │     │
│ customerName│      │     │
│ agentId     ├──────┘     │
│ status      │            │
└─────────────┘            │
                           │ sessionId
┌─────────────┐            │
│   Message   │            │
├─────────────┤            │
│ id          │            │
│ sessionId   ├────────────┘
│ senderId    │
│ senderRole  │
│ originalText│
│ translatedText
│ messageType │
└─────────────┘

┌─────────────┐
│ Translation │
├─────────────┤
│ id          │
│ sourceText  │
│ targetText  │
│ sourceLanguage
│ targetLanguage
│ translationTime
└─────────────┘
```

## API Endpoints

### Authentication
```
POST /api/auth/register
  Body: { email, password, name, role, language }
  Response: { token, user }

POST /api/auth/login
  Body: { email, password }
  Response: { token, user }
```

### Sessions
```
GET /api/sessions
  Response: { sessions: [...] }

POST /api/sessions
  Body: { customerName, customerLanguage }
  Response: { session }

GET /api/sessions/[id]/messages
  Response: { messages: [...] }

POST /api/sessions/[id]/messages
  Body: { originalText, senderRole, ... }
  Response: { message }
```

### Translation & OCR
```
POST /api/translate
  Body: { text, sourceLanguage, targetLanguage }
  Response: { translatedText, ... }

POST /api/ocr
  Body: FormData { image, sessionId, language }
  Response: { extractedText, translatedText }
```

### WebSocket Events
```
Client → Server:
  - join-session
  - agent-join-session
  - send-message

Server → Client:
  - new-session
  - session-updated
  - new-message
  - error
```

## Technology Stack Details

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with hooks
- **TypeScript**: Type safety
- **TailwindCSS**: Utility-first CSS
- **Socket.io Client**: WebSocket client

### Backend
- **Next.js API Routes**: RESTful endpoints
- **Socket.io Server**: WebSocket server
- **Prisma**: ORM for database
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

### External Services
- **Lingo API**: Translation service
- **Tesseract.js**: OCR engine
- **PostgreSQL**: Relational database

## Security Layers

```
┌─────────────────────────────────────┐
│         Input Validation            │
│  (Zod, TypeScript, Form Validation) │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Authentication              │
│     (JWT, Password Hashing)         │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Authorization               │
│    (Role-based Access Control)      │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Data Protection             │
│  (SQL Injection Prevention, XSS)    │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Transport Security          │
│         (HTTPS, WSS)                │
└─────────────────────────────────────┘
```

## Scalability Strategy

### Horizontal Scaling
```
Load Balancer (Nginx)
    │
    ├─ Next.js Instance 1
    ├─ Next.js Instance 2
    └─ Next.js Instance 3
         │
         ├─ Shared Redis (Session Store)
         └─ PostgreSQL (Primary + Replicas)
```

### Caching Strategy
```
┌─────────────────────────────────────┐
│         Browser Cache               │
│    (Static Assets, Images)          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         CDN Cache                   │
│    (Vercel Edge Network)            │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Redis Cache                 │
│  (Translations, Session Data)       │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Database                    │
│    (PostgreSQL with Indexes)        │
└─────────────────────────────────────┘
```

## Deployment Architecture

### Development
```
Local Machine
  ├─ Next.js Dev Server (port 3000)
  ├─ PostgreSQL (port 5432)
  └─ Prisma Studio (port 5555)
```

### Production (Vercel)
```
Vercel Edge Network
  │
  ├─ Static Assets (CDN)
  ├─ API Routes (Serverless Functions)
  └─ WebSocket (Custom Server)
       │
       ├─ Vercel Postgres
       └─ External Services (Lingo API)
```

## Performance Optimization

1. **Code Splitting**: Automatic with Next.js
2. **Image Optimization**: Next.js Image component
3. **Database Indexing**: Prisma indexes on frequently queried fields
4. **Translation Caching**: Redis cache for common translations
5. **WebSocket Connection Pooling**: Reuse connections
6. **Lazy Loading**: Components loaded on demand

## Monitoring & Logging

```
Application
    │
    ├─ Error Tracking (Sentry)
    ├─ Performance Monitoring (Vercel Analytics)
    ├─ Database Monitoring (Prisma Metrics)
    └─ Custom Logging (Winston/Pino)
         │
         └─ Log Aggregation (Datadog/LogRocket)
```

---

This architecture is designed to be:
- **Scalable**: Handle growing user base
- **Maintainable**: Clear separation of concerns
- **Secure**: Multiple security layers
- **Performant**: Optimized at every level
- **Extensible**: Easy to add new features
