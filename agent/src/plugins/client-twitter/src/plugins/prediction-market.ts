import { TwitterApi } from "twitter-api-v2";
import { ethers } from "ethers";
import { Plugin } from "@elizaos/core";
import { PredictionMarketABI } from "../types/contracts.js";

export interface PredictionMarketConfig {
    chainRpcUrl: string;
    privateKey: string;
    contractAddress: string;
    agentUsername: string;
}

export class PredictionMarketPlugin implements Plugin {
    public name: string = "Prediction Market Plugin";
    public description: string = "Creates prediction markets from user questions";
    public version: string = "1.0.0";
    private provider: ethers.providers.JsonRpcProvider;
    private predictionMarket: ethers.Contract;
    private wallet: ethers.Wallet;
    private client: TwitterApi;
    private agentUsername: string;

    constructor(client: TwitterApi, config: PredictionMarketConfig) {
        this.client = client;
        this.agentUsername = config.agentUsername;
        
        // Initialize blockchain connection
        this.provider = new ethers.providers.JsonRpcProvider(config.chainRpcUrl);
        
        // Initialize wallet with proper private key format
        try {
            let privateKey = config.privateKey;
            if (!privateKey.startsWith('0x')) {
                privateKey = '0x' + privateKey;
            }
            this.wallet = new ethers.Wallet(privateKey, this.provider);
        } catch (error) {
            console.error('Error initializing wallet:', error);
            throw new Error('Failed to initialize wallet with provided private key');
        }

        // Initialize contract
        this.predictionMarket = new ethers.Contract(
            config.contractAddress,
            PredictionMarketABI,
            this.wallet
        );
    }

    async start() {
        console.log("Starting prediction market plugin");
        try {
            const user = await this.client.v2.me();
            console.log("Successfully authenticated with Twitter API v2:", user.data);
            console.log("Prediction market plugin started successfully");
        } catch (error) {
            console.error("Error starting prediction market plugin:", error);
            throw error;
        }
    }

    async stop() {
        // No cleanup needed
    }

    /**
     * Process an incoming tweet to create a market
     */
    async handleTweet(tweet: any) {
        console.log("Processing tweet:", tweet);
        
        try {
            const text = tweet.text || tweet.data?.text;
            if (!text) {
                console.log("No text found in tweet");
                return;
            }

            // Check if this is a market creation request
            if (!text.toLowerCase().includes(`@${this.agentUsername.toLowerCase()}`)) {
                console.log("Not a mention for this bot");
                return;
            }

            if (!text.toLowerCase().includes('create market:')) {
                // Reply with instructions if it's a mention but not a market creation request
                await this.client.v2.reply(
                    `To create a prediction market, use the format:\n@${this.agentUsername} create market: "Your question?" Options: Option1/Option2`,
                    tweet.id || tweet.data?.id
                );
                return;
            }

            // Parse the market request
            const parsedRequest = this.parseMarketRequest(text);
            if (!parsedRequest) {
                await this.client.v2.reply(
                    `To create a prediction market, use one of these formats:\n` +
                    `1. @${this.agentUsername} create market: "Your question?" Options: Option1/Option2\n` +
                    `2. @${this.agentUsername} create market: Option1/Option2`,
                    tweet.id || tweet.data?.id
                );
                return;
            }

            // Create the market
            await this.createMarket(
                parsedRequest.question,
                parsedRequest.options[0],
                parsedRequest.options[1],
                tweet.id || tweet.data?.id
            );
        } catch (error) {
            console.error("Error handling tweet:", error);
            // Try to reply with error message if possible
            try {
                const tweetId = tweet.id || tweet.data?.id;
                if (tweetId) {
                    await this.client.v2.reply(
                        "Sorry, there was an error processing your request. Please try again later.",
                        tweetId
                    );
                }
            } catch (replyError) {
                console.error("Error sending error reply:", replyError);
            }
        }
    }

    private parseMarketRequest(text: string): { question: string, options: string[] } | null {
        // First, try to extract the content after "create market:"
        const createMarketIndex = text.toLowerCase().indexOf('create market:');
        if (createMarketIndex === -1) return null;

        const content = text.slice(createMarketIndex + 'create market:'.length).trim();

        // Try different regex patterns
        const patterns = [
            /"([^"]+)"\s*Options:\s*([^/]+)\/([^/\n]+)/i,
            /"([^"]+)"\s*([^/]+)\/([^/\n]+)/i,
            /([^/]+)\/([^/\n]+)/i
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                if (match.length === 4) {
                    return {
                        question: match[1].trim(),
                        options: [match[2].trim(), match[3].trim()]
                    };
                } else if (match.length === 3) {
                    // If no explicit question, use the options as the question
                    const options = [match[1].trim(), match[2].trim()];
                    return {
                        question: `Which will win: ${options[0]} or ${options[1]}?`,
                        options: options
                    };
                }
            }
        }

        return null;
    }

    /**
     * Creates a new prediction market
     */
    async createMarket(question: string, optionA: string, optionB: string, replyToTweetId?: string): Promise<number> {
        try {
            console.log(`Creating market: "${question}" with options: ${optionA} vs ${optionB}`);
            
            const tx = await this.predictionMarket.createMarket(
                question,
                optionA,
                optionB,
                7 * 24 * 60 * 60, // 7 days in seconds
                "SOCIAL", // Default category
                [], // No tags for now
                100 // 1% fee
            );
            console.log("Transaction sent:", tx.hash);
            
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt.transactionHash);

            const marketId = Number(await this.predictionMarket.marketCount()) - 1;
            const marketUrl = `${process.env.FRONTEND_URL}/markets/${marketId}`;

            if (replyToTweetId) {
                await this.client.v2.reply(
                    `✨ Market created! Predict now at: ${marketUrl}\n\n` +
                    `Question: ${question}\n` +
                    `Options: ${optionA} vs ${optionB}`,
                    replyToTweetId
                );
            }

            return marketId;
        } catch (err) {
            console.error("Error creating market:", err);
            if (replyToTweetId) {
                await this.client.v2.reply(
                    "Sorry, there was an error creating the market. Please try again later.",
                    replyToTweetId
                );
            }
            throw err;
        }
    }
} 