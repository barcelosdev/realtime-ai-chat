export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Model {
  id: string
  name: string
  description?: string
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  selectedModel: Model
  isStreaming: boolean
  abortController: AbortController | null
}

