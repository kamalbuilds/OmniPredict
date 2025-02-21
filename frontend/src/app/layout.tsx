import { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Modals from "@/components/Modals/modules/Modals";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dialtone.club"),
  title: "OmniPredict",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  description:
    "A shortform self-publishing app. Building on Livepeer, Lens, Farcaster, Bluesky & custom agents for mirror inference.",

  twitter: {
    card: "summary_large_image",
    title: "OmniPredict",
    description:
      "A shortform self-publishing app. Building on Livepeer, Lens, Farcaster, Bluesky & custom agents for mirror inference.",
    images: ["https://www.dialtone.club/card.png/"],
  },

  openGraph: {
    title: "OmniPredict",
    description:
      "A shortform self-publishing app. Building on Livepeer, Lens, Farcaster, Bluesky & custom agents for mirror inference.",
    images: "https://www.dialtone.club/cover.png/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Providers>
          <div className="min-w-[90vw] mx-auto px-8">
            {children}
            <Modals />
          </div>
        </Providers>
      </body>
    </html>
  );
}
