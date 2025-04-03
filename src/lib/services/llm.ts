import OpenAI from 'openai';

// 初始化OpenAI客户端，使用DashScope兼容模式
const openai = new OpenAI({
  apiKey: process.env.DASH_SCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
});

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function streamingChat(messages: Message[], signal?: AbortSignal) {
  try {
    const response = await openai.chat.completions.create({
      model: 'qwen-max', // 使用青文大模型
      messages,
      stream: true, // 启用流式输出
      temperature: 0.7, // 控制创造性
      max_tokens: 2000, // 最大输出长度
    }, { signal });

    return response;
  } catch (error) {
    console.error('LLM调用错误:', error);
    throw error;
  }
}

export async function chat(messages: Message[]) {
  try {
    const response = await openai.chat.completions.create({
      model: 'qwen-max',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response;
  } catch (error) {
    console.error('LLM调用错误:', error);
    throw error;
  }
} 