"use client"; // Make this a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar"; // Import Navbar component
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

// Initialize Query Client
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <html lang="en">
            <body className="antialiased bg-gray-50 text-gray-800">
              {/* Navbar */}
              <header>
                <Navbar />
              </header>

              {/* Main content */}
              <main className="container mx-auto px-4 py-8">{children}</main>

              {/* Toaster */}
              <Toaster />
            </body>
          </html>
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
