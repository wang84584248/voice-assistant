# 语音助手 (Voice Assistant)

这是一个基于Next.js、TypeScript、Tailwind CSS、shadcn/ui和MongoDB构建的语音助手应用程序。

## 技术栈

- **前端框架**: Next.js (App Router)
- **UI组件**: shadcn/ui
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **数据库**: MongoDB
- **图标**: Lucide Icons

## 功能

- 聊天界面
- 文字消息输入
- 语音输入支持（待实现）
- 消息历史保存

## 项目结构

```
/voice-assistant
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API路由
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # 组件目录
│   │   └── ui/             # UI组件
│   └── lib/                # 工具库
│       ├── db/             # 数据库相关
│       │   ├── mongodb.ts  # MongoDB连接
│       │   └── types.d.ts  # 类型定义
│       ├── models/         # 数据模型
│       │   └── user.ts     # 用户模型
│       └── utils.ts        # 实用工具函数
├── public/                 # 静态资源
├── .env.local              # 环境变量
└── package.json            # 项目依赖
```

## 快速开始

1. 确保已安装Node.js和npm
2. 克隆项目
3. 安装依赖:
   ```bash
   npm install
   ```
4. 配置MongoDB连接（在.env.local文件中）
5. 启动开发服务器:
   ```bash
   npm run dev
   ```
6. 在浏览器中访问 http://localhost:3000

## 开发计划

- [ ] 添加实际的语音识别功能
- [ ] 接入语音合成
- [ ] 实现更智能的对话响应
- [ ] 添加用户认证
- [ ] 优化移动端体验

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
