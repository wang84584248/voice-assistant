"use client";

import { useState, useEffect } from "react";
import { useChatState, Message } from "@/lib/hooks/useChatState";
import { ConversationList } from "@/components/chat/conversation-list";
import { useToast } from "@/components/ui/toast/use-toast";
import { ChatContainer } from "@/components/ui/chat-container";
import { Sidebar } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { ConversationManager } from "@/components/chat/conversation-manager";

// 从conversation-list.tsx导入的类型定义
interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

export default function Home() {
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const {
    input,
    messages,
    setMessages,
    isListening,
    isLoading,
    streamingMessage,
    messagesEndRef,
    handleInputChange,
    sendMessage,
    toggleListening,
    handleKeyPress,
    clearConversation,
    loadConversation,
    conversationId
  } = useChatState();

  // 获取用户ID
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) return storedId;
      
      const newId = `user_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('userId', newId);
      return newId;
    }
    return '';
  };

  // 获取所有会话
  const fetchConversations = async () => {
    try {
      setSidebarLoading(true);
      const userId = getUserId();
      const response = await fetch(`/api/conversations?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error("获取会话列表失败");
      }
      
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("获取会话列表出错:", error);
    } finally {
      setSidebarLoading(false);
    }
  };

  // 页面加载时获取会话列表
  useEffect(() => {
    fetchConversations();
  }, []);
  
  // 选择会话并加载消息
  const handleSelectConversation = async (id: string) => {
    try {
      setIsLoadingMessages(true);
      
      // 加载会话消息
      await loadConversation(id);
      
      // 在移动设备上选择会话后自动关闭侧边栏
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error("获取会话详情出错:", error);
      toast({
        title: "加载失败",
        description: "无法加载会话内容，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // 删除会话
  const deleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId: id }),
      });

      if (!response.ok) {
        throw new Error("删除会话失败");
      }

      // 更新会话列表
      setConversations(conversations.filter(conv => conv.id !== id));
      
      // 如果删除的是当前会话，清空聊天
      if (id === conversationId) {
        clearConversation();
      }
    } catch (error) {
      console.error("删除会话出错:", error);
    }
  };

  // 创建新会话
  const handleNewConversation = () => {
    clearConversation();
    // 关闭侧边栏
    setShowSidebar(false);
    // 确保conversationId被清除
    console.log("创建新会话，会话ID已清除");
  };

  // 添加一个函数来在发送消息后刷新会话列表
  const refreshConversations = () => {
    // 延迟500毫秒，确保数据库操作完成
    setTimeout(() => {
      fetchConversations();
    }, 500);
  };

  // 包装sendMessage函数，发送消息后刷新会话列表
  const handleSendMessage = async () => {
    await sendMessage();
    // 如果是新会话，发送消息后刷新会话列表
    if (!conversationId) {
      refreshConversations();
    }
  };

  // 切换侧边栏显示
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    if (!showSidebar) {
      fetchConversations();
    }
  };

  // 获取用户ID
  const userId = getUserId();

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* 侧边栏 */}
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}>
        <ConversationList
          conversations={conversations}
          onDelete={deleteConversation}
          onNewConversation={handleNewConversation}
          isLoading={sidebarLoading}
          currentConversationId={conversationId || ''}
          onSelectConversation={handleSelectConversation}
        />
      </Sidebar>
      
      {/* 主内容区 */}
      <ConversationManager
        messages={messages}
        userId={userId}
        conversationId={conversationId}
        onRefresh={refreshConversations}
      >
        <div className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-full">
          <AppHeader 
            title="语音助手"
            showSidebar={showSidebar}
            onToggleSidebar={toggleSidebar}
          />
          
          <ChatContainer
            title="智能语音助手"
            messages={messages.map(msg => ({
              id: msg.id,
              text: msg.text || "",
              isUser: Boolean(msg.isUser),
              timestamp: msg.timestamp
            }))}
            streamingMessage={streamingMessage || ""}
            isLoading={isLoading}
            isLoadingMessages={isLoadingMessages}
            isListening={isListening}
            inputValue={input}
            messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
            onClearChat={clearConversation}
            onInputChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onSendMessage={handleSendMessage}
            onToggleListen={toggleListening}
          />
        </div>
      </ConversationManager>
    </div>
  );
}
