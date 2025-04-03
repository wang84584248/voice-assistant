import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Plus, Calendar, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  onDelete: (id: string) => Promise<void>;
  onNewConversation: () => void;
  isLoading: boolean;
  currentConversationId?: string;
  onSelectConversation?: (id: string) => void;
}

export function ConversationList({
  conversations,
  onDelete,
  onNewConversation,
  isLoading,
  currentConversationId,
  onSelectConversation
}: ConversationListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleConversationClick = (id: string) => {
    if (onSelectConversation) {
      onSelectConversation(id);
    } else {
      router.push(`/chat/${id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await onDelete(id);
      toast({
        title: "已删除会话",
        description: "会话已成功删除",
      });
    } catch (error) {
      toast({
        title: "删除失败",
        description: "无法删除会话，请稍后重试",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // 今天的日期
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // 昨天的日期
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // 比较日期部分
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (dateWithoutTime.getTime() === today.getTime()) {
      return "今天";
    } else if (dateWithoutTime.getTime() === yesterday.getTime()) {
      return "昨天";
    } else {
      // 返回年月，例如：2023-01
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
  };

  // 按日期对会话进行分组
  const groupedConversations = conversations.reduce((acc, conversation) => {
    const dateGroup = formatDate(conversation.updatedAt);
    if (!acc[dateGroup]) {
      acc[dateGroup] = [];
    }
    acc[dateGroup].push(conversation);
    return acc;
  }, {} as Record<string, Conversation[]>);

  return (
    <div className="space-y-4">
      {/* 新对话按钮 */}
      <Button 
        onClick={onNewConversation}
        className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
      >
        <Plus className="h-5 w-5" />
        开启新对话
      </Button>

      {isLoading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          <p>暂无历史会话</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 按日期分组显示会话 */}
          {Object.entries(groupedConversations).map(([dateGroup, items]) => (
            <div key={dateGroup} className="space-y-2">
              <h3 className="text-sm text-gray-400 py-1">{dateGroup}</h3>
              {items.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors ${
                    currentConversationId === conversation.id ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <div className="flex justify-between items-center group">
                    <div className="text-gray-200 truncate max-w-[85%]">
                      {conversation.title}
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, conversation.id)}
                      className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 