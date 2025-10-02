import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import { SessionProvider } from "@/components/SessionProvider";

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Telegram Marketplace",
  description: "Buy and sell Telegram channels and groups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-200 bg-gradient-to-r from-slate-900 to-slate-800`}
      >
        <SessionProvider>
          <main>
            {children}
            
             
          </main>
          {/* <ChatbotWidget /> */}
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}






