"use client";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check current theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark") || 
                   localStorage.getItem("theme") === "dark");
    }
  }, []);
  
  // Toggle dark mode functionality
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 py-2 px-4 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <>
          <Sun className="h-4 w-4 text-amber-500" />
          <span className="font-medium text-sm">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-indigo-500" />
          <span className="font-medium text-sm">Dark</span>
        </>
      )}
    </button>
  );
}