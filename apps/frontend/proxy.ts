import { clerkMiddleware } from "@clerk/nextjs/server";

// We initialize the middleware once
const middleware = clerkMiddleware();

export function proxy(req: any, event: any) {
  return middleware(req, event);
}

export default proxy;

export const config = {
  matcher: [
    // Ensure API routes are covered
    '/(api|trpc)(.*)',
    // Matches all pages, excludes static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};