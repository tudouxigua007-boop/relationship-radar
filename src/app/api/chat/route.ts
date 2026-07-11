import { NextResponse } from 'next/server'
import type { ChatRequest, ChatResponse } from '@/types'

// TODO: 队友B替换为 Doubao (火山引擎) API 调用
// 当前为 mock 数据，保证前端可以联调

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json()
    const lastUserMsg = body.messages.filter(m => m.role === 'user').pop()

    if (!lastUserMsg) {
      return NextResponse.json({ error: '请发送消息' }, { status: 400 })
    }

    // --- Mock 响应，队友B实现真实 AI 调用后删除 ---
    const mockResponse: ChatResponse = {
      pattern: '反向内疚操控',
      analysis: '把自己变成受害者，让你怀疑"是不是我太过分了"。注意：你在谈边界，ta在谈情绪，这是经典的"偷换议题"。',
      suggestion: '我说的是翻手机这个行为，不是否定你这个人。我们可以聊怎么建立信任，但这个边界我不让步。',
      encouragement: '你没有被带偏去自证清白，而是把话题拉回来了',
    }

    return NextResponse.json(mockResponse)
  } catch {
    return NextResponse.json({ error: '服务暂时不可用' }, { status: 500 })
  }
}
