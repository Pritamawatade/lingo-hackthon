/** @type {import('next').NextConfig} */
import lingoCompiler from "lingo.dev/compiler";

const withLingo = lingoCompiler.next({
  sourceRoot: "app",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["en", "es", "hi", "fr", "de", "zh", "ja", "ko", "pt", "ru", "ar", "it", "nl", "pl", "tr", "vi", "th", "id"],
  rsc: true,
  useDirective: false,
  debug: false,
  models: "lingo.dev",
});


const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withLingo(nextConfig);

// module.exports = nextConfig;
