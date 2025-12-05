import type { Conversation } from '@/types'

const STORAGE_KEY = 'realtime-ai-chat-conversations'

export function saveConversations(conversations: Conversation[]): void {
  try {
    const serialized = JSON.stringify(conversations, (key, value) => {
      if (key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') {
        return value instanceof Date ? value.toISOString() : value
      }
      return value
    })
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save conversations to localStorage:', error)
    // Handle quota exceeded or other storage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Try to clear old conversations or notify user
      console.warn('Storage quota exceeded. Consider clearing old conversations.')
    }
  }
}

export function loadConversations(): Conversation[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) return []

    const parsed = JSON.parse(serialized)
    return parsed.map((conv: any) => ({
      ...conv,
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
    }))
  } catch (error) {
    console.error('Failed to load conversations from localStorage:', error)
    return []
  }
}

export function clearConversations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear conversations from localStorage:', error)
  }
}

