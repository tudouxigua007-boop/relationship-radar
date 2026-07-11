import 'server-only'

import OpenAI from 'openai'

export const AI_TIMEOUT_MS = 60_000

export function getAIConfig(kind: 'text' | 'vision' = 'text') {
  const apiKey = process.env.DOUBAO_API_KEY
  const baseURL = process.env.DOUBAO_BASE_URL
  const model = kind === 'vision'
    ? process.env.DOUBAO_VISION_MODEL
    : process.env.DOUBAO_TEXT_MODEL

  if (!apiKey || !baseURL || !model) return null

  return {
    client: new OpenAI({ apiKey, baseURL, timeout: AI_TIMEOUT_MS, maxRetries: 0 }),
    model,
  }
}

export function detectImageMediaType(base64: string) {
  if (base64.startsWith('/9j/')) return 'image/jpeg' as const
  if (base64.startsWith('iVBORw0KGgo')) return 'image/png' as const
  if (base64.startsWith('UklGR')) return 'image/webp' as const
  if (base64.startsWith('R0lGOD')) return 'image/gif' as const
  return null
}

export function parseModelJSON(value: string): unknown {
  const cleaned = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  return JSON.parse(cleaned)
}

export function getSafeAIErrorCode(error: unknown) {
  if (!error || typeof error !== 'object') return 'unknown'
  const value = error as { status?: unknown; code?: unknown; name?: unknown }
  const status = typeof value.status === 'number' ? value.status : 'no-status'
  const code = typeof value.code === 'string' ? value.code.replace(/[^a-zA-Z0-9_-]/g, '') : ''
  const name = typeof value.name === 'string' ? value.name.replace(/[^a-zA-Z0-9_-]/g, '') : 'Error'
  return [status, code || name].join(':')
}
