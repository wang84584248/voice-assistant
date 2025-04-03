import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  onClear: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title, 
  onClear, 
  showBackButton = false, 
  onBack 
}) => {
  const handleClearClick = () => {
    if (window.confirm('确定要清除所有对话记录吗？')) {
      onClear();
    }
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800 bg-gray-900 py-4">
      <div className="flex items-center flex-grow">
        {showBackButton && onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-400 hover:text-gray-300 mr-2 rounded-full"
            title="返回"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-xl font-medium text-gray-200">
            {title}
          </CardTitle>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClearClick}
        className="text-gray-400 hover:text-red-400 rounded-full"
        title="清除对话"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </CardHeader>
  );
}; 