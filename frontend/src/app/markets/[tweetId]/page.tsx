import { PredictionMarket } from "@/components/PredictionMarket/PredictionMarket";

export default function MarketPage({ params }: { params: { tweetId: string } }) {
  return (
    <div className="container mx-auto py-8">
      <PredictionMarket tweetId={params.tweetId} />
    </div>
  );
} 