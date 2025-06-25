import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Proof of Habit - Build Better Habits Onchain",
  description:
    "Track your daily habits onchain with Proof of Habit on Starknet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <Navigation />
            <main className="pb-20">{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
