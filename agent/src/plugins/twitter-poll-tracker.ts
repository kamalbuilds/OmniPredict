import { Character, Plugin } from "@elizaos/core";
import { TwitterApi } from "twitter-api-v2";
import { ethers } from "ethers";
import PredictionMarketABI from "../../../abis/PredictionMarket.json";

export class TwitterPollTrackerPlugin implements Plugin {
    public name: string = "Twitter Poll Tracker";
    public description: string = "Tracks Twitter polls and creates prediction markets";
    public version: string = "1.0.0";
  private twitter: TwitterApi;
  private provider: ethers.providers.JsonRpcProvider;
  private predictionMarket: ethers.Contract;

  constructor(character: Character) {
    // Initialize Twitter client
    this.twitter = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Initialize blockchain connection
    this.provider = new ethers.providers.JsonRpcProvider(process.env.CHAIN_RPC_URL);
    this.predictionMarket = new ethers.Contract(
      process.env.PREDICTION_MARKET_ADDRESS!,
      PredictionMarketABI,
      this.provider
    );
  }

  async start() {
    // Start streaming mentions
    const stream = await this.twitter.v2.searchStream({
      'tweet.fields': ['author_id', 'conversation_id', 'created_at', 'in_reply_to_user_id', 'referenced_tweets', 'entities'],
      expansions: ['referenced_tweets.id'],
    });

    stream.on('data', async (tweet) => {
      try {
        // Check if tweet mentions our agent and contains a poll
        if (this.isTweetWithPoll(tweet)) {
          await this.handlePollTweet(tweet);
        }
      } catch (err) {
        console.error("Error handling tweet:", err);
      }
    });
  }

  private isTweetWithPoll(tweet: any): boolean {
    // Check if tweet mentions our agent and contains a poll
    return tweet.text.includes(`@${process.env.AGENT_USERNAME}`) && 
           tweet.attachments?.poll_ids?.length > 0;
  }

  private async handlePollTweet(tweet: any) {
    // Get poll details
    const poll = await this.twitter.v2.poll(tweet.attachments.poll_ids[0]);
    
    // Create prediction market
    const tx = await this.predictionMarket.createMarket(
      tweet.id,
      poll.options,
      Math.floor(new Date(poll.end_datetime).getTime() / 1000)
    );
    await tx.wait();

    // Generate shareable link
    const marketUrl = `https://yourapp.com/markets/${tweet.id}`;

    // Reply to tweet with market link
    await this.twitter.v2.reply(
      `I've created a prediction market for your poll! 🎯\nMake your predictions here: ${marketUrl}`,
      tweet.id
    );
  }

  async stop() {
    // Cleanup
  }
}