import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { OSPCProvider } from "@/lib/ospc-store";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QUILD - OSPC Platform",
  description: "Open-Source Patent Commons - Micro-Ownership, CV Engine, Royalties & Governance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-full bg-[var(--background)]">
        <OSPCProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-72">
              <Header />
              <main className="p-6 min-h-[calc(100vh-64px)]">
                {children}
              </main>
            </div>
          </div>
        </OSPCProvider>
      </body>
    </html>
  );
}