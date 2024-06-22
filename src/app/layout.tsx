import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "../providers/sessionProvider";
import Sidebar from "@/components/sidebar";
import { auth } from "@/helpers/auth";
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subs",
  description: "Generated by create next app",
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
        <main className="flex min-h-screen items-center bg-slate-900">
          {session && <Sidebar/>}
          <SessionProvider session={session}>
            {children}
            <Toaster position="top-right" />
            </SessionProvider>
        </main>
      </body>
    </html>
  );
}
