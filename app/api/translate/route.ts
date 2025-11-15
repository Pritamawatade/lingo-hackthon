import { NextRequest, NextResponse } from "next/server";
import { translateMessage } from "@/services/lingoService";

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const translatedText = await translateMessage(
      text,
      sourceLanguage,
      targetLanguage
    );
    const translationTime = Date.now() - startTime;

    // TODO: Save translation metadata to database for analytics

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage,
      translationTime,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
