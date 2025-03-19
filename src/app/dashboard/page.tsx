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
    <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fixster - AI Code Debugger
            </h1>
            <ThemeToggle />
          </div>
          
          <div className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-xl">
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">code.js</span>
            </div>
            <textarea
              className="w-full p-5 bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none resize-none text-sm font-mono h-64 text-slate-800 dark:text-slate-200"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>
          
          <button
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </div>
            ) : "Analyze Code"}
          </button>
          
          {output && (
            <div className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-xl">
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Analysis Results</h2>
              </div>
              <div className="p-5">
                <div className="prose prose-slate dark:prose-invert prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-headings:border-b prose-headings:border-slate-200 dark:prose-headings:border-slate-700 prose-headings:pb-2 prose-headings:mb-4 prose-h2:text-lg prose-h2:font-semibold prose-headings:text-slate-800 dark:prose-headings:text-white max-w-none">
                  <ReactMarkdown>
                    {output}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          
          <HistoryPanel history={history} setCode={setCode} />
          
          <div className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-xl">
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Projects</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {[
                  { name: 'React Todo App', color: 'bg-green-500' },
                  { name: 'Node.js API', color: 'bg-blue-500' },
                  { name: 'Python Flask Backend', color: 'bg-purple-500' }
                ].map((project, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200 group"
                  >
                    <div className={`w-3 h-3 rounded-full mr-3 ${project.color}`}></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{project.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-6">
            Powered by Gemini • Built with Next.js & Tailwind CSS
          </div>
        </div>
      </div>
    </div>
  );
}