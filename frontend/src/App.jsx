import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <ChatProvider>
      <MainLayout />
    </ChatProvider>
  );
}

export default App;
