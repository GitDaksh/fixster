"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = { text: data.output || "No response from server.", sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { text: "Error processing request. Please try again.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-5xl mx-auto flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg max-w-2xl whitespace-pre-line break-words ${
                msg.sender === "user" ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="mr-auto p-4 bg-gray-300 text-black dark:bg-gray-700 dark:text-white rounded-lg max-w-2xl">Processing...</div>}
        </div>
      </div>
      <div className="mt-6 w-full max-w-5xl mx-auto flex items-center bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
          placeholder="Enter your code..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="ml-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          disabled={loading}
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}