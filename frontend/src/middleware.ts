import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard/mydecks", '/dashboard/explore', '/dashboard/faqs', '/dashboard/feedback', '/dashboard/generate'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); 
  const accessToken = req.cookies.get("accessToken"); 
  const refreshToken = req.cookies.get("refreshToken"); 

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    console.log('protected');
    
    if (!token || !accessToken || !refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
