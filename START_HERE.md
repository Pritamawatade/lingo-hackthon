# 🚀 START HERE

Welcome to the **Real-Time Multilingual Support System**!

This is your complete, production-ready scaffold for building a multilingual customer support platform with real-time translation.

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Install dependencies (auto-generates Prisma client)
pnpm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database URL and API keys

# 3. Setup database
pnpm db:push

# 4. (Optional) Add demo data
pnpm db:seed

# 5. Start development server (with Socket.io)
pnpm dev
```

Visit: **http://localhost:3000** 🎉

> **Note**: Uses custom server for Socket.io support

## 📖 What You Got

### ✅ Complete Features
- **Real-time chat** with WebSocket (Socket.io)
- **Automatic translation** (Lingo API integration)
- **Image OCR** with text extraction and translation
- **Multi-language UI** (6 languages supported)
- **Agent dashboard** for managing customer sessions
- **Customer chat interface** with language selection
- **Authentication system** (JWT + bcrypt)
- **PostgreSQL database** with Prisma ORM

### 📁 40+ Files Created
- 8 Documentation files
- 25+ TypeScript/React files
- 4 React components
- 8 API routes
- 2 Backend services
- Database schema
- Configuration files
- Utility scripts

### 🎨 UI Components
- ChatBox - Real-time messaging
- ImageUpload - OCR & translation
- LanguageSwitcher - Language selector
- SessionList - Session management

## 📚 Documentation

**Start with these in order:**

1. **[INDEX.md](INDEX.md)** - Documentation navigation
2. **[QUICK_START.md](QUICK_START.md)** - Detailed setup guide
3. **[README.md](README.md)** - Full project overview
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design

**Additional resources:**

5. **[SETUP.md](SETUP.md)** - Production deployment
6. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - File structure
7. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guide
8. **[TREE.txt](TREE.txt)** - Visual project tree

## 🎯 What to Do Next

### For Hackathon Participants

1. **Get it running** (5 min)
   ```bash
   npm install
   cp .env.example .env
   npm run db:push
   npm run dev
   ```

2. **Test the demo** (5 min)
   - Visit http://localhost:3000
   - Try customer chat
   - Try agent dashboard
   - Upload an image

3. **Configure Lingo API** (10 min)
   - Get your Lingo API key
   - Add to `.env` file
   - Test real translation

4. **Customize & Build** (rest of hackathon)
   - Modify UI components
   - Add your unique features
   - Deploy to Vercel

### For Production Use

1. **Security Setup**
   - Change `JWT_SECRET` to secure random string
   - Configure CORS properly
   - Enable HTTPS
   - Add rate limiting

2. **Database Setup**
   - Use production PostgreSQL (Supabase/Railway/Neon)
   - Run migrations
   - Set up backups

3. **API Configuration**
   - Add real Lingo API key
   - Configure error handling
   - Set up monitoring

4. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Configure environment variables
   - Test production build

## 🌍 Supported Languages

- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇮🇳 Hindi (hi)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇨🇳 Chinese (zh)

## 🔑 Demo Credentials

After running `npm run db:seed`:

**Agent:**
- Email: `agent@example.com`
- Password: `agent123`

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, Socket.io
- **Database:** PostgreSQL + Prisma
- **Translation:** Lingo API
- **OCR:** Tesseract.js
- **Auth:** JWT + bcrypt

## 📊 Project Stats

- **Total Files:** 40+
- **Lines of Code:** 2000+
- **Components:** 4 React components
- **API Routes:** 8 endpoints
- **Services:** 2 backend services
- **Documentation:** 8 comprehensive guides

## 🎓 Learning Resources

### Documentation
- [INDEX.md](INDEX.md) - Start here for navigation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Understand the system
- [QUICK_START.md](QUICK_START.md) - Setup instructions

### Code Structure
```
app/          → Pages & API routes
components/   → React components
lib/          → Utilities & hooks
services/     → Business logic
prisma/       → Database schema
```

### Key Files to Explore
- `app/chat/page.tsx` - Customer interface
- `app/dashboard/page.tsx` - Agent interface
- `components/ChatBox.tsx` - Chat component
- `services/lingoService.ts` - Translation logic
- `pages/api/socket.ts` - WebSocket server

## 💡 Pro Tips

1. **Use Prisma Studio** to view/edit database:
   ```bash
   npm run db:studio
   ```

2. **Check TODO comments** in code for extension points

3. **Test WebSocket** by opening chat in two browser windows

4. **Mock translation** is enabled by default - add real API key for production

5. **Read ARCHITECTURE.md** to understand data flow

## 🐛 Common Issues

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Create database
createdb multilingual_support
```

### Prisma client error
```bash
npx prisma generate
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Custom Server (for Socket.io)
See [SETUP.md](SETUP.md) for custom server setup

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🎉 You're Ready!

Everything is set up and ready to go. The scaffold is complete with:

✅ Full-stack architecture
✅ Real-time communication
✅ Translation integration
✅ Database setup
✅ Authentication
✅ UI components
✅ Comprehensive documentation

**Now it's your turn to build something amazing!**

### Next Steps:
1. Run `npm install`
2. Configure `.env`
3. Run `npm run dev`
4. Start building!

---

**Questions?** Check [INDEX.md](INDEX.md) for documentation navigation.

**Issues?** See [QUICK_START.md#common-issues](QUICK_START.md) for troubleshooting.

**Ready to deploy?** Read [SETUP.md](SETUP.md) for production guide.

---

**Built with ❤️ for seamless multilingual communication**

Good luck with your project! 🚀
