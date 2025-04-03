import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Plus } from "lucide-react";
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
}

export function ConversationList({
  conversations,
  onDelete,
  onNewConversation,
  isLoading,
  currentConversationId
}: ConversationListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleConversationClick = (id: string) => {
    router.push(`/chat/${id}`);
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
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">会话历史</h2>
        <Button onClick={onNewConversation} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          <span>新对话</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : conversations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <MessageSquare className="mx-auto h-12 w-12 opacity-50 mb-2" />
            <p>暂无会话记录</p>
            <Button onClick={onNewConversation} variant="ghost" className="mt-2">
              开始新对话
            </Button>
          </CardContent>
        </Card>
      ) : (
        conversations.map((conversation) => (
          <Card 
            key={conversation.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              currentConversationId === conversation.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{conversation.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {formatDate(conversation.updatedAt)} · {conversation.messageCount} 条消息
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDelete(e, conversation.id)}
                  className="h-8 w-8 rounded-full"
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
} 