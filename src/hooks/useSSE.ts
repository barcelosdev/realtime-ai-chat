import { useEffect, useRef } from 'react'
import { useChatStore } from '@/store/chatStore'
import { SSEClient } from '@/utils/sseClient'
import type { Message } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export function useSSE() {
  const sseClientRef = useRef<SSEClient | null>(null)
  const {
    activeConversationId,
    selectedModel,
    updateStreamingMessage,
    finishStreaming,
    startStreaming,
    stopStreaming,
    addMessage,
    isStreaming,
  } = useChatStore()

  const sendMessage = async (content: string) => {
    if (!activeConversationId) return

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    addMessage(activeConversationId, userMessage)

    // Get conversation messages for context
    const conversations = useChatStore.getState().conversations
    const conversation = conversations.find((c) => c.id === activeConversationId)
    if (!conversation) return

    // Prepare messages for API (exclude streaming flag)
    const messagesForAPI = conversation.messages
      .filter((msg) => !msg.isStreaming)
      .map(({ id, role, content, timestamp, isStreaming, ...rest }) => ({
        role,
        content,
      }))

    // Add the new user message
    messagesForAPI.push({ role: 'user', content })

    // Create abort controller
    const abortController = new AbortController()
    startStreaming(abortController)

    // Build SSE URL
    const url = `${API_BASE_URL}/api/chat/stream`

    // Create SSE client
    const sseClient = new SSEClient()
    sseClientRef.current = sseClient

    let accumulatedContent = ''

    sseClient.connect({
      url,
      method: 'POST',
      body: {
        model: selectedModel.id,
        messages: messagesForAPI,
      },
      signal: abortController.signal,
      onMessage: (data: string) => {
        accumulatedContent += data
        updateStreamingMessage(activeConversationId, accumulatedContent)
      },
      onError: (error: Error) => {
        console.error('SSE error:', error)
        stopStreaming()
        finishStreaming(activeConversationId)
      },
      onComplete: () => {
        finishStreaming(activeConversationId)
        sseClientRef.current = null
      },
    })
  }

  const cancelStreaming = () => {
    if (sseClientRef.current) {
      sseClientRef.current.disconnect()
      sseClientRef.current = null
    }
    stopStreaming()
    if (activeConversationId) {
      finishStreaming(activeConversationId)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sseClientRef.current) {
        sseClientRef.current.disconnect()
      }
    }
  }, [])

  return {
    sendMessage,
    cancelStreaming,
    isStreaming,
  }
}

