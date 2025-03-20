"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Smile, Code, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebar from "../components/Sidebar";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getProject, addMessageToProject, ChatMessage as ProjectMessage } from "../services/projectService";

// Extend the ProjectMessage type but with a Date instead of number for timestamp
interface Message extends Omit<ProjectMessage, 'timestamp'> {
  timestamp: Date;
}

// Convert UI Message to Storage Message
const toStorageMessage = (message: Message): Omit<ProjectMessage, 'id'> => ({
  text: message.text,
  sender: message.sender,
  type: message.type,
  status: message.status,
  timestamp: message.timestamp.getTime()
});

export default function ChatPage() {
  const router = useRouter();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load project messages
  useEffect(() => {
    if (user) {
      const activeProjectId = localStorage.getItem("activeProject");
      if (!activeProjectId) {
        router.push("/");
        return;
      }

      const project = getProject(user.id, activeProjectId);
      if (!project) {
        router.push("/");
        return;
      }

      // Convert timestamps to Date objects
      const projectMessages = project.chatHistory.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      setMessages(projectMessages.length > 0 ? projectMessages : [{
        id: "1",
        text: "Hi there! I'm your AI assistant. How can I help you with this project?",
        sender: "assistant",
        timestamp: new Date(),
        type: "text",
        status: "sent"
      }]);
    }
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "40px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement voice recording stop logic here
  };

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    if (!user) return;

    const activeProjectId = localStorage.getItem("activeProject");
    if (!activeProjectId) {
      router.push("/");
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      status: "sending"
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setAttachments([]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          attachments: attachments.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
          }))
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Update the user message status and save to project
      const updatedUserMessage: Message = { ...newMessage, status: "sent" };
      await addMessageToProject(user.id, activeProjectId, toStorageMessage(updatedUserMessage));

      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? updatedUserMessage : msg
      ));

      // Add and save assistant's response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.output || "I'm sorry, I couldn't process that request. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
        type: "text",
        status: "sent"
      };

      await addMessageToProject(user.id, activeProjectId, toStorageMessage(botMessage));

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: "error" }
          : msg
      ));
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 px-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">AI Assistant</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Always here to help</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6 pb-4 pt-12">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative px-4 py-3 rounded-2xl max-w-[75%] ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {msg.sender === "assistant" && (
                      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Code className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className={msg.sender === "assistant" ? "ml-4" : ""}>
                      {msg.type === "code" ? (
                        <pre className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg overflow-x-auto">
                          <code>{msg.text}</code>
                        </pre>
                      ) : (
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-1 text-xs opacity-70 flex items-center justify-end space-x-1">
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.sender === "user" && (
                        <span>
                          {msg.status === "sending" && <Loader2 className="h-3 w-3 animate-spin" />}
                          {msg.status === "sent" && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>}
                          {msg.status === "error" && <svg className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 pb-4 pt-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end bg-slate-50 dark:bg-slate-800 rounded-xl shadow-sm">
              <div className="flex-1 flex items-end min-h-[44px]">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-slate-100 resize-none max-h-32 py-3 px-4"
                  placeholder="Type your message..."
                  rows={1}
                  disabled={isTyping}
                />
                <div className="flex items-center px-2 py-1 space-x-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-600/50 rounded-full transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="h-5 w-5 text-slate-500" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-600/50 rounded-full transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="h-5 w-5 text-slate-500" />
                  </button>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 hover:bg-slate-200/50 dark:hover:bg-slate-600/50 rounded-full transition-colors ${
                      isRecording ? "text-red-500" : "text-slate-500"
                    }`}
                    title={isRecording ? "Stop recording" : "Start recording"}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-600 mx-2" />
                  <button
                    onClick={sendMessage}
                    disabled={isTyping || (!input.trim() && attachments.length === 0)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors mr-2"
                    title="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
