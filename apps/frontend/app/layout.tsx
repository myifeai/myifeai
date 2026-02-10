import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-slate-50 min-h-screen">
          <header className="flex justify-between items-center p-4 bg-white shadow-sm">
            <h1 className="font-black text-xl tracking-tighter text-blue-600">LIFE CEO</h1>
            {/* Clerk User Management */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>

          <main>
            {/* Only show the dashboard if the user is signed in */}
            <SignedIn>
              {children}
            </SignedIn>
            
            {/* Show a welcome message if they are signed out */}
            <SignedOut>
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold">Ready to optimize your life?</h2>
                <p className="text-gray-500 mt-2">Sign in to access your AI-powered strategic plan.</p>
              </div>
            </SignedOut>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}