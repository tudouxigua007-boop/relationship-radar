import { NextResponse } from 'next/server'
import { detectImageMediaType, getAIConfig, getSafeAIErrorCode, parseModelJSON } from '@/lib/ai'
import { ANALYZE_SYSTEM_PROMPT } from '@/lib/prompts'
import type { AnalyzeRequest, AnalyzeResponse } from '@/types'

const MAX_INPUT_LENGTH = 3000
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const fallback: AnalyzeResponse = {
  score: 0,
  risk_level: 'low',
  summary: '暂时无法完成自动分析。请结合具体上下文判断，也可以稍后重试。',
  flags: [],
  behavior_profile: [],
  responses: {
    gentle: '我想先确认彼此的感受和边界，再继续讨论。',
    firm: '我需要你尊重我已经表达的意愿。',
    exit: '我现在先结束这次对话，等安全、平静时再处理。',
  },
}

function isAnalyzeResponse(value: unknown): value is AnalyzeResponse {
  if (!value || typeof value !== 'object') return false
  const data = value as Record<string, unknown>
  const responses = data.responses as Record<string, unknown> | undefined
  return Number.isInteger(data.score) && ['high', 'medium', 'low'].includes(String(data.risk_level))
    && typeof data.summary === 'string' && Array.isArray(data.flags)
    && Array.isArray(data.behavior_profile) && !!responses
    && ['gentle', 'firm', 'exit'].every(key => typeof responses[key] === 'string')
}

export async function POST(request: Request) {
  let body: AnalyzeRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求必须是有效的 JSON' }, { status: 400 })
  }

  const text = body.text?.trim()
  const imageBase64 = body.imageBase64?.trim()
  if (!text && !imageBase64) return NextResponse.json({ error: '请输入文字或上传聊天截图' }, { status: 400 })
  if (text && text.length > MAX_INPUT_LENGTH) {
    return NextResponse.json({ error: `输入不能超过 ${MAX_INPUT_LENGTH} 个字符` }, { status: 400 })
  }

  let mediaType: ReturnType<typeof detectImageMediaType> = null
  if (imageBase64) {
    mediaType = detectImageMediaType(imageBase64)
    if (!mediaType) return NextResponse.json({ error: '仅支持 JPEG、PNG、WebP 或 GIF 图片' }, { status: 400 })
    const estimatedBytes = Math.ceil(imageBase64.length * 3 / 4)
    if (estimatedBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: '截图不能超过 5MB' }, { status: 400 })
    }
  }

  const config = getAIConfig(imageBase64 ? 'vision' : 'text')
  if (!config) return NextResponse.json({ error: 'AI 服务尚未配置' }, { status: 503 })

  try {
    const completion = await config.client.chat.completions.create({
      model: config.model,
      temperature: 0.2,
      ...(imageBase64 ? {} : { response_format: { type: 'json_object' as const } }),
      messages: [
        { role: 'system', content: ANALYZE_SYSTEM_PROMPT },
        imageBase64 && mediaType
          ? {
              role: 'user',
              content: [
                { type: 'text', text: '请读取这张聊天截图并按要求分析。只引用清晰可见的原文。' },
                { type: 'image_url', image_url: { url: `data:${mediaType};base64,${imageBase64}`, detail: 'auto' } },
              ],
            }
          : { role: 'user', content: text! },
      ],
    })
    const parsed = parseModelJSON(completion.choices[0]?.message?.content ?? '')
    return NextResponse.json(isAnalyzeResponse(parsed) ? parsed : fallback)
  } catch (error) {
    return NextResponse.json(fallback, { headers: { 'X-AI-Fallback': getSafeAIErrorCode(error) } })
  }
}
