import { Social } from "@/components/Feed/types/feed.types";
import { SetStateAction, useEffect, useState } from "react";
import { TextOnlyMetadata } from "@lens-protocol/client";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { SCREENS, SESSION_DATA_CONTRACT } from "@/lib/constants";
import SessionDatabaseAbi from "@abis/SessionDatabase.json";
import { CurrentSession, Screen } from "@/components/Common/types/common.types";
import OpenAI from "openai";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { AiChoice } from "../types/session.types";
import { AccessControlParams } from "@livepeer/react";

const useSession = (
  setNotification: (e: SetStateAction<string | undefined>) => void,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  currentSession: CurrentSession,
  screen: Screen,
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
  }
) => {
  const [openAI, setOpenAI] = useState<OpenAI | undefined>();
  const [aiChoice, setAiChoice] = useState<AiChoice>(AiChoice.OpenAi);
  const [socialPost, setSocialPost] = useState<Social[]>([Social.Lens]);
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>(
    (currentSession?.post?.metadata as TextOnlyMetadata)?.content
  );
  const [agentChat, setAgentChat] = useState<({ content: string } | string)[]>(
    []
  );
  const [saveSessionLoading, setSaveSessionLoading] = useState<boolean>(false);

  const handleSaveSession = async () => {
    setSaveSessionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const litClient = new LitJsSdk.LitNodeClientNodeJs({
        alertWhenUnauthorized: false,
        litNetwork: LIT_NETWORK.DatilDev,
        debug: true,
      });
      await litClient.connect();

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "mumbai",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address?.toLowerCase(),
          },
        },
      ];
      let image_content: string | undefined;
      if (currentSession?.image) {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: currentSession?.image,
        });

        let responseJSON = await response.json();

        image_content = "ipfs://" + responseJSON?.cid;
      }

      let video_content = undefined;

      if (currentSession?.video?.id) {
        video_content = currentSession?.video?.id;
      }

      const encoder = new TextEncoder();
      const { ciphertext, dataToEncryptHash } = await litClient.encrypt({
        accessControlConditions,
        dataToEncrypt: encoder.encode(
          JSON.stringify({
            postId: currentSession?.post?.id,
            image: image_content,
            video: video_content,
            text: currentSession?.text,
          })
        ),
      });

      const ipfsRes = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
        }),
      });
      const json = await ipfsRes.json();

      const { request } = await publicClient.simulateContract({
        address: SESSION_DATA_CONTRACT,
        abi: SessionDatabaseAbi,
        functionName: "addNewSession",
        chain: chains.testnet,
        args: ["ipfs://" + json?.cid],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: res,
      });

      setNotification?.("Session Saved! Check Memories.");
    } catch (err: any) {
      console.error(err.message);
    }
    setSaveSessionLoading(false);
  };

  const sendToAgent = async () => {
    if (!aiDetails?.data?.openAikey && !aiDetails?.data?.claudekey) return;
    setAgentLoading(true);
    try {
      let newContent = content;
      setContent("");
      setAgentChat([newContent, ...agentChat]);
      if (aiDetails?.data?.openAikey) {
        let openaiclient = openAI;
        if (!openaiclient) {
          openaiclient = new OpenAI({
            apiKey: aiDetails?.data?.openAikey,
            dangerouslyAllowBrowser: true,
          });
          setOpenAI(openaiclient);
        }

        const completion = await openaiclient.chat.completions.create({
          model: aiDetails?.data?.modelOpenAi || "gpt-4o-mini-2024-07-18",
          messages: [
            {
              role: "system",
              content:
                `You are collaborating with an artist who has stored content in their session dashboard for remixing and creating new work. Engage deeply with their ideas, offering insights to remix their content and spark fresh inspiration so that they can create a new ${
                  currentSession?.editors?.[currentSession?.currentIndex]
                }. Follow these custom instructions: ` +
                  aiDetails?.data?.instructionsOpenAi || "",
            },
            {
              role: "user",
              content:
                !newContent || newContent?.trim() == ""
                  ? (currentSession?.post?.metadata as TextOnlyMetadata)
                      ?.content
                  : newContent,
            },
          ],
        });
        typeMessage(completion.choices?.[0]?.message?.content!);
      } else {
        const response = await fetch("/api/claude", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: content,
            model: aiDetails?.data?.modelClaude || "claude-3-5-haiku-latest",
            key: aiDetails?.data?.claudekey,
          }),
        });

        const data = await response.json();

        typeMessage(data.completion);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAgentLoading(false);
  };

  const typeMessage = (data: string) => {
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < data.length) {
        setAgentChat((prev) => {
          const ag = [...prev];
          ag[0] = {
            content: (ag[0] as any)?.content + data[index],
          };

          return ag;
        });
        index++;
      } else {
        setAgentChat((prev) => {
          const ag = [...prev];
          ag[0] = {
            content: data,
          };

          return ag;
        });
        clearInterval(typingInterval);
      }
    }, 100);

    setAgentChat([data, ...agentChat]);
  };

  useEffect(() => {
    if (screen == SCREENS[1] && currentSession?.post && aiDetails) {
      sendToAgent();
    }
  }, [screen, currentSession?.post, aiDetails]);

  return {
    socialPost,
    setSocialPost,
    agentLoading,
    sendToAgent,
    content,
    setContent,
    saveSessionLoading,
    handleSaveSession,
    agentChat,
    aiChoice,
    setAiChoice,
  };
};

export default useSession;
