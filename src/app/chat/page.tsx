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
    <div className="flex flex-col h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--hairline-soft)] h-14 flex items-center px-5 shrink-0">
        <div className="max-w-[420px] mx-auto w-full flex items-center justify-between">
          <a href="/" className="text-[13px] font-medium text-[var(--stone)] no-underline flex items-center gap-1 hover:text-[var(--fg)] transition-colors">
            ← 返回
          </a>
          <span className="text-sm font-bold text-[var(--fg)]">对话</span>
          <div className="w-12" />
        </div>
      </nav>

      <div className="max-w-[420px] mx-auto w-full flex-1 flex flex-col overflow-hidden">
        {/* Context */}
        <div className="mx-5 mt-3 mb-0 px-3.5 py-2.5 bg-[var(--surface)] rounded-[10px] text-xs text-[var(--steel)] leading-relaxed shrink-0">
          基于你的聊天分析，我会帮你识别对方每句话的套路，并给出应对建议。
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="self-start max-w-[85%]">
              <div className="bg-[var(--bg)] border border-[var(--hairline)] rounded-xl px-4 py-3 text-sm leading-relaxed text-[var(--charcoal)]">
                把 ta 的新回复发给我，我帮你分析套路、给应对建议。也可以点下面的按钮，让我模拟 ta 可能的回复。
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'user' ? (
                <div className="self-end max-w-[85%] ml-auto bg-[var(--fg)] text-[var(--bg)] rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ borderBottomRightRadius: '4px' }}>
                  {msg.content}
                </div>
              ) : (
                <div className="self-start max-w-[85%]">
                  <div className="bg-[var(--bg)] border border-[var(--hairline)] rounded-xl px-4 py-3 text-sm leading-relaxed text-[var(--charcoal)] whitespace-pre-line" style={{ borderBottomLeftRadius: '4px' }}>
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="self-start max-w-[85%]">
              <div className="bg-[var(--bg)] border border-[var(--hairline)] rounded-xl px-4 py-3 text-sm text-[var(--muted)]" style={{ borderBottomLeftRadius: '4px' }}>
                正在分析...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 px-5 pt-2 pb-4">
          <button
            onClick={() => sendMessage('帮我模拟 ta 可能的回复')}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-[7px] border border-[var(--hairline)] rounded-[10px] text-xs font-medium text-[var(--steel)] cursor-pointer mb-2.5 hover:border-[var(--fg)] hover:text-[var(--fg)] transition-all disabled:opacity-50"
          >
            帮我模拟 ta 可能的回复
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 border border-[var(--hairline)] rounded-[10px] bg-[var(--bg)] text-[var(--stone)] flex items-center justify-center cursor-pointer shrink-0 hover:border-[var(--fg)] hover:text-[var(--fg)] transition-all text-lg">
              +
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="粘贴 ta 的回复..."
              className="flex-1 px-3 py-2 border border-[var(--hairline)] rounded-[10px] text-sm text-[var(--fg)] outline-none focus:border-[var(--fg)] transition-colors h-9 placeholder:text-[var(--muted)] font-[inherit]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
