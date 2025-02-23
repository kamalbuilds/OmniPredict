"use client";

import useScreens from "@/components/Common/hooks/useScreens";
import ScreenSwitch from "@/components/Common/modules/ScreenSwitch";
import { INFURA_GATEWAY, SCREENS } from "@/lib/constants";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useAccount } from "wagmi";
import { AppContext } from "./providers";
import { createPublicClient, http } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { PredictionDashboard } from "@/components/PredictionDashboard/PredictionDashboard";

export default function Home() {
  const router = useRouter();
  
  const publicClient = createPublicClient({
    chain: chains.testnet,
    transport: http("https://rpc.testnet.lens.dev"),
  });

  const { address, isConnected } = useAccount();
  const context = useContext(AppContext);
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const {
    setScreen,
    screen,
    accountOpen,
    setAccountOpen,
    login,
    logout,
    lensLoading,
    expand,
    setExpand,
    handleDecryptAiDetails,
    decryptAiDetailsLoading,
  } = useScreens(
    address,
    context?.lensClient!,
    context?.lensAccount,
    context?.setLensAccount!,
    context?.setIndexer!,
    context?.setCreateAccount!,
    context?.aiDetails!,
    context?.setAiDetails!,
    publicClient
  );

  return (
    <div className="relative w-full flex h-screen items-start justify-between pt-4 px-2 tablet:px-0 gap-4 flex-col tablet:overflow-hidden">
      <div className="relative w-full h-fit flex items-center justify-between gap-2 flex-row px-2 tablet:px-6">
        <div
          className="relative w-fit h-fit flex text-white cursor-pointer text-2xl uppercase"
          onClick={() => router.push("/")}
        >
          omnipredict
        </div>
        <div className="relative w-fit h-fit flex">
          <div
            className="relative w-10 h-10 flex cursor-pointer"
            onClick={() => setAccountOpen(!accountOpen)}
          >
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}QmadhzbqaLD8otxzgLFUK4egzXaSn82S4DJaAZzre4QJuu`}
              objectFit="cover"
              alt="icon"
            />
          </div>
          {accountOpen && (
            <div className="absolute w-40 h-fit rounded-md flex bg-light right-0 top-10 flex-col gap-5 border border-dark p-2 z-40">
              {context?.lensAccount && (
                <div
                  className={`relative w-full h-fit flex items-center justify-start flex-row gap-1`}
                >
                  <div className="relative w-fit h-fit flex">
                    <div className="relative rounded-full w-6 h-6 bg-dark border border-vil">
                      {context?.lensAccount?.account?.metadata?.picture && (
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}${
                            context?.lensAccount?.account?.metadata?.picture?.split(
                              "ipfs://"
                            )?.[1]
                          }`}
                          draggable={false}
                          className="rounded-full"
                          alt="pfp"
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-full h-fit flex items-center justify-center text-black">
                    {context?.lensAccount?.account?.username?.localName}
                  </div>
                </div>
              )}
              <div className="relative w-full h-fit flex flex-col gap-2 font-digi">
                {context?.lensAccount?.account && (
                  <div
                    className="relative flex w-full h-10 rounded-md bg-viol active:scale-95 cursor-pointer items-center justify-center text-center text-sm text-black hover:opacity-80 border border-black"
                    onClick={() => {
                      setScreen(SCREENS[SCREENS.length - 1]);
                      setAccountOpen(false);
                    }}
                  >
                    Account
                  </div>
                )}
                <div
                  className="relative flex w-full h-10 rounded-md bg-viol active:scale-95 cursor-pointer items-center justify-center text-center text-sm text-black hover:opacity-80 border border-black"
                  onClick={() =>
                    isConnected ? openAccountModal?.() : openConnectModal?.()
                  }
                >
                  {isConnected ? "Disconnect" : "Connect"}
                </div>
                <div
                  className={`relative flex w-full h-10 rounded-md border border-white items-center justify-center text-center text-sm text-white bg-dark ${
                    !isConnected
                      ? "opacity-60"
                      : "active:scale-95 cursor-pointer hover:opacity-80"
                  }`}
                  onClick={() =>
                    isConnected && (!context?.lensAccount ? login() : logout())
                  }
                >
                  {lensLoading ? (
                    <div className="relative w-6 h-6 animate-spin flex">
                      <Image
                        className="relative"
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                        src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                      />
                    </div>
                  ) : context?.lensAccount ? (
                    "Log Out Lens"
                  ) : (
                    "Lens Sign In"
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full h-[calc(100vh-80px)] flex flex-row items-start justify-center gap-10">
        <div className="relative h-full flex-none flex items-start justify-start flex-col pl-2 tablet:pl-6 w-32 tablet:w-40">
          {SCREENS?.slice(0, -1).map((item, key) => {
            return (
              <div
                key={key}
                className={`relative items-start justify-start w-full h-fit flex flex-row gap-2.5 mb-6 ${
                  item !== screen && "opacity-60"
                }`}
              >
                {(!expand || (expand && screen !== SCREENS[1])) && (
                  <div className="hidden relative w-fit h-fit tablet:flex items-center justify-center">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      {item == screen && (
                        <Image
                          draggable={false}
                          layout="fill"
                          objectFit="contain"
                          src={`${INFURA_GATEWAY}QmShDz8mrGpL6bythi9dwfKGAhFRUGwdn7mzKB8WjLorb5`}
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="relative w-full h-fit flex items-start justify-start flex-col gap-1.5">
                  {(!expand || (expand && screen !== SCREENS[1])) && (
                    <div
                      className="relative w-fit h-fit flex text-sm tablet:text-xl cursor-pointer hover:opacity-70"
                      onClick={() => setScreen(item)}
                    >
                      <div className="relative w-fit h-fit text-white whitespace-nowrap text-left uppercase">
                        {item?.title}
                      </div>
                      <div className="absolute left-0.5 top-0.5 whitespace-nowrap text-left w-fit h-fit text-lemon uppercase">
                        {item?.title}
                      </div>
                    </div>
                  )}
                  {item == screen &&
                  (!expand || (expand && screen !== SCREENS[1])) ? (
                    <>
                      <div
                        className={`tablet:hidden flex relative w-8 h-8 cursor-pointer hover:opacity-70`}
                        onClick={() => setScreen(item)}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}QmUe9sEBFHyL32Q3aNqL9fc1pE7QJYVZn6QnKpkBCSygsB`}
                          draggable={false}
                          layout="fill"
                          alt="icon"
                        />
                      </div>
                      <div className="hidden relative w-full h-20 tablet:flex overflow-y-scroll p-2 border border-sea rounded-lg bg-rose text-left text-white text-xs">
                        {item?.description}
                      </div>
                    </>
                  ) : (
                    <div
                      className={`relative w-8 h-8 cursor-pointer hover:opacity-70`}
                      title={item.title}
                      onClick={() => setScreen(item)}
                    >
                      <Image
                        src={`${INFURA_GATEWAY}QmUe9sEBFHyL32Q3aNqL9fc1pE7QJYVZn6QnKpkBCSygsB`}
                        draggable={false}
                        layout="fill"
                        alt="icon"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative h-full w-full max-w-[800px] flex flex-col items-center justify-start">
          <div className="relative w-full h-full bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 overflow-hidden">
            <div className="relative w-full h-12 flex items-center justify-between px-4 border-b border-white/10">
              <div className="text-white text-sm">
                {screen?.title || "OmniPredict"}
              </div>
            </div>
            
            <div className="relative w-full h-[calc(100%-3rem)] overflow-y-auto">
              <div className="relative w-full h-full p-4">
                <ScreenSwitch
                  gifOpen={context?.gifOpen!}
                  handleDecryptAiDetails={handleDecryptAiDetails}
                  decryptAiDetailsLoading={decryptAiDetailsLoading}
                  screen={screen}
                  setPostLive={context?.setPostLive!}
                  aiDetails={context?.aiDetails!}
                  expand={expand}
                  lensAccount={context?.lensAccount}
                  setExpand={setExpand}
                  setGifOpen={context?.setGifOpen!}
                  setImageView={context?.setImageView!}
                  lensClient={context?.lensClient!}
                  setScreen={setScreen}
                  currentSession={context?.currentSession!}
                  setCurrentSession={context?.setCurrentSession!}
                  setIndexer={context?.setIndexer!}
                  setNotification={context?.setNotification!}
                  setSignless={context?.setSignless!}
                  storageClient={context?.storageClient!}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-full flex-none w-32 tablet:w-40" />
      </div>
    </div>
  );
}
