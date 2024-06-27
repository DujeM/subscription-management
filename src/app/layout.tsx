import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "../providers/sessionProvider";
import Sidebar from "@/components/sidebar";
import { auth } from "@/helpers/auth";
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subscribx",
  description: "Discover the ultimate solution for transforming your business with subscription-based pricing model designed to help you start growing your business efficiently.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
      {session && <main className="flex min-h-screen items-center bg-slate-900">
          <Sidebar/>
          <SessionProvider session={session}>
            {children}
            <Toaster position="top-right" />
            </SessionProvider>
        </main>}
      {!session && <main className="min-h-screen bg-slate-900">{children}<Toaster position="top-right" /></main>}
      </body>
    </html>
  );
}
