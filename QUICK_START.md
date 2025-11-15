# Quick Start Guide

Get up and running in 5 minutes! ⚡

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node -v

# Check npm version
npm -v

# Check if PostgreSQL is installed
psql --version
```

## Installation (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your favorite editor
```

Minimum required in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/multilingual_support"
JWT_SECRET="your-secret-key-here"
```

### Step 3: Setup Database
```bash
# Create database tables
npm run db:push

# (Optional) Add demo data
npm run db:seed
```

## Run the App

```bash
npm run dev
```

Visit: **http://localhost:3000** 🎉

## Test It Out

### Test Customer Chat
1. Go to http://localhost:3000/chat
2. Enter name: "Test User"
3. Select language: "Spanish"
4. Click "Start Chat"
5. Send a message: "Hola"

### Test Agent Dashboard
1. Go to http://localhost:3000/dashboard
2. Login with demo credentials:
   - Email: `agent@example.com`
   - Password: `agent123`
3. Select the active session
4. Reply to the customer

### Test Image Translation
1. In customer chat, click "Image Translation"
2. Upload an image with text
3. Click "Extract & Translate Text"
4. View the results

## Common Issues

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Create database manually
createdb multilingual_support
```

### Prisma Client Error
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma migrate reset
```

## Next Steps

1. **Configure Lingo API**: Add your API key to `.env`
2. **Customize UI**: Edit components in `/components`
3. **Add Features**: Check `TODO` comments in code
4. **Deploy**: See [SETUP.md](SETUP.md) for deployment guide

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed demo data

# Utilities
npm run lint             # Run ESLint
npm run setup            # Run setup script
```

## Project Structure (Quick Reference)

```
app/
  ├── chat/              → Customer interface
  ├── dashboard/         → Agent interface
  └── api/               → Backend endpoints

components/              → React components
lib/                     → Utilities & hooks
services/                → Business logic
prisma/                  → Database schema
```

## Demo Credentials

After running `npm run db:seed`:

**Agent Account**
- Email: agent@example.com
- Password: agent123

**Customer Account**
- Email: customer@example.com
- Password: customer123

## Getting Help

- 📖 Read [README.md](README.md) for full documentation
- 🔧 Check [SETUP.md](SETUP.md) for detailed setup
- 🏗️ See [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- 🐛 Open an issue on GitHub

## Quick Tips

💡 **Tip 1**: Use Prisma Studio to view/edit database
```bash
npm run db:studio
```

💡 **Tip 2**: Check browser console for WebSocket connection status

💡 **Tip 3**: Use demo credentials to test without registration

💡 **Tip 4**: Translation API is mocked by default - add real API key for actual translation

---

**You're all set!** Start building your multilingual support system! 🚀
