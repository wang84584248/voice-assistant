import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function POST(request: NextRequest) {
  try {
    // 连接数据库
    await connectToDatabase();
    
    // 解析请求体
    const body = await request.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
    }
    
    // 这里可以添加更复杂的逻辑，如调用外部API进行语音处理
    // 目前只返回一个简单的回复
    const reply = `我收到了你的消息: "${message}"`;
    
    // 在真实应用中，可以保存消息到数据库
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('处理消息时出错:', error);
    return NextResponse.json({ error: '处理请求时出错' }, { status: 500 });
  }
} 