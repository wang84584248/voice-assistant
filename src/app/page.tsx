"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "你好！我是你的语音助手，有什么我可以帮助你的吗？", isUser: false },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // 添加用户消息
    setMessages([...messages, { text: input, isUser: true }]);
    
    try {
      setIsLoading(true);
      
      // 调用API
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '发送消息失败');
      }
      
      // 添加助手回复
      setMessages(prev => [...prev, { 
        text: data.reply, 
        isUser: false 
      }]);
    } catch (error) {
      console.error('发送消息时出错:', error);
      // 显示错误消息
      setMessages(prev => [...prev, { 
        text: '抱歉，处理您的请求时出现了问题。请稍后再试。', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // 这里可以添加实际的语音识别逻辑
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">语音助手</CardTitle>
        </CardHeader>
        
        <CardContent className="h-[60vh] overflow-y-auto flex flex-col space-y-4 p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </CardContent>
        
        <CardFooter className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleListening}
            disabled={isLoading}
            className={isListening ? 'bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600' : ''}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Input
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          
          <Button size="icon" onClick={handleSend} disabled={isLoading}>
            <Send className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
