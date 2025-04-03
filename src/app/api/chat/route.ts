import { NextRequest } from 'next/server';
import { streamingChat } from '@/lib/services/llm';
import { 
  addMessageToConversation, 
  convertToLLMMessages, 
  createConversation, 
  generateTempUserId, 
  getUserConversation 
} from '@/lib/services/conversation';
import { IConversation } from '@/lib/models/conversation';
import { 
  generateRequestId, 
  logError, 
  logInfo 
} from '@/lib/utils/logging';
import {
  createEncoder,
  createStreamHandler,
  createStreamResponse,
  sendCompleteMessage,
  sendContentChunk,
  sendErrorMessage
} from '@/lib/services/stream';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // 唯一请求ID用于跟踪
  const requestId = generateRequestId();
  
  if (!process.env.DASH_SCOPE_API_KEY) {
    logError('缺少API密钥', null, requestId);
    return new Response(
      JSON.stringify({ error: '缺少API密钥，请配置DASH_SCOPE_API_KEY环境变量' }),
      { status: 500 }
    );
  }

  try {
    const { message, conversationId, userId = generateTempUserId() } = await request.json();
    
    logInfo('新请求', { userId, conversationIdExists: !!conversationId }, requestId);
    
    if (!message) {
      return new Response(JSON.stringify({ error: '消息不能为空' }), { status: 400 });
    }

    // 获取或创建对话
    const conversation = await getOrCreateConversation(message, userId, conversationId, requestId);

    // 将对话历史转换为LLM接受的格式
    const messages = convertToLLMMessages(conversation);
    logInfo('准备调用LLM', { messagesCount: messages.length }, requestId);
    
    // 创建流式响应
    const encoder = createEncoder();
    const stream = createStreamHandler(async (controller) => {
      await handleStreamResponse(controller, encoder, messages, conversation, requestId);
    });

    return createStreamResponse(stream);
  } catch (error) {
    logError('处理消息时出错', error, requestId);
    return new Response(JSON.stringify({ error: '处理请求时出错' }), { status: 500 });
  }
}

// 获取或创建对话
async function getOrCreateConversation(
  message: string,
  userId: string,
  conversationId: string | null | undefined,
  requestId: string
): Promise<IConversation> {
  if (conversationId) {
    // 添加用户消息到现有对话
    const result = await addMessageToConversation(conversationId, {
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    if (!result) {
      logInfo(`对话ID ${conversationId} 不存在，创建新对话`, undefined, requestId);
      // 如果对话不存在，创建新的对话
      return await createConversation(userId, {
        role: 'user',
        content: message,
        timestamp: new Date()
      });
    } else {
      return result;
    }
  } else {
    // 尝试查找现有对话
    const existingConversation = await getUserConversation(userId);
    
    if (existingConversation) {
      logInfo(`找到用户 ${userId} 的现有对话`, undefined, requestId);
      // 添加到现有对话
      const result = await addMessageToConversation(existingConversation._id.toString(), {
        role: 'user',
        content: message,
        timestamp: new Date()
      });
      return result!;
    } else {
      logInfo(`为用户 ${userId} 创建新对话`, undefined, requestId);
      // 创建新对话
      return await createConversation(userId, {
        role: 'user',
        content: message,
        timestamp: new Date()
      });
    }
  }
}

// 处理流式响应
async function handleStreamResponse(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  messages: any[],
  conversation: IConversation,
  requestId: string
): Promise<void> {
  let assistantResponse = '';

  try {
    const chatStream = await streamingChat(messages);
    logInfo('LLM流开始', undefined, requestId);
    
    // 处理流式输出
    for await (const chunk of chatStream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        assistantResponse += content;
        // 发送块数据给客户端
        sendContentChunk(controller, encoder, content);
        
        // 添加适当的延迟以确保前端能够正确处理每个块
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    logInfo('LLM流结束，保存响应', { responseLength: assistantResponse.length }, requestId);
    
    if (assistantResponse.trim()) {
      // 流结束后，将完整的助手回复存入数据库
      await addMessageToConversation(conversation._id.toString(), {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      });
    } else {
      logInfo('空响应，不保存', undefined, requestId);
    }
    
    // 发送完成标志
    sendCompleteMessage(controller, encoder, conversation._id.toString());
    
    logInfo('请求完成', undefined, requestId);
  } catch (error) {
    logError('流式输出错误', error, requestId);
    
    // 尝试记录错误消息到会话
    try {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      await addMessageToConversation(conversation._id.toString(), {
        role: 'assistant',
        content: `处理请求时出错: ${errorMessage}`,
        timestamp: new Date()
      });
    } catch (dbError) {
      logError('无法记录错误到数据库', dbError, requestId);
    }
    
    sendErrorMessage(controller, encoder, '处理请求时出错');
  } finally {
    controller.close();
  }
} 