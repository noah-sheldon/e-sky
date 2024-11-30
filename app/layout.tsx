"use client"; // Make this a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar"; // Import Navbar component
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

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
            <Head>
              <title>e-sky: Innovating the Future of Tech</title>
              <meta
                name="description"
                content="e-sky is a platform designed to simplify workflows and deliver innovative software solutions across various industries."
              />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <meta
                property="og:title"
                content="e-sky: Innovating the Future of Tech"
              />
              <meta
                property="og:description"
                content="e-sky is a platform designed to simplify workflows and deliver innovative software solutions across various industries."
              />
              <meta property="og:image" content="/images/og-image.jpg" />
              <meta property="og:url" content="https://www.e-sky.com" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content="@e-sky_handle" />
              <meta
                name="twitter:title"
                content="e-sky: Innovating the Future of Tech"
              />
              <meta
                name="twitter:description"
                content="e-sky is a platform designed to simplify workflows and deliver innovative software solutions across various industries."
              />
              <meta name="twitter:image" content="/images/og-image.jpg" />
              <link rel="icon" href="/favicon-18.png" />
              {/* You can add additional favicons for different devices */}
              <link rel="icon" href="/favicon-32.png" sizes="32x32" />
              <link rel="icon" href="/favicon-48.png" sizes="48x48" />
              <link rel="icon" href="/favicon-96.png" sizes="96x96" />
            </Head>
            <body className="antialiased bg-gray-50 text-gray-800">
              {/* Sticky Navbar */}
              <header className="sticky top-0 z-50 bg-white shadow-md">
                <Navbar />
              </header>

              {/* Main content with min height */}
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
