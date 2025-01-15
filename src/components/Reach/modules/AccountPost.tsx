import { FunctionComponent, JSX } from "react";
import { AccountPostProps } from "../types/reach.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const AccountPost: FunctionComponent<AccountPostProps> = ({
  postContent,
  postLoading,
  handlePost,
  setGifOpen,
  setPostContent,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-start justify-start bg-white rounded-md p-1">
      <div className="relative w-full h-fit flex items-end justify-start bg-[#212121] p-1 flex-col gap-2">
        <div className="relative w-full h-28 flex p-1 rounded-md bg-[#2F2F2F]">
          <textarea
            style={{
              resize: "none",
            }}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="relative w-full h-full flex p-1 rounded-lg border border-viol bg-dBlue p-6 h-32 overflow-y-scroll text-sun text-sm"
          />
        </div>
        <div className="relative flex w-full justify-end h-fit">
          <div className="relative w-fit h-fit flex items-center justify-center gap-1">
            <div className="relative flex w-fit h-fit">
              <div
                className="relative w-6 h-6 flex cursor-pointer"
                onClick={() =>
                  setGifOpen({
                    id: "post-reach",
                    gif: "",
                    open: true,
                  })
                }
              >
                <Image
                  layout="fill"
                  objectFit="contain"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmXYPrKHmVeou3eAReLqKmdb1VVEMy8LRojyQcNXytqqKS`}
                />
              </div>
            </div>
            <div className="relative flex w-fit h-fit">
              <div className="relative w-28 h-8 flex">
                <Image
                  layout="fill"
                  objectFit="contain"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmQvkQrD3dkkLXTMoVz8NW9bpzvv9gtLLm4yYzfBfhqK82`}
                />
              </div>
            </div>
          </div>
          <div
            className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
            onClick={() => !postLoading && handlePost}
          >
            <div className="absolute top-0 left-0 flex w-28 h-8">
              <Image
                src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                layout="fill"
                objectFit="fill"
                draggable={false}
              />
            </div>
            {postLoading ? (
              <div className="relative w-4 h-4 animate-spin flex">
                <Image
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                />
              </div>
            ) : (
              <div className="relative flex w-fit h-fit font-digi">POST</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPost;
