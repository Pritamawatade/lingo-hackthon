"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  sessionId: string;
  language: string;
}

export function ImageUpload({ sessionId, language }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setExtractedText("");
    setTranslatedText("");

    try {
      // TODO: Upload image and process OCR
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("sessionId", sessionId);
      formData.append("language", language);

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setExtractedText(data.extractedText);
        setTranslatedText(data.translatedText);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreview(null);
    setExtractedText("");
    setTranslatedText("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Image Translation</h3>
      
      <div className="space-y-4">
        {/* Upload Area */}
        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, JPEG (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg bg-gray-100 dark:bg-gray-700"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        {preview && !isProcessing && !extractedText && (
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Extract & Translate Text
          </button>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="animate-spin" size={20} />
            <span>Processing image...</span>
          </div>
        )}

        {/* Results */}
        {extractedText && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-semibold mb-1">Extracted Text:</p>
              <p className="text-sm">{extractedText}</p>
            </div>
            
            {translatedText && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-semibold mb-1">Translation:</p>
                <p className="text-sm">{translatedText}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
