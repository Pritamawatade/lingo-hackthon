"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/lib/useSocket";
import { Send } from "lucide-react";

interface Message {
  id: string;
  senderRole: "CUSTOMER" | "AGENT";
  originalText: string;
  translatedText?: string;
  originalLanguage: string;
  createdAt: string;
  messageType: "TEXT" | "IMAGE" | "SYSTEM";
  imageUrl?: string;
}

interface ChatBoxProps {
  sessionId: string;
  userRole: "CUSTOMER" | "AGENT";
  language: string;
}

export function ChatBox({ sessionId, userRole, language }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Load message history from API
    const fetchMessageHistory = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/messages`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.messages) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error("Error fetching message history:", error);
      }
    };

    fetchMessageHistory();

    return () => {
      socket.off("new-message");
    };
  }, [socket, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || !socket) return;

    setIsLoading(true);

    try {
      const messageData = {
        sessionId,
        senderRole: userRole,
        originalText: inputText,
        originalLanguage: language,
        // Target language will be determined by server based on role
      };

      socket.emit("send-message", messageData);
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-semibold">
          {userRole === "AGENT" ? "Customer Chat" : "Support Chat"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Session: {sessionId.slice(0, 8)}...
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderRole === userRole ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderRole === userRole
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {message.messageType === "IMAGE" && message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="Uploaded"
                    className="rounded mb-2 max-w-full"
                  />
                )}
                
                <p className="text-sm">
                  {message.translatedText || message.originalText}
                </p>
                
                {/* Show original text if translated */}
                {message.translatedText && userRole === "AGENT" && (
                  <p className="text-xs mt-2 opacity-70 italic">
                    Original: {message.originalText}
                  </p>
                )}
                
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
