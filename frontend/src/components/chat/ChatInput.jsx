import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

export const ChatInput = () => {
  const { sendMessage, isStreaming, stopGeneration } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea according to input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    sendMessage(input);
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 md:pb-6">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-[#2f2f2f] rounded-2xl border border-neutral-700/80 shadow-lg px-3 py-2.5 focus-within:border-emerald-500/80 transition-colors"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Gemini Assistant... (Shift+Enter for newline)"
          rows={1}
          className="flex-1 bg-transparent text-sm md:text-base text-neutral-100 placeholder-neutral-400 focus:outline-none resize-none max-h-48 py-1.5 px-2"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={stopGeneration}
            className="p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-neutral-200 transition-colors shrink-0"
            title="Stop generating"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2 rounded-xl transition-all shrink-0 ${
              input.trim()
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
      <div className="text-center mt-2 text-[11px] text-neutral-500">
        Gemini may provide inaccurate responses. Verify critical information.
      </div>
    </div>
  );
};
