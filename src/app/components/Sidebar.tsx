"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Home, Info, Code, Settings, History, Moon, Sun, Github, 
  User, HelpCircle, ExternalLink, Star, BookOpen, MessageCircle 
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, isLoaded } = useUser();
  
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

  const isActive = (path: string) => pathname === path;

  const NavLink = ({ href, icon: Icon, label }: { 
    href: string; 
    icon: React.ComponentType<{ className?: string }>; 
    label: string 
  }) => (
    <Link 
      href={href}
      className={`flex items-center px-4 py-2.5 rounded-lg group transition-all duration-200 ${
        isActive(href) 
          ? 'bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
          : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800'
      }`}
    >
      <Icon 
        className={`h-5 w-5 mr-3 ${
          isActive(href) 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
        }`} 
      />
      <span 
        className={`font-medium ${
          isActive(href) 
            ? '' 
            : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
        }`}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white dark:bg-slate-950 shadow-lg flex flex-col border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2 group">
          <Code className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fixster</h2>
        </Link>
      </div>
      
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        {isLoaded && user ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center shadow-inner overflow-hidden">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.fullName || "User"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                {user.fullName || user.username || "User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.primaryEmailAddress?.emailAddress || "No email"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center shadow-inner">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">Loading...</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Please wait</p>
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main</p>
        
        <NavLink href="/" icon={Home} label="Dashboard" />
        <NavLink href="/chat" icon={MessageCircle} label="Chat" />
        <NavLink href="/history" icon={History} label="History" />
        <NavLink href="/favorites" icon={Star} label="Favorites" />
        
        <div className="pt-6">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Resources</p>
          <NavLink href="/docs" icon={BookOpen} label="Documentation" />
          <NavLink href="/about" icon={Info} label="About" />
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button 
          onClick={toggleDarkMode}
          className="flex items-center w-full px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <>
              <Sun className="h-5 w-5 mr-3 text-amber-500" />
              <span className="font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5 mr-3 text-indigo-500" />
              <span className="font-medium">Dark Mode</span>
            </>
          )}
        </button>
        
        <NavLink href="/settings" icon={Settings} label="Settings" />
        
        <a 
          href="https://github.com/fixster-app/fixster" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center w-full px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 group"
        >
          <Github className="h-5 w-5 mr-3 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">GitHub</span>
          <ExternalLink className="h-3 w-3 ml-auto text-slate-400 group-hover:text-blue-500" />
        </a>

        <NavLink href="/help" icon={HelpCircle} label="Help & Support" />
      </div>
    </aside>
  );
}
