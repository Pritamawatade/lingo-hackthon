import { NextRequest, NextResponse } from "next/server";

// Socket.io with Next.js 15 App Router requires a custom server
// This is a placeholder endpoint that explains the setup

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Socket.io endpoint",
    note: "For Socket.io with Next.js 15, you need to set up a custom server. See server.js in the project root.",
    documentation: "https://socket.io/docs/v4/server-initialization/#with-a-custom-http-server"
  });
}

export const dynamic = 'force-dynamic';
