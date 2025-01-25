import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PredictionMarketABI from "@/abis/PredictionMarket.json";

interface Market {
  id: string;
  question: string;
  options: string[];
  endTime: number;
  totalStaked: ethers.BigNumber;
}

export const PredictionMarket = ({ tweetId }: { tweetId: string }) => {
  const [market, setMarket] = useState<Market>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarket = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS!,
          PredictionMarketABI,
          provider
        );

        const marketData = await contract.markets(tweetId);
        setMarket(marketData);
      } catch (err) {
        console.error("Error loading market:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMarket();
  }, [tweetId]);

  if (loading) return <div>Loading...</div>;
  if (!market) return <div>Market not found</div>;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">{market.question}</h2>
      <div className="space-y-4">
        {market.options.map((option, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{option}</span>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {/* Add prediction logic */}}
            >
              Predict
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Ends: {new Date(market.endTime * 1000).toLocaleString()}
      </div>
    </div>
  );
}; 