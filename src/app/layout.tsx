// app/layout.tsx
import { Metadata } from "next";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Fixster - AI Code Debugger",
  description: "A powerful AI-driven code debugging tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
        <div className="flex min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
          {children}
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}