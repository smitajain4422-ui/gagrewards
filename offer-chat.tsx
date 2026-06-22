"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

interface OfferChatProps {
  availableOffers: Array<{ name: string; description: string }>
}

export function OfferChat({ availableOffers }: OfferChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Pre-made questions based on available offers
  const quickQuestions = [
    "How do I complete offers?",
    "Why didn't my offer credit?",
    ...(availableOffers.length > 0
      ? [`How do I complete ${availableOffers[0]?.name}?`]
      : []),
  ]

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return
    sendMessage({ text: question })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Open help chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-foreground">Offer Help</p>
              <p className="text-xs text-primary-foreground/70">Ask me anything</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 max-h-64 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Hi! I can help you with offers. Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q)}
                      disabled={isLoading}
                      className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-2 py-1 rounded-full transition-colors disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <span key={index}>{part.text}</span>
                      }
                      return null
                    })}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions (when there are messages) */}
          {messages.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {quickQuestions.slice(0, 2).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(q)}
                  disabled={isLoading}
                  className="text-xs bg-secondary/50 hover:bg-secondary text-secondary-foreground px-2 py-1 rounded-full transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-2 border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about offers..."
              disabled={isLoading}
              className="flex-1 bg-secondary text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground rounded-lg px-3 py-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
