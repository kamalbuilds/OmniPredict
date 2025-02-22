import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain, http } from "viem";
import { chains } from "@lens-network/sdk/viem";

export const sonicblazeViemTestnet = defineChain({
  id: 57054,
  name: "Sonic Blaze Testnet",
  nativeCurrency: { name: "Sonic", symbol: "S", decimals: 18 },
  blockExplorers: {
    default: {
      name: "BlazeScan",
      url: "https://blaze.soniclabs.com",
    },
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/sonic_blaze_testnet"],
    },
  },
  testnet: true,
});

export const PREDICTION_MARKET_CONTRACT_ADDRESS =
  "0x9Dc50a13c06Bc9B46430581180158108A59308f2";
export const PREDICTION_MARKET_TOKEN_CONTRACT_ADDRESS =
  "0x1602CF4fFa1da92d1708D74E5A9985593176171a";

export const wagmiConfig = getDefaultConfig({
  appName: "OmniPredict",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [chains.testnet, sonicblazeViemTestnet],
  transports: {
    [chains.testnet.id]: http("https://rpc.testnet.lens.dev"),
    [sonicblazeViemTestnet.id]: http(
      "https://rpc.ankr.com/sonic_blaze_testnet"
    ),
  },
  ssr: true,
});
