import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Get all active sessions
 */
export async function GET(req: NextRequest) {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

/**
 * Create new session
 */
export async function POST(req: NextRequest) {
  try {
    const { customerName, customerLanguage, customerId } = await req.json();

    if (!customerName || !customerLanguage) {
      return NextResponse.json(
        { error: "Customer name and language required" },
        { status: 400 }
      );
    }

    const session = await prisma.session.create({
      data: {
        customerName,
        customerLanguage,
        customerId,
        status: "WAITING",
      },
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
