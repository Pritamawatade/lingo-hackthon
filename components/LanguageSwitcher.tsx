"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLingoLocale, setLingoLocale } from "lingo.dev/react/client";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
  const currentLocale = useLingoLocale();
  const [currentLanguage, setCurrentLanguage] = useState(currentLocale || "en");
  const [isOpen, setIsOpen] = useState(false);

  // Sync with Lingo locale
  useEffect(() => {
    if (currentLocale) {
      setCurrentLanguage(currentLocale);
    }
  }, [currentLocale]);

  const handleLanguageChange = (code: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setCurrentLanguage(code);
    setIsOpen(false);
    
    // Update Lingo locale without page refresh
    try {
      setLingoLocale(code);
    } catch (error) {
      console.error("Error setting locale:", error);
    }
  };

  const currentLang = languages.find((l) => l.code === currentLanguage);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe size={18} />
        <span className="text-xl">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-20">
            {languages.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLanguageChange(lang.code, e);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  lang.code === currentLanguage ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
