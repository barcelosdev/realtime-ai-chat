import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { cn } from './cn'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeString = String(children).replace(/\n$/, '')
          
          if (match) {
            return (
              <code className={className} {...props}>
                {codeString}
              </code>
            )
          }
          return (
            <code className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm', className)} {...props}>
              {children}
            </code>
          )
        },
        pre({ children }) {
          // Extract code content from the pre element
          const extractCodeContent = (node: React.ReactNode): string => {
            if (typeof node === 'string') return node
            if (typeof node === 'number') return String(node)
            if (React.isValidElement(node)) {
              if (node.type === 'code') {
                return React.Children.toArray((node.props as any).children as React.ReactNode)
                  .map(extractCodeContent)
                  .join('')
              }
              return React.Children.toArray((node.props as any).children as React.ReactNode)
                .map(extractCodeContent)
                .join('')
            }
            if (Array.isArray(node)) {
              return node.map(extractCodeContent).join('')
            }
            return ''
          }
          
          const codeString = extractCodeContent(children)
          
          return (
            <div className="relative group my-4">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">{children}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(codeString)
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-background border border-border hover:bg-accent"
                title="Copy code"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          )
        },
        p({ children }) {
          return <p className="mb-4 last:mb-0">{children}</p>
        },
        ul({ children }) {
          return <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
        },
        li({ children }) {
          return <li className="ml-4">{children}</li>
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>
        },
        h3({ children }) {
          return <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4">
              {children}
            </blockquote>
          )
        },
        a({ children, href }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          )
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          )
        },
        th({ children }) {
          return (
            <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
              {children}
            </th>
          )
        },
        td({ children }) {
          return <td className="border border-border px-4 py-2">{children}</td>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

