'use client'

import { useState, useRef, useEffect } from 'react'
import type { ChatMessage, ChatResponse } from '@/types'

interface DisplayMessage {
  role: 'user' | 'assistant'
  content: string
  analysis?: ChatResponse
}

export default function ChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return
    setInput('')

    const userMsg: DisplayMessage = { role: 'user', content: content.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'current',
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data: ChatResponse = await res.json()
      const aiContent = [
        data.pattern && data.pattern !== '暂不确定' ? `这是"${data.pattern}"——` : '',
        data.analysis,
        data.suggestion ? `\n\n你可以这样接："${data.suggestion}"` : '',
        data.encouragement ? `\n\n${data.encouragement}` : '',
      ].filter(Boolean).join('')

      setMessages(prev => [...prev, { role: 'assistant', content: aiContent, analysis: data }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '连接失败，请重试' }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white h-[72px] flex items-center px-5 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.10),0_2px_2px_rgba(0,0,0,0.06)]">
        <div className="w-[min(92vw,860px)] mx-auto flex items-center justify-between">
          <a href="/" className="text-[13px] font-semibold text-[var(--starbucks-green)] no-underline flex items-center gap-1 hover:text-[var(--accent-green)]">
            ← 返回
          </a>
          <span className="text-base font-bold text-[var(--starbucks-green)]">边界练习室</span>
          <div className="w-12" />
        </div>
      </nav>

      <div className="w-[min(92vw,860px)] mx-auto flex-1 flex flex-col overflow-hidden">
        {/* Context */}
        <div className="mx-4 sm:mx-6 mt-4 mb-0 px-4 sm:px-5 py-3 bg-[var(--house-green)] rounded-xl text-xs sm:text-sm text-white/75 leading-relaxed shrink-0 shadow-sm">
          基于你的聊天分析，我会帮你识别对方每句话的套路，并给出应对建议。
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="self-start max-w-[85%]">
              <div className="brand-card px-4 py-3 text-sm leading-relaxed text-[var(--charcoal)]">
                把 ta 的新回复发给我，我帮你分析套路、给应对建议。也可以点下面的按钮，让我模拟 ta 可能的回复。
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'user' ? (
                <div className="self-end max-w-[85%] ml-auto bg-[var(--accent-green)] text-white rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm" style={{ borderBottomRightRadius: '4px' }}>
                  {msg.content}
                </div>
              ) : (
                <div className="self-start max-w-[85%]">
                  <div className="brand-card px-4 py-3 text-sm leading-relaxed text-[var(--charcoal)] whitespace-pre-line" style={{ borderBottomLeftRadius: '4px' }}>
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="self-start max-w-[85%]">
              <div className="brand-card px-4 py-3 text-sm text-[var(--muted)]" style={{ borderBottomLeftRadius: '4px' }}>
                正在分析...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 px-4 sm:px-6 pt-3 pb-4 sm:pb-6 bg-[var(--bg)] border-t border-[var(--hairline-soft)]">
          <button
            onClick={() => sendMessage('帮我模拟 ta 可能的回复')}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--accent-green)] rounded-full text-xs font-semibold text-[var(--accent-green)] cursor-pointer mb-2.5 hover:bg-[var(--green-soft)] disabled:opacity-50"
          >
            帮我模拟 ta 可能的回复
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 border border-[var(--accent-green)] rounded-full bg-white text-[var(--accent-green)] flex items-center justify-center cursor-pointer shrink-0 hover:bg-[var(--green-soft)] text-lg">
              +
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="粘贴 ta 的回复..."
              className="flex-1 px-4 py-2 border border-[var(--hairline)] rounded-full bg-white text-sm text-[var(--fg)] outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[var(--green-soft)] h-10 placeholder:text-[var(--muted)] font-[inherit]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
