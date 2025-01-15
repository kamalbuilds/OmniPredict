import { INFURA_GATEWAY, SCREENS } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { AiChoice, ChatProps } from "../types/session.types";

export const Chat: FunctionComponent<ChatProps> = ({
  sendToAgent,
  content,
  setContent,
  agentLoading,
  aiDetails,
  setScreen,
  aiChoice,
  setAiChoice,
  handleDecryptAiDetails,
  decryptAiDetailsLoading,
}): JSX.Element => {
  return (
    <div className="relative flex w-full h-fit flex-col gap-2">
      <div className="relative w-full h-fit flex items-center justify-center gap-2 flex-row">
        <div className="relative w-fit h-fit flex">
          <div
            className={`relative bg-white border-white border rounded-full w-6 h-6 flex cursor-pointer ${
              aiChoice !== AiChoice.Claude && "opacity-50"
            }`}
            onClick={() => setAiChoice(AiChoice.Claude)}
          >
            <Image
              className="rounded-full"
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}QmTuKtwamN9CwRKYDHZHo52TPpe59tbvQ2yEjvLAY9qUGS`}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit flex">
          <div
            className={`relative bg-white border-white border rounded-full w-6 h-6 flex cursor-pointer ${
              aiChoice !== AiChoice.OpenAi && "opacity-50"
            }`}
            onClick={() => setAiChoice(AiChoice.OpenAi)}
          >
            <Image
              className="rounded-full"
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}QmZMqF6RR3CVjxYc4NT9Vp8HW1V7sMUtudPVjDfpyGQow4`}
            />
          </div>
        </div>
      </div>
      <div className="relative w-full h-40 rounded-md border border-sea bg-gris text-black text-sm p-2 flex flex-col gap-2 items-start justify-between">
        <div
          className={`"relative w-full items-center justify-center h-fit font-digi flex text-left ${
            ((aiChoice == AiChoice.Claude && !aiDetails?.data?.claudekey) ||
              (aiChoice == AiChoice.OpenAi && !aiDetails?.data?.openAikey)) &&
            !aiDetails?.decrypted &&
            "cursor-pointer"
          }`}
          onClick={() =>
            aiDetails?.json && !aiDetails?.decrypted
              ? handleDecryptAiDetails()
              : !aiDetails?.decrypted &&
                ((aiChoice == AiChoice.Claude && !aiDetails?.data?.claudekey) ||
                  (aiChoice == AiChoice.OpenAi && !aiDetails?.data?.openAikey))
              ? setScreen(SCREENS[SCREENS.length - 1])
              : () => {}
          }
        >
          {(aiDetails?.data?.openAikey && aiChoice == AiChoice.OpenAi) ||
          (aiDetails?.data?.claudekey && aiChoice == AiChoice.Claude) ? (
            "Message your mirror agent"
          ) : !aiDetails?.decrypted && !aiDetails?.json ? (
            "Set your API key here to message your mirror agent"
          ) : decryptAiDetailsLoading ? (
            <div className="relative w-4 h-4 animate-spin flex">
              <Image
                layout="fill"
                objectFit="cover"
                draggable={false}
                src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
              />
            </div>
          ) : (
            "Decrypt your API key"
          )}
        </div>
        <textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          style={{
            resize: "none",
          }}
          className="relative w-full h-full bg-gris focus:outline-none"
        />
        <div className="relative w-full h-fit flex items-end justify-end">
          <div className="relative w-fit h-fit flex">
            {agentLoading ? (
              <div className="relative w-5 h-5 animate-spin flex">
                <Image
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                />
              </div>
            ) : (
              <div
                className="relative w-5 h-5 flex cursor-pointer hover:opacity-70"
                onClick={() => !agentLoading && sendToAgent()}
              >
                <Image
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmQGUgUcyd2Hv8XEvEQr55BJqo9Fj8U5T9qasV7wpjv24z`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
