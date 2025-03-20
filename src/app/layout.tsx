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
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body>
          <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
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