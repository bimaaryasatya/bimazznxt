"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/translations";

type Theme = "dark" | "light";

interface AppContextValue {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  toggleLanguage: () => void;
  setLanguage: (l: Language) => void;
  t: typeof translations["en"];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [language, setLanguageState] = useState<Language>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted theme
    const savedTheme = localStorage.getItem("railway_theme") as Theme | null;
    const initialTheme: Theme = savedTheme === "light" ? "light" : "dark";
    setThemeState(initialTheme);
    applyThemeClass(initialTheme);

    // Read persisted language
    const savedLang = localStorage.getItem("railway_lang") as Language | null;
    if (savedLang === "en" || savedLang === "id") {
      setLanguageState(savedLang);
    }

    setMounted(true);
  }, []);

  const applyThemeClass = (t: Theme) => {
    const root = document.documentElement;
    if (t === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("railway_theme", newTheme);
    applyThemeClass(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem("railway_lang", newLang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "id" : "en";
    setLanguage(next);
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        theme,
        language,
        toggleTheme,
        setTheme,
        toggleLanguage,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      theme: "dark" as Theme,
      language: "id" as Language,
      toggleTheme: () => {},
      setTheme: () => {},
      toggleLanguage: () => {},
      setLanguage: () => {},
      t: translations["id"],
    };
  }
  return context;
}
