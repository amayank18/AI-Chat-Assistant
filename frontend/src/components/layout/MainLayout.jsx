import React, { useState } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { Header } from './Header';
import { ChatContainer } from '../chat/ChatContainer';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 min-h-0 relative">
          <ChatContainer />
        </main>
      </div>
    </div>
  );
};
