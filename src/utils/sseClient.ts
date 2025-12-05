export interface SSEOptions {
  onMessage: (data: string) => void
  onError?: (error: Error) => void
  onComplete?: () => void
  signal?: AbortSignal
}

export interface SSEConnectOptions extends SSEOptions {
  url: string
  method?: 'GET' | 'POST'
  body?: unknown
  headers?: Record<string, string>
}

export class SSEClient {
  private abortController: AbortController | null = null
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  async connect(options: SSEConnectOptions): Promise<void> {
    // Cancel any existing connection
    this.disconnect()

    // Create abort controller
    this.abortController = new AbortController()
    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        this.disconnect()
      })
    }

    try {
      const fetchOptions: RequestInit = {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...options.headers,
        },
        signal: this.abortController.signal,
      }

      if (options.body && options.method !== 'GET') {
        fetchOptions.body = JSON.stringify(options.body)
      }

      const response = await fetch(options.url, fetchOptions)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      const reader = response.body.getReader()
      this.reader = reader
      const decoder = new TextDecoder()

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          options.onComplete?.()
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') {
              options.onComplete?.()
              this.disconnect()
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                options.onMessage(parsed.content)
              }
              if (parsed.done) {
                options.onComplete?.()
                this.disconnect()
                return
              }
            } catch (error) {
              // If not JSON, treat as plain text content
              if (data) {
                options.onMessage(data)
              }
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Abort is expected, don't call onError
        return
      }
      const err = error instanceof Error ? error : new Error('Failed to create SSE connection')
      options.onError?.(err)
      this.disconnect()
    }
  }

  disconnect(): void {
    if (this.reader) {
      this.reader.cancel().catch(() => {
        // Ignore cancel errors
      })
      this.reader = null
    }
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  isConnected(): boolean {
    return this.reader !== null
  }
}

