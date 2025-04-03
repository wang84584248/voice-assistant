import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllUserConversations, 
  getConversationById, 
  deleteConversation, 
  generateConversationTitle 
} from '@/lib/services/conversation';
import { logError } from '@/lib/utils/logging';

export const dynamic = 'force-dynamic';

// 获取用户所有会话
export async function GET(request: NextRequest) {
  try {
    // 从URL参数中获取用户ID
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 });
    }
    
    // 获取用户的所有会话
    const conversations = await getAllUserConversations(userId);
    
    // 为每个会话添加标题
    const conversationsWithTitles = conversations.map(conversation => ({
      id: conversation._id.toString(),
      title: generateConversationTitle(conversation),
      updatedAt: conversation.updatedAt,
      messageCount: conversation.messages.length
    }));
    
    return NextResponse.json({ conversations: conversationsWithTitles });
  } catch (error) {
    logError('获取会话列表时出错:', error);
    return NextResponse.json({ error: '处理请求时出错' }, { status: 500 });
  }
}

// 删除特定会话
export async function DELETE(request: NextRequest) {
  try {
    const { conversationId } = await request.json();
    
    if (!conversationId) {
      return NextResponse.json({ error: '会话ID不能为空' }, { status: 400 });
    }
    
    const success = await deleteConversation(conversationId);
    
    if (!success) {
      return NextResponse.json({ error: '会话不存在或删除失败' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('删除会话时出错:', error);
    return NextResponse.json({ error: '处理请求时出错' }, { status: 500 });
  }
} 