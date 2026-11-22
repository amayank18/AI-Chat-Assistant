import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';

export const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all ${
        isActive
          ? 'bg-neutral-800 text-white font-medium shadow-sm'
          : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
      }`}
    >
      <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-neutral-400 group-hover:text-neutral-300'}`} />
      
      <span className="truncate flex-1 pr-6">{conversation.title || 'Untitled Conversation'}</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(conversation._id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-700/60 transition-all absolute right-2"
        title="Delete chat"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
