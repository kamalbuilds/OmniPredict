import { LensAccount } from "@/components/Common/types/common.types";
import { SESSION_DATA_CONTRACT, STORAGE_NODE } from "@/lib/constants";
import { fetchAccount } from "@lens-protocol/client/actions";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import updateAccount from "../../../../graphql/lens/mutations/updateAccount";
import pollResult from "@/lib/helpers/pollResult";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import SessionDatabaseAbi from "@abis/SessionDatabase.json";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { AccessControlParams } from "@livepeer/react";

const useUpdateAccount = (
  lensAccount: LensAccount | undefined,
  storageClient: StorageClient,
  setLensAccount: (e: SetStateAction<LensAccount | undefined>) => void,
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
  },
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  setNotification: (e: SetStateAction<string | undefined>) => void
) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [updatedAccount, setUpdatedAccount] = useState<{
    pfp?: string | Blob | undefined;
    cover?: string | Blob | undefined;
    bio: string;
    name: string;
  }>({
    pfp: lensAccount?.account?.metadata?.picture,
    cover: lensAccount?.account?.metadata?.coverPicture,
    bio: lensAccount?.account?.metadata?.bio || "",
    name: lensAccount?.account?.metadata?.name || "",
  });
  const [modelOpenAiOpen, setModelOpenAiOpen] = useState<boolean>(false);
  const [modelClaudeOpen, setModelClaudeOpen] = useState<boolean>(false);

  const handleSetAIDetails = async () => {
    if (
      (!aiDetails?.data?.openAikey && !aiDetails?.data?.claudekey) ||
      !address
    )
      return;
    setAiLoading(true);
    try {
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

      const encoder = new TextEncoder();
      const { ciphertext, dataToEncryptHash } = await litClient.encrypt({
        accessControlConditions,
        dataToEncrypt: encoder.encode(JSON.stringify(aiDetails?.data)),
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

      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: SESSION_DATA_CONTRACT,
        abi: SessionDatabaseAbi,
        functionName: "ownerSetKeys",
        chain: chains.testnet,
        args: ["ipfs://" + json?.cid],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: res,
      });

      setNotification?.("AI Config Set. Start a new session.");
    } catch (err: any) {
      console.error(err.message);
    }
    setAiLoading(false);
  };

  const handleUpdateAccount = async () => {
    if (!lensAccount?.sessionClient) return;
    setUpdateLoading(true);
    try {
      let picture = {},
        cover = {};

      if (updatedAccount?.pfp && updatedAccount.pfp instanceof Blob) {
        const res = await fetch("/api/ipfs", {
          method: "POST",
          body: updatedAccount?.pfp,
        });
        const json = await res.json();

        const { uri } = await storageClient.uploadAsJson({
          type: "image/png",
          item: "ipfs://" + json?.cid,
        });

        picture = {
          picture: uri,
        };
      }

      if (updatedAccount?.cover && updatedAccount.cover instanceof Blob) {
        const res = await fetch("/api/ipfs", {
          method: "POST",
          body: updatedAccount?.cover,
        });
        const json = await res.json();

        const { uri } = await storageClient.uploadAsJson({
          type: "image/png",
          item: "ipfs://" + json?.cid,
        });

        cover = {
          cover: uri,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: "https://json-schemas.lens.dev/account/1.0.0.json",
        lens: {
          id: uuidv4(),
          name: updatedAccount?.name,
          bio: updatedAccount?.bio,
          ...picture,
          ...cover,
        },
      });

      const accountResponse = await updateAccount(
        {
          metadataUri: uri,
        },
        lensAccount?.sessionClient
      );

      if ((accountResponse as any)?.hash) {
        if (
          await pollResult(
            (accountResponse as any)?.hash,
            lensAccount?.sessionClient
          )
        ) {
          const result = await fetchAccount(lensAccount?.sessionClient, {
            address: lensAccount?.account?.address,
          });

          let picture = "";
          const cadena = await fetch(
            `${STORAGE_NODE}/${
              (result as any)?.metadata?.picture?.split("lens://")?.[1]
            }`
          );

          if (cadena) {
            const json = await cadena.json();
            picture = json.item;
          }

          if ((result as any)?.__typename == "Account") {
            setLensAccount?.({
              ...lensAccount,
              account: {
                ...(result as any),
                metadata: {
                  ...(result as any)?.metadata,
                  picture,
                },
              },
            });
          }
        } else {
          console.error(accountResponse);
          setUpdateLoading(false);
          return;
        }
      } else {
        console.error(accountResponse);
        setUpdateLoading(false);
        return;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setUpdateLoading(false);
  };

  return {
    updatedAccount,
    setUpdatedAccount,
    handleUpdateAccount,
    updateLoading,
    handleSetAIDetails,
    aiLoading,
    modelOpenAiOpen,
    setModelOpenAiOpen,
    modelClaudeOpen,
    setModelClaudeOpen,
  };
};

export default useUpdateAccount;
