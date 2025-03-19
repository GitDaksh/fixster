"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ArrowDown, Copy, Check } from "lucide-react";
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
  const [isCopied, setIsCopied] = useState<Record<number, boolean>>({});
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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setIsCopied({ ...isCopied, [index]: true });
    setTimeout(() => {
      setIsCopied({ ...isCopied, [index]: false });
    }, 2000);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`group relative max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.sender === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md"
                  }`}
                >
                  {msg.sender === "assistant" && (
                    <button
                      onClick={() => copyToClipboard(msg.text, index)}
                      className="absolute -right-3 -top-3 bg-white dark:bg-gray-700 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Copy message"
                    >
                      {isCopied[index] ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  )}
                  
                  {msg.sender === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  )}
                  
                  <div className={`text-xs mt-1 ${
                    msg.sender === "user" 
                      ? "text-blue-100" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {formatTimestamp(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 right-6 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-lg opacity-75 hover:opacity-100 transition-opacity"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full pl-4 pr-12 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden min-h-[40px] max-h-36"
              placeholder="Type your message..."
              rows={1}
              disabled={loading}
            ></textarea>
            <button
              onClick={sendMessage}
              className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}