import React, { ReactNode } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  width?: string;
  position?: "left" | "right";
}

export function Sidebar({
  isOpen,
  onClose,
  children,
  width = "320px",
  position = "left"
}: SidebarProps) {
  const positionClasses = position === "left" 
    ? "left-0 border-r" 
    : "right-0 border-l";

  return (
    <>
      <div 
        className={`fixed md:static top-0 ${positionClasses} h-full bg-gray-900 shadow-lg border-gray-800 dark:border-gray-800 transition-all duration-300 z-30 overflow-y-auto ${
          isOpen ? `w-[${width}]` : 'w-0 md:w-0'
        }`}
        style={{
          width: isOpen ? width : 0
        }}
      >
        <div className={`w-full h-full`}>
          {/* 侧边栏标题 */}
          <div className="flex items-center p-6 border-b border-gray-800">
            <h1 className="text-2xl font-semibold text-gray-300">deepseek</h1>
          </div>
          
          {/* 侧边栏内容 */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
      
      {/* 遮罩层（移动端） */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
} 