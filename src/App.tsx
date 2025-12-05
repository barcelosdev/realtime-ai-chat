import { Header } from '@/components/header/Header'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { ChatPage } from '@/components/chat/ChatPage'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function App() {
  useLocalStorage()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <ChatPage />
      </div>
    </div>
  )
}

export default App

