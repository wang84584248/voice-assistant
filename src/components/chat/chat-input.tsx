import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onToggleListen: () => void;
  isLoading: boolean;
  isListening: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSend,
  onToggleListen,
  isLoading,
  isListening
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onToggleListen}
        disabled={isLoading}
        className={isListening ? 'bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600' : ''}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      <Input
        placeholder="输入消息..."
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={isLoading}
        className="flex-1"
      />
      
      <Button size="icon" onClick={onSend} disabled={isLoading}>
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}; 