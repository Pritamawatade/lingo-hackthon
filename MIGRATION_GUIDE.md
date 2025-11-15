# Migration Guide - Latest Stack

## ✨ What's Updated

This project now uses the **latest versions** of all technologies:

### Version Updates

| Package     | Old   | New        | Changes                                    |
| ----------- | ----- | ---------- | ------------------------------------------ |
| Next.js     | 14.2  | **15.1**   | Turbopack by default, improved performance |
| React       | 18.3  | **19.0**   | New compiler, better performance           |
| TypeScript  | 5.4   | **5.7**    | Latest features                            |
| Prisma      | 5.14  | **6.1**    | Better performance, new features           |
| Socket.io   | 4.7   | **4.8**    | Bug fixes, improvements                    |
| TailwindCSS | 3.4.0 | **3.4.17** | Latest patches                             |
| ESLint      | 8.57  | **9.17**   | Flat config format                         |

## 🚀 Key Improvements

### 1. Turbopack (Default)

- **10x faster** local development
- Enabled by default in `next.config.js`
- No webpack configuration needed

```javascript
// next.config.js
const nextConfig = {
  turbopack: {}, // Enable Turbopack
  // No webpack config needed!
};
```

### 2. React 19

- New React Compiler for better performance
- Improved hooks and concurrent features
- Better TypeScript support

### 3. Modern Image Handling

- Updated from deprecated `images.domains`
- Now using `images.remotePatterns`

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
    },
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

### 4. ESLint 9 (Flat Config)

- New flat config format
- Better performance
- Simpler configuration

### 5. Prisma 6

- Faster queries
- Better TypeScript support
- Improved migrations

## 🔧 Breaking Changes Fixed

### 1. React 19 Event Handlers

Changed `onKeyPress` to `onKeyDown` (React 19 deprecation):

```tsx
// Before
<input onKeyPress={handleKeyPress} />

// After
<input onKeyDown={handleKeyDown} />
```

### 2. TypeScript Target

Updated to ES2022 for better performance:

```json
{
  "compilerOptions": {
    "target": "ES2022" // Was ES2017
  }
}
```

### 3. Package Manager

Added `.npmrc` for better compatibility:

```
legacy-peer-deps=true
```

## 📦 Installation

### Using pnpm (Recommended)

```bash
pnpm install
pnpm dev
```

### Using npm

```bash
npm install
npm run dev
```

### Using yarn

```bash
yarn install
yarn dev
```

## 🎯 Development Commands

All commands now support Turbopack:

```bash
# Development (with Turbopack)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database commands
pnpm db:push
pnpm db:studio
pnpm db:seed

# Linting
pnpm lint
```

## ⚡ Performance Improvements

### Development Speed

- **Turbopack**: 10x faster than webpack
- **React 19**: Faster rendering
- **Prisma 6**: Faster queries

### Build Time

- Next.js 15: Improved build optimization
- Better tree-shaking
- Smaller bundle sizes

### Runtime Performance

- React 19 compiler optimizations
- Better hydration
- Improved concurrent rendering

## 🔄 Migration Steps

If you have an existing project:

### 1. Update package.json

```bash
# Backup your current package.json
cp package.json package.json.backup

# Update dependencies
pnpm update --latest
```

### 2. Update Configuration Files

- `next.config.js` - Add turbopack config
- `tsconfig.json` - Update target to ES2022
- Create `eslint.config.mjs` for ESLint 9

### 3. Fix Breaking Changes

- Update event handlers (onKeyPress → onKeyDown)
- Update image configuration
- Check for React 19 deprecations

### 4. Test Everything

```bash
pnpm build
pnpm start
```

## 🐛 Common Issues

### Issue: Build fails with webpack error

**Solution**: Turbopack is now default. Remove any webpack config or add `turbopack: {}` to next.config.js

### Issue: React peer dependency warnings

**Solution**: Use `.npmrc` with `legacy-peer-deps=true`

### Issue: ESLint errors

**Solution**: Update to ESLint 9 flat config format

### Issue: Prisma client errors

**Solution**: Regenerate Prisma client

```bash
pnpm prisma generate
```

## 📚 Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Turbopack Docs](https://nextjs.org/docs/architecture/turbopack)
- [Prisma 6 Docs](https://www.prisma.io/docs)
- [ESLint 9 Migration](https://eslint.org/docs/latest/use/migrate-to-9.0.0)

## ✅ Verification Checklist

After migration, verify:

- [ ] `pnpm dev` starts without errors
- [ ] Turbopack is active (check terminal output)
- [ ] All pages load correctly
- [ ] WebSocket connection works
- [ ] Database queries work
- [ ] Build completes successfully
- [ ] Production build runs

## 🎉 Benefits

### Developer Experience

- ⚡ 10x faster hot reload
- 🔥 Better error messages
- 🎯 Improved TypeScript support
- 📦 Smaller bundle sizes

### Production

- 🚀 Faster page loads
- 💪 Better performance
- 🔒 Latest security patches
- 🎨 Modern features

---

**You're now running on the latest stack!** 🎉

Enjoy the improved performance and developer experience!
