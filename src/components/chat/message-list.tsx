import React, { useEffect } from 'react';
import { MessageBubble } from './message-bubble';
import { LoadingIndicator } from './loading-indicator';
import { Message } from '@/lib/hooks/useChatState';

interface MessageListProps {
  messages: Message[];
  streamingMessage: string;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  streamingMessage,
  isLoading,
  messagesEndRef
}) => {
  // 调试渲染
  useEffect(() => {
    console.log('[Debug] MessageList 重新渲染', { 
      messagesCount: messages.length,
      hasStreamingMessage: !!streamingMessage,
      streamingMessageLength: streamingMessage?.length || 0
    });
  }, [messages, streamingMessage]);

  return (
    <div className="h-[60vh] overflow-y-auto flex flex-col space-y-6 p-4">
      {/* 消息历史记录 */}
      {messages.map((message, index) => (
        <div key={`message-container-${index}`} className="w-full">
          <MessageBubble 
            key={`message-${index}`}
            content={message.text}
            isUser={message.isUser}
          />
        </div>
      ))}
      
      {/* 显示正在流式接收的消息 */}
      {streamingMessage && (
        <div className="w-full">
          <MessageBubble 
            key="streaming-message"
            content={streamingMessage}
            isUser={false}
            isStreaming={true}
          />
        </div>
      )}
      
      {/* 显示加载指示器 */}
      {isLoading && !streamingMessage && (
        <div className="w-full">
          <LoadingIndicator />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}; 