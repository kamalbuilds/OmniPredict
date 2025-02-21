"use client"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { PredictionMarketABI } from "../../../abis/PredictionMarket";
import { useAccount } from "wagmi";

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
  const { address } = useAccount();

  useEffect(() => {
    const loadMarket = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS!,
          PredictionMarketABI,
          provider
        );

        const marketData = await contract.markets(marketId);
        setMarket({
          question: marketData.question,
          endTime: Number(marketData.endTime),
          outcome: Number(marketData.outcome),
          optionA: marketData.optionA,
          optionB: marketData.optionB,
          totalOptionAShares: Number(marketData.totalOptionAShares),
          totalOptionBShares: Number(marketData.totalOptionBShares),
          resolved: marketData.resolved,
          category: marketData.category,
          tags: marketData.tags,
          marketFee: Number(marketData.marketFee),
          validationPeriod: Number(marketData.validationPeriod),
          totalVolume: Number(marketData.totalVolume),
          disputed: marketData.disputed
        });

        if (address) {
          const balance = await contract.getSharesBalance(marketId, address);
          setSharesBalance({
            optionAShares: Number(balance.optionAShares),
            optionBShares: Number(balance.optionBShares)
          });
        }
      } catch (err) {
        console.error("Error loading market:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMarket();
  }, [marketId, address]);

  const buyShares = async (isOptionA: boolean) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS!,
        PredictionMarketABI,
        signer
      );

      const tx = await contract.buyShares(
        marketId,
        isOptionA,
        ethers.parseEther(amount)
      );
      await tx.wait();

      // Refresh market data and balance
      const marketData = await contract.markets(marketId);
      setMarket(prev => ({
        ...prev!,
        totalOptionAShares: Number(marketData.totalOptionAShares),
        totalOptionBShares: Number(marketData.totalOptionBShares),
        totalVolume: Number(marketData.totalVolume)
      }));

      if (address) {
        const balance = await contract.getSharesBalance(marketId, address);
        setSharesBalance({
          optionAShares: Number(balance.optionAShares),
          optionBShares: Number(balance.optionBShares)
        });
      }
    } catch (err) {
      console.error("Error buying shares:", err);
    }
  };

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
              onClick={() => buyShares(true)}
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
              onClick={() => buyShares(false)}
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