# Prompt for Cursor — Front-End Implementation (React + Vite + TypeScript + Zustand + Tailwind)

**Prompt:**  
Create the complete front-end implementation for a Real-Time AI Chat Platform. The goal is to build a clean, modern, and production-ready React application that streams LLM responses in real time (similar to ChatGPT). Follow the requirements below:

### Project Requirements
- Use **React** with **Vite**.
- Use **Zustand** for global state management.
- Use **TailwindCSS** for styling.
- Implement **WebSockets** or **Server-Sent Events (SSE)** to display streaming LLM responses in real time.
- Build a clean and minimal UI inspired by ChatGPT usind shadcn library.
- Create reusable components and a scalable folder structure.
- Apply DRY principle.
- Apply React's best practices such as memoization, hooks and state management good practices.
- Include typing animation, auto-scroll, and a “Stop generating” button.
- Add loading states, error states, retry button, and message grouping (user/assistant).
- Messages must support **Markdown rendering** (code blocks included).
- Add model selector (dropdown) at the top of the screen.
- Create a left sidebar with conversation history.
- Users can start new chats, rename chats, or delete them.
- Save conversations locally via **localStorage** (or IndexedDB if needed).
- Use TypeScript everywhere.

### Architecture Guidelines
The final Markdown file must include:

1. **Project folder structure**
2. **All React components**, including:
   - `ChatPage`
   - `MessageList`
   - `MessageBubble`
   - `Sidebar`
   - `Header`
   - `ModelSelector`
3. **Zustand store** for chat state
4. **Utility functions**, including:
   - SSE client wrapper
   - Markdown renderer setup
   - Auto-scroll helper
5. **CSS/Tailwind config** (only the necessary parts)
6. **Example `.env` variables** (client-side)
7. **Full code examples** for each file in fenced code blocks  
   (e.g., ```tsx … ```)

### Streaming Requirements
- Connect to a backend endpoint called `/api/chat/stream`.
- Stream partial tokens as they arrive.
- Append tokens to the assistant message in real time.
- Support:
  - cancel streaming  
  - retry last message  
  - loading skeleton bubbles

### Writing Requirements
- Organize the content with clear headings and code blocks.
- Make the project functional and realistic, not a toy example.
- Do **not** include backend code—front-end only.
