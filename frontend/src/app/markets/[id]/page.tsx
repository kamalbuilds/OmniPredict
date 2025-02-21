"use client"

import { PredictionMarket } from "@/components/PredictionMarket/PredictionMarket";
import { useParams } from "next/navigation";

export default function MarketPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="container mx-auto py-8">
      <PredictionMarket marketId={id} />
    </div>
  );
}