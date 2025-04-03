# 语音助手 (Voice Assistant)

这是一个基于Next.js、TypeScript、Tailwind CSS、shadcn/ui和MongoDB构建的智能语音助手应用程序。应用支持语音输入、文本对话、Markdown格式的回复渲染以及会话历史管理。

## 技术栈

- **前端框架**: Next.js (App Router)
- **UI组件**: shadcn/ui
- **样式**: Tailwind CSS + @tailwindcss/typography
- **语言**: TypeScript
- **数据库**: MongoDB
- **图标**: Lucide Icons
- **ASR(语音识别)**: 阿里云通义千问ASR (qwen-audio-asr/gummy-chat-v1)
- **LLM(大语言模型)**: 阿里云通义千问大模型 (qwen-max)
- **TTS(语音合成)**: 阿里云通义CoSYVoice (cosyvoice-v1)
- **Markdown渲染**: react-markdown

## 功能

- 现代化的聊天界面
- 支持文字消息输入
- 语音输入支持
- 流式响应显示
- Markdown格式消息渲染
- 会话历史保存与管理
- 对话记录浏览、查看和删除
- 响应式设计，适配移动端和桌面端

## 项目结构

```
/voice-assistant
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API路由
│   │   │   ├── chat/       # 聊天API
│   │   │   └── conversations/  # 会话管理API
│   │   ├── chat/           # 单个会话详情页
│   │   │   └── [id]/       # 动态路由：会话详情
│   │   ├── conversations/  # 会话列表页
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # 组件目录
│   │   ├── chat/           # 聊天相关组件
│   │   │   ├── chat-header.tsx      # 聊天头部组件
│   │   │   ├── chat-input.tsx       # 聊天输入组件
│   │   │   ├── conversation-list.tsx # 会话列表组件
│   │   │   ├── loading-indicator.tsx # 加载指示器
│   │   │   ├── message-bubble.tsx   # 消息气泡组件
│   │   │   └── message-list.tsx     # 消息列表组件
│   │   └── ui/             # 通用UI组件 (shadcn/ui)
│   └── lib/                # 工具库
│       ├── db/             # 数据库相关
│       │   └── mongodb.ts  # MongoDB连接
│       ├── hooks/          # React Hooks
│       │   └── useChatState.ts # 聊天状态管理Hook
│       ├── models/         # 数据模型
│       │   └── conversation.ts # 会话模型
│       ├── services/       # 服务
│       │   ├── conversation.ts # 会话服务
│       │   ├── llm.ts      # 大语言模型服务
│       │   └── stream.ts   # 流式响应服务
│       └── utils/          # 工具函数
│           └── logging.ts  # 日志工具
├── public/                 # 静态资源
├── .env.local              # 环境变量
└── package.json            # 项目依赖
```

## 核心代码文件说明

### 前端组件

- **`src/components/chat/message-bubble.tsx`**: 消息气泡组件，支持Markdown渲染
- **`src/components/chat/message-list.tsx`**: 消息列表组件，展示聊天历史和流式消息
- **`src/components/chat/chat-input.tsx`**: 聊天输入组件，支持文本输入和语音输入切换
- **`src/components/chat/conversation-list.tsx`**: 会话列表组件，展示用户所有历史会话

### 核心功能

- **`src/lib/hooks/useChatState.ts`**: 聊天状态管理Hook，处理消息发送、接收、语音录制等功能
- **`src/lib/services/llm.ts`**: 大语言模型服务，负责调用通义千问API
- **`src/lib/services/stream.ts`**: 流式响应处理服务，提供编码解码和流控制函数
- **`src/app/api/chat/route.ts`**: 聊天API路由，处理消息请求并返回流式响应

### 数据处理

- **`src/lib/services/conversation.ts`**: 会话服务，管理会话创建、检索、删除和标题生成
- **`src/lib/models/conversation.ts`**: 会话数据模型，定义会话和消息的数据结构

### 会话管理

- **`src/app/api/conversations/route.ts`**: 会话列表API，获取用户所有会话和删除会话
- **`src/app/api/conversations/[id]/route.ts`**: 单个会话API，获取特定会话详情
- **`src/app/conversations/page.tsx`**: 会话列表页面，展示所有历史会话
- **`src/app/chat/[id]/page.tsx`**: 会话详情页面，展示特定会话内容

## 快速开始

1. 确保已安装Node.js (v18+)和npm
2. 克隆项目
3. 安装依赖:
   ```bash
   npm install
   ```
4. 配置环境变量（在.env.local文件中）:
   ```
   # MongoDB
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/voice-assistant

   # 阿里云API
   DASHSCOPE_API_KEY=your-api-key
   ```
5. 启动开发服务器:
   ```bash
   npm run dev
   ```
6. 在浏览器中访问 http://localhost:3000

## 特色功能

1. **流式响应**: 大模型响应实时显示，提供更好的用户体验
2. **Markdown渲染**: 支持渲染Markdown格式的消息，使AI回复更加丰富多样
3. **语音交互**: 支持语音输入，未来将支持语音输出，实现完整的语音交互体验
4. **会话管理**: 支持对历史会话的浏览、查看和删除，提供便捷的对话管理体验

## 会话管理功能使用

1. 在主页点击右上角的"会话历史"按钮进入会话列表页面
2. 会话列表页面展示用户的所有历史会话，并显示会话标题、更新时间和消息数量
3. 点击任意会话卡片可进入该会话的详情页面，继续之前的对话
4. 在会话列表页面可以点击"新对话"按钮开始一个新的会话
5. 在会话列表页面可以点击会话右侧的删除按钮删除特定会话
6. 在会话详情页面可以点击左上角的返回按钮返回会话列表

## 开发计划

- [x] 基础聊天界面
- [x] 流式响应
- [x] Markdown渲染支持
- [x] 会话管理界面
- [ ] 完成语音识别(ASR)集成
- [ ] 完成语音合成(TTS)集成
- [ ] 多主题支持
- [ ] 用户认证
- [ ] 对话导出功能

## 贡献

欢迎提交PR和Issues来帮助改进这个项目。

## 许可

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
