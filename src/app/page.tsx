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
      <nav className="sticky top-0 z-50 bg-white h-[72px] flex items-center px-5 shadow-[0_1px_3px_rgba(0,0,0,0.10),0_2px_2px_rgba(0,0,0,0.06),0_0_2px_rgba(0,0,0,0.07)]">
        <div className="page-shell flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-[var(--starbucks-green)] no-underline tracking-tight">不舒服探测器</a>
          <a href="/history" className="text-[13px] font-semibold text-[var(--starbucks-green)] border border-[var(--starbucks-green)] rounded-full px-4 py-2 flex items-center gap-1.5 hover:bg-[var(--green-soft)] no-underline">
            历史
          </a>
        </div>
      </nav>

      {loading && (
        <div className="fixed inset-0 z-[100] bg-[var(--bg)] overflow-y-auto" role="status" aria-live="polite" aria-label="正在分析对话">
          <div className="min-h-full page-shell flex items-center justify-center py-10">
            <div className="w-full max-w-[720px]">
              <div className="bg-[var(--house-green)] text-white rounded-xl px-[clamp(28px,6vw,56px)] py-[clamp(36px,7vw,64px)] shadow-[0_8px_20px_rgba(0,0,0,0.14)]">
                <div className="radar-loader mb-8" aria-hidden="true">
                  <span className="radar-loader-core" />
                  <span className="radar-loader-ring radar-loader-ring-one" />
                  <span className="radar-loader-ring radar-loader-ring-two" />
                </div>
                <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/60 mb-3">Discomfort Detector</p>
                <h2 className="font-['Lora',Georgia,serif] text-[clamp(28px,4vw,44px)] font-semibold leading-tight mb-3">
                  正在听懂这段对话
                </h2>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-[38em]">
                  我们会关注具体表达与边界，不给任何人贴标签，也不替你做决定。
                </p>
              </div>

              <div className="brand-card -mt-3 mx-[clamp(12px,4vw,32px)] p-5 sm:p-6 relative">
                <div className="loading-step loading-step-one">
                  <span className="loading-step-dot" />
                  <div><strong>读取对话</strong><p>辨认清晰可见的文字和说话顺序</p></div>
                </div>
                <div className="loading-step loading-step-two">
                  <span className="loading-step-dot" />
                  <div><strong>识别模式</strong><p>区分普通分歧、边界信号与上下文不足</p></div>
                </div>
                <div className="loading-step loading-step-three">
                  <span className="loading-step-dot" />
                  <div><strong>整理回应</strong><p>生成清楚、尊重且可执行的表达建议</p></div>
                </div>
                <p className="mt-5 pt-4 border-t border-[var(--hairline-soft)] text-xs text-[var(--stone)] text-center">
                  截图和文字仅用于本次分析，请稍候
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="page-shell pt-[clamp(20px,3vw,40px)] pb-20">
        {/* Hero */}
        <div className="fluid-hero mb-[clamp(24px,3vw,36px)] bg-[var(--house-green)] text-white rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.10)]">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 mb-3">Discomfort Detector</p>
          <h1 className="font-['Lora',Georgia,serif] text-[clamp(30px,4.2vw,52px)] font-semibold tracking-tight leading-[1.2] mb-3 max-w-[18em]">
            那些被浪漫化的话，<br />藏着什么信号？
          </h1>
          <p className="text-[clamp(15px,1.6vw,19px)] text-white/70 leading-relaxed max-w-[42em]">
            上传聊天截图或粘贴文字，帮你识别不健康的关系模式。
          </p>
        </div>

        {/* Input Card */}
        <div className="brand-card overflow-hidden reading-shell">
          <div className="flex p-1.5 gap-1">
            <button
              onClick={() => setTab('image')}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                tab === 'image' ? 'bg-[var(--green-soft)] text-[var(--starbucks-green)] font-semibold' : 'text-[var(--stone)]'
              }`}
            >
              上传截图
            </button>
            <button
              onClick={() => setTab('text')}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                tab === 'text' ? 'bg-[var(--green-soft)] text-[var(--starbucks-green)] font-semibold' : 'text-[var(--stone)]'
              }`}
            >
              粘贴文字
            </button>
          </div>

          {tab === 'image' && (
            <div className="px-4 pb-4">
              <label className="flex flex-col items-center justify-center py-9 px-5 cursor-pointer border border-dashed border-[var(--hairline)] rounded-xl hover:border-[var(--accent-green)] hover:bg-[var(--green-soft)] text-center">
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
                className="w-full h-[120px] p-4 border border-[var(--hairline)] rounded-xl bg-[#f9f9f9] text-sm leading-relaxed text-[var(--fg)] resize-none outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[var(--green-soft)] placeholder:text-[var(--muted)] font-[inherit]"
                placeholder={'把聊天记录粘贴到这里...\n\n比如："我都是为你好，你怎么就不理解呢"'}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleScan}
          disabled={loading || !canSubmit}
          className="reading-shell flex items-center justify-center gap-2 py-3.5 mt-4 rounded-full bg-[var(--accent-green)] text-white text-[15px] font-semibold cursor-pointer hover:bg-[var(--starbucks-green)] min-h-[50px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          开始扫描
        </button>

        {!report && (
          <div className="mt-6 reading-shell">
            <p className="text-[11px] font-semibold text-[var(--stone)] mb-2.5 uppercase tracking-wider">试试看</p>
            <div className="flex gap-2 flex-wrap">
              {SAMPLE_CASES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setTab('text'); setText(c) }}
                  className="px-4 py-2 border border-[var(--accent-green)] rounded-full bg-transparent text-[13px] font-medium text-[var(--accent-green)] cursor-pointer hover:bg-[var(--green-soft)]"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {report && (
          <div className="mt-[var(--section-gap)] pt-[var(--section-gap)] border-t border-[var(--hairline)]">
            {/* Score */}
            <div className="brand-card p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 max-w-3xl mx-auto">
              <div className="shrink-0">
                <span className="text-5xl font-bold leading-none tracking-tight">{report.score}</span>
                <span className="text-base font-normal text-[var(--stone)]">/100</span>
              </div>
              <div className="flex-1">
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold mb-3 ${riskColor[report.risk_level]}`}>
                  {riskLabel[report.risk_level]}
                </div>
                <div className="w-full h-1 bg-[var(--hairline)] rounded-sm overflow-hidden mb-2.5">
                  <div className="h-full bg-[var(--accent-green)] rounded-sm transition-all duration-500" style={{ width: `${report.score}%` }} />
                </div>
                <p className="text-[13px] text-[var(--stone)]">
                  检测到 <strong className="text-[var(--charcoal)] font-semibold">{report.flags.length}</strong> 个信号 · <strong className="text-[var(--charcoal)] font-semibold">{report.behavior_profile.length}</strong> 种行为模式
                </p>
              </div>
            </div>

            {/* Signals */}
            <h3 className="text-xl font-bold tracking-tight mb-4">信号标注</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {report.flags.map((flag, i) => (
                <div key={i} className="brand-card px-[18px] py-4 hover:-translate-y-0.5 hover:shadow-md">
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
            <div className="brand-card p-5 sm:p-6 mb-8 max-w-4xl">
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
            <div className="brand-card px-5 sm:px-6 py-[18px] mb-8 max-w-4xl">
              <div className={`inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg mb-3 ${directionClass[report.response.direction] || 'text-[var(--orange)] bg-[var(--orange-soft)]'}`}>
                {report.response.direction}
              </div>
              <div className="text-[11px] font-semibold tracking-wide mb-1.5 text-[var(--stone)]">你可以这样回</div>
              <p className="text-[15px] leading-relaxed text-[var(--charcoal)]">"{report.response.text}"</p>
            </div>

            {/* Bottom CTA */}
            <a
              href="/chat"
              className="flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[360px] sm:px-10 py-4 rounded-full bg-[var(--house-green)] text-white text-[15px] font-semibold cursor-pointer hover:bg-[var(--uplift-green)] min-h-[52px] no-underline shadow-md"
            >
              ta 不会就此罢休？继续聊，我帮你接招
            </a>
          </div>
        )}
      </main>
    </>
  )
}
