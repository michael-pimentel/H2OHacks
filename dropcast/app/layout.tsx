import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DropCast — Central Valley Water Intelligence",
  description: "Real-time reservoir tracking and predictive water modeling for Central Valley farmers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-slate-950 text-slate-100 min-h-screen antialiased`}>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
