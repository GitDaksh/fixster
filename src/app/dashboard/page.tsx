"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HistoryPanel from "../components/HistoryPanel";
import ReactMarkdown from 'react-markdown';
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
    if (user) {
      const savedHistory = JSON.parse(localStorage.getItem("fixster_history") || "[]");
      setHistory(savedHistory);
      
      // Load user's projects
      const userProjects = getUserProjects(user.id);
      setProjects(userProjects);
      
      // Check if a project is selected
      const activeProject = localStorage.getItem("activeProject");
      if (!activeProject) {
        setShowProjectModal(true);
      }
    }
  }, [user]);
  
  const saveToHistory = (newEntry: string) => {
    const updatedHistory = [newEntry, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem("fixster_history", JSON.stringify(updatedHistory));
  };
  
  const handleAnalyze = async () => {
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
      const data = await response.json();
      setOutput(data.output || "No useful output. Please check your code.");
      saveToHistory(code);
    } catch {
      setOutput("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCreateNewProject = () => {
    router.push("/new-project");
  };

  const handleSelectProject = (projectId: string) => {
    localStorage.setItem("activeProject", projectId);
    setShowProjectModal(false);
    // Dispatch custom event to notify components of project change
    window.dispatchEvent(new Event("projectChanged"));
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
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Project
              </button>
            </div>
          </div>
          
          <div className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">code.js</span>
            </div>
            <textarea
              className="w-full p-4 bg-white dark:bg-slate-800 border-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none resize-none text-sm font-mono h-64 text-slate-800 dark:text-slate-200"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>
          
          <button
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-[1.02] hover:bg-blue-700 hover:shadow-lg cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-none relative"
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
          >
            <span className="flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Code...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Analyze Code
                </>
              )}
            </span>
          </button>
          
          {output && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                <h2 className="text-sm font-medium text-slate-900 dark:text-white">Analysis Results</h2>
              </div>
              <div className="p-4">
                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                  <div className="space-y-4">
                    {output.includes('# ') ? (
                      // Formatted output with sections
                      output.split('\n\n').map((section, index) => {
                        const lines = section.split('\n');
                        const title = lines.find(line => line.startsWith('#'));
                        const content = lines.filter(line => !line.startsWith('#'));
                        
                        if (!title) {
                          // Handle sections without titles
                          return (
                            <div key={index} className="bg-slate-800/40 rounded-lg p-4">
                              {lines.map((line, lineIndex) => (
                                <p key={lineIndex} className="text-slate-300 my-1">
                                  {line}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        
                        return (
                          <div key={index} className="rounded-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 px-4 py-3 border-b border-slate-700">
                              <h3 className="text-slate-100 font-semibold text-base">
                                {title.replace(/^#+\s*/, '')}
                              </h3>
                            </div>
                            <div className="bg-slate-800/40 p-4 space-y-2">
                              {content.map((line, lineIndex) => {
                                if (line.startsWith('```')) {
                                  return (
                                    <pre key={lineIndex} className="bg-slate-800/60 p-3 rounded-md overflow-x-auto">
                                      <code className="text-sm font-mono text-slate-300">{line.replace(/```/g, '')}</code>
                                    </pre>
                                  );
                                }
                                if (line.startsWith('- ')) {
                                  return (
                                    <div key={lineIndex} className="flex items-start space-x-2">
                                      <span className="text-slate-400 mt-0.5">•</span>
                                      <span className="text-slate-300 flex-1">{line.replace(/^-\s*/, '')}</span>
                                    </div>
                                  );
                                }
                                if (line.trim()) {
                                  return (
                                    <p key={lineIndex} className="text-slate-300">
                                      {line}
                                    </p>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Plain text output
                      <div className="bg-slate-800/40 rounded-lg p-4">
                        <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
                          {output}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <HistoryPanel setCode={setCode} />
          
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-sm font-medium text-slate-900 dark:text-white">Your Projects</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => handleSelectProject(project.id)}
                      className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                    >
                      <div className={`w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{project.name}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{project.description}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No projects yet</p>
                    <button
                      onClick={handleCreateNewProject}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold mb-4">Select a Project</h2>
                <div className="space-y-2 mb-4">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleSelectProject(project.id)}
                        className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-slate-500">{project.description}</div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-slate-500">No projects available</p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCreateNewProject}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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