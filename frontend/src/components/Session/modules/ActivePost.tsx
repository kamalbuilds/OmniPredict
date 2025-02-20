import { FunctionComponent, JSX } from "react";
import { ActivePostProps } from "../types/session.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, SCREENS } from "@/lib/constants";
import { Post } from "@lens-protocol/client";
import moment from "moment";
import MetadataSwitch from "@/components/Feed/modules/MetadataSwitch";

export const ActivePost: FunctionComponent<ActivePostProps> = ({
  post,
  setScreen,
}): JSX.Element => {
  return (
    <div className="relative flex w-full h-fit">
      <div
        className={`relative flex w-full flex items-start justify-start flex-row gap-3 overflow-y-scroll ${
          !post ? "h-44" : "max-h-44 h-fit"
        }`}
      >
        {!post ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="relative w-fit h-fit flex text-sm text-black text-center cursor-pointer"
              onClick={() => setScreen?.(SCREENS[0])}
            >
              Start a session? Choose a Post on the lines.
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full items-start justify-between rounded-md flex flex-col gap-2">
            <div className="relative w-full h-fit px-1.5 py-1 flex items-center justify-between flex-row gap-2">
              <div className="relative w-fit h-fit flex flex-row gap-1  items-center justify-center">
                <div className="relative w-fit h-fit flex items-center justify-center">
                  <div className="w-4 h-4 flex relative flex items-center justify-center rounded-full bg-dark shadow-sm">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                      draggable={false}
                      src={`${INFURA_GATEWAY}${
                        (post as Post)?.author?.metadata?.picture?.split(
                          "ipfs://"
                        )?.[1]
                      }`}
                    />
                  </div>
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center text-black text-xxs">
                  @
                  {Number((post as Post)?.author?.username?.localName?.length) <
                  6
                    ? (post as Post)?.author?.username?.localName
                    : (post as Post)?.author?.username?.localName?.slice(0, 6) +
                      "..."}
                </div>
              </div>
              <div className="relative w-fit h-fit flex text-xxs text-black">
                {moment(`${(post as Post)?.timestamp}`).fromNow()}
              </div>
            </div>
            <MetadataSwitch
              metadata={(post as Post)?.metadata?.__typename!}
              data={(post as Post)?.metadata as any}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivePost;
