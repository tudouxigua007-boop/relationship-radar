# 关系雷达 — CLAUDE.md

> 每个队友开 AI 编程对话时，先喂这个文件作为上下文。

## 项目概述

一天制黑客松项目。关系雷达帮助年轻女性识别聊天记录中被浪漫化但不健康的关系行为模式。

## 技术栈

- **框架**：Next.js 14 (App Router) + TypeScript
- **样式**：Tailwind CSS
- **AI 模型**：Doubao（火山引擎），通过 OpenAI SDK 兼容接口调用
- **部署**：Vercel（或本地演示）
- **目标平台**：移动端优先网页

## 项目结构

```
relationship-radar/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 全局布局（导航栏 + 容器）
│   │   ├── page.tsx            # 首页 + 分析报告（同一页面）
│   │   ├── globals.css         # 全局样式 + CSS 变量
│   │   ├── chat/
│   │   │   └── page.tsx        # 多轮对话页
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts    # 分析 API
│   │       └── chat/
│   │           └── route.ts    # 对话 API
│   ├── types/
│   │   └── index.ts            # 共享 TypeScript 类型
│   └── lib/                    # 工具函数
├── PRD.md                      # 产品需求文档
├── CLAUDE.md                   # 本文件
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 页面结构

只有两个页面：
1. **首页 `/`**：输入区域（截图/文字 tab 切换）+ 扫描后报告在下方展开
2. **对话页 `/chat`**：多轮对话，用户发对方的回复，AI 分析套路并给建议

## API 接口契约

### POST /api/analyze

分析聊天内容，返回报告。

**请求**：
```json
{
  "text": "聊天文本（与 imageBase64 二选一）",
  "imageBase64": "截图的 base64 编码（与 text 二选一）"
}
```

**响应**：
```json
{
  "score": 72,
  "risk_level": "high | medium | low",
  "summary": "一句话总结",
  "flags": [
    {
      "quote": "原文引用",
      "pattern": "行为模式名称",
      "explanation": "通俗解释",
      "suggestion": "建议回应"
    }
  ],
  "behavior_profile": [
    { "type": "控制型", "percentage": 80 }
  ],
  "responses": {
    "gentle": "温和回应",
    "firm": "明确回应",
    "exit": "离场回应"
  }
}
```

### POST /api/chat

多轮对话，持续分析。

**请求**：
```json
{
  "session_id": "会话ID",
  "messages": [
    { "role": "user", "content": "ta 说了..." },
    { "role": "assistant", "content": "上一轮的建议" }
  ],
  "context": {
    "flags": [],
    "behavior_profile": []
  }
}
```

**响应**：
```json
{
  "pattern": "反向内疚操控",
  "analysis": "套路分析",
  "suggestion": "建议回应",
  "encouragement": "正向反馈（可选）"
}
```

## 分工

- **A（前端）**：`src/app/page.tsx`、`src/app/chat/page.tsx`、`src/app/layout.tsx`、`globals.css`、所有 UI 组件
- **B（后端 + AI）**：`src/app/api/` 下两个 route、Doubao API 集成、prompt 编写
- **C（内容 + 演示）**：行为模式库、prompt 调优、预设案例、演示 PPT

## 协作规则

- 按上面分工各写各的文件，避免冲突
- API 路由目前有 mock 数据，前端可以直接联调
- 队友B实现真实 AI 调用后替换 mock
- 提交前确认不包含 `.env` 或 API key

## 设计规范

- 主色：`#e84393`（粉色）
- 移动端优先，max-width: 32rem (lg)
- 卡片圆角：`rounded-xl`（0.75rem）
- 安全原则：分析行为不诊断个人，不替用户做决定

## 环境变量

```
DOUBAO_API_KEY=xxx
DOUBAO_MODEL_ENDPOINT=xxx
```

## 运行

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```
