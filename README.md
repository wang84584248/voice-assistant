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
- 集成式侧边栏会话管理
- 响应式设计，适配移动端和桌面端

## 项目结构

```
/voice-assistant
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API路由
│   │   │   ├── chat/       # 聊天API
│   │   │   └── conversations/  # 会话管理API
│   │   │       └── [id]/   # 单个会话API
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页（带侧边栏的聊天界面）
│   ├── components/         # 组件目录
│   │   ├── chat/           # 聊天相关组件
│   │   │   ├── chat-header.tsx      # 聊天头部组件
│   │   │   ├── chat-input.tsx       # 聊天输入组件
│   │   │   ├── conversation-list.tsx # 会话列表组件
│   │   │   ├── conversation-manager.tsx # 会话管理组件
│   │   │   ├── loading-indicator.tsx # 加载指示器
│   │   │   ├── message-bubble.tsx   # 消息气泡组件
│   │   │   └── message-list.tsx     # 消息列表组件
│   │   └── ui/             # 通用UI组件 (shadcn/ui)
│   │       ├── app-header.tsx # 应用标题头部
│   │       ├── chat-container.tsx # 聊天容器
│   │       ├── sidebar.tsx # 侧边栏组件
│   │       ├── button.tsx  # 按钮组件
│   │       ├── card.tsx    # 卡片组件
│   │       ├── input.tsx   # 输入组件
│   │       ├── label.tsx   # 标签组件
│   │       ├── form.tsx    # 表单组件
│   │       └── toast/      # 提示组件
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
│           ├── index.ts    # 工具函数导出
│           ├── logging.ts  # 日志工具
│           └── tailwind.ts # Tailwind工具函数
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
- **`src/components/chat/conversation-manager.tsx`**: 会话管理组件，处理会话状态
- **`src/components/ui/sidebar.tsx`**: 侧边栏组件，集成会话列表管理
- **`src/components/ui/chat-container.tsx`**: 聊天容器组件，统一管理聊天界面

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
- **`src/app/page.tsx`**: 主页面，集成侧边栏会话列表和聊天界面

### 工具函数

- **`src/lib/utils/tailwind.ts`**: Tailwind CSS工具函数，用于合并类名
- **`src/lib/utils/logging.ts`**: 日志工具函数，用于记录系统运行信息
- **`src/lib/utils/index.ts`**: 工具函数统一导出

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
5. **集成式侧边栏**: 在主页面直接通过侧边栏管理会话，无需跳转页面，提升用户体验

## 侧边栏会话管理功能

1. 点击主页面左上角的菜单按钮打开侧边栏，显示所有历史会话
2. 侧边栏列出用户的所有历史会话，显示会话标题和按日期分组管理
3. 点击任意会话可在当前页面加载该会话内容，无需页面跳转
4. 在侧边栏可以点击"开启新对话"按钮开始一个新的会话
5. 在侧边栏可以点击会话卡片右侧的删除按钮删除特定会话
6. 移动端上，选择会话后侧边栏会自动关闭，提供更好的移动端体验

## 代码优化

1. **模块化结构**: 项目采用严格的模块化结构，各组件和功能模块职责明确
2. **工具函数统一管理**: 通过`utils`目录集中管理和导出工具函数
3. **类型安全**: 全面使用TypeScript类型定义，提高代码质量和开发体验
4. **组件复用**: 基于shadcn/ui的组件系统，提高UI一致性和开发效率
5. **统一样式管理**: 使用Tailwind CSS和自定义工具函数统一管理样式

## 开发计划

- [x] 基础聊天界面
- [x] 流式响应
- [x] Markdown渲染支持
- [x] 集成式侧边栏会话管理
- [x] 代码优化和重构
- [ ] 完成语音识别(ASR)集成
- [ ] 完成语音合成(TTS)集成
- [ ] 多主题支持
- [ ] 用户认证
- [ ] 对话导出功能

## 贡献

欢迎提交PR和Issues来帮助改进这个项目。

## 许可

MIT
