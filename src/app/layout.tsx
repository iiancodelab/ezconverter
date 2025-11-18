import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only load when needed
});

export const metadata: Metadata = {
  title: "File Converter - Convert PDF, Word, Excel, CSV, PowerPoint",
  description: "Convert PDF, Word, Excel, CSV, and PowerPoint files easily with our secure online file converter",
  keywords: "file converter, PDF to Word, Excel to PDF, document conversion, online converter",
  authors: [{ name: "File Converter" }],
  creator: "File Converter",
  publisher: "File Converter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  openGraph: {
    title: "File Converter - Convert PDF, Word, Excel, CSV, PowerPoint",
    description: "Convert PDF, Word, Excel, CSV, and PowerPoint files easily with our secure online file converter",
    type: "website",
    locale: "en_US",
    siteName: "File Converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "File Converter - Convert PDF, Word, Excel, CSV, PowerPoint",
    description: "Convert PDF, Word, Excel, CSV, and PowerPoint files easily with our secure online file converter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.cloudconvert.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        
        {/* Viewport for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: 'text-sm',
          }}
        />
      </body>
    </html>
  );
}
