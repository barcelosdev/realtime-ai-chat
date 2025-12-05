import { ModelSelector } from './ModelSelector'

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between px-4 h-14">
        <h1 className="text-lg font-semibold">AI Chat</h1>
        <ModelSelector />
      </div>
    </header>
  )
}

