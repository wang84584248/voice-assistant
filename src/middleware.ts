import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 仅记录API请求
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
}; 