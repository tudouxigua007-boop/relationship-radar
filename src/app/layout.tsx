import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关系雷达 | Relationship Radar',
  description: '识别不健康的关系模式，守护你的边界',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[var(--bg)]">
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur-sm">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight text-neutral-950">
              关系雷达
            </a>
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 hover:text-gray-700">
              ◷ 历史
            </button>
          </div>
        </nav>
        <main className="max-w-lg mx-auto px-5 py-7">
          {children}
        </main>
      </body>
    </html>
  )
}
