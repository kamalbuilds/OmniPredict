import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const predictionENVSchema = z.object({
  PREDICTION_MARKET_ADDRESS: z
    .string()
    .min(1, "Prediction Market Address is required"),
  WALLET_PRIVATE_KEY: z.string().min(1, "Wallet private key is required"),
  WALLET_ADDRESS: z.string().min(1, "Wallet address is required"),
});

export type predictionConfig = z.infer<typeof predictionENVSchema>;

export async function validatePredictionConfig(
  runtime: IAgentRuntime
): Promise<predictionConfig> {
  try {
    const config = {
      PREDICTION_MARKET_ADDRESS:
        runtime.getSetting("PREDICTION_MARKET_ADDRESS") ||
        process.env.PREDICTION_MARKET_ADDRESS,
      WALLET_PRIVATE_KEY:
        runtime.getSetting("WALLET_PRIVATE_KEY") ||
        process.env.WALLET_PRIVATE_KEY,
      WALLET_ADDRESS:
        runtime.getSetting("WALLET_ADDRESS") || process.env.WALLET_ADDRESS,
      CHAIN_RPC_URL:
        runtime.getSetting("CHAIN_RPC_URL") || process.env.CHAIN_RPC_URL,
    };

    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(
        `Prediction configuration validation failed:\n${errorMessages}`
      );
    }
    throw error;
  }
}