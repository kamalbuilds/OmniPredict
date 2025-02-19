import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const contractAddress = "0x124D803F8BC43cE1081110a08ADd1cABc5c83a3f";
export const tokenAddress = "0x4D9604603527322F44c318FB984ED9b5A9Ce9f71";

export const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: contractAddress
});

export const tokenContract = getContract({
    client: client,
    chain: baseSepolia,
    address: tokenAddress
});