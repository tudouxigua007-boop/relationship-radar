import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '不舒服雷达探测器',
  description: '识别不健康的关系模式，守护你的边界',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[var(--bg)]">
        {children}
      </body>
    </html>
  )
}
