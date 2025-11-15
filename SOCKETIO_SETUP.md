# Socket.io Setup with Next.js 15

## Overview

This project uses a **custom Node.js server** to integrate Socket.io with Next.js 15. This is the recommended approach for real-time WebSocket functionality.

## Why Custom Server?

Next.js 15 App Router doesn't natively support Socket.io in API routes. A custom server allows us to:
- ✅ Use Socket.io for real-time communication
- ✅ Maintain all Next.js features
- ✅ Handle WebSocket connections properly
- ✅ Support both development and production

## Architecture

```
Client (Browser)
    ↓
Socket.io Client (lib/useSocket.ts)
    ↓
Custom Server (server.js)
    ├─ Next.js Handler (pages & API routes)
    └─ Socket.io Server (WebSocket)
```

## Files Structure

```
server.js                    # Custom Node.js server
lib/useSocket.ts            # React hook for Socket.io client
app/api/socketio/route.ts   # Info endpoint (not used for WebSocket)
```

## Development

### Start Server
```bash
# Development with Socket.io
pnpm dev

# Or directly
node server.js
```

### Start Next.js Only (No Socket.io)
```bash
# For testing without WebSocket
pnpm dev:next
```

## Configuration

### Environment Variables
```env
PORT=3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### Socket.io Path
The Socket.io server is available at:
```
ws://localhost:3000/api/socketio
```

### Client Connection
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  path: '/api/socketio',
  transports: ['websocket', 'polling'],
});
```

## Events

### Client → Server

**join-session**
```typescript
socket.emit('join-session', {
  sessionId: string,
  customerName: string,
  language: string,
});
```

**agent-join-session**
```typescript
socket.emit('agent-join-session', {
  sessionId: string,
  agentId: string,
});
```

**send-message**
```typescript
socket.emit('send-message', {
  sessionId: string,
  senderRole: 'CUSTOMER' | 'AGENT',
  originalText: string,
  originalLanguage: string,
});
```

### Server → Client

**new-session**
```typescript
socket.on('new-session', (session) => {
  // New session created
});
```

**new-message**
```typescript
socket.on('new-message', (message) => {
  // New message received
});
```

**session-updated**
```typescript
socket.on('session-updated', (session) => {
  // Session updated
});
```

**error**
```typescript
socket.on('error', (error) => {
  // Error occurred
});
```

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel doesn't support WebSocket in serverless functions. Use one of these approaches:

**A. Use Vercel + External WebSocket Service**
```bash
# Deploy Next.js to Vercel
vercel deploy

# Deploy Socket.io to separate service (Railway, Render, etc.)
# Update NEXT_PUBLIC_SOCKET_URL to point to WebSocket service
```

**B. Use Pusher/Ably Instead**
Replace Socket.io with a managed service like Pusher or Ably.

### Option 2: Custom Server (Railway, Render, Fly.io)

Deploy the entire app with custom server:

**Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Render**
```yaml
# render.yaml
services:
  - type: web
    name: multilingual-support
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
```

**Fly.io**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Deploy to:
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- DigitalOcean App Platform

## Troubleshooting

### Connection Failed

**Check server is running:**
```bash
curl http://localhost:3000/api/socketio
```

**Check Socket.io path:**
```typescript
// Must match server.js configuration
path: '/api/socketio'
```

**Check CORS:**
```javascript
// server.js
cors: {
  origin: process.env.NEXT_PUBLIC_SOCKET_URL,
  methods: ['GET', 'POST'],
}
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 node server.js
```

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules

# Reinstall
pnpm install

# Build
pnpm build
```

## Testing

### Test Socket.io Connection

```bash
# Start server
pnpm dev

# In browser console
const socket = io('http://localhost:3000', {
  path: '/api/socketio'
});

socket.on('connect', () => {
  console.log('Connected!', socket.id);
});
```

### Test Events

```javascript
// Join session
socket.emit('join-session', {
  sessionId: 'test-123',
  customerName: 'Test User',
  language: 'en',
});

// Listen for messages
socket.on('new-message', (msg) => {
  console.log('Message:', msg);
});
```

## Performance

### Connection Pooling
Socket.io automatically handles connection pooling and reconnection.

### Scaling
For multiple server instances:
- Use Redis adapter for Socket.io
- Enable sticky sessions on load balancer

```javascript
// server.js with Redis
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

## Alternatives

If custom server is not suitable:

### 1. Pusher
```bash
npm install pusher pusher-js
```

### 2. Ably
```bash
npm install ably
```

### 3. Supabase Realtime
```bash
npm install @supabase/supabase-js
```

### 4. Firebase Realtime Database
```bash
npm install firebase
```

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Next.js Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)
- [Socket.io with Next.js](https://socket.io/how-to/use-with-nextjs)

---

**Need help?** Check the [troubleshooting section](#troubleshooting) or open an issue.
