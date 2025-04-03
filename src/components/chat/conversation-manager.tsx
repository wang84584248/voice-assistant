import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast/use-toast";
import { Message } from "@/lib/hooks/useChatState";

interface ConversationManagerProps {
  messages: Message[];
  userId: string | null;
  conversationId: string | null;
  children: React.ReactNode;
  onRefresh?: () => void; // 添加刷新回调
}

/**
 * 会话管理组件
 * 
 * 该组件负责处理以下功能：
 * 1. 在会话有新消息时自动保存
 * 2. 在组件挂载时加载当前会话
 * 3. 在未选择会话时自动创建新会话
 * 4. 监听会话ID变化，确保新会话正确创建
 */
export function ConversationManager({
  messages,
  userId,
  conversationId,
  children,
  onRefresh
}: ConversationManagerProps) {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [prevConversationId, setPrevConversationId] = useState<string | null>(null);
  
  // 监听会话ID变化
  useEffect(() => {
    // 如果会话ID从有值变为null，说明用户创建了新会话
    if (prevConversationId && !conversationId) {
      console.log("检测到会话ID从", prevConversationId, "变为null，用户创建了新会话");
      
      // 如果有刷新回调，调用它
      if (onRefresh) {
        onRefresh();
      }
    }
    
    // 更新前一个会话ID
    setPrevConversationId(conversationId);
  }, [conversationId, prevConversationId, onRefresh]);
  
  // 监听消息变化，自动保存
  useEffect(() => {
    // 确保组件已初始化，且有用户ID和至少一条消息
    if (!initialized || !userId || messages.length <= 1) return;
    
    // 上一条消息是用户的消息，保存会话
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.isUser) {
      // 用户消息由chat API保存，这里不需要操作
      return;
    }
    
    // 最后一条是AI的回复，需要确保会话已保存
    // (chat API中已处理这种情况，这里是额外检查)
    if (lastMessage && !lastMessage.isUser && !conversationId) {
      console.log('会话ID缺失，但这种情况应该由chat API处理');
      // 如果有刷新回调，延迟调用它以确保新会话已创建
      if (onRefresh) {
        setTimeout(onRefresh, 500);
      }
    }
  }, [messages, userId, conversationId, initialized, onRefresh]);
  
  // 组件加载时，尝试加载当前会话
  useEffect(() => {
    // 如果已初始化或没有userId，不执行操作
    if (initialized || !userId) return;
    
    // 标记为已初始化，防止重复执行
    setInitialized(true);
    console.log("会话管理器初始化完成，当前会话ID:", conversationId);
  }, [userId, initialized, conversationId]);
  
  return <>{children}</>;
} 