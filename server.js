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
    socket.on("agent-join-session", (data) => {
      const { sessionId, agentId } = data;
      socket.join(sessionId);
      console.log(`Agent ${agentId} joined session ${sessionId}`);
    });

    // Handle message sending
    socket.on("send-message", async (data) => {
      const { sessionId, senderRole, originalText, originalLanguage } = data;

      try {
        // TODO: Implement translation via Lingo API
        const targetLanguage =
          senderRole === "CUSTOMER" ? "en" : originalLanguage;
        const translatedText = originalText; // Replace with actual translation

        const message = {
          id: `msg_${Date.now()}`,
          sessionId,
          senderRole,
          originalText,
          originalLanguage,
          translatedText,
          translatedLanguage: targetLanguage,
          messageType: "TEXT",
          createdAt: new Date().toISOString(),
        };

        // TODO: Save message to database

        // Broadcast to all clients in the session
        io.to(sessionId).emit("new-message", message);

        // Update session
        io.emit("session-updated", {
          id: sessionId,
          lastMessage: translatedText || originalText,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("error", { message: "Failed to send message" });
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
