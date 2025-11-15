import Tesseract from "tesseract.js";

/**
 * OCR Service for extracting text from images
 */

/**
 * Extract text from image buffer using Tesseract.js
 */
export async function extractTextFromImage(
  imageBuffer: Buffer
): Promise<string> {
  try {
    const result = await Tesseract.recognize(imageBuffer, "eng", {
      logger: (m) => console.log(m), // Optional: log progress
    });

    return result.data.text.trim();
  } catch (error) {
    console.error("OCR error:", error);
    throw new Error("Failed to extract text from image");
  }
}

/**
 * Extract text with language detection
 */
export async function extractTextWithLanguage(
  imageBuffer: Buffer,
  language: string = "eng"
): Promise<{ text: string; confidence: number }> {
  try {
    const result = await Tesseract.recognize(imageBuffer, language, {
      logger: (m) => console.log(m),
    });

    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
    };
  } catch (error) {
    console.error("OCR error:", error);
    throw new Error("Failed to extract text from image");
  }
}

/**
 * Supported OCR languages
 * Add more as needed: https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html
 */
export const SUPPORTED_OCR_LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "chi_sim", name: "Chinese Simplified" },
  { code: "hin", name: "Hindi" },
];
