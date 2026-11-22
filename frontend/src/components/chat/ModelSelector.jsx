import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Check } from 'lucide-react';
import { MODELS } from '../../utils/constants';
import { useChat } from '../../hooks/useChat';

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel, isStreaming } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const current = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isStreaming && setIsOpen(!isOpen)}
        disabled={isStreaming}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
          isStreaming
            ? 'opacity-60 cursor-not-allowed border-neutral-700 bg-neutral-800 text-neutral-400'
            : 'border-neutral-700/80 bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 hover:border-neutral-600'
        }`}
      >
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>{current.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-neutral-900 border border-neutral-700/90 rounded-xl shadow-2xl py-1.5 z-50">
          <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Select Gemini Model
          </div>
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                setSelectedModel(model.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm flex items-start justify-between hover:bg-neutral-800 transition-colors"
            >
              <div>
                <div className="font-medium text-neutral-200">{model.name}</div>
                <div className="text-xs text-neutral-400">{model.description}</div>
              </div>
              {selectedModel === model.id && (
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
