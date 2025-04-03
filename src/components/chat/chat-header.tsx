import React from 'react';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onClear }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-center text-2xl flex-grow">{title}</CardTitle>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        className="text-gray-500 hover:text-red-500"
        title="清除对话"
      >
        <Trash className="h-5 w-5" />
      </Button>
    </CardHeader>
  );
}; 