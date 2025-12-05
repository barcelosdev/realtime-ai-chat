import { Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StopButtonProps {
  onStop: () => void
}

export function StopButton({ onStop }: StopButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onStop}
      className="gap-2"
    >
      <Square className="h-4 w-4" />
      Stop generating
    </Button>
  )
}

