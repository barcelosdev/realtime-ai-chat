import { useEffect } from 'react'
import { useChatStore } from '@/store/chatStore'

export function useLocalStorage() {
  const initializeStore = useChatStore((state) => state.initializeStore)

  useEffect(() => {
    initializeStore()
  }, [initializeStore])
}

