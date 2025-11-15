/**
 * Shared TypeScript types and interfaces
 */

export type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";
export type SessionStatus = "ACTIVE" | "CLOSED" | "WAITING";
export type MessageType = "TEXT" | "IMAGE" | "SYSTEM";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  customerId?: string;
  customerName: string;
  customerLanguage: string;
  agentId?: string;
  agentLanguage: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  sessionId: string;
  senderId?: string;
  senderRole: UserRole;
  originalText: string;
  originalLanguage: string;
  translatedText?: string;
  translatedLanguage?: string;
  messageType: MessageType;
  imageUrl?: string;
  createdAt: Date;
}

export interface Translation {
  id: string;
  sourceText: string;
  sourceLanguage: string;
  targetText: string;
  targetLanguage: string;
  translationTime: number;
  createdAt: Date;
}

export interface SocketEvents {
  // Client -> Server
  "join-session": (data: {
    sessionId: string;
    customerName: string;
    language: string;
  }) => void;
  "agent-join-session": (data: { sessionId: string; agentId: string }) => void;
  "send-message": (data: {
    sessionId: string;
    senderRole: UserRole;
    originalText: string;
    originalLanguage: string;
  }) => void;

  // Server -> Client
  "new-session": (session: Session) => void;
  "session-updated": (session: Partial<Session>) => void;
  "new-message": (message: Message) => void;
  error: (error: { message: string }) => void;
}
