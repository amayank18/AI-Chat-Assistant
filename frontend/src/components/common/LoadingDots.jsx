import React from 'react';

export const LoadingDots = () => {
  return (
    <div className="flex items-center space-x-1.5 py-1">
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
    </div>
  );
};
