"use client"
import { useEffect, useState } from "react";
import { useContract, useReadContract } from "thirdweb/react";
import { contract as contractConfig } from "@/constants/contract";

interface Market {
  question: string;
  endTime: number;
  outcome: number; // 0 = UNRESOLVED, 1 = OPTION_A, 2 = OPTION_B
  optionA: string;
  optionB: string;
  totalOptionAShares: number;
  totalOptionBShares: number;
  resolved: boolean;
  category: string;
  tags: string[];
  marketFee: number;
  validationPeriod: number;
  totalVolume: number;
  disputed: boolean;
}

interface SharesBalance {
  optionAShares: number;
  optionBShares: number;
}

export const PredictionMarket = ({ marketId }: { marketId: string }) => {
  const [market, setMarket] = useState<Market>();
  const [sharesBalance, setSharesBalance] = useState<SharesBalance>();
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");

  // Use the contract hook to get the contract instance
  const { data: contract } = useContract(contractConfig.address);

  // Get market data
  const { data: marketData } = useReadContract({
    contract,
    functionName: "markets",
    args: [marketId]
  });

  useEffect(() => {
    if (marketData) {
      setMarket({
        question: marketData[0],
        optionA: marketData[1],
        optionB: marketData[2],
        endTime: Number(marketData[3]),
        outcome: Number(marketData[4]),
        totalOptionAShares: Number(marketData[5]),
        totalOptionBShares: Number(marketData[6]),
        resolved: marketData[7],
        category: marketData[8],
        tags: marketData[9],
        marketFee: Number(marketData[10]),
        validationPeriod: Number(marketData[11]),
        totalVolume: Number(marketData[12]),
        disputed: marketData[13]
      });
      setLoading(false);
    }
  }, [marketData]);

  if (loading) return <div>Loading...</div>;
  if (!market) return <div>Market not found</div>;

  return (
    <div className="p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{market.question}</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{market.optionA}</h3>
          <p className="mb-2">Total Shares: {market.totalOptionAShares}</p>
          {sharesBalance && (
            <p className="mb-4">Your Shares: {sharesBalance.optionAShares}</p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="border rounded px-2 py-1 w-24"
            />
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={market.resolved || !amount}
            >
              Buy Shares
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{market.optionB}</h3>
          <p className="mb-2">Total Shares: {market.totalOptionBShares}</p>
          {sharesBalance && (
            <p className="mb-4">Your Shares: {sharesBalance.optionBShares}</p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="border rounded px-2 py-1 w-24"
            />
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={market.resolved || !amount}
            >
              Buy Shares
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>Category: {market.category}</p>
        <p>Tags: {market.tags.join(", ")}</p>
        <p>Market Fee: {market.marketFee / 100}%</p>
        <p>Total Volume: {market.totalVolume}</p>
        <p>Status: {market.resolved ? "Resolved" : "Active"}</p>
        {market.resolved && (
          <p>Outcome: {market.outcome === 1 ? market.optionA : market.optionB}</p>
        )}
        <p>Ends: {new Date(market.endTime * 1000).toLocaleString()}</p>
      </div>
    </div>
  );
};