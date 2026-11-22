import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot, Copy, Check } from 'lucide-react';

export const ChatMessage = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`py-6 px-4 md:px-6 w-full ${isUser ? 'bg-transparent' : 'bg-[#262626]/40'}`}>
      <div className="max-w-3xl mx-auto flex gap-4 md:gap-5 items-start">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
            isUser
              ? 'bg-neutral-700 text-neutral-200'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-neutral-200">
              {isUser ? 'You' : 'Assistant'}
            </span>
            {message.model && !isUser && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                {message.model}
              </span>
            )}
            {message.createdAt && (
              <span className="text-xs text-neutral-400 ml-auto">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <div className="text-neutral-200 text-sm md:text-base leading-relaxed markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  const codeId = Math.random().toString(36).substring(7);

                  return !inline ? (
                    <div className="relative group my-3 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900">
                      <div className="flex items-center justify-between px-3.5 py-1.5 bg-neutral-800/80 border-b border-neutral-700 text-xs font-mono text-neutral-400">
                        <span>{match ? match[1] : 'code'}</span>
                        <button
                          onClick={() => copyToClipboard(codeString, codeId)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          {copiedCode === codeId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 overflow-x-auto text-xs md:text-sm font-mono text-neutral-200">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className="px-1.5 py-0.5 rounded bg-neutral-800 text-emerald-300 font-mono text-xs md:text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-emerald-400 animate-pulse align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
