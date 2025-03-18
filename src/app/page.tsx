"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const handleAnalyze = () => {
    setOutput(`Analyzing: ${code}`);
    // Here we'll later add API integration with OpenAI
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Fixster - AI Code Debugger</h1>
      <textarea
        className="w-full max-w-lg p-4 bg-gray-800 border border-gray-600 rounded-md"
        rows={6}
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <button
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold"
        onClick={handleAnalyze}
      >
        Analyze Code
      </button>
      {output && (
        <div className="w-full max-w-lg p-4 bg-gray-800 border border-gray-600 rounded-md">
          {output}
        </div>
      )}
    </div>
  );
}
