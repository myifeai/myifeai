import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // This new matcher covers EVERYTHING except very specific static folders
    // It ensures that even 404s and internal calls are seen by Clerk
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};