import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] p-4 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2.5 h-2.5 bg-indigo-400 dark:bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2.5 h-2.5 bg-violet-400 dark:bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}; 