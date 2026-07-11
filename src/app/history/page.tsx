'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@/types'

const riskBadge: Record<string, { label: string; cls: string }> = {
  high: { label: '高风险', cls: 'text-[var(--red)] bg-[var(--red-soft)]' },
  medium: { label: '需要注意', cls: 'text-[var(--orange)] bg-[var(--orange-soft)]' },
  low: { label: '暂无明显风险', cls: 'text-[var(--green)] bg-[var(--green-soft)]' },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)
  const time = d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (days === 0) return `今天 ${time}`
  if (days === 1) return `昨天 ${time}`
  return `${d.getMonth() + 1}月${d.getDate()}日 ${time}`
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('radar_sessions')
      if (raw) {
        const parsed: Session[] = JSON.parse(raw)
        setSessions(parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--hairline-soft)] h-14 flex items-center px-5">
        <div className="max-w-[420px] mx-auto w-full flex items-center justify-between">
          <a href="/" className="text-[13px] font-medium text-[var(--stone)] no-underline flex items-center gap-1 hover:text-[var(--fg)] transition-colors">
            ← 返回
          </a>
          <span className="text-sm font-bold text-[var(--fg)]">历史</span>
          <div className="w-12" />
        </div>
      </nav>

      <main className="max-w-[420px] mx-auto px-5 pt-6 pb-16">
        {sessions.length === 0 ? (
          <div className="text-center py-20 text-[var(--stone)]">
            <div className="text-[var(--muted)] mb-3 text-2xl">📋</div>
            <p className="text-sm">还没有分析记录</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {sessions.map((s) => {
              const risk = s.report ? riskBadge[s.report.risk_level] : null
              const chatRounds = Math.floor(s.chat.filter(m => m.role === 'user').length)
              const snippet = s.report
                ? s.report.flags.map(f => `"${f.quote}"`).join('')
                : s.input.text || ''

              return (
                <a
                  key={s.id}
                  href={`/chat?session=${s.id}`}
                  className="block no-underline text-inherit bg-[var(--bg)] border border-[var(--hairline)] rounded-xl px-[18px] py-4 hover:-translate-y-px hover:shadow-md active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--stone)]">{formatDate(s.createdAt)}</span>
                      {risk && (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${risk.cls}`}>
                          {risk.label}
                        </span>
                      )}
                    </div>
                    {s.report && (
                      <div className="text-xl font-bold tracking-tight">
                        {s.report.score}<span className="text-xs font-normal text-[var(--stone)]">/100</span>
                      </div>
                    )}
                  </div>

                  {snippet && (
                    <p className="text-sm text-[var(--steel)] leading-relaxed mb-2.5 line-clamp-2">{snippet}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap flex-1">
                      {s.report?.flags.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[11px] font-medium text-[var(--stone)] bg-[var(--surface)] px-2 py-0.5 rounded-[5px]">
                          {f.pattern}
                        </span>
                      ))}
                    </div>
                    {chatRounds > 0 && (
                      <span className="text-[11px] text-[var(--stone)] shrink-0 ml-2 flex items-center gap-1">
                        💬 {chatRounds} 轮对话
                      </span>
                    )}
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
