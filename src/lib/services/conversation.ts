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

// 获取用户的所有会话
export async function getAllUserConversations(userId: string): Promise<IConversation[]> {
  await connectToDatabase();
  return ConversationModel.find({ userId }).sort({ updatedAt: -1 });
}

// 获取特定会话
export async function getConversationById(conversationId: string): Promise<IConversation | null> {
  await connectToDatabase();
  return ConversationModel.findById(conversationId);
}

// 删除特定会话
export async function deleteConversation(conversationId: string): Promise<boolean> {
  await connectToDatabase();
  const result = await ConversationModel.findByIdAndDelete(conversationId);
  return !!result;
}

// 生成会话的标题
export function generateConversationTitle(conversation: IConversation): string {
  if (!conversation.messages.length) {
    return "新对话";
  }
  
  // 查找第一条用户消息
  const firstUserMessage = conversation.messages.find(m => m.role === 'user');
  if (!firstUserMessage) {
    return "新对话";
  }
  
  // 从第一条用户消息中提取标题
  const content = firstUserMessage.content.trim();
  
  // 如果消息内容太长，截取前20个字符
  if (content.length > 20) {
    return `${content.substring(0, 20)}...`;
  }
  
  return content;
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