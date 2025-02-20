'use client'

import { useReadContract } from 'thirdweb/react'
import { contract } from '@/constants/contract'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketCard } from './marketCard'
import { Navbar } from './navbar'
import { MarketCardSkeleton } from './market-card-skeleton'
import { Footer } from "./footer"
import { FaTwitter, FaTelegram } from 'react-icons/fa'

interface MarketSource {
    type: 'TWITTER' | 'TELEGRAM';
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

export function EnhancedPredictionMarketDashboard() {
    const { data: marketCount, isLoading: isLoadingMarketCount } = useReadContract({
        contract,
        method: "function marketCount() view returns (uint256)",
        params: []
    }); 

    // Show 6 skeleton cards while loading
    const skeletonCards = Array.from({ length: 6 }, (_, i) => (
        <MarketCardSkeleton key={`skeleton-${i}`} />
    ));

    const getSourceIcon = (source?: MarketSource) => {
        if (!source) return null;
        
        switch (source.type) {
            case 'TWITTER':
                return <FaTwitter className="text-blue-400" />;
            case 'TELEGRAM':
                return <FaTelegram className="text-blue-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow container mx-auto p-4">
                <Navbar />
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
                        <h1 className="text-4xl font-bold mb-4">Predict the Future</h1>
                        <p className="text-lg mb-6">Create markets directly from Twitter and Telegram!</p>
                        <div className="flex gap-4">
                            <a 
                                href={`https://twitter.com/intent/tweet?text=@${process.env.NEXT_PUBLIC_AGENT_USERNAME} create market: "Your question" Options: Yes/No`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
                            >
                                <FaTwitter /> Create via Twitter
                            </a>
                            <a 
                                href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                            >
                                <FaTelegram /> Create via Telegram
                            </a>
                        </div>
                    </div>
                </div>
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="pending">Pending Resolution</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
            <Footer />
        </div>
    );
}
