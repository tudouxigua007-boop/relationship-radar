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
      summary: '这些表达把爱与即时回应、隐私让渡和社交限制绑定在一起，呈现出较明显的控制与边界侵犯信号。',
      flags: [
        {
          quote: '你不回消息是不是不爱我了',
          pattern: '情感勒索',
          explanation: '把“没有及时回复”和“不爱”画等号，可能通过内疚感要求你随时在线。你有权保留自己的生活节奏。',
          suggestion: '我在忙不代表不在乎你，我需要自己的空间',
        },
        {
          quote: '我翻你手机是因为太在乎你',
          pattern: '边界侵犯',
          explanation: '用“太在乎”解释翻看手机，可能是在用关心合理化越界。关键要看你表达拒绝后，对方是否尊重。',
          suggestion: '关心可以用沟通表达，翻手机不是关心，是不信任',
        },
        {
          quote: '你朋友不适合你，我才最懂你',
          pattern: '孤立支持系统',
          explanation: '这句话贬低你的朋友，并把自己塑造成唯一理解你的人。健康关系不会要求你切断正常的社交支持。',
          suggestion: '朋友是我的支持系统，我会自己判断和谁来往',
        },
      ],
      behavior_profile: [
        { type: '控制与监视', percentage: 80 },
        { type: '情绪施压', percentage: 55 },
        { type: '孤立支持系统', percentage: 45 },
      ],
      responses: {
        gentle: '我在忙不代表不在乎你，回复有自己的节奏。',
        firm: '消息和爱是两回事，我不会交出隐私或放弃正常社交。',
        exit: '我们现在先暂停对话，等彼此都能尊重边界时再沟通。',
      },
    }

    return NextResponse.json(mockResponse)
  } catch {
    return NextResponse.json({ error: '分析服务暂时不可用' }, { status: 500 })
  }
}
