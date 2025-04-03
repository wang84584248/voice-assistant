"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useChatState } from "@/lib/hooks/useChatState";

export default function Home() {
  const {
    input,
    messages,
    isListening,
    isLoading,
    streamingMessage,
    messagesEndRef,
    handleInputChange,
    sendMessage,
    toggleListening,
    handleKeyPress,
    clearConversation
  } = useChatState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <ChatHeader title="语音助手" onClear={clearConversation} />
        
        <CardContent>
          <MessageList 
            messages={messages}
            streamingMessage={streamingMessage}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
        </CardContent>
        
        <CardFooter>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onSend={sendMessage}
            onToggleListen={toggleListening}
            isLoading={isLoading}
            isListening={isListening}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
