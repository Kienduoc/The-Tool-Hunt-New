import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "The Tool Hunt | Discover AI Tools & Tutorials",
  description: "Gamified AI tool discovery platform. Watch tutorials, discover tools, and build your collection.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <Header />
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
