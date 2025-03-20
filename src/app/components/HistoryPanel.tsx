import React, { useEffect, useState } from "react";
import { Clock, ArrowUpRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { getProject, ChatMessage } from "../services/projectService";

interface HistoryPanelProps {
  setCode: (code: string) => void;
}

export default function HistoryPanel({ setCode }: HistoryPanelProps) {
  const { user } = useUser();
  const [prompts, setPrompts] = useState<string[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    const updatePrompts = () => {
      if (user) {
        const currentProjectId = localStorage.getItem("activeProject");
        if (!currentProjectId) return;

        setActiveProjectId(currentProjectId);
        const project = getProject(user.id, currentProjectId);
        if (!project) return;

        // Extract only user prompts from chat history
        const userPrompts = project.chatHistory
          .filter(msg => msg.sender === "user")
          .map(msg => msg.text);

        setPrompts(userPrompts);
      }
    };

    // Initial load
    updatePrompts();

    // Set up storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "activeProject") {
        updatePrompts();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for project changes
    const handleProjectChange = () => updatePrompts();
    window.addEventListener("projectChanged", handleProjectChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("projectChanged", handleProjectChange);
    };
  }, [user]);

  if (prompts.length === 0) return null;

  return (
    <div className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-xl">
      <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center">
        <Clock className="h-4 w-4 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Project Prompts</h2>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {prompts.map((prompt, index) => (
            <div 
              key={`${activeProjectId}-${index}`}
              className="group cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg p-3 transition-all duration-200"
              onClick={() => setCode(prompt)}
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm text-slate-700 dark:text-slate-300 truncate flex-1">
                  {prompt.length > 50 ? `${prompt.substring(0, 50)}...` : prompt}
                </div>
                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowUpRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}