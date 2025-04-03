import React from 'react';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, ArrowLeft } from "lucide-react";

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
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      {showBackButton && onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-gray-500 mr-2"
          title="返回"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <CardTitle className={`text-center text-2xl ${showBackButton ? '' : 'flex-grow'}`}>
        {title}
      </CardTitle>
      <div className="flex ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="text-gray-500 hover:text-red-500"
          title="清除对话"
        >
          <Trash className="h-5 w-5" />
        </Button>
      </div>
    </CardHeader>
  );
}; 