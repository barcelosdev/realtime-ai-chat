import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chatStore'

export function NewChatButton() {
  const createConversation = useChatStore((state) => state.createConversation)
  const setActiveConversation = useChatStore((state) => state.setActiveConversation)

  const handleNewChat = () => {
    const newId = createConversation()
    setActiveConversation(newId)
  }

  return (
    <Button
      onClick={handleNewChat}
      className="w-full justify-start gap-2"
      variant="outline"
    >
      <Plus className="h-4 w-4" />
      New Chat
    </Button>
  )
}

