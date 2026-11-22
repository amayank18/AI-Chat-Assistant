import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { DEFAULT_MODEL } from '../utils/constants';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const charQueueRef = useRef([]);
  const typingTimerRef = useRef(null);
  const streamFinishedRef = useRef(false);
  const pendingAssistantMsgRef = useRef(null);
  const displayedContentRef = useRef('');

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  // When active conversation changes, fetch its messages
  useEffect(() => {
    if (activeConversationId) {
      loadConversationMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
    } catch (err) {
      console.warn('Could not load conversations:', err.message);
    }
  };

  const loadConversationMessages = async (id) => {
    try {
      setIsLoading(true);
      const data = await api.getConversation(id);
      if (data && data.messages) {
        setMessages(data.messages);
        if (data.conversation?.model) {
          setSelectedModel(data.conversation.model);
        }
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load conversation history');
    } finally {
      setIsLoading(false);
    }
  };

  const clearTypingTimer = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const startNewChat = () => {
    if (isStreaming) {
      stopGeneration();
    }
    setActiveConversationId(null);
    setMessages([]);
    setStreamingContent('');
    setError(null);
  };

  const selectConversation = (id) => {
    if (activeConversationId === id) return;
    if (isStreaming) {
      stopGeneration();
    }
    setActiveConversationId(id);
    setStreamingContent('');
    setError(null);
  };

  const removeConversation = async (id) => {
    try {
      await api.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeConversationId === id) {
        startNewChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Failed to delete conversation');
    }
  };

  const clearAllChats = async () => {
    try {
      await api.clearAllConversations();
      setConversations([]);
      startNewChat();
    } catch (err) {
      console.error('Failed to clear conversations:', err);
      setError('Failed to clear conversations');
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearTypingTimer();
    charQueueRef.current = [];

    const finalContent = displayedContentRef.current;
    if (finalContent) {
      setMessages((prev) => [
        ...prev,
        {
          _id: `msg-${Date.now()}`,
          role: 'assistant',
          content: finalContent,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    setIsStreaming(false);
    setStreamingContent('');
    displayedContentRef.current = '';
  };

  /**
   * Start character-by-character typewriter loop
   */
  const startTypewriterLoop = (onComplete) => {
    clearTypingTimer();

    typingTimerRef.current = setInterval(() => {
      if (charQueueRef.current.length > 0) {
        // Adaptive speed: type 1 char per tick normally, scale up if queue is large
        const queueLen = charQueueRef.current.length;
        const charsPerTick = queueLen > 80 ? 4 : queueLen > 30 ? 2 : 1;

        const nextBatch = charQueueRef.current.splice(0, charsPerTick).join('');
        displayedContentRef.current += nextBatch;
        setStreamingContent(displayedContentRef.current);
      } else if (streamFinishedRef.current) {
        // Finished receiving and finished typing out all characters
        clearTypingTimer();
        onComplete(displayedContentRef.current);
      }
    }, 18); // ~18ms per character gives smooth, realistic real-time typing
  };

  const sendMessage = async (content) => {
    if (!content.trim() || isStreaming) return;

    setError(null);
    setIsStreaming(true);
    setStreamingContent('');

    // Reset typewriter references
    displayedContentRef.current = '';
    charQueueRef.current = [];
    streamFinishedRef.current = false;
    pendingAssistantMsgRef.current = null;

    // Create optimistic user message
    const tempUserMessage = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    abortControllerRef.current = new AbortController();

    // Start typewriter effect
    startTypewriterLoop((finalContent) => {
      setIsStreaming(false);
      setStreamingContent('');
      displayedContentRef.current = '';

      setMessages((prev) => [
        ...prev,
        pendingAssistantMsgRef.current || {
          _id: `msg-${Date.now()}`,
          role: 'assistant',
          content: finalContent,
          createdAt: new Date().toISOString(),
        },
      ]);

      loadConversations();
    });

    await api.streamChat({
      conversationId: activeConversationId,
      message: content.trim(),
      model: selectedModel,
      signal: abortControllerRef.current.signal,
      onMeta: (event) => {
        if (!activeConversationId && event.conversation?.id) {
          setActiveConversationId(event.conversation.id);
          setConversations((prev) => [
            {
              _id: event.conversation.id,
              title: event.conversation.title,
              model: event.conversation.model,
              updatedAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
      },
      onToken: (token) => {
        // Enqueue characters for character-by-character animation
        const chars = token.split('');
        charQueueRef.current.push(...chars);
      },
      onDone: (assistantMsg) => {
        pendingAssistantMsgRef.current = assistantMsg;
        streamFinishedRef.current = true;
      },
      onError: (err) => {
        clearTypingTimer();
        charQueueRef.current = [];
        setIsStreaming(false);
        setStreamingContent('');
        setError(err.message || 'Error occurred while generating response');
      },
    });
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        messages,
        selectedModel,
        setSelectedModel,
        isLoading,
        isStreaming,
        streamingContent,
        error,
        sendMessage,
        startNewChat,
        selectConversation,
        removeConversation,
        clearAllChats,
        stopGeneration,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
