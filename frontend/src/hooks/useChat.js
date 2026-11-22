import { useChatContext } from '../context/ChatContext';

/**
 * Convenience hook to access chat context
 */
export const useChat = () => {
  return useChatContext();
};
