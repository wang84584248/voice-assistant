import React from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  content, 
  isUser, 
  isStreaming = false 
}) => {
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* 头像区域 */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
        isUser 
          ? 'bg-blue-600' 
          : 'bg-violet-600'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      {/* 消息内容 */}
      <div 
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
        }`}
      >
        {isUser ? (
          <div className="text-sm md:text-base leading-relaxed">{content}</div>
        ) : (
          <div className="prose prose-sm md:prose-base max-w-none prose-invert prose-p:my-1 prose-pre:my-0 prose-headings:mb-1 prose-headings:mt-2">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        )}
        {isStreaming && (
          <span className="inline-block w-1.5 h-5 ml-0.5 bg-gray-400 rounded-full animate-pulse"></span>
        )}
      </div>
    </div>
  );
}; 