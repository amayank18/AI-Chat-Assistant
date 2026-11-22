import React from 'react';
import { Bot, Sparkles, MessageSquarePlus } from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '../../utils/constants';
import { useChat } from '../../hooks/useChat';

export const EmptyState = () => {
  const { sendMessage } = useChat();

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-6">
        <Bot className="w-9 h-9 text-white" />
      </div>

      <h2 className="text-2xl font-bold text-neutral-100 mb-2">
        How can I help you today?
      </h2>
      <p className="text-sm text-neutral-400 max-w-md mb-8">
        Ask anything, generate code, analyze problems, or brainstorm creative ideas with your AI Assistant.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(item.prompt)}
            className="text-left p-3.5 rounded-xl border border-neutral-800 bg-neutral-800/40 hover:bg-neutral-800 hover:border-neutral-700 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{item.category}</span>
            </div>
            <div className="text-sm text-neutral-200 group-hover:text-white font-medium line-clamp-2">
              {item.title}
            </div>
            <div className="text-xs text-neutral-400 mt-1 line-clamp-1">
              "{item.prompt}"
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
