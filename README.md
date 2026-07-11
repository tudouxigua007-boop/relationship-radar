# 关系雷达 Relationship Radar

帮助年轻女性识别聊天记录中被浪漫化但实际不健康的关系行为模式。

## 快速开始

```bash
npm install
npm run dev
# 打开 http://localhost:3000
```

## 环境变量

复制 `.env.example` 为 `.env.local`，填入 API Key：

```bash
cp .env.example .env.local
```

豆包（火山方舟）配置：

```env
DOUBAO_API_KEY=
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
DOUBAO_TEXT_MODEL=
DOUBAO_VISION_MODEL=
```

真实密钥只保存在 `.env.local` 或部署平台的环境变量中，不要提交到 GitHub。

## 项目结构

```
src/
├── app/
│   ├── page.tsx            ← 首页 + 分析报告
│   ├── layout.tsx          ← 全局布局
│   ├── globals.css         ← 全局样式
│   ├── chat/
│   │   └── page.tsx        ← 多轮对话页
│   └── api/
│       ├── analyze/
│       │   └── route.ts    ← 分析 API
│       └── chat/
│           └── route.ts    ← 对话 API
├── types/
│   └── index.ts            ← 共享类型
└── lib/                    ← 工具函数
```

## 分工

- **A（前端）**：页面 UI、组件、交互
- **B（后端 + AI）**：API 路由、模型调用、prompt
- **C（内容 + 演示）**：案例库、prompt 调优、演示 PPT

详细说明见 [CLAUDE.md](./CLAUDE.md) 和 [PRD.md](./PRD.md)。

## 安全原则

- 分析具体行为，不给人物下诊断
- 上下文不足时明确说明不确定性
- 不替用户决定是否结束关系
- 涉及威胁/暴力/跟踪时优先提示现实安全
- 不提交真实聊天记录、`.env` 或 API Key

文字输入使用文本模型，聊天截图使用支持图片输入的视觉模型。截图仅在本次请求中发送给模型，不写入数据库。
