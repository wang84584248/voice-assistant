import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";

interface Message {
  id?: string;
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

interface ChatContainerProps {
  title: string;
  messages: Message[];
  streamingMessage?: string;
  isLoading: boolean;
  isLoadingMessages?: boolean;
  isListening: boolean;
  inputValue: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onClearChat: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  onToggleListen: () => void;
}

export function ChatContainer({
  title,
  messages,
  streamingMessage = "",
  isLoading,
  isLoadingMessages = false,
  isListening,
  inputValue,
  messagesEndRef,
  onClearChat,
  onInputChange,
  onKeyPress,
  onSendMessage,
  onToggleListen
}: ChatContainerProps) {
  return (
    <Card className="w-full max-w-3xl bg-gray-900 border-gray-800 shadow-xl rounded-xl overflow-hidden">
      <ChatHeader title={title} onClear={onClearChat} />
      
      <CardContent className="p-0">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-[65vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <MessageList 
            messages={messages}
            streamingMessage={streamingMessage}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 bg-gray-900 p-4">
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          onSend={onSendMessage}
          onToggleListen={onToggleListen}
          isLoading={isLoading || isLoadingMessages}
          isListening={isListening}
        />
      </CardFooter>
    </Card>
  );
} 