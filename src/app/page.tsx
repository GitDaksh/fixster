"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setOutput("");
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.output) {
        setOutput(data.output);
      } else {
        setOutput("An error occurred. Please try again.");
      }
    } catch (error) {
      setOutput("Failed to analyze the code.");
    }
    setLoading(false);
  };

  const formatOutput = (text: string) => {
    if (!text) return "";
    
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
      .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-xl font-bold my-3">$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold my-2">$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3 class="text-md font-bold my-2">$1</h3>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-700 p-3 rounded-md my-2 overflow-x-auto"><code>$1</code></pre>');
    
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <svg className="w-8 h-8 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Fixster - AI Code Debugger
          </h1>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="flex space-x-1 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <h2 className="text-sm font-medium text-gray-400">Input your code</h2>
            </div>
            <textarea
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 font-mono"
              rows={8}
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            ></textarea>
          </div>
          
          <button
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-md font-medium text-white transition duration-200 ease-in-out transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            ) : (
              "Analyze Code"
            )}
          </button>
        </div>
        
        {output && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="text-lg font-bold text-gray-200">Analysis Results</h2>
            </div>
            <div 
              className="prose prose-invert max-w-none text-gray-300 font-mono"
              dangerouslySetInnerHTML={{ __html: formatOutput(output) }}
            ></div>
          </div>
        )}
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          Powered by Gemini AI • Created with Next.js and Tailwind CSS
        </div>
      </div>
    </div>
  );
}