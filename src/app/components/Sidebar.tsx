"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Home, Info, Settings, History, Github, 
  User, HelpCircle, ExternalLink, Star, BookOpen, MessageCircle, Code
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import SupportModal from "./SupportModal";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [showSupportModal, setShowSupportModal] = useState(false);

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
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-slate-900 border-r border-slate-800 overflow-y-auto">
      <div className="p-4 border-b border-slate-800">
        {isLoaded && user ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
              {user.imageUrl ? (
                <Image 
                  src={user.imageUrl} 
                  alt={user.fullName || "User"} 
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-200 truncate">
                {user.fullName || user.username || "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user.primaryEmailAddress?.emailAddress || "No email"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center shadow-inner">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-slate-200">Loading...</p>
              <p className="text-xs text-slate-400">Please wait</p>
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main</p>
        
        <NavLink href="/" icon={Home} label="Dashboard" />
        <NavLink href="/editor" icon={Code} label="Code Editor" />
        <NavLink href="/chat" icon={MessageCircle} label="Chat" />
        <NavLink href="/history" icon={History} label="History" />
        <NavLink href="/favorites" icon={Star} label="Favorites" />
        
        <div className="pt-6">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Resources</p>
          <a 
            href="https://nextjs.org/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2.5 rounded-lg group transition-all duration-200 text-slate-300 hover:bg-slate-800"
          >
            <BookOpen className="h-5 w-5 mr-3 text-slate-500 group-hover:text-blue-400" />
            <span className="font-medium group-hover:text-blue-400">Documentation</span>
          </a>
          <a 
            href="https://github.com/GitDaksh/fixster" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2.5 rounded-lg group transition-all duration-200 text-slate-300 hover:bg-slate-800"
          >
            <Info className="h-5 w-5 mr-3 text-slate-500 group-hover:text-blue-400" />
            <span className="font-medium group-hover:text-blue-400">About</span>
          </a>
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-800 space-y-2">
        <NavLink href="/settings" icon={Settings} label="Settings" />
        
        <a 
          href="https://github.com/fixster-app/fixster" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center w-full px-4 py-2.5 text-slate-300 hover:bg-slate-800 rounded-lg transition-all duration-200 group"
        >
          <Github className="h-5 w-5 mr-3 text-slate-500 group-hover:text-blue-400" />
          <span className="font-medium group-hover:text-blue-400">GitHub</span>
          <ExternalLink className="h-3 w-3 ml-auto text-slate-400 group-hover:text-blue-400" />
        </a>

        <button
          onClick={() => setShowSupportModal(true)}
          className="flex items-center w-full px-4 py-2.5 text-slate-300 hover:bg-slate-800 rounded-lg transition-all duration-200 group"
        >
          <HelpCircle className="h-5 w-5 mr-3 text-slate-500 group-hover:text-blue-400" />
          <span className="font-medium group-hover:text-blue-400">Help & Support</span>
        </button>
      </div>

      {/* Support Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        userEmail={user?.primaryEmailAddress?.emailAddress}
      />
    </aside>
  );
}
