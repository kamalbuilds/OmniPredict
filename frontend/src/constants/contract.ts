import { client } from "@/client";
import { defineChain, getContract } from "thirdweb";

export const sonicblazetestnet = defineChain({
  id: 57054,
  name: "Sonic Blaze Testnet",
  nativeCurrency: { name: "Sonic", symbol: "S", decimals: 18 },
  blockExplorers: [
    {
      name: "BlazeScan",
      url: "https://blaze.soniclabs.com",
    },
  ],
  rpc: "https://rpc.ankr.com/sonic_blaze_testnet",
  testnet: true,
});

export const contractAddress = "0x9Dc50a13c06Bc9B46430581180158108A59308f2";
export const tokenAddress = "0x1602CF4fFa1da92d1708D74E5A9985593176171a";

export const contract = getContract({
  client: client,
  chain: sonicblazetestnet,
  address: contractAddress,
});

export const tokenContract = getContract({
  client: client,
  chain: sonicblazetestnet,
  address: tokenAddress,
});
