import { NextRequest, NextResponse } from 'next/server';
import { getConversationById } from '@/lib/services/conversation';
import { logError } from '@/lib/utils/logging';

export const dynamic = 'force-dynamic';

// 获取特定会话的详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    
    if (!conversationId) {
      return NextResponse.json({ error: '会话ID不能为空' }, { status: 400 });
    }
    
    const conversation = await getConversationById(conversationId);
    
    if (!conversation) {
      return NextResponse.json({ error: '会话不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      id: conversation._id.toString(),
      userId: conversation.userId,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    });
  } catch (error) {
    logError('获取会话详情时出错:', error);
    return NextResponse.json({ error: '处理请求时出错' }, { status: 500 });
  }
} 