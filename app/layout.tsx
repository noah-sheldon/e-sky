"use client"; // Make this a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar"; // Import Navbar component
import "./globals.css";

// Initialize Query Client
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className="antialiased bg-gray-50 text-gray-800">
          {/* Navbar */}
          <header>
            <Navbar />
          </header>

          {/* Main content */}
          <main className="container mx-auto px-4 py-8">{children}</main>
        </body>
      </html>
    </QueryClientProvider>
  );
}
