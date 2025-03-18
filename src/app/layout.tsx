// app/layout.tsx
import { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
          {children}
        </div>
      </body>
    </html>
  );
}