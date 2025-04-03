"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConversationList } from "@/components/chat/conversation-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // 使用临时用户ID（实际应用中，应该使用认证系统的用户ID）
  const userId = localStorage.getItem('userId') || 
    (() => {
      const id = `user_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('userId', id);
      return id;
    })();

  // 获取所有会话
  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/conversations?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error("获取会话列表失败");
      }
      
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("获取会话列表出错:", error);
      toast({
        title: "加载失败",
        description: "无法加载会话列表，请刷新重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
    } catch (error) {
      console.error("删除会话出错:", error);
      throw error;
    }
  };

  // 创建新会话
  const handleNewConversation = () => {
    router.push("/");
  };

  // 返回聊天页面
  const handleBackToChat = () => {
    router.push("/");
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={handleBackToChat} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">会话管理</h1>
      </div>

      <ConversationList
        conversations={conversations}
        onDelete={deleteConversation}
        onNewConversation={handleNewConversation}
        isLoading={isLoading}
      />
    </div>
  );
} 