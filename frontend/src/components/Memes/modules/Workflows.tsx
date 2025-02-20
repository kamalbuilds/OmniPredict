import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { WorkflowsProps } from "../types/memes.types";

const Workflows: FunctionComponent<WorkflowsProps> = ({
  userMemes,
  setChosenUserMeme,
  chosenUserMeme,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-row gap-5 items-start justify-between">
      <div className="relative w-fit h-full flex overflow-y-scroll">
        <div className="relative w-12 h-fit flex flex-col gap-2 items-start justify-start">
          {userMemes?.map((user, key) => {
            return (
              <div
                className="cursor-pointer hover:opacity-70 relative flex w-full h-12 items-center justify-center rounded-md"
                key={key}
                onClick={() => setChosenUserMeme(user)}
              >
                <Image
                  src={`${INFURA_GATEWAY}${
                    user?.metadata?.image?.split("ipfs://")?.[1]
                  }`}
                  draggable={false}
                  objectFit="cover"
                  className="rounded-md"
                  layout="fill"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center justify-between flex-col gap-3">
        <div className="relative w-fit h-full items-start gap-2 justify-start flex flex-row text-left">
          <div className="relative w-fit h-fit flex text-lg">
            {chosenUserMeme?.name}
          </div>
          <div className="relative w-fit h-fit flex text-2xl">
            {`(${chosenUserMeme?.symbol})`}
          </div>
        </div>
        <div className="relative w-fit h-fit flex">
          <div className="relative flex w-40 h-40 rounded-md">
            <Image
              src={`${INFURA_GATEWAY}${
                chosenUserMeme?.metadata?.image?.split("ipfs://")?.[1]
              }`}
              draggable={false}
              className="rounded-md"
              objectFit="cover"
              layout="fill"
            />
          </div>
        </div>
        <div className="relative w-full h-full items-start gap-2 justify-between flex flex-wrap text-center text-xs">
          <div className="relative w-fit h-fit flex flex-col gap-1 items-center justify-center">
            <div className="relative w-full h-fit flex text-center">
              {" "}
              Initial Supply
            </div>
            <div className="relative w-full h-fit flex text-center">
              {Number(chosenUserMeme?.initialSupply) / 10 ** 18}
            </div>
          </div>
          <div className="relative w-fit h-fit flex flex-col gap-1 items-center justify-center">
            <div className="relative w-full h-fit flex text-center">
              {" "}
              Max Supply
            </div>
            <div className="relative w-full h-fit flex text-center">
              {Number(chosenUserMeme?.maxSupply) / 10 ** 18}
            </div>
          </div>
          <div className="relative w-fit h-fit flex flex-col gap-1 items-center justify-center">
            <div className="relative w-full h-fit flex text-center">
              {" "}
              Total Supply
            </div>
            <div className="relative w-full h-fit flex text-center">
              {Number(chosenUserMeme?.totalSupply) / 10 ** 18}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-1 items-start justify-start">
          <div className="relative w-fit h-fit flex text-left">Lore</div>
          <div className="relative w-full text-xs h-fit flex max-h-40 overflow-y-scroll text-left">
            {chosenUserMeme?.metadata?.lore}
          </div>
        </div>
        <div
          className="relative w-full h-fit flex cursor-pointer bg-gris/70 rounded-md border border-ocean break-all text-xs p-1 justify-center items-center text-center"
          onClick={() =>
            window.open(
              `https://block-explorer.testnet.lens.dev/address/${chosenUserMeme?.token}`
            )
          }
        >
          {chosenUserMeme?.token}
        </div>

        <div className="relative w-full h-fit flex flex-col gap-2 text-center items-center justify-start pt-6">
          <div className="relative text-sm text-center w-full h-fit flex text-sm">
            Livepeer Worfklows
          </div>
          <div className="relative w-full text-xxs h-fit flex overflow-y-scroll text-left">
            coming soon..
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflows;
