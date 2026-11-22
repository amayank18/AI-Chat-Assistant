import { useEffect, useRef } from 'react';

/**
 * Custom hook to smoothly auto-scroll a container to bottom when content changes
 */
export const useAutoScroll = (dependencies = []) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, dependencies);

  return scrollRef;
};
