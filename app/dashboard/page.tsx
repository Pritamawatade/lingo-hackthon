"use client";

import { useState, useEffect } from "react";
import { ChatBox } from "@/components/ChatBox";
import { SessionList } from "@/components/SessionList";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function DashboardPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [agentLanguage, setAgentLanguage] = useState<string>("en");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPassword, setAgentPassword] = useState("");

  // TODO: Implement proper authentication
  const handleLogin = () => {
    if (agentEmail && agentPassword) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Agent Login</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="agent@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={agentPassword}
                onChange={(e) => setAgentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Agent Dashboard</h1>
          <LanguageSwitcher />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SessionList
              onSelectSession={setSelectedSession}
              selectedSession={selectedSession}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedSession ? (
              <ChatBox
                sessionId={selectedSession}
                userRole="AGENT"
                language={agentLanguage}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a session to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
