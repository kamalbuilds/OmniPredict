"use client";

import { useReadContract } from "thirdweb/react";
import { contract } from "@/constants/contract";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCard } from "../marketCard";
import { Navbar } from "../navbar";
import { MarketCardSkeleton } from "../market-card-skeleton";
import PredictionDashboardBanner from "./PredictionDashboardBanner";
import { FaTelegram, FaTwitter } from "react-icons/fa";
import { useState } from "react";
interface MarketSource {
  type: "TWITTER" | "TELEGRAM";
  sourceId?: string;
}

interface Market {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  endTime: number;
  totalOptionAShares: number;
  totalOptionBShares: number;
  resolved: boolean;
  category: string;
  source?: MarketSource;
}

export function PredictionDashboard() {
  const { data: marketCount, isLoading: isLoadingMarketCount } =
    useReadContract({
      contract,
      method: "function marketCount() view returns (uint256)",
      params: [],
    });

  console.log("market count", marketCount, isLoadingMarketCount);

  // Show 6 skeleton cards while loading
  const skeletonCards = Array.from({ length: 6 }, (_, i) => (
    <MarketCardSkeleton key={`skeleton-${i}`} />
  ));

  const getSourceIcon = (source?: MarketSource) => {
    if (!source) return null;

    switch (source.type) {
      case "TWITTER":
        return <FaTwitter className="text-blue-400" />;
      case "TELEGRAM":
        return <FaTelegram className="text-blue-500" />;
      default:
        return null;
    }
  };

  const [selectedTab, setSelectedTab] = useState<string>("active");

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4">
        <Navbar />
        <PredictionDashboardBanner />

        <Tabs
          defaultValue="active"
          onValueChange={(value) => setSelectedTab(value)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 text-white">
            <TabsTrigger
              value="active"
              className={
                selectedTab === "active"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-2 text-white"
                  : ""
              }
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className={
                selectedTab === "pending"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-2 text-white"
                  : ""
              }
            >
              Pending Resolution
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className={
                selectedTab === "resolved"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-2 text-white"
                  : ""
              }
            >
              Resolved
            </TabsTrigger>
          </TabsList>

          {isLoadingMarketCount ? (
            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {skeletonCards}
              </div>
            </TabsContent>
          ) : (
            <>
              <TabsContent value="active">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard
                      key={index}
                      index={index}
                      filter="active"
                      getSourceIcon={getSourceIcon}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard
                      key={index}
                      index={index}
                      filter="pending"
                      getSourceIcon={getSourceIcon}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resolved">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard
                      key={index}
                      index={index}
                      filter="resolved"
                      getSourceIcon={getSourceIcon}
                    />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
