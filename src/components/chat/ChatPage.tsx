import { useSSE } from '@/hooks/useSSE'
import { useChatStore } from '@/store/chatStore'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { StopButton } from './StopButton'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

export function ChatPage() {
  const { sendMessage, cancelStreaming, isStreaming } = useSSE()
  const { activeConversationId, retryLastMessage, conversations } = useChatStore()

  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const canRetry = activeConversation && activeConversation.messages.length > 0 && !isStreaming

  const handleSend = (content: string) => {
    if (!activeConversationId) {
      const newId = useChatStore.getState().createConversation()
      // Wait a bit for the store to update, then send
      setTimeout(() => {
        sendMessage(content)
      }, 0)
    } else {
      sendMessage(content)
    }
  }

  const handleRetry = () => {
    if (!activeConversationId || !activeConversation) return
    
    // Get the last user message
    const lastUserMessage = [...activeConversation.messages]
      .reverse()
      .find((msg) => msg.role === 'user')
    
    if (lastUserMessage) {
      retryLastMessage(activeConversationId)
      // Wait a bit for the store to update, then resend
      setTimeout(() => {
        sendMessage(lastUserMessage.content)
      }, 100)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <MessageList />
      </div>
      <div className="border-t bg-background">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex justify-center gap-2">
            {isStreaming && (
              <StopButton onStop={cancelStreaming} />
            )}
            {canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        </div>
        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  )
}

