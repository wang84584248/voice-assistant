import React from "react";
import { Mic, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="flex w-full items-center space-x-2">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onToggleListen}
        className={`flex-shrink-0 rounded-full h-10 w-10 ${
          isListening 
            ? 'bg-red-900/30 text-red-400 hover:bg-red-800/50' 
            : 'bg-gray-800 hover:bg-gray-700'
        }`}
        disabled={isLoading}
        title={isListening ? "停止语音输入" : "开始语音输入"}
      >
        <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
      </Button>
      
      <div className="relative flex-1">
        <Input
          className="w-full rounded-full border-gray-700 bg-gray-800 pl-4 pr-12 py-6 text-base shadow-sm focus-visible:ring-blue-500 text-gray-200"
          placeholder="输入消息或按语音按钮说话..."
          value={value}
          onChange={onChange}
          onKeyDown={onKeyPress}
          disabled={isLoading || isListening}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onSend}
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 rounded-full h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading || isListening || !value.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}; 