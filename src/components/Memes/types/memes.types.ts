import { LensAccount, Screen } from "@/components/Common/types/common.types";
import { PublicClient } from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction } from "react";

export interface MemeData {
  metadata: {
    image: string;
    lore: string;
  };
  blockTimestamp: string;
  name: string;
  symbol: string;
  feed: string;
  token: string;
  workflows: string[];
  maxSupply: string;
  totalSupply: string;
  initialSupply: string;
}

export interface TokenData {
  token: string;
  image: string;
  price: string;
  tokenPair: string;
}

export interface MemeDetails {
  memeImage: Blob | undefined;
  memeTokenSymbol: string;
  memeTokenTitle: string;
  memeTokenLore: string;
  initialSupply: number;
  maxSupply: number;
}

export interface TokenData {
  token: string;
  image: string;
  name: string;
  price: string;
  tokenPair: string;
}

export type MemesProps = {
  storageClient: StorageClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  lensAccount: LensAccount | undefined;
  address: `0x${string}` | undefined;
  lensClient: PublicClient;
  setScreen: (e: SetStateAction<Screen>) => void;
};

export type WorkflowsProps = {
  userMemes: MemeData[];
  setChosenUserMeme: (e: SetStateAction<MemeData | undefined>) => void;
  chosenUserMeme: MemeData | undefined;
};

export type MemeFeedProps = {
  memeData: MemeData[];
  setScreen: (e: SetStateAction<Screen>) => void;
};
