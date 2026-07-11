import { NextResponse } from 'next/server'
import { getAIConfig, getSafeAIErrorCode, parseModelJSON } from '@/lib/ai'
import { CHAT_SYSTEM_PROMPT } from '@/lib/prompts'
import type { ChatRequest, ChatResponse } from '@/types'

const MAX_TOTAL_LENGTH = 6000
const fallback: ChatResponse = {
  pattern: '暂时无法判断',
  analysis: '自动分析暂时不可用，仅凭当前信息也可能不足以下结论。',
  suggestion: '我想先暂停一下，等我们都平静后再继续讨论。',
  encouragement: '先照顾自己的感受和安全是合理的。',
}

function isChatResponse(value: unknown): value is ChatResponse {
  if (!value || typeof value !== 'object') return false
  const data = value as Record<string, unknown>
  return ['pattern', 'analysis', 'suggestion'].every(key => typeof data[key] === 'string')
    && (data.encouragement === undefined || typeof data.encouragement === 'string')
}

export async function POST(request: Request) {
  let body: ChatRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求必须是有效的 JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0
    || body.messages.some(message => !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string')) {
    return NextResponse.json({ error: '请提供有效的对话消息' }, { status: 400 })
  }
  const totalLength = body.messages.reduce((sum, message) => sum + message.content.length, 0)
  if (!body.messages.some(message => message.role === 'user' && message.content.trim())) {
    return NextResponse.json({ error: '请发送一条非空消息' }, { status: 400 })
  }
  if (totalLength > MAX_TOTAL_LENGTH) {
    return NextResponse.json({ error: `对话总长度不能超过 ${MAX_TOTAL_LENGTH} 个字符` }, { status: 400 })
  }

  const config = getAIConfig()
  if (!config) return NextResponse.json({ error: 'AI 服务尚未配置' }, { status: 503 })

  try {
    const context = body.context ? `\n既有分析上下文：${JSON.stringify(body.context)}` : ''
    const completion = await config.client.chat.completions.create({
      model: config.model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: CHAT_SYSTEM_PROMPT + context },
        ...body.messages.map(message => ({ role: message.role, content: message.content })),
      ],
    })
    const parsed = parseModelJSON(completion.choices[0]?.message?.content ?? '')
    return NextResponse.json(isChatResponse(parsed) ? parsed : fallback)
  } catch (error) {
    return NextResponse.json(fallback, { headers: { 'X-AI-Fallback': getSafeAIErrorCode(error) } })
  }
}
