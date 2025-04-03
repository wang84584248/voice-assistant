import React, { useEffect } from 'react';
import { MessageBubble } from './message-bubble';
import { LoadingIndicator } from './loading-indicator';

interface MessageListProps {
  messages: Array<{
    id?: string;
    text: string;
    isUser: boolean;
    timestamp?: Date;
  }>;
  streamingMessage?: string;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
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

  // 如果没有消息，显示欢迎信息
  if (messages.length === 0 && !streamingMessage && !isLoading) {
    return (
      <div className="h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent p-4 md:p-6">
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-3xl shadow-lg">
            AI
          </div>
          <h3 className="text-xl font-medium text-gray-200">
            欢迎使用智能语音助手
          </h3>
          <p className="text-gray-400 max-w-sm">
            您可以通过语音或文字与我对话，我会尽力回答您的问题。试着问我任何问题吧！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent flex flex-col space-y-1 p-4 md:p-6">
      {/* 消息历史记录 */}
      {messages.map((message, index) => (
        <div key={`message-container-${message.id || index}`} className="w-full">
          <MessageBubble 
            key={`message-${message.id || index}`}
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
        <div className="w-full flex justify-center py-4">
          <LoadingIndicator />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}; 