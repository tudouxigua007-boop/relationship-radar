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
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white h-[72px] flex items-center px-5 shadow-[0_1px_3px_rgba(0,0,0,0.10),0_2px_2px_rgba(0,0,0,0.06)]">
        <div className="w-[min(92vw,960px)] mx-auto flex items-center justify-between">
          <a href="/" className="text-[13px] font-semibold text-[var(--starbucks-green)] no-underline flex items-center gap-1 hover:text-[var(--accent-green)]">
            ← 返回
          </a>
          <span className="text-base font-bold text-[var(--starbucks-green)]">分析记录</span>
          <div className="w-12" />
        </div>
      </nav>

      <main className="w-[min(92vw,960px)] mx-auto pt-[clamp(28px,4vw,44px)] pb-20">
        {sessions.length === 0 ? (
          <div className="text-center py-20 text-[var(--stone)]">
            <div className="text-[var(--muted)] mb-3 text-2xl">📋</div>
            <p className="text-sm">还没有分析记录</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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
                  className="brand-card block no-underline text-inherit px-[18px] py-4 hover:-translate-y-px hover:shadow-md"
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
