// app/layout.tsx
import { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from "./components/Navbar";

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
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}