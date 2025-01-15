import { SetStateAction, useEffect, useState } from "react";
import { Memory } from "../types/memories.types";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import {
  INFURA_GATEWAY,
  SCREENS,
  SESSION_DATA_CONTRACT,
} from "@/lib/constants";
import SessionDatabaseAbi from "@abis/SessionDatabase.json";
import { getSessions } from "../../../../graphql/queries/getSessions";
import { fetchPost } from "@lens-protocol/client/actions";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { SessionClient } from "@lens-protocol/client";
import { Livepeer } from "livepeer";
import { getSrc } from "@livepeer/react/external";
import { CurrentSession, Screen } from "@/components/Common/types/common.types";
import { EditorType } from "@/components/Feed/types/feed.types";
import { Agent } from "http";

const useMemories = (
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  sessionClient: SessionClient,
  setScreen: (e: SetStateAction<Screen>) => void,
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void
) => {
  const [deleteMemoryLoading, setDeleteMemoryLoading] = useState<boolean[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState<boolean>(false);
  const [moreMemoriesLoading, setMoreMemoriesLoading] =
    useState<boolean>(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [paginated, setPaginated] = useState<number>(0);
  const [decryptLoading, setDecryptLoading] = useState<boolean[]>([]);
  const litClient = new LitJsSdk.LitNodeClientNodeJs({
    alertWhenUnauthorized: false,
    litNetwork: LIT_NETWORK.DatilDev,
    debug: true,
  });
  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY,
  });

  const handleDeleteMemory = async (sessionId: number) => {
    if (!address) return;
    setDeleteMemoryLoading((prev) => {
      let mems = [...prev];
      const index = memories.findIndex((mem) => Number(mem.id) == sessionId);

      mems[index] = true;

      return mems;
    });
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: SESSION_DATA_CONTRACT,
        abi: SessionDatabaseAbi,
        functionName: "deleteSession",
        chain: chains.testnet,
        args: [sessionId],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: res,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setDeleteMemoryLoading((prev) => {
      let mems = [...prev];
      const index = memories.findIndex((mem) => Number(mem.id) == sessionId);

      mems[index] = false;

      return mems;
    });
  };

  const handleMoreMemories = async () => {
    if (paginated < 1 || !address || !sessionClient) return;
    setMoreMemoriesLoading(true);
    try {
      const data = await getSessions(address, paginated);

      const newData: Memory[] = await Promise.all(
        data?.data?.sessionAddeds?.map(async (session: any) => {
          const newMetadata = await fetch(
            `${INFURA_GATEWAY}${session.encryptedData.split("ipfs://")?.[1]}`
          );
          const json = await newMetadata.json();

          return {
            id: session?.id,
            data: json,
          };
        })
      );

      setMemories([...memories, ...newData]);

      setPaginated(
        data?.data?.sessionAddeds?.length == 20 ? paginated + 20 : 0
      );
      setDecryptLoading([
        ...decryptLoading,
        ...Array.from(
          { length: data?.data?.sessionAddeds?.length },
          () => false
        ),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreMemoriesLoading(false);
  };

  const handleMemories = async () => {
    if (!address || !sessionClient) return;
    setMemoriesLoading(true);
    try {
      const data = await getSessions(address, paginated);

      const newData: Memory[] = await Promise.all(
        data?.data?.sessionAddeds?.map(async (session: any) => {
          const litClient = new LitJsSdk.LitNodeClientNodeJs({
            alertWhenUnauthorized: false,
            litNetwork: LIT_NETWORK.DatilDev,
            debug: true,
          });
          await litClient.connect();

          const newMetadata = await fetch(
            `${INFURA_GATEWAY}${session.encryptedData.split("ipfs://")?.[1]}`
          );
          const json = await newMetadata.json();

          return {
            id: session?.id,
            data: json,
          };
        })
      );

      setMemories(newData);

      setPaginated(
        data?.data?.sessionAddeds?.length == 20 ? paginated + 20 : 0
      );
      setDecryptLoading(
        Array.from({ length: data?.data?.sessionAddeds?.length }, () => false)
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setMemoriesLoading(false);
  };

  const handleDecrypt = async (id: number) => {
    let index = memories?.findIndex((mem) => Number(mem?.id) == id);
    setDecryptLoading((prev) => {
      const newLoading = [...prev];

      newLoading[index] = true;

      return newLoading;
    });
    try {
      await litClient.connect();
      let nonce = await litClient.getLatestBlockhash();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "mumbai",
        nonce,
      });
      const decrypted = await litClient.decrypt({
        dataToEncryptHash: memories[index]?.data?.dataToEncryptHash,
        accessControlConditions: memories[index]?.data?.accessControlConditions,
        ciphertext: memories[index]?.data?.ciphertext,
        chain: "mumbai",
        authSig,
      });

      const decoder = new TextDecoder();

      const decodedDataString = decoder.decode(decrypted.decryptedData);

      const decodedData = await JSON.parse(decodedDataString);
      let postData: any = await fetchPost(sessionClient, {
        post: decodedData?.postId,
      });

      if (postData?.isOk()) {
        postData = postData?.value;
      } else {
        postData = undefined;
      }

      let src = null;

      if (memories[index]?.decodedData?.video) {
        const playbackInfo = await livepeer.playback.get(
          memories[index]?.decodedData?.video
        );

        src = getSrc(playbackInfo?.playbackInfo);
      }

      setMemories((prev) => {
        const newMem = [...prev];

        newMem[index] = {
          ...newMem[index],
          decodedData: {
            ...decodedData,
            src,
          },
          post: postData,
          decrypted: true,
        };

        return newMem;
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoading((prev) => {
      const newLoading = [...prev];

      newLoading[index] = false;

      return newLoading;
    });
  };

  const handleMemorySession = async (
    memory: Memory,
    item: {
      image: string;
      title: EditorType;
    },
    index: number
  ) => {
    try {
      let video: any = (memory as Memory)?.decodedData?.video;
      let image: any = (memory as Memory)?.decodedData?.image;

      if (video) {
        const res = await livepeer.stream.get(video);
        video = res.stream;
      }

      if (image) {
        const res = await fetch(
          `${INFURA_GATEWAY}${image?.split("ipfs://")?.[1]}`
        );
        image = await res.blob();
      }

      setCurrentSession((prev) => {
        let current = { ...prev };

        let editors = [...current.editors];

        editors[index] = item.title;

        current.editors = editors;
        current.image = image;
        current.video = video;
        current.post = (memory as Memory)?.post;
        current.text = (memory as Memory)?.decodedData?.text;

        return current;
      });
      setScreen(SCREENS[1]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (memories?.length < 1) {
      setDeleteMemoryLoading(
        Array.from({ length: memories?.length }, () => false)
      );
    }
  }, [memories]);

  useEffect(() => {
    if (memories?.length < 1 && address && sessionClient) {
      handleMemories();
    }
  }, [address, sessionClient]);

  return {
    handleMoreMemories,
    memories,
    memoriesLoading,
    moreMemoriesLoading,
    paginated,
    deleteMemoryLoading,
    handleDeleteMemory,
    handleDecrypt,
    decryptLoading,
    handleMemorySession,
  };
};

export default useMemories;
