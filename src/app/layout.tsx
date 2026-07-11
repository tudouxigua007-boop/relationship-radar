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
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <a href="/" className="text-lg font-bold text-[var(--primary)]">
              📡 关系雷达
            </a>
            <button className="text-gray-400 hover:text-gray-600 text-sm">
              🕐
            </button>
          </div>
        </nav>
        <main className="max-w-lg mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
