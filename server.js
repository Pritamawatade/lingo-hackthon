/**
 * Custom Next.js Server with Socket.io
 *
 * This is required for Socket.io to work with Next.js 15.
 * Run with: node server.js
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    path: "/api/socketio",
    cors: {
      origin: process.env.NEXT_PUBLIC_SOCKET_URL || `http://localhost:${port}`,
      methods: ["GET", "POST"],
    },
  });

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Customer joins session
    socket.on("join-session", async (data) => {
      const { sessionId, customerName, language } = data;
      socket.join(sessionId);

      console.log(`${customerName} joined session ${sessionId}`);

      // Notify agents about new session
      io.emit("new-session", {
        id: sessionId,
        customerName,
        customerLanguage: language,
        status: "ACTIVE",
        updatedAt: new Date().toISOString(),
      });

      // Send welcome message
      socket.emit("new-message", {
        id: `msg_${Date.now()}`,
        senderRole: "SYSTEM",
        originalText: "Welcome! An agent will be with you shortly.",
        messageType: "SYSTEM",
        createdAt: new Date().toISOString(),
      });
    });

    // Agent joins session
    socket.on("agent-join-session", async (data) => {
      const { sessionId, agentId, agentLanguage } = data;
      socket.join(sessionId);
      console.log(`Agent ${agentId} joined session ${sessionId}`);

      // Update session with agent info
      try {
        const { prisma } = require("./lib/prisma.js");
        await prisma.session.update({
          where: { id: sessionId },
          data: {
            agentId: agentId || null,
            agentLanguage: agentLanguage || "en",
            status: "ACTIVE",
          },
        });
      } catch (error) {
        console.error("Error updating session with agent:", error);
      }
    });

    // Handle message sending with real-time translation
    socket.on("send-message", async (data) => {
      const { sessionId, senderRole, originalText, originalLanguage } = data;

      if (!originalText || !originalText.trim()) {
        socket.emit("error", { message: "Message cannot be empty" });
        return;
      }

      try {
        // Import services
        const { translateConversation } = require("./services/lingoService.js");
        const { prisma } = require("./lib/prisma.js");

        // Fetch session to get language preferences
        const session = await prisma.session.findUnique({
          where: { id: sessionId },
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 10, // Get last 10 messages for context
            },
          },
        });

        if (!session) {
          socket.emit("error", { message: "Session not found" });
          return;
        }

        // Determine source and target languages
        let sourceLanguage, targetLanguage;
        
        if (senderRole === "CUSTOMER") {
          sourceLanguage = session.customerLanguage || originalLanguage || "en";
          targetLanguage = session.agentLanguage || "en"; // Default to English for agent
        } else if (senderRole === "AGENT") {
          sourceLanguage = session.agentLanguage || originalLanguage || "en";
          targetLanguage = session.customerLanguage || "en";
        } else {
          sourceLanguage = originalLanguage || "en";
          targetLanguage = "en";
        }

        // Build conversation context from recent messages (reverse to get chronological order)
        const conversationContext = session.messages
          .filter((msg) => msg.messageType === "TEXT")
          .reverse() // Reverse to get chronological order
          .map((msg) => ({
            name: msg.senderRole === "CUSTOMER" ? "Customer" : "Agent",
            text: msg.originalText,
          }));

        // Add current message to context
        conversationContext.push({
          name: senderRole === "CUSTOMER" ? "Customer" : "Agent",
          text: originalText,
        });

        // Translate using Lingo.dev with conversation context
        let translatedText = originalText;
        if (sourceLanguage !== targetLanguage) {
          try {
            if (conversationContext.length > 1) {
              // Use conversation context for better translation quality
              const translated = await translateConversation(
                conversationContext,
                sourceLanguage,
                targetLanguage
              );
              // Get the last translated message (current message)
              translatedText = translated[translated.length - 1]?.text || originalText;
            } else {
              // Single message translation (first message or no context)
              const { translateMessage } = require("./services/lingoService.js");
              translatedText = await translateMessage(
                originalText,
                sourceLanguage,
                targetLanguage
              );
            }
          } catch (translationError) {
            console.error("Translation error:", translationError);
            // Fallback: try single message translation
            try {
              const { translateMessage } = require("./services/lingoService.js");
              translatedText = await translateMessage(
                originalText,
                sourceLanguage,
                targetLanguage
              );
            } catch (fallbackError) {
              console.error("Fallback translation also failed:", fallbackError);
              // Keep original text if all translation attempts fail
              translatedText = originalText;
            }
          }
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            sessionId,
            senderRole,
            originalText,
            originalLanguage: sourceLanguage,
            translatedText: sourceLanguage !== targetLanguage ? translatedText : null,
            translatedLanguage: sourceLanguage !== targetLanguage ? targetLanguage : null,
            messageType: "TEXT",
          },
        });

        // Format message for client
        const messageData = {
          id: message.id,
          sessionId: message.sessionId,
          senderRole: message.senderRole,
          originalText: message.originalText,
          originalLanguage: message.originalLanguage,
          translatedText: message.translatedText,
          translatedLanguage: message.translatedLanguage,
          messageType: message.messageType,
          createdAt: message.createdAt.toISOString(),
        };

        // Update session timestamp
        await prisma.session.update({
          where: { id: sessionId },
          data: { updatedAt: new Date() },
        });

        // Broadcast to all clients in the session
        io.to(sessionId).emit("new-message", messageData);

        // Update session list for agents
        io.emit("session-updated", {
          id: sessionId,
          lastMessage: translatedText || originalText,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("error", { 
          message: "Failed to send message",
          details: error.message 
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.io ready on path: /api/socketio`);
    });
});
