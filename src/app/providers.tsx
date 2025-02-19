"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Livepeer } from "livepeer";
import { WagmiProvider, http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createContext, SetStateAction, useEffect, useState } from "react";
import { chains } from "@lens-network/sdk/viem";
import { Post, PublicClient, testnet } from "@lens-protocol/client";
import {
  StorageClient,
  testnet as storageTestnet,
} from "@lens-protocol/storage-node-client";
import {
  CurrentSession,
  LensAccount,
} from "@/components/Common/types/common.types";
import { EditorType } from "@/components/Feed/types/feed.types";
import { AccessControlParams } from "@livepeer/react";
import { ThirdwebProvider } from "thirdweb/react";

export const config = getDefaultConfig({
  appName: "OmniPredict",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [chains.testnet],
  transports: {
    [chains.testnet.id]: http("https://rpc.testnet.lens.dev"),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export const AppContext = createContext<
  | {
      postLive: boolean;
      setPostLive: (e: SetStateAction<boolean>) => void;
      aiDetails: {
        data?: {
          openAikey?: string;
          instructionsOpenAi?: string;
          modelOpenAi: string;
          claudekey?: string;
          instructionsClaude?: string;
          modelClaude: string;
        };
        json?: {
          dataToEncryptHash: string;
          accessControlConditions: AccessControlParams[];
          ciphertext: string;
        };
        decrypted: boolean;
      };
      setAiDetails: (
        e: SetStateAction<{
          data?: {
            openAikey?: string;
            instructionsOpenAi?: string;
            modelOpenAi: string;
            claudekey?: string;
            instructionsClaude?: string;
            modelClaude: string;
          };
          json?: {
            dataToEncryptHash: string;
            accessControlConditions: AccessControlParams[];
            ciphertext: string;
          };
          decrypted: boolean;
        }>
      ) => void;
      imageView: string | undefined;
      setImageView: (e: SetStateAction<string | undefined>) => void;
      lensAccount: LensAccount | undefined;
      setLensAccount: (e: SetStateAction<LensAccount | undefined>) => void;
      lensClient: PublicClient | undefined;
      storageClient: StorageClient | undefined;
      signless: boolean;
      setSignless: (e: SetStateAction<boolean>) => void;
      gifOpen: { id: string; gif: string; open: boolean };
      setGifOpen: (
        e: SetStateAction<{ id: string; gif: string; open: boolean }>
      ) => void;
      createAccount: boolean;
      setCreateAccount: (e: SetStateAction<boolean>) => void;
      notification: string | undefined;
      setNotification: (e: SetStateAction<string | undefined>) => void;
      indexer: string | undefined;
      setIndexer: (e: SetStateAction<string | undefined>) => void;
      setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
      currentSession: CurrentSession;
      livepeer: Livepeer | undefined;
    }
  | undefined
>(undefined);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [imageView, setImageView] = useState<string | undefined>();
  const [lensAccount, setLensAccount] = useState<LensAccount | undefined>();
  const [livepeer, setLivepeer] = useState<Livepeer | undefined>();
  const [aiDetails, setAiDetails] = useState<{
    data?: {
      openAikey?: string;
      instructionsOpenAi?: string;
      modelOpenAi: string;
      claudekey?: string;
      instructionsClaude?: string;
      modelClaude: string;
    };
    json?: {
      dataToEncryptHash: string;
      accessControlConditions: AccessControlParams[];
      ciphertext: string;
    };
    decrypted: boolean;
  }>({
    decrypted: false,
    data: {
      modelOpenAi: "gpt-4o-mini-2024-07-18",
      modelClaude: "claude-3-5-haiku-latest",
    },
  });
  const [lensClient, setLensClient] = useState<PublicClient | undefined>();
  const [indexer, setIndexer] = useState<string | undefined>();
  const [createAccount, setCreateAccount] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | undefined>();
  const [postLive, setPostLive] = useState<boolean>(false);
  const [signless, setSignless] = useState<boolean>(false);
  const [gifOpen, setGifOpen] = useState<{
    id: string;
    gif: string;
    open: boolean;
  }>({ id: "", gif: "", open: false });
  const [currentSession, setCurrentSession] = useState<{
    post?: Post;
    editors: EditorType[];
    currentIndex: number;
  }>({
    editors: [],
    currentIndex: 0,
  });
  const storageClient = StorageClient.create(storageTestnet);

  useEffect(() => {
    if (!lensClient) {
      setLensClient(
        PublicClient.create({
          environment: testnet,
          storage: window.localStorage,
        })
      );
    }

    if (!livepeer) {
      setLivepeer(
        new Livepeer({
          apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY!,
        })
      );
    }
  }, []);

  return (
    <ThirdwebProvider>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContext.Provider
            value={{
              imageView,
              setImageView,
              lensAccount,
              postLive,
              setPostLive,
              setLensAccount,
              lensClient,
              storageClient,
              indexer,
              setIndexer,
              notification,
              setNotification,
              createAccount,
              setCreateAccount,
              currentSession,
              setCurrentSession,
              gifOpen,
              setGifOpen,
              signless,
              setSignless,
              aiDetails,
              setAiDetails,
              livepeer,
            }}
          >
            {children}
          </AppContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </ThirdwebProvider>
  );
}
