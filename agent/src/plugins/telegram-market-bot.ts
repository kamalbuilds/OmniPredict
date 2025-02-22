import { Character, Plugin } from "@elizaos/core";
import { Telegraf } from "telegraf";
import { ethers } from "ethers";
import { PredictionMarketABI } from "../../abis/PredictionMarket";

export class TelegramMarketBotPlugin implements Plugin {
    public name: string = "Telegram Market Bot";
    public description: string = "Creates prediction markets from Telegram commands";
    public version: string = "1.0.0";
    private bot: Telegraf;
    private provider: ethers.providers.JsonRpcProvider;
    private predictionMarket: ethers.Contract;
    private wallet: ethers.Wallet;

    constructor(character: Character) {
        // Validate required environment variables
        const requiredEnvVars = {
            'TELEGRAM_BOT_TOKEN': process.env.TELEGRAM_BOT_TOKEN,
            'CHAIN_RPC_URL': process.env.CHAIN_RPC_URL,
            'PRIVATE_KEY': process.env.PRIVATE_KEY,
            'PREDICTION_MARKET_ADDRESS': process.env.PREDICTION_MARKET_ADDRESS
        };

        // Check for missing environment variables
        const missingVars = Object.entries(requiredEnvVars)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        // Initialize Telegram bot
        this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

        try {
            // Initialize blockchain connection
            this.provider = new ethers.providers.JsonRpcProvider(process.env.CHAIN_RPC_URL);
            
            // Validate private key format
            if (!process.env.PRIVATE_KEY?.startsWith('0x')) {
                this.wallet = new ethers.Wallet('0x' + process.env.PRIVATE_KEY, this.provider);
            } else {
                this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
            }

            this.predictionMarket = new ethers.Contract(
                process.env.PREDICTION_MARKET_ADDRESS!,
                PredictionMarketABI,
                this.wallet
            );

            this.setupCommands();
        } catch (error) {
            console.error('Error initializing blockchain connection:', error);
            throw new Error('Failed to initialize blockchain connection');
        }
    }

    private setupCommands() {
        // Help command
        this.bot.command('help', (ctx) => {
            ctx.reply(
                'Welcome to the Prediction Market Bot! 🎯\n\n' +
                'Use the following command to create a market:\n' +
                '/create "Your question here" Options: Option1/Option2\n\n' +
                'Example:\n' +
                '/create "Will GPT-5 pass the Turing Test by 2026?" Options: Yes/No'
            );
        });

        // Create market command
        this.bot.command('create', async (ctx) => {
            try {
                const text = ctx.message.text.substring('/create'.length).trim();
                const parsedRequest = this.parseMarketRequest(text);

                if (!parsedRequest) {
                    await ctx.reply(
                        "❌ Invalid format. Please use:\n" +
                        '/create "Question" Options: Option1/Option2'
                    );
                    return;
                }

                // Create prediction market
                const tx = await this.predictionMarket.createMarket(
                    parsedRequest.question,
                    parsedRequest.options[0],
                    parsedRequest.options[1],
                    7 * 24 * 60 * 60, // 7 days in seconds
                    "SOCIAL", // Default category
                    [], // No tags for now
                    100 // 1% fee
                );
                await tx.wait();

                const marketId = await this.predictionMarket.marketCount() - 1;
                const marketUrl = `${process.env.FRONTEND_URL}/markets/${marketId}`;

                await ctx.reply(
                    `✨ Market created successfully!\n\n` +
                    `Question: ${parsedRequest.question}\n` +
                    `Options: ${parsedRequest.options[0]} vs ${parsedRequest.options[1]}\n\n` +
                    `🔗 Make your prediction at: ${marketUrl}`,
                    { parse_mode: 'Markdown' }
                );
            } catch (err) {
                console.error("Error creating market:", err);
                await ctx.reply(
                    "❌ Sorry, there was an error creating the market. Please try again later."
                );
            }
        });
    }

    private parseMarketRequest(text: string): { question: string, options: string[] } | null {
        const regex = /"([^"]+)"\s*Options:\s*([^/]+)\/([^/\n]+)/i;
        const match = text.match(regex);
        
        if (!match) return null;
        
        return {
            question: match[1].trim(),
            options: [match[2].trim(), match[3].trim()]
        };
    }

    async start() {
        // Start the bot
        await this.bot.launch();
        console.log('Telegram bot started');
    }

    async stop() {
        // Stop the bot
        await this.bot.stop();
    }
} 