"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useChatState, Message } from "@/lib/hooks/useChatState";
import { useParams, useRouter } from "next/navigation";
import { IMessage } from "@/lib/models/conversation";
import { useToast } from "@/components/ui/toast/use-toast";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // 获取会话ID
  const conversationId = params.id as string;
  
  const {
    input,
    messages,
    setMessages,
    isListening,
    isLoading: chatIsLoading,
    streamingMessage,
    messagesEndRef,
    handleInputChange,
    sendMessage: baseSendMessage,
    toggleListening,
    handleKeyPress,
    clearConversation
  } = useChatState("", conversationId);

  // 获取特定会话的详情
  const fetchConversation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/conversations/${conversationId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // 会话不存在，返回主页
          toast({
            title: "会话不存在",
            description: "请选择其他会话或创建新会话",
            variant: "destructive"
          });
          router.push("/");
          return;
        }
        throw new Error("获取会话详情失败");
      }
      
      const data = await response.json();
      
      // 转换消息格式
      const formattedMessages: Message[] = data.messages.map((msg: IMessage) => ({
        id: Math.random().toString(36).substring(2, 15),
        text: msg.content,
        isUser: msg.role === 'user',
        timestamp: new Date(msg.timestamp)
      }));
      
      // 设置消息列表
      setMessages(formattedMessages);
    } catch (error) {
      console.error("获取会话详情出错:", error);
      toast({
        title: "加载失败",
        description: "无法加载会话，请返回会话列表",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 返回会话列表
  const handleBackToList = () => {
    router.push("/conversations");
  };

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <ChatHeader 
          title="会话详情" 
          onClear={clearConversation}
          showBackButton={true}
          onBack={handleBackToList}
        />
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <MessageList 
              messages={messages}
              streamingMessage={streamingMessage}
              isLoading={chatIsLoading}
              messagesEndRef={messagesEndRef}
            />
          )}
        </CardContent>
        
        <CardFooter>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onSend={baseSendMessage}
            onToggleListen={toggleListening}
            isLoading={chatIsLoading || isLoading}
            isListening={isListening}
          />
        </CardFooter>
      </Card>
    </div>
  );
} 