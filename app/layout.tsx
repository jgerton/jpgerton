import type { Metadata } from "next";
import { inter, lora } from "@/lib/fonts";
import "./globals.css";
import { Providers } from "./providers";
import { siteConfig } from "@/lib/site-config";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WebVitals } from "@/components/analytics/web-vitals";
import { SiteNav } from "@/components/navigation/site-nav";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: "%s | Jon Gerton",
    default: siteConfig.name,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@jongerton",
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <WebVitals />
        <Providers>
          <SiteNav />
          {children}
          <footer className="border-t border-border/40 py-lg px-md text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Jon Gerton. All rights reserved.</p>
          </footer>
        </Providers>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
