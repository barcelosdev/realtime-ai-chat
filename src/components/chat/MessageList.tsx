import { useMemo } from 'react'
import { useChatStore } from '@/store/chatStore'
import { MessageBubble } from './MessageBubble'
import { MessageSkeleton } from '@/components/common/LoadingSkeleton'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MessageList() {
  const { activeConversationId, conversations, isStreaming } = useChatStore()
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId]
  )

  const { scrollRef } = useAutoScroll([
    activeConversation?.messages.length,
    isStreaming,
  ])

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No conversation selected</p>
          <p className="text-sm text-muted-foreground">
            Start a new chat to begin
          </p>
        </div>
      </div>
    )
  }

  if (activeConversation.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Start a conversation</p>
          <p className="text-sm text-muted-foreground">
            Type a message below to begin chatting
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="max-w-3xl mx-auto">
        {activeConversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isStreaming && <MessageSkeleton />}
      </div>
    </ScrollArea>
  )
}

