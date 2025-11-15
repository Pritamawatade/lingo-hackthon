import { NextRequest, NextResponse } from "next/server";
import { extractTextFromImage } from "@/services/ocrService";
import { translateMessage } from "@/services/lingoService";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const sessionId = formData.get("sessionId") as string;
    const language = formData.get("language") as string;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert image to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text using OCR
    const extractedText = await extractTextFromImage(buffer);

    if (!extractedText) {
      return NextResponse.json(
        { error: "No text found in image" },
        { status: 400 }
      );
    }

    // Translate extracted text
    const translatedText = await translateMessage(
      extractedText,
      "auto", // Auto-detect source language
      language
    );

    // TODO: Save to database and send via WebSocket

    return NextResponse.json({
      success: true,
      extractedText,
      translatedText,
      sessionId,
    });
  } catch (error) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}

// Route segment config for body size limit
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic';
