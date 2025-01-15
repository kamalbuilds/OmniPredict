import { SetStateAction, useEffect, useState } from "react";
import { MemeData, MemeDetails, TokenData } from "../types/memes.types";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { INFURA_GATEWAY, MEME_DATA_CONTRACT } from "@/lib/constants";
import MemeDatabaseAbi from "@abis/MemeDatabase.json";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { v4 as uuidv4 } from "uuid";
import createPost from "../../../../graphql/lens/mutations/createPost";
import {
  FeedsOrderBy,
  MainContentFocus,
  PublicClient as LensPublicClient,
} from "@lens-protocol/client";
import { getMemes } from "../../../../graphql/queries/getMemes";
import { LensAccount } from "@/components/Common/types/common.types";
import { createFeed, fetchFeeds } from "@lens-protocol/client/actions";
import { getUserMemes } from "../../../../graphql/queries/getUserMemes";
import getMemeData from "@/lib/helpers/getMemeData";

const useMemes = (
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  storageClient: StorageClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  lensAccount: LensAccount | undefined,
  lensClient: LensPublicClient
) => {
  const [postMemeLoading, setPostMemeLoading] = useState<boolean>(false);
  const [createMemeLoading, setCreateMemeLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<number>(0);
  const [screenSwitch, setScreenSwitch] = useState<number>(0);
  const [memesLoading, setMemesLoading] = useState<boolean>(false);
  const [moreMemesLoading, setMoreMemesLoading] = useState<boolean>(false);
  const [memeData, setMemeData] = useState<MemeData[]>([]);
  const [userMemes, setUserMemes] = useState<MemeData[]>([]);
  const [videoTokens, setVideoTokens] = useState<TokenData[]>([]);
  const [memeSelected, setMemeSelected] = useState<MemeData | undefined>();
  const [postContent, setPostContent] = useState<string>("");
  const [chosenUserMeme, setChosenUserMeme] = useState<MemeData | undefined>();
  const [feed, setFeed] = useState<string | undefined>();
  const [newMeme, setNewMeme] = useState<MemeDetails>({
    memeImage: undefined,
    memeTokenSymbol: "",
    memeTokenTitle: "",
    memeTokenLore: "",
    initialSupply: 1000,
    maxSupply: 1000000,
  });

  const handlePostMeme = async () => {
    if (!lensAccount?.sessionClient) {
      return;
    }
    setPostMemeLoading(true);
    try {
      const focus = MainContentFocus.Image;
      const schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";
      const image = {
        type: "image/png",
        item: memeSelected?.metadata?.image,
      };

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: postContent?.slice(0, 10),
          content: postContent,
          id: uuidv4(),
          ...image,
          locale: "en",
          tags: ["dialtone"],
        },
      });

      const res = await createPost(
        {
          contentUri: uri,
        },
        lensAccount?.sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setPostContent("");
        setIndexer?.("Post Indexing");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostMemeLoading(false);
  };

  const handleCreateFeed = async () => {
    if (
      !newMeme.memeImage ||
      !lensAccount?.sessionClient ||
      newMeme.memeTokenSymbol.trim() == "" ||
      newMeme.memeTokenTitle.trim() == ""
    )
      return;

    setCreateMemeLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
        account: address,
      });

      const builder = await lensClient.login({
        builder: {
          address,
        },
        signMessage: (message) => clientWallet.signMessage({ message } as any),
      });

      if (builder.isOk()) {
        const { uri } = await storageClient.uploadAsJson({
          $schema: "https://json-schemas.lens.dev/feed/1.0.0.json",
          lens: {
            id: uuidv4(),
            name: newMeme.memeTokenSymbol,
            title: newMeme.memeTokenTitle,
            description: newMeme.memeTokenLore,
          },
        });

        const resFeed = await createFeed(builder.value, {
          metadataUri: uri,
          admins: [address],
        });

        if (resFeed.isOk()) {
          const feeds = await fetchFeeds(lensAccount?.sessionClient, {
            orderBy: FeedsOrderBy.LatestFirst,
            filter: {
              managedBy: {
                includeOwners: true,
                address,
              },
            },
          });

          if (feeds.isOk()) {
            setFeed(feeds?.value?.items?.[0]?.address);
          }
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateMemeLoading(false);
  };

  const handleCreateMeme = async () => {
    if (
      !newMeme.memeImage ||
      !lensAccount?.sessionClient ||
      newMeme.memeTokenSymbol.trim() == "" ||
      newMeme.memeTokenTitle.trim() == "" ||
      !feed ||
      newMeme.initialSupply < 0 ||
      newMeme.maxSupply <= 0
    )
      return;
    setCreateMemeLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
        account: address,
      });
      const responseImage = await fetch("/api/ipfs", {
        method: "POST",
        body: newMeme.memeImage,
      });

      let responseImageJSON = await responseImage.json();
      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: newMeme.memeTokenTitle,
          image: "ipfs://" + responseImageJSON?.cid,
          symbol: newMeme.memeTokenSymbol,
          lore: newMeme.memeTokenLore,
        }),
      });

      let responseJSON = await response.json();

      const { request } = await publicClient.simulateContract({
        address: MEME_DATA_CONTRACT,
        abi: MemeDatabaseAbi,
        functionName: "addMeme",
        chain: chains.testnet,
        args: [
          newMeme?.memeTokenTitle,
          newMeme?.memeTokenSymbol,
          "ipfs://" + responseJSON?.cid,
          feed,
          BigInt(newMeme?.initialSupply * 10 ** 18),
          BigInt(newMeme?.maxSupply * 10 ** 18),
        ],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: res,
      });

      setFeed(undefined);
      setNewMeme({
        memeImage: undefined,
        memeTokenSymbol: "",
        memeTokenTitle: "",
        memeTokenLore: "",
        initialSupply: 1000,
        maxSupply: 1000000,
      });
      setNotification("Meme Created!");
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateMemeLoading(false);
  };

  const handleMemeData = async () => {
    if (!address) return;
    setMemesLoading(true);
    try {
      const data = await getMemes(paginated);

      const newData: MemeData[] = await Promise.all(
        data?.data?.memeAddeds?.map(async (meme: any) => {
          let metadata = meme?.metadata;

          if (!metadata) {
            const newMetadata = await fetch(
              `${INFURA_GATEWAY}${meme.data.split("ipfs://")?.[1]}`
            );
            metadata = await newMetadata.json();
          }

          const data = await getMemeData(publicClient, meme?.token, address);

          return {
            blockTimestamp: meme?.blockTimestamp,
            metadata: {
              lore: metadata?.lore,
              image: metadata?.image,
            },
            feed: meme?.feed,
            symbol: meme?.symbol,
            name: meme?.name,
            owner: meme?.owner,
            token: meme?.token,
            workflows: meme?.workflows,
            initialSupply: data?.initialSupply,
            totalSupply: data?.totalSupply,
            maxSupply: data?.maxSupply,
          };
        })
      );

      setPaginated(data?.data?.memeAddeds?.length == 20 ? paginated + 20 : 0);
      setMemeData(newData);
      setVideoTokens(
        newData?.map((item) => {
          return {
            name: item.name,
            token: item.token,
            image: item.metadata.image,
            price: "0",
            tokenPair: "ETH",
          };
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setMemesLoading(false);
  };

  const handleUserMemeData = async () => {
    if (!address) return;
    try {
      const data = await getUserMemes(address);

      const newData: MemeData[] = await Promise.all(
        data?.data?.memeAddeds?.map(async (meme: any) => {
          let metadata = meme?.metadata;

          if (!metadata) {
            const newMetadata = await fetch(
              `${INFURA_GATEWAY}${meme.data.split("ipfs://")?.[1]}`
            );
            metadata = await newMetadata.json();
          }
          const data = await getMemeData(publicClient, meme?.token, address);
          return {
            blockTimestamp: meme?.blockTimestamp,
            metadata: {
              lore: metadata?.lore,
              image: metadata?.image,
            },
            feed: meme?.feed,
            symbol: meme?.symbol,
            name: meme?.name,
            owner: meme?.owner,
            token: meme?.token,
            workflows: meme?.workflows,
            initialSupply: data?.initialSupply,
            totalSupply: data?.totalSupply,
            maxSupply: data?.maxSupply,
          };
        })
      );

      setUserMemes(newData);
      setChosenUserMeme(newData?.[0]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreMemes = async () => {
    if (paginated < 1 || !address) return;
    setMoreMemesLoading(true);
    try {
      const data = await getMemes(paginated);

      const newData: MemeData[] = await Promise.all(
        data?.data?.memeAddeds?.map(async (meme: any) => {
          let metadata = meme?.metadata;

          if (!metadata) {
            const newMetadata = await fetch(
              `${INFURA_GATEWAY}${meme.data.split("ipfs://")?.[1]}`
            );
            metadata = await newMetadata.json();
          }
          const data = await getMemeData(publicClient, meme?.token, address);
          return {
            blockTimestamp: meme?.blockTimestamp,
            metadata: {
              lore: metadata?.lore,
              image: metadata?.image,
            },
            feed: meme?.feed,
            symbol: meme?.symbol,
            name: meme?.name,
            owner: meme?.owner,
            token: meme?.token,
            workflows: meme?.workflows,
            initialSupply: data?.initialSupply,
            totalSupply: data?.totalSupply,
            maxSupply: data?.maxSupply,
          };
        })
      );

      setMemeData([...memeData, ...newData]);
      setVideoTokens([
        ...videoTokens,
        ...newData?.map((item) => {
          return {
            name: item.name,
            token: item.token,
            image: item.metadata.image,
            price: "0",
            tokenPair: "ETH",
          };
        }),
      ]);
      setPaginated(data?.data?.memeAddeds?.length == 20 ? paginated + 20 : 0);
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreMemesLoading(false);
  };

  useEffect(() => {
    if (memeData?.length < 1) {
      handleMemeData();
    }

    if (address) {
      handleUserMemeData();
    }
  }, [address]);

  return {
    memesLoading,
    memeData,
    postMemeLoading,
    handlePostMeme,
    memeSelected,
    setMemeSelected,
    postContent,
    setPostContent,
    createMemeLoading,
    handleCreateMeme,
    newMeme,
    setNewMeme,
    handleMoreMemes,
    moreMemesLoading,
    screenSwitch,
    setScreenSwitch,
    userMemes,
    setChosenUserMeme,
    chosenUserMeme,
    handleCreateFeed,
    feed,
    videoTokens,
  };
};

export default useMemes;
