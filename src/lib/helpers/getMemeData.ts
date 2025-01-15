import { PublicClient } from "viem";
import MemeTokenAbi from "@abis/MemeToken.json";

const getMemeData = async (
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
  address: `0x${string}`
): Promise<{
  initialSupply: string;
  maxSupply: string;
  totalSupply: string;
} | void> => {
  try {
    const initialSupply = (await publicClient.readContract({
      address: tokenAddress,
      abi: MemeTokenAbi,
      functionName: "initialSupply",
      account: address,
    })) as string;

    const maxSupply = (await publicClient.readContract({
      address: tokenAddress,
      abi: MemeTokenAbi,
      functionName: "maxTotalSupply",
      account: address,
    })) as string;

    const totalSupply = (await publicClient.readContract({
      address: tokenAddress,
      abi: MemeTokenAbi,
      functionName: "totalSupply",
      account: address,
    })) as string;

    return { initialSupply, maxSupply, totalSupply };
  } catch (err: any) {
    console.error(err.message);
  }
};

export default getMemeData;
