import { FunctionComponent, JSX } from "react";
import useMemes from "../hooks/useMemes";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { MemeData, MemesProps, TokenData } from "../types/memes.types";
import { createPublicClient, http } from "viem";
import { chains } from "@lens-network/sdk/viem";
import MemeFeed from "./MemeFeed";
import Workflows from "./Workflows";

const Memes: FunctionComponent<MemesProps> = ({
  setIndexer,
  setNotification,
  setSignless,
  storageClient,
  lensAccount,
  address,
  setScreen,
  lensClient,
}): JSX.Element => {
  const publicClient = createPublicClient({
    chain: chains.testnet,
    transport: http("https://rpc.testnet.lens.dev"),
  });
  const {
    memeData,
    memesLoading,
    videoTokens,
    postMemeLoading,
    handlePostMeme,
    postContent,
    setPostContent,
    memeSelected,
    setMemeSelected,
    createMemeLoading,
    handleCreateMeme,
    newMeme,
    setNewMeme,
    screenSwitch,
    setScreenSwitch,
    userMemes,
    setChosenUserMeme,
    chosenUserMeme,
    handleCreateFeed,
    feed,
  } = useMemes(
    publicClient,
    address,
    storageClient,
    setSignless,
    setNotification,
    setIndexer,
    lensAccount,
    lensClient
  );

  return (
    <div className="relative min-w-[25vw] w-[95vw] mx-auto h-full min-h-screen pb-12">
      <div className="relative w-full h-full bg-black/20 backdrop-blur-lg rounded-2xl flex flex-row gap-8 items-start justify-between p-8 border-2 border-[var(--neon-blue)] shadow-[0_0_15px_rgba(1,205,254,0.5)]">
        {/* Left Sidebar */}
        <div className="relative w-80 h-full flex flex-col items-start justify-between gap-6 sticky top-8">
          <div className="relative w-full h-fit flex flex-col gap-6">
            <div className="relative w-fit h-fit flex text-xl font-pixel text-[var(--neon-pink)] neon-text">
              Memes as culture and currency
            </div>
            <div className="relative w-full h-fit flex">
              <div
                className={`relative px-6 py-3 flex items-center justify-center text-white w-full h-14 cursor-pointer active:scale-95 transition-all duration-200 retro-button rounded-xl hover:shadow-[0_0_20px_rgba(255,113,206,0.5)]`}
                onClick={() =>
                  setScreenSwitch(screenSwitch < 3 ? screenSwitch + 1 : 0)
                }
              >
                <div className="relative flex w-fit h-fit font-pixel text-base">
                  {screenSwitch == 1
                    ? "<- Create Memes ->"
                    : screenSwitch == 2
                    ? "<- Edit Memes ->"
                    : screenSwitch < 1
                    ? "<- Share Memes ->"
                    : "<- Meme Feeds ->"}
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit overflow-y-scroll flex flex-col gap-6">
            <div className="relative w-full h-fit flex flex-col gap-3">
              <div className="relative w-fit h-fit flex text-lg font-pixel text-[var(--neon-green)] neon-text">
                VIDEO MEME LIQUIDITY
              </div>
              <div className="relative w-fit h-fit flex text-base text-[var(--neon-blue)]">
                supplied by creators like you
              </div>
            </div>
            <div className="relative w-full max-h-[calc(100vh-20rem)] flex items-start overflow-y-scroll custom-scrollbar pr-4">
              <div className="relative items-start justify-start flex w-full h-fit flex-col gap-4">
                {(videoTokens?.length < 1
                  ? Array.from({ length: 28 })
                  : videoTokens
                )?.map((token: TokenData | undefined, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex cursor-pointer hover:opacity-80 active:scale-95"
                      onClick={() =>
                        !token?.id
                          ? {}
                          : setChosenUserMeme(
                              chosenUserMeme?.id === token?.id ? undefined : token
                            )
                      }
                    >
                      <div
                        className={`relative w-full h-14 flex items-center justify-center rounded-xl border-2 ${
                          token?.id === chosenUserMeme?.id
                            ? "border-[var(--neon-pink)] shadow-[0_0_15px_rgba(255,113,206,0.5)]"
                            : "border-[var(--neon-blue)]"
                        } bg-black/40 p-3`}
                      >
                        <div className="relative w-full h-fit flex items-center justify-between text-white font-pixel text-sm">
                          <div className="relative w-fit h-fit flex items-center justify-center gap-3">
                            <div
                              className="relative w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center"
                              title={token?.name || "Loading..."}
                            >
                              {token?.metadata?.image && (
                                <Image
                                  src={`${INFURA_GATEWAY}${
                                    token?.metadata?.image?.split("ipfs://")?.[1]
                                  }`}
                                  draggable={false}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-lg"
                                />
                              )}
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {token?.symbol || "..."}
                            </div>
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center text-[var(--neon-green)]">
                            {token?.totalSupply
                              ? Number(token?.totalSupply) / 10 ** 18
                              : "0"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative flex-grow h-full flex flex-col gap-8">
          <div className="relative w-full h-fit flex items-center justify-between">
            <div className="text-2xl font-pixel text-[var(--neon-pink)] neon-text">
              Today's Top Memes
            </div>
            <button 
              className="retro-button px-6 py-3 rounded-xl text-base font-pixel"
              onClick={() => handleCreateMeme()}
            >
              CREATE NEW MEME
            </button>
          </div>

          {/* Meme Grid */}
          <div className="relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {memeData?.map((meme, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden retro-card group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                onClick={() => setMemeSelected(meme)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                {meme?.metadata?.image && (
                  <Image
                    src={`${INFURA_GATEWAY}${meme?.metadata?.image?.split("ipfs://")?.[1]}`}
                    layout="fill"
                    objectFit="cover"
                    alt={meme?.name || "Meme"}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-lg font-pixel text-white truncate neon-text">
                      {meme?.name}
                    </div>
                    <div className="text-sm font-mono text-[var(--neon-green)]">
                      {meme?.symbol}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memes;
