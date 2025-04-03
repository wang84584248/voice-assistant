/**
 * 处理流式响应的工具函数
 */

/**
 * 创建文本编码器
 */
export function createEncoder(): TextEncoder {
  return new TextEncoder();
}

/**
 * 创建JSON编码的响应块
 */
export function createEncodedChunk(data: any, encoder: TextEncoder): Uint8Array {
  return encoder.encode(JSON.stringify(data) + '\n');
}

/**
 * 创建流式响应
 */
export function createStreamResponse(
  stream: ReadableStream,
  headers: HeadersInit = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  }
): Response {
  return new Response(stream, { headers });
}

/**
 * 创建流式处理响应
 * @param callback 处理流的回调函数
 */
export function createStreamHandler(
  callback: (controller: ReadableStreamDefaultController) => Promise<void>
): ReadableStream {
  return new ReadableStream({
    start: callback
  });
}

/**
 * 发送完成的流消息
 */
export function sendCompleteMessage(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  conversationId: string
): void {
  controller.enqueue(
    createEncodedChunk({
      content: '',
      isComplete: true,
      conversationId,
    }, encoder)
  );
}

/**
 * 发送错误消息
 */
export function sendErrorMessage(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  error: string
): void {
  controller.enqueue(
    createEncodedChunk({
      error,
      isComplete: true,
    }, encoder)
  );
}

/**
 * 发送内容块
 */
export function sendContentChunk(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  content: string
): void {
  controller.enqueue(
    createEncodedChunk({
      content,
      isComplete: false
    }, encoder)
  );
} 