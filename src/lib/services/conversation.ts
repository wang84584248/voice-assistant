import { connectToDatabase } from '../db/mongodb';
import ConversationModel, { IMessage, IConversation } from '../models/conversation';
import { Message } from './llm';

// 生成临时用户ID（实际应用中应该使用真实的认证系统）
export function generateTempUserId() {
  return `user_${Math.random().toString(36).substring(2, 15)}`;
}

// 获取用户的对话历史
export async function getUserConversation(userId: string): Promise<IConversation | null> {
  await connectToDatabase();
  return ConversationModel.findOne({ userId }).sort({ updatedAt: -1 });
}

// 创建新的对话
export async function createConversation(userId: string, initialMessage?: IMessage): Promise<IConversation> {
  await connectToDatabase();
  
  const messages: IMessage[] = [];
  if (initialMessage) {
    messages.push(initialMessage);
  }
  
  const conversation = new ConversationModel({
    userId,
    messages
  });
  
  await conversation.save();
  return conversation;
}

// 添加消息到对话
export async function addMessageToConversation(
  conversationId: string, 
  message: IMessage
): Promise<IConversation | null> {
  await connectToDatabase();
  
  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) {
    return null;
  }
  
  conversation.messages.push(message);
  await conversation.save();
  
  return conversation;
}

// 将消息列表转换为适用于LLM的消息格式
export function convertToLLMMessages(conversation: IConversation | null): Message[] {
  if (!conversation) {
    return [
      { role: 'system', content: '你是一个有用的AI助手，可以回答用户的问题。' }
    ];
  }
  
  const messages: Message[] = [
    { role: 'system', content: '你是一个有用的AI助手，可以回答用户的问题。' }
  ];
  
  for (const msg of conversation.messages) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
  }
  
  return messages;
} 