import { AuthProvider } from "@/components/auth/auth-context";
import { CartProvider } from "@/components/cart/cart-context";
import { DebugGrid } from "@/components/debug-grid";
import { isDevelopment } from "@/lib/constants";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { cn } from "../lib/utils";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forli Shop",
  description: "Forli Shop, your one-stop shop for all your needs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen"
        )}
        suppressHydrationWarning
      >
        <CartProvider>
          <AuthProvider>
            <NuqsAdapter>
              {isDevelopment && <DebugGrid />}
              {children}
              <Toaster closeButton position="bottom-right" />
            </NuqsAdapter>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
