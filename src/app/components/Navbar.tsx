"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Code, Sun, Moon, ChevronDown } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark") || 
                   localStorage.getItem("theme") === "dark");
                   
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <nav 
      className={`sticky top-0 z-40 border-b backdrop-blur-md bg-white/90 dark:bg-slate-950/90 transition-all duration-300 ${
        isScrolled 
          ? "border-slate-200 dark:border-slate-800 shadow-md" 
          : "border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur-md transition-all duration-300 group-hover:scale-110"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-full p-1.5">
              <Code className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fixster
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          <Link href="/dashboard" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition px-3 py-2 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/70 font-medium">
            Dashboard
          </Link>
          <Link href="/chat" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition px-3 py-2 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/70 font-medium">
            Chat
          </Link>
          
          <div className="relative group">
            <button className="flex items-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition px-3 py-2 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/70 font-medium">
              Resources
              <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
              <Link href="/projects" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-t-lg">
                Projects
              </Link>
              <Link href="/examples" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                Examples
              </Link>
              <Link href="/docs" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-b-lg">
                Documentation
              </Link>
            </div>
          </div>
          
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
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/20">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "border-2 border-blue-500 hover:border-purple-500 transition-colors duration-300"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>

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
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "border-2 border-blue-500 hover:border-purple-500 transition-colors duration-300"
                  }
                }}
              />
            </SignedIn>
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-slate-700 dark:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-6 py-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 animate-slideDown">
          <Link href="/dashboard" className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium hover:bg-slate-100/70 dark:hover:bg-slate-800/70 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
          <Link href="/chat" className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium hover:bg-slate-100/70 dark:hover:bg-slate-800/70 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
            Chat
          </Link>
          
          <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 px-3">Resources</p>
            <Link href="/projects" className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium hover:bg-slate-100/70 dark:hover:bg-slate-800/70 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
              Projects
            </Link>
            <Link href="/examples" className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium hover:bg-slate-100/70 dark:hover:bg-slate-800/70 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
              Examples
            </Link>
            <Link href="/docs" className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium hover:bg-slate-100/70 dark:hover:bg-slate-800/70 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
              Documentation
            </Link>
          </div>
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="w-full mt-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/20 font-medium" onClick={() => setIsOpen(false)}>
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      )}
    </nav>
  );
}