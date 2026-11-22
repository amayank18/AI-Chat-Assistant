import React from 'react';
import { useChat } from '../../hooks/useChat';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { LoadingDots } from '../common/LoadingDots';
import { AlertCircle } from 'lucide-react';

export const ChatContainer = () => {
  const { messages, isStreaming, streamingContent, isLoading, error } = useChat();
  const scrollRef = useAutoScroll([messages, streamingContent, isLoading]);

  const hasMessages = messages.length > 0 || isStreaming;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#212121]">
      {/* Scrollable Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col min-h-full pb-4">
            {messages.map((message) => (
              <ChatMessage key={message._id || message.createdAt} message={message} />
            ))}

            {/* In-flight streaming response */}
            {isStreaming && (
              <ChatMessage
                message={{
                  role: 'assistant',
                  content: streamingContent,
                  createdAt: new Date().toISOString(),
                }}
                isStreaming={true}
              />
            )}

            {/* Waiting for first token */}
            {isStreaming && !streamingContent && (
              <div className="py-4 px-6 max-w-3xl mx-auto w-full flex gap-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <LoadingDots />
                </div>
                <span className="text-xs text-neutral-400">Thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="max-w-3xl mx-auto w-full px-4 mb-2">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs md:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Fixed Chat Input Area */}
      <ChatInput />
    </div>
  );
};
