import { create } from 'zustand'
import type { Conversation, Message, Model } from '@/types'
import { saveConversations, loadConversations } from '@/utils/storage'

const DEFAULT_MODELS: Model[] = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
  { id: 'claude-3', name: 'Claude 3', description: 'Anthropic\'s latest model' },
]

interface ChatStore {
  conversations: Conversation[]
  activeConversationId: string | null
  selectedModel: Model
  isStreaming: boolean
  abortController: AbortController | null

  // Actions
  initializeStore: () => void
  createConversation: () => string
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  setActiveConversation: (id: string | null) => void
  setSelectedModel: (model: Model) => void
  addMessage: (conversationId: string, message: Message) => void
  updateStreamingMessage: (conversationId: string, content: string) => void
  finishStreaming: (conversationId: string) => void
  startStreaming: (controller: AbortController) => void
  stopStreaming: () => void
  retryLastMessage: (conversationId: string) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  selectedModel: DEFAULT_MODELS[0],
  isStreaming: false,
  abortController: null,

  initializeStore: () => {
    const loaded = loadConversations()
    const defaultModel: Model = DEFAULT_MODELS[0]
    
    set({
      conversations: loaded,
      selectedModel: defaultModel,
    })

    // Set active conversation to the most recent one if available
    if (loaded.length > 0) {
      const mostRecent = loaded.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )[0]
      set({ activeConversationId: mostRecent.id })
    }
  },

  createConversation: () => {
    const newId = `conv-${Date.now()}`
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set((state) => {
      const updated = [newConversation, ...state.conversations]
      saveConversations(updated)
      return {
        conversations: updated,
        activeConversationId: newId,
      }
    })

    return newId
  },

  deleteConversation: (id: string) => {
    set((state) => {
      const updated = state.conversations.filter((conv) => conv.id !== id)
      saveConversations(updated)
      
      let newActiveId = state.activeConversationId
      if (newActiveId === id) {
        newActiveId = updated.length > 0 ? updated[0].id : null
      }

      return {
        conversations: updated,
        activeConversationId: newActiveId,
      }
    })
  },

  renameConversation: (id: string, title: string) => {
    set((state) => {
      const updated = state.conversations.map((conv) =>
        conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv
      )
      saveConversations(updated)
      return { conversations: updated }
    })
  },

  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id })
  },

  setSelectedModel: (model: Model) => {
    set({ selectedModel: model })
  },

  addMessage: (conversationId: string, message: Message) => {
    set((state) => {
      const updated = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, message]
          // Auto-generate title from first user message if title is "New Chat"
          let title = conv.title
          if (title === 'New Chat' && message.role === 'user') {
            title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
          }
          return {
            ...conv,
            messages: updatedMessages,
            title,
            updatedAt: new Date(),
          }
        }
        return conv
      })
      saveConversations(updated)
      return { conversations: updated }
    })
  },

  updateStreamingMessage: (conversationId: string, content: string) => {
    set((state) => {
      const updated = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const messages = [...conv.messages]
          const lastMessage = messages[messages.length - 1]
          
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
            messages[messages.length - 1] = {
              ...lastMessage,
              content,
            }
          } else {
            // Create new streaming message
            messages.push({
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content,
              timestamp: new Date(),
              isStreaming: true,
            })
          }

          return {
            ...conv,
            messages,
            updatedAt: new Date(),
          }
        }
        return conv
      })
      saveConversations(updated)
      return { conversations: updated }
    })
  },

  finishStreaming: (conversationId: string) => {
    set((state) => {
      const updated = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const messages = conv.messages.map((msg) =>
            msg.isStreaming ? { ...msg, isStreaming: false } : msg
          )
          return {
            ...conv,
            messages,
            updatedAt: new Date(),
          }
        }
        return conv
      })
      saveConversations(updated)
      return {
        conversations: updated,
        isStreaming: false,
        abortController: null,
      }
    })
  },

  startStreaming: (controller: AbortController) => {
    set({ isStreaming: true, abortController: controller })
  },

  stopStreaming: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
    }
    set({ isStreaming: false, abortController: null })
  },

  retryLastMessage: (conversationId: string) => {
    set((state) => {
      const conv = state.conversations.find((c) => c.id === conversationId)
      if (!conv || conv.messages.length === 0) return state

      // Remove last assistant message and last user message
      const messages = [...conv.messages]
      const lastUserIndex = messages.length - 1
      while (lastUserIndex >= 0 && messages[lastUserIndex].role !== 'user') {
        messages.pop()
      }
      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        messages.pop()
      }

      const updated = state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages,
              updatedAt: new Date(),
            }
          : c
      )
      saveConversations(updated)
      return { conversations: updated }
    })
  },
}))

