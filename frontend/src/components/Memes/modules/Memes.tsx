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
    <div className="relative w-full h-full flex flex-col items-start justify-start gap-3 px-3 pb-10">
      <div className="relative w-full h-fit flex flex-row items-center justify-between gap-3 flex-wrap">
        <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-2">
          <div className="relative w-fit h-fit font-vcr text-white text-lg">
            Memes as culture and currency
          </div>
        </div>
        <div
          className="relative w-40 h-10 px-3 py-2 border border-white rounded-md text-white font-vcr flex items-center justify-center cursor-pointer active:scale-95 hover:opacity-70"
          onClick={() =>
            setScreenSwitch(screenSwitch < 3 ? screenSwitch + 1 : 0)
          }
        >
          <div className="relative w-fit h-fit text-sm text-center">
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
      <div className="relative w-full h-full flex flex-col items-start justify-start gap-10">
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
          <div className="relative w-full h-fit font-vcr text-white text-base">
            VIDEO MEME LIQUIDITY
          </div>
          <div className="relative w-full h-56 flex items-start overflow-y-scroll">
            <div className="relative items-start justify-start flex w-full h-fit flex-col gap-2">
              {(videoTokens?.length < 1
                ? Array.from({ length: 28 })
                : videoTokens
              )?.map((token, key) => {
                return (
                  <>
                    {(token as any)?.token ? (
                      <div
                        key={key}
                        className={`relative w-full h-10 rounded-md flex border flex-row items-center justify-between cursor-pointer p-1 border-sea bg-gris/70`}
                        onClick={() =>
                          window.open(
                            `https://block-explorer.testnet.lens.dev/address/${
                              (token as TokenData)?.token
                            }`
                          )
                        }
                      >
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          {(token as TokenData)?.name}
                        </div>
                        <div className="relative w-8 rounded-full h-8 border border-black flex items-center justify-center bg-viol">
                          <Image
                            draggable={false}
                            className="rounded-full"
                            objectFit="cover"
                            layout="fill"
                            src={`${INFURA_GATEWAY}${
                              (token as TokenData)?.image?.split(
                                "ipfs://"
                              )?.[1]
                            }`}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        key={key}
                        className={`relative w-full h-10 rounded-md flex border border-sea bg-gris/70 animate-pulse`}
                      ></div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
        {screenSwitch == 0 ? (
          <div className="relative w-full h-full flex flex-col items-center justify-start border border-sea rounded-md bg-gris/70 p-2 gap-3">
            <div className="relative w-full h-full flex items-center justify-start flex-col gap-3">
              <div className="relative w-full h-full flex items-center justify-start flex-col gap-3">
                <div className="relative w-fit h-fit flex items-center justify-center text-center text-sm">
                  TODAY'S TOP MEMES IN OMNIPredict
                </div>
                <div className="relative w-full h-[22rem] max-h-full overflow-y-scroll flex">
                  <div className="relative items-start justify-between flex w-full h-fit flex-wrap gap-4">
                    {(memesLoading || memeData?.length < 1
                      ? Array.from({ length: 28 })
                      : memeData
                    )?.map((meme, key) => {
                      return (
                        <>
                          {(meme as MemeData)?.symbol ? (
                            <div
                              key={key}
                              className={`relative w-20 h-20 rounded-md flex border border-sea bg-viol ${
                                !postMemeLoading &&
                                "cursor-pointer hover:opacity-70"
                              } ${
                                memeSelected?.name == (meme as MemeData)?.name &&
                                "opacity-50"
                              }`}
                              onClick={() =>
                                !postMemeLoading &&
                                setMemeSelected(meme as MemeData)
                              }
                            >
                              <Image
                                draggable={false}
                                className="rounded-md"
                                objectFit="cover"
                                layout="fill"
                                src={`${INFURA_GATEWAY}${
                                  (meme as MemeData)?.metadata?.image?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`}
                              />
                            </div>
                          ) : (
                            <div
                              key={key}
                              className={`relative w-20 h-20 rounded-md flex border border-sea bg-viol animate-pulse`}
                            ></div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="relative w-full h-full flex items-start justify-between flex-col gap-3">
                <div className="relative w-full h-full flex items-start justify-between flex-col gap-3">
                  <textarea
                    className="focus:outline-none flex relative w-full h-full border text-sm border-sea rounded-md p-1 bg-gris/80"
                    style={{
                      resize: "none",
                    }}
                    placeholder="Add a note?"
                    value={postContent}
                    disabled={postMemeLoading}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div
                    className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
                    onClick={() =>
                      !postMemeLoading &&
                      memeSelected?.metadata?.image &&
                      handlePostMeme()
                    }
                  >
                    <div className="absolute top-0 left-0 flex w-28 h-8">
                      <Image
                        src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                        layout="fill"
                        objectFit="fill"
                        draggable={false}
                      />
                    </div>
                    {postMemeLoading ? (
                      <div className="relative w-4 h-4 animate-spin flex">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                        />
                      </div>
                    ) : (
                      <div className="relative flex w-fit h-fit font-digi">
                        Share Meme
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : screenSwitch == 1 ? (
          <div className="relative w-full h-full flex flex-col items-center justify-start border border-sea rounded-md bg-gris/70 p-2 gap-3">
            <div className="relative w-full h-full flex items-start justify-between flex-col gap-3">
              <div className="relative w-full h-fit flex items-start justify-between flex-row gap-3">
                <div className="relative w-full h-fit flex">
                  <input
                    className="relative w-full h-8 flex rounded-md bg-gris border border-sea text-sm p-1"
                    placeholder={"Meme Token Name"}
                    disabled={createMemeLoading}
                    value={newMeme?.memeTokenTitle}
                    onChange={(e) =>
                      setNewMeme({
                        ...newMeme,
                        memeTokenTitle: e?.target?.value,
                      })
                    }
                  />
                </div>
                <div className="relative w-full h-fit flex">
                  <input
                    className="relative w-full h-8 flex rounded-md bg-gris border border-sea text-sm p-1"
                    placeholder={"Meme Token Symbol"}
                    disabled={createMemeLoading}
                    value={newMeme?.memeTokenSymbol}
                    onChange={(e) =>
                      setNewMeme({
                        ...newMeme,
                        memeTokenSymbol: e?.target?.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="relative w-full h-fit flex items-start justify-between flex-row gap-3">
                <div className="relative w-full h-fit flex flex-col gap-1">
                  <div className="relative w-fit h-fit flex text-xs">
                    Initial Supply
                  </div>
                  <input
                    className="relative w-full h-8 flex rounded-md bg-gris border border-sea text-sm p-1"
                    placeholder={"Initial Supply"}
                    disabled={createMemeLoading}
                    type="number"
                    step={1}
                    min={0}
                    value={newMeme?.initialSupply}
                    onChange={(e) =>
                      setNewMeme({
                        ...newMeme,
                        initialSupply: Number(e?.target?.value),
                      })
                    }
                  />
                </div>
                <div className="relative w-full h-fit flex flex-col gap-1">
                  <div className="relative w-fit h-fit flex text-xs">
                    Max Supply
                  </div>
                  <input
                    className="relative w-full h-8 flex rounded-md bg-gris border border-sea text-sm p-1"
                    placeholder={"Max Supply"}
                    disabled={createMemeLoading}
                    type="number"
                    step={1}
                    min={0}
                    value={newMeme?.maxSupply}
                    onChange={(e) =>
                      setNewMeme({
                        ...newMeme,
                        maxSupply: Number(e?.target?.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-row gap-2 justify-between items-center">
                <textarea
                  className="focus:outline-none flex relative w-full h-40 border text-sm border-sea rounded-md p-1 bg-gris/80"
                  style={{
                    resize: "none",
                  }}
                  placeholder="Tell us more about the lore..."
                  value={newMeme?.memeTokenLore}
                  disabled={createMemeLoading}
                  onChange={(e) =>
                    setNewMeme({
                      ...newMeme,
                      memeTokenLore: e?.target?.value,
                    })
                  }
                />
              </div>
              <div className="relative flex w-full h-full flex-col gap-1 items-start justify-start">
                <div className="relative w-fit h-fit text-black text-xs">
                  Origin Meme
                </div>
                <label className="relative cursor-pointer h-full w-full rounded-md border border-sea flex">
                  {newMeme?.memeImage && (
                    <Image
                      src={URL.createObjectURL(newMeme.memeImage)}
                      objectFit="cover"
                      layout="fill"
                      draggable={false}
                      className="rounded-md"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    hidden
                    required
                    id="files"
                    multiple={false}
                    name="pfp"
                    disabled={createMemeLoading}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (!e.target.files || e.target.files.length === 0)
                        return;
                      setNewMeme({
                        ...newMeme,
                        memeImage: e?.target?.files?.[0],
                      });
                    }}
                  />
                </label>
              </div>
              <div className="relative w-fit h-fit text-black text-xs">
                Create your custom feed and then meme!
              </div>
              <div className="relative w-fit h-fit flex">
                <div
                  className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-7 cursor-pointer active:scale-95`}
                  onClick={() =>
                    !createMemeLoading &&
                    (feed ? handleCreateMeme() : handleCreateFeed())
                  }
                >
                  <div className="absolute top-0 left-0 flex w-28 h-7">
                    <Image
                      src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                      layout="fill"
                      objectFit="fill"
                      draggable={false}
                    />
                  </div>
                  {createMemeLoading ? (
                    <div className="relative w-4 h-4 animate-spin flex">
                      <Image
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                        src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                      />
                    </div>
                  ) : (
                    <div className="relative flex w-fit h-fit font-digi">
                      {!feed ? "Create Feed" : "Create Meme"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : screenSwitch == 2 ? (
          <div className="relative w-full h-full flex items-start justify-start border border-sea rounded-md bg-gris/70 p-2">
            {userMemes?.length < 1 ? (
              <div className="relative w-full h-full text-sm flex items-center justify-center">
                No memes here yet, start by creating one?
              </div>
            ) : (
              <Workflows
                chosenUserMeme={chosenUserMeme}
                setChosenUserMeme={setChosenUserMeme}
                userMemes={userMemes}
              />
            )}
          </div>
        ) : (
          <MemeFeed memeData={memeData} setScreen={setScreen} />
        )}
      </div>
    </div>
  );
};

export default Memes;
