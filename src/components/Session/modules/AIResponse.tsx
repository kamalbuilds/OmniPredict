import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { AIResponseProps } from "../types/session.types";

export const AIResponse: FunctionComponent<AIResponseProps> = ({
  agentChat,
}): JSX.Element => {
  return (
    <div className="font-digi text-sm text-electric relative w-full h-80 md:h-56 flex flex-col items-center justify-start border border-white rounded-lg bg-black/70 gap-6 p-1.5">
      <div className="relative w-full h-fit flex flex-col gap-1.5 items-center justify-center">
        <div className="relative w-fit h-fit flex">
          <div className="relative rounded-full border-2 border-sea bg-sea flex w-8 h-8">
            <Image
              className="rounded-full"
              draggable={false}
              layout="fill"
              objectFit="cover"
              src={`${INFURA_GATEWAY}QmUxrPy8iQVHgBE2KVzavqX2S3UNijnjgje8Qob6gA8qEg`}
            />
          </div>
        </div>
        <div className="relative text-xs text-center flex w-fit h-fit">
          Every story starts somewhere. What inspired this save?
        </div>
        <div className="relative w-fit h-fit flex">***</div>
      </div>
      <div className="relative w-full h-full flex gap-6 flex-col items-start justify-start overflow-y-scroll">
        {agentChat?.map((item, key) => {
          return (
            <div
              className={`relative w-full h-fit flex text-left text-xs whitespace-noline ${
                typeof item == "string"
                  ? "text-white text-right justify-end items-end"
                  : "text-left justify-start items-start"
              }`}
              key={key}
            >
              <div
                className="relative w-fit h-fit flex"
                dangerouslySetInnerHTML={{
                  __html:
                    (typeof item == "string" ? item : item?.content) || "",
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIResponse;
