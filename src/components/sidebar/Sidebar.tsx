import { useChatStore } from '@/store/chatStore'
import { NewChatButton } from './NewChatButton'
import { ConversationItem } from './ConversationItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

export function Sidebar() {
  const conversations = useChatStore((state) => state.conversations)

  // Sort conversations by updatedAt (most recent first)
  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  )

  return (
    <div className="flex flex-col h-full w-64 border-r bg-background">
      <div className="p-4 border-b">
        <NewChatButton />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedConversations.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No conversations yet. Start a new chat to begin.
            </div>
          ) : (
            sortedConversations.map((conversation) => (
              <ConversationItem key={conversation.id} conversation={conversation} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

