"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Code, Sun, Moon } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark") || 
                   localStorage.getItem("theme") === "dark");
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Code className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fixster
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/dashboard" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition px-3 py-2">
            Dashboard
          </Link>
          <Link href="/chat" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition px-3 py-2">
            Chat
          </Link>
          <Link href="/projects" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition px-3 py-2">
            Projects
          </Link>
          
          <button 
            onClick={toggleDarkMode}
            className="ml-2 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500" />
            )}
          </button>
          
          <div className="ml-4">
            <SignedOut>
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button 
            onClick={toggleDarkMode}
            className="mr-2 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500" />
            )}
          </button>
          
          <div className="mr-2">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
          
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700 dark:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-6 py-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
          <Link href="/chat" className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium" onClick={() => setIsOpen(false)}>
            Chat
          </Link>
          <Link href="/projects" className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium" onClick={() => setIsOpen(false)}>
            Projects
          </Link>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium" onClick={() => setIsOpen(false)}>
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      )}
    </nav>
  );
}