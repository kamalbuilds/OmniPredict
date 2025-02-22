import {
    type ActionExample,
    type Content,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
    elizaLogger,
    composeContext,
    generateObjectDeprecated,
} from "@elizaos/core";
import { ethers } from "ethers";
import { PredictionMarketABI, PREDICTION_MARKET_CONTRACT_ADDRESS } from "../../../predictionContract/predictionmarket.contract.js";
import { validatePredictionConfig } from "../environment.js";

export interface DataContent extends Content {
    data: string;
  }
  
  export function isDataContent(content: DataContent): content is DataContent {
    // Validate types
    const validTypes = typeof content.data === "string";
    if (!validTypes) {
      return false;
    }
  }
  
  const submitDataTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.
    
Example response:
\`\`\`json
{
    "_question": "Prediction question which will be created on which users can bet with option A and Option B",
    "_optionA": "Option A for the prediction",
    "_optionB": "Option B for the prediction",
    "_duration": "Duration of the market in days"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the prediction market creation process:
- Question: The main prediction question
- Option A: First option (e.g., "Yes", "India", etc.)
- Option B: Second option (e.g., "No", "Pakistan", etc.)
- Duration: Duration in days (if betting duration is mentioned, use that, otherwise default to 7 days)

If any required fields are missing from the messages, ask the user directly for those values.

Respond with a JSON markdown block containing only the extracted values.`;

export const createPrediction = {
    name: "CREATE_PREDICTION",
    similes: ["PREDICTION_CREATION"],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validatePredictionConfig(runtime);
        return true;
    },
    description: "Creates a prediction market using the prediction market contract",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting prediction market creation...");
        elizaLogger.log("Message received:", message);

        try {
            // Initialize or update state
            let currentState = state;
            if (!currentState) {
                currentState = (await runtime.composeState(message)) as State;
            } else {
                currentState = await runtime.updateRecentMessageState(currentState);
            }

            // Compose context
            const submitDataContext = composeContext({
                state: currentState,
                template: submitDataTemplate,
            });

            // Generate content
            elizaLogger.log("Generating market parameters from message...");
            const content = await generateObjectDeprecated({
                runtime,
                context: submitDataContext,
                modelClass: ModelClass.SMALL,
            });
            elizaLogger.log("Generated content:", content);

            // Validate required fields
            if (!content._question || !content._optionA || !content._optionB || !content._duration) {
                const error = "Missing required market parameters";
                elizaLogger.error(error, content);
                if (callback) {
                    callback({
                        text: `Error: ${error}. Please provide question, options, and duration.`,
                        content: { error },
                    });
                }
                return false;
            }

            elizaLogger.log("Checking environment variables...");
            const PRIVATE_KEY = runtime.getSetting("PRIVATE_KEY");
            if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY not set");

            const CHAIN_RPC_URL = runtime.getSetting("CHAIN_RPC_URL") || process.env.CHAIN_RPC_URL;
            if (!CHAIN_RPC_URL) throw new Error("CHAIN_RPC_URL not set");

            const PREDICTION_MARKET_ADDRESS = runtime.getSetting("PREDICTION_MARKET_ADDRESS") || process.env.PREDICTION_MARKET_ADDRESS;
            if (!PREDICTION_MARKET_ADDRESS) throw new Error("PREDICTION_MARKET_ADDRESS not set");

            // Initialize blockchain connection
            elizaLogger.log("Initializing blockchain connection...");
            const provider = new ethers.providers.JsonRpcProvider(CHAIN_RPC_URL);
            
            // Initialize wallet
            let privateKey = PRIVATE_KEY;
            if (!privateKey.startsWith('0x')) {
                privateKey = '0x' + privateKey;
            }
            const wallet = new ethers.Wallet(privateKey, provider);
            elizaLogger.log("Wallet initialized:", wallet.address);

            // Initialize contract
            elizaLogger.log("Initializing contract...");
            const predictionMarket = new ethers.Contract(
                PREDICTION_MARKET_CONTRACT_ADDRESS,
                PredictionMarketABI,
                wallet
            );

            // Convert duration to seconds
            const durationInSeconds = content._duration * 24 * 60 * 60; // Convert days to seconds
            elizaLogger.log("Market parameters:", {
                question: content._question,
                optionA: content._optionA,
                optionB: content._optionB,
                duration: durationInSeconds,
            });

            // Create the market
            elizaLogger.log("Creating market transaction...");
            const tx = await predictionMarket.createMarket(
                content._question,
                content._optionA,
                content._optionB,
                durationInSeconds
            );
            elizaLogger.log("Transaction sent:", tx.hash);

            const receipt = await tx.wait();
            elizaLogger.log("Transaction confirmed:", receipt);

            const marketId = Number(await predictionMarket.marketCount()) - 1;
            elizaLogger.success(
                `Market created successfully!\nMarket ID: ${marketId}\nTx Hash: ${receipt.transactionHash}`
            );

            if (callback) {
                callback({
                    text: `Market created successfully!\nMarket ID: ${marketId}\nTx Hash: ${receipt.transactionHash}`,
                    content: {
                        marketId,
                        txHash: receipt.transactionHash,
                    },
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error creating market:", error);
            elizaLogger.error("Error details:", {
                message: error.message,
                code: error.code,
                stack: error.stack,
            });
            if (callback) {
                callback({
                    text: `Error creating market: ${error.message}`,
                    content: { 
                        error: error.message,
                        code: error.code,
                        details: error.stack
                    },
                });
            }
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a prediction market for 'Will Bitcoin reach $100k by end of 2024?' with options Yes/No, duration 30 days",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Creating market with question: Will Bitcoin reach $100k by end of 2024?, options: Yes/No, duration: 30 days",
                    action: "CREATE_PREDICTION",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Market created successfully! Market ID: 1, Transaction Hash: 0x123...",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;