import ActivePost from "@/components/Session/modules/ActivePost";
import { FunctionComponent, JSX } from "react";
import useMemories from "../hooks/useMemories";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, SCREENS } from "@/lib/constants";
import { EditorType } from "@/components/Feed/types/feed.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { MemoriesProps, Memory } from "../types/memories.types";
import { http, useAccount } from "wagmi";
import { chains } from "@lens-network/sdk/viem";
import { createPublicClient } from "viem";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import * as Player from "@livepeer/react/player";
import {
  LoadingIcon,
  PlayIcon,
  PauseIcon,
  MuteIcon,
  UnmuteIcon,
} from "@livepeer/react/assets";

const Memories: FunctionComponent<MemoriesProps> = ({
  setScreen,
  setCurrentSession,
  currentSession,
  sessionClient,
}): JSX.Element => {
  const { address } = useAccount();
  
  const publicClient = createPublicClient({
    chain: chains.testnet,
    transport: http("https://rpc.testnet.lens.dev"),
  });
  const {
    handleMoreMemories,
    memories,
    memoriesLoading,
    moreMemoriesLoading,
    paginated,
    handleDeleteMemory,
    deleteMemoryLoading,
    handleDecrypt,
    decryptLoading,
    handleMemorySession,
  } = useMemories(
    address,
    publicClient,
    sessionClient!,
    setScreen,
    setCurrentSession
  );
  return (
    <div className="relative w-full h-fit sm:h-full flex items-start justify-start overflow-y-scroll pb-10 rounded-md">
      {!memoriesLoading && memories?.length < 1 ? (
        <div
          className="relative w-full gap-4 flex flex-col items-center bg-white text-center rounded-md justify-center h-full font-digi text-sm cursor-pointer"
          onClick={() => setScreen(SCREENS[1])}
        >
          No Saved Memories yet. <br /> Create a new session?
        </div>
      ) : (
        <InfiniteScroll
          dataLength={
            memoriesLoading
              ? 20
              : moreMemoriesLoading
              ? memories?.length + 20
              : memories?.length
          }
          next={handleMoreMemories}
          hasMore={!paginated || memoriesLoading ? false : true}
          loader={<></>}
          className="relative w-full gap-4 flex flex-col items-start justify-start"
        >
          {memoriesLoading || memories?.length < 1
            ? Array.from({ length: 20 }).map((_, key) => {
                return (
                  <div
                    key={key}
                    className="relative w-full h-[32rem] rounded-md bg-white flex flex-col animate-pulse"
                  ></div>
                );
              })
            : (moreMemoriesLoading
                ? [...memories, Array.from({ length: 20 })]
                : memories
              ).map((memory, key) => {
                return (memory as Memory)?.id ? (
                  <div
                    key={key}
                    className="relative w-full h-fit p-3 flex flex-col gap-2 rounded-md bg-white"
                  >
                    {!(memory as Memory)?.decrypted && (
                      <div className="relative w-full h-fit flex items-center justify-center">
                        <div
                          className={`relative px-3 py-1 flex items-center justify-center text-black w-36 h-8 cursor-pointer active:scale-95`}
                          onClick={() =>
                            !decryptLoading[key] &&
                            handleDecrypt(Number((memory as Memory)?.id))
                          }
                        >
                          <div className="absolute top-0 left-0 flex w-36 h-8">
                            <Image
                              src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                              layout="fill"
                              objectFit="fill"
                              draggable={false}
                            />
                          </div>
                          {decryptLoading[key] ? (
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
                              Decrypt Memory
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {(memory as Memory)?.decodedData &&
                      (memory as Memory)?.decrypted && (
                        <>
                          <div className="relative w-full h-full bg-white rounded-md flex flex-row gap-3 items-end justify-between p-4 border-2 border-sea">
                            {(memory as Memory)?.post && (
                              <div
                                className={`relative h-full items-start justify-between flex flex-col gap-3 p-2 border border-sea bg-gris/50 rounded-md  w-80`}
                              >
                                <ActivePost post={(memory as Memory)?.post} />
                              </div>
                            )}
                            <div
                              className={
                                "relative w-full h-full flex flex-col gap-3 items-end justify-between bg-gris/50 border border-sea rounded-md p-2"
                              }
                            >
                              <div className="relative w-fit h-fit flex items-center justify-center gap-2">
                                <div className="relative flex w-fit h-fit">
                                  <div className="relative w-8 h-8 flex">
                                    <Image
                                      layout="fill"
                                      objectFit="cover"
                                      draggable={false}
                                      src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`relative px-3 py-1 flex items-center justify-between flex-row gap-2 text-black w-40 h-8`}
                                >
                                  <div className="absolute top-0 left-0 flex w-40 h-8">
                                    <Image
                                      src={`${INFURA_GATEWAY}QmWg46fikev1HPfq676w17YmtPmySeaw2gTXZV1biEqWbV`}
                                      layout="fill"
                                      objectFit="fill"
                                      draggable={false}
                                    />
                                  </div>
                                  {[
                                    {
                                      image:
                                        "QmYvafNLFpXjYLL5osdvoDTAAfuYBGKAMQyH8eXGynwJNd",
                                      title: EditorType.Video,
                                    },
                                    {
                                      image:
                                        "QmRHVXnb2C4DwZebG7v6wXMWCAcrQrRX7T1ch7u3kU3Vyb",
                                      title: EditorType.Image,
                                    },
                                    {
                                      image:
                                        "QmUpZ4Tc3hXSPcrGtovVaG5ggZY13UWrnfFtrRpiQs73xK",
                                      title: EditorType.Audio,
                                    },
                                    {
                                      image:
                                        "QmRjCfexkJNTmxFxcTNzeoM2UZyYSA3j88E9rN98nZ7jTP",
                                      title: EditorType.Text,
                                    },
                                  ].map((item, key) => {
                                    return (
                                      <div
                                        key={key}
                                        className={`relative w-fit p-1 rounded-full h-fit flex cursor-pointer hover:opacity-70 ${
                                          currentSession?.editors?.find(
                                            (_, ind) =>
                                              ind ==
                                              currentSession?.currentIndex
                                          ) == item.title && "bg-sea"
                                        }`}
                                        title={item.title}
                                        onClick={() =>
                                          handleMemorySession(
                                            memory as Memory,
                                            item,
                                            currentSession?.currentIndex
                                          )
                                        }
                                      >
                                        <div className="relative w-5 h-5 flex">
                                          <Image
                                            src={`${INFURA_GATEWAY}${item.image}`}
                                            draggable={false}
                                            objectFit="contain"
                                            layout="fill"
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-center">
                            {(memory as Memory)?.decodedData?.text && (
                              <div className="relative w-full h-fit max-h-52 flex rounded-md border border-sea overflow-y-scroll items-start justify-center p-1.5 bg-gris/70">
                                <EditorProvider
                                  content={
                                    (memory as Memory)?.decodedData?.text
                                  }
                                  editable={false}
                                  editorProps={{
                                    attributes: {
                                      class:
                                        "border w-full h-full overflow-y-scroll border-sea p-2 focus:outline-none",
                                    },
                                  }}
                                  extensions={[
                                    Color.configure({
                                      types: [TextStyle.name, ListItem.name],
                                    }),
                                    TextStyle,
                                    StarterKit.configure({
                                      bulletList: {
                                        keepMarks: true,
                                        keepAttributes: false,
                                      },
                                      orderedList: {
                                        keepMarks: true,
                                        keepAttributes: false,
                                      },
                                    }),
                                  ]}
                                ></EditorProvider>
                              </div>
                            )}
                            {(memory as Memory)?.decodedData?.image && (
                              <div className="relative w-full h-52 flex rounded-md border border-sea bg-gris/70">
                                <Image
                                  src={`${INFURA_GATEWAY}${
                                    (
                                      memory as Memory
                                    )?.decodedData?.image?.split("ipfs://")?.[1]
                                  }`}
                                  draggable={false}
                                  layout="fill"
                                  className="rounded-md"
                                  objectFit="cover"
                                />
                              </div>
                            )}
                            {(memory as Memory)?.decodedData?.src && (
                              <div className="relative w-full h-52 bg-darker rounded-md flex">
                                <Player.Root
                                  autoPlay
                                  src={(memory as Memory)?.decodedData?.src!}
                                >
                                  <Player.Container className="relative flex w-full h-full">
                                    <Player.Video
                                      title="Edit stream"
                                      className="relative flex w-full h-full rounded-md"
                                    />
                                    <Player.LoadingIndicator className="w-full relative h-full bg-black/50 backdrop-blur data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <LoadingIcon className="w-8 h-8 animate-spin" />
                                      </div>
                                    </Player.LoadingIndicator>
                                    <Player.Controls className="flex items-center justify-center">
                                      <Player.PlayPauseTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0">
                                        <Player.PlayingIndicator
                                          asChild
                                          matcher={false}
                                        >
                                          <PlayIcon className="w-full h-full" />
                                        </Player.PlayingIndicator>
                                        <Player.PlayingIndicator asChild>
                                          <PauseIcon className="w-full h-full" />
                                        </Player.PlayingIndicator>
                                      </Player.PlayPauseTrigger>

                                      <Player.MuteTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0">
                                        <Player.VolumeIndicator
                                          asChild
                                          matcher={false}
                                        >
                                          <MuteIcon className="w-full h-full" />
                                        </Player.VolumeIndicator>
                                        <Player.VolumeIndicator
                                          asChild
                                          matcher={true}
                                        >
                                          <UnmuteIcon className="w-full h-full" />
                                        </Player.VolumeIndicator>
                                      </Player.MuteTrigger>
                                      <Player.Volume className="relative mr-1 flex-1 group flex cursor-pointer items-center select-none touch-none max-w-[120px] h-5">
                                        <Player.Track className="bg-white/30 relative grow rounded-full transition h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
                                          <Player.Range className="absolute bg-white rounded-full h-full" />
                                        </Player.Track>
                                        <Player.Thumb className="block transition group-hover:scale-110 w-3 h-3 bg-white rounded-full" />
                                      </Player.Volume>
                                    </Player.Controls>
                                  </Player.Container>
                                </Player.Root>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    {(memory as Memory)?.decrypted && (
                      <div className="relative w-full h-fit flex items-end justify-end">
                        <div
                          className={`relative px-3 py-1 flex items-center justify-center text-black w-36 h-8 cursor-pointer active:scale-95`}
                          onClick={() =>
                            !deleteMemoryLoading[key] &&
                            handleDeleteMemory(Number((memory as Memory)?.id))
                          }
                        >
                          <div className="absolute top-0 left-0 flex w-36 h-8">
                            <Image
                              src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                              layout="fill"
                              objectFit="fill"
                              draggable={false}
                            />
                          </div>
                          {deleteMemoryLoading[key] ? (
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
                              Delete Memory
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    key={key}
                    className="relative w-full h-[32rem] rounded-md bg-white flex flex-col animate-pulse"
                  ></div>
                );
              })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Memories;
