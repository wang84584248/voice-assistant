// 日志工具函数

/**
 * 生成唯一的请求ID
 */
export function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * 记录信息日志
 */
export function logInfo(message: string, data?: any, requestId?: string): void {
  const timestamp = new Date().toISOString();
  const reqIdStr = requestId ? ` [${requestId}]` : '';
  console.log(`[INFO ${timestamp}]${reqIdStr} ${message}`, data ? JSON.stringify(data) : '');
}

/**
 * 记录错误日志
 */
export function logError(message: string, error: any, requestId?: string): void {
  const timestamp = new Date().toISOString();
  const reqIdStr = requestId ? ` [${requestId}]` : '';
  console.error(`[ERROR ${timestamp}]${reqIdStr} ${message}`, error);
}

/**
 * 记录警告日志
 */
export function logWarning(message: string, data?: any, requestId?: string): void {
  const timestamp = new Date().toISOString();
  const reqIdStr = requestId ? ` [${requestId}]` : '';
  console.warn(`[WARN ${timestamp}]${reqIdStr} ${message}`, data ? JSON.stringify(data) : '');
}

/**
 * 记录调试日志
 */
export function logDebug(message: string, data?: any, requestId?: string): void {
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = new Date().toISOString();
    const reqIdStr = requestId ? ` [${requestId}]` : '';
    console.debug(`[DEBUG ${timestamp}]${reqIdStr} ${message}`, data ? JSON.stringify(data) : '');
  }
} 