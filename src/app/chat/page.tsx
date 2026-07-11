'use client'

import { useState, useRef, useEffect } from 'react'
import type { ChatMessage, ChatResponse } from '@/types'

interface DisplayMessage {
  role: 'user' | 'assistant'
  content: string
  analysis?: ChatResponse
}

const PRESET_CHIP = '💡 帮我模拟 ta 可能的回复'

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

      const aiMsg: DisplayMessage = {
        role: 'assistant',
        content: data.suggestion,
        analysis: data,
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '连接失败，请重试',
      }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* 返回 */}
      <div className="flex items-center justify-between mb-3">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← 返回</a>
        <span className="text-sm font-medium">💬 对话</span>
      </div>

      {/* 上下文卡片 */}
      <div className="bg-pink-50 rounded-xl px-4 py-3 mb-4 text-xs text-pink-600 border border-pink-100">
        📊 基于你的聊天分析，我会帮你识别对方每句话的套路，并给出应对建议。
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {/* 初始引导 */}
        {messages.length === 0 && (
          <div className="bg-white rounded-2xl px-4 py-3 text-sm text-gray-600 border border-gray-100">
            把 ta 的新回复发给我，我帮你分析套路、给应对建议。
            也可以点下面的按钮，让我模拟 ta 可能的回复。
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[var(--primary)] text-white rounded-2xl px-4 py-3 text-sm">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {/* 套路识别标签 */}
                {msg.analysis?.pattern && (
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-pink-100 text-pink-600">
                    📍 {msg.analysis.pattern}
                  </span>
                )}
                {/* 分析 */}
                {msg.analysis?.analysis && (
                  <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-700 border border-gray-100">
                    {msg.analysis.analysis}
                  </div>
                )}
                {/* 建议回应 */}
                <div className="bg-white rounded-2xl px-4 py-3 text-sm text-gray-800 border border-gray-100">
                  💡 {msg.content}
                </div>
                {/* 鼓励 */}
                {msg.analysis?.encouragement && (
                  <div className="bg-green-50 rounded-xl px-3 py-2 text-xs text-green-600">
                    ⭐ {msg.analysis.encouragement}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-400 border border-gray-100">
            正在分析...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 预设 chip + 输入框 */}
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <button
          onClick={() => sendMessage(PRESET_CHIP)}
          disabled={loading}
          className="px-3 py-1.5 bg-pink-50 text-pink-500 rounded-full text-xs border border-pink-100 hover:bg-pink-100 transition disabled:opacity-50"
        >
          {PRESET_CHIP}
        </button>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="粘贴 ta 的回复..."
            className="flex-1 px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] text-sm"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold disabled:opacity-50 text-sm"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
