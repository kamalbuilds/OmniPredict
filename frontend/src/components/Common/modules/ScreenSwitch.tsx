import { FunctionComponent, JSX } from "react";

import Account from "@/components/Account/modules/Account";
import SessionSwitch from "@/components/Session/modules/SessionSwitch";
import ActivePost from "@/components/Session/modules/ActivePost";
import AIResponse from "@/components/Session/modules/AIResponse";
import Chat from "@/components/Session/modules/Chat";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import useSession from "@/components/Session/hooks/useSession";
import { EditorType, Social } from "@/components/Feed/types/feed.types";

import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { ScreenSwitchProps } from "../types/common.types";
import Memes from "@/components/Memes/modules/Memes";
import Memories from "@/components/Memories/modules/Memories";
import Reach from "@/components/Reach/modules/Reach";
import Feed from "@/components/Feed/modules/Feed";

const ScreenSwitch: FunctionComponent<ScreenSwitchProps> = ({
  screen,
  setImageView,
  lensClient,
  setPostLive,
  setScreen,
  setCurrentSession,
  currentSession,
  setGifOpen,
  storageClient,
  setSignless,
  setIndexer,
  setNotification,
  setExpand,
  expand,
  lensAccount,
  aiDetails,
  gifOpen,
  handleDecryptAiDetails,
  decryptAiDetailsLoading
}): JSX.Element => {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: chains.testnet,
    transport: http("https://rpc.testnet.lens.dev"),
  });
  const {
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
  } = useSession(
    setNotification,
    publicClient,
    address,
    currentSession,
    screen,
    aiDetails
  );

  switch (screen?.title) {
    case "Account":
      return <Account />;

    case "Memes":
      return (
        <Memes
          storageClient={storageClient}
          lensAccount={lensAccount}
          setSignless={setSignless}
          setIndexer={setIndexer}
          setNotification={setNotification}
          address={address}
          lensClient={lensClient!}
          setScreen={setScreen}
        />
      );

    case "Memories":
      return (
        <Memories
          setScreen={setScreen}
          setCurrentSession={setCurrentSession}
          currentSession={currentSession}
          sessionClient={lensAccount?.sessionClient}
        />
      );

    case "Reach":
      return (
        <Reach
          gifOpen={gifOpen}
          setImageView={setImageView}
          setCurrentSession={setCurrentSession}
          currentSession={currentSession}
          storageClient={storageClient}
          sessionClient={lensAccount?.sessionClient}
          lensClient={lensClient}
          setSignless={setSignless}
          setIndexer={setIndexer}
          setNotification={setNotification}
          lensAccount={lensAccount}
          setGifOpen={setGifOpen}
          setScreen={setScreen}
        />
      );

    case "Sessions":
      return (
        <div className="relative w-full h-full pb-6 md:overflow-y-auto overflow-y-scroll">
          <div className="relative w-full h-full bg-white rounded-md flex flex-col md:flex-row gap-3 items-start justify-between p-4 border-2 border-sea md:overflow-y-auto overflow-y-scroll">
            <div
              className={`relative h-full items-start justify-between flex flex-col gap-3 p-2 border border-sea bg-gris/50 rounded-md ${
                !expand ? "w-full md:w-80" : "w-full md:w-[32rem]"
              }`}
            >
              <ActivePost post={currentSession?.post} setScreen={setScreen} />
              <AIResponse agentChat={agentChat} />
              <Chat
                sendToAgent={sendToAgent}
                content={content}
                setContent={setContent}
                agentLoading={agentLoading}
                aiDetails={aiDetails}
                aiChoice={aiChoice}
                setAiChoice={setAiChoice}
                setScreen={setScreen} 
                handleDecryptAiDetails={handleDecryptAiDetails}
                decryptAiDetailsLoading={decryptAiDetailsLoading}
              />
            </div>
            <div
              className={
                "relative w-full h-full flex flex-col gap-3 items-start justify-between bg-gris/50 border border-sea rounded-md p-2  md:overflow-y-auto overflow-y-scroll"
              }
            >
              <div className="relative w-full h-fit flex flex-row justify-between items-center gap-2">
                <div className="relative w-fit py-1 px-2 h-fit flex flex-row gap-1 items-center justify-center galaxy:items-start galaxy:justify-start rounded-full border border-viol bg-white">
                  {[
                    {
                      image: "QmYCDxCv7mJyjn49n84kP6d3ADgGp422ukKzRyd2ZcGEsW",
                      social: Social.Lens,
                    },
                    {
                      image: "QmUKK5v4h56nJeQs5aHheYqZ9njMxAGQxRLbv7htBjKo7c",
                      social: Social.Bluesky,
                    },

                    {
                      image: "QmPCihZbtGi8FMRW6F21KGPR2bbkmLkjpQbqvcwr2ZZrDw",
                      social: Social.Farcaster,
                    },
                  ].map((item, key) => {
                    return (
                      <div
                        key={key}
                        className={`border border-viol w-6 h-6 cursor-pointer flex relative hover:opacity-70 rounded-full bg-viol ${
                          socialPost.includes(item.social) && "opacity-70"
                        }`}
                        onClick={() =>
                          setSocialPost((prev) => {
                            let socialsPrev = [...prev];

                            if (socialsPrev.includes(item.social)) {
                              socialsPrev = socialsPrev.filter(
                                (s) => s !== item.social
                              );
                            } else {
                              socialsPrev = [...socialsPrev, item.social];
                            }

                            return socialsPrev;
                          })
                        }
                      >
                        <Image
                          title={item.social}
                          draggable={false}
                          src={`${INFURA_GATEWAY}${item.image}`}
                          layout="fill"
                          alt="type"
                        />
                      </div>
                    );
                  })}
                </div>
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
                        image: "QmYvafNLFpXjYLL5osdvoDTAAfuYBGKAMQyH8eXGynwJNd",
                        title: EditorType.Video,
                      },
                      {
                        image: "QmRHVXnb2C4DwZebG7v6wXMWCAcrQrRX7T1ch7u3kU3Vyb",
                        title: EditorType.Image,
                      },
                      {
                        image: "QmUpZ4Tc3hXSPcrGtovVaG5ggZY13UWrnfFtrRpiQs73xK",
                        title: EditorType.Audio,
                      },
                      {
                        image: "QmRjCfexkJNTmxFxcTNzeoM2UZyYSA3j88E9rN98nZ7jTP",
                        title: EditorType.Text,
                      },
                    ].map((item, key) => {
                      return (
                        <div
                          key={key}
                          className={`relative w-fit p-1 rounded-full h-fit flex cursor-pointer hover:opacity-70 ${
                            currentSession?.editors?.find(
                              (_, ind) => ind == currentSession?.currentIndex
                            ) == item.title && "bg-sea"
                          }`}
                          title={item.title}
                          onClick={() =>
                            setCurrentSession((prev) => {
                              let current = { ...prev };

                              let editors = [...current.editors];

                              editors[currentSession?.currentIndex] =
                                item.title;

                              current.editors = editors;

                              return current;
                            })
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
              <div className="relative w-full h-full p-2 rounded-md bg-white flex items-start justify-between flex-col gap-3 overflow-y-scroll">
                <SessionSwitch
                  lensAccount={lensAccount}
                  currentSession={currentSession}
                  expand={expand}
                  saveSessionLoading={saveSessionLoading}
                  setCurrentSession={setCurrentSession}
                />
                <div className="relative flex w-full justify-between gap-2 flex-row h-fit">
                  <div
                    className="relative cursor-pointer w-8 h-8 rounded-full flex"
                    onClick={() => setExpand(!expand)}
                  >
                    <Image
                      layout="fill"
                      objectFit="fill"
                      className="rounded-full"
                      draggable={false}
                      src={`${INFURA_GATEWAY}QmfZcagRwUehVHB9DixzVBeWmWUcq7L8FA9v8UQHEKb2po`}
                    />
                  </div>
                  <div className="relative w-fit h-fit flex gap-1.5 flex-row">
                    <div
                      className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
                      onClick={() => !saveSessionLoading && handleSaveSession()}
                    >
                      <div className="absolute top-0 left-0 flex w-28 h-8">
                        <Image
                          src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                          layout="fill"
                          objectFit="fill"
                          draggable={false}
                        />
                      </div>
                      {saveSessionLoading ? (
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
                          Save Session
                        </div>
                      )}
                    </div>
                    <div
                      className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
                      onClick={() => setPostLive(true)}
                    >
                      <div className="absolute top-0 left-0 flex w-28 h-8">
                        <Image
                          src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                          layout="fill"
                          objectFit="fill"
                          draggable={false}
                        />
                      </div>
                      {saveSessionLoading ? (
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
                          Post Live
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <Feed
          gifOpen={gifOpen}
          setGifOpen={setGifOpen}
          setScreen={setScreen}
          client={lensAccount?.sessionClient || lensClient}
          setImageView={setImageView}
          currentSession={currentSession}
          setCurrentSession={setCurrentSession}
          setIndexer={setIndexer}
          setNotification={setNotification}
          setSignless={setSignless}
          storageClient={storageClient}
          sessionClient={lensAccount?.sessionClient!}
        />
      );
  }
};

export default ScreenSwitch;
