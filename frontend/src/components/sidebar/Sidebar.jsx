import React from 'react';
import { Plus, Trash2, Bot, MessageSquare } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { ConversationItem } from './ConversationItem';

export const Sidebar = ({ isOpen, onClose }) => {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    removeConversation,
    startNewChat,
    clearAllChats,
  } = useChat();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#171717] border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* New Chat Button */}
        <div className="p-3 border-b border-neutral-800/80">
          <button
            onClick={() => {
              startNewChat();
              onClose?.();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-100 font-medium text-sm transition-all border border-neutral-700/60 hover:border-neutral-600 shadow-sm group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <span>New Chat</span>
            </div>
            <Plus className="w-4 h-4 text-neutral-400 group-hover:text-white" />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Recent Conversations
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-neutral-400 flex flex-col items-center">
              <MessageSquare className="w-6 h-6 mb-2 stroke-1 text-neutral-400" />
              <span>No conversations yet.</span>
              <span>Start a new chat to begin!</span>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv._id}
                conversation={conv}
                isActive={activeConversationId === conv._id}
                onSelect={() => {
                  selectConversation(conv._id);
                  onClose?.();
                }}
                onDelete={removeConversation}
              />
            ))
          )}
        </div>

        {/* Footer controls */}
        {conversations.length > 0 && (
          <div className="p-3 border-t border-neutral-800/80">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all chat history?')) {
                  clearAllChats();
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-800/50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all conversations</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
