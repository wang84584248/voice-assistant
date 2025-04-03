import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 组合Tailwind CSS类的实用函数
 * 使用clsx处理条件类名，并用tailwind-merge解决类名冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 