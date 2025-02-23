"use client";

import { WavyBackground } from "@/components/ui/wavy-background";
import Modals from "@/components/Modals/modules/Modals";

export function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WavyBackground 
      className="min-h-screen"
      backgroundFill="#000000"
      colors={["#38bdf8", "#818cf8", "#c084fc", "#22d3ee"]}
      waveOpacity={0.3}
      blur={5}
    >
      {children}
      <Modals />
    </WavyBackground>
  );
}
