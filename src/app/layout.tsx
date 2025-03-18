import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fixster - AI Code Debugger",
  description: "Debug and explain code with AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <nav className="w-full p-4 bg-gray-800 shadow-md">
          <h1 className="text-xl font-bold">Fixster</h1>
        </nav>
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
