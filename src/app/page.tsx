"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useChatState } from "@/lib/hooks/useChatState";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
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

  const navigateToConversations = () => {
    router.push("/conversations");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md mb-4 flex justify-end">
        <Button variant="outline" onClick={navigateToConversations} className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <span>会话历史</span>
        </Button>
      </div>
      
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
