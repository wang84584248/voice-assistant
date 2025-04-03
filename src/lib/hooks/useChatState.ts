import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast/use-toast';

export interface Message {
  id?: string;
  role?: 'user' | 'assistant' | 'system';
  content?: string;
  text?: string;
  isUser?: boolean;
  timestamp?: Date;
}

export function useChatState(initialMessage = "你好！我是你的语音助手，有什么我可以帮助你的吗？", existingConversationId?: string) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: initialMessage, isUser: false },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(existingConversationId || null);
  const [userId, setUserId] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // 生成或恢复用户ID和会话ID
  useEffect(() => {
    // 恢复用户ID
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
    
    // 如果没有提供已有会话ID，则尝试从localStorage恢复
    if (!existingConversationId) {
      const storedConversationId = localStorage.getItem('conversationId');
      if (storedConversationId) {
        setConversationId(storedConversationId);
      }
    }
  }, [existingConversationId]);

  // 清除会话状态
  const clearConversation = () => {
    // 直接清除会话，不需要确认
    localStorage.removeItem('conversationId');
    setConversationId(null);
    setMessages([{ text: initialMessage, isUser: false }]);
    setStreamingMessage("");
  };

  // 更新输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // 切换语音识别
  const toggleListening = () => {
    setIsListening(!isListening);
    // 这里可以添加实际的语音识别逻辑
  };

  // 处理键盘回车事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // 添加用户消息
    setMessages(msgs => [...msgs, { text: input, isUser: true }]);
    const userMessage = input;
    setInput("");
    setIsLoading(true);
    
    try {
      // 取消正在进行的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // 创建新的中止控制器
      abortControllerRef.current = new AbortController();
      
      // 确保在新请求前，如果有流式消息，先将其添加到消息列表中
      if (streamingMessage) {
        setMessages(msgs => [...msgs, { text: streamingMessage, isUser: false }]);
      }
      
      // 清空当前流式消息
      setStreamingMessage("");

      // 记录发送请求时的conversationId状态
      console.log(`发送消息，当前会话ID: ${conversationId}`);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          userId,
          conversationId: conversationId // 明确指定conversationId，如果为null则创建新会话
        }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP 错误! 状态: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('无响应体');
      }
      
      // 处理流式响应
      await processStreamResponse(response.body);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // 处理流式响应
  const processStreamResponse = async (body: ReadableStream<Uint8Array>) => {
    const reader = body.getReader();
    let accumulatedMessage = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('[Debug] 流式响应完成，最终消息长度:', accumulatedMessage.length);
          
          // 将最终完整的消息添加到历史记录
          if (accumulatedMessage) {
            setMessages(prev => [...prev, { text: accumulatedMessage, isUser: false }]);
            setStreamingMessage('');
          }
          break;
        }

        // 解码收到的数据
        const decodedChunk = new TextDecoder().decode(value);
        console.log('[Debug] 收到原始消息块:', decodedChunk);
        
        // 处理可能的多行JSON
        const lines = decodedChunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            // 尝试解析JSON
            const jsonData = JSON.parse(line);
            console.log('[Debug] 解析的JSON数据:', jsonData);
            
            // 提取内容
            if (jsonData.content !== undefined) {
              accumulatedMessage += jsonData.content;
            }
            
            // 检查是否是完成消息
            if (jsonData.isComplete === true) {
              console.log('[Debug] 收到完成标志');
              // 如果收到了conversationId，保存它
              if (jsonData.conversationId) {
                localStorage.setItem('conversationId', jsonData.conversationId);
                setConversationId(jsonData.conversationId);
              }
            }
          } catch (parseError) {
            console.error('[Debug] JSON解析错误:', parseError, '原始行:', line);
            // 如果无法解析为JSON，直接添加到消息中
            accumulatedMessage += line;
          }
        }
        
        // 更新流式消息状态以显示在UI中
        setStreamingMessage(accumulatedMessage);
      }
    } catch (error) {
      console.error('处理流式响应时出错:', error);
      toast({
        title: "错误",
        description: `处理响应时出错: ${error instanceof Error ? error.message : '未知错误'}`,
        variant: "destructive"
      });
    }
  };

  // 处理错误
  const handleError = (error: unknown) => {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('请求被取消');
      return;
    }
    
    console.error('发送消息时出错:', error);
    toast({
      title: "错误",
      description: `发送消息失败: ${error instanceof Error ? error.message : '未知错误'}`,
      variant: "destructive"
    });
  };

  // 处理语音输入
  const handleVoiceInput = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      
      // 构建FormData
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // 发送到语音识别API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('语音识别请求失败');
      }
      
      const data = await response.json();
      
      if (data.text) {
        // 设置识别到的文本到输入框
        setInput(data.text);
        // 自动发送识别到的消息
        await sendMessage();
      } else {
        toast({
          title: "提示",
          description: "未能识别出语音内容，请重试",
        });
      }
    } catch (error) {
      console.error('语音识别失败:', error);
      toast({
        title: "错误",
        description: `语音识别失败: ${error instanceof Error ? error.message : '未知错误'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 开始录音
  const startRecording = useCallback(() => {
    setIsListening(true);
  }, []);

  // 停止录音
  const stopRecording = useCallback(() => {
    setIsListening(false);
  }, []);

  // 重置聊天
  const resetChat = useCallback(() => {
    setMessages([]);
    setInput("");
    setStreamingMessage("");
    setIsLoading(false);
    
    toast({
      title: "成功",
      description: "对话已重置",
    });
    
    // 刷新路由以确保任何状态都被重置
    router.refresh();
  }, [router]);

  // 加载特定会话的消息
  const loadConversation = async (conversationId: string) => {
    try {
      // 保存会话ID到localStorage
      localStorage.setItem('conversationId', conversationId);
      setConversationId(conversationId);
      
      // 获取特定会话的详情
      const response = await fetch(`/api/conversations/${conversationId}`);
      
      if (!response.ok) {
        throw new Error("获取会话详情失败");
      }
      
      const data = await response.json();
      
      // 转换消息格式
      const formattedMessages: Message[] = data.messages.map((msg: any) => ({
        id: Math.random().toString(36).substring(2, 15),
        text: msg.content || "",
        isUser: msg.role === 'user',
        timestamp: new Date(msg.timestamp)
      }));
      
      // 设置消息列表
      setMessages(formattedMessages);
      
      return true;
    } catch (error) {
      console.error("加载会话出错:", error);
      toast({
        title: "加载失败",
        description: "无法加载会话内容，请重试",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    isListening,
    streamingMessage,
    messagesEndRef,
    handleInputChange,
    sendMessage,
    toggleListening,
    handleKeyPress,
    clearConversation,
    handleVoiceInput,
    startRecording,
    stopRecording,
    resetChat,
    loadConversation,
    conversationId
  };
} 