"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import HistoryPanel from "../components/HistoryPanel";
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("fixster_history") || "[]");
    setHistory(savedHistory);
  }, []);
  
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
  
  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fixster
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered code debugging assistant</p>
            </div>
            <ThemeToggle />
          </div>
          
          <div className="rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white dark:bg-slate-800 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="px-5 py-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors duration-200"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors duration-200"></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-md">code.js</span>
            </div>
            <textarea
              className="w-full p-6 bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none resize-none text-sm font-mono h-64 text-slate-800 dark:text-slate-200 transition-all duration-200"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>
          
          <button
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none relative overflow-hidden group cursor-pointer"
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
          >
            <span className="absolute inset-0 overflow-hidden rounded-xl">
              <span className="absolute inset-0 bg-white/20 transform origin-center scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 rounded-full group-active:scale-100 group-active:opacity-100"></span>
            </span>
            
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
            
            <span className="relative flex items-center justify-center">
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="relative z-10">Analyzing Code...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="relative z-10">Analyze Code</span>
                </div>
              )}
            </span>
          </button>
          
          {output && (
            <div className="rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white dark:bg-slate-800 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
              <div className="px-5 py-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700 flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Analysis Results</h2>
              </div>
              <div className="p-6">
                <div className="prose prose-slate dark:prose-invert prose-code:bg-slate-100 dark:prose-code:bg-slate-700 prose-code:text-slate-800 dark:prose-code:text-slate-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-headings:border-b prose-headings:border-slate-200 dark:prose-headings:border-slate-700 prose-headings:pb-2 prose-headings:mb-4 prose-h2:text-xl prose-h2:font-semibold prose-headings:text-slate-800 dark:prose-headings:text-white max-w-none">
                  <ReactMarkdown>
                    {output}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          
          <HistoryPanel history={history} setCode={setCode} />
          
          <div className="rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white dark:bg-slate-800 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="px-5 py-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Projects</h2>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {[
                  { name: 'React Todo App', color: 'bg-green-500', icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4" },
                  { name: 'Node.js API', color: 'bg-blue-500', icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
                  { name: 'Python Flask Backend', color: 'bg-purple-500', icon: "M5 12h14M12 5l7 7-7 7" }
                ].map((project, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer transition-all duration-200 group transform hover:scale-102 hover:shadow-md"
                  >
                    <div className={`w-10 h-10 rounded-full ${project.color} flex items-center justify-center text-white mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={project.icon} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{project.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last updated 2 days ago</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-6">
            <p>Powered by Gemini • Built with Next.js & Tailwind CSS</p>
            <p className="mt-1">© 2025 Fixster • All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}