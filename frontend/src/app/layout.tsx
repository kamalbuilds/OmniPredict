import { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "./providers";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://omnipredict.vercel.app"),
  title: "OmniPredict",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  description:
    "An all in one CrossChain Social App built with Lens , Livepeer , Farcaster and lets you place predictions on sonic chain",

  twitter: {
    card: "summary_large_image",
    title: "OmniPredict",
    description:
      "An all in one CrossChain Social App built with Lens , Livepeer , Farcaster and lets you place predictions on sonic chain",
    images: ["https://omnipredict.vercel.app/card.png/"],
  },

  openGraph: {
    title: "OmniPredict",
    description:
      "An all in one CrossChain Social App built with Lens , Livepeer , Farcaster and lets you place predictions on sonic chain",
    images: "https://omnipredict.vercel.app/cover.png/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="min-h-screen overflow-x-hidden">
        <Providers>
          <RootLayoutWrapper>
            {children}
          </RootLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
