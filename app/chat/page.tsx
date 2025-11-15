"use client";

import { useState, useEffect } from "react";
import { ChatBox } from "@/components/ChatBox";
import { ImageUpload } from "@/components/ImageUpload";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useSocket } from "@/lib/useSocket";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const socket = useSocket();

  const startSession = () => {
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }

    // Create session via API
    const createSession = async () => {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName,
            customerLanguage: language,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const newSessionId = data.session?.id || `session_${Date.now()}`;
          setSessionId(newSessionId);
          setIsSessionStarted(true);

          // Join socket room
          if (socket) {
            socket.emit("join-session", {
              sessionId: newSessionId,
              customerName,
              language,
            });
          }
        } else {
          throw new Error("Failed to create session");
        }
      } catch (error) {
        console.error("Error creating session:", error);
        // Fallback to client-side session ID
        const newSessionId = `session_${Date.now()}`;
        setSessionId(newSessionId);
        setIsSessionStarted(true);

        if (socket) {
          socket.emit("join-session", {
            sessionId: newSessionId,
            customerName,
            language,
          });
        }
      }
    };

    createSession();
  };

  if (!isSessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Start Chat</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="hi">Hindi</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <button
              onClick={startSession}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chat Support</h1>
          <LanguageSwitcher />
        </div>

        <div className="grid gap-6">
          <ChatBox
            sessionId={sessionId}
            userRole="CUSTOMER"
            language={language}
          />

          <ImageUpload
            sessionId={sessionId}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
