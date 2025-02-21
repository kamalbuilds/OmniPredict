"use client"

import { PredictionMarket } from "@/components/PredictionMarket/PredictionMarket";

export default function MarketPage({ params }: { params: { tweetId: string } }) {
  // Convert tweetId to marketId - assuming marketId is numeric
  const marketId = params.tweetId;

  return (
    <div className="container mx-auto py-8">
      <PredictionMarket marketId={marketId} />
    </div>
  );
}