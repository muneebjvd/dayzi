import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Dayzi – Your Beauty Finds ✨",
    template: "%s | Dayzi",
  },
  description:
    "Discover the best beauty products for body care, skincare, and hair care. Cute, feminine product recommendations with Amazon links.",
  keywords: ["beauty", "skincare", "body care", "hair care", "amazon", "product recommendations", "dayzi"],
  openGraph: {
    title: "Dayzi – Your Beauty Finds ✨",
    description:
      "Discover the best beauty products for body care, skincare, and hair care.",
    type: "website",
    locale: "en_US",
    siteName: "Dayzi",
  },
  robots: { index: true, follow: true },
};

import BackgroundStickers from "@/components/BackgroundStickers";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import GoogleAnalyticsTracker from "@/components/GoogleAnalytics";
import AmazonLinkTracker from "@/components/AmazonLinkTracker";

import { Suspense } from "react";
import { GA_ID } from "@/lib/gtag";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `
          }}
        />
        <Suspense fallback={null}>
          <GoogleAnalyticsTracker />
        </Suspense>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <AmazonLinkTracker />
        <AnalyticsTracker />
        <BackgroundStickers />
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
