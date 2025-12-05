import { useState } from 'react'
import { Edit2, Trash2, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { useChatStore } from '@/store/chatStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'
import type { Conversation } from '@/types'

interface ConversationItemProps {
  conversation: Conversation
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(conversation.title)
  const { activeConversationId, setActiveConversation, deleteConversation, renameConversation } = useChatStore()

  const isActive = activeConversationId === conversation.id

  const handleClick = () => {
    if (!isEditing) {
      setActiveConversation(conversation.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditValue(conversation.title)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (editValue.trim()) {
      renameConversation(conversation.id, editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditValue(conversation.title)
    setIsEditing(false)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(conversation.id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors',
        isActive && 'bg-accent'
      )}
    >
      {isEditing ? (
        <>
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave(e as any)
              } else if (e.key === 'Escape') {
                handleCancel(e as any)
              }
            }}
            className="h-8 flex-1"
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{conversation.title}</p>
            <p className="text-xs text-muted-foreground">
              {format(conversation.updatedAt, 'MMM d, HH:mm')}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

