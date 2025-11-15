#!/bin/bash

# Setup script for Multilingual Support System

echo "🚀 Setting up Multilingual Support System..."
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your configuration"
    echo ""
else
    echo "✅ .env file exists"
    echo ""
fi

# Check PostgreSQL connection
echo "🗄️  Checking database connection..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set in environment"
    echo "   Please configure your database in .env"
else
    echo "✅ DATABASE_URL configured"
fi
echo ""

# Initialize Prisma
echo "🗄️  Setting up database..."
npx prisma generate
echo "✅ Prisma client generated"
echo ""

echo "📝 Next steps:"
echo "   1. Update .env with your configuration"
echo "   2. Run 'npm run db:push' to create database tables"
echo "   3. Run 'npm run dev' to start development server"
echo ""
echo "🎉 Setup complete!"
