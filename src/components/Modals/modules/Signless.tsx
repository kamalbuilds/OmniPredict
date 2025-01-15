import { FunctionComponent, JSX } from "react";
import useSignless from "../hooks/useSignless";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { SignlessProps } from "../types/modals.types";

const Signless: FunctionComponent<SignlessProps> = ({
  lensAccount,
  setSignless,
}): JSX.Element => {
  const { signlessLoading, handleSignless } = useSignless(
    lensAccount,
    setSignless
  );
  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer items-center justify-center"
      onClick={() => setSignless(false)}
    >
      <div
        className="w-96 h-fit text-sm text-white flex items-center justify-start p-3 cursor-default flex-col gap-10 border border-viol bg-sea rounded-md "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-fit pb-3 h-fit flex items-center justify-center uppercase text-center">
          Enable Signless Transactions
        </div>
        <div className="relative flex w-full justify-center h-fit">
          <div
            className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 ${
              !signlessLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() => !signlessLoading && handleSignless()}
          >
            <div className="absolute top-0 left-0 flex w-28 h-8">
              <Image
                src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                layout="fill"
                objectFit="fill"
                draggable={false}
              />
            </div>
            {signlessLoading ? (
              <div className="relative w-4 h-4 animate-spin flex">
                <Image
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                />
              </div>
            ) : (
              <div className="relative flex w-fit h-fit font-digi">Enable</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signless;
