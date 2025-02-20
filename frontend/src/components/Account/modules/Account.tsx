import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import useUpdateAccount from "../hooks/useUpdateAccount";
import { AppContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/lib/constants";
import { createPublicClient, http } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { useAccount } from "wagmi";

const Account: FunctionComponent = (): JSX.Element => {
  const context = useContext(AppContext);
  const publicClient = createPublicClient({
    chain: chains.testnet,
    transport: http("https://rpc.testnet.lens.dev"),
  });
  const { address } = useAccount();
  const {
    updatedAccount,
    setUpdatedAccount,
    handleUpdateAccount,
    updateLoading,
    aiLoading,
    handleSetAIDetails,
    modelOpenAiOpen,
    setModelOpenAiOpen,
    modelClaudeOpen,
    setModelClaudeOpen,
  } = useUpdateAccount(
    context?.lensAccount,
    context?.storageClient!,
    context?.setLensAccount!,
    context?.aiDetails!,
    publicClient,
    address,
    context?.setNotification!
  );
  return (
    <div className="relative w-full h-full flex items-start justify-start flex-col gap-4 pb-10">
      <div className="relative w-full h-full flex flex-col gap-3 items-center justify-center  overflow-y-scroll rounded-md bg-white p-2 border-2 border-sea">
        <div className="relative w-full h-full flex flex-col gap-3">
          <div className="relative w-full h-40 flex">
            <label
              className="relative w-full h-full flex items-center justify-center border border-ocean cursor-pointer bg-ocean"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {updatedAccount?.cover && (
                <Image
                  src={
                    updatedAccount.cover instanceof Blob
                      ? URL.createObjectURL(updatedAccount.cover)
                      : `${INFURA_GATEWAY}${
                          (updatedAccount.cover || "")?.split("ipfs://")?.[1]
                        }`
                  }
                  objectFit="cover"
                  layout="fill"
                  draggable={false}
                />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg"
                hidden
                required
                id="files"
                multiple={false}
                name="cover"
                disabled={updateLoading}
                onChange={(e) => {
                  e.stopPropagation();
                  if (!e.target.files || e.target.files.length === 0) return;
                  setUpdatedAccount({
                    ...updatedAccount,
                    cover: e?.target?.files?.[0],
                  });
                }}
              />
            </label>
            <div className="absolute bottom-2 left-2 items-center justify-center flex w-fit h-fit">
              <label
                className="relative w-14 rounded-full h-14 flex items-center justify-center border border-ocean  bg-ocean cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {updatedAccount?.pfp && (
                  <Image
                    src={
                      updatedAccount.pfp instanceof Blob
                        ? URL.createObjectURL(updatedAccount.pfp)
                        : `${INFURA_GATEWAY}${
                            (updatedAccount.pfp || "")?.split("ipfs://")?.[1]
                          }`
                    }
                    objectFit="cover"
                    layout="fill"
                    draggable={false}
                    className="rounded-full"
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
                  disabled={updateLoading}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (!e.target.files || e.target.files.length === 0) return;
                    setUpdatedAccount({
                      ...updatedAccount,
                      pfp: e?.target?.files?.[0],
                    });
                  }}
                />
              </label>
            </div>
          </div>
          <div className="relative w-full h-fit flex items-start justify-start flex-col sm:flex-row gap-3 text-black">
            <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
              <div className="relative w-fit h-fit flex">Username</div>
              <input
                disabled={true}
                readOnly
                className="relative w-full h-8 border border-ocean focus:outline-none p-1 rounded-md"
                value={context?.lensAccount?.account?.username?.localName}
              />
            </div>
            <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
              <div className="relative w-fit h-fit flex">Display Name</div>
              <input
                disabled={updateLoading}
                onChange={(e) =>
                  setUpdatedAccount({
                    ...updatedAccount,
                    name: e.target.value,
                  })
                }
                className="relative w-full h-8 border border-ocean focus:outline-none p-1 rounded-md"
                value={updatedAccount?.name}
              />
            </div>
          </div>
          <div className="relative w-full h-full flex flex-col gap-1.5 items-start justify-start">
            <div className="relative w-fit h-fit flex">Bio</div>
            <textarea
              disabled={updateLoading}
              onChange={(e) =>
                setUpdatedAccount({
                  ...updatedAccount,
                  bio: e.target.value,
                })
              }
              className="relative w-full h-full overflow-y-scroll border border-ocean focus:outline-none p-1 rounded-md"
              value={updatedAccount?.bio}
              style={{
                resize: "none",
              }}
            ></textarea>
          </div>
          <div className="relative flex w-full h-fit">
            <div
              className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 ${
                !updateLoading && "cursor-pointer active:scale-95"
              }`}
              onClick={() => !updateLoading && handleUpdateAccount()}
            >
              <div className="absolute top-0 left-0 flex w-28 h-8">
                <Image
                  src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                  layout="fill"
                  objectFit="fill"
                  draggable={false}
                />
              </div>
              {updateLoading ? (
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
                  Update
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-2">
          <div className="relative w-full h-fit flex flex-row items-start justify-between gap-4">
            <div className="relative w-full h-fit flex items-start justify-start flex-col gap-3">
              <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                <div className="relative w-fit h-fit flex">Open AI Key</div>
                <input
                  disabled={aiLoading}
                  className="relative w-full h-8 border border-ocean focus:outline-none p-1 rounded-md"
                  value={context?.aiDetails?.data?.openAikey}
                  onChange={(e) =>
                    context?.setAiDetails?.({
                      ...(context?.aiDetails || {}),
                      data: {
                        ...((context?.aiDetails || {})?.data as any),
                        openAikey: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                <div className="relative w-fit h-fit flex">Open AI Model</div>
                <div
                  className="relative w-full h-8 border cursor-pointer border-ocean p-1 rounded-md"
                  onClick={() => setModelOpenAiOpen(!modelOpenAiOpen)}
                >
                  {context?.aiDetails?.data?.modelOpenAi}
                </div>
                {modelOpenAiOpen && (
                  <div className="absolute top-16 z-20 w-full h-fit flex items-start justify-start flex-col bg-white rounded-x-md rounded-b-md border-b border-x border-ocean">
                    {[
                      "chatgpt-4o-latest",
                      "gpt-4o-mini-2024-07-18",
                      "o1-mini-2024-09-12",
                      "o1-2024-12-17",
                    ]
                      .filter(
                        (f) => f !== context?.aiDetails?.data?.modelOpenAi
                      )
                      .map((model, key) => {
                        return (
                          <div
                            onClick={() => {
                              context?.setAiDetails?.({
                                ...(context?.aiDetails || {}),
                                data: {
                                  ...((context?.aiDetails || {})?.data as any),
                                  modelOpenAi: model,
                                },
                              });

                              setModelOpenAiOpen(false);
                            }}
                            className="relative cursor-pointer hover:opacity-70 px-1 py-px w-full h-fit cursor-pointer flex"
                            key={key}
                          >
                            {model}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
              <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                <div className="relative w-fit h-fit flex">
                  Custom Instructions OpenAi
                </div>
                <textarea
                  disabled={aiLoading}
                  className="relative w-full h-20 overflow-y-scroll border border-ocean focus:outline-none p-1 rounded-md"
                  value={context?.aiDetails?.data?.instructionsOpenAi}
                  onChange={(e) =>
                    context?.setAiDetails?.({
                      ...(context?.aiDetails || {}),
                      data: {
                        ...((context?.aiDetails || {})?.data as any),
                        instructionsOpenAi: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="relative w-full h-fit flex items-start justify-start flex-col gap-3">
              <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                <div className="relative w-fit h-fit flex">Claude Key</div>
                <input
                  disabled={aiLoading}
                  className="relative w-full h-8 border border-ocean focus:outline-none p-1 rounded-md"
                  value={context?.aiDetails?.data?.claudekey}
                  onChange={(e) =>
                    context?.setAiDetails?.({
                      ...(context?.aiDetails || {}),
                      data: {
                        ...((context?.aiDetails || {})?.data as any),
                        claudekey: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                <div className="relative w-fit h-fit flex">Claude Model</div>
                <div
                  className="relative w-full h-8 border cursor-pointer border-ocean p-1 rounded-md"
                  onClick={() => setModelClaudeOpen(!modelClaudeOpen)}
                >
                  {context?.aiDetails?.data?.modelClaude}
                </div>
                {modelClaudeOpen && (
                  <div className="absolute top-16 z-20 w-full h-fit flex items-start justify-start flex-col bg-white rounded-x-md rounded-b-md border-b border-x border-ocean">
                    {[
                      "claude-3-5-sonnet-latest",
                      "claude-3-5-haiku-latest",
                      "claude-3-opus-latest",
                    ]
                      .filter(
                        (f) => f !== context?.aiDetails?.data?.modelClaude
                      )
                      .map((model, key) => {
                        return (
                          <div
                            onClick={() => {
                              context?.setAiDetails?.({
                                ...(context?.aiDetails || {}),

                                data: {
                                  ...((context?.aiDetails || {})?.data as any),
                                  modelClaude: model,
                                },
                              });

                              setModelClaudeOpen(false);
                            }}
                            className="relative cursor-pointer hover:opacity-70 px-1 py-px w-full h-fit cursor-pointer flex"
                            key={key}
                          >
                            {model}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
              <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                <div className="relative w-fit h-fit flex">
                  Custom Instructions Claude
                </div>
                <textarea
                  disabled={aiLoading}
                  className="relative w-full h-20 overflow-y-scroll border border-ocean focus:outline-none p-1 rounded-md"
                  value={context?.aiDetails?.data?.instructionsClaude}
                  onChange={(e) =>
                    context?.setAiDetails?.({
                      ...(context?.aiDetails || {}),
                      data: {
                        ...((context?.aiDetails || {})?.data as any),
                        instructionsClaude: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 ${
              !aiLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() => !aiLoading && handleSetAIDetails()}
          >
            <div className="absolute top-0 left-0 flex w-28 h-8">
              <Image
                src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                layout="fill"
                objectFit="fill"
                draggable={false}
              />
            </div>
            {aiLoading ? (
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
                Set AI Config
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
