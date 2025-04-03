import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, List, Sparkles } from "lucide-react";

interface AppHeaderProps {
  title: string;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  icon?: ReactNode;
  endContent?: ReactNode;
}

export function AppHeader({
  title,
  showSidebar,
  onToggleSidebar,
  icon = <Sparkles className="h-4 w-4 text-blue-500" />,
  endContent
}: AppHeaderProps) {
  return (
    <div className="w-full mb-6 flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onToggleSidebar} 
        className="bg-gray-800 hover:bg-gray-700 text-gray-300 shadow-sm rounded-full h-10 w-10"
      >
        {showSidebar ? <ChevronLeft className="h-5 w-5" /> : <List className="h-5 w-5" />}
      </Button>
      
      <div className="flex items-center space-x-2 bg-gray-800 px-4 py-1.5 rounded-full">
        {icon}
        <h1 className="text-lg font-medium text-gray-200">{title}</h1>
      </div>
      
      {endContent || <div className="w-10" />}
    </div>
  );
} 