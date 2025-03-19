"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import Sidebar from "../components/Sidebar";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: Date }[]>([
    { 
      text: "Hi there! I'm your AI assistant. How can I help you today?", 
      sender: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 200;
      setShowScrollButton(isScrolledUp);
    };

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = '40px';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { text: input, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input }), 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      setTimeout(() => {
        const botMessage = { 
          text: data.output || "I'm sorry, I couldn't process that request. Please try again.", 
          sender: "assistant",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { 
        text: "I'm sorry, there was an error processing your request. Please try again later.", 
        sender: "assistant",
        timestamp: new Date()
      }]);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-4 px-6 shadow-md">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">AI Assistant Chat</h1>
        </div>
        
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-3 rounded-lg max-w-[75%] shadow-md ${
                msg.sender === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              }`}>
                {msg.sender === "assistant" ? (
                  <div className="prose dark:prose-invert">
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="max-w-3xl mx-auto flex items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-md">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 resize-none"
              placeholder="Type your message..."
              rows={1}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="ml-3 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
