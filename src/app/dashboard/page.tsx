"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HistoryPanel from "../components/HistoryPanel";
import { useUser } from "@clerk/nextjs";
import { getUserProjects, Project } from "../services/projectService";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    // Load history from localStorage
    try {
      const savedHistory = JSON.parse(localStorage.getItem("fixster_history") || "[]");
      setHistory(savedHistory);
    } catch (error) {
      console.error("Failed to parse history:", error);
      setHistory([]);
    }
    
    // Load user's projects
    const userProjects = getUserProjects(user.id);
    setProjects(userProjects);
    
    // Check if a project is selected
    const activeProject = localStorage.getItem("activeProject");
    if (!activeProject) {
      setShowProjectModal(true);
    }
  }, [user]);
  
  const saveToHistory = (newEntry: string) => {
    if (!newEntry.trim()) return;
    
    const updatedHistory = [newEntry, ...history.filter(entry => entry !== newEntry)].slice(0, 5);
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem("fixster_history", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };
  
  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setOutput("");
    
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setOutput(data.output || "No useful output. Please check your code.");
      saveToHistory(code);
    } catch (error) {
      console.error("Analysis failed:", error);
      setOutput("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewProject = () => {
    router.push("/new-project");
  };

  const handleSelectProject = (projectId: string) => {
    localStorage.setItem("activeProject", projectId);
    setShowProjectModal(false);
    // Dispatch custom event to notify components of project change
    window.dispatchEvent(new CustomEvent("projectChanged", { detail: { projectId } }));
  };
  
  // Function to parse and render code blocks in the output
  const renderOutputSection = (section: string, index: number) => {
    const lines = section.split('\n');
    const title = lines.find(line => line.startsWith('#'))?.replace(/^#+\s*/, '');
    const content = lines.filter(line => !line.startsWith('#'));
    
    if (!title) {
      return (
        <div key={index} className="p-4 text-slate-300">
          {content.map((line, lineIndex) => (
            <p key={lineIndex} className="my-1">
              {line}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div key={index} className="group">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3 mb-4">
            {renderSectionIcon(title)}
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
          </div>
          <div className="space-y-3 ml-11">
            {renderContentLines(content)}
          </div>
        </div>
      </div>
    );
  };
  
  // Helper function to render section icons
  const renderSectionIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('issue')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    } else if (lowerTitle.includes('performance')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      );
    } else if (lowerTitle.includes('best practices')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    } else if (lowerTitle.includes('security')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      );
    } else if (lowerTitle.includes('recommendation')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
    
    // Default icon if no match
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };
  
  // Helper function to render content lines with code blocks
  const renderContentLines = (content: string[]) => {
    const result = [];
    
    for (let i = 0; i < content.length; i++) {
      const line = content[i];
      
      if (line.startsWith('```')) {
        // Extract language and code block
        const language = line.replace(/```/, '').trim();
        const codeBlockLines: string[] = [];
        let j = i + 1;
        
        // Collect all lines until we find the closing ```
        while (j < content.length && !content[j].startsWith('```')) {
          codeBlockLines.push(content[j]);
          j++;
        }
        
        // Skip the processed lines in future iterations
        i = j; // This will become j+1 after the loop increments i
        
        result.push(
          <div key={`code-${i}`} className="relative group/code my-4">
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 rounded-t-lg border-b border-slate-600 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            <pre className="mt-8 bg-slate-900 rounded-lg overflow-x-auto font-mono text-sm text-slate-300 border border-slate-700">
              <div className="sticky left-0 right-0 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-4 py-1">
                <span className="text-xs text-slate-400 font-mono">{language}</span>
              </div>
              <code className="block p-4 whitespace-pre-wrap break-words">
                {codeBlockLines.join('\n')}
              </code>
            </pre>
            <button 
              onClick={() => navigator.clipboard.writeText(codeBlockLines.join('\n'))}
              className="absolute top-12 right-2 p-2 rounded-lg bg-slate-700/50 opacity-0 group-hover/code:opacity-100 transition-opacity hover:bg-slate-700"
              aria-label="Copy code"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        );
      } else if (line.startsWith('- ')) {
        const content = line.replace(/^-\s*/, '')
                           .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
                           .replace(/\*(.*?)\*/g, '$1');    // Remove markdown italic
        
        // Split the line into label and description if it contains a colon
        const [label, ...descriptionParts] = content.split(':');
        const description = descriptionParts.join(':').trim();
        
        result.push(
          <div key={`list-${i}`} className="flex items-start space-x-3 group/item hover:bg-slate-800/50 rounded-lg p-2 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
            {description ? (
              <div className="flex-1">
                <span className="font-medium text-slate-200">{label}:</span>
                <span className="text-slate-300 ml-1">{description}</span>
              </div>
            ) : (
              <p className="text-slate-300 flex-1">{label}</p>
            )}
          </div>
        );
      } else if (line.trim()) {
        const cleanedText = line.replace(/\*\*(.*?)\*\*/g, '$1')  // Remove markdown bold
                               .replace(/\*(.*?)\*/g, '$1');       // Remove markdown italic
        
        result.push(
          <p key={`text-${i}`} className="text-slate-300 leading-relaxed py-1">
            {cleanedText}
          </p>
        );
      }
    }
    
    return result;
  };
  
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Fixster
              </h1>
              <p className="text-sm text-slate-400 mt-1">AI-powered code debugging assistant</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateNewProject}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg cursor-pointer active:scale-100"
                aria-label="Create new project"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Project
              </button>
            </div>
          </div>
          
          <div className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-medium text-slate-400">code.js</span>
            </div>
            <textarea
              className="w-full p-4 bg-slate-800 border-none focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none text-sm font-mono h-64 text-slate-200"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              aria-label="Code editor"
            />
          </div>
          
          <button
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-[1.02] hover:bg-blue-700 hover:shadow-lg cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-none relative"
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            aria-label="Analyze code"
          >
            <span className="flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Code...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Analyze Code
                </>
              )}
            </span>
          </button>
          
          {output && (
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></div>
                  <h2 className="text-base font-medium text-white">AI Analysis Results</h2>
                </div>
                <div className="text-xs text-slate-400">{new Date().toLocaleTimeString()}</div>
              </div>
              <div className="divide-y divide-slate-700/50">
                {output.split('\n\n').map((section, index) => renderOutputSection(section, index))}
              </div>
            </div>
          )}
          
          <HistoryPanel setCode={setCode} />
          
          <div className="rounded-lg border border-slate-700 bg-slate-800">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-sm font-medium text-white">Your Projects</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => handleSelectProject(project.id)}
                      className="flex items-center p-3 bg-slate-700/50 rounded-md hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                      role="button"
                      tabIndex={0}
                      aria-label={`Select project: ${project.name}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-200">{project.name}</span>
                        <p className="text-xs text-slate-400">{project.description}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-400 mb-4">No projects yet</p>
                    <button
                      onClick={handleCreateNewProject}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      aria-label="Create new project"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create New Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {showProjectModal && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
            >
              <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 id="project-modal-title" className="text-xl font-semibold mb-4 text-white">Select a Project</h2>
                <div className="space-y-2 mb-4">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleSelectProject(project.id)}
                        className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-200"
                        aria-label={`Select project: ${project.name}`}
                      >
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-slate-400">{project.description}</div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-slate-400">No projects available</p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCreateNewProject}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    aria-label="Create new project"
                  >
                    Create New Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}