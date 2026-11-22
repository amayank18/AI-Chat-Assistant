import React from 'react';
import { Menu, Bot, Plus } from 'lucide-react';
import { ModelSelector } from '../chat/ModelSelector';
import { useChat } from '../../hooks/useChat';

export const Header = ({ onToggleSidebar }) => {
  const { startNewChat } = useChat();

  return (
    <header className="h-14 border-b border-neutral-800 bg-[#212121] px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 md:hidden transition-colors"
          title="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-semibold text-neutral-100 text-sm hidden sm:inline">
            Gemini Assistant
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ModelSelector />
        <button
          onClick={startNewChat}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors hidden sm:flex"
          title="Start fresh conversation"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
