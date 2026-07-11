'use client'

import { useState } from 'react'
import type { AnalyzeResponse } from '@/types'

type InputTab = 'image' | 'text'

const SAMPLE_CASES = [
  '你不回消息是不是不爱我了',
  '我这都是为你好',
  '你朋友不适合你',
]

const directionClass: Record<string, string> = {
  '可以继续沟通': 'text-[var(--green)] bg-[var(--green-soft)]',
  '建议先设边界': 'text-[var(--orange)] bg-[var(--orange-soft)]',
  '建议保护自己': 'text-[var(--red)] bg-[var(--red-soft)]',
}

const riskLabel: Record<string, string> = {
  high: '需要警惕',
  medium: '需要注意',
  low: '暂未发现明显风险',
}

const riskColor: Record<string, string> = {
  high: 'text-[var(--red)]',
  medium: 'text-[var(--orange)]',
  low: 'text-[var(--green)]',
}

const barColor = (i: number) =>
  i === 0 ? 'bg-[var(--coral)]' : i === 1 ? 'bg-[var(--orange)]' : 'bg-[var(--stone)]'

export default function HomePage() {
  const [tab, setTab] = useState<InputTab>('image')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<AnalyzeResponse | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleScan = async () => {
    if (!canSubmit) return
    setLoading(true)
    setReport(null)
    try {
      const body: Record<string, string> = {}
      if (tab === 'text') body.text = text
      else if (imagePreview) body.imageBase64 = imagePreview.split(',')[1]

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setReport(await res.json())
    } catch {
      alert('分析失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = tab === 'text' ? text.trim().length > 0 : !!imageFile

  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--hairline-soft)] h-14 flex items-center px-5">
        <div className="max-w-[420px] mx-auto w-full flex items-center justify-between">
          <a href="/" className="text-base font-bold text-[var(--fg)] no-underline tracking-tight">不舒服雷达探测器</a>
          <a href="/history" className="text-xs font-medium text-[var(--stone)] border border-[var(--hairline)] rounded-[10px] px-3.5 py-1.5 flex items-center gap-1.5 hover:border-[var(--fg)] hover:text-[var(--fg)] transition-all no-underline">
            历史
          </a>
        </div>
      </nav>

      <main className="max-w-[420px] mx-auto px-5 pt-10 pb-16">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight leading-[1.15] mb-2">
            那些被浪漫化的话，<br />藏着什么信号？
          </h1>
          <p className="text-[15px] text-[var(--steel)] leading-relaxed">
            上传聊天截图或粘贴文字，帮你识别不健康的关系模式。
          </p>
        </div>

        {/* Input Card */}
        <div className="border border-[var(--hairline)] rounded-xl overflow-hidden">
          <div className="flex p-1.5 gap-1">
            <button
              onClick={() => setTab('image')}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                tab === 'image' ? 'bg-[var(--surface)] text-[var(--fg)] font-semibold' : 'text-[var(--stone)]'
              }`}
            >
              上传截图
            </button>
            <button
              onClick={() => setTab('text')}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                tab === 'text' ? 'bg-[var(--surface)] text-[var(--fg)] font-semibold' : 'text-[var(--stone)]'
              }`}
            >
              粘贴文字
            </button>
          </div>

          {tab === 'image' && (
            <div className="px-4 pb-4">
              <label className="flex flex-col items-center justify-center py-9 px-5 cursor-pointer border-2 border-dashed border-[var(--hairline)] rounded-[10px] hover:border-[var(--coral)] hover:bg-[var(--coral-soft)] transition-all text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="max-h-48 rounded-lg" />
                ) : (
                  <>
                    <p className="text-[13px] text-[var(--steel)]">点击上传聊天截图</p>
                    <p className="text-[11px] text-[var(--stone)] mt-0.5">支持 JPG、PNG</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          )}

          {tab === 'text' && (
            <div className="px-4 pb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-[120px] p-3.5 border-2 border-dashed border-[var(--hairline)] rounded-[10px] text-sm leading-relaxed text-[var(--fg)] resize-none outline-none focus:border-[var(--fg)] focus:border-solid transition-colors placeholder:text-[var(--muted)] font-[inherit]"
                placeholder={'把聊天记录粘贴到这里...\n\n比如："我都是为你好，你怎么就不理解呢"'}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleScan}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3.5 mt-4 rounded-[10px] bg-[var(--fg)] text-[var(--bg)] text-[15px] font-semibold cursor-pointer hover:bg-[var(--charcoal)] active:scale-[0.98] transition-all min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? '正在扫描...' : '开始扫描'}
        </button>

        {!report && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold text-[var(--stone)] mb-2.5 uppercase tracking-wider">试试看</p>
            <div className="flex gap-2 flex-wrap">
              {SAMPLE_CASES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setTab('text'); setText(c) }}
                  className="px-4 py-2 border border-[var(--hairline)] rounded-[10px] text-[13px] text-[var(--steel)] cursor-pointer hover:border-[var(--fg)] hover:text-[var(--fg)] hover:-translate-y-px transition-all"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {report && (
          <div className="mt-9 pt-9 border-t border-[var(--hairline)]">
            {/* Score */}
            <div className="border border-[var(--hairline)] rounded-xl p-5 mb-8 flex items-center gap-5">
              <div className="shrink-0">
                <span className="text-5xl font-bold leading-none tracking-tight">{report.score}</span>
                <span className="text-base font-normal text-[var(--stone)]">/100</span>
              </div>
              <div className="flex-1">
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold mb-3 ${riskColor[report.risk_level]}`}>
                  {riskLabel[report.risk_level]}
                </div>
                <div className="w-full h-1 bg-[var(--hairline)] rounded-sm overflow-hidden mb-2.5">
                  <div className="h-full bg-[var(--fg)] rounded-sm transition-all duration-500" style={{ width: `${report.score}%` }} />
                </div>
                <p className="text-[13px] text-[var(--stone)]">
                  检测到 <strong className="text-[var(--charcoal)] font-semibold">{report.flags.length}</strong> 个信号 · <strong className="text-[var(--charcoal)] font-semibold">{report.behavior_profile.length}</strong> 种行为模式
                </p>
              </div>
            </div>

            {/* Signals */}
            <h3 className="text-xl font-bold tracking-tight mb-4">信号标注</h3>
            <div className="flex flex-col gap-3 mb-8">
              {report.flags.map((flag, i) => (
                <div key={i} className="border border-[var(--hairline)] rounded-xl px-[18px] py-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <p className="text-[15px] font-semibold leading-relaxed mb-2.5">"{flag.quote}"</p>
                  <div className="flex gap-1.5 flex-wrap mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--red-soft)] text-[var(--red)]">
                      {flag.pattern}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--steel)] leading-relaxed">{flag.explanation}</p>
                </div>
              ))}
            </div>

            {/* Profile */}
            <h3 className="text-xl font-bold tracking-tight mb-4">行为模式画像</h3>
            <div className="border border-[var(--hairline)] rounded-xl p-5 mb-8">
              {report.behavior_profile.map((bp, i) => (
                <div key={i} className="flex items-center gap-3 mb-2.5 last:mb-0">
                  <span className="w-[52px] text-[13px] font-semibold text-[var(--charcoal)] text-right shrink-0">{bp.type}</span>
                  <div className="flex-1 h-1.5 bg-[var(--hairline)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor(i)}`} style={{ width: `${bp.percentage}%` }} />
                  </div>
                  <span className="w-9 text-[13px] font-semibold text-[var(--stone)] text-right">{bp.percentage}%</span>
                </div>
              ))}
              <p className="text-sm text-[var(--steel)] leading-relaxed mt-4 pt-4 border-t border-[var(--hairline-soft)]">
                {report.behavior_summary}
              </p>
            </div>

            {/* Response */}
            <h3 className="text-xl font-bold tracking-tight mb-4">建议回应</h3>
            <div className="border border-[var(--hairline)] rounded-xl px-5 py-[18px] mb-8">
              <div className={`inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg mb-3 ${directionClass[report.response.direction] || 'text-[var(--orange)] bg-[var(--orange-soft)]'}`}>
                {report.response.direction}
              </div>
              <div className="text-[11px] font-semibold tracking-wide mb-1.5 text-[var(--stone)]">你可以这样回</div>
              <p className="text-[15px] leading-relaxed text-[var(--charcoal)]">"{report.response.text}"</p>
            </div>

            {/* Bottom CTA */}
            <a
              href="/chat"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-[10px] bg-[var(--coral)] text-white text-[15px] font-semibold cursor-pointer hover:bg-[#e04a2a] active:scale-[0.98] transition-all min-h-[52px] no-underline"
            >
              ta 不会就此罢休？继续聊，我帮你接招
            </a>
          </div>
        )}
      </main>
    </>
  )
}
