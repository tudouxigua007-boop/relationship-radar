import { NextResponse } from 'next/server'
import type { AnalyzeRequest, AnalyzeResponse } from '@/types'

// TODO: 队友B替换为 Doubao (火山引擎) API 调用
// 当前为 mock 数据，保证前端可以联调

export async function POST(request: Request) {
  try {
    const body: AnalyzeRequest = await request.json()

    if (!body.text && !body.imageBase64) {
      return NextResponse.json({ error: '请输入文本或上传截图' }, { status: 400 })
    }

    // --- Mock 响应，队友B实现真实 AI 调用后删除 ---
    const mockResponse: AnalyzeResponse = {
      score: 72,
      risk_level: 'medium',
      summary: '这段对话中检测到多个控制型行为信号，需要注意',
      flags: [
        {
          quote: '你不回消息是不是不爱我了',
          pattern: '情感绑架',
          explanation: '把"没秒回"和"不爱"画等号，用内疚感逼你随时回应。姐妹，你有自己的生活节奏。',
          suggestion: '我在忙不代表不在乎你，我需要自己的空间',
        },
        {
          quote: '我翻你手机是因为太在乎你',
          pattern: '边界侵犯 + 合理化',
          explanation: '翻手机≠在乎。用"因为爱你"来包装越界行为是经典套路。',
          suggestion: '关心可以用沟通表达，翻手机不是关心，是不信任',
        },
      ],
      behavior_profile: [
        { type: '控制型', percentage: 80 },
        { type: '焦虑型', percentage: 50 },
        { type: '打压型', percentage: 20 },
      ],
      responses: {
        gentle: '我在忙不代表不在乎你',
        firm: '消息和爱是两回事，我有自己的节奏',
        exit: '如果不回消息就=不爱，那我没法满足这个要求',
      },
    }

    return NextResponse.json(mockResponse)
  } catch {
    return NextResponse.json({ error: '分析服务暂时不可用' }, { status: 500 })
  }
}
