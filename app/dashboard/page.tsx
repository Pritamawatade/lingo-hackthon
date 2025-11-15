"use client";

import { useState, useEffect } from "react";
import { ChatBox } from "@/components/ChatBox";
import { SessionList } from "@/components/SessionList";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useSocket } from "@/lib/useSocket";

export default function DashboardPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [agentLanguage, setAgentLanguage] = useState<string>("en");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPassword, setAgentPassword] = useState("");
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  // Restore authentication state from localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      const agentData = localStorage.getItem("agent_data");
      
      if (token && agentData) {
        try {
          // First try to restore from localStorage (faster)
          const parsedData = JSON.parse(agentData);
          setIsAuthenticated(true);
          setAgentId(parsedData.id);
          setAgentLanguage(parsedData.language || "en");
          setIsLoading(false);
          
          // Then verify token in background
          const response = await fetch("/api/auth/verify", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (!response.ok) {
            // Token invalid, clear everything
            localStorage.removeItem("auth_token");
            localStorage.removeItem("agent_data");
            setIsAuthenticated(false);
            setAgentId(null);
          } else {
            const data = await response.json();
            if (data.success && data.user) {
              // Update with latest user data
              setAgentLanguage(data.user.language || "en");
              localStorage.setItem("agent_data", JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                language: data.user.language || "en",
              }));
            }
          }
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("agent_data");
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle agent login
  const handleLogin = async () => {
    if (!agentEmail || !agentPassword) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: agentEmail, password: agentPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          if (data.user.role !== "AGENT" && data.user.role !== "ADMIN") {
            alert("Access denied. Agent account required.");
            return;
          }
          setIsAuthenticated(true);
          setAgentId(data.user.id);
          setAgentLanguage(data.user.language || "en");
          // Store token and user data
          if (data.token) {
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("agent_data", JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              language: data.user.language || "en",
            }));
          }
        } else {
          alert("Invalid credentials");
        }
      } else {
        const error = await response.json();
        alert(error.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  // Handle session selection
  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
    
    // Join session via socket
    if (socket && sessionId) {
      socket.emit("agent-join-session", {
        sessionId,
        agentId: agentId || "demo-agent",
        agentLanguage: agentLanguage,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("agent_data");
                setIsAuthenticated(false);
                setAgentId(null);
                setSelectedSession(null);
              }}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SessionList
              onSelectSession={handleSessionSelect}
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
