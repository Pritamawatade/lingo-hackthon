import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Get messages for a session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    const messages = await prisma.message.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * Create new message
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const {
      senderId,
      senderRole,
      originalText,
      originalLanguage,
      translatedText,
      translatedLanguage,
      messageType,
      imageUrl,
    } = await req.json();

    const message = await prisma.message.create({
      data: {
        sessionId,
        senderId,
        senderRole,
        originalText,
        originalLanguage,
        translatedText,
        translatedLanguage,
        messageType: messageType || "TEXT",
        imageUrl,
      },
    });

    // Update session timestamp
    await prisma.session.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
