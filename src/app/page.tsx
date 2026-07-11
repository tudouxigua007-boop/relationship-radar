'use client'

import { useState } from 'react'
import type { AnalyzeResponse } from '@/types'

type InputTab = 'image' | 'text'

const SAMPLE_CASES = [
  '"你不回消息是不是不爱我了"',
  '"我这都是为你好"',
  '"你朋友不适合你，我才最懂你"',
]

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
      if (tab === 'text') {
        body.text = text
      } else if (imagePreview) {
        body.imageBase64 = imagePreview.split(',')[1]
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data: AnalyzeResponse = await res.json()
      setReport(data)
    } catch {
      alert('分析失败，请重试')
    }
    setLoading(false)
  }

  const canSubmit = tab === 'text' ? text.trim().length > 0 : !!imageFile
  const riskColor = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600',
  }
  const riskLabel = {
    high: '🚩 需要警惕',
    medium: '⚠️ 需要注意',
    low: '✅ 看起来还好',
  }

  return (
    <div className="space-y-6">
      {/* === 输入区域 === */}
      <div>
        <h1 className="text-2xl font-bold text-center mb-1">📡 关系雷达</h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          那些被浪漫化的话，藏着什么信号？
        </p>

        {/* Tab 切换 */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-4">
          <button
            onClick={() => setTab('image')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'image' ? 'bg-white shadow text-[var(--primary)]' : 'text-gray-500'
            }`}
          >
            📷 上传截图
          </button>
          <button
            onClick={() => setTab('text')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'text' ? 'bg-white shadow text-[var(--primary)]' : 'text-gray-500'
            }`}
          >
            ✏️ 粘贴文字
          </button>
        </div>

        {/* 截图上传 */}
        {tab === 'image' && (
          <label className="block border-2 border-dashed border-pink-200 rounded-xl p-8 text-center cursor-pointer hover:border-[var(--primary)] transition">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="max-h-48 mx-auto rounded-lg" />
            ) : (
              <>
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-400 text-sm">点击上传聊天截图</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}

        {/* 文字输入 */}
        {tab === 'text' && (
          <textarea
            className="w-full h-36 p-4 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] resize-none bg-white text-sm"
            placeholder={'把聊天记录粘贴到这里...\n\n比如："我都是为你好，你怎么就不理解呢"'}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        <button
          onClick={handleScan}
          disabled={loading || !canSubmit}
          className="w-full mt-4 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50 transition"
        >
          {loading ? '正在扫描...' : '🔍 开始扫描'}
        </button>
      </div>

      {/* === 试试看（预设案例） === */}
      {!report && (
        <div>
          <p className="text-xs text-gray-400 mb-2">试试看</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SAMPLE_CASES.map((c, i) => (
              <button
                key={i}
                onClick={() => { setTab('text'); setText(c) }}
                className="flex-shrink-0 px-3 py-2 bg-white rounded-lg border border-pink-100 text-xs text-gray-600 hover:border-[var(--primary)] transition"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === 分析报告（扫描后展开） === */}
      {report && (
        <div className="space-y-5 pt-2 border-t border-pink-100">
          {/* 健康度评分 */}
          <div className="text-center">
            <div className="text-4xl font-bold text-[var(--primary)]">{report.score}<span className="text-lg text-gray-400">/100</span></div>
            <div className={`text-sm font-medium mt-1 ${riskColor[report.risk_level]}`}>
              {riskLabel[report.risk_level]}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
              <div
                className="bg-[var(--primary)] h-2 rounded-full transition-all"
                style={{ width: `${report.score}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              检测到 {report.flags.length} 个信号 · {report.behavior_profile.length} 种行为模式
            </p>
          </div>

          {/* 逐句标注 */}
          <div className="space-y-3">
            {report.flags.map((flag, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="font-medium text-sm mb-2">"{flag.quote}"</p>
                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-pink-100 text-pink-600 mb-2">
                  {flag.pattern}
                </span>
                <p className="text-xs text-gray-500">{flag.explanation}</p>
              </div>
            ))}
          </div>

          {/* 行为模式画像 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-sm mb-3">🎭 行为模式画像</h3>
            <div className="space-y-2">
              {report.behavior_profile.map((bp, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="w-16 text-gray-600">{bp.type}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[var(--primary)] h-2 rounded-full"
                      style={{ width: `${bp.percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-400 w-8 text-right">{bp.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 建议回应 */}
          <div>
            <h3 className="font-semibold text-sm mb-3">💡 建议回应</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <div className="text-xs font-medium text-green-600 mb-1">🟢 温和</div>
                <p className="text-xs text-green-700">{report.responses.gentle}</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                <div className="text-xs font-medium text-yellow-600 mb-1">🟡 明确</div>
                <p className="text-xs text-yellow-700">{report.responses.firm}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                <div className="text-xs font-medium text-red-600 mb-1">🔴 离场</div>
                <p className="text-xs text-red-700">{report.responses.exit}</p>
              </div>
            </div>
          </div>

          {/* 进入对话 */}
          <a
            href={`/chat?session=${Date.now()}`}
            className="block w-full py-4 rounded-xl bg-[var(--primary)] text-white text-center font-semibold hover:bg-[var(--primary-light)] transition"
          >
            💬 ta 不会就此罢休？继续聊，我帮你接招 →
          </a>
        </div>
      )}
    </div>
  )
}
