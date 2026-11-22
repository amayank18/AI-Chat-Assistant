const API_BASE = '/api';

/**
 * API service helper functions
 */
export const api = {
  // Fetch all conversations
  async getConversations() {
    const res = await fetch(`${API_BASE}/conversations`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    const json = await res.json();
    return json.data || [];
  },

  // Fetch single conversation with messages
  async getConversation(id) {
    const res = await fetch(`${API_BASE}/conversations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch conversation');
    const json = await res.json();
    return json.data;
  },

  // Create a new conversation
  async createConversation(data = {}) {
    const res = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create conversation');
    const json = await res.json();
    return json.data;
  },

  // Delete a conversation
  async deleteConversation(id) {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete conversation');
    return res.json();
  },

  // Clear all conversations
  async clearAllConversations() {
    const res = await fetch(`${API_BASE}/conversations`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear conversations');
    return res.json();
  },

  // Fetch available AI models
  async getModels() {
    const res = await fetch(`${API_BASE}/chat/models`);
    if (!res.ok) throw new Error('Failed to fetch models');
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Stream a chat response using Server-Sent Events (SSE)
   */
  async streamChat({
    conversationId,
    message,
    model,
    systemPrompt,
    onMeta,
    onToken,
    onDone,
    onError,
    signal,
  }) {
    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ conversationId, message, model, systemPrompt }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (!dataStr) continue;

            try {
              const event = JSON.parse(dataStr);
              if (event.type === 'meta') {
                onMeta?.(event);
              } else if (event.type === 'token') {
                onToken?.(event.token);
              } else if (event.type === 'done') {
                onDone?.(event.assistantMessage);
              } else if (event.type === 'error') {
                onError?.(new Error(event.error));
              }
            } catch (err) {
              console.warn('[SSE Parse Warning]:', err, dataStr);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[Stream Aborted by User]');
      } else {
        onError?.(error);
      }
    }
  },
};
