// === 分析 API ===

export interface AnalyzeRequest {
  text?: string
  imageBase64?: string
}

export interface Flag {
  quote: string
  pattern: string
  explanation: string
  suggestion: string
}

export interface BehaviorProfile {
  type: string
  percentage: number
}

export interface AnalyzeResponse {
  score: number
  risk_level: 'high' | 'medium' | 'low'
  summary: string
  flags: Flag[]
  behavior_profile: BehaviorProfile[]
  responses: {
    gentle: string
    firm: string
    exit: string
  }
}

// === 对话 API ===

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  session_id: string
  messages: ChatMessage[]
  context?: {
    flags: Flag[]
    behavior_profile: BehaviorProfile[]
  }
}

export interface ChatResponse {
  pattern: string
  analysis: string
  suggestion: string
  encouragement?: string
}

// === Session 持久化 ===

export interface Session {
  id: string
  createdAt: string
  input: {
    type: 'text' | 'image'
    text?: string
  }
  report?: AnalyzeResponse
  chat: ChatMessage[]
}
