# Setup Guide

Complete setup instructions for the Multilingual Support System.

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Lingo API account (for translation)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

**Option A: Local PostgreSQL**

1. Install PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt-get install postgresql

# macOS
brew install postgresql
```

2. Create database:
```bash
sudo -u postgres psql
CREATE DATABASE multilingual_support;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE multilingual_support TO your_user;
\q
```

**Option B: Cloud Database (Recommended for production)**

Use services like:
- Supabase (free tier available)
- Railway
- Neon
- AWS RDS

### 3. Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Update with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/multilingual_support"

# Authentication
JWT_SECRET="generate-a-secure-random-string-here"

# Lingo Translation API
LINGO_API_KEY="your-lingo-api-key"
LINGO_API_URL="https://api.lingo.example.com"

# WebSocket
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

### 4. Initialize Database

```bash
# Push schema to database
npm run db:push

# Optional: Open Prisma Studio to view data
npm run db:studio
```

### 5. Lingo CLI Setup

**Install Lingo CLI:**

```bash
npm install -g @lingo/cli
```

**Initialize Lingo:**

```bash
lingo init
```

**Extract UI strings:**

```bash
lingo extract
```

**Push to Lingo for translation:**

```bash
lingo push
```

**Pull translations:**

```bash
lingo pull
```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the Application

### Test Customer Flow

1. Go to `/chat`
2. Enter name: "Test Customer"
3. Select language: Spanish
4. Start chat
5. Send message: "Hola, necesito ayuda"

### Test Agent Flow

1. Go to `/dashboard`
2. Login with agent credentials
3. Select active session
4. See translated message
5. Reply: "Hello, how can I help?"

### Test Image Translation

1. In customer chat, upload an image with text
2. Click "Extract & Translate Text"
3. View extracted and translated text

## Production Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables
- Deploy

3. **Configure Database:**
- Use Vercel Postgres or external provider
- Update `DATABASE_URL` in Vercel environment variables

### Custom Server (for Socket.io)

Socket.io requires a custom server. Create `server.js`:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);
  
  // Socket.io logic here
  
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -U your_user -d multilingual_support -h localhost

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

### Socket.io Not Connecting

1. Check `NEXT_PUBLIC_SOCKET_URL` in `.env`
2. Ensure port 3000 is not blocked
3. Check browser console for errors

### Translation Not Working

1. Verify `LINGO_API_KEY` is set
2. Check API endpoint is correct
3. Review API logs for errors

### Prisma Issues

```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate

# View database
npx prisma studio
```

## Development Tips

### Hot Reload

The dev server supports hot reload for:
- React components
- API routes
- Styles

### Database Changes

After modifying `prisma/schema.prisma`:

```bash
npm run db:push
```

### Adding New Languages

1. Update `SUPPORTED_LANGUAGES` in components
2. Add translation file in `/locales/{code}.json`
3. Update Lingo config in `.lingo/config.json`

### Testing Translations

Use mock data in development:

```typescript
// services/lingoService.ts
if (process.env.NODE_ENV === 'development') {
  return `[TRANSLATED] ${text}`;
}
```

## Performance Optimization

### Database Indexing

Add indexes for frequently queried fields:

```prisma
model Message {
  @@index([sessionId])
  @@index([createdAt])
}
```

### Caching Translations

Implement Redis caching:

```typescript
const cachedTranslation = await redis.get(`trans:${text}:${lang}`);
if (cachedTranslation) return cachedTranslation;
```

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image';

<Image src={imageUrl} width={500} height={300} alt="..." />
```

## Security Checklist

- [ ] Change `JWT_SECRET` to secure random string
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Validate file uploads
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Implement CSP headers

## Monitoring

### Logging

Add structured logging:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### Analytics

Track translation metrics:
- Translation count per language pair
- Average translation time
- Session duration
- Message volume

## Support

For issues or questions:
- Check GitHub Issues
- Review documentation
- Contact support team

---

Happy coding! 🚀
