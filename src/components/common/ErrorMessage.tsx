import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={cn('flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4', className)}>
      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-destructive">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}

