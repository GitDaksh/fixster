"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import PageLayout from "../components/PageLayout";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Play, Save, FileCode, Settings, Terminal, X, ChevronDown, ChevronUp } from "lucide-react";

// Define a type for the editor instance
type MonacoEditor = Parameters<NonNullable<Parameters<typeof Editor>[0]["onMount"]>>[0];

export default function EditorPage() {
  const router = useRouter();
  const { user } = useUser();
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [outputHeight, setOutputHeight] = useState(200);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const editorRef = useRef<MonacoEditor | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileExtensions = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    cpp: "cpp"
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    
    try {
      const response = await fetch("/api/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      setOutput(data.output || "No output");
    } catch (error) {
      setOutput("Error running code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    setFileName("");
    setShowSaveModal(true);
  };

  const handleDownload = () => {
    if (!fileName.trim()) return;
    
    const extension = fileExtensions[language];
    const fullFilename = fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFilename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setShowSaveModal(false);
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      {/* Top Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-800 flex items-center justify-between px-4 rounded-t-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileCode className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-white">Code Editor</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveCode}
            className="flex items-center px-3 py-1.5 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4 mr-1.5" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-[calc(100vh-250px)] bg-slate-800 rounded-b-lg overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output Panel */}
        <div 
          className="border-t border-slate-700 bg-slate-900 flex flex-col"
          style={{ height: outputHeight }}
        >
          <div className="h-10 border-b border-slate-700 flex items-center justify-between px-4">
            <div className="flex items-center">
              <Terminal className="h-4 w-4 text-slate-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">Output</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setOutputHeight(prev => prev === 200 ? 400 : 200)}
                className="text-slate-400 hover:text-slate-300"
              >
                {outputHeight === 200 ? "Expand" : "Collapse"}
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
              {output ? (
                <div className="space-y-6">
                  <div className="bg-slate-800/40 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 px-4 py-3 border-b border-slate-700">
                      <h3 className="text-slate-100 font-semibold text-base">Output</h3>
                    </div>
                    <div className="p-4">
                      <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">{output}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 italic">
                  No output yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Save File</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="filename" className="block text-sm font-medium text-slate-300 mb-1">
                    Filename
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="filename"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder={`Enter filename (e.g., main.${fileExtensions[language]})`}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  File will be saved with .{fileExtensions[language]} extension if not specified
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-700/50 flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={!fileName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
} 