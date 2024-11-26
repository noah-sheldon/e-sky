import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "../components/Navbar"; // Import Navbar component
import "./globals.css";

// Local Fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the application
export const metadata: Metadata = {
  title: "e-sky",
  description:
    "View real-time transfers, approvals, and ownership data for E-Sky",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}
      >
        {/* Add Navbar at the top */}
        <Navbar />

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
