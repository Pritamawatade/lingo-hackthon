/**
 * Prisma Client (CommonJS version for server.js)
 * 
 * This is a CommonJS wrapper for the Prisma client
 * to ensure compatibility with server.js
 */

const { PrismaClient } = require("@prisma/client");

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };

