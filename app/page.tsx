import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Multilingual Support System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Connect with customers in any language. Real-time translation powered by AI.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <Link
              href="/chat"
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold mb-2">Customer Chat</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start a conversation in your language
              </p>
            </Link>

            <Link
              href="/dashboard"
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">🎧</div>
              <h2 className="text-2xl font-semibold mb-2">Agent Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage customer conversations
              </p>
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-semibold mb-2">Multi-Language</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Support for 100+ languages
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Real-Time</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instant message translation
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg">
              <div className="text-3xl mb-2">📸</div>
              <h3 className="font-semibold mb-2">Image OCR</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Extract & translate from images
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
