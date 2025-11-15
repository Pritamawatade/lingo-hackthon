# 🚀 README FIRST - Quick Setup

## ⚡ Fastest Way to Get Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Get Lingo.dev API Key

1. Go to [lingo.dev](https://lingo.dev)
2. Sign up for free
3. Get your API key

### 3. Configure API Key

Edit `.env` file and add your key:
```env
LINGODOTDEV_API_KEY=your_actual_key_here
```

### 4. Start Server
```bash
pnpm dev
```

### 5. Test It!

Open http://localhost:3000/chat

**That's it!** Translation will work without database setup.

---

## 🗄️ Optional: Database Setup

If you want to persist messages (optional for testing):

### Option A: Use Cloud Database (Easiest)

**Supabase (Free):**
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Copy connection string
4. Add to `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   ```
5. Run: `pnpm db:push`

### Option B: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql  # macOS
# or
sudo apt-get install postgresql  # Linux

# Start PostgreSQL
brew services start postgresql  # macOS
# or
sudo systemctl start postgresql  # Linux

# Create database
createdb multilingual_support

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/multilingual_support"

# Push schema
pnpm db:push
```

### Option C: Docker

```bash
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

---

## 🎯 What Works Without Database

✅ Real-time chat translation
✅ Customer → Agent translation
✅ Agent → Customer translation  
✅ Image OCR translation
✅ Language switching
✅ WebSocket communication

❌ Message persistence (messages lost on refresh)
❌ Session history
❌ User accounts

**For testing translation, you don't need database!**

---

## 🐛 Troubleshooting

### Error: Module not found

**Fixed!** We created `services/lingoService.js` for CommonJS compatibility.

### Error: PostgreSQL connection

**Solution:** Either:
1. Setup database (see options above)
2. Or ignore - translation still works!

### Translation not working

**Check:**
```bash
# Is API key set?
cat .env | grep LINGODOTDEV_API_KEY

# Is server running?
curl http://localhost:3000
```

---

## 📚 Full Documentation

- **[START_HERE.md](START_HERE.md)** - Complete setup guide
- **[QUICK_FIX.md](QUICK_FIX.md)** - Fix common issues
- **[LINGO_INTEGRATION.md](LINGO_INTEGRATION.md)** - Translation details
- **[INDEX.md](INDEX.md)** - All documentation

---

## ✅ Quick Checklist

- [ ] Run `pnpm install`
- [ ] Get Lingo.dev API key
- [ ] Add key to `.env`
- [ ] Run `pnpm dev`
- [ ] Test at http://localhost:3000/chat
- [ ] (Optional) Setup database

**You're ready to go!** 🎉

---

## 🎓 Next Steps

1. **Test Translation:**
   - Open `/chat`
   - Select Spanish
   - Send "Hola"
   - See it translate!

2. **Test Agent View:**
   - Open `/dashboard` in new tab
   - See translated messages

3. **Add Database** (optional):
   - Choose cloud provider
   - Add DATABASE_URL
   - Run `pnpm db:push`

4. **Deploy:**
   - See [SETUP.md](SETUP.md) for deployment

---

**Need help?** Check [QUICK_FIX.md](QUICK_FIX.md) for solutions!
