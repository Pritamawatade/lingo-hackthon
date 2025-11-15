"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/lib/useSocket";
import { MessageCircle, Clock } from "lucide-react";

interface Session {
  id: string;
  customerName: string;
  customerLanguage: string;
  status: "ACTIVE" | "WAITING" | "CLOSED";
  lastMessage?: string;
  updatedAt: string;
}

interface SessionListProps {
  onSelectSession: (sessionId: string) => void;
  selectedSession: string | null;
}

export function SessionList({ onSelectSession, selectedSession }: SessionListProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // TODO: Fetch sessions from API
    // fetchActiveSessions();

    // Listen for new sessions
    socket.on("new-session", (session: Session) => {
      setSessions((prev) => [session, ...prev]);
    });

    socket.on("session-updated", (session: Session) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === session.id ? session : s))
      );
    });

    return () => {
      socket.off("new-session");
      socket.off("session-updated");
    };
  }, [socket]);

  const getLanguageFlag = (code: string) => {
    const flags: Record<string, string> = {
      en: "🇬🇧",
      es: "🇪🇸",
      hi: "🇮🇳",
      fr: "🇫🇷",
      de: "🇩🇪",
      zh: "🇨🇳",
    };
    return flags[code] || "🌍";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-semibold">Active Sessions</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {sessions.length} active
        </p>
      </div>

      <div className="divide-y dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <MessageCircle className="mx-auto mb-2" size={32} />
            <p>No active sessions</p>
          </div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedSession === session.id
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getLanguageFlag(session.customerLanguage)}</span>
                  <span className="font-semibold">{session.customerName}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    session.status === "ACTIVE"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}
                >
                  {session.status}
                </span>
              </div>
              
              {session.lastMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                  {session.lastMessage}
                </p>
              )}
              
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} />
                {new Date(session.updatedAt).toLocaleTimeString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
