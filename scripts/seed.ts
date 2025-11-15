/**
 * Database seeding script
 * Run with: npx ts-node scripts/seed.ts
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo agent
  const agentPassword = await hashPassword("agent123");
  const agent = await prisma.user.upsert({
    where: { email: "agent@example.com" },
    update: {},
    create: {
      email: "agent@example.com",
      password: agentPassword,
      name: "Demo Agent",
      role: "AGENT",
      language: "en",
    },
  });
  console.log("✅ Created agent:", agent.email);

  // Create demo customer
  const customerPassword = await hashPassword("customer123");
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: customerPassword,
      name: "Demo Customer",
      role: "CUSTOMER",
      language: "es",
    },
  });
  console.log("✅ Created customer:", customer.email);

  // Create demo session
  const session = await prisma.session.create({
    data: {
      customerName: "Demo Customer",
      customerLanguage: "es",
      customerId: customer.id,
      agentId: agent.id,
      agentLanguage: "en",
      status: "ACTIVE",
    },
  });
  console.log("✅ Created session:", session.id);

  // Create demo messages
  await prisma.message.createMany({
    data: [
      {
        sessionId: session.id,
        senderId: customer.id,
        senderRole: "CUSTOMER",
        originalText: "Hola, necesito ayuda con mi pedido",
        originalLanguage: "es",
        translatedText: "Hello, I need help with my order",
        translatedLanguage: "en",
        messageType: "TEXT",
      },
      {
        sessionId: session.id,
        senderId: agent.id,
        senderRole: "AGENT",
        originalText: "Hello! I'd be happy to help you with your order.",
        originalLanguage: "en",
        translatedText: "¡Hola! Estaré encantado de ayudarte con tu pedido.",
        translatedLanguage: "es",
        messageType: "TEXT",
      },
    ],
  });
  console.log("✅ Created demo messages");

  console.log("\n🎉 Seeding complete!");
  console.log("\nDemo credentials:");
  console.log("Agent: agent@example.com / agent123");
  console.log("Customer: customer@example.com / customer123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
