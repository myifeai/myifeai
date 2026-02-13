import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <h1 className="font-black tracking-tight text-lg">
                LIFE <span className="text-purple-400">CEO</span>
              </h1>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="glass-card-secondary px-4 py-2 text-sm font-bold">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>

          <main className="pt-20">
            <SignedIn>{children}</SignedIn>

            <SignedOut>
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-4xl font-black mb-4">
                  Become the CEO of Your Life
                </h2>
                <p className="text-gray-400 max-w-md">
                  Sign in to unlock your AI-powered daily strategy engine.
                </p>
              </div>
            </SignedOut>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
