'use client'

import { useState } from 'react'
import type { AnalyzeResponse } from '@/types'

type InputTab = 'image' | 'text'

const SAMPLE_CASES = [
  '你不回消息是不是不爱我了\n我翻你手机是因为太在乎你\n你朋友不适合你，我才最懂你',
  '如果你真的爱我，就应该为我辞职。你连这点牺牲都不愿意吗？',
  '你就是太敏感、太拧巴，所以我们才总是吵架。',
]

const riskLabel = {
  high: '需要警惕',
  medium: '需要注意',
  low: '暂未发现明显风险',
}

const riskStyle = {
  high: { text: 'text-red-600', bar: 'bg-red-500' },
  medium: { text: 'text-orange-500', bar: 'bg-orange-500' },
  low: { text: 'text-emerald-600', bar: 'bg-emerald-500' },
}

export default function HomePage() {
  const [tab, setTab] = useState<InputTab>('image')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<AnalyzeResponse | null>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
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
      if (tab === 'image' && imagePreview) body.imageBase64 = imagePreview.split(',')[1]

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('分析失败')
      setReport(await response.json())
    } catch {
      alert('分析失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const selectSample = (sample: string) => {
    setTab('text')
    setText(sample)
    setReport(null)
  }

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value)
  }

  const canSubmit = tab === 'text' ? text.trim().length > 0 : Boolean(imageFile)
  const currentRisk = report ? riskStyle[report.risk_level] : riskStyle.low

  return (
    <div className="pb-10">
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex border-b border-gray-200 p-1.5">
          <button
            type="button"
            onClick={() => setTab('image')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              tab === 'image' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'
            }`}
          >
            上传截图
          </button>
          <button
            type="button"
            onClick={() => setTab('text')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              tab === 'text' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'
            }`}
          >
            粘贴文字
          </button>
        </div>

        {tab === 'image' ? (
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center px-6 py-10 text-center">
            {imagePreview ? (
              <img src={imagePreview} alt="聊天截图预览" className="max-h-52 rounded-lg object-contain" />
            ) : (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-gray-300 text-2xl text-gray-300">＋</div>
                <p className="text-base text-gray-600">上传聊天截图</p>
                <p className="mt-1 text-sm text-gray-400">支持 JPG、PNG</p>
              </>
            )}
            <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleImageChange} />
          </label>
        ) : (
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="block min-h-56 w-full resize-none px-5 py-5 text-sm leading-7 outline-none placeholder:text-gray-300"
            placeholder={'粘贴聊天记录，例如：\n“你不回消息是不是不爱我了”'}
          />
        )}

        <button
          type="button"
          onClick={handleScan}
          disabled={!canSubmit || loading}
          className="w-full bg-neutral-950 py-4 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading ? '正在分析…' : '开始扫描'}
        </button>
      </section>

      {!report && (
        <section className="mt-6">
          <p className="mb-3 text-xs text-gray-400">没有聊天记录？试试预设案例</p>
          <div className="space-y-2">
            {SAMPLE_CASES.map((sample, index) => (
              <button
                key={sample}
                type="button"
                onClick={() => selectSample(sample)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-600 transition hover:border-gray-400"
              >
                案例 {index + 1}：{sample.split('\n')[0]}
              </button>
            ))}
          </div>
        </section>
      )}

      {report && (
        <div className="mt-8 space-y-9 border-t border-gray-200 pt-8">
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="mb-3 text-xs font-medium text-gray-400">风险指数</p>
            <div className="flex items-end gap-8">
              <div className="shrink-0 text-5xl font-bold tracking-tight text-neutral-950">
                {report.score}<span className="ml-1 text-lg font-normal text-gray-400">/100</span>
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <p className={`mb-2 text-base font-semibold ${currentRisk.text}`}>
                  {riskLabel[report.risk_level]}
                </p>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${currentRisk.bar}`} style={{ width: `${report.score}%` }} />
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {report.flags.length} 个信号 · {report.behavior_profile.length} 类行为信号
                </p>
              </div>
            </div>
            <p className="mt-5 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-600">{report.summary}</p>
            <p className="mt-2 text-xs leading-5 text-gray-400">仅根据当前聊天片段估算，不代表对人物的诊断。</p>
          </section>

          <section>
            <SectionTitle>信号标注</SectionTitle>
            {report.flags.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">当前片段未发现明显风险信号。</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {report.flags.map((flag, index) => (
                  <article key={`${flag.quote}-${index}`} className={`relative px-7 py-6 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                    <div className={`absolute bottom-6 left-4 top-6 w-0.5 rounded-full ${currentRisk.bar}`} />
                    <p className="text-base font-semibold leading-6 text-neutral-950">“{flag.quote}”</p>
                    <span className="mt-3 inline-block rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-500">{flag.pattern}</span>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{flag.explanation}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionTitle>检测到的行为信号</SectionTitle>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {report.behavior_profile.map((pattern, index) => (
                <div key={pattern.type} className={`flex items-center gap-4 px-5 py-4 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                  <span className="w-28 shrink-0 text-sm font-medium text-gray-700">{pattern.type}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-400' : 'bg-gray-300'}`} style={{ width: `${pattern.percentage}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm text-gray-400">{pattern.percentage}%</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-gray-400">信号强度仅用于比较当前文本中的表现，不代表科学概率。</p>
          </section>

          <section>
            <SectionTitle>建议回应</SectionTitle>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <ResponseRow color="bg-emerald-500" label="温和" value={report.responses.gentle} onCopy={copyText} />
              <ResponseRow color="bg-orange-400" label="明确" value={report.responses.firm} onCopy={copyText} border />
              <ResponseRow color="bg-red-500" label="暂停对话" value={report.responses.exit} onCopy={copyText} border />
            </div>
          </section>

          <a href={`/chat?session=${Date.now()}`} className="block w-full rounded-lg bg-neutral-950 px-5 py-4 text-center text-base font-semibold text-white transition hover:bg-neutral-800">
            想继续梳理？我陪你分析下一句 →
          </a>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 border-b border-gray-200 pb-3">
      <h2 className="text-base font-semibold text-gray-500">{children}</h2>
    </div>
  )
}

function ResponseRow({
  color,
  label,
  value,
  onCopy,
  border = false,
}: {
  color: string
  label: string
  value: string
  onCopy: (value: string) => Promise<void>
  border?: boolean
}) {
  return (
    <div className={`flex items-start gap-4 px-5 py-4 ${border ? 'border-t border-gray-200' : ''}`}>
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="mt-1 text-sm leading-6 text-gray-600">“{value}”</p>
      </div>
      <button type="button" onClick={() => onCopy(value)} aria-label={`复制${label}回应`} className="shrink-0 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-700">
        复制
      </button>
    </div>
  )
}
