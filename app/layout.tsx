import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multilingual Support System",
  description: "Real-time chat with automatic translation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>

    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </LingoProvider>
  );
}
