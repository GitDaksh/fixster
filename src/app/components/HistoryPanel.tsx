import React from "react";
import { Clock, ArrowUpRight } from "lucide-react";

interface HistoryPanelProps {
  history: string[];
  setCode: (code: string) => void;
}

export default function HistoryPanel({ history, setCode }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-xl">
      <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center">
        <Clock className="h-4 w-4 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent History</h2>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {history.map((item, index) => (
            <div 
              key={index}
              className="group cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg p-3 transition-all duration-200"
              onClick={() => setCode(item)}
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm text-slate-700 dark:text-slate-300 truncate flex-1">
                  {item.length > 50 ? `${item.substring(0, 50)}...` : item}
                </div>
                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowUpRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}