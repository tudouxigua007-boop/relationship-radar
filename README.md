# 关系雷达 Relationship Radar

帮助年轻女孩识别流行文化中被浪漫化但实际不健康的行为模式。

## 快速开始

```bash
npm install
npm run dev
```

然后打开 http://localhost:3000

## 需要设置的环境变量

复制 `.env.example` 为 `.env.local`，填入你的 DeepSeek API Key：

```bash
cp .env.example .env.local
```

## 项目结构

```
src/
├── app/                    ← 页面和 API 路由
│   ├── page.js             ← 首页
│   ├── layout.js           ← 全局布局
│   ├── globals.css         ← 全局样式
│   ├── analyze/
│   │   └── page.js         ← 【A 负责】聊天分析页面
│   ├── simulate/
│   │   └── page.js         ← 【A 负责】模拟对话页面
│   └── api/
│       ├── analyze/
│       │   └── route.js    ← 【B 负责】聊天分析 API
│       └── simulate/
│           └── route.js    ← 【B 负责】模拟对话 API
├── components/             ← 【A 负责】可复用组件
└── prompts/                ← 【C 负责】AI Prompt 和行为模式库
    ├── analysis.js         ← 分析用的 system prompt
    ├── simulation.js       ← 模拟对话的 system prompt
    └── patterns.json       ← 不健康行为模式库
```
