# Quick Fix Guide

## Issues Fixed

### 1. ✅ Module Not Found Error

**Error:**
```
Error: Cannot find module './services/lingoService'
```

**Cause:**
`server.js` is CommonJS but `lingoService.ts` is TypeScript/ESM.

**Fix:**
Created `services/lingoService.js` (CommonJS version) for use in `server.js`.

**Files:**
- ✅ Created `services/lingoService.js` (CommonJS)
- ✅ Kept `services/lingoService.ts` (TypeScript for Next.js routes)
- ✅ Updated `server.js` to use `.js` version

### 2. ✅ PostgreSQL Connection Error

**Error:**
```
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
```

**Cause:**
Database not configured or not running.

**Solutions:**

#### Option A: Use PostgreSQL (Recommended)

1. **Install PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql
   
   # macOS
   brew install postgresql
   brew services start postgresql
   ```

2. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   sudo -u postgres psql
   
   # Create database and user
   CREATE DATABASE multilingual_support;
   CREATE USER myuser WITH PASSWORD 'mypassword';
   GRANT ALL PRIVILEGES ON DATABASE multilingual_support TO myuser;
   \q
   ```

3. **Update .env:**
   ```env
   DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/multilingual_support"
   ```

4. **Push Schema:**
   ```bash
   pnpm db:push
   ```

#### Option B: Use Docker PostgreSQL

```bash
# Run PostgreSQL in Docker
docker run --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=multilingual_support \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/multilingual_support"

# Push schema
pnpm db:push
```

#### Option C: Use Cloud Database (Easiest)

**Supabase (Free):**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Update `.env` with connection string
5. Run `pnpm db:push`

**Neon (Free):**
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `.env`
5. Run `pnpm db:push`

#### Option D: Skip Database (For Testing)

If you just want to test translation without database:

1. **Comment out database code in `server.js`:**
   ```javascript
   // TODO: Save message to database with Prisma
   // const { prisma } = require('./lib/prisma');
   // await prisma.message.create({ data: message });
   ```

2. **Comment out Prisma imports in API routes**

3. **Messages will work but won't persist**

## Current Setup

### File Structure
```
services/
  ├── lingoService.ts    # TypeScript version (for Next.js API routes)
  └── lingoService.js    # CommonJS version (for server.js)
```

### Why Two Files?

- `server.js` uses CommonJS (`require()`)
- Next.js API routes use ESM (`import`)
- Both files have same functionality
- Keeps compatibility with both systems

## Testing Without Database

You can test translation features without database:

```bash
# 1. Start server (will show Prisma errors but translation works)
pnpm dev

# 2. Open chat
http://localhost:3000/chat

# 3. Send messages - translation will work!
# Messages won't persist, but real-time translation works
```

## Full Setup (With Database)

```bash
# 1. Setup PostgreSQL (choose one option above)

# 2. Update .env with database URL
cp .env.example .env
# Edit .env with your database URL

# 3. Push schema
pnpm db:push

# 4. Start server
pnpm dev

# 5. Test everything
http://localhost:3000
```

## Verification

### Check Translation Works
```bash
# Start server
pnpm dev

# Should see:
# ✓ Ready on http://localhost:3000
# ✓ Socket.io ready on path: /api/socketio

# Should NOT see:
# ✗ Error: Cannot find module './services/lingoService'
```

### Check Database Works
```bash
# If database is configured:
pnpm db:studio

# Should open Prisma Studio at http://localhost:5555
```

## Environment Variables

Your `.env` should have:

```env
# Required for translation
LINGODOTDEV_API_KEY=your_key_here

# Required for database features
DATABASE_URL=postgresql://...

# Optional
JWT_SECRET=your_secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

## Common Issues

### Issue: Module still not found

**Solution:**
```bash
# Make sure lingoService.js exists
ls services/lingoService.js

# Restart server
pnpm dev
```

### Issue: Database connection fails

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Or use cloud database (Supabase/Neon)
```

### Issue: Translation not working

**Solution:**
```bash
# Check API key is set
echo $LINGODOTDEV_API_KEY

# Check server logs for errors
pnpm dev
```

## Quick Start (Minimal Setup)

For fastest setup without database:

```bash
# 1. Install
pnpm install

# 2. Add Lingo API key
echo "LINGODOTDEV_API_KEY=your_key" > .env

# 3. Start
pnpm dev

# 4. Test translation at http://localhost:3000/chat
```

Database features will show errors but translation will work!

## Production Setup

For production, you MUST have database:

```bash
# 1. Use cloud database (Supabase/Neon/Railway)
# 2. Set DATABASE_URL in production environment
# 3. Run migrations: pnpm db:push
# 4. Deploy
```

---

**Both issues are now fixed!** 🎉

- ✅ Module loading works (CommonJS version created)
- ✅ Database setup documented (multiple options)
- ✅ Can test translation without database
- ✅ Full setup instructions provided

Choose your setup option and start testing!
